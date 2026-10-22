// Offline independent eight-track VU meter regression test.
// Run: node tests/mixer-meters.test.js
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert.ok(html.includes('pan.connect(meter).connect(compressor)'),'Each track meter is in the dry audio path');
assert.ok(html.includes('trackMeters.push(meter)'),'Each track has its own analyser');
assert.ok(!html.includes('rms*260'),'Old shared RMS meter formula is gone');
let app=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(app,'App script is present');
app=app.replace(/installNotes\(\);bindings\(\);bindSampleEditor\(\);bindDrumSamples\(\);bindSampleBank\(\);attachStepRangeSelection\(\);resetUndoHistory\(\);renderAll\(\);refreshOutputs\(\);requestAnimationFrame\(uiTick\);bootstrapDemoJson\(\);/,'');
const run=new Function('window','document','localStorage','console','structuredClone',app+`
 const eq=(a,b,msg)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(msg+': '+JSON.stringify(a)+' != '+JSON.stringify(b))};
 const levels=[.3,.12,0,.06,0,0,0,0];
 const cells=levels.map((_,i)=>({dataset:{track:String(i)},style:{height:'0%'},setAttribute(name,value){this[name]=value}}));
 document.querySelectorAll=()=>cells;
 view='mixer';
 audio={trackMeters:levels.map((_,index)=>({
  fftSize:1024,
  getFloatTimeDomainData(out){out.fill(levels[index])}
 }))};
 eq(meterLevelFromRms(0),0,'Absolute silence has zero level');
 eq(meterLevelFromRms(.0005),0,'Noise floor is suppressed');
 eq(meterLevelFromRms(1),100,'0 dBFS reaches full scale');
 updateMixerMeters(1000);
 const h=cells.map(x=>parseFloat(x.style.height));
 if(!(h[0]>h[1]&&h[1]>h[3]&&h[3]>h[2]))throw Error('Independent input signal levels must yield independent meters: '+h);
 eq([h[2],h[4],h[5],h[6],h[7]],[0,0,0,0,0],'Silent tracks stay at zero');
 // Stop track 1 while track 2 keeps playing; decay must be independent.
 levels[0]=0;
 for(let i=1;i<=25;i++)updateMixerMeters(1000+i*20);
 const afterwards=cells.map(x=>parseFloat(x.style.height));
 eq(afterwards[0],0,'Silent track meter decays to zero');
 if(!(afterwards[1]>20))throw Error('Second track must remain active');
 levels[1]=0;levels[3]=0;
 for(let i=26;i<=55;i++)updateMixerMeters(1000+i*20);
 eq(cells.map(x=>parseFloat(x.style.height)),[0,0,0,0,0,0,0,0],'All meters return to zero when audio ends');
 eq(cells.every(c=>c['aria-valuenow']==='0'),true,'Accessibility readings reset to zero');
 // No fake level when Web Audio has not been started.
 audio=null;cells[0].style.height='0%';updateMixerMeters(2150);
 eq(cells[0].style.height,'0%','Meter remains quiet without audio');
 return 'PASS: independent signal levels, silent channels, decay, UI and wiring';
`);
console.log(run({}, {querySelectorAll:()=>[]}, {getItem:()=>null,setItem:()=>{}},
 {warn:()=>{},error:()=>{},log:()=>{}},structuredClone));