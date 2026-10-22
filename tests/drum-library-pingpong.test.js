// Squirrel Studio 0.1.59: 15 shared drum library + actual Ping-Pong loops.
// Run: node tests/drum-library-pingpong.test.js
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert.ok(html.includes('id="drumLibraryList"'),'Library UI must exist');
assert.ok(html.includes('PING-PONG LOOP'),'Sample Editor must include Ping-Pong switch');
assert.ok(html.includes("actions.append(use,assign,edit,load,preview,clear)"),'Drum slot needs assignment and editor actions');
let app=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(app);
app=app.replace(/installNotes\(\);bindings\(\);bindSampleEditor\(\);bindDrumSamples\(\);bindSampleBank\(\);attachStepRangeSelection\(\);resetUndoHistory\(\);renderAll\(\);refreshOutputs\(\);requestAnimationFrame\(uiTick\);bootstrapDemoJson\(\);/,'');
const run=new Function('window','document','localStorage','console','structuredClone',app+`
 const eq=(a,b,label)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(label+': '+JSON.stringify(a)+' != '+JSON.stringify(b))};
 state=fresh(false);persist=()=>{};renderAll=()=>{};renderDrumSamples=()=>{};
 eq([state.version,state.drumLibrary.length,state.drumSamples[0].length],[23,15,5],'New project drum library schema');
 const fakeAudio='data:audio/wav;base64,AA==';
 state.drumLibrary[0]={name:'shared kick.wav',data:fakeAudio};
 const raw={length:8,sampleRate:8,numberOfChannels:2,
  getChannelData(channel){return Float32Array.from(channel?[10,11,12,13,14,15,16,17]:[0,1,2,3,4,5,6,7])}};
 drumLibraryBuffers.set(0,raw);
 assignDrumLibrary(0,0,0);assignDrumLibrary(1,3,0);
 eq([state.drumSamples[0][0].libraryIndex,state.drumSamples[1][3].libraryIndex],[0,0],'Two drum slots share one library source');
 eq(drumSlotSource(0,0).name,'shared kick.wav','Track 1 uses library sample');
 eq(drumSlotSource(1,3).name,'shared kick.wav','Track 2 uses same library sample');
 eq(drumSlotBuffer(0,0)===drumSlotBuffer(1,3),true,'Shared audio buffer has one cached instance');
 eq(hasDrumSamples(0)&&hasDrumSamples(1),true,'Drum routing recognizes assigned library samples');
 state.drumSamples[0][0].sampleStart=.1;state.drumSamples[1][3].sampleStart=.3;
 eq(state.drumSamples[0][0].sampleStart!==state.drumSamples[1][3].sampleStart,true,'Assigned slots keep independent edit markers');
 selectedSampleEditorTrack=1;selectedSampleEditorDrumSlot=3;
 eq([sampleEditorIsDrum(),sampleEditorItem()===state.drumSamples[1][3],sampleEditorBuffer()===raw],[true,true,true],'Sample Editor resolves selected drum slot and shared audio');
 const pp=state.drumSamples[0][0];pp.sampleStart=0;pp.sampleEnd=1;pp.loopStart=.25;pp.loopEnd=.75;pp.sampleLoop=true;pp.loopPingPong=true;
 const plan=samplePlaybackPlan(pp,1,0);
 eq([plan.loop,plan.pingPong,plan.loopStart,plan.loopEnd],[true,true,.25,.75],'Ping-pong playback plan uses original markers');
 audio={ctx:{createBuffer:(channels,length,sampleRate)=>{
  const data=Array.from({length:channels},()=>new Float32Array(length));
  return {length,sampleRate,numberOfChannels:channels,getChannelData:i=>data[i]};
 }}};
 const mirror=pingPongAudioBuffer(raw,.25,.75),same=pingPongAudioBuffer(raw,.25,.75);
 eq(mirror===same,true,'Mirrored buffers are cached by audio asset and loop region');
 eq(mirror.buffer.length,12,'Mirrored audio buffer extends by exactly one reverse loop segment');
 eq([...mirror.buffer.getChannelData(0)],[0,1,2,3,4,5,5,4,3,2,6,7],'Forward-backward segment is physically reversed');
 eq([...mirror.buffer.getChannelData(1)],[10,11,12,13,14,15,15,14,13,12,16,17],'Stereo right channel also reverses independently');
 eq([mirror.loopStart,mirror.loopEnd],[.25,1.25],'Loop endpoints match forward + reverse region');
 eq(samplePlaybackPlan({...pp,loopPingPong:false},1,.1).pingPong,false,'Normal LOOP ON still plays forward only');
 eq(samplePlaybackPlan(pp,1,.8).loop,false,'Offset beyond LOOP END is one-shot, not ping-pong');
 const exported=sampleBankSnapshot();
 eq([exported.version,exported.drumLibrary.length,exported.drumSamples[0][0].libraryIndex],[3,15,0],'Bank v3 exports library and slot assignments');
 const imported=validateSampleBank(JSON.parse(JSON.stringify(exported)));
 eq([imported.drumLibrary[0].name,imported.drums[1][3].libraryIndex,imported.drums[0][0].loopPingPong],['shared kick.wav',0,true],'Bank v3 roundtrip retains library mapping and loop settings');
 const saved=validate(JSON.parse(JSON.stringify(state)));
 eq([saved.drumLibrary[0].name,saved.drumSamples[1][3].libraryIndex],[ 'shared kick.wav',0 ],'Full project roundtrip retains library and mapping');
 const old=JSON.parse(JSON.stringify(state));old.version=22;delete old.drumLibrary;
 old.drumSamples[0][0]={name:'old kick',data:fakeAudio,chokeGroup:1};
 const migrated=validate(old);
 eq([migrated.drumLibrary.length,migrated.drumSamples[0][0].name,migrated.drumSamples[0][0].libraryIndex],[15,'old kick',null],'Pre-library projects retain direct loaded drum samples');
 return 'PASS: 15-slot library, assignments, editor, stereo Ping-Pong, export/import, old songs';
`);
console.log(run({}, {}, {getItem:()=>null,setItem:()=>{}},{warn:()=>{},log:()=>{},error:()=>{}},structuredClone));
