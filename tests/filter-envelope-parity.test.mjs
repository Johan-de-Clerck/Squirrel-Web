// Long-note filter-envelope regression checks.
// Run: node --test tests/filter-envelope-parity.test.mjs
import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
function actualFunction(name) {
  const at = html.indexOf('function ' + name + '(');
  assert.notEqual(at, -1, 'Missing production function ' + name);
  const start = html.indexOf('{', at);
  let depth = 0;
  for (let i = start; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}' && --depth === 0)
      return html.slice(at, i + 1);
  }
  throw Error('Unclosed production function ' + name);
}
function harness() {
  return new Function('clamp', `
    let audio = { ctx: { currentTime: 0 } };
    const state = { tracks: [{ sound: { filterEnvelope: {
      enabled: true, amount: 60, attack: .1, decay: .5,
      sustain: 30, release: .5
    } } }] };
    const scheduledVoices = new Set();
    const isSynth = () => true;
    const filterBaseCutoff = () => 1000;
    ${actualFunction('envelopeOffsetAt')}
    ${actualFunction('updateLiveFilterEnvelope')}
    ${actualFunction('releaseFilterEnvelopes')}
    return { audio, state, scheduledVoices,
      envelopeOffsetAt, updateLiveFilterEnvelope, releaseFilterEnvelopes };
  `)((v, lo, hi) => Math.min(hi, Math.max(lo, v)));
}
function audioParam(nativeHold = false) {
  const events = [];
  const param = {
    events,
    cancelScheduledValues(time) { events.push(['cancel', time]); },
    setValueAtTime(value, time) { events.push(['set', value, time]); },
    linearRampToValueAtTime(value, time) { events.push(['ramp', value, time]); },
    setTargetAtTime(value, time, tau) { events.push(['target', value, time, tau]); }
  };
  if (nativeHold)
    param.cancelAndHoldAtTime = time => events.push(['hold', time]);
  return param;
}
const entry = (param, started, delta) => ({
  patchEnvelope: true, started, delta,
  source: { offset: param },
  settings: { enabled: true, amount: 40, attack: .1,
    decay: .5, sustain: 30, release: .5 }
});
function near(a, b) {
  assert.ok(Math.abs(a - b) <= Math.max(1e-8, Math.abs(b) * 1e-8),
    'got ' + a + ' instead of ' + b);
}
test('editing a held filter envelope does not jump before a later C00', () => {
  const h = harness(), param = audioParam(), e = entry(param, 0, 650);
  h.scheduledVoices.add({ trackIndex: 0, released: false, filterEnvelopes: [e] });
  h.audio.ctx.currentTime = .3;
  const original = h.envelopeOffsetAt(e, .3);
  h.updateLiveFilterEnvelope(0);
  assert.ok(e.override);
  near(h.envelopeOffsetAt(e, .3), original);
  assert.equal(param.events.at(-1)[0], 'target');
  h.audio.ctx.currentTime = .4;
  const expected = h.envelopeOffsetAt(e, .4);
  h.releaseFilterEnvelopes({ filterEnvelopes: [e] }, .4);
  const set = param.events.filter(x => x[0] === 'set').at(-1);
  near(set[1], expected);
  assert.deepEqual(param.events.at(-1), ['ramp', 0, .9]);
});
test('repeated edits preserve the current smooth offset', () => {
  const h = harness(), param = audioParam(), e = entry(param, 0, -280);
  h.scheduledVoices.add({ trackIndex: 0, released: false, filterEnvelopes: [e] });
  h.audio.ctx.currentTime = .2;
  h.updateLiveFilterEnvelope(0);
  h.audio.ctx.currentTime = .21;
  const expected = h.envelopeOffsetAt(e, .21);
  h.state.tracks[0].sound.filterEnvelope.amount = -50;
  h.updateLiveFilterEnvelope(0);
  near(h.envelopeOffsetAt(e, .21), expected);
  const lastSet = param.events.filter(x => x[0] === 'set').at(-1);
  near(lastSet[1], expected);
});
test('editing a future voice schedules attack and decay after its start', () => {
  const h = harness(), param = audioParam(), e = entry(param, 2, 650);
  h.audio.ctx.currentTime = 1;
  h.scheduledVoices.add({ trackIndex: 0, released: false, filterEnvelopes: [e] });
  h.updateLiveFilterEnvelope(0);
  assert.equal(e.override, null);
  assert.deepEqual(param.events.map(x => x[0]), ['cancel', 'set', 'ramp', 'ramp']);
  near(param.events[1][2], 2);
  near(param.events[2][2], 2.1);
  near(param.events[3][2], 2.6);
});
test('native cancelAndHoldAtTime is preferred at note-off', () => {
  const h = harness(), param = audioParam(true), e = entry(param, 0, 500);
  h.releaseFilterEnvelopes({ filterEnvelopes: [e] }, 2);
  assert.deepEqual(param.events, [['hold', 2], ['ramp', 0, 2.5]]);
});
test('offline parameter locks never retarget a released synth voice', () => {
  assert.match(html, /activeExportSynthFilters\[i\]\.push\(\{filter,started:time,noteOff:time\+length,/);
  assert.match(html, /if\(at>=entry\.noteOff\)continue;/);
});
