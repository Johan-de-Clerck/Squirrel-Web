#include <JuceHeader.h>
#include <cstring>
#include <optional>
#include <vector>

namespace
{
    constexpr auto background = juce::Colour (0xff201a16);
    constexpr auto panel      = juce::Colour (0xff32271f);
    constexpr auto highlight  = juce::Colour (0xffe2af7a);

    juce::WebBrowserComponent::Options browserOptions()
    {
        // ResourceProvider houdt de gedeelde HTML binnen de eigen applicatie.
        const auto dataDir = juce::File::getSpecialLocation (juce::File::userApplicationDataDirectory)
                                 .getChildFile ("SquirrelStudioDesktop")
                                 .getChildFile ("WebView2");
        dataDir.createDirectory();

        return juce::WebBrowserComponent::Options{}
            .withBackend (juce::WebBrowserComponent::Options::Backend::webview2)
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

class SquirrelMainComponent final : public juce::Component
{
public:
    SquirrelMainComponent() : browser (browserOptions())
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
            testTone.setAmplitude (toneOn ? 0.10f : 0.0f);
            toneButton.setButtonText (toneOn ? "STOP TEST" : "TEST 440 Hz");
        };
        addAndMakeVisible (toneButton);

        status.setText ("NATIVE AUDIO: kies Focusrite USB ASIO via AUDIO / ASIO", juce::dontSendNotification);
        status.setColour (juce::Label::textColourId, highlight);
        addAndMakeVisible (status);

        testTone.setFrequency (440.0);
        testTone.setAmplitude (0.0f);
        audioPlayer.setSource (&testTone);
        const auto error = audioManager.initialise (0, 2, nullptr, true);
        if (error.isNotEmpty())
            status.setText ("Audio initialiseren mislukt: " + error, juce::dontSendNotification);
        audioManager.addAudioCallback (&audioPlayer);

        if (! juce::WebBrowserComponent::areOptionsSupported (browserOptions()))
        {
            status.setText ("WebView2 ontbreekt; installeer de Microsoft Edge WebView2 Runtime.",
                            juce::dontSendNotification);
        }

        browser.goToURL (juce::WebBrowserComponent::getResourceProviderRoot());
        setSize (1600, 920);
    }

    ~SquirrelMainComponent() override
    {
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

    juce::AudioDeviceManager audioManager;
    juce::ToneGeneratorAudioSource testTone;
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
    const juce::String getApplicationVersion() override { return "0.1.1"; }
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
        Window() : juce::DocumentWindow ("Squirrel Studio Desktop 0.1.1",
                                        juce::Colour (0xff171310),
                                        juce::DocumentWindow::allButtons)
        {
            setUsingNativeTitleBar (true);
            setContentOwned (new SquirrelMainComponent(), true);
            setResizable (true, true);
            setResizeLimits (1100, 680, 8192, 8192);
            centreWithSize (getWidth(), getHeight());
            setVisible (true);
            // Native maximized window uses the available desktop work area (taskbar respected).
            setMaximised (true);
        }

        void closeButtonPressed() override { juce::JUCEApplication::getInstance()->systemRequestedQuit(); }
    };
    std::unique_ptr<Window> window;
};

START_JUCE_APPLICATION (SquirrelStudioApplication)