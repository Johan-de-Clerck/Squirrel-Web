// Pattern expansion, migration and Enter key release tests.
// Run: node tests/pattern-bank-and-enter.test.js
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert.ok(html.includes('id="patternGroup"'),'grouped selector');
assert.ok(html.includes('audio-ready'),'green audio style');
assert.ok(!html.includes('id="stepEditorTitle"'),'step editor subtitle removed');
assert.ok(!html.includes('id="fxEditorTitle"'),'FX subtitle removed');
let app=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(app);
app=app.replace(/installNotes\(\);bindings\(\);bindSampleEditor\(\);bindDrumSamples\(\);bindSampleBank\(\);attachStepRangeSelection\(\);resetUndoHistory\(\);renderAll\(\);refreshOutputs\(\);requestAnimationFrame\(uiTick\);bootstrapDemoJson\(\);/,'');
const run=new Function('window','document','localStorage','console','structuredClone',app+`
 renderAll=()=>{};persist=()=>{};applyTrackMix=()=>{};midiOffTrack=()=>{};
 const eq=(a,b,name)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(name+': '+JSON.stringify(a)+' !== '+JSON.stringify(b));};
 eq(PATTERN_COUNT,32,'32 patterns');
 eq([defaultPatternName(0),defaultPatternName(7),defaultPatternName(8),defaultPatternName(15),defaultPatternName(16),defaultPatternName(24),defaultPatternName(31)],['A1','A8','B1','B8','C1','D1','D8'],'names A1-D8');
 const legacy=fresh(false);legacy.version=21;
 for(const key of ['patterns','patternLengths','trackLengths','patternNames'])legacy[key]=legacy[key].slice(0,16);
 legacy.patternNames=Array.from({length:16},(_,i)=>'Old '+i);
 legacy.pattern=15;legacy.songSequence=[0,4,7,8,15];legacy.songModeEnabled=true;
 legacy.patterns[4][2][0].on=true;legacy.patterns[4][2][0].note=87;legacy.trackLengths[4][2]=7;
 const migrated=validate(JSON.parse(JSON.stringify(legacy)));
 eq([migrated.patterns.length,migrated.pattern,migrated.songSequence],[32,27,[0,8,11,16,27]],'old song migration');
 eq([migrated.patterns[8][2][0].note,migrated.patternNames[8],migrated.trackLengths[8][2]],[87,'Old 4',7],'B1 pattern content preserved');
 eq([migrated.patternNames[4],migrated.patternNames[15],migrated.patternNames[31]],['A5','B8','D8'],'new slots empty with defaults');
 eq([validate(JSON.parse(JSON.stringify(fresh(false)))).patterns.length,fresh(false).version],[32,23],'new project format');
 // Enter key preview uses the selected note, selected drum slot and velocity.
 state=fresh(false);state.selectedTrack=0;state.selectedStep=0;
 const step=state.patterns[0][0][0];step.on=true;step.note=55;step.velocity=96;step.sampleSlot=4;
 audio={ctx:{state:'running',currentTime:7}};
 const calls=[];
 playTrack=(...args)=>{calls.push(['on',args[0],args[1],args[2],args[3],args[7]]);return [{id:23,released:false}]};
 releaseVoice=(voice,at)=>{voice.released=true;calls.push(['off',voice.id,at]);};
 startEnterPreview();stopEnterPreview();
 eq(calls,[['on',0,55,96,7.005,4],['off',23,7]],'Enter note on and keyup note off');
 state.tracks[0].midiOnly=true;
 const midi=[];
 midiPlayStep=(...args)=>midi.push(['on',args[0],args[1],args[4]]);
 midiOffTrack=t=>midi.push(['off',t]);
 startEnterPreview();stopEnterPreview();
 eq(midi,[['on',0,55,true],['off',0]],'MIDI held note release');
 return 'PASS: 10 UI, pattern, migration and held-note assertions';
`);
console.log(run({}, {}, {getItem:()=>null,setItem:()=>{}},{warn:()=>{},error:()=>{},log:()=>{}},structuredClone));