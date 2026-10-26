// Squirrel Studio 0.2.86: sixteen independent tracks and bank migration.
// Run: node --test tests/track-banks.test.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
function sourceFunction(name){
 const at=html.indexOf('function '+name+'(');
 assert.notEqual(at,-1,'Missing '+name);
 const start=html.indexOf('{',at);let level=0;
 for(let i=start;i<html.length;i++){
  if(html[i]==='{')level++;
  else if(html[i]==='}'&&--level===0)return html.slice(at,i+1);
 }
 throw Error('Unclosed '+name);
}
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const basesSource=html.slice(html.indexOf('const bases=['),html.indexOf('function defaultSound('));
const makeStepSource=html.slice(html.indexOf('const makeStep='),html.indexOf('\n',html.indexOf('const makeStep=')));
const engine=new Function('clamp',`
 const MAX_STEPS=32,PATTERN_COUNT=32,DRUM_LIBRARY_SIZE=15,TRACK_BANK_SIZE=8;
 const defaultPatternName=i=>'A'+(i+1);
 const kindName=(i,kind)=>kind.toUpperCase()+' '+(i+1);
 const defaultSound=b=>({type:b.type,cutoff:4000});
 const defaultLFOs=()=>[],defaultEnvelopes=()=>[],defaultSendFX=()=>({});
 const defaultDrumSlot=()=>({data:null});
 ${basesSource}
 const TRACK_COUNT=bases.length;
 ${makeStepSource}
 ${sourceFunction('fresh')}
 const state=fresh(false);
 const trackBankOf=index=>Math.floor(clamp(Math.floor(Number(index)||0),0,TRACK_COUNT-1)/TRACK_BANK_SIZE);
 return {bases,fresh,trackBankOf};
`)(clamp);
test('both eight-lane banks resolve all sixteen real tracks',()=>{
 assert.equal(engine.bases.length,16);
 assert.equal(engine.trackBankOf(0),0);
 assert.equal(engine.trackBankOf(7),0);
 assert.equal(engine.trackBankOf(8),1);
 assert.equal(engine.trackBankOf(15),1);
 assert.match(html,/id="trackBankSelect"/);
 assert.match(html,/<option value="0">TRACKS 1–8<\/option><option value="1">TRACKS 9–16<\/option>/);
});
test('tracks nine through sixteen start as independent empty samplers',()=>{
 const state=engine.fresh(false);
 assert.equal(state.tracks.length,16);
 assert.equal(state.trackLengths.length,32);
 assert.ok(state.tracks.slice(8).every(t=>t.trackKind==='sample'&&t.slotKind==='sampler'&&t.sampleData===null));
 assert.ok(state.patterns.every(pattern=>pattern.length===16&&pattern.every(row=>row.length===32)));
 assert.ok(state.patterns.every(pattern=>pattern.slice(8).every(row=>row.every(step=>!step.on))));
 assert.equal(new Set(state.tracks.map(t=>t.midiChannel)).size,16);
 assert.equal(state.drumSamples.length,16);
});
test('demo does not populate any of the new tracks',()=>{
 const demo=engine.fresh(true);
 assert.ok(demo.patterns.every(pattern=>pattern.slice(8).every(row=>row.every(step=>!step.on))));
});
const bankValidator=new Function('clamp',`
 const TRACK_COUNT=16,LEGACY_TRACK_COUNT=8,DRUM_LIBRARY_SIZE=15;
 const SAMPLE_BANK_FORMAT='squirrel-studio-sample-bank';
 const defaultDrumSlot=(name='',data=null,chokeGroup=0)=>({name,data,chokeGroup});
 const drumSlotFilterType=()=>'lowpass';
 const sanitizeSampleMarkers=()=>{};
 ${sourceFunction('validateSampleBank')}
 return validateSampleBank;
`)(clamp);
function fakeBank(version,drumTracks,samplerTracks=drumTracks){
 return {format:'squirrel-studio-sample-bank',version,
  drumSamples:Array.from({length:drumTracks},()=>Array.from({length:5},()=>({data:null}))),
  samplers:Array.from({length:samplerTracks},()=>null)};
}
for(const [version,drums,samplers] of [[1,3,2],[2,8,8],[3,8,8],[4,16,16]]){
 test('sample bank version '+version+' imports to sixteen tracks',()=>{
  const bank=bankValidator(fakeBank(version,drums,samplers));
  assert.equal(bank.drums.length,16);
  assert.equal(bank.samplers.length,16);
  assert.ok(bank.samplers.slice(8).every(x=>x===null));
 });
}
test('legacy project formats retain their original first eight channels',()=>{
 assert.match(html,/LEGACY_TRACK_COUNT,TRACK_COUNT\]\.includes\(data\.tracks\.length\)/);
 assert.match(html,/const s=fresh\(false\);\s*s\.drumLastSlots=/);
 assert.match(html,/for\(let t=0;t<TRACK_COUNT;t\+\+\)\{const src=data\.tracks\[t\];if\(!src\|\|typeof src!=='object'\)continue/);
});
test('the renderer only displays the bank selected by the current track',()=>{
 assert.match(html,/if\(trackBankOf\(track\)!==bank\)return/);
 assert.match(html,/selector\.value=String\(bank\)/);
 assert.match(html,/\$\('trackBankSelect'\)\.onchange=\(\)=>changeTrackBank/);
});
test('audio, sample editor, MIDI and export use dynamic track count',()=>{
 assert.match(html,/for\(let i=0;i<TRACK_COUNT;i\+\+\)\{\s*if\(isSample\(i\)\)/);
 assert.match(html,/const trackGains=\[\],trackModGains=\[\],trackPans=\[\]/);
 assert.match(html,/const exportFXRows=Array\.from\(\{length:TRACK_COUNT\}/);
 assert.match(html,/const targetFromChannel/);
});
