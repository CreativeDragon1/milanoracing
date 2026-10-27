const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async()=>{
 const browser = await chromium.launch({channel:'msedge',headless:true});
 const page = await browser.newPage({reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const report=[];
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:1000});
  for(const route of ['/','/journal','/journal/livery']){
   await page.goto('http://127.0.0.1:5194'+route,{waitUntil:'networkidle'});
   const pic=page.locator('.livery-reveal-photo').first();
   await pic.scrollIntoViewIfNeeded();
   await page.waitForTimeout(500);
   assert(await pic.evaluate(img=>img.complete&&img.naturalWidth>0));
   assert(!(await page.locator('body').innerText()).match(/under wraps|revealed on release day/i));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width+route);
   const key=route==='/'?'home':route.replaceAll('/','-');
   await page.screenshot({path:`qa/livery-${width}-${key}.png`});
   report.push({width,route,loaded:true,noOverflow:true});
  }
 }
 assert.equal(errors.length,0,errors.join('\n'));
 fs.writeFileSync('qa/livery-reveal-results.json',JSON.stringify({passed:true,routes:report,errors},null,2));
 await browser.close();console.log('Passed: six desktop/mobile route checks.');
})().catch(e=>{console.error(e);process.exit(1)});
