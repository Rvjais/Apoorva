import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'design-review/extracted-sections'
OUT.mkdir(parents=True,exist_ok=True)

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe',headless=True)
  page=await browser.new_page(viewport={'width':1440,'height':1000},device_scale_factor=1,reduced_motion='reduce')
  errors=[];missing=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:missing.append(r.url) if r.status>=400 else None)
  await page.goto('http://127.0.0.1:8000',wait_until='networkidle')
  await page.evaluate('document.fonts.ready')
  for sel,name in [('.reference-gallery','treatment-gallery'),('#about','why-skinic'),('#your-visit','consultation'),('#clinical-care','clinical-care')]:
   await page.locator(sel).scroll_into_view_if_needed()
   await page.locator(sel).screenshot(path=str(OUT/(name+'-desktop.png')),style='.site-header,.mobile-care-bar,.skip-link { visibility: hidden !important; }')
  await page.evaluate('scrollTo(0,0)');await page.wait_for_timeout(150)
  await page.screenshot(path=str(OUT/'homepage-desktop.png'),full_page=True)
  # Native galleries: category changes, scrolling, and actual service buttons.
  assert await page.locator('.gallery-slide:not([hidden])').count()==4
  await page.locator('[data-gallery-direction="1"]').click()
  assert await page.locator('.gallery-track').evaluate('e=>e.scrollLeft')>0
  await page.locator('[data-gallery-category="hair"]').click()
  assert await page.locator('.gallery-slide:not([hidden])').count()==3
  assert await page.locator('.gallery-track').evaluate('e=>e.scrollLeft')==0
  await page.locator('.gallery-slide:not([hidden]) .gallery-card').first.click()
  assert await page.locator('#consultation-dialog').evaluate('e=>e.open')
  assert 'Hair fall' in await page.locator('#dialog-title').inner_text()
  await page.keyboard.press('Escape')
  await page.locator('[data-gallery-category="laser"]').click()
  assert await page.locator('.gallery-slide:not([hidden])').count()==2
  await page.locator('[data-gallery-category="skin"]').click()
  await page.locator('[data-care-direction="1"]').click()
  assert await page.locator('.care-track').evaluate('e=>e.scrollLeft')>0
  await page.locator('.care-card-link').nth(1).click()
  assert await page.locator('#consultation-dialog').evaluate('e=>e.open')
  await page.keyboard.press('Escape')
  await page.locator('.why-photo-cta').click()
  assert await page.locator('#dialog-title').inner_text()=='Request a consultation'
  await page.keyboard.press('Escape')
  assert await page.locator('.treatment-card').count()==19
  await page.locator('[data-filter="hair"]').click()
  assert await page.locator('.treatment-card:not([hidden])').count()==3
  await page.locator('[data-filter="all"]').click()
  await page.locator('[data-concern="hair"]').click()
  assert 'Hair' in await page.locator('#care-title').inner_text()
  await page.locator('[data-concern="acne"]').click()
  await page.locator('#quick-name').fill('Preview Patient')
  await page.locator('#quick-phone').fill('9876543210')
  await page.locator('#quick-appointment').click()
  assert await page.locator('#consultation-form [name="name"]').input_value()=='Preview Patient'
  await page.keyboard.press('Escape')
  await page.locator('#quick-name').fill('')
  await page.locator('#quick-phone').fill('')
  results=[]
  for width in [1440,1024,800,768,520,390,320]:
   await page.set_viewport_size({'width':width,'height':900})
   await page.wait_for_timeout(120)
   metrics=await page.evaluate('''()=>({viewport:innerWidth,page:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src)})''')
   assert metrics['page']<=width,metrics
   assert not metrics['broken'],metrics
   results.append(metrics)
   if width in [390,768]:
    await page.evaluate('document.activeElement.blur();scrollTo(0,0)');await page.wait_for_timeout(150)
    await page.screenshot(path=str(OUT/f'homepage-{width}.png'),full_page=True)
   if width==390:
    await page.locator('#menu-toggle').click()
    assert await page.locator('#menu-toggle').get_attribute('aria-expanded')=='true'
    await page.locator('#mobile-nav a[href="#treatments"]').click()
    assert await page.locator('#menu-toggle').get_attribute('aria-expanded')=='false'
    for sel,name in [('#about','why-skinic'),('#your-visit','consultation'),('#clinical-care','clinical-care'),('.reference-gallery','treatment-gallery')]:
     await page.locator(sel).screenshot(path=str(OUT/(name+'-mobile.png')),style='.site-header,.mobile-care-bar,.skip-link { visibility: hidden !important; }')
  assert not errors,errors
  assert not missing,missing
  report={'responsive':results,'javascript_errors':errors,'failed_requests':missing,'checks':['category galleries and scroll controls','gallery service enquiries','dark care service enquiries','split-panel consultation CTA','19 services and hair filter','concern finder','quick enquiry data transfer','mobile navigation']}
  (OUT/'verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
  print(json.dumps(report))
  await browser.close()

asyncio.run(main())
