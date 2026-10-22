#include <JuceHeader.h>
#include "NativeSynth.h"
#include <cstring>
#include <functional>
#include <optional>
#include <vector>

namespace
{
    const juce::Colour background {0xff201a16};
    const juce::Colour panel      {0xff32271f};
    const juce::Colour highlight  {0xffe2af7a};

    // Squirrel native MIDI facade: only injected in the trusted, embedded Windows UI.
    // The normal browser build continues to use the standard Web MIDI API.
    constexpr const char* midiBridgeScript = R"JSMIDI(
(() => {
  const backend = window.__JUCE__ && window.__JUCE__.backend;
  if (!backend) return;
  const inputs = new Map(), outputs = new Map(), waiters = [];
  const access = {inputs, outputs, onstatechange: null};
  const emit = (action, detail = {}) =>
    backend.emitEvent('squirrel-midi-command', {action, ...detail});

  backend.addEventListener('squirrel-midi-ports', ports => {
    const liveInputs = new Set((ports.inputs || []).map(p => p.id));
    const liveOutputs = new Set((ports.outputs || []).map(p => p.id));
    for (const p of ports.inputs || []) {
      let port = inputs.get(p.id);
      if (!port) {
        port = {id:p.id, name:p.name, state:'connected', type:'input',
                connection:'closed', _listener:null};
        Object.defineProperty(port, 'onmidimessage', {
          get(){return this._listener;},
          set(fn){
            this._listener = fn;
            this.connection = fn ? 'open' : 'closed';
            emit('input', {id:fn ? this.id : ''});
          }
        });
        inputs.set(p.id, port);
      }
      port.name = p.name;
      port.state = 'connected';
    }
    for (const [id, port] of inputs) {
      if (!liveInputs.has(id)) {port.state = 'disconnected'; inputs.delete(id);}
    }
    for (const p of ports.outputs || []) {
      let port = outputs.get(p.id);
      if (!port) {
        port = {
          id:p.id, name:p.name, type:'output', state:'connected', connection:'open',
          _timers:new Set(),
          send(data, timestamp){
            const bytes=Array.from(data, value => Number(value)&255);
            const execute=()=>emit('send', {id:this.id, data:bytes});
            const delay=Number.isFinite(timestamp)?Math.max(0,timestamp-performance.now()):0;
            if (delay < 2) execute();
            else {
              const timer=setTimeout(()=>{this._timers.delete(timer);execute();},delay);
              this._timers.add(timer);
            }
          },
          clear(){
            for (const timer of this._timers) clearTimeout(timer);
            this._timers.clear();
          }
        };
        outputs.set(p.id, port);
      }
      port.name=p.name;
      port.state='connected';
    }
    for (const [id, port] of outputs) {
      if (!liveOutputs.has(id)) {port.clear();port.state='disconnected';outputs.delete(id);}
    }
    if (typeof access.onstatechange === 'function') access.onstatechange({port:null});
    while(waiters.length) waiters.shift()(access);
  });

  backend.addEventListener('squirrel-midi-message', payload => {
    const port=inputs.get(payload.id);
    if (port && port.state==='connected' && typeof port.onmidimessage==='function')
      port.onmidimessage({data:Uint8Array.from(payload.data || []),
                          receivedTime:performance.now(),target:port});
  });
  backend.addEventListener('squirrel-midi-error', payload => {
    console.warn('Native MIDI:',payload.message);
    if (typeof window.notify === 'function')
      window.notify('Native MIDI: '+payload.message,true);
  });

  // WebView2 can reject requestMIDIAccess even if Windows MIDI devices exist.
  // We expose compatible MIDIInput/MIDIOutput objects backed by JUCE instead.
  const request=()=>new Promise((resolve,reject)=>{
    const done=value=>{clearTimeout(timeout);resolve(value);};
    waiters.push(done);
    const timeout=setTimeout(()=>{
      const i=waiters.indexOf(done);if(i>=0)waiters.splice(i,1);
      reject(new Error('Native MIDI-apparaten reageren niet.'));
    },6000);
    emit('list');
  });
  Object.defineProperty(navigator, 'requestMIDIAccess',
                        {configurable:true, value:request});
  // The browser keeps its UI/sequencer. Only Bass/Lead/Chord sound generation
  // is redirected to the native JUCE AudioSource in the desktop build.
  window.squirrelNativeAudioSend = data =>
    backend.emitEvent('squirrel-synth-command', data);
})();
)JSMIDI";

    juce::WebBrowserComponent::Options browserOptions (
        std::function<void(juce::var)> midiCommand,
        std::function<void(juce::var)> synthCommand)
    {
        // ResourceProvider houdt de gedeelde HTML binnen de eigen applicatie.
        const auto dataDir = juce::File::getSpecialLocation (juce::File::userApplicationDataDirectory)
                                 .getChildFile ("SquirrelStudioDesktop")
                                 .getChildFile ("WebView2");
        dataDir.createDirectory();

        return juce::WebBrowserComponent::Options{}
            .withBackend (juce::WebBrowserComponent::Options::Backend::webview2)
            .withNativeIntegrationEnabled()
            .withUserScript (midiBridgeScript)
            .withEventListener ("squirrel-midi-command",
                [handler = std::move (midiCommand)] (juce::var event) {handler (std::move (event));})
            .withEventListener ("squirrel-synth-command",
                [handler = std::move (synthCommand)] (juce::var event) {handler (std::move (event));})
            .withWinWebView2Options (juce::WebBrowserComponent::Options::WinWebView2{}
                                        .withUserDataFolder (dataDir))
            .withResourceProvider ([] (const juce::String& requestedPath)
                  -> std::optional<juce::WebBrowserComponent::Resource>
            {
                if (requestedPath != "/" && requestedPath != "/index.html")
                    return std::nullopt;

                std::vector<std::byte> bytes (static_cast<size_t> (BinaryData::index_htmlSize));
                std::memcpy (bytes.data(), BinaryData::index_html, bytes.size());
                return juce::WebBrowserComponent::Resource {std::move (bytes), "text/html"};
            });
    }
}

