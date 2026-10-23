"""Global Conjunctions access and published Field Guide update freshness."""
import os
from pathlib import Path
from playwright.sync_api import expect, sync_playwright

BASE_URL = os.environ.get('VISUAL_QA_URL', 'http://127.0.0.1:5173')
OUTPUT = Path(os.environ.get('VISUAL_QA_OUTPUT', '/private/tmp/dsa-gi-header-freshness'))
OUTPUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for width in [1440, 1024, 390, 320]:
        context = browser.new_context(viewport={'width':width,'height':1000 if width > 600 else 844}, has_touch=width < 600, timezone_id='Asia/Tokyo', reduced_motion='reduce')
        page = context.new_page()
        errors=[]
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append(m.text) if m.type=='error' else None)
        page.clock.install(time='2026-10-23T12:00:00-07:00')
        page.goto(BASE_URL)
        page.wait_for_load_state('networkidle')
        link = page.get_by_role('navigation', name='Companion sites').get_by_role('link', name='Conjunctions:', exact=False)
        expect(link).to_have_attribute('href','https://roshan-d-patel-8.github.io/conjunction/')
        expect(link).to_have_attribute('target','_blank')
        expect(link).to_have_attribute('rel','noreferrer')
        expect(page.locator('.calendar-chicklets')).to_have_count(0)
        label=link.locator('.chicklet-label')
        expect(label).to_be_hidden()
        if width > 600:
            link.hover()
            expect(label).to_be_visible()
            box=label.bounding_box(); icon=link.bounding_box()
            assert box['x'] >= 0 and box['x']+box['width'] < icon['x']
            expect(label.get_by_text('When our paths cross ↗', exact=True)).to_be_visible()
            page.screenshot(path=OUTPUT/f'conjunctions-hover-{width}.png')
            page.mouse.move(0,200)
        link.focus()
        expect(label).to_be_visible()
        page.keyboard.press('Tab')
        expect(label).to_be_hidden()
        for name in ['Calendar','Procedure Sedation Criteria','Podlets','Field Guide','Desktop Medicine']:
            page.get_by_role('tab',name=name,exact=False).click()
            expect(link).to_be_visible()
            icon=link.bounding_box(); zoom=page.get_by_role('button',name='Zoom page',exact=False).bounding_box()
            assert icon['width'] >= 44 and icon['height'] >= 44
            assert icon['x'] >= width-85 and icon['y'] <= 15
            assert zoom['x']+zoom['width'] <= icon['x']-5
        page.get_by_role('tab',name='Field Guide',exact=False).click()
        recent=page.locator('.orientation-subtab.is-recently-updated')
        expect(recent).to_have_count(4)
        assert recent.locator('strong').all_text_contents()==['Referrals','Clinic','Choosing Wisely','MA-MD']
        assert recent.evaluate_all("es=>es.every(e=>getComputedStyle(e).boxShadow!=='none')")
        expect(page.locator('.orientation-subtab').filter(has_text='Ergonomics')).not_to_have_class(__import__('re').compile('is-recently-updated'))
        for section in ['Referrals','Clinic','Choosing Wisely','MA-MD']:
            tab=page.locator('.orientation-subtab').filter(has=page.locator('strong',has_text=section))
            expect(tab.locator('.section-update-hint')).to_contain_text('Updated Oct')
            assert 'Content updated within the past 30 days.' in tab.get_attribute('aria-description')
        page.locator('#orientation-services-tab').click()
        expect(page.locator('.orientation-card.is-recently-updated')).to_have_count(1)
        page.screenshot(path=OUTPUT/f'field-guide-glow-{width}.png')
        page.get_by_role('button',name='Zoom page',exact=False).click()
        for _ in range(3): page.get_by_role('button',name='Zoom in',exact=True).click()
        expect(page.locator('.page-zoom-surface')).to_have_attribute('data-zoom','140')
        page.keyboard.press('Escape')
        expect(link).to_be_visible()
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        page.get_by_role('button',name='Zoom page',exact=False).click()
        page.get_by_role('button',name='Reset to 100%',exact=True).click()
        page.keyboard.press('Escape')
        # Exercise a real click/tap on the link, including narrow phones.
        with page.expect_popup() as opened:
            link.click()
        popup=opened.value
        popup.wait_for_url('https://roshan-d-patel-8.github.io/conjunction/**')
        popup.close()
        page.clock.set_system_time('2026-11-07T23:59:30-08:00')
        page.evaluate("window.dispatchEvent(new Event('focus'))")
        expect(recent).to_have_count(4)
        page.clock.fast_forward(61_000)
        expect(recent).to_have_count(3)
        expect(page.locator('#orientation-services-tab')).not_to_have_class(__import__('re').compile('is-recently-updated'))
        page.clock.set_system_time('2026-11-18T12:00:00-08:00')
        page.evaluate("window.dispatchEvent(new Event('focus'))")
        expect(recent).to_have_count(0)
        expect(page.locator('.orientation-card.is-recently-updated')).to_have_count(0)
        assert not errors, errors
        context.close()
    browser.close()
print('Header/freshness QA passed: upper-right 44px Conjunctions link on all pages, hover/focus text, real desktop/mobile new-tab click, separate zoom at 140%, four source-backed glowing sections, Pacific day-30 expiry, reduced motion and no errors/overflow.')
