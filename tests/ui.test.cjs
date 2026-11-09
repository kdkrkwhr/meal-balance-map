const {test}=require('node:test');
const assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const fs=require('node:fs');
function page(){
 const dom=new JSDOM(fs.readFileSync('index.html','utf8'),{runScripts:'outside-only',url:'https://example.test/meal-balance-map/'});
 const w=dom.window;
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
 w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
 w.HTMLElement.prototype.scrollIntoView=function(){};
 w.eval(fs.readFileSync('app/core.js','utf8'));w.eval(fs.readFileSync('app/app.js','utf8'));
 const d=w.document; const click=s=>d.querySelector(s).click();
 const input=(s,v)=>{d.querySelector(s).value=v;d.querySelector(s).dispatchEvent(new w.Event('input',{bubbles:true}));};
 return {dom,w,d,click,input,count:()=>d.querySelectorAll('.restaurant-card').length};
}
test('initial UI shows six fictional cards and matching pins',()=>{const p=page();assert.equal(p.count(),6);assert.equal(p.d.querySelectorAll('.map-pin').length,6);assert.match(p.d.body.textContent,/가상/);p.dom.window.close();});
test('search, empty state and reset work end to end',()=>{const p=page();p.input('#search','고등어');assert.equal(p.count(),1);p.input('#search','<img onerror=alert(1)>');assert.equal(p.count(),0);assert.equal(p.d.querySelectorAll('img').length,0);p.click('#empty-reset');assert.equal(p.count(),6);p.dom.window.close();});
test('filters synchronize cards and pins',()=>{const p=page();p.click('[data-tag="mild"]');assert.equal(p.count(),3);assert.equal(p.d.querySelectorAll('.map-pin').length,3);p.click('#reset');assert.equal(p.count(),6);p.dom.window.close();});
test('saved menu navigation and removal work',()=>{const p=page();p.click('[data-save="green"]');p.click('#saved-nav');assert.equal(p.count(),1);p.click('[data-save="green"]');assert.equal(p.count(),0);p.click('#empty-reset');assert.equal(p.count(),6);p.dom.window.close();});
test('pin selection and detail evidence/graph tabs work',()=>{const p=page();p.click('[data-select="fish"]');assert.match(p.d.querySelector('#map-selection').textContent,/바다한상/);p.click('#map-selection [data-detail]');assert.equal(p.d.querySelector('#detail-dialog').open,true);p.click('[data-tab="evidence"]');assert.match(p.d.querySelector('#detail-panel').textContent,/현재 매칭된 공식 항목은 없어요/);p.click('[data-tab="graph"]');assert.match(p.d.querySelector('#detail-panel').textContent,/실제 그래프 추출 결과가 아니/);p.click('[data-close="detail-dialog"]');assert.equal(p.d.querySelector('#detail-dialog').open,false);p.dom.window.close();});
test('mock AI rejects unknown request and applies supported keywords',()=>{const p=page();p.click('#ask-ai');p.input('#ai-input','아무거나');p.d.querySelector('#ai-form').dispatchEvent(new p.w.Event('submit',{cancelable:true}));assert.equal(p.d.querySelector('#ai-dialog').open,true);assert.match(p.d.querySelector('#ai-feedback').textContent,/모의 화면/);p.input('#ai-input','따뜻한 채소');p.d.querySelector('#ai-form').dispatchEvent(new p.w.Event('submit',{cancelable:true}));assert.equal(p.d.querySelector('#ai-dialog').open,false);assert.equal(p.count(),3);p.dom.window.close();});
test('mobile view toggle and bounded zoom controls work',()=>{const p=page();p.click('#mobile-map-toggle');assert.equal(p.d.body.classList.contains('map-mode'),true);for(let i=0;i<10;i++)p.click('#zoom-in');assert.equal(p.d.querySelector('#zoom-in').disabled,true);p.click('#recenter');assert.equal(p.d.querySelector('#map-world').style.transform,'scale(1)');p.dom.window.close();});

test('district selector exposes both neighborhoods and filters cards',()=>{const p=page();const s=p.d.querySelector('#district');assert.deepEqual([...s.options].map(o=>o.value),['전체','연남','합정']);s.value='연남';s.dispatchEvent(new p.w.Event('change'));assert.equal(p.count(),3);assert.ok([...p.d.querySelectorAll('.card-meta')].every(e=>e.textContent.includes('연남')));p.dom.window.close();});

test('compact UI keeps mock disclosure and puts caution behind disclosure',()=>{const p=page();assert.match(p.d.querySelector('.demo-strip').textContent,/가상 데이터/);assert.equal(p.d.querySelector('.intro'),null);p.click('[data-detail="green"]');assert.ok(p.d.querySelector('details.more-info summary'));assert.match(p.d.querySelector('.notice').textContent,/가상 영양값/);p.dom.window.close();});
