/* Fictional UI fixtures only. No restaurant, MFDS, or AI response is used. */
(function(root) {
  const places = [
    {id:'green', name:'초록식탁', district:'연남', kind:'한식 · 채소 중심', menu:'구운 채소와 두부 보리밥', price:12500, tags:['vegetable','warm','protein'], color:'#b7c99b', art:'bowl', x:56, y:32, calories:124, protein:6.2, carbs:18, fat:3.1, reason:'채소·곡류·두부를 함께 담은 메뉴예요. 한 가지 식품에 치우치지 않는 구성을 살펴볼 수 있어요.', caution:'밥과 소스의 실제 양에 따라 영양 구성이 달라져요.'},
    {id:'soup', name:'온기부엌', district:'합정', kind:'한식 · 따뜻한 국물', menu:'닭고기 맑은 곰탕', price:11000, tags:['warm','protein','mild'], color:'#d5bb8f', art:'soup', x:31, y:66, calories:68, protein:8.4, carbs:3.2, fat:2.4, reason:'따뜻한 국물과 닭고기가 있는 메뉴예요. 곁들일 채소나 반찬 구성도 함께 확인해 보세요.', caution:'국물의 나트륨과 밥의 양은 확인되지 않았어요.'},
    {id:'bowl', name:'곡물의 시간', district:'연남', kind:'한식 · 곡물 한 그릇', menu:'버섯 보리 비빔밥', price:10500, tags:['vegetable','warm'], color:'#c8b38e', art:'bowl', x:71, y:48, calories:132, protein:4.1, carbs:24, fat:2.3, reason:'곡류와 여러 채소를 함께 먹는 한 그릇이에요. 단백질 식품을 곁들일 수 있는지도 살펴보세요.', caution:'달걀 포함 여부와 양념의 양은 별도 확인이 필요해요.'},
    {id:'fish', name:'바다한상', district:'합정', kind:'한식 · 생선 한 상', menu:'고등어구이와 잡곡밥', price:15000, tags:['warm','protein'], color:'#9eb8ad', art:'fish', x:43, y:49, calories:164, protein:12, carbs:14, fat:6.7, reason:'생선과 곡류를 함께 담은 메뉴예요. 구운 생선 외에 반찬 구성도 비교해 볼 수 있어요.', caution:'생선 크기, 소금 간과 반찬 종류는 알 수 없어요.'},
    {id:'salad', name:'한낮의 볼', district:'연남', kind:'샐러드 · 가벼운 한 끼', menu:'병아리콩 채소볼', price:13000, tags:['vegetable','mild'], color:'#b7c89c', art:'salad', x:79, y:23, calories:112, protein:5.5, carbs:15, fat:3.8, reason:'콩류와 채소를 함께 살펴볼 수 있는 메뉴예요. 충분한 한 끼인지는 실제 제공량에 따라 달라져요.', caution:'드레싱은 별도 선택 여부를 확인해 주세요.'},
    {id:'tofu', name:'담담한 끼', district:'합정', kind:'한식 · 담백한 식사', menu:'들깨 두부 채소탕', price:13500, tags:['vegetable','warm','protein','mild'], color:'#b4c4c5', art:'soup', x:24, y:37, calories:83, protein:6, carbs:4.8, fat:null, reason:'두부와 채소가 있는 따뜻한 메뉴예요. 재료 구성이 보이는 음식부터 비교해 보세요.', caution:'들깨와 양념의 양을 알 수 없어 일부 영양정보는 비워뒀어요.'}
  ].map(p => ({...p, fictional:true, basis:'100g · 화면 예시'}));
  const tagNames = {vegetable:'채소 함께', warm:'따뜻한 한 끼', protein:'단백질 식품', mild:'맵지 않게'};
  function filterPlaces({query='',tags=[],budget=Infinity,district='전체',savedOnly=false,saved=[],sort='default'}={}) {
    const q=query.trim().toLowerCase();
    const out=places.filter(p=>(!q||`${p.name} ${p.menu} ${p.kind} ${p.district}`.toLowerCase().includes(q))&&tags.every(t=>p.tags.includes(t))&&p.price<=Number(budget)&&(district==='전체'||p.district===district)&&(!savedOnly||saved.includes(p.id)));
    return sort==='price'?out.sort((a,b)=>a.price-b.price):out;
  }
  function interpret(text) { return Object.entries({vegetable:/채소|야채/,warm:/따뜻|국물/,protein:/단백질/,mild:/맵지|안 매운|순한/}).filter(([,re])=>re.test(text)).map(([tag])=>tag); }
  function formatNutrient(value,unit) {return value==null?'정보 없음':`${value}${unit}`;}
  const api={places,tagNames,filterPlaces,interpret,formatNutrient};
  if(typeof module!=='undefined'&&module.exports) module.exports=api; else root.MealModel=api;
})(typeof globalThis==='undefined'?window:globalThis);
