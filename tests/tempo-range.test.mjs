// BPM range regression checks. Run: node --test tests/tempo-range.test.mjs
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const beginning=html.indexOf('function normalizeBpm(value){');
assert.notEqual(beginning,-1);
const end=html.indexOf('\n}',beginning);
assert.ok(end>beginning);
const source=html.slice(beginning,end+2);
const normalizeBpm=new Function('clamp',
  'const clampBpm=clamp;\n'+source+'\nreturn normalizeBpm;')(
  (value,lower,upper)=>Math.min(upper,Math.max(lower,value))
);
test('minimum is exactly ten, with tenths accepted',()=>{
  for(const [input,expected] of [[10,10],['10.0',10],['10.1',10.1],
    ['10,3',10.3],[9.9,10],[1,10],[50,50],[120.3,120.3],
    [240,240],[240.1,240]]){
    assert.equal(normalizeBpm(input),expected, 'BPM: '+input);
  }
});
test('invalid values fall back safely to 120',()=>{
  assert.equal(normalizeBpm(''),120);
  assert.equal(normalizeBpm('bad'),120);
  assert.equal(normalizeBpm(0),120);
});
test('transport and Options numeric fields allow 10.0–240.0 in 0.1 steps',()=>{
  assert.match(html,/id="bpmInput" type="number" min="10" max="240" step="0\.1"/);
  assert.match(html,/tempoInput\.min='10';tempoInput\.max='240';tempoInput\.step='0\.1'/);
});
test('pattern BPM normalization is shared by Song Mode and WAV timing',()=>{
  assert.match(html,/function patternBpm\(bank=state\.pattern\)\{[\s\S]{0,170}normalizeBpm\(/);
  assert.match(html,/function stepDuration\(\)\{return 60\/patternBpm\(state\.pattern\)\/4\}/);
  assert.match(html,/const stepSecondsForPattern=pattern=>60\/patternBpm\(pattern\)\/4/);
  assert.equal(60/normalizeBpm(10)/4,1.5);
});
