// Squirrel Studio 0.1.74: per-slot graphical cutoff sweep drag controls.
// Run: node tests/drum-filter-sweep-graph.test.js
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
let app=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(app,'App script');
app=app.replace(/installNotes\(\);bindings\(\);bindSampleEditor\(\);bindDrumSamples\(\);bindSampleBank\(\);attachStepRangeSelection\(\);resetUndoHistory\(\);renderAll\(\);refreshOutputs\(\);requestAnimationFrame\(uiTick\);bootstrapDemoJson\(\);/,'');
assert.doesNotThrow(()=>new Function(app),'App syntax');
const element=()=>({attrs:{},children:[],style:{},classList:{add(){}},
 setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]??null},
 append(...els){this.children.push(...els)},replaceChildren(...els){this.children=[...els]},
 getBoundingClientRect(){return {left:100,top:200,width:580,height:166}},
 setPointerCapture(){this.captured=true},hasPointerCapture(){return !!this.captured},
 releasePointerCapture(){this.captured=false},textContent:''});
const documentStub={createElement:element,createElementNS:()=>element()};

const test=new Function('document','window','localStorage','console','structuredClone',app+"\nstate=fresh(false);let saves=0;persist=()=>{saves++};\nconst checks=[];const eq=(a,b,label)=>{if(a!==b)throw Error(label+': '+a+' !== '+b);checks.push(label)};\neq(drumSweepGraphDepthFromY(drumSweepGraphDepthY(24)),24,'depth mapping +24');\neq(drumSweepGraphDepthFromY(drumSweepGraphDepthY(-48)),-48,'depth mapping -48');\neq(drumSweepGraphTimeFromX(drumSweepGraphTimeX(1500)),1500,'1500 ms mapping');\neq(drumSweepGraphTimeFromX(drumSweepGraphTimeX(0)),0,'zero time');\nconst item=state.drumSamples[0][0];item.slotFilterOn=true;item.slotCutoff=500;\nlet chart;chart=createDrumFilterSweepGraph(item,0,(field,value,commit)=>{item[field]=value;chart.redraw();if(commit)persist()});\nconst svg=chart.root.children[0];\nconst depthDot=svg.children.find(el=>el.attrs['data-sweep-handle']==='slotFilterEnvDepth'&&el.attrs.cx!==undefined);\nconst timeDot=svg.children.find(el=>el.attrs['data-sweep-handle']==='slotFilterEnvTime'&&el.attrs.cx!==undefined);\neq(!!depthDot,true,'depth draggable handle rendered');\neq(!!timeDot,true,'time draggable handle rendered');\nconst ev=(x,y,target)=>({target,clientX:100+x,clientY:200+y,pointerId:9,preventDefault(){}});\nsvg.onpointerdown(ev(76,30,depthDot));\neq(item.slotFilterEnvDepth,48,'vertical drag +48');\nsvg.onpointermove(ev(76,130,svg));\neq(item.slotFilterEnvDepth,-48,'vertical drag -48');\neq(saves,0,'no storage writes during drag');\nsvg.onpointerup(ev(76,130,svg));\neq(saves,1,'single save on drag end');\nsvg.onpointerdown(ev(550,80,timeDot));\neq(item.slotFilterEnvTime,3000,'time drag max');\nsvg.onpointermove(ev(145,80,svg));\neq(item.slotFilterEnvTime,0,'time drag zero');\nsvg.onpointercancel(ev(145,80,svg));\neq(saves,2,'cancel persists changed value');\nsvg.onpointerdown(ev(347.5,80,timeDot));\neq(item.slotFilterEnvTime,1500,'time mid point');\nsvg.onpointerup(ev(347.5,80,svg));\neq(saves,3,'third operation persisted');\nconst label=svg.children.find(el=>String(el.textContent).startsWith('BASE '));\neq(label.textContent,'BASE 500 Hz','base cutoff plotted');\nitem.slotFilterOn=false;chart.redraw();\neq(svg.style.opacity,'.5','graph displays filter-off state');\nsvg.onpointerdown(ev(550,80,timeDot));\neq(item.slotFilterEnvTime,1500,'disabled graph ignores drags');\nconst p=validate(JSON.parse(JSON.stringify(state)));\neq(p.drumSamples[0][0].slotFilterEnvDepth,-48,'project saves graph depth');\neq(p.drumSamples[0][0].slotFilterEnvTime,1500,'project saves graph time');\nreturn checks.length;\n");
const count=test(documentStub,{}, {getItem:()=>null,setItem(){}},{warn(){},log(){},error(){}},structuredClone);
assert.equal(count,20);
console.log('PASS: '+count+' cutoff-sweep graph mapping, pointer drag, cancellation, disabled state and persistence');
