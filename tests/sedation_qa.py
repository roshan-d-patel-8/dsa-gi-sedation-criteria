"""Sedation clarification: accessible explanation, booking copy, and viewport fit."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright


def assert_sedation_clarifications(page, touch=False):
    page.locator('.criteria-card').evaluate_all('els => Promise.all(els.flatMap(el => el.getAnimations().map(animation => animation.finished)))')
    rule = page.locator('.criteria-emphasis')
    assert rule.inner_text() == 'Peritoneal-dialysis cases must be booked at Antioch only—not Walnut Creek.'
    assert int(rule.evaluate('el => getComputedStyle(el).fontWeight')) >= 700
    assert page.get_by_text('For patients with quadriplegia, the risk of dysautonomia is an additional reason for OR scheduling.', exact=False).count() == 0
    trigger = page.get_by_role('button', name='Why peritoneal dialysis requires Antioch', exact=True)
    trigger.scroll_into_view_if_needed()
    if touch:
        trigger.tap()
    else:
        trigger.hover()
    page.wait_for_selector('#peritoneal-dialysis-location', state='visible')
    tooltip = page.locator('#peritoneal-dialysis-location')
    assert tooltip.is_visible()
    assert 'only 3 admit bays' in tooltip.inner_text()
    assert 'over 60 minutes' in tooltip.inner_text()
    assert 'Antioch has greater capacity' in tooltip.inner_text()
    box = tooltip.bounding_box()
    assert box['x'] >= 0 and box['x'] + box['width'] <= page.viewport_size['width'] + 1
    assert box['y'] >= 0 and box['y'] + box['height'] <= page.viewport_size['height'] + 1
    assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1')
    output = Path(os.environ.get('VISUAL_QA_OUTPUT', '/private/tmp/dsa-gi-sedation-qa'))
    output.mkdir(parents=True, exist_ok=True)
    page.screenshot(path=output / f"sedation-{'mobile' if touch else 'desktop'}-{page.viewport_size['width']}.png", full_page=False)
    if not touch:
        tooltip.hover()
        page.wait_for_timeout(230)
        assert tooltip.is_visible(), 'Tooltip must remain open while hovered'
    page.keyboard.press('Escape')
    assert tooltip.count() == 0
    if touch:
        trigger.tap()
        assert tooltip.is_visible()
        trigger.tap()
        assert tooltip.count() == 0
        trigger.tap()
        page.locator('.reference-heading h1').tap()
        assert tooltip.count() == 0
    else:
        page.mouse.move(0, 0)
        trigger.focus()
        assert tooltip.is_visible()
        assert trigger.get_attribute('aria-describedby') == 'peritoneal-dialysis-location'
        page.keyboard.press('Escape')
        assert tooltip.count() == 0
        assert trigger.evaluate('el => el === document.activeElement')
        page.keyboard.press('Tab')
        assert tooltip.count() == 0

    page.keyboard.press('Escape')
    note_trigger = page.get_by_role('button', name='HC booking and potassium instructions', exact=True)
    assert note_trigger.inner_text() == 'HC'
    note = page.locator('#dialysis-hc-instructions')
    assert note.count() == 0
    note_trigger.scroll_into_view_if_needed()
    question_box = trigger.bounding_box()
    note_box = note_trigger.bounding_box()
    assert abs(question_box['y'] - note_box['y']) < 2
    assert note_box['x'] > question_box['x']
    if touch:
        note_trigger.tap()
    else:
        note_trigger.hover()
    note.wait_for(state='visible')
    expected = 'In booking comments, state “Patient is on peritoneal dialysis” to alert schedulers that the case is restricted to Antioch.\n\nAll hemodialysis and peritoneal-dialysis patients require a STAT potassium order.'
    assert note.inner_text() == expected
    box = note.bounding_box()
    assert box['x'] >= 0 and box['x'] + box['width'] <= page.viewport_size['width'] + 1
    assert box['y'] >= 0 and box['y'] + box['height'] <= page.viewport_size['height'] + 1
    assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1')
    page.screenshot(path=output / f"hc-note-{'mobile' if touch else 'desktop'}-{page.viewport_size['width']}.png", full_page=False)
    if not touch:
        note.hover()
        page.wait_for_timeout(230)
        assert note.is_visible()
    page.keyboard.press('Escape')
    assert note.count() == 0
    if touch:
        note_trigger.tap()
        assert note.is_visible()
        note_trigger.tap()
        assert note.count() == 0
        note_trigger.tap()
        page.locator('.reference-heading h1').tap()
        assert note.count() == 0
    else:
        page.mouse.move(0, 0)
        trigger.focus()
        page.keyboard.press('Tab')
        assert note_trigger.evaluate('el => el === document.activeElement')
        assert note.is_visible()
        assert note_trigger.get_attribute('aria-describedby') == 'dialysis-hc-instructions'
        page.keyboard.press('Escape')
        assert note.count() == 0
        assert note_trigger.evaluate('el => el === document.activeElement')
        page.keyboard.press('Tab')
        assert note.count() == 0


    quad_trigger = page.get_by_role('button', name='HC quadriplegia OR scheduling note', exact=True)
    assert quad_trigger.inner_text() == 'HC'
    assert 'criteria-help-sticky' in quad_trigger.get_attribute('class')
    assert 'dysautonomia' not in quad_trigger.locator('xpath=..').inner_text()
    quad_note = page.locator('#quadriplegia-hc-rationale')
    quad_trigger.scroll_into_view_if_needed()
    if touch: quad_trigger.tap()
    else: quad_trigger.hover()
    quad_note.wait_for(state='visible')
    assert quad_note.inner_text() == '2026-10-14 For patients with quadriplegia, per some anesthesiologists the risk of dysautonomia (HTN) is an additional reason for OR scheduling.'
    assert 'criteria-explanation-sticky' in quad_note.get_attribute('class')
    assert quad_trigger.locator('xpath=../..').get_by_text('Physical limitation such as quadriplegia or being bedbound when multiple people are needed for transfer.', exact=False).is_visible()
    box = quad_note.bounding_box()
    assert box['x'] >= 0 and box['x'] + box['width'] <= page.viewport_size['width'] + 1
    assert box['y'] >= 0 and box['y'] + box['height'] <= page.viewport_size['height'] + 1
    page.screenshot(path=output / f"quadriplegia-hc-{page.viewport_size['width']}.png")
    if not touch:
        quad_note.hover(); page.wait_for_timeout(230); assert quad_note.is_visible()
    page.keyboard.press('Escape'); assert quad_note.count() == 0
    if touch:
        quad_trigger.tap(); assert quad_note.is_visible()
        quad_trigger.tap(); assert quad_note.count() == 0
        quad_trigger.tap(); page.locator('.reference-heading h1').tap(); assert quad_note.count() == 0
    else:
        page.mouse.move(0,0); quad_trigger.focus(); assert quad_note.is_visible()
        assert quad_trigger.get_attribute('aria-describedby') == 'quadriplegia-hc-rationale'
        page.keyboard.press('Escape'); assert quad_note.count() == 0
        assert quad_trigger.evaluate('el => el === document.activeElement')


if __name__ == '__main__':
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for touch, viewport in [(False, {'width': 1440, 'height': 1000}), (True, {'width': 390, 'height': 844}), (True, {'width': 320, 'height': 568})]:
            page = browser.new_page(viewport=viewport, has_touch=touch, is_mobile=touch)
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('console', lambda message: errors.append(message.text) if message.type == 'error' else None)
            page.goto(os.environ.get('VISUAL_QA_URL', 'http://127.0.0.1:5173'), wait_until='networkidle')
            page.get_by_role('tab', name='Procedure Sedation Criteria', exact=False).click()
            assert_sedation_clarifications(page, touch)
            assert not errors, errors
            page.close()
        browser.close()
        print('Sedation clarification desktop/mobile QA passed')
