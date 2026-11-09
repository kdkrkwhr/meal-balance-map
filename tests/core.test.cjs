const { test } = require('node:test');
const assert = require('node:assert/strict');
let core;
try { core = require('../app/core.js'); } catch {}
const ready = () => assert.ok(core, 'UI model must exist');
test('demo has unique fictional restaurants and no real nutrition claims', () => {
  ready(); assert.equal(core.places.length, 6);
  assert.equal(new Set(core.places.map(p=>p.id)).size, 6);
  assert.ok(core.places.every(p=>p.fictional && p.basis === '100g · 화면 예시'));
});
test('query finds both menu and restaurant names', () => { ready(); assert.equal(core.filterPlaces({query:'두부'}).length, 2); assert.equal(core.filterPlaces({query:'초록식탁'})[0].id,'green'); });
test('selected preferences are combined with AND',()=>{ready();assert.deepEqual(core.filterPlaces({tags:['vegetable','warm']}).map(p=>p.id),['green','bowl','tofu']);});
test('budget and district restrict results',()=>{ready();assert.deepEqual(core.filterPlaces({district:'합정',budget:12000}).map(p=>p.id),['soup']);});
test('saved filter uses only supplied IDs',()=>{ready();assert.deepEqual(core.filterPlaces({savedOnly:true,saved:['fish']}).map(p=>p.id),['fish']);});
test('empty and malicious text remain plain search with no results',()=>{ready();assert.equal(core.filterPlaces({query:'<img src=x onerror=alert(1)>'}).length,0);assert.equal(core.filterPlaces({query:'존재하지않는메뉴'}).length,0);});
test('price order is ascending without mutating original data',()=>{ready();const first=core.places[0].id; const result=core.filterPlaces({sort:'price'});assert.ok(result.every((p,i)=>!i||p.price>=result[i-1].price));assert.equal(core.places[0].id,first);});
test('demo preference interpretation extracts only explicit known terms',()=>{ready();assert.deepEqual(core.interpret('따뜻하고 채소가 많은 음식'),['vegetable','warm']);assert.deepEqual(core.interpret('아무거나'),[]);});
test('missing nutrient displays unknown, never zero',()=>{ready();assert.equal(core.formatNutrient(null,'g'),'정보 없음');assert.equal(core.formatNutrient(0,'g'),'0g');});
