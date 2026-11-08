import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const out='docs/screenshots/aquarium-fall';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:false});
const report=[];
for(const [name,width,height] of [['desktop',1440,900],['tablet',768,1024],['phone',375,812]]) {
 const context=await browser.newContext({viewport:{width,height},recordVideo:{dir:out,size:{width,height}}});
 const page=await context.newPage(); const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 let release; const held=new Promise(r=>release=r);
 await page.route('**/*.glb',async route=>{await held;await route.continue();});
 await page.goto('http://localhost:3001/fragrances/obsidian-01');
 await page.locator('.product-inspector').scrollIntoViewIfNeeded();
 await page.screenshot({path:`${out}/${name}-preparing.png`});
 release();await page.locator('.product-inspector[data-ready="true"]').waitFor();
 const start=Date.now();
 for(const [label,ms] of [['handoff',150],['fall',650],['impact',1100],['settling',2100],['ready',6500]]) {
   await page.waitForTimeout(Math.max(1,ms-(Date.now()-start)));
   await page.screenshot({path:`${out}/${name}-${label}.png`});
 }
 await page.getByRole('button',{name:'Rotate bottle right'}).click();
 await page.getByRole('button',{name:'Reset view'}).click();
 report.push({name,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
 await context.close();
}
await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
await browser.close();