class SquirrelMainComponent final : public juce::Component,
                                   private juce::MidiInputCallback,
                                   private juce::AsyncUpdater
{
public:
    SquirrelMainComponent() : browser (browserOptions (
        [this] (juce::var event) { handleMidiCommand (event); },
        [this] (juce::var event) { handleNativeSynthCommand (event); }))
    {
        setOpaque (true);
        addAndMakeVisible (browser);

        asioButton.setButtonText ("AUDIO / ASIO");
        asioButton.onClick = [this] { openAudioSettings(); };
        addAndMakeVisible (asioButton);

        toneButton.setButtonText ("TEST 440 Hz");
        toneButton.onClick = [this]
        {
            toneOn = !toneOn;
            nativeSynth.setTestTone (toneOn);
            toneButton.setButtonText (toneOn ? "STOP TEST" : "TEST 440 Hz");
        };
        addAndMakeVisible (toneButton);

        status.setText ("NATIVE AUDIO: kies Focusrite USB ASIO via AUDIO / ASIO", juce::dontSendNotification);
        status.setColour (juce::Label::textColourId, highlight);
        addAndMakeVisible (status);

        audioPlayer.setSource (&nativeSynth);
        const auto error = audioManager.initialise (0, 2, nullptr, true);
        if (error.isNotEmpty())
            status.setText ("Audio initialiseren mislukt: " + error, juce::dontSendNotification);
        audioManager.addAudioCallback (&audioPlayer);

        if (! juce::WebBrowserComponent::areOptionsSupported (browserOptions ([] (juce::var) {}, [] (juce::var) {})))
        {
            status.setText ("WebView2 ontbreekt; installeer de Microsoft Edge WebView2 Runtime.",
                            juce::dontSendNotification);
        }

        browser.goToURL (juce::WebBrowserComponent::getResourceProviderRoot());
        setSize (1600, 920);
    }

    ~SquirrelMainComponent() override
    {
        midiInput.reset();
        midiOutput.reset();
        cancelPendingUpdate();
        audioManager.removeAudioCallback (&audioPlayer);
        audioPlayer.setSource (nullptr);
    }

    void paint (juce::Graphics& graphics) override { graphics.fillAll (background); }

    void resized() override
    {
        auto bounds = getLocalBounds();
        auto bar = bounds.removeFromTop (44).reduced (10, 5);
        asioButton.setBounds (bar.removeFromLeft (145));
        bar.removeFromLeft (8);
        toneButton.setBounds (bar.removeFromLeft (120));
        bar.removeFromLeft (15);
        status.setBounds (bar);
        browser.setBounds (bounds);
    }

private:
    void handleNativeSynthCommand (const juce::var& data)
    {
        const auto action = data.getProperty ("action", {}).toString();
        SquirrelNativeAudio::Command cmd;
        const auto number = [] (const juce::var& object, const char* key, double fallback)
        {
            const auto value = object.getProperty (key, {});
            return value.isVoid() ? fallback : static_cast<double> (value);
        };
        const auto sound = data.getProperty ("patch", {});
        const auto wave = [] (const juce::String& name)
        {
            if (name == "pulse") return 1;
            if (name == "sine") return 2;
            if (name == "triangle") return 3;
            if (name == "square") return 4;
            return 0;
        };
        if (action == "on") cmd.type = SquirrelNativeAudio::Command::on;
        else if (action == "off") cmd.type = SquirrelNativeAudio::Command::off;
        else if (action == "pitch") cmd.type = SquirrelNativeAudio::Command::pitch;
        else if (action == "drum") cmd.type = SquirrelNativeAudio::Command::drum;
        else if (action == "mix") cmd.type = SquirrelNativeAudio::Command::mix;
        else if (action == "panic") cmd.type = SquirrelNativeAudio::Command::panic;
        else return;
        cmd.id = static_cast<uint64_t> (number (data, "id", 0));
        cmd.track = static_cast<int> (number (data, "track", 3));
        if (cmd.type == SquirrelNativeAudio::Command::on && (cmd.track < 3 || cmd.track > 5))
            return;
        if (cmd.type == SquirrelNativeAudio::Command::drum && (cmd.track < 0 || cmd.track > 2))
            return;
        cmd.note = static_cast<int> (number (data, "note", 60));
        cmd.velocity = static_cast<float> (number (data, "velocity", 100) / 127.0);
        cmd.cents = static_cast<float> (number (data, "cents", 0));
        cmd.drumPitch = static_cast<float> (number (data, "pitch", 0));
        cmd.level = static_cast<float> (number (data, "level", 1));
        auto& p = cmd.patch;
        p.wave1 = wave (sound.getProperty ("wave1", {}).toString());
        p.wave2 = wave (sound.getProperty ("wave2", {}).toString());
        p.subWave = wave (sound.getProperty ("subWave", {}).toString());
        p.subOctave = static_cast<int> (number (sound, "subOctave", -12));
        p.level1 = static_cast<float> (number (sound, "level1", .46));
        p.level2 = static_cast<float> (number (sound, "level2", .27));
        p.subLevel = static_cast<float> (number (sound, "subLevel", .0875));
        p.detune2 = static_cast<float> (number (sound, "detune2", 0));
        p.subDetune = static_cast<float> (number (sound, "subDetune", 0));
        p.pulseWidth = static_cast<float> (number (sound, "pulseWidth", .5));
        p.cutoff = static_cast<float> (number (sound, "cutoff", 4500));
        p.resonance = static_cast<float> (number (sound, "resonance", .7));
        p.attack = static_cast<float> (number (sound, "attack", .01));
        p.decay = static_cast<float> (number (sound, "decay", .2));
        p.sustain = static_cast<float> (number (sound, "sustain", .7));
        p.release = static_cast<float> (number (sound, "release", .2));
        p.trackGain = static_cast<float> (number (sound, "trackGain", 1));
        p.master = static_cast<float> (number (sound, "master", .75));
        p.pan = static_cast<float> (number (sound, "pan", 0));
        nativeSynth.submit (cmd, number (data, "delayMs", 0));
    }

    // MIDI callbacks originate from the Windows MIDI input thread. The bridge
    // only talks to WebView2 after switching to the JUCE message thread.
    void handleIncomingMidiMessage (juce::MidiInput*, const juce::MidiMessage& message) override
    {
        if (message.getRawDataSize() < 1 || message.getRawDataSize() > 3)
            return;
        {
            const juce::ScopedLock lock (midiQueueMutex);
            midiQueue.add (message);
        }
        triggerAsyncUpdate();
    }

    void handleAsyncUpdate() override
    {
        juce::Array<juce::MidiMessage> messages;
        {
            const juce::ScopedLock lock (midiQueueMutex);
            messages.swapWith (midiQueue);
        }
        for (const auto& message : messages)
        {
            juce::Array<juce::var> data;
            for (int i = 0; i < message.getRawDataSize(); ++i)
                data.add (static_cast<int> (message.getRawData()[i]));
            juce::var event (new juce::DynamicObject());
            event.getDynamicObject()->setProperty ("id", midiInputId);
            event.getDynamicObject()->setProperty ("data", juce::var (data));
            browser.emitEventIfBrowserIsVisible ("squirrel-midi-message", event);
        }
    }

    void sendMidiError (const juce::String& message)
    {
        juce::var event (new juce::DynamicObject());
        event.getDynamicObject()->setProperty ("message", message);
        browser.emitEventIfBrowserIsVisible ("squirrel-midi-error", event);
    }

    void handleMidiCommand (const juce::var& event)
    {
        const auto action = event.getProperty ("action", {}).toString();
        const auto id = event.getProperty ("id", {}).toString();
        if (action == "list")
        {
            juce::Array<juce::var> inputs, outputs;
            for (const auto& device : juce::MidiInput::getAvailableDevices())
            {
                juce::var port (new juce::DynamicObject());
                port.getDynamicObject()->setProperty ("id", device.identifier);
                port.getDynamicObject()->setProperty ("name", device.name);
                inputs.add (port);
            }
            for (const auto& device : juce::MidiOutput::getAvailableDevices())
            {
                juce::var port (new juce::DynamicObject());
                port.getDynamicObject()->setProperty ("id", device.identifier);
                port.getDynamicObject()->setProperty ("name", device.name);
                outputs.add (port);
            }
            juce::var result (new juce::DynamicObject());
            result.getDynamicObject()->setProperty ("inputs", juce::var (inputs));
            result.getDynamicObject()->setProperty ("outputs", juce::var (outputs));
            browser.emitEventIfBrowserIsVisible ("squirrel-midi-ports", result);
        }
        else if (action == "input")
        {
            if (id == midiInputId) return;
            midiInput.reset();
            midiInputId.clear();
            if (id.isNotEmpty())
            {
                midiInput = juce::MidiInput::openDevice (id, this);
                if (midiInput)
                {
                    midiInputId = id;
                    midiInput->start();
                }
                else sendMidiError ("Kan MIDI IN niet openen. Controleer je apparaat.");
            }
        }
        else if (action == "send")
        {
            if (id.isEmpty()) return;
            if (!midiOutput || midiOutputId != id)
            {
                midiOutput.reset();
                midiOutputId.clear();
                midiOutput = juce::MidiOutput::openDevice (id);
                if (!midiOutput)
                {
                    sendMidiError ("Kan MIDI OUT niet openen. Controleer je apparaat.");
                    return;
                }
                midiOutputId = id;
            }
            const auto payload = event.getProperty ("data", {});
            const auto* bytes = payload.getArray();
            if (!bytes || bytes->size() < 1 || bytes->size() > 3) return;
            juce::uint8 data[3] {};
            for (int i = 0; i < bytes->size(); ++i)
                data[i] = static_cast<juce::uint8> (juce::jlimit (0,255,
                    static_cast<int> (bytes->getUnchecked (i))));
            if ((data[0] & 0x80) == 0 || data[0] == 0xf0) return;
            midiOutput->sendMessageNow (juce::MidiMessage (data,bytes->size()));
        }
    }

    void openAudioSettings()
    {
        auto* selector = new juce::AudioDeviceSelectorComponent (audioManager,
                                                                    0, 0,  // audio inputs (voorlopig niet gebruikt)
                                                                    0, 2,  // stereo outputs
                                                                    false, false, true, false);
        selector->setSize (650, 540);
        juce::DialogWindow::LaunchOptions options;
        options.dialogTitle = "Squirrel Studio - Focusrite / ASIO instellingen";
        options.dialogBackgroundColour = panel;
        options.content.setOwned (selector);
        options.componentToCentreAround = this;
        options.escapeKeyTriggersCloseButton = true;
        options.useNativeTitleBar = true;
        options.resizable = true;
        options.launchAsync();
    }

    juce::CriticalSection midiQueueMutex;
    juce::Array<juce::MidiMessage> midiQueue;
    juce::String midiInputId, midiOutputId;
    std::unique_ptr<juce::MidiInput> midiInput;
    std::unique_ptr<juce::MidiOutput> midiOutput;
    juce::AudioDeviceManager audioManager;
    SquirrelNativeAudio nativeSynth;
    juce::AudioSourcePlayer audioPlayer;
    juce::WebBrowserComponent browser;
    juce::TextButton asioButton, toneButton;
    juce::Label status;
    bool toneOn = false;
};

