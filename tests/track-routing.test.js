// Offline regression tests. Run: node tests/track-routing.test.js
// No npm dependencies and no GitHub Actions required.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
let app = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(app, 'Main application script exists');
app = app.replace(
 /installNotes\(\);bindings\(\);bindSampleEditor\(\);bindDrumSamples\(\);bindSampleBank\(\);attachStepRangeSelection\(\);resetUndoHistory\(\);renderAll\(\);refreshOutputs\(\);requestAnimationFrame\(uiTick\);bootstrapDemoJson\(\);/,
 '');
const run = new Function('window', 'document', 'localStorage', 'console', 'structuredClone', app + `
 renderAll=()=>{};persist=()=>{};applyTrackMix=()=>{};midiOffTrack=()=>{};
 assertFresh();
 const audioCalls=[];
 sampleVoice=(t)=>{audioCalls.push(['sample',t]);return {trackIndex:t}};
 drumSampleVoice=(t,slot)=>{audioCalls.push(['drum sample',t,slot]);return {drum:true}};
 oneShot=(type,track)=>{audioCalls.push(['drum synth',state.tracks.indexOf(track)]);return [{drum:true}]};
 synthVoice=(track,note)=>{audioCalls.push(['synth',state.tracks.indexOf(track),note]);return {trackIndex:state.tracks.indexOf(track)}};
 audio={ctx:{currentTime:0}};
 const types=['sample','sample','sample','sample','drum','drum','bass','lead'];
 types.forEach((kind,i)=>assignTrackKind(i,kind));
 assertEq(state.tracks.map(x=>x.trackKind),types,'Mixed instrument setup');
 for(let i=0;i<8;i++)playTrack(i,60,100,.01,null,0,'major',2);
 assertEq(audioCalls.map(a=>a[0]),['sample','sample','sample','sample','drum synth','drum synth','synth','synth'],'Engine dispatch');
 const restored=validate(JSON.parse(JSON.stringify(state)));
 assertEq(restored.tracks.map(x=>x.trackKind),types,'Project roundtrip');
 assertEq(restored.drumSamples.length,8,'Eight drum banks');
 const bank=validateSampleBank(sampleBankSnapshot());
 assertEq([bank.drums.length,bank.samplers.length],[8,8],'Sample bank v2');
 const oldBank=validateSampleBank({format:'squirrel-studio-sample-bank',version:1,drumSamples:Array.from({length:3},()=>Array.from({length:5},()=>({name:'',data:null}))),samplers:[null,null]});
 assertEq([oldBank.drums.length,oldBank.samplers.length],[8,8],'Sample bank v1 migration');
 types.forEach((_,i)=>assignTrackKind(i,'bass'));
 assertEq(state.tracks.filter(t=>t.trackKind==='bass').length,8,'Eight bass tracks');
 state.tracks[0].sound.cutoff=777;
 assignTrackKind(0,'lead');assignTrackKind(0,'bass');
 assertEq(state.tracks[0].sound.cutoff,777,'Synth patch preserved');
 types.forEach((_,i)=>assignTrackKind(i,'lead'));
 assertEq(state.tracks.filter(t=>t.trackKind==='lead').length,8,'Eight lead tracks');
 const legacy=JSON.parse(JSON.stringify(fresh(false)));legacy.version=20;
 for(const track of legacy.tracks)delete track.trackKind;
 legacy.tracks[6].volume=0;legacy.tracks[7].volume=0;
 const migrated=validate(legacy);
 assertEq(migrated.tracks.map(x=>x.trackKind),['drum','drum','drum','bass','lead','chord','sample','sample'],'Older project track migration');
 assertEq(migrated.tracks.slice(6).map(t=>t.volume),[78,78],'Older silent sampler migration');
 state.tracks[1].sampleRoot=69;
 assertEq(validate(JSON.parse(JSON.stringify(state))).tracks[1].sampleRoot,69,'Sample root is serialized');
 state.tracks[7].sampleName='Loop.wav';state.tracks[7].sampleData='data:audio/wav;base64,AAAA';
 assignTrackKind(7,'sample');assignTrackKind(7,'lead');assignTrackKind(7,'sample');
 assertEq([state.tracks[7].sampleName,state.tracks[7].sampleData],['Loop.wav','data:audio/wav;base64,AAAA'],'Sample retained through instrument switch');
 types.forEach((_,i)=>assignTrackKind(i,'drum'));
 assertEq(state.tracks.filter(t=>t.trackKind==='drum').length,8,'Eight drum tracks');
 function assertFresh(){assertEq(fresh(false).tracks.slice(6).map(t=>t.volume),[78,78],'Sampler default volumes')}
 function assertEq(actual,expected,label){if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error(label+': '+JSON.stringify(actual)+' vs '+JSON.stringify(expected))}
 return 'OK: 15 instrument, project, bank and patch checks passed';
`);
console.log(run({}, {}, {getItem:()=>null,setItem:()=>{}},
 {log:()=>{},warn:()=>{},error:()=>{}}, structuredClone));