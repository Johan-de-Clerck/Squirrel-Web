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
 renderAll=()=>{};persist=()=>{};applyTrackMix=()=>{};midiOffTrack=()=>{};focusSelectedPad=()=>{};notify=()=>{};
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
 // Range Ctrl+C/V must paste the whole rectangular snapshot at a new anchor.
 state=fresh(false);
 state.pattern=0;
 state.patterns[0][0][2]={...makeStep(0),on:true,note:60,velocity:121,sampleSlot:3,fx:4,fxAmount:49};
 state.patterns[0][0][3]={...makeStep(0),on:false,note:61,fx:2,fxAmount:12};
 state.patterns[0][1][2]={...makeStep(1),on:true,note:64,fx:1,fxAmount:7};
 state.patterns[0][1][3]={...makeStep(1),on:false,note:65,fx:0,fxAmount:0};
 const original=structuredClone([state.patterns[0][0].slice(2,4),state.patterns[0][1].slice(2,4)]);
 stepRange={pattern:0,startTrack:0,endTrack:1,startStep:2,endStep:3};
 copySelectedStep();
 assertEq([stepClipboard.kind,stepClipboard.height,stepClipboard.width],['range',2,2],'Range clipboard dimensions');
 state.selectedTrack=4;state.selectedStep=10;clearStepRange();
 if(!pasteSelectedStep())throw Error('Multi-track range paste failed');
 assertEq([state.patterns[0][4].slice(10,12),state.patterns[0][5].slice(10,12)],original,'Rectangular paste preserves notes, blanks and FX');
 assertEq(state.patterns[0][0].slice(2,4),original[0],'Source steps unchanged after paste');
 // Snapshot survives changes to the source and can be pasted to other patterns.
 state.patterns[0][0][2].note=90;state.pattern=1;state.selectedTrack=2;state.selectedStep=5;
 if(!pasteSelectedStep())throw Error('Cross-pattern range paste failed');
 assertEq([state.patterns[1][2].slice(5,7),state.patterns[1][3].slice(5,7)],original,'Snapshot can be reused across patterns');
 // Destination tracks can have different lengths: no out-of-bounds writes.
 state.pattern=0;state.trackLengths[0][7]=11;state.selectedTrack=6;state.selectedStep=10;
 if(!pasteSelectedStep())throw Error('Clipped range paste failed');
 assertEq(state.patterns[0][6][10],original[0][0],'Clipped range starts at destination');
 assertEq(state.patterns[0][7][10],original[1][0],'Last track valid step preserved');
 // No selection = one step, retaining backward compatibility.
 clearStepRange();state.selectedTrack=0;state.selectedStep=2;copySelectedStep();
 assertEq([stepClipboard.kind,stepClipboard.width,stepClipboard.height],['single',1,1],'Single-step clipboard fallback');
 state.selectedTrack=3;state.selectedStep=20;pasteSelectedStep();
 assertEq(state.patterns[0][3][20].note,90,'Single step copied after range');
 function assertFresh(){assertEq(fresh(false).tracks.slice(6).map(t=>t.volume),[78,78],'Sampler default volumes')}
 function assertEq(actual,expected,label){if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error(label+': '+JSON.stringify(actual)+' vs '+JSON.stringify(expected))}
 return 'OK: 22 instrument, project, bank and range clipboard checks passed';
`);
console.log(run({}, {getElementById:()=>({disabled:false,textContent:''})}, {getItem:()=>null,setItem:()=>{}},
 {log:()=>{},warn:()=>{},error:()=>{}}, structuredClone));