// Regression check for the same envelope calculations used by Squirrel Studio.
// Run from the repository root: node --test tests/envelope-parity.test.mjs
import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// Extract the actual application functions, so the tests never silently
// validate a second, duplicated ADSR implementation.
function getFunction(name) {
  const at = html.indexOf('function ' + name + '(');
  assert.notEqual(at, -1, 'Missing ' + name);
  const open = html.indexOf('{', at);
  let depth = 0;
  for (let i = open; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}' && --depth === 0)
      return html.slice(at, i + 1);
  }
  throw new Error('Unclosed function: ' + name);
}
const { voiceGainAt, exportSynthAmplitude } = new Function('clamp',
  'const duration = 60;\n' +
  getFunction('voiceGainAt') + '\n' +
  getFunction('exportSynthAmplitude') +
  '\nreturn { voiceGainAt, exportSynthAmplitude };'
)(clamp);

const scenarios = [
  { name: 'note off during attack', attack: .2, decay: .5, sustain: .6, velocity: 120, off: .1 },
  { name: 'note off during exponential decay', attack: .2, decay: .5, sustain: .6, velocity: 120, off: .45 },
  { name: 'note off during sustain across patterns', attack: .2, decay: .5, sustain: .6, velocity: 120, off: 3 },
  { name: 'low-velocity zero sustain in decay', attack: .003, decay: .05, sustain: 0, velocity: 1, off: .03 },
  { name: 'low-velocity zero sustain held', attack: .003, decay: .05, sustain: 0, velocity: 1, off: 10 },
];

for (const scenario of scenarios) {
  test(scenario.name + ': live and WAV agree at C00', () => {
    const { attack, decay, sustain, velocity, off } = scenario;
    const sound = { attack, decay, sustain, release: .4 };
    const events = [];
    const param = {
      setValueAtTime(value, at) { events.push({ kind: 'set', value, at }); },
      linearRampToValueAtTime(value, at) { events.push({ kind: 'linear', value, at }); },
      exponentialRampToValueAtTime(value, at) { events.push({ kind: 'exponential', value, at }); }
    };
    exportSynthAmplitude(param, 0, off, velocity, sound);
    const finalRelease = events.at(-1);
    const atNoteOff = events.at(-2);
    const liveGain = voiceGainAt({ ampEnvelope: {
      start: 0, peak: Math.max(.0002, velocity / 127 * .5),
      attack, decay, sustain
    } }, off);
    assert.equal(finalRelease.kind, 'exponential');
    assert.ok(Math.abs(finalRelease.at - (off + sound.release)) < 1e-8);
    assert.ok(Math.abs(atNoteOff.value - liveGain) <= Math.max(1e-8, liveGain * 1e-8),
      'WAV release begins at a different gain than live');
    assert.ok(liveGain > 0, 'Web Audio exponential automation needs positive gain');
  });
}
