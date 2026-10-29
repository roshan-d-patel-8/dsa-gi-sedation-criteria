"""Supplied image fidelity and evergreen ERBE access through the shared viewer."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect


def assert_adenoma_erbe(page, url, output=None, touch=False):
    page.goto(url, wait_until='networkidle')
    page.get_by_role('tab', name='Field Guide', exact=False).click()
    page.get_by_role('tab', name='Choosing Wisely CRC surveillance graduation', exact=False).click()
    panel = page.locator('.orientation-content')
    button = panel.get_by_role('button', name='Enlarge advanced adenoma infographic', exact=True)
    button.scroll_into_view_if_needed()
    image = button.locator('img')
    assert image.evaluate('e=>e.decode().then(()=>e.naturalWidth===1382 && e.naturalHeight===356)')
    assert image.get_attribute('src').endswith('/advanced-adenoma-definition.png')
    assert 'OR size ≥ 10 mm' in image.get_attribute('alt')
    assert 'any conventional adenoma ≥ 10 mm in size' in panel.inner_text()
    assert page.get_by_role('button', name='Expand Choosing Wisely graduation infographic', exact=True).count() == 1
    box=image.bounding_box()
    assert abs(box['width']/box['height']-1382/356)<0.02
    if output: page.screenshot(path=str(output/f'adenoma-inline-{page.viewport_size["width"]}.png'))
    if touch: button.tap()
    else: button.click()
    dialog=page.get_by_role('dialog',name='Advanced adenoma · illustrated definition',exact=True)
    expect(dialog).to_be_visible()
    assert dialog.locator('img').evaluate('e=>e.decode().then(()=>e.naturalWidth===1382 && e.naturalHeight===356)')
    page.get_by_role('button',name='Actual size',exact=True).click()
    expect(dialog.locator('.workflow-image-scroll')).to_have_class('workflow-image-scroll is-actual-size')
    assert dialog.locator('.workflow-image-scroll img').bounding_box()['width']==1382
    page.get_by_role('button',name='Fit image',exact=True).click()
    if output: page.screenshot(path=str(output/f'adenoma-expanded-{page.viewport_size["width"]}.png'))
    b=dialog.bounding_box();w=page.viewport_size['width'];h=page.viewport_size['height']
    assert b['x']>=0 and b['y']>=0 and b['x']+b['width']<=w+1 and b['y']+b['height']<=h+1
    page.get_by_role('button',name='Close workflow screenshot',exact=True).click()
    expect(button).to_be_focused()
    button.click();page.keyboard.press('Escape');expect(dialog).to_have_count(0);expect(button).to_be_focused()

    page.get_by_role('tab',name='Procedures Appointment types and documentation',exact=False).click()
    section=page.locator('.procedure-group-erbe')
    expect(section.locator('summary')).to_contain_text('ERBE Settings and Upper EMR')
    assert not section.evaluate('e=>e.open')
    section.locator('summary').click()
    deck=section.get_by_role('button',name='Open ERBE Settings and Upper EMR presentation, 22 slides',exact=True)
    expect(deck).to_contain_text('Tom’s slides · July 2026 · 22 slides')
    deck.scroll_into_view_if_needed()
    if output: page.screenshot(path=str(output/f'erbe-procedures-{w}.png'))
    if touch: deck.tap()
    else: deck.click()
    viewer=page.get_by_role('dialog',name='ERBE Settings and Upper EMR',exact=True)
    expect(viewer).to_be_visible()
    for i in range(1,23):
        expect(viewer.get_by_text(f'Slide {i} of 22',exact=True)).to_be_visible()
        slide=viewer.locator('.presentation-slide img')
        assert slide.get_attribute('src').endswith(f'/department-meeting-resources/2026-07/erbe-settings-and-upper-emr/slide-{i:02}.webp')
        assert slide.evaluate('e=>e.decode().then(()=>e.naturalWidth===2560 && e.naturalHeight===1440)')
        if i<22:viewer.get_by_role('button',name='Next slide',exact=True).click()
    page.keyboard.press('Home');expect(viewer.get_by_text('Slide 1 of 22',exact=True)).to_be_visible()
    viewer.get_by_role('button',name='Enter full screen',exact=True).click()
    expect(viewer.get_by_role('button',name='Exit full screen',exact=True)).to_be_visible()
    viewer.get_by_role('button',name='Exit full screen',exact=True).click()
    expect(viewer.get_by_role('button',name='Enter full screen',exact=True)).to_be_visible()
    if output:page.screenshot(path=str(output/f'erbe-procedures-viewer-{w}.png'))
    page.keyboard.press('Escape');expect(viewer).to_have_count(0);expect(deck).to_be_focused()
    # New subsection participates in section-wide expand/collapse and search.
    page.get_by_role('searchbox').fill('ERBE')
    expect(page.locator('.procedure-group-erbe')).to_have_attribute('open','')
    expect(page.locator('.procedure-group-erbe mark.search-highlight').first).to_be_visible()
    page.get_by_role('searchbox').fill('')
    assert page.evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth+1')


if __name__=='__main__':
    out=Path(os.environ.get('VISUAL_QA_OUTPUT','/private/tmp/adenoma-erbe-qa'));out.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as p:
        browser=p.chromium.launch();errors=[]
        for w,h in [(1440,1000),(390,844),(320,568)]:
            page=browser.new_page(viewport={'width':w,'height':h},has_touch=w<500)
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
            assert_adenoma_erbe(page,os.environ.get('VISUAL_QA_URL','http://127.0.0.1:5173'),out,touch=w<500)
            page.close()
        browser.close();assert not errors,errors
    print('Advanced adenoma / Procedures ERBE QA passed at 1440/390/320: exact image, real tap expansion, actual-size/fit, focus return, 22 shared slides, fullscreen, search and viewport fit; no console errors.')
