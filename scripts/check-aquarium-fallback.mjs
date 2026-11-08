import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:false});const results=[];
for(const noFloat of [false,true]){
 const page=await browser.newPage({viewport:{width:1440,height:900}}); const errors=[];
 await page.addInitScript(({noFloat})=>{
  window.__draws=0;
  for(const Class of [WebGLRenderingContext,WebGL2RenderingContext]){
   const get=Class.prototype.getExtension;
   Class.prototype.getExtension=function(name){return noFloat&&name==='EXT_color_buffer_float'?null:get.call(this,name)};
   for(const name of ['drawElements','drawArrays']){const orig=Class.prototype[name];Class.prototype[name]=function(...args){window.__draws++;return orig.apply(this,args)}}
  }
 },{noFloat});
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto('http://localhost:3001/fragrances/santal-03');await page.locator('[data-ready="true"]').waitFor();await page.waitForTimeout(7000);
 await page.screenshot({path:`docs/screenshots/aquarium-entry/${noFloat?'no-float':'float'}-ready.png`});
 await page.evaluate(()=>window.scrollTo({top:document.body.scrollHeight,behavior:'instant'}));await page.waitForTimeout(1500);
 const paused=await page.evaluate(async()=>{const before=window.__draws;await new Promise(r=>setTimeout(r,1000));return {draws:window.__draws-before,rect:document.querySelector('.product-inspector').getBoundingClientRect().toJSON()}});
 results.push({noFloat,errors,paused});await page.close();
}
await browser.close();await writeFile('docs/screenshots/aquarium-entry/fallback-report.json',JSON.stringify(results,null,2));
