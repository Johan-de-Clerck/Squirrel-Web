// Build 0.2.07: live sample CARRY badge and multi-voice pattern regressions.
// Run: node tests/carry-indicators.test.js
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
let app=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(app,'Application JS exists');
app=app.replace(/installNotes\(\);bindings\(\);bindSampleEditor\(\);bindDrumSamples\(\);bindSampleBank\(\);attachStepRangeSelection\(\);resetUndoHistory\(\);renderAll\(\);refreshOutputs\(\);requestAnimationFrame\(uiTick\);bootstrapDemoJson\(\);/,'');
assert.doesNotThrow(()=>new Function(app),'Application script parses');
const run=new Function('document','window','localStorage','console','structuredClone',app+String.raw`
 state=fresh(false);let checks=0;const t=6;
 const eq=(a,b,n)=>{checks++;if(a!==b)throw Error(n+': '+a+' != '+b)};
 const dom1={dataset:{track:'6'},hidden:true,textContent:'',title:''};
 const dom2={dataset:{track:'0'},hidden:true,textContent:'',title:''};
 const dom3={dataset:{track:'6'},hidden:true,textContent:'',title:''};
 document.querySelectorAll=()=>[dom1,dom2,dom3];
 audio={ctx:{currentTime:1}};playing=true;
 const voice=(track,start)=>({trackIndex:track,startTime:start,sampleVoice:track===t,drum:track!==t,src:{stop(){}},released:false,pitchParams:[]});
 const later=voice(t,2),a=voice(t,.4),b=voice(t,.8),drum=voice(0,.7);
 for(const [track,v] of [[t,later],[t,a],[t,b],[0,drum]]){scheduledVoices.add(v);markSampleContinuation(track,v)}
 eq(activeCarryVoiceCount(t),2,'only audible sampler voices counted');
 eq(activeCarryVoiceCount(0),1,'drum count independent');
 updateCarryIndicators();
 eq(dom1.textContent,'CARRY 2','sequencer badge');
 eq(dom3.textContent,'CARRY 2','mixer badge');
 eq(dom2.textContent,'CARRY 1','drum badge');
 eq(dom1.hidden,false,'active badge visible');
 audio.ctx.currentTime=2.5;eq(activeCarryVoiceCount(t),3,'future voice becomes active');
 a.released=true;eq(activeCarryVoiceCount(t),2,'released voice not counted');
 forgetSampleContinuation(a);eq(continuedSampleVoices[t].has(a),false,'ended voice unregistered');
 const releases=[];releaseVoiceScheduled=(v,time)=>{v.released=true;v.releaseScheduled=time;releases.push(v)};
 releaseContinuedSamples(t,3);
 eq(releases.length,2,'C00 releases both voices');
 eq(continuedSampleVoices[t].size,0,'C00 clears all carriers');
 updateCarryIndicators();eq(dom1.hidden,true,'badge hides on note off');
 playing=false;updateCarryIndicators();eq(dom2.hidden,true,'badge hidden while stopped');
 resetFXRuntime();eq(continuedSampleVoices.every(x=>x.size===0),true,'transport reset clears registry');
 // Schedule real tracker steps, including two overlapping sustained samples.
 playing=true;audio.ctx.currentTime=0;const voices=[];
 playTrack=(track,note,vel,when,gate)=>{
  if(track!==t)return [];
  const v=voice(track,when);v.gate=gate;scheduledVoices.add(v);voices.push(v);return [v];
 };
 midiOffTrack=()=>{};midiPlayStep=()=>{};applyFXVoice=()=>{};
 for(let p=0;p<2;p++){state.patternLengths[p]=2;for(let i=0;i<TRACK_COUNT;i++)state.trackLengths[p][i]=2}
 state.pattern=0;
 state.patterns[0][t][0].on=true;state.patterns[0][t][0].continueSample=true;
 state.patterns[0][t][1].on=true;state.patterns[0][t][1].continueSample=true;
 state.patterns[1][t][1].on=false;state.patterns[1][t][1].fx=12;
 scheduleStep(0,0);scheduleStep(1,.15);
 eq(voices.length,2,'two overlapped samples');
 eq(continuedSampleVoices[t].size,2,'both voices are carried');
 state.pattern=1;scheduleStep(0,.3);
 eq(voices[0].released,false,'first voice survives pattern');
 eq(voices[1].released,false,'second voice survives pattern');
 audio.ctx.currentTime=.5;scheduleStep(1,.5);
 eq(voices[0].released,true,'C00 releases first voice');
 eq(voices[1].released,true,'C00 releases second voice');
 eq(continuedSampleVoices[t].size,0,'C00 clears registry after boundary');
 resetFXRuntime();voices.length=0;state.pattern=0;state.patterns[0][t][0].ratchet=3;
 scheduleStep(0,1);
 eq(voices.length,3,'three ratchets created');
 eq(continuedSampleVoices[t].size,1,'only final ratchet carries');
 eq(voices[0].carryAcrossPatterns,undefined,'earlier ratchet not carried');
 eq(voices[2].carryAcrossPatterns,true,'last ratchet carried');
 return checks;
`);
const count=run({}, {},{getItem:()=>null,setItem(){}},{warn(){},log(){},error(){}},structuredClone);
assert.equal(count,25,'CARRY assertions');
console.log('PASS: '+count+' active carry badges, overlapping sampler voices, C00, pattern boundary and ratchet checks');
