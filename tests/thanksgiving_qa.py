"""Source-faithful November lunch event, including real mobile tap and full poster."""
import hashlib
import os
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo
from playwright.sync_api import sync_playwright, expect

TITLE='Thanksgiving Networking Lunch'
DATE='Mon · Nov 2, 2026 · 12:30–1:30 PM'
IMAGE='thanksgiving-networking-lunch-2026-11-02.png'
NOMINATION='https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=xHuKPzfjpUeg_A1RLA4F8dmV0_O2WPRFs-_E3YU7z6xUMUlPTUZQNVlSNkNXQkw1MFcwWjlMUFVIMC4u&origin=QRCode'
COPY=[
 'Featuring: The Walnut Awards!',
 'You are invited to our Thanksgiving Networking Lunch.',
 'An award for our colleagues from our colleagues. Scan QR code to submit your nominations.',
 'Join us for an afternoon of fun, music, great food, and recognition as we celebrate together in the Oaks Conference Rooms. We look forward to seeing you there!',
]

def assert_thanksgiving(page,url,output=None,touch=False):
    page.goto(url,wait_until='networkidle')
    current=datetime.now(ZoneInfo('America/Los_Angeles')).month
    for _ in range(abs(current-11)):
        page.get_by_role('button',name='Next month' if current<11 else 'Previous month',exact=True).click()
    expect(page.get_by_role('grid',name='November 2026',exact=True)).to_be_visible()
    cell=page.locator('.calendar-day').filter(has=page.locator('time[datetime="2026-11-02"]'))
    trigger=cell.get_by_role('button',name=f'{TITLE}, {DATE}, Oaks Conference Rooms',exact=True)
    expect(trigger).to_be_visible()
    expect(cell.locator('.calendar-event-marker[aria-label^="Pleasanton — Room 2 opens"]')).to_be_visible()
    assert trigger.locator('.meal-icon').count()==1
    marker=cell.locator('.calendar-event-marker[aria-label^="Pleasanton — Room 2 opens"]')
    obstacle=marker if touch else marker.locator('.calendar-event-label')
    first=trigger.bounding_box(); second=obstacle.bounding_box()
    assert not (first['x'] < second['x']+second['width'] and first['x']+first['width'] > second['x'] and first['y'] < second['y']+second['height'] and first['y']+first['height'] > second['y']), (first,second)
    if output:page.screenshot(path=str(output/f'lunch-calendar-{page.viewport_size["width"]}.png'))

    for direction,reverse in [('Previous month','Next month'),('Next month','Previous month')]:
        page.get_by_role('button',name=direction,exact=True).click();expect(trigger).to_have_count(0)
        page.get_by_role('button',name=reverse,exact=True).click();expect(trigger).to_be_visible()
    if not touch:
        trigger.hover()
        preview=page.get_by_role('tooltip').filter(has_text=TITLE)
        expect(preview).to_be_visible()
        assert preview.locator('img').evaluate('e=>e.decode().then(()=>e.naturalWidth===946 && e.naturalHeight===729)')
        page.wait_for_timeout(250)
        box=preview.bounding_box()
        assert box['width']>0 and box['height']>0 and box['x']>=0 and box['y']>=0
        assert box['x']+box['width']<=page.viewport_size['width']+1 and box['y']+box['height']<=page.viewport_size['height']+1
        if output:page.screenshot(path=str(output/f'lunch-preview-{page.viewport_size["width"]}.png'))
    if touch:trigger.tap()
    else:trigger.click()
    dialog=page.get_by_role('dialog',name=TITLE+' details',exact=True)
    expect(dialog).to_be_visible()
    image=dialog.get_by_role('img',name=TITLE+' event infographic',exact=True)
    assert image.get_attribute('src').endswith(IMAGE)
    assert image.evaluate('e=>e.decode().then(()=>e.naturalWidth===946 && e.naturalHeight===729)')
    expect(dialog.get_by_text(DATE,exact=True)).to_be_visible()
    assert dialog.locator('time').get_attribute('datetime')=='2026-11-02T12:30:00-08:00'
    expect(dialog.get_by_text('Oaks Conference Rooms',exact=True)).to_be_visible()
    for text in COPY:
        target=dialog.get_by_text(text,exact=True);expect(target).to_be_visible()
        target.scroll_into_view_if_needed()
    assert 'submit your nominations' in dialog.inner_text()
    assert dialog.get_by_role('link').count()==2
    qr=dialog.get_by_role('link',name='Open Walnut Awards nomination form from QR code (opens in a new tab)',exact=True)
    cta=dialog.locator('.social-event-cta')
    for link in [qr,cta]:
        assert link.get_attribute('href')==NOMINATION
        assert link.get_attribute('target')=='_blank'
        assert link.get_attribute('rel')=='noreferrer'
    # Activate the actual printed QR coordinates, then the equivalent text link.
    page.wait_for_timeout(300)
    page.context.route(NOMINATION,lambda route:route.fulfill(status=200,content_type='text/html',body='<title>Decoded nomination target</title>'))
    qr.scroll_into_view_if_needed()
    poster=image.bounding_box();x=poster['x']+poster['width']*.881;y=poster['y']+poster['height']*.726
    assert page.evaluate('([x,y])=>document.elementFromPoint(x,y)?.closest("a")?.classList.contains("event-qr-link")',[x,y])
    with page.expect_popup() as popup_info:
        if touch:page.touchscreen.tap(x,y)
        else:page.mouse.click(x,y)
    popup=popup_info.value;popup.wait_for_load_state();assert popup.url==NOMINATION;popup.close()
    with page.expect_popup() as popup_info:cta.click()
    popup=popup_info.value;popup.wait_for_load_state();assert popup.url==NOMINATION;popup.close()
    page.context.unroute(NOMINATION)
    page.wait_for_timeout(300)
    box=dialog.bounding_box();w=page.viewport_size['width'];h=page.viewport_size['height']
    assert box['x']>=0 and box['y']>=0 and box['x']+box['width']<=w+1 and box['y']+box['height']<=h+1
    image_box=image.bounding_box()
    assert abs(image_box['width']/image_box['height']-946/729)<.005
    assert dialog.evaluate('e=>e.scrollWidth<=e.clientWidth+1')
    assert page.evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth+1')
    close=dialog.get_by_role('button',name='Close event details',exact=True)
    close.focus();page.keyboard.press('Shift+Tab');expect(cta).to_be_focused()
    page.keyboard.press('Tab');expect(close).to_be_focused()
    page.keyboard.press('Tab');expect(qr).to_be_focused()
    page.keyboard.press('Tab');expect(cta).to_be_focused()
    dialog.evaluate('e=>e.scrollTop=0')
    if output:page.screenshot(path=str(output/f'lunch-dialog-{w}.png'))
    close.click();expect(dialog).to_have_count(0);expect(trigger).to_be_focused()
    trigger.click();page.keyboard.press('Escape');expect(dialog).to_have_count(0);expect(trigger).to_be_focused()
    trigger.click();page.wait_for_timeout(300);page.mouse.click(1,1);expect(dialog).to_have_count(0);expect(trigger).to_be_focused()
    assert not page.locator('.page-zoom-surface').evaluate('e=>e.hasAttribute("inert")')

