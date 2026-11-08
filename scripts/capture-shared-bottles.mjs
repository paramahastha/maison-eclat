import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const b=await chromium.launch({headless:false});const report=[];
for(const [name,width,height] of [['desktop',1440,900],['phone',375,812]]){
 const p=await b.newPage({viewport:{width,height}});const errors=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await p.goto('http://localhost:3001');await p.locator('.story-canvas-shell[data-ready="true"]').waitFor();
 for(const [i,id] of ['obsidian','neroli','santal'].entries()){
  if(i){await p.locator('.variant-selector button').nth(i).click();await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));}
  await p.waitForTimeout(1200);await p.screenshot({path:`docs/screenshots/shared-bottles/${name}-home-${id}.png`});
 }
 for(const slug of ['obsidian-01','neroli-02','santal-03']){
  await p.goto(`http://localhost:3001/fragrances/${slug}`);await p.locator('.product-inspector[data-ready="true"]').waitFor();await p.waitForTimeout(6500);await p.screenshot({path:`docs/screenshots/shared-bottles/${name}-detail-${slug}.png`});
 }
 report.push({name,errors});await p.close();
}
await writeFile('docs/screenshots/shared-bottles/report.json',JSON.stringify(report,null,2));await b.close();
