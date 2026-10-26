// Verify Selection > Interpolate against the actual functions in index.html.
// Run: node --test tests/selection-ramp.test.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
function productionFunction(name) {
  const at = html.indexOf('function ' + name + '(');
  assert.notEqual(at, -1, 'Missing ' + name);
  const start = html.indexOf('{', at);
  let nesting = 0;
  for (let i = start; i < html.length; i++) {
    if (html[i] === '{') nesting++;
    else if (html[i] === '}' && --nesting === 0) return html.slice(at, i + 1);
  }
  throw Error('Unclosed function ' + name);
}
const functions = ['rampSelectedRange', 'rampInterpolate', 'rampSpec',
  'rampNumber', 'updateRampMenu', 'applyRampSelection'].map(productionFunction).join('\n');

function harness() {
  const lane = Array.from({ length: 16 }, (_, i) =>
    ({ on: i === 0, note: 48, velocity: 100, gate: 92, locks: null }));
  lane[0].locks = { cutoff: 100, resonance: 5 };
  lane[15].locks = { cutoff: 1600 };
  lane[7].locks = { resonance: 7.5 };
  const elements = {
    rampParameter: { value: 'cutoff' }, rampCurve: { value: 'linear' },
    rampStart: { value: '' }, rampEnd: { value: '' },
    rampApply: { disabled: false }, rampInfo: { textContent: '',
      classList: { toggle() {} } }, rampCurveHelp: { textContent: '' }
  };
  const $ = id => elements[id];
  const state = { pattern: 0, tracks: [{ trackKind: 'lead', midiOnly: false,
    sound: { cutoff: 1000, resonance: .7 } }], patterns: [[lane]],
    trackLengths: [[16]] };
  let historyWrites = 0;
  const api = new Function('$', 'state', 'persist', 'getInitialRange', `
    const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
    const isSynth = t => state.tracks[t]?.trackKind === 'lead';
    const trackLength = (pattern, track) => state.trackLengths[pattern][track];
    const synthStepLocks = cell => cell.locks || {};
    const renderGrid = () => {};
    const renderFXEditor = () => {};
    const notify = () => {};
    let stepRange = getInitialRange(), rampEditorKey = '';
    ${functions}
    return { rampSelectedRange, rampInterpolate, updateRampMenu,
      applyRampSelection, setRange: r => stepRange = r };
  `)($, state, () => historyWrites++, () =>
    ({ pattern: 0, startTrack: 0, endTrack: 0, startStep: 0, endStep: 15 }));
  return { api, lane, elements, get historyWrites() { return historyWrites; } };
}
const expectedLinear = Array.from({ length: 16 }, (_, i) => Math.round(100 + 1500 * i / 15));

test('linear upward cutoff fills all sixteen steps without notes being added', () => {
  const h = harness();
  h.api.updateRampMenu(true);
  assert.equal(h.elements.rampStart.value, '100');
  assert.equal(h.elements.rampEnd.value, '1600');
  assert.equal(h.api.applyRampSelection(), true);
  assert.deepEqual(h.lane.map(s => s.locks.cutoff), expectedLinear);
  assert.equal(h.lane[0].on, true);
  assert.equal(h.lane[7].on, false);
  assert.equal(h.lane[7].locks.resonance, 7.5);
  assert.equal(h.historyWrites, 1);
});
test('exponential upward uses geometric interpolation in Hz', () => {
  const h = harness();
  h.elements.rampCurve.value = 'exponential';
  h.api.updateRampMenu(true);
  h.api.applyRampSelection();
  assert.deepEqual(h.lane.map(s => s.locks.cutoff),
    Array.from({ length: 16 }, (_, i) => Math.round(100 * Math.pow(16, i / 15))));
});
test('reversed selection can produce a descending exponential curve', () => {
  const h = harness();
  h.api.setRange({ pattern: 0, startTrack: 0, endTrack: 0, startStep: 15, endStep: 0 });
  h.api.updateRampMenu(true);
  h.elements.rampStart.value = '1600';
  h.elements.rampEnd.value = '100';
  h.elements.rampCurve.value = 'exponential';
  h.api.applyRampSelection();
  assert.equal(h.lane[0].locks.cutoff, 1600);
  assert.equal(h.lane[15].locks.cutoff, 100);
  assert.ok(h.lane.every((s, i) => i === 0 || s.locks.cutoff <= h.lane[i - 1].locks.cutoff));
});
test('resonance interpolation leaves existing cutoff locks intact', () => {
  const h = harness();
  h.elements.rampParameter.value = 'resonance';
  h.api.updateRampMenu(true);
  h.elements.rampStart.value = '.1';
  h.elements.rampEnd.value = '18';
  h.api.applyRampSelection();
  assert.equal(h.lane[0].locks.cutoff, 100);
  assert.equal(h.lane[15].locks.cutoff, 1600);
  assert.equal(h.lane[0].locks.resonance, .1);
  assert.equal(h.lane[15].locks.resonance, 18);
});
test('selections across tracks are rejected', () => {
  const h = harness();
  h.api.setRange({ pattern: 0, startTrack: 0, endTrack: 1, startStep: 0, endStep: 15 });
  h.api.updateRampMenu(true);
  assert.equal(h.elements.rampApply.disabled, true);
  assert.equal(h.api.applyRampSelection(), false);
  assert.equal(h.historyWrites, 0);
});
test('invalid values do not modify any step', () => {
  const h = harness();
  h.api.updateRampMenu(true);
  h.elements.rampStart.value = '';
  h.api.updateRampMenu();
  assert.equal(h.elements.rampApply.disabled, true);
  assert.equal(h.api.applyRampSelection(), false);
  assert.equal(h.historyWrites, 0);
});
test('applying the same ramp again makes no new history entry', () => {
  const h = harness();
  h.api.updateRampMenu(true);
  h.api.applyRampSelection();
  h.api.applyRampSelection();
  assert.equal(h.historyWrites, 1);
});