if __name__=='__main__':
    source=Path('/var/folders/v5/_b5whbfd7mvd_s1sj_jjpr300000gn/T/codex-clipboard-b2cf11bf-dc0a-49ad-b69d-97cbd3b90cbd.png')
    asset=Path(__file__).parents[1]/'public'/IMAGE
    if source.exists():assert hashlib.sha256(source.read_bytes()).digest()==hashlib.sha256(asset.read_bytes()).digest()
    output=Path(os.environ.get('VISUAL_QA_OUTPUT','/private/tmp/thanksgiving-qa'));output.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as p:
        browser=p.chromium.launch();errors=[]
        for w,h in [(1440,1000),(1024,900),(390,844),(320,568)]:
            page=browser.new_page(viewport={'width':w,'height':h},has_touch=w<500)
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
            assert_thanksgiving(page,os.environ.get('VISUAL_QA_URL','http://127.0.0.1:5173'),output,touch=w<500)
            page.close()
        browser.close();assert not errors,errors
    print('Thanksgiving QA passed at1440/1024/390/320: QR-area and text-link popup destinations, non-overlapping icon/milestone rectangles, Nov2 alongside Room2, adjacent-month isolation, source-exact 946x729 uncropped art, hover preview, real phone tap, complete copy, scroll/viewport bounds, keyboard/close/Escape/backdrop/focus and clean console.')
