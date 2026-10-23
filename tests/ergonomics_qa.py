"""Ergonomics Field Guide placement, slide fidelity and shared viewer behavior."""
import os
from pathlib import Path
from playwright.sync_api import expect, sync_playwright

BASE_URL = os.environ.get('VISUAL_QA_URL', 'http://127.0.0.1:5173')
OUTPUT = Path(os.environ.get('VISUAL_QA_OUTPUT', '/private/tmp/dsa-gi-ergonomics-qa'))
OUTPUT.mkdir(parents=True, exist_ok=True)


def check(page, width, fallback=False):
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    if fallback:
        page.add_init_script('''
          Element.prototype.requestFullscreen = undefined;
          Element.prototype.webkitRequestFullscreen = undefined;
        ''')
    page.goto(BASE_URL)
    page.wait_for_load_state('networkidle')
    expect(page.locator('[data-presentation-resource="gi-ergonomics"]')).to_have_count(0)
    page.get_by_role('tab', name='Field Guide', exact=False).click()
    page.locator('.orientation-subtab').filter(has_text='Ergonomics').click()
    panel = page.get_by_role('tabpanel', name='11 Ergonomics Slides and early-career evaluation')
    expect(panel).to_be_visible()
    panel.locator('.topic-ergonomics > summary').click()
    expect(panel.get_by_text('DSA ergonomist for GI: Jenise Leichenger', exact=True)).to_be_visible()
    expect(panel.get_by_text('Around month 3-4 after starting, she will conduct an in person ergonomic evaluation while you scope to help point out things that can be improved upon to avoid injury over your career.', exact=True)).to_be_visible()
    panel.locator('.topic-ergonomics-presentation > summary').click()
    trigger = panel.get_by_role('button', name='Open Ergonomics presentation, 18 slides', exact=True)
    expect(trigger).to_be_visible()
    assert trigger.locator('img').evaluate('img => img.decode().then(() => img.naturalWidth === 2560 && img.naturalHeight === 1440)')
    trigger.scroll_into_view_if_needed()
    page.screenshot(path=OUTPUT / f'ergonomics-card-{width}.png')
    trigger.click()
    viewer = page.get_by_role('dialog', name='Ergonomics', exact=True)
    expect(viewer).to_be_visible()
    expect(viewer.get_by_text('Field Guide · Ergonomics', exact=True)).to_be_visible()
    expect(viewer.get_by_text('Department meeting resource', exact=True)).to_have_count(0)
    slide = viewer.locator('.presentation-slide img')
    progress = viewer.get_by_role('progressbar', name='Presentation progress')
    expect(viewer.get_by_role('button', name='Previous slide', exact=True)).to_be_disabled()
    for i in range(1, 19):
        expect(viewer.get_by_text(f'Slide {i} of 18', exact=True)).to_be_visible()
        assert (slide.get_attribute('src') or '').endswith(f'/field-guide/ergonomics/slide-{i:02}.webp')
        assert slide.evaluate('img => img.decode().then(() => img.naturalWidth === 2560 && img.naturalHeight === 1440)')
        expect(progress).to_have_attribute('aria-valuenow', str(i))
        assert slide.get_attribute('alt') and not slide.get_attribute('alt').startswith('Slide ')
        if i in [1, 2, 8, 11, 16, 18]:
            page.screenshot(path=OUTPUT / f'ergonomics-slide-{i:02}-{width}.png')
        if i < 18:
            viewer.get_by_role('button', name='Next slide', exact=True).click()
    expect(viewer.get_by_role('button', name='Next slide', exact=True)).to_be_disabled()
    for key, number in [('ArrowLeft', 17), ('PageUp', 16), ('PageDown', 17), ('Space', 18), ('Home', 1), ('ArrowRight', 2), ('End', 18), ('Home', 1)]:
        page.keyboard.press(key)
        expect(progress).to_have_attribute('aria-valuenow', str(number))
    viewer.get_by_role('button', name='Advance to slide 2', exact=True).click()
    expect(progress).to_have_attribute('aria-valuenow', '2')
    if width < 600:
        box = slide.bounding_box()
        cdp = page.context.new_cdp_session(page)
        x, y = box['x'] + box['width'] * .75, box['y'] + box['height'] / 2
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]})
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x - 100, 'y': y}]})
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        cdp.detach()
        expect(progress).to_have_attribute('aria-valuenow', '3')
    fullscreen = viewer.get_by_role('button', name='Enter full screen', exact=True)
    fullscreen.focus()
    page.keyboard.press('Shift+Tab')
    expect(viewer.get_by_role('button', name='Next slide', exact=True)).to_be_focused()
    page.keyboard.press('Tab')
    expect(fullscreen).to_be_focused()
    page.keyboard.press('f')
    expect(viewer.get_by_role('button', name='Exit full screen', exact=True)).to_be_visible()
    if fallback:
        expect(viewer).to_have_class('presentation-dialog is-fallback-fullscreen')
    page.keyboard.press('f')
    expect(viewer.get_by_role('button', name='Enter full screen', exact=True)).to_be_visible()
    page.keyboard.press('Escape')
    expect(viewer).to_have_count(0)
    expect(trigger).to_be_focused()
    trigger.click()
    page.get_by_role('button', name='Close Ergonomics presentation', exact=True).click()
    expect(trigger).to_be_focused()
    search = page.get_by_role('searchbox', name='Search the field guide')
    search.fill('wrist alignment')
    expect(page.locator('.orientation-subtab')).to_have_count(1)
    expect(trigger).to_be_visible()
    trigger.click()
    expect(viewer).to_be_visible()
    page.keyboard.press('Escape')
    expect(trigger).to_be_focused()
    search.fill('')
    page.locator('.orientation-subtab').filter(has_text='Clinic').click()
    expect(page.locator('[data-presentation-resource="gi-ergonomics"]')).to_have_count(0)
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), width
    assert not errors, errors


if __name__ == '__main__':
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for width in [1440, 390, 320]:
            context = browser.new_context(viewport={'width': width, 'height': 1000 if width == 1440 else 844}, has_touch=width < 600)
            check(context.new_page(), width, fallback=width == 320)
            context.close()
        browser.close()
    print('Ergonomics QA passed: evergreen placement; all 18 full-size slides; original guidance; search/foldouts; click/keyboard/swipe; fullscreen/fallback; focus trap/return; desktop/390/320 layouts; no browser errors.')
