"""Verify every published What's New link lands on visible current content."""
import json
import os
import re
import subprocess
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).parents[1]
ENTRIES = json.loads((ROOT / 'content/practice-updates.json').read_text())
BASE_URL = os.environ.get('VISUAL_QA_URL', 'http://127.0.0.1:5173')
OUTPUT = Path(os.environ.get('VISUAL_QA_OUTPUT', '/private/tmp/update-links-qa'))
OUTPUT.mkdir(parents=True, exist_ok=True)

def view_url(**values):
    parts = urlsplit(BASE_URL)
    query = dict(parse_qsl(parts.query))
    for name in ['view', 'section', 'tab']:
        query.pop(name, None)
    query.update(values)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), ''))

def assert_arrival(page, key, destinations):
    target = destinations[key]
    arrival = page.locator(f'[data-update-arrival="{key}"]')
    expect(arrival).to_have_count(1)
    expect(arrival).to_be_visible()
    assert page.get_by_text('This section could not be opened.', exact=False).count() == 0
    expect(page.locator(f'#{target["tab"]}-tab')).to_have_attribute('aria-selected', 'true')
    if target.get('section'):
        section = 'orientation-' + target['section'].lower().replace(' ', '-')
        expect(page.locator(f'#{section}-tab')).to_have_attribute('aria-selected', 'true')
    if 'month' in target:
        months = ['January','February','March','April','May','June','July','August','September','October','November','December']
        expect(page.get_by_role('grid', name=f'{months[target["month"]]} 2026', exact=True)).to_be_visible()
    if target.get('opened'):
        expect(page.locator(target['opened'])).to_be_visible()
    else:
        expect(arrival).to_be_in_viewport()
    assert arrival.evaluate('el => { for (let p = el.parentElement; p; p = p.parentElement) if (p.matches("details") && !p.open) return false; return !el.matches("details") || el.open; }')
    assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1')

def assert_update_links(page, destinations, touch=False, all_links=True):
    links = [(entry['id'], index, key) for entry in ENTRIES for index, targets in enumerate(entry['targets']) for key in targets]
    if not all_links:
        # Narrow viewport exercises every distinct destination, without duplicate routes.
        seen = set()
        links = [link for link in links if link[2] not in seen and not seen.add(link[2])]
    page.goto(view_url(view='change-log'), wait_until='networkidle')
    expect(page.locator('[data-update-link]')).to_have_count(sum(len(t) for e in ENTRIES for t in e['targets']))
    for entry, index, key in links:
        link = page.locator(f'[data-update-link="{entry}:{index}:{key}"]')
        expect(link).to_have_attribute('href', f'?section={key}')
        if touch:
            link.tap()
        else:
            link.click()
        expect(page).to_have_url(re.compile(r'[?&]section=' + key + r'(?:&|$)'))
        assert_arrival(page, key, destinations)
        page.go_back()
        expect(page.get_by_role('heading', name="What's New", exact=True)).to_be_visible()
        if (entry, index, key) == links[0]:
            page.go_forward()
            assert_arrival(page, key, destinations)
            page.go_back()
            expect(page.get_by_role('heading', name="What's New", exact=True)).to_be_visible()
    # Reload and native new-tab navigation must also resolve hidden content.
    for key in ['remimazolam-booking', 'pathology-workflow', 'september-hepatitis', 'medication-holds']:
        page.goto(view_url(section=key), wait_until='networkidle')
        assert_arrival(page, key, destinations)
        page.reload(wait_until='networkidle')
        assert_arrival(page, key, destinations)
    page.goto(view_url(view='change-log'), wait_until='networkidle')
    with page.context.expect_page() as popup_info:
        page.locator('[data-update-link]').first.click(button='middle')
    popup = popup_info.value
    popup.wait_for_load_state('networkidle')
    assert_arrival(popup, ENTRIES[0]['targets'][0][0], destinations)
    popup.close()
    if not touch:
        page.locator('[data-update-link]').first.focus()
        page.keyboard.press('Enter')
        assert_arrival(page, ENTRIES[0]['targets'][0][0], destinations)
        page.go_back()
    page.screenshot(path=OUTPUT / f'whats-new-links-{page.viewport_size["width"]}.png')
    print(page.viewport_size['width'], len(links), 'click/tap destinations plus reload and native new-tab PASS', flush=True)

if __name__ == '__main__':
    # Registry is serialized by Node so the browser checks use its actual public contract.
    destinations = json.loads(subprocess.check_output(['node','--input-type=module','-e','import {updateDestinations} from "./src/update-links.js"; console.log(JSON.stringify(updateDestinations))'],cwd=ROOT,text=True))
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        for width,height,touch in [(1440,1000,False),(390,844,True),(320,568,True)]:
            page=browser.new_page(viewport={'width':width,'height':height},has_touch=touch)
            errors=[]
            page.on('pageerror',lambda error:errors.append(str(error)))
            assert_update_links(page,destinations,touch,all_links=not touch)
            assert not errors,errors
            page.close()
        browser.close()
