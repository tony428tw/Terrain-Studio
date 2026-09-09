// WGS84 local tangent approximation, appropriate for the <=10 km selection.
export function describeBounds(b){
 const {south,north,west,east}=b;
 if(![south,north,west,east].every(Number.isFinite)||south>=north||west>=east||south< -85||north>85||west< -180||east>180)throw Error('範圍無效；不支援跨越換日線');
 const latitude=(south+north)/2,longitude=(west+east)/2;
 const w=(east-west)*111320*Math.cos(latitude*Math.PI/180),h=(north-south)*111320;
 if(w<90||h<90||w>10000.01||h>10000.01)throw Error('東西與南北尺寸皆須介於 90–10,000 m');
 return {latitude,longitude,w,h};
}
export function centeredBounds(lat,lon,w,h=w){const dy=h/222640,dx=w/(222640*Math.cos(lat*Math.PI/180));const b={south:lat-dy,north:lat+dy,west:lon-dx,east:lon+dx};describeBounds(b);return b}
export function demSamples(b){const d=describeBounds(b),nx=Math.min(21,Math.ceil(d.w/90)+1),ny=Math.min(21,Math.ceil(d.h/90)+1),points=[];for(let j=0;j<ny;j++)for(let i=0;i<nx;i++)points.push({lat:b.south+(b.north-b.south)*j/(ny-1),lon:b.west+(b.east-b.west)*i/(nx-1)});return {...d,nx,ny,points}}
export function resampleDEM(values,nx,ny,n){if(values.length!==nx*ny||!values.every(Number.isFinite))throw Error('高程回傳不完整');return Array.from({length:(n+1)**2},(_,k)=>{const x=k%(n+1)/n*(nx-1),y=Math.floor(k/(n+1))/n*(ny-1),i=Math.min(nx-2,Math.floor(x)),j=Math.min(ny-2,Math.floor(y)),u=x-i,v=y-j;return values[j*nx+i]*(1-u)*(1-v)+values[j*nx+i+1]*u*(1-v)+values[(j+1)*nx+i]*(1-u)*v+values[(j+1)*nx+i+1]*u*v})}
