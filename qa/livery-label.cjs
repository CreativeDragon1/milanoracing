const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const report=[];
 for(const reducedMotion of ['reduce','no-preference']){
  const page=await browser.newPage({reducedMotion});
  for(const width of [320,390,1440]){
   await page.setViewportSize({width,height:1000});
   await page.goto('http://127.0.0.1:5194/journal/livery',{waitUntil:'networkidle'});
   const label=page.locator('.livery-reveal-label');
   await label.scrollIntoViewIfNeeded();
   await page.waitForTimeout(1000);
   const styles=await label.evaluate(el=>{const s=getComputedStyle(el),p=el.parentElement.getBoundingClientRect(),r=el.getBoundingClientRect();return {font:s.fontFamily,bg:s.backgroundColor,opacity:s.opacity,inside:r.left>=p.left&&r.right<=p.right,orange:getComputedStyle(el.lastElementChild).backgroundColor,clip:getComputedStyle(el.lastElementChild).clipPath,text:el.innerText};});
   assert(styles.font.includes('Michroma'));assert.equal(styles.bg,'rgb(0, 25, 255)');assert.equal(styles.orange,'rgb(255, 122, 0)');assert.equal(styles.opacity,'1');assert(styles.inside);assert(styles.text.includes('REVEALED'));
   assert(await page.getByText('Ready for Nationals.',{exact:true}).isVisible());
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   report.push({width,reducedMotion,...styles});
   if(reducedMotion==='no-preference'&&width!==320) await page.screenshot({path:`qa/livery-label-${width}.png`});
  }
  await page.close();
 }
 await browser.close();fs.writeFileSync('qa/livery-label-results.json',JSON.stringify({passed:true,checks:report},null,2));console.log('Passed typography, brand colours, animation end state, reduced motion and mobile fit.');
})().catch(e=>{console.error(e);process.exit(1)});
