"""Pacific current-day rollover and Omar birthday access, including narrow phones."""
import os
from pathlib import Path
from playwright.sync_api import expect, sync_playwright

BASE_URL = os.environ.get('VISUAL_QA_URL', 'http://127.0.0.1:5173')
OUTPUT = Path(os.environ.get('VISUAL_QA_OUTPUT', '/private/tmp/dsa-gi-calendar-today'))
OUTPUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for width in [1440, 390, 320]:
        context = browser.new_context(viewport={'width': width, 'height': 1000 if width == 1440 else 844}, has_touch=width < 600, timezone_id='Asia/Tokyo')
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('console', lambda message: errors.append(message.text) if message.type == 'error' else None)
        page.clock.install(time='2026-10-23T06:59:30Z') # Oct 22, 23:59 Pacific; Oct 23 in Tokyo.
        page.goto(BASE_URL)
        page.wait_for_load_state('networkidle')
        current = page.locator('.calendar-day[aria-current="date"]')
        expect(current).to_have_count(1)
        expect(current.locator('time')).to_have_attribute('datetime', '2026-10-22')
        expect(current.get_by_text('Today', exact=True)).to_be_visible()
        assert current.locator('.birthday-marker').count() == 1
        assert current.locator('.calendar-social-marker').count() == 1
        trigger = page.get_by_role('button', name='Happy Birthday, Omar Al-Shuwaykh!', exact=True)
        if width == 1440:
            trigger.hover()
            preview = page.get_by_role('tooltip').filter(has_text='Happy Birthday, Omar Al-Shuwaykh!')
            expect(preview).to_be_visible()
            assert preview.locator('img').evaluate('img => img.decode().then(() => img.naturalWidth === 144 && img.naturalHeight === 173)')
        for dismissal in ['close', 'escape']:
            trigger.click()
            dialog = page.get_by_role('dialog', name='Birthday celebration for Omar Al-Shuwaykh', exact=True)
            expect(dialog).to_be_visible()
            expect(dialog.get_by_text('Celebrate a colleague · October 22', exact=True)).to_be_visible()
            expect(dialog.get_by_text('Wishing you a wonderful day.', exact=True)).to_be_visible()
            assert dialog.locator('.birthday-dialog-portrait > img').evaluate('img => img.decode().then(() => img.naturalWidth === 144 && img.naturalHeight === 173)')
            page.wait_for_timeout(300)
            box = dialog.bounding_box()
            assert box['x'] >= 0 and box['x'] + box['width'] <= width
            assert box['y'] >= 0 and box['y'] + box['height'] <= page.viewport_size['height']
            page.screenshot(path=OUTPUT / f'omar-dialog-{width}.png')
            if dismissal == 'close':
                dialog.get_by_role('button', name='Close birthday card', exact=True).click()
            else:
                page.keyboard.press('Escape')
            expect(dialog).to_have_count(0)
            expect(trigger).to_be_focused()
        # The existing minute refresh must move the marker across Pacific midnight.
        page.clock.fast_forward(61_000)
        expect(current.locator('time')).to_have_attribute('datetime', '2026-10-23')
        expect(current).to_have_count(1)
        page.get_by_role('button', name='Next month', exact=True).click()
        expect(current).to_have_count(0)
        expect(trigger).to_have_count(0)
        page.get_by_role('button', name='Previous month', exact=True).click()
        expect(current.locator('time')).to_have_attribute('datetime', '2026-10-23')
        current.scroll_into_view_if_needed()
        page.screenshot(path=OUTPUT / f'today-{width}.png')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        assert not errors, errors
        context.close()
    browser.close()
print('Calendar today QA passed: Pacific midnight rollover, timezone independence, adjacent months, Omar portrait hover/tap/dialog/dismiss/focus, shared event date, desktop/390/320 layouts.')
