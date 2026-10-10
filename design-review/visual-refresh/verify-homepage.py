import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright

OUT=Path(__file__).resolve().parent

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe',headless=True)
  page=await browser.new_page(viewport={'width':1440,'height':1000})
  errors=[];failed=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
  await page.goto('http://127.0.0.1:8000',wait_until='networkidle')
  await page.evaluate('document.fonts.ready');await page.wait_for_timeout(1600)
  await page.screenshot(path=str(OUT/'homepage-top-desktop.png'))
  print('Desktop render',await page.evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})'),flush=True)
  assert await page.locator('.campaign-title').first.evaluate('e=>getComputedStyle(e).animationName')=='banner-enter'
  assert await page.locator('.campaign-image img').first.evaluate('e=>getComputedStyle(e).animationName')=='banner-drift'
  await page.wait_for_timeout(5300)
  assert await page.locator('.campaign-slide.is-active').get_attribute('data-hero-slide')=='1','Automatic banner rotation failed'
  await page.locator('#hero-pause').click()
  assert await page.locator('#hero-pause').get_attribute('aria-pressed')=='true'
  await page.locator('[data-hero-dot="0"]').click()
  assert await page.locator('.campaign-slide.is-active').get_attribute('data-hero-slide')=='0'
  assert await page.locator('.campaign-slide[inert]').count()==2
  await page.locator('.nav-dropdown summary').first.click()
  await page.locator('[data-browse="hair"]').click()
  assert await page.locator('#care-directory').evaluate('e=>e.open')
  assert await page.locator('.treatment-card:not([hidden])').count()==3
  await page.locator('[data-filter="all"]').click()
  await page.locator('#treatment-search').fill('acne')
  assert await page.locator('.treatment-card:not([hidden])').count()>0
  await page.locator('#treatment-search').fill('')
  await page.locator('#care-directory').evaluate('e=>e.open=false')
  await page.locator('.mosaic-tile').nth(3).click()
  assert await page.locator('#dialog-title').inner_text()=='Wrinkle treatments'
  await page.locator('#dialog-close').click()
  assert await page.locator('.gallery-slide:not([hidden])').count()==8
  await page.locator('[data-gallery-category="hair"]').click()
  assert await page.locator('.gallery-slide:not([hidden])').count()==2
  await page.locator('.gallery-slide:not([hidden]) .gallery-card').first.click()
  assert await page.locator('#dialog-title').inner_text()=='Hair fall & hair loss'
  await page.locator('#dialog-close').click()
  await page.locator('[data-gallery-category="all"]').click()
  await page.locator('[data-gallery-direction="1"]').click()
  await page.wait_for_timeout(500)
  assert await page.locator('.gallery-track').evaluate('e=>e.scrollLeft')>0
  await page.locator('.gallery-track').evaluate('e=>e.scrollLeft=0')
  await page.locator('[data-concern="hair"]').click()
  assert 'Hair' in await page.locator('#care-title').inner_text()
  await page.locator('[data-concern="acne"]').click()
  # Real form validation and transfer into the reviewable enquiry. No message is sent.
  await page.locator('#quick-appointment').click()
  assert not await page.locator('#consultation-dialog').evaluate('e=>e.open')
  await page.locator('#quick-name').fill('Preview Patient')
  await page.locator('#quick-phone').fill('9876543210')
  await page.locator('#appointment-email').fill('preview@example.com')
  await page.locator('#appointment-time').select_option(label='Afternoon')
  await page.locator('#quick-concern').select_option('Acne treatment')
  await page.locator('#quick-appointment').click()
  assert await page.locator('#dialog-title').inner_text()=='Acne treatment'
  assert await page.locator('#consultation-form [name="name"]').input_value()=='Preview Patient'
  assert 'preview@example.com' in await page.locator('#consultation-form [name="message"]').input_value()
  assert 'Afternoon' in await page.locator('#consultation-form [name="message"]').input_value()
  await page.locator('#dialog-close').click()
  await page.locator('#appointment-request-form').evaluate('e=>e.reset()')
  blur=await page.locator('.appointment-background img').evaluate('e=>getComputedStyle(e).filter')
  assert 'blur(7px)' in blur
  # Capture each selected reference composition without a sticky header crossing it.
  style='.site-header,.mobile-care-bar,.skip-link { visibility: hidden !important; }'
  for sel,name in [('#services','service-mosaic'),('.reference-gallery','numbered-treatments'),('#contact','blurred-appointment'),('#about','why-skinic'),('#your-visit','first-visit')]:
   await page.locator(sel).scroll_into_view_if_needed();await page.wait_for_timeout(1100)
   await page.locator(sel).screenshot(path=str(OUT/(name+'-desktop.png')),style=style)
  # Finish reveal animations throughout the page before a complete capture.
  height=await page.evaluate('document.documentElement.scrollHeight')
  for y in range(0,height,650):
   await page.evaluate('(y)=>scrollTo(0,y)',y);await page.wait_for_timeout(120)
  await page.wait_for_timeout(1100)
  await page.evaluate('document.activeElement.blur();scrollTo(0,0)');await page.wait_for_timeout(200)
  await page.screenshot(path=str(OUT/'homepage-desktop.png'),full_page=True)
  assert await page.locator('[data-count="6"]').inner_text()=='6'
  assert await page.locator('[data-count="19"]').inner_text()=='19'
  assert await page.locator('.is-revealed').count()>20
  metrics=[]
  for width in [1920,1440,1280,1024,950,800,768,700,520,440,390,360,320]:
   await page.set_viewport_size({'width':width,'height':950});await page.wait_for_timeout(200)
   measure=await page.evaluate('''()=>({width:innerWidth,page:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)})''')
   metrics.append(measure)
   assert measure['page']<=width,measure
   assert not measure['broken'],measure
   if width in [390,768]:
    await page.evaluate('scrollTo(0,0)');await page.wait_for_timeout(150)
    await page.screenshot(path=str(OUT/f'homepage-top-{width}.png'))
    await page.screenshot(path=str(OUT/f'homepage-{width}.png'),full_page=True)
   if width==390:
    await page.locator('#menu-toggle').click()
    assert await page.locator('#menu-toggle').get_attribute('aria-expanded')=='true'
    await page.locator('#mobile-nav a[href="#treatments"]').click()
    assert await page.locator('#menu-toggle').get_attribute('aria-expanded')=='false'
    for sel,name in [('#services','service-mosaic'),('.reference-gallery','numbered-treatments'),('#contact','blurred-appointment')]:
     await page.locator(sel).screenshot(path=str(OUT/(name+'-mobile.png')),style=style)
  await page.emulate_media(reduced_motion='reduce')
  assert await page.locator('.campaign-slide.is-active .campaign-title').evaluate('e=>getComputedStyle(e).animationName')=='none'
  assert await page.locator('#hero-pause').get_attribute('aria-pressed')=='true'
  assert not errors,errors
  assert not failed,failed
  report={'responsive':metrics,'javascript_errors':errors,'failed_requests':failed,'verified':['rounded banner and auto/manual/pause controls','inactive slides inert','header service dropdown and directory filtering','numbered gallery filters and navigation','source photo tile service enquiries','six-concern finder','required appointment fields and enquiry transfer','blurred background','scroll reveals and final counter values','mobile navigation','reduced-motion fallback']}
  (OUT/'verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
  print(json.dumps(report),flush=True)
  await browser.close()

asyncio.run(main())
