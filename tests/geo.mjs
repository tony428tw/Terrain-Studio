import assert from 'node:assert/strict';
import {centeredBounds,describeBounds,demSamples,resampleDEM} from '../dist/geo.js';
for(const lat of [-80,0,24.0675,80]){const d=describeBounds(centeredBounds(lat,120,1800,900));assert.ok(Math.abs(d.w-1800)<1e-6);assert.ok(Math.abs(d.h-900)<1e-6)}
assert.throws(()=>centeredBounds(NaN,120,1000));assert.throws(()=>centeredBounds(0,180,1000));assert.throws(()=>centeredBounds(24,120,30));
const b=centeredBounds(24,120,1800,900),q=demSamples(b);assert.ok(q.points.length<=441);assert.equal(q.points[0].lat,b.south);assert.equal(q.points.at(-1).lat,b.north);assert.equal(q.points.at(-1).lon,b.east);
const z=q.points.map((_,i)=>3*(i%q.nx)/(q.nx-1)+5*Math.floor(i/q.nx)/(q.ny-1));const out=resampleDEM(z,q.nx,q.ny,80);for(let j=0;j<=80;j++)for(let i=0;i<=80;i++)assert.ok(Math.abs(out[j*81+i]-(3*i/80+5*j/80))<1e-10);
assert.throws(()=>resampleDEM([null,0,0,0],2,2,80));
console.log('PASS rectangular bounds, latitude conversion, limits, south/north orientation, DEM planar reconstruction and incomplete data');
