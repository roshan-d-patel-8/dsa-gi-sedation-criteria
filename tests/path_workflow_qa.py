"""Rendered DOCX fidelity, screenshots, search, and accessible image viewing."""
import json, os, re
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).parents[1]
SOURCE = json.loads((ROOT / 'content/gi-path-workflow-source.json').read_text())
OUTPUT = Path(os.environ.get('VISUAL_QA_OUTPUT', '/private/tmp/dsa-gi-path-qa'))
OUTPUT.mkdir(parents=True, exist_ok=True)
norm = lambda text: re.sub(r'\s+', ' ', text).strip()


def assert_path_workflow(page, touch=False):
    page.get_by_role('tab', name='Field Guide', exact=False).click()
    search = page.get_by_role('searchbox', name='Search the field guide')
    search.fill('MACOLONDSA')
    workflow = page.locator('#gi-path-workflow')
    expect(workflow).to_have_attribute('open', '')
    expect(page.locator('.topic-ma-results')).to_have_attribute('open', '')
    expect(workflow.locator('mark.search-highlight')).to_have_text('MACOLONDSA')
    page.get_by_role('button', name='Clear search', exact=True).click()
    page.locator('.orientation-subtab').filter(has_text='MA-MD').click()
    page.locator('.orientation-expand-all').click()
    expect(workflow).to_have_attribute('open', '')
    assert page.locator('#orientation-ma-md-panel').is_visible()
    rendered = {}
    for item in workflow.locator('[data-source-paragraph]').evaluate_all('els => els.map(el => ({index: Number(el.dataset.sourceParagraph), text: el.textContent}))'):
        rendered.setdefault(item['index'], []).append(item['text'])
    assert list(rendered) == [p['index'] for p in SOURCE['paragraphs']]
    for paragraph in SOURCE['paragraphs']:
        assert norm(' '.join(rendered[paragraph['index']])) == norm(paragraph['text'])
    assert workflow.locator('img').count() == 5
    workflow.locator('summary').scroll_into_view_if_needed()
    page.screenshot(path=OUTPUT / f'path-workflow-{page.viewport_size["width"]}.png', full_page=False)
    for i, image in enumerate(SOURCE['images']):
        thumbnail = workflow.locator('img').nth(i)
        thumbnail.scroll_into_view_if_needed()
        thumbnail.evaluate('img => img.decode()')
        assert thumbnail.evaluate('img => [img.naturalWidth, img.naturalHeight]') == [image['width'], image['height']]
        trigger = workflow.get_by_role('button', name='Enlarge ' + image['alt'], exact=True)
        if touch:
            trigger.tap()
        elif i == 0:
            trigger.focus()
            trigger.press('Enter')
        else:
            trigger.click()
        dialog = page.get_by_role('dialog', name=image['alt'], exact=True)
        expect(dialog).to_be_visible()
        dialog.locator('img').evaluate('img => img.decode()')
        assert dialog.locator('img').evaluate('img => [img.naturalWidth, img.naturalHeight]') == [image['width'], image['height']]
        box = dialog.bounding_box()
        assert box['x'] >= 0 and box['x'] + box['width'] <= page.viewport_size['width'] + 1
        assert box['y'] >= 0 and box['y'] + box['height'] <= page.viewport_size['height'] + 1
        dialog.get_by_role('button', name='Actual size', exact=True).click()
        assert dialog.locator('img').evaluate('img => Math.round(img.getBoundingClientRect().width)') == image['width']
        dialog.get_by_role('button', name='Fit image', exact=True).click()
        if i == 2:
            page.screenshot(path=OUTPUT / f'path-screenshot-dialog-{page.viewport_size["width"]}.png', full_page=False)
            page.keyboard.press('Tab')
            assert dialog.evaluate('el => el.contains(document.activeElement)')
        if i % 3 == 0:
            dialog.get_by_role('button', name='Close workflow screenshot', exact=True).click()
        elif i % 3 == 1:
            page.keyboard.press('Escape')
        else:
            page.mouse.click(2, 2)
        expect(dialog).to_have_count(0)
        assert trigger.evaluate('el => el === document.activeElement')
        assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1')
    page.locator('.orientation-expand-all').click()
    expect(workflow).not_to_have_attribute('open', '')
    assert page.locator('.topic-ma-results[open]').count() == 0


if __name__ == '__main__':
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for width, height, touch in [(1440, 1000, False), (390, 844, True), (320, 568, True)]:
            page = browser.new_page(viewport={'width': width, 'height': height}, has_touch=touch, is_mobile=touch)
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('console', lambda message: errors.append(message.text) if message.type == 'error' else None)
            page.goto(os.environ.get('VISUAL_QA_URL', 'http://127.0.0.1:5173'), wait_until='networkidle')
            assert_path_workflow(page, touch)
            assert not errors, errors
            page.close()
        browser.close()
        print('Path workflow fidelity and screenshot QA passed at 1440, 390, and 320px')
