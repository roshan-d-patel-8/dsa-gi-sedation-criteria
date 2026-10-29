"""ACLS calendar placement, linked workflow and native dialog interaction checks."""
import os
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo
from playwright.sync_api import sync_playwright, expect

REGISTRATION = 'https://cprvam.com/classes/acls/acls-online-skills/'
REIMBURSEMENT = 'https://tpmghcm.kp.org/nphrprd/signon.html'
EXPENSE_GUIDE = 'https://sp-cloud.kp.org/sites/TPMGPhysicianPayroll/SitePages/How-to-Create-an-Expense-Report-for-Physicians.aspx'
READINESS = 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=xHuKPzfjpUeg_A1RLA4F8Zj47EYlwklOq4uH6MhZSndUMVVaR0VRODBXTVpKVkNUOUpLTzY1TEFSSy4u'

def assert_acls(page, url, output=None, touch=False):
    page.goto(url, wait_until='networkidle')
    month = datetime.now(ZoneInfo('America/Los_Angeles')).month
    for _ in range(abs(month-10)):
        page.get_by_role('button', name='Previous month' if month>10 else 'Next month', exact=True).click()
    announcement = page.get_by_role('region', name='October 29 department meeting announcements', exact=True)
    expect(announcement).to_be_visible()
    assert announcement.locator('time').get_attribute('datetime') == '2026-10-29'
    trigger = page.get_by_role('button', name='ACLS Certification workflow', exact=True)
    expect(trigger).to_be_visible()
    assert trigger.locator('svg').count() == 1
    assert page.locator('.calendar-sidebar').evaluate('e=>e.textContent.indexOf("October 29") < e.textContent.indexOf("October 14")')
    for direction, reverse in [('Previous month','Next month'),('Next month','Previous month')]:
        page.get_by_role('button', name=direction, exact=True).click()
        expect(trigger).to_have_count(0)
        page.get_by_role('button', name=reverse, exact=True).click()
    trigger.scroll_into_view_if_needed()
    if output: page.screenshot(path=str(output / f'acls-button-{page.viewport_size["width"]}.png'))
    if touch: trigger.tap()
    else: trigger.click()
    dialog = page.get_by_role('dialog', name='ACLS certification workflow', exact=True)
    expect(dialog).to_be_visible()
    expect(trigger).to_have_attribute('aria-expanded', 'true')
    assert dialog.locator('.acls-flow > li').count() == 4
    text = dialog.inner_text()
    for phrase in ['Highly recommended for Pleasanton physicians.', 'All physicians in our group may opt in', 'MD People portal', '$280 ACLS fee is reimbursable under the $5,000 Annual Professional Allowance', '2–5 hours', 'accuracy of your answers', 'After passing the online component', '30 minutes', 'At one of our sites · 30 minutes', 'no instructor or supervisor present', 'final certification test']:
        assert phrase in text, phrase
    registration = dialog.locator('.acls-flow > li').first
    substep = registration.get_by_role('list', name='Registration substeps', exact=True)
    expect(substep.get_by_role('heading', name='Choose this location', exact=True)).to_be_visible()
    assert 'On the registration site, select Crow Canyon.' in substep.inner_text()
    assert substep.locator('address').inner_text() == '3 Crow Canyon Court #205\nSan Ramon, CA 94583'
    note = 'A company representative will bring the manikin to our sites, and we will block time in your daily schedule to complete the test.'
    assert note in substep.locator('li').first.inner_text()
    clarification = substep.locator('.acls-location-clarification')
    expect(clarification).to_be_visible()
    assert substep.locator('li').first.evaluate('e=>e.querySelector("address").nextElementSibling.classList.contains("acls-location-clarification")')
    assert note in dialog.locator('.acls-flow > li').last.inner_text()
    assert 'no instructor or supervisor present' in dialog.locator('.acls-flow > li').last.inner_text()

    assert dialog.locator('.acls-flow > li').last.locator('address').count() == 0
    assert registration.get_by_role('listitem').count() == 2
    expect(substep.get_by_role('heading', name='Request reimbursement', exact=True)).to_be_visible()
    assert '20 minutes' not in text
    assert '2–5 hours for the online assessment and 30 minutes for the in-person computerized manikin test' in text
    leave = dialog.get_by_role('region', name='ED leave for ACLS training', exact=True)
    assert 'Department guidance' in leave.inner_text()
    assert 'It is reasonable and expected to charge 1–2 units of ED leave for the time required to complete both the online assessment and the in-person manikin test.' in leave.inner_text()
    assert 'Consider adding the ED-leave entry on a weekend day so it does not overlap with weekday timesheet entries and cause confusion.' in leave.inner_text()
    conversion = leave.get_by_role('table', name='Hours-to-Units Conversion Table', exact=True)
    assert conversion.locator('thead th').all_text_contents() == ['Hours', 'Units']
    assert [row.all_text_contents() for row in [conversion.locator('tbody tr').nth(i).locator('th, td') for i in range(4)]] == [['8 Hours','2.00 Units'],['4 Hours','1.00 Unit'],['3 Hours','0.75 Units'],['2 Hours','0.50 Units']]
    assert conversion.locator('tbody tr').count() == 4
    conversion.scroll_into_view_if_needed()
    expect(conversion).to_be_visible()
    assert leave.evaluate('e=>e.scrollWidth<=e.clientWidth+1')
    assert conversion.evaluate('e=>e.scrollWidth<=e.clientWidth+1')
    if output:
        page.wait_for_timeout(500) # Let native mobile tap feedback settle before the visual capture.
        page.screenshot(path=str(output / f'acls-ed-leave-{page.viewport_size["width"]}.png'))
    # Exercise link activation and the complete exact destination, without submitting forms.
    for label, href in [('Sign up for ACLS training', REGISTRATION), ('Open MD People reimbursement portal', REIMBURSEMENT), ('How to create an expense report for physicians', EXPENSE_GUIDE), ('Notify us you’re ready to test', READINESS)]:
        link = dialog.get_by_role('link', name=label, exact=False)
        assert link.get_attribute('href') == href
        assert link.get_attribute('target') == '_blank'
        assert link.get_attribute('rel') == 'noreferrer'
        page.context.route(href, lambda route: route.fulfill(status=200, content_type='text/html', body='<title>Link target check</title>'))
        with page.expect_popup() as popup_info: link.click()
        popup = popup_info.value
        popup.wait_for_load_state()
        assert popup.url == href
        popup.close()
        page.context.unroute(href)
    close = dialog.get_by_role('button', name='Close ACLS certification workflow', exact=True)
    close.focus(); page.keyboard.press('Shift+Tab')
    expect(dialog.get_by_role('link').last).to_be_focused()
    page.keyboard.press('Tab'); expect(close).to_be_focused()
    box=dialog.bounding_box(); w=page.viewport_size['width']; h=page.viewport_size['height']
    assert box['x']>=0 and box['y']>=0 and box['x']+box['width']<=w+1 and box['y']+box['height']<=h+1
    assert dialog.evaluate('e=>e.scrollWidth<=e.clientWidth+1')
    assert page.evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth+1')
    last=dialog.get_by_role('heading', name='Complete the computerized manikin test', exact=True)
    last.scroll_into_view_if_needed();expect(last).to_be_visible()
    dialog.evaluate('e=>e.scrollTop=0')
    if output: page.screenshot(path=str(output / f'acls-flow-{w}.png'))
    close.click(); expect(dialog).to_have_count(0); expect(trigger).to_be_focused()
    trigger.click(); page.keyboard.press('Escape'); expect(dialog).to_have_count(0);expect(trigger).to_be_focused()
    trigger.click();page.mouse.click(1,1);expect(dialog).to_have_count(0);expect(trigger).to_be_focused()
    assert page.locator('body').evaluate('e=>e.style.overflow')!='hidden'

if __name__ == '__main__':
    output=Path(os.environ.get('VISUAL_QA_OUTPUT','/private/tmp/acls-qa'));output.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as p:
        browser=p.chromium.launch();errors=[]
        for w,h in [(1440,1000),(390,844),(320,568)]:
            page=browser.new_page(viewport={'width':w,'height':h},has_touch=w<500)
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
            assert_acls(page,os.environ.get('VISUAL_QA_URL','http://127.0.0.1:5173'),output,touch=w<500)
            page.close()
        browser.close();assert not errors,errors
    print('ACLS QA passed at 1440/390/320: October29 placement, adjacent-month isolation, real pointer/tap opening, complete workflow, exact new-tab link activation, focus containment/return, all dismissal modes, scrolling and viewport fit; no console errors.')
