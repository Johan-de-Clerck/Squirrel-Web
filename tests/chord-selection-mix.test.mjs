// Squirrel Studio v0.2.85 regression checks: chord qualities, continuation,
// cutoff/resonance/volume/pan ramps, and live/export automation parity.
// Run: node --test tests/chord-selection-mix.test.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
function sourceFunction(name){
 const start=html.indexOf('function '+name+'(');
 assert.ok(start>=0,'Missing '+name);
 const open=html.indexOf('{',start);
 let depth=0;
 for(let i=open;i<html.length;i++){
  if(html[i]==='{')depth++;
  else if(html[i]==='}'&&--depth===0)return html.slice(start,i+1);
 }
 throw Error('Unclosed '+name);
}
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const chordSource=html.slice(html.indexOf('const CHORD_MODES = ['),html.indexOf('// BPM is quantized'));
const {CHORD_MODES,chordMode,chordNotes,chordQualityForStep}=new Function('clamp',
 chordSource+'return {CHORD_MODES,chordMode,chordNotes,chordQualityForStep};')(clamp);
const {rampInterpolate,rampSpec,scheduleStepMixLocks}=new Function('clamp',
 ['rampInterpolate','rampSpec','scheduleStepMixLocks'].map(sourceFunction).join('\n')+
 'return {rampInterpolate,rampSpec,scheduleStepMixLocks};')(clamp);

test('all chord qualities play their intended intervals',()=>{
 assert.equal(CHORD_MODES.length,15);
 for(const chord of CHORD_MODES)
  assert.deepEqual(chordNotes(60,chord.id),chord.intervals.map(interval=>60+interval),chord.id);
 assert.deepEqual(chordNotes(60,'major'),[60,64,67]);
 assert.deepEqual(chordNotes(60,'minor'),[60,63,67]);
 assert.deepEqual(chordNotes(60,'maj7'),[60,64,67,71]);
 assert.deepEqual(chordNotes(60,'min9'),[60,63,67,70,74]);
});
test('per-step quality beats track default and unused steps inherit it',()=>{
 assert.equal(chordQualityForStep({sound:{chord:'sus4'}},{chordMode:null}),'sus4');
 assert.equal(chordQualityForStep({sound:{chord:'sus4'}},{chordMode:'dim7'}),'dim7');
 assert.match(html,/chordMode:null/);
 assert.match(html,/chordMode:p\.chordMode==null\?null:/);
});
test('CHORD holds all voices with D00 across patterns just like BASS/LEAD',()=>{
 assert.match(html,/const hold=isSample\(t\)\|\|isSynth\(t\);/);
 assert.match(html,/const holdSynth=isSynth\(t\)&&hit===hits-1;/);
 assert.match(html,/for\(const voice of voices\)markSampleContinuation\(t,voice,hitTime\)/);
 assert.match(html,/if\(rowStep\?\.fx===12\|\|row\.fired\[trackIndex\]\)return row\.at/);
});
test('16-step linear filter cutoff has 15 equal intervals',()=>{
 const values=Array.from({length:16},(_,step)=>rampInterpolate(200,12800,step/15,'linear'));
 assert.equal(values[0],200);assert.equal(values[15],12800);
 for(let i=1;i<16;i++)assert.ok(Math.abs(values[i]-values[i-1]-840)<1e-8);
});
test('exponential cutoff is geometrically spaced',()=>{
 const values=Array.from({length:16},(_,step)=>rampInterpolate(200,12800,step/15,'exponential'));
 const ratio=values[1]/values[0];
 for(let i=1;i<16;i++)assert.ok(Math.abs(values[i]/values[i-1]-ratio)<1e-9);
});
test('resonance, volume and panning have correct limits',()=>{
 assert.deepEqual([rampSpec('resonance').min,rampSpec('resonance').max],[.1,18]);
 assert.deepEqual([rampSpec('volume').min,rampSpec('volume').max],[0,100]);
 assert.deepEqual([rampSpec('pan').min,rampSpec('pan').max],[-100,100]);
});
test('mute and cross-center pan remain finite and monotonic in exponential mode',()=>{
 for(const [from,to] of [[100,0],[0,100],[-100,100],[100,-100]]){
  const values=Array.from({length:16},(_,i)=>rampInterpolate(from,to,i/15,'exponential'));
  assert.ok(values.every(Number.isFinite));
  assert.equal(values[0],from);assert.equal(values.at(-1),to);
  for(let i=1;i<values.length;i++)
   assert.ok(to>=from?values[i]>=values[i-1]:values[i]<=values[i-1]);
 }
});
test('volume and pan are relative to mixer and persist until a track wrap',()=>{
 const events=[];
 const vol={setTargetAtTime:(...v)=>events.push(['volume',...v])};
 const pan={setTargetAtTime:(...v)=>events.push(['pan',...v])};
 scheduleStepMixLocks(vol,pan,{volume:25,pan:-75},1);
 assert.deepEqual(events,[['volume',.25,1,.006],['pan',-.75,1,.006]]);
 events.length=0;scheduleStepMixLocks(vol,pan,{},2);
 assert.deepEqual(events,[]);
 scheduleStepMixLocks(vol,pan,{},3,true);
 assert.deepEqual(events,[['volume',1,3,.006],['pan',0,3,.006]]);
});
test('offline WAV and live audio both route volume and pan before all send FX',()=>{
 assert.match(html,/pan\.connect\(delaySend\)\.connect\(delayInput\)/);
 assert.match(html,/pan\.connect\(reverbSend\)\.connect\(reverb\)/);
 assert.match(html,/pan\.connect\(chorusSend\)\.connect\(chorusInput\)/);
 assert.match(html,/scheduleStepMixLocks\(\s*exportStepVolumes\[t\],exportStepPans\[t\]/);
 assert.match(html,/scheduleStepMixLocks\(\s*audio\.stepVolumeGains\[t\]\?\.gain,audio\.stepPans\[t\]\?\.offset/);
 assert.match(html,/\['cutoff','resonance','volume','pan'\]\.filter/);
 assert.match(html,/stepPan\.connect\(pan\.pan\)/);
 assert.match(html,/stepPan\.start\(0\);stepPan\.stop\(duration\)/);
 assert.doesNotMatch(html,/pan\.connect\(stepPan\)/);

});
