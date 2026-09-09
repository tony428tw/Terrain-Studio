import {describeBounds} from './geo.js';
export function createMapPicker(onApply){
 const $=id=>document.getElementById(id);let map,rectangle,selection,corner,choosing=false,osm,satellite;
 const hint=t=>$('mapHelp').textContent=t;
 function paint(){if(rectangle)rectangle.remove();rectangle=L.rectangle([[selection.south,selection.west],[selection.north,selection.east]],{color:'#e17b25',weight:3,fillOpacity:.12,interactive:false}).addTo(map);try{let d=describeBounds(selection);$('mapApply').disabled=false;hint(`已選 ${Math.round(d.w)} × ${Math.round(d.h)} m；按「使用此範圍」後再擷取高程。`)}catch(e){$('mapApply').disabled=true;hint(e.message)}}
 function stop(){choosing=false;corner=null;$('mapDraw').classList.remove('selected')}
 function init(){if(!window.L)throw Error('地圖元件未載入，請重新整理；亦可直接輸入座標');map=L.map('geoMap',{worldCopyJump:false,minZoom:3,maxZoom:19});osm=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'});satellite=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,attribution:'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'});osm.addTo(map);L.control.scale({imperial:false}).addTo(map);for(const layer of [osm,satellite])layer.on('tileerror',()=>hint('部分底圖無法載入，可切換底圖或稍後重試。座標輸入仍可使用。'));
 $('mapBase').onchange=()=>{map.removeLayer(osm);map.removeLayer(satellite);($('mapBase').value==='osm'?osm:satellite).addTo(map)};
 $('mapDraw').onclick=()=>{choosing=true;corner=null;$('mapApply').disabled=true;$('mapDraw').classList.add('selected');hint('先點選矩形第一個角，再點對角（手機亦可點選）；可先拖曳平移或縮放。')};
 map.on('click',e=>{if(!choosing)return;if(!corner){corner=e.latlng;hint('再點選對角以完成矩形範圍。');return}selection={south:Math.min(corner.lat,e.latlng.lat),north:Math.max(corner.lat,e.latlng.lat),west:Math.min(corner.lng,e.latlng.lng),east:Math.max(corner.lng,e.latlng.lng)};stop();paint()});
 $('mapApply').onclick=()=>{try{describeBounds(selection);onApply({...selection});$('mapDialog').close()}catch(e){hint(e.message)}};
 $('mapClose').onclick=()=>$('mapDialog').close();$('mapDialog').addEventListener('close',stop);
 }
 return {open(b){if(!map)init();stop();selection={...b};$('mapDialog').showModal();map.invalidateSize();paint();map.fitBounds([[b.south,b.west],[b.north,b.east]],{padding:[35,35]})}};
}
