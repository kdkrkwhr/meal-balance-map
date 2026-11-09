(function() {
  'use strict';
  const M = window.MealModel;
  const $ = id => document.getElementById(id);
  const state = {query:'',tags:[],budget:999999,district:'전체',sort:'default',savedOnly:false,saved:[],selected:'green',zoom:1};
  let lastDialogTrigger = null;
  const money = n => n.toLocaleString('ko-KR')+'원';
  function art(p) {
    const plate = '<ellipse cx="60" cy="83" rx="45" ry="13" fill="#4c563923"/><circle cx="60" cy="58" r="43" fill="#f8f4e8"/><circle cx="60" cy="58" r="35" fill="#e5deca"/>';
    const soup = '<circle cx="60" cy="58" r="32" fill="#d4c29d"/><ellipse cx="49" cy="48" rx="15" ry="9" fill="#eee5ca" transform="rotate(-20 49 48)"/><ellipse cx="72" cy="62" rx="13" ry="9" fill="#f3e9ce" transform="rotate(20 72 62)"/><path d="m44 67 23-25m-5 32 17-23" stroke="#7c944d" stroke-width="5" stroke-linecap="round"/><circle cx="42" cy="55" r="2" fill="#9d8b60"/><circle cx="70" cy="42" r="2" fill="#9d8b60"/>';
    const bowl = '<path d="M32 55c0-27 29-38 45-20L60 58Z" fill="#789250"/><path d="M77 35c18 7 21 30 10 42L60 58Z" fill="#b6804b"/><path d="M87 77c-17 16-39 12-48-1l21-18Z" fill="#ded3ad"/><path d="M39 76c-9-5-13-13-7-21l28 3Z" fill="#9daa56"/><g fill="#ebdabb"><rect x="46" y="43" width="15" height="17" rx="3" transform="rotate(-15 46 43)"/><rect x="60" y="56" width="16" height="16" rx="3" transform="rotate(20 60 56)"/></g><g fill="#f7f2d5"><circle cx="54" cy="69" r="2"/><circle cx="47" cy="72" r="2"/><circle cx="71" cy="74" r="2"/></g>';
    const salad = '<g fill="#709253"><ellipse cx="44" cy="42" rx="14" ry="10" transform="rotate(-35 44 42)"/><ellipse cx="73" cy="42" rx="17" ry="10" transform="rotate(30 73 42)"/><ellipse cx="45" cy="68" rx="17" ry="12"/><ellipse cx="72" cy="72" rx="15" ry="10"/></g><g fill="#c77750"><circle cx="42" cy="50" r="7"/><circle cx="78" cy="60" r="7"/></g><g fill="#e0c689"><circle cx="56" cy="48" r="5"/><circle cx="59" cy="59" r="5"/><circle cx="53" cy="70" r="5"/><circle cx="69" cy="53" r="5"/><circle cx="69" cy="65" r="5"/></g>';
    const fish = '<ellipse cx="61" cy="58" rx="31" ry="15" fill="#8b957c" transform="rotate(-30 61 58)"/><path d="m80 39 16-1-4 16" fill="#7b8b76"/><path d="m42 57 12 13m-4-20 12 15m-3-22 12 15m-3-20 11 14" stroke="#d5c7a2" stroke-width="3"/><circle cx="40" cy="64" r="2" fill="#536447"/><path d="m31 42 12-12 9 12Z" fill="#d4cf6b"/><path d="m77 81 8-10" stroke="#6f8f52" stroke-width="8" stroke-linecap="round"/>';
    return `<svg viewBox="0 0 120 120" role="img" aria-label="${p.menu} 가상 메뉴 일러스트"><rect width="120" height="120" fill="${p.color}"/><path d="M0 100 120 25v95H0Z" fill="#fff" opacity=".12"/>${plate}${({soup,bowl,salad,fish})[p.art]}<path d="M106 23v77" stroke="#fff9e6" stroke-width="3" stroke-linecap="round"/><path d="M112 23v77" stroke="#fff9e6" stroke-width="2" stroke-linecap="round"/></svg>`;
  }
  function openDialog(id) {lastDialogTrigger=document.activeElement; if(!$(id).open) $(id).showModal();}
  function closeDialog(id){$(id).close();}
  document.querySelectorAll('dialog').forEach(d=>{
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});
    d.addEventListener('close',()=>{if(lastDialogTrigger?.isConnected)lastDialogTrigger.focus();});
  });
  document.addEventListener('click',e=>{const close=e.target.closest('[data-close]');if(close)closeDialog(close.dataset.close);});
  function toggleSave(id){state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id];render();const p=M.places.find(p=>p.id===id);$('live-status').textContent=`${p.name} 메뉴 ${state.saved.includes(id)?'저장됨':'저장 해제됨'}. 이 탭에서만 유지됩니다.`;}
  function render(){
    const list=M.filterPlaces(state);
    if(!list.some(p=>p.id===state.selected))state.selected=list[0]?.id||null;
    $('result-title').firstChild.textContent=state.savedOnly?'저장한 메뉴 ':'메뉴 ';
    $('result-count').textContent=list.length;
    $('saved-count').textContent=state.saved.length;
    $('saved-nav').classList.toggle('active',state.savedOnly);
    $('explore-nav').classList.toggle('active',!state.savedOnly);
    $('saved-nav').toggleAttribute('aria-current',state.savedOnly);if(state.savedOnly)$('saved-nav').setAttribute('aria-current','page');
    $('explore-nav').toggleAttribute('aria-current',!state.savedOnly);if(!state.savedOnly)$('explore-nav').setAttribute('aria-current','page');
    document.querySelectorAll('[data-tag]').forEach(b=>b.setAttribute('aria-pressed',state.tags.includes(b.dataset.tag)));
    $('results').innerHTML=list.length?list.map(p=>`<article class="restaurant-card ${state.selected===p.id?'selected':''}" data-card="${p.id}"><div class="food-art">${art(p)}</div><button class="card-open" data-detail="${p.id}" aria-label="${p.name}, ${p.menu} 상세 보기"><p class="card-meta">${p.district} · ${p.kind} · 가상</p><h3>${p.name}</h3><p class="card-menu">${p.menu}</p><div class="card-bottom"><span class="price">${money(p.price)}</span><span class="card-tag">${M.tagNames[p.tags[0]]}</span></div></button><button class="save-button" data-save="${p.id}" aria-label="${p.name} 메뉴 저장" aria-pressed="${state.saved.includes(p.id)}">${state.saved.includes(p.id)?'♥':'♡'}</button></article>`).join(''):`<div class="empty-state"><div class="empty-icon">⌕</div><h3>${state.savedOnly?'조건에 맞는 저장 메뉴가 없어요':'이 조건의 메뉴는 아직 없어요'}</h3><p>${state.savedOnly?'탐색 화면에서 하트를 눌러 담아보세요.':'조건을 줄이거나 다른 메뉴명으로 찾아보세요.'}<br>지금은 가상 메뉴 6개로 살펴볼 수 있어요.</p><button id="empty-reset">전체 메뉴 보기</button></div>`;
    $('map-pins').innerHTML=list.map((p,i)=>`<button class="map-pin ${p.id===state.selected?'selected':''}" data-select="${p.id}" aria-label="${p.name} 지도에서 선택" aria-pressed="${p.id===state.selected}" style="left:${p.x}%;top:${p.y}%"><span class="pin-number">${i+1}</span>${p.name}</button>`).join('');
    const p=list.find(p=>p.id===state.selected);
    $('map-selection').hidden=!p;
    if(p)$('map-selection').innerHTML=`<div class="selection-main"><div class="food-art">${art(p)}</div><div><h3>${p.name}</h3><p>${p.menu}</p></div></div><div class="selection-action"><span>${money(p.price)} · 예시 가격</span><button data-detail="${p.id}">상세 보기 ↗</button></div>`;
    window.MealMap?.render(list,state.selected);
    $('live-status').textContent=`조건에 맞는 가상 메뉴 ${list.length}개`;
  }
  function reset(){Object.assign(state,{query:'',tags:[],budget:999999,district:'전체',sort:'default',savedOnly:false});$('search').value='';$('budget').value='999999';$('district').value='전체';$('sort').value='default';render();}
  $('results').addEventListener('click',e=>{const s=e.target.closest('[data-save]');if(s){toggleSave(s.dataset.save);document.querySelector(`[data-save="${s.dataset.save}"]`)?.focus();return;}const d=e.target.closest('[data-detail]');if(d)showDetail(d.dataset.detail);if(e.target.closest('#empty-reset'))reset();});
  $('map-pins').addEventListener('click',e=>{const b=e.target.closest('[data-select]');if(b){state.selected=b.dataset.select;render();document.querySelector(`[data-select="${state.selected}"]`)?.focus();if(window.innerWidth>760)document.querySelector(`[data-card="${state.selected}"]`)?.scrollIntoView({block:'nearest'});}});
  $('map-selection').addEventListener('click',e=>{const b=e.target.closest('[data-detail]');if(b)showDetail(b.dataset.detail);});
  $('search-form').addEventListener('submit',e=>{e.preventDefault();state.query=$('search').value;render();});
  $('search').addEventListener('input',()=>{state.query=$('search').value;render();});
  $('preference-chips').addEventListener('click',e=>{const b=e.target.closest('[data-tag]');if(b){const t=b.dataset.tag;state.tags=state.tags.includes(t)?state.tags.filter(x=>x!==t):[...state.tags,t];render();}});
  ['budget','district','sort'].forEach(id=>$(id).addEventListener('change',()=>{state[id]=$(id).value;render();}));
  $('reset').addEventListener('click',reset);
  $('saved-nav').addEventListener('click',()=>{state.savedOnly=true;render();$('results').scrollIntoView({behavior:'smooth',block:'start'});});
  $('explore-nav').addEventListener('click',()=>{state.savedOnly=false;render();});
  ['about-nav','info-button'].forEach(id=>$(id).addEventListener('click',()=>openDialog('about-dialog')));
  $('ask-ai').addEventListener('click',()=>{$('ai-feedback').textContent='';openDialog('ai-dialog');$('ai-input').focus();});
  document.querySelectorAll('[data-prompt]').forEach(b=>b.addEventListener('click',()=>{$('ai-input').value=b.dataset.prompt;$('ai-input').focus();}));
  $('ai-form').addEventListener('submit',e=>{e.preventDefault();const tags=M.interpret($('ai-input').value);if(!tags.length){$('ai-feedback').textContent='이 모의 화면은 채소·따뜻한·단백질·맵지 않은 조건만 알아볼 수 있어요.';return;}state.tags=tags;state.query='';state.savedOnly=false;$('search').value='';render();closeDialog('ai-dialog');$('live-status').textContent='모의 조건 해석: '+tags.map(t=>M.tagNames[t]).join(', ');});
  function zoom(n){if(window.MealMap){window.MealMap.zoom(n===1?0:(n>state.zoom?1:-1));return;}state.zoom=Math.max(.85,Math.min(1.5,n));$('map-world').style.transform=`scale(${state.zoom})`;$('zoom-in').disabled=state.zoom>=1.5;$('zoom-out').disabled=state.zoom<=.85;}
  $('zoom-in').addEventListener('click',()=>zoom(state.zoom+.15));$('zoom-out').addEventListener('click',()=>zoom(state.zoom-.15));$('recenter').addEventListener('click',()=>zoom(1));
  $('mobile-map-toggle').addEventListener('click',()=>{const show=document.body.classList.toggle('map-mode');$('mobile-map-toggle').textContent=show?'지도 보기 ↑':'메뉴 목록 ↓';(show?$('results'):document.querySelector('.map')).scrollIntoView({behavior:'smooth',block:'start'});});
  function showDetail(id){
    const p=M.places.find(p=>p.id===id);state.selected=id;const trigger=document.activeElement;render();
    $('detail-content').innerHTML=`<button class="close-button" data-close="detail-dialog" aria-label="메뉴 상세 닫기">×</button><div class="detail-head"><span class="section-tag">MENU EXPLORER · 가상 데이터</span><div class="detail-hero"><div class="food-art">${art(p)}</div><div><p>${p.district} · ${p.kind}</p><h2 id="detail-title">${p.name}</h2><p class="detail-submenu">${p.menu}</p><p>${money(p.price)} · 예시 가격</p></div></div></div><div class="detail-tabs" role="tablist" aria-label="상세 정보"><button role="tab" id="tab-menu" aria-controls="detail-panel" aria-selected="true" data-tab="menu">메뉴 정보</button><button role="tab" id="tab-evidence" aria-controls="detail-panel" aria-selected="false" tabindex="-1" data-tab="evidence">추천 근거</button><button role="tab" id="tab-graph" aria-controls="detail-panel" aria-selected="false" tabindex="-1" data-tab="graph">관계 지도</button></div><div class="detail-body" id="detail-panel" role="tabpanel" aria-labelledby="tab-menu" tabindex="0"></div><div class="detail-footer"><span>실제 음식점이 아니므로 상세 링크를 제공하지 않아요.</span><button disabled>잇플 연동 준비 중 ↗</button></div>`;
    function setTab(tab){
      $('detail-content').querySelectorAll('[data-tab]').forEach(b=>{const on=b.dataset.tab===tab;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;});$('detail-panel').setAttribute('aria-labelledby','tab-'+tab);
      if(tab==='menu')$('detail-panel').innerHTML=`<p>${p.reason}</p><div class="nutrient-grid">${[['열량',p.calories,'kcal'],['단백질',p.protein,'g'],['탄수화물',p.carbs,'g'],['지방',p.fat,'g']].map(([name,v,u])=>`<div class="nutrient"><strong>${M.formatNutrient(v,u)}</strong><span>${name}</span></div>`).join('')}</div><p class="notice">${p.basis} · 가상 영양값 · 실제 측정·식약처 데이터 아님</p><details class="more-info"><summary>섭취 전 확인</summary><p>${p.caution}</p></details>`;
      if(tab==='evidence')$('detail-panel').innerHTML=`<h3>추천이 만들어질 경로</h3><p>실제 데이터 연결 전, 근거를 확인하는 경험을 미리 살펴보세요.</p><div class="evidence-steps"><div class="evidence-step"><b>1</b><div><strong>식당 → 실제 메뉴 확인</strong><p>지금은 가상 메뉴입니다. 판매 메뉴·확인일·허용된 출처를 연결할 예정이에요.</p></div></div><div class="evidence-step"><b>2</b><div><strong>메뉴 → 식약처 유사 음식 후보</strong><p>음식코드와 기준량을 확인해 매칭해요. 현재 매칭된 공식 항목은 없어요.</p></div></div><div class="evidence-step"><b>3</b><div><strong>조건 비교 → 설명</strong><p>계산은 코드가, 설명은 AI가 맡는 구조를 계획하고 있어요. 현재 설명은 미리 작성한 문장입니다.</p></div></div></div><p class="notice">자료가 연결된 뒤에도 유사 음식의 참고값이며, 해당 식당 메뉴의 실측값으로 표시하지 않아요.</p>`;
      if(tab==='graph')$('detail-panel').innerHTML=`<h3>음식의 근거를 따라가요</h3><p>Wiki + Graphify를 연결할 예정인 관계 화면 예시입니다. 실제 그래프 추출 결과가 아니에요.</p><div class="graph"><div class="graph-node">${p.name}<small>가상 식당</small></div><div class="graph-arrow">↓</div><div class="graph-node">${p.menu}<small>가상 메뉴</small></div><div class="graph-arrow">↓</div><div class="graph-node">유사 음식 후보 확인 필요<small>식약처 음식코드 미연결</small></div><div class="graph-arrow">↓</div><div class="graph-leaves"><div class="graph-node">기준량·영양성분<small>검증 데이터 필요</small></div><div class="graph-node">출처·확인일<small>근거 Wiki 예정</small></div></div></div>`;
    }
    setTab('menu');
    $('detail-content').querySelectorAll('[data-tab]').forEach((b,i,all)=>{b.addEventListener('click',()=>setTab(b.dataset.tab));b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%all.length;if(e.key==='ArrowLeft')next=(i+all.length-1)%all.length;if(e.key==='Home')next=0;if(e.key==='End')next=all.length-1;if(next!==undefined){e.preventDefault();setTab(all[next].dataset.tab);all[next].focus();}});});
    lastDialogTrigger=trigger?.isConnected?trigger:document.querySelector(`[data-detail="${id}"]`);$('detail-dialog').showModal();
  }
  render();
})();
