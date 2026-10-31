import {mkdir} from 'node:fs/promises';
import {createServer} from 'vite';
import {chromium} from '@playwright/test';
const server=await createServer({server:{host:'127.0.0.1',port:5189,strictPort:true}});await server.listen();
const routes=['/','/signin','/onboarding','/dashboard','/planner','/agent','/tasks','/analytics','/progress','/focus','/knowledge','/memory','/exam-readiness','/digital-twin','/adaptation','/agent-history','/profile','/settings','/activity','/achievements','/resources'].filter(route=>!process.env.QA_ONLY||route===process.env.QA_ONLY);
const failures=[];let browser,checks=0;
try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage();page.on('pageerror',e=>failures.push(e.message));await mkdir('qa/captures',{recursive:true});
 for(const width of [1440,1280,768,390]){
  await page.setViewportSize({width,height:width===390?844:900});
  for(const route of routes){
   await page.goto('http://127.0.0.1:5189'+route,{waitUntil:'networkidle'});await page.evaluate(async()=>{await Promise.all([400,500,600,700,800].map(w=>document.fonts.load(`${w} 14px Manrope`)));await document.fonts.ready});
   const result=await page.evaluate(()=>{
    const visible=e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0;
    const bad=[...document.querySelectorAll('body *')].filter(e=>visible(e)&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&!['SCRIPT','STYLE'].includes(e.tagName)&&!getComputedStyle(e).fontFamily.includes('Manrope')).map(e=>({tag:e.tagName,font:getComputedStyle(e).fontFamily}));
    const weights=[400,500,600,700,800].every(w=>document.fonts.check(`${w} 14px Manrope`));
    return {bad,weights,titleWeight:getComputedStyle(document.querySelector('h1')).fontWeight,tabular:getComputedStyle(document.body).fontVariantNumeric,overflow:document.documentElement.scrollWidth>innerWidth+1,offenders:[...document.querySelectorAll('*')].filter(e=>visible(e)&&e.getBoundingClientRect().right>innerWidth+1).slice(0,4).map(e=>({tag:e.tagName,cls:typeof e.className==='string'?e.className:'',right:e.getBoundingClientRect().right,style:getComputedStyle(e).cssText,parents:[e.parentElement,e.parentElement.parentElement].map(p=>({cls:p.className,width:p.getBoundingClientRect().width,font:getComputedStyle(p).fontSize,wrap:getComputedStyle(p).whiteSpace}))}))};
   });
   if(result.bad.length||!result.weights||result.titleWeight!=='700'||!result.tabular.includes('tabular-nums')||result.overflow)failures.push({width,route,...result});else checks++;
   if([1440,390].includes(width)&&['/dashboard','/signin','/analytics','/focus'].includes(route))await page.screenshot({path:`qa/captures/type-${route.slice(1)}-${width}.png`});
  }
 }
 await page.goto('http://127.0.0.1:5189/tasks');await page.getByRole('button',{name:'Add task',exact:true}).click();
 const modal=await page.locator('.modal').evaluate(e=>({font:getComputedStyle(e).fontFamily,label:getComputedStyle(e.querySelector('label')).fontWeight,button:getComputedStyle(e.querySelector('button')).fontWeight}));
 if(!modal.font.includes('Manrope')||modal.label!=='500'||modal.button!=='600')failures.push({modal});else checks++;
}finally{await browser?.close();await server.close()}
console.log(JSON.stringify({checks,failures},null,2));if(failures.length)process.exitCode=1;
