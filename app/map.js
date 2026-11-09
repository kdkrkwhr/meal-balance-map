/* Real basemap, explicitly fictional markers. Never geolocate or prefetch tiles. */
(function () {
  'use strict';
  if (!window.L) return;
  const coords = {
    green:[37.5622,126.9230], soup:[37.5509,126.9144],
    bowl:[37.5588,126.9280], fish:[37.5548,126.9203],
    salad:[37.5660,126.9278], tofu:[37.5590,126.9135]
  };
  const center=[37.5585,126.9210];
  const map=L.map('live-map',{zoomControl:false,minZoom:12,maxZoom:18,scrollWheelZoom:false}).setView(center,14);
  map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19,keepBuffer:0,updateWhenIdle:true,updateWhenZooming:false,
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).on('tileerror',()=>{document.getElementById('map-error').hidden=false;}).addTo(map);
  const layer=L.layerGroup().addTo(map);
  document.querySelector('.map').classList.add('real-map');
  window.MealMap={
    render(places,selected){
      layer.clearLayers();
      for(const p of places){
        L.marker(coords[p.id],{
          title:p.name+' (가상 식당)',alt:p.name+' 가상 메뉴 선택',
          icon:L.divIcon({className:'meal-marker '+(p.id===selected?'is-selected':''),html:'<span>'+p.name+'<small>가상</small></span>',iconSize:[104,34],iconAnchor:[52,34]})
        }).on('click',()=>{
          document.querySelector('[data-select="'+p.id+'"]')?.click();
          document.querySelector('.meal-marker[title="'+p.name+' (가상 식당)"]')?.focus({preventScroll:true});
        }).addTo(layer);
      }
    },
    zoom(direction){if(direction===0)map.setView(center,14);else if(direction>0)map.zoomIn();else map.zoomOut();}
  };
  new ResizeObserver(()=>map.invalidateSize({pan:false})).observe(document.getElementById('live-map'));
})();