class SquirrelStudioApplication final : public juce::JUCEApplication
{
public:
    const juce::String getApplicationName() override    { return "Squirrel Studio Desktop"; }
    const juce::String getApplicationVersion() override { return "0.1.7"; }
    bool moreThanOneInstanceAllowed() override { return false; }

    void initialise (const juce::String&) override
    {
        window = std::make_unique<Window>();
    }

    void shutdown() override { window.reset(); }
    void systemRequestedQuit() override { quit(); }
    void anotherInstanceStarted (const juce::String&) override {}

private:
    class Window final : public juce::DocumentWindow
    {
    public:
        Window() : juce::DocumentWindow ("Squirrel Studio Desktop 0.1.7",
                                        juce::Colour (0xff171310),
                                        juce::DocumentWindow::allButtons)
        {
            setUsingNativeTitleBar (true);
            setContentOwned (new SquirrelMainComponent(), true);
            setResizable (true, true);
            setResizeLimits (1100, 680, 8192, 8192);
            // Fill the usable desktop area without covering the Windows taskbar.
            if (const auto* display = juce::Desktop::getInstance().getDisplays().getPrimaryDisplay())
                setBounds (display->userArea);
            else
                centreWithSize (getWidth(), getHeight());
            setVisible (true);
        }

        void closeButtonPressed() override { juce::JUCEApplication::getInstance()->systemRequestedQuit(); }
    };
    std::unique_ptr<Window> window;
};

START_JUCE_APPLICATION (SquirrelStudioApplication)