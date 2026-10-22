// Squirrel Studio 0.1.56: verify EDIT mode button's visual state and bindings.
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const css=html.match(/<style>([\s\S]*?)<\/style>/)?.[1]||'';
const js=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
assert.ok(css.includes('#editModeBtn.active,'),'Active EDIT button has dedicated styling');
assert.ok(css.includes('#editModeBtn[aria-pressed="true"]'),'Accessible pressed state has same styling');
const activeStyle=css.split('#editModeBtn.active,')[1]?.split('}')[0]||'';
assert.match(activeStyle,/background:linear-gradient\(180deg,#b94f49 0%,#842d2b 100%\)/,'Active EDIT uses red gradient');
assert.match(activeStyle,/color:#fff5f2/,'Active EDIT text remains legible');
assert.match(js,/\$\('editModeBtn'\)\.textContent=state\.editMode\?'✎ EDIT ON':'✎ EDIT OFF'/,'Button label follows edit mode');
assert.match(js,/\$\('editModeBtn'\)\.classList\.toggle\('active',state\.editMode\)/,'Active class follows edit mode');
assert.match(js,/\$\('editModeBtn'\)\.setAttribute\('aria-pressed',String\(state\.editMode\)\)/,'Accessible pressed state follows edit mode');
assert.match(js,/\$\('editModeBtn'\)\.onclick=\(\)=>\{state\.editMode=!state\.editMode/,'Button click toggles edit mode');
assert.ok(!css.includes('#editModeBtn:not(.active){background:'),'EDIT OFF keeps neutral default style');
console.log('PASS: EDIT ON red, EDIT OFF neutral, live label and aria-pressed states');
