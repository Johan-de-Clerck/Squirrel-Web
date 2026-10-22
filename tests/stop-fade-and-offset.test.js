// Squirrel Studio 0.1.51 — transport fade and FX 9xx sample offset regression tests.
// Usage: node tests/stop-fade-and-offset.test.js (no npm or GitHub Actions).
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
let app=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(app);
app=app.replace(/installNotes\(\);bindings\(\);bindSampleEditor\(\);bindDrumSamples\(\);bindSampleBank\(\);attachStepRangeSelection\(\);resetUndoHistory\(\);renderAll\(\);refreshOutputs\(\);requestAnimationFrame\(uiTick\);bootstrapDemoJson\(\);/,'');
const run=new Function('window','document','localStorage','console','structuredClone','clearInterval',app+`
 const eq=(a,b,label)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(label+': '+JSON.stringify(a)+' ≠ '+JSON.stringify(b))};
 const close=(a,b,label)=>{if(Math.abs(a-b)>1e-6)throw Error(label+': '+a+' ≠ '+b)};
 eq(FX_OPTIONS.find(f=>f.id===9).label,'9 · Sample offset (%)','FX command option present');
 eq(fxAmountText(9,50),'50','9xx displays decimal');
 eq(fxAmountText(9,25),'25','9xx displays percentage');
 eq(fxAmountText(4,0x47),'47','previous FX remains hex');
 close(sampleOffsetFraction(9,50),.5,'950 = 50%');
 close(sampleOffsetFraction(9,25),.25,'925 = 25%');
 close(sampleOffsetFraction(1,50),0,'other FX do not shift samples');
 // Fake Web Audio signals; run real sample/drum source creation functions.
 const sources=[];
 const param=()=>({
  value:1,calls:[],
  setValueAtTime(v,t){this.value=v;this.calls.push(['set',v,t])},
  linearRampToValueAtTime(v,t){this.value=v;this.calls.push(['ramp',v,t])},
  exponentialRampToValueAtTime(v,t){this.value=v;this.calls.push(['exp',v,t])},
  cancelAndHoldAtTime(t){this.calls.push(['hold',t])},
  cancelScheduledValues(t){this.calls.push(['cancel',t])}
 });
 const node=()=>({gain:param(),pan:param(),frequency:param(),Q:param(),connect(dest){return dest},disconnect(){}});
 const makeSource=()=>{
  const src={playbackRate:param(),detune:param(),starts:[],stops:[],connect(dest){return dest},disconnect(){},
   start(...args){this.starts.push(args)},stop(t){this.stops.push(t)}};
  sources.push(src);return src;
 };
 const context={currentTime:10,createBufferSource:makeSource,createGain:node,createStereoPanner:node,createBiquadFilter:node};
 state=fresh(false);
 audio={ctx:context,trackGains:Array.from({length:TRACK_COUNT},node),cutoffBuses:Array.from({length:TRACK_COUNT},node)};
 attachFilterEnvelopes=()=>[];
 sampleBuffers.set(6,{duration:10});
 state.tracks[6].sampleRoot=48;state.tracks[6].sampleStart=.2;state.tracks[6].sampleEnd=.8;
 const sample=sampleVoice(6,48,100,10,0,.50),samplerSrc=sources[0];
 close(samplerSrc.starts[0][1],5,'Sample 50% offset within trim range 2-8s');
 close(samplerSrc.stops[0],13,'Non-looping sampler ends at trim end');
 eq(scheduledVoices.has(sample),true,'Sampler voice tracked');
 const drums=drumSlotKey(0,0);
 drumSampleBuffers.set(drums,{duration:8});state.drumSamples[0][0]={name:'long.wav',chokeGroup:0};
 const drum=drumSampleVoice(0,0,100,10,.5),drumSrc=sources[1];
 close(drumSrc.starts[0][1],4,'Drum sample starts at half duration');
 close(drumSrc.stops[0],14.01,'Drum sample remaining tail duration');
 eq(scheduledVoices.has(drum),true,'Drum voices tracked for STOP');
 // STOP must override previous note-off schedules, not skip released voices.
 sample.released=true;
 const oldStop=samplerSrc.stops[0],oldDrumStop=drumSrc.stops[0];
 const nativeLog=[];
 nativeVAMessage=(cmd,args)=>nativeLog.push(cmd);
 midiAllNotesOff=()=>{};
 renderSongPosition=()=>{};renderPlayhead=()=>{};stopEnterPreview=()=>{};
 view='mixer';
 playing=true;
 stopTransport();
 eq(playing,false,'Transport stops playback');
 eq(scheduledVoices.size,0,'All voices detached on stop');
 const now=context.currentTime,expected=now+STOP_FADE_SECONDS+.012;
 close(samplerSrc.stops.at(-1),expected,'Long sample stopped after 85 ms fade even if previously released');
 close(drumSrc.stops.at(-1),expected,'Drum sample stopped after 85 ms fade');
 if(!(samplerSrc.stops.at(-1)<oldStop&&drumSrc.stops.at(-1)<oldDrumStop))throw Error('Stop must override long tail');
 eq(sample.env.gain.calls.some(x=>x[0]==='ramp'&&x[1]===0),true,'Sample gain faded to zero');
 eq(drum.modGain.gain.calls.some(x=>x[0]==='ramp'&&x[1]===0),true,'Drum gain faded to zero');
 // STOP must also clear visual sample playback cursors and stale choke groups,
 // so the next PLAY starts from clean state.
 state.drumSamples[0][0].chokeGroup=2;
 const chokingDrum=drumSampleVoice(0,0,110,10,0);
 const cursorSample=sampleVoice(6,48,105,10,0,.25);
 eq(activeChokeVoices.has('0:2'),true,'Choke group tracks a playing drum');
 eq(samplePlaybacks.length>0,true,'Sample cursor record exists before STOP');
 playing=true;stopTransport();
 eq(activeChokeVoices.size,0,'STOP clears old drum choke groups');
 eq(samplePlaybacks.length,0,'STOP clears old sample cursor history');
 eq(sampleCursorPosition(6),null,'STOP leaves no stale waveform playhead');
 eq(scheduledVoices.size,0,'STOP stops restarted drum voice');
 const nextDrum=drumSampleVoice(0,0,105,10.2,0);
 eq(nextDrum.released,false,'Fresh drum voice after STOP is not released');
 eq(activeChokeVoices.get('0:2').size,1,'Fresh group contains only the restarted drum');
 // A step audition is not just a generic note preview: FX 950 changes start.
 state.selectedTrack=6;state.selectedStep=0;
 const step=state.patterns[0][6][0];
 step.on=true;step.note=48;step.velocity=95;step.fx=9;step.fxAmount=50;
 const oldSources=sources.length;
 playPreview(6,48,95,step);
 eq(sources.length,oldSources+1,'Step audition creates a sample voice');
 close(sources.at(-1).starts[0][1],5,'AUDITION honors FX 950 within trimmed sample');
 // Generic synth and sampler preview without a specific step remains at START.
 playPreview(6,48,95);
 close(sources.at(-1).starts[0][1],2,'Generic sample preview ignores unrequested step FX');
 // FX 9 and LOOP ON: valid loop markers must not be moved to the start offset.
 // Trim region is 2-8s, loop is 3-4s; a 10% offset starts at 2.6s.
 state.tracks[6].sampleLoop=true;
 state.tracks[6].loopStart=.3;state.tracks[6].loopEnd=.4;
 const normalLoop=samplePlaybackPlan(state.tracks[6],10,.10);
 close(normalLoop.startAt,2.6,'Offset inside loop seek');
 eq([normalLoop.loop,normalLoop.loopStart,normalLoop.loopEnd],[true,3,4],'Loop boundaries remain unchanged');
 const loopingVoice=sampleVoice(6,48,100,10,0,.10),loopSrc=sources.at(-1);
 eq(loopSrc.loop,true,'Looping sampler still loops for in-range sample offset');
 eq([loopSrc.loopStart,loopSrc.loopEnd],[3,4],'Valid loop markers reach AudioBufferSourceNode');
 close(loopSrc.starts[0][1],2.6,'Looping sample starts at desired offset');
 eq(loopSrc.stops.length,0,'Looping voice has no automatic end');
 // A 50% offset is at 5s, past LOOP END (4s). Respect 950 by
 // playing the trimmed tail once, not by generating invalid loopStart > loopEnd.
 const beyond=samplePlaybackPlan(state.tracks[6],10,.50);
 eq(beyond.loop,false,'Offset at or after LOOP END plays one-shot tail');
 close(beyond.startAt,5,'FX 950 still seeks to 50% with loop enabled');
 const afterLoopVoice=sampleVoice(6,48,100,10,0,.50),tailSrc=sources.at(-1);
 eq(!!tailSrc.loop,false,'Tail sample loop remains disabled');
 close(tailSrc.starts[0][1],5,'Tail begins at requested offset');
 close(tailSrc.stops.at(-1),13,'Tail voice ends at trimmed sample end');
 playing=true;stopTransport();
 eq(scheduledVoices.size,0,'Second STOP also fades all preview/restarted voices');
 const oldState=validate(JSON.parse(JSON.stringify(state)));
 oldState.patterns[0][6][0].on=true;oldState.patterns[0][6][0].fx=9;oldState.patterns[0][6][0].fxAmount=50;
 const loaded=validate(JSON.parse(JSON.stringify(oldState)));
 eq([loaded.patterns[0][6][0].fx,loaded.patterns[0][6][0].fxAmount],[9,50],'FX 950 survives save/load');
 return 'PASS: 9xx offset and LOOP markers, tail one-shot, step audition, STOP cleanup and project persistence';
`);
console.log(run({}, {getElementById:()=>({classList:{remove(){}}})},
 {getItem:()=>null,setItem:()=>{}},{warn:()=>{},error:()=>{},log:()=>{}},
 structuredClone,()=>{}));