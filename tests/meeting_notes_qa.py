"""Source copy, month ownership, and accessible meeting-note interactions."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
SOURCE=json.loads((Path(__file__).parents[1]/'content/meeting-notes-2026-10-14.json').read_text())

def assert_meeting_notes(page, base_url, output=None, touch=False):
    page.goto(base_url, wait_until='networkidle')
    page.get_by_role('tab',name='Calendar',exact=True).click()
    # Locate the explicitly assigned month rather than relying on the current date.
    from datetime import datetime
    from zoneinfo import ZoneInfo
    month=datetime.now(ZoneInfo('America/Los_Angeles')).month
    for _ in range(abs(month-10)):
        page.get_by_role('button',name='Next month' if month<10 else 'Previous month',exact=True).click()
    trigger=page.get_by_role('button',name='Read '+SOURCE['title'],exact=True)
    expect(trigger).to_be_visible()
    page.get_by_role('button',name='Previous month',exact=True).click();expect(trigger).to_have_count(0)
    page.get_by_role('button',name='Next month',exact=True).click();expect(trigger).to_be_visible()
    page.get_by_role('button',name='Next month',exact=True).click();expect(trigger).to_have_count(0)
    page.get_by_role('button',name='Previous month',exact=True).click()
    if touch: trigger.tap()
    else: trigger.click()
    dialog=page.get_by_role('dialog',name=SOURCE['title'],exact=True);expect(dialog).to_be_visible()
    assert dialog.locator('time').get_attribute('datetime')==SOURCE['date']
    actual=dialog.locator('.meeting-notes-body > section > ul > li > p').all_text_contents()
    expected=[''.join(seg if isinstance(seg,str) else seg['label'] for seg in item['segments']) for section in SOURCE['sections'] for item in section['items']]
    assert actual==expected
    assert dialog.locator('h3').all_text_contents()==[s['title'] for s in SOURCE['sections']]
    for section in SOURCE['sections']:
        for item in section['items']:
            for seg in item['segments']:
                if isinstance(seg,dict): assert dialog.get_by_role('link',name=seg['label'],exact=True).get_attribute('href')==seg['href']
            if 'note' not in item: continue
            note=item['note']; details=dialog.locator('.meeting-sticky-note').filter(has=page.get_by_text(note['label'],exact=True)); summary=details.locator('summary')
            if touch: summary.tap()
            else: summary.hover()
            expect(details).to_have_attribute('open','')
            for row in note.get('items',[]): assert row['label']+': '+row['text'] in details.inner_text()
            for text in note.get('paragraphs',[]): assert text in details.inner_text()
            summary.focus();summary.press('Escape');assert details.get_attribute('open') is None
            summary.press('Enter');expect(details).to_have_attribute('open','')
            summary.press('Escape');assert details.get_attribute('open') is None
    box=dialog.bounding_box();w=page.viewport_size['width'];h=page.viewport_size['height']
    assert box['x']>=0 and box['y']>=0 and box['x']+box['width']<=w+1 and box['y']+box['height']<=h+1
    assert dialog.evaluate('e=>e.scrollWidth<=e.clientWidth+1')
    assert page.evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth+1')
    dialog.evaluate('e=>{e.scrollTop=0}')
    if output: page.screenshot(path=str(output))
    dialog.get_by_role('button',name='Close department meeting notes',exact=True).click();expect(dialog).to_have_count(0);expect(trigger).to_be_focused()
    trigger.click();expect(dialog).to_be_visible();page.keyboard.press('Escape');expect(dialog).to_have_count(0);expect(trigger).to_be_focused()
    trigger.click();expect(dialog).to_be_visible();page.mouse.click(1,1);expect(dialog).to_have_count(0);expect(trigger).to_be_focused()
    assert page.locator('body').evaluate('e=>e.style.overflow')!='hidden'

if __name__=='__main__':
    url=os.environ.get('VISUAL_QA_URL','http://127.0.0.1:5173');out=Path(os.environ.get('VISUAL_QA_OUTPUT','/private/tmp/oct14-meeting-qa'));out.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as p:
        browser=p.chromium.launch();errors=[]
        for w,h in [(1440,1000),(390,844),(320,568)]:
            page=browser.new_page(viewport={'width':w,'height':h},has_touch=w<500)
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
            assert_meeting_notes(page,url,out/f'meeting-notes-{w}.png',touch=w<500)
            page.close()
        browser.close();assert not errors,errors
    print('Meeting notes passed: complete supplied copy/links, optional-session and consent notes, month isolation, hover/keyboard/tap, dialog bounds/dismissal/focus at1440/390/320.')
