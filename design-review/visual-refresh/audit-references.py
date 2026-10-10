import asyncio, json
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parents[2]
OUT=Path(__file__).resolve().parent
SITES=['dranweshapoddar_com_scraped','garekarsmdskinclinic_com_scraped','isyaderm_com_scraped','www_clinicdermatech_com_scraped']

async def main():
 report=[]
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe',headless=True)
  page=await browser.new_page(viewport={'width':1440,'height':1000})
  await page.route('**/*',lambda route: route.continue_() if route.request.url.startswith(('http://127.0.0.1','data:','blob:')) else route.abort())
  for site in SITES:
   doc=BeautifulSoup((ROOT/'Homepage-Refference'/site/'scraped_site/pages/index.html').read_text(encoding='utf-8'),'html.parser')
   await page.goto('http://127.0.0.1:8000/Homepage-Refference/'+site+'/scraped_site/pages/index.html',wait_until='domcontentloaded')
   await page.wait_for_timeout(900)
   height=await page.evaluate('document.documentElement.scrollHeight')
   for y in range(0,min(height,30000),850):
    await page.evaluate('(y)=>scrollTo(0,y)',y);await page.wait_for_timeout(80)
   await page.evaluate('scrollTo(0,0)');await page.wait_for_timeout(500)
   await page.screenshot(path=str(OUT/(site+'-complete.png')),full_page=True)
   headings=await page.locator('h1,h2,h3,.section-title,.wdt-heading-title').evaluate_all('''nodes=>nodes.map(e=>({title:e.textContent.trim().replace(/\\s+/g,' '),top:Math.round(e.getBoundingClientRect().top+scrollY),width:Math.round(e.getBoundingClientRect().width)})).filter(e=>e.title&&e.title.length<160&&e.width>0)''')
   report.append({'site':site,'height':height,'sections':headings,'photographs':len(doc.select('img')),'stylesheets':len(doc.select('link[rel=stylesheet]'))})
  for site,sel,name in [('dranweshapoddar_com_scraped','.elementor-element-10f37f4','numbered-treatments'),('garekarsmdskinclinic_com_scraped','#explore-services','service-mosaic'),('garekarsmdskinclinic_com_scraped','section.testimonials','blurred-appointment')]:
   await page.goto('http://127.0.0.1:8000/Homepage-Refference/'+site+'/scraped_site/pages/index.html',wait_until='domcontentloaded');await page.wait_for_timeout(600)
   n=page.locator(sel);await n.scroll_into_view_if_needed();await page.wait_for_timeout(800)
   await n.screenshot(path=str(OUT/(name+'-reference.png')))
  await browser.close()
 (OUT/'reference-audit.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
 print('Audited all four complete homepages. Saved complete captures, section inventories, and the three highlighted layouts.')

asyncio.run(main())
