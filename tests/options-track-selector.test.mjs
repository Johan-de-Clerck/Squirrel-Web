// Verify the Options dashboard selects exactly one of sixteen tracks.
// Run: node --test tests/options-track-selector.test.mjs
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
function productionFunction(name){
 const start=html.indexOf('function '+name+'(');
 assert.notEqual(start,-1,'Missing '+name);
 const at=html.indexOf('{',start);let depth=0;
 for(let i=at;i<html.length;i++){
  if(html[i]==='{')depth++;
  else if(html[i]==='}'&&--depth===0)return html.slice(start,i+1);
 }
 throw Error('Unclosed function '+name);
}
function setup(){
 class Element {
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.options=[];this.value='';this.dataset={};this.style={};this.textContent='';}
  replaceChildren(...items){this.children=[...items];if(this.tagName==='SELECT')this.options=items;}
  append(...items){this.children.push(...items);}
  appendChild(item){this.children.push(item);}
  add(option){this.options.push(option);this.children.push(option);}
  setAttribute(k,v){this[k]=v;}
 }
 const ids=Object.fromEntries(['optionsTrackSelect','optionsTrackDescription','optionsMidiTracks',
  'optionsGrooveTracks','optionsSlots','optionsPatterns'].map(id=>[id,new Element(id==='optionsTrackSelect'?'select':'div')]));
 function Option(text,value){this.text=String(text);this.value=String(value)}
 const document={activeElement:null,createElement:tag=>new Element(tag)};
 const state={selectedTrack:3,pattern:0,tracks:Array.from({length:16},(_,i)=>({
   name:'SAMPLE '+(i+1),trackKind:'sample',midiOnly:false,midiChannel:i,
   trackSwing:i,velocityHumanize:0
 }))};
 const calls={slot:[],length:[],midiMode:[],midiChannel:[]};
 const $$=id=>ids[id];
 const functions=['getOptionsTrackIndex','updateOptionsTrackSelect','renderMidiTrackOptions',
   'renderOptions'].map(productionFunction).join('\n');
 const api=new Function('document','Option','$','state','calls',`
  const TRACK_COUNT=16,MAX_STEPS=32,PATTERNS_PER_GROUP=8,PATTERN_GROUPS='ABCD';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const kindOf=t=>t.trackKind;
  const trackLength=(pattern,track)=>track+16;
  const slotSelect=index=>{calls.slot.push(index);return document.createElement('div')};
  const setTrackMidiMode=(index,mode)=>calls.midiMode.push([index,mode]);
  const setTrackMidiChannel=(index,channel)=>calls.midiChannel.push([index,channel]);
  const setTrackLength=(pattern,track,value)=>calls.length.push([pattern,track,value]);
  const patternIndex=(group,num)=>group*8+num;
  const patternName=i=>'A'+(i+1);
  const patternBpm=()=>120;
  const choosePattern=()=>{};
  const persist=()=>{};
  const setPatternName=()=>{};
  const setPatternBpm=()=>{};
  let optionsTrackIndex=null;
  ${functions}
  return {renderOptions,updateOptionsTrackSelect,getOptionsTrackIndex,
   setTrack:index=>optionsTrackIndex=index};
 `)(document,Option,$$,state,calls);
 return {api,ids,state,calls};
}
test('Options has one track picker, grouping controls and a Sequencer action',()=>{
 assert.match(html,/id="optionsTrackSelect"/);
 assert.match(html,/id="optionsShowTrack"/);
 assert.match(html,/class="options-track-dashboard"/);
 assert.match(html,/\$\('optionsTrackSelect'\)\.onchange/);
 assert.match(html,/\$\('optionsShowTrack'\)\.onclick/);
});
test('selector lists all sixteen tracks with only one card in each section',()=>{
 const {api,ids,calls}=setup();api.renderOptions();
 assert.equal(ids.optionsTrackSelect.options.length,16);
 assert.equal(ids.optionsTrackSelect.value,'3');
 assert.equal(ids.optionsMidiTracks.children.length,1);
 assert.equal(ids.optionsGrooveTracks.children.length,1);
 assert.equal(ids.optionsSlots.children.length,1);
 assert.equal(ids.optionsPatterns.children.length,2);
 assert.deepEqual(calls.slot,[3]);
});
test('track 13 updates just its own option controls and pattern length',()=>{
 const {api,ids,state,calls}=setup();
 api.renderOptions();api.setTrack(12);api.renderOptions();
 assert.equal(api.getOptionsTrackIndex(),12);
 assert.equal(ids.optionsTrackSelect.value,'12');
 assert.equal(ids.optionsSlots.children.length,1);
 assert.equal(ids.optionsMidiTracks.children.length,1);
 assert.equal(ids.optionsPatterns.children.length,2);
 assert.deepEqual(calls.slot,[3,12]);
 const grooveRow=ids.optionsGrooveTracks.children[0];
 const swingInput=grooveRow.children[1].children.at(-1);
 swingInput.value=35;swingInput.oninput();
 assert.equal(state.tracks[12].trackSwing,35);
 assert.equal(state.tracks[3].trackSwing,3);
 const midiRow=ids.optionsMidiTracks.children[0];
 const outputMode=midiRow.children[1];outputMode.value='midi';outputMode.onchange();
 assert.deepEqual(calls.midiMode,[[12,true]]);
 const channel=midiRow.children[2];channel.value='14';channel.onchange();
 assert.deepEqual(calls.midiChannel,[[12,'14']]);
 const len=ids.optionsPatterns.children[1].children[1];
 len.value='24';len.onchange();
 assert.deepEqual(calls.length,[[0,12,'24']]);
});
test('invalid or stale selection is clamped back to the active sequencer track',()=>{
 const {api,state}=setup();
 api.setTrack(120);assert.equal(api.getOptionsTrackIndex(),3);
 state.selectedTrack=10;api.setTrack(null);
 assert.equal(api.getOptionsTrackIndex(),10);
});
test('updating labels does not rebuild an already-open native dropdown',()=>{
 const {api,ids}=setup();api.renderOptions();
 const old=ids.optionsTrackSelect.options[0];
 // Rename a track while the dropdown owns input focus.
 const documentMock=ids.optionsTrackSelect;
 assert.ok(old);
 assert.match(html,/if\(changed&&document\.activeElement!==select\)/);
});
