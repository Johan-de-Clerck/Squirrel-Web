// Squirrel Studio 0.1.70: interactive drum envelope graph regression checks.
// Run: node tests/drum-envelope-graph.test.js
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
let app=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(app,'Application JavaScript must be available');
app=app.replace(/installNotes\(\);bindings\(\);bindSampleEditor\(\);bindDrumSamples\(\);bindSampleBank\(\);attachStepRangeSelection\(\);resetUndoHistory\(\);renderAll\(\);refreshOutputs\(\);requestAnimationFrame\(uiTick\);bootstrapDemoJson\(\);/,'');
assert.doesNotThrow(()=>new Function(app),'App parses');
const element=()=>({attrs:{},children:[],style:{},classList:{add(){}},
 setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]??null},
 append(...els){this.children.push(...els)},replaceChildren(...els){this.children=[...els]},
 getBoundingClientRect(){return {left:100,width:552}},
 setPointerCapture(){this.captured=true},hasPointerCapture(){return !!this.captured},
 releasePointerCapture(){this.captured=false},textContent:''});
const doc={createElement:element,createElementNS:()=>element()};
const run=new Function('document','window','localStorage','console','structuredClone',app+"\nstate=fresh(false);let saves=0;persist=()=>{saves++};renderDrumSamples=()=>{};\nlet checks=0;const check=(a,b,label)=>{checks++;if(a!==b)throw Error(label+': '+a+' !== '+b)};\ncheck(drumEnvGraphMilliseconds(0,500),0,'zero attack');\ncheck(drumEnvGraphMilliseconds(1,500),500,'max attack');\ncheck(drumEnvGraphMilliseconds(drumEnvGraphPosition(2,500),500),2,'2 ms precise mapping');\ncheck(drumEnvGraphMilliseconds(drumEnvGraphPosition(18,2000),2000),18,'18 ms precise mapping');\ncheck(drumEnvGraphMilliseconds(drumEnvGraphPosition(1250,3000),3000),1250,'decay log mapping');\nconst item=state.drumSamples[0][0];let graph;\ngraph=createDrumEnvelopeGraph(item,0,(key,value)=>{item[key]=value;graph.redraw()});\nconst svg=graph.root.children[0];const zone=field=>svg.children.find(x=>x.attrs['data-env-field']===field);\ncheck(svg.children.filter(x=>x.attrs['data-env-field']).length,3,'3 touch regions');\ncheck(svg.children.some(x=>String(x.textContent).includes('DECAY OFF')),true,'decay OFF label');\nconst event=(x,target)=>({clientX:100+x,pointerId:5,target,preventDefault(){}});\nsvg.onpointerdown(event(162,zone('slotAttack')));\ncheck(item.slotAttack,500,'attack max');\nsvg.onpointermove(event(25,svg));\ncheck(item.slotAttack,0,'attack min');\ncheck(saves,0,'no persistence on pointermove');\nsvg.onpointerup(event(25,svg));\ncheck(saves,1,'one persistence on pointerup');\nsvg.onpointerdown(event(344,zone('slotDecay')));\ncheck(item.slotDecay,3000,'decay max');\nsvg.onpointermove(event(207,svg));\ncheck(item.slotDecay,0,'decay OFF');\nsvg.onpointercancel(event(207,svg));\ncheck(saves,2,'save on interrupted drag');\nsvg.onpointerdown(event(526,zone('slotRelease')));\ncheck(item.slotRelease,2000,'release max');\nsvg.onpointerup(event(526,svg));\ncheck(saves,3,'release persisted');\nconst saved=validate(JSON.parse(JSON.stringify(state)));\ncheck(saved.drumSamples[0][0].slotAttack,0,'project attack');\ncheck(saved.drumSamples[0][0].slotDecay,0,'project decay');\ncheck(saved.drumSamples[0][0].slotRelease,2000,'project release');\nreturn checks;\n");
const checks=run(doc,{}, {getItem:()=>null,setItem(){}},{log(){},warn(){},error(){}},structuredClone);
assert.equal(checks,19,'19 graph regression checks');
console.log('PASS: '+checks+' envelope graph position, drag, cancel, save and project checks');
