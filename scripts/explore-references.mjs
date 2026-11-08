import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:false});
for(const [id,url]of [ ['chanel','https://www.chanel.com/fr/parfums/bleu-de-chanel/les-fragrances/'], ['dg','https://beautytools.dolcegabbana.com/en-id/velvet/layering?utm_source=chatgpt.com'] ]){
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 try{await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(2500);
 await page.screenshot({path:`docs/reference-motion-study/${id}-entry.png`});
 await writeFile(`docs/reference-motion-study/${id}-entry-dom.txt`,await page.locator('body').innerText());
 console.log(id,await page.title(),(await page.locator('body').innerText()).slice(0,7000));
 }catch(e){console.log(id,e.message)}
 await page.close();
}await browser.close();
