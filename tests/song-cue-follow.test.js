// Squirrel Studio 0.1.61: song cue, reorder and audible playback highlight regressions.
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const js=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
const css=html.match(/<style>([\s\S]*?)<\/style>/)?.[1]||'';
assert.doesNotThrow(()=>new Function(js),'Application script must parse');
assert.match(css,/\.song-entry\.active\{[^}]*background:#285c3b/,'Playing tile is bright green');
assert.match(css,/\.song-entry\.cued\{[^}]*background:#2b4934/,'Stopped cue is muted green');
assert.match(js,/playheadQueue\.push\(\{step:idx,time:when,songPosition\}\)/,'Queue carries scheduled song position');
assert.match(js,/visibleSongPosition=e\.songPosition;renderSongPosition\(\)/,'Visible position is updated at audio time');
assert.match(js,/songPosition=state\.songModeEnabled\?clamp\(songCuePosition/,'PLAY starts at the cued position');
const region=js.slice(js.indexOf('function addSongPattern('),js.indexOf('function renderSongMode('));
assert.ok(region.startsWith('function addSongPattern('),'Song functions found for regression harness');
const state={songSequence:[10,11,12],songModeEnabled:true,pattern:10,selectedStep:4};
const factory=new Function('state',`
 let playing=false,songPosition=0,songCuePosition=0,visibleSongPosition=0,view='song';
 const calls={persist:0,renderSongMode:0,renderAll:0,renderGrid:0};
 const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n)), SONG_SEQUENCE_LIMIT=256;
 const persist=()=>calls.persist++, renderSongMode=()=>calls.renderSongMode++,
       renderAll=()=>calls.renderAll++, renderGrid=()=>calls.renderGrid++;
 const renderStepEditor=()=>{},renderFXEditor=()=>{},updatePatternPicker=()=>{},
       notify=()=>{},stopTransport=()=>{playing=false},patternLength=()=>32,
       patternName=n=>'P'+n;
 const element={value:''},indicator={textContent:''}, $=id=>id==='songPositionLabel'?indicator:element;
 const document={querySelectorAll:()=>[]};
 ${region}
 return {cueSongPosition,addSongPattern,reorderSongPattern,removeSongPattern,renderSongPosition,
  snapshot:()=>({songCuePosition,visibleSongPosition,songPosition,indicator:indicator.textContent,calls})};
`);
const app=factory(state);
app.cueSongPosition(2);
assert.equal(app.snapshot().songCuePosition,2);
assert.equal(state.pattern,12);
assert.equal(app.snapshot().calls.renderSongMode,0,'Cue must not destroy tiles before double-click');
app.addSongPattern(13,0);
assert.equal(app.snapshot().songCuePosition,3,'Insert before cue preserves tile identity');
app.reorderSongPattern(3,1);
assert.equal(app.snapshot().songCuePosition,1,'Reordering selected tile moves its cue');
assert.equal(state.songSequence[1],12);
app.removeSongPattern(0);
assert.equal(app.snapshot().songCuePosition,0,'Removing earlier tile shifts cue correctly');
assert.equal(state.songSequence[0],12);
app.renderSongPosition();
assert.match(app.snapshot().indicator,/^READY 01\/03 · P12$/);
console.log('PASS: green song highlight, timed follow, cue/play, insert/reorder/remove and double-click safety');
