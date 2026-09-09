from pathlib import Path

from playwright.sync_api import sync_playwright


OUTPUT = Path("/Users/roshanpatel/.codex/visualizations/2026/09/09/01a085c2-6b70-7660-831a-ff30ef2728c4")
BASE_URL = "http://127.0.0.1:5173"
CARD_HEADINGS = [
    "Optiflow",
    "MAC",
    "MAC + POM",
    "Operating room",
    "Pleasanton exclusions",
    "Remimazolam considerations",
    "Medication holds",
]
PROVIDERS = [
    "Suk Seo",
    "Maureen Morgan",
    "Dan Chung",
    "Erina Foster",
    "Courtney Gonzales",
    "Arun Suryaprasad",
    "Roshan Patel",
    "Kay Ozeki",
    "Patrick McKenzie",
    "Simon Chan",
    "Omar Al-Shuwaykh",
    "Sabrina Han",
    "Steve Cheng",
    "Ahilan Arulanandan",
    "Ed Ouyang",
    "Kirsten Regalia",
    "T.R. Levin",
    "Liz Clark",
    "Anish Patel",
    "Tom Haddad",
    "Aysha Aslam",
    "Jay Garuda",
    "Ying Wang",
    "Jag Mathur",
    "Sammy Tesfay",
    "Mariel Bailey",
]


def capture_console_errors(page):
    errors = []
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    return errors


def assert_tabs(page):
    assert page.get_by_role("tab").count() == 4
    assert page.get_by_role("tab", name="Home", exact=True).is_visible()
    assert page.get_by_role("tab", name="Procedure Sedation Criteria", exact=False).is_visible()
    assert page.get_by_role("tab", name="DSA GI MA-MD Podlets", exact=False).is_visible()
    assert page.get_by_role("tab", name="New Physician Orientation Materials", exact=False).is_visible()


def assert_home(page):
    assert page.get_by_role("heading", name="Countdowns!", exact=True).is_visible()
    assert page.get_by_text("The next markers on the map.", exact=True).count() == 0
    assert page.locator(".home-tab-icon").is_visible()
    assert page.locator(".countdown-card").count() == 7
    assert page.get_by_text("Sheikah Slate", exact=False).count() == 0
    assert page.locator(".countdown-strip").get_by_text("Tom Haddad — last on-site day", exact=True).is_visible()
    assert page.locator(".countdown-strip").get_by_text("Thu · Sep 17, 2026", exact=True).is_visible()
    assert page.locator(".countdown-strip").get_by_text("E2K — GI go-live", exact=True).is_visible()
    assert page.locator(".countdown-card time").count() == 7
    assert page.get_by_text("Rest of 2026", exact=True).count() == 0
    assert page.get_by_text("September—December", exact=True).count() == 0
    assert page.get_by_text("September 2026", exact=True).count() == 1
    assert page.get_by_role("grid", name="September 2026", exact=True).is_visible()
    assert page.locator(".calendar-weekday").count() == 7
    assert page.locator(".calendar-day:not(.calendar-day-empty)").count() == 30
    assert page.locator(".birthday-marker").count() == 4
    assert page.get_by_label("Happy Birthday, Steve Cheng!", exact=True).is_visible()
    assert page.get_by_label("Happy Birthday, Sammy Tesfay!", exact=True).is_visible()
    assert page.get_by_label("Happy Birthday, Ahilan Arulanandan!", exact=True).is_visible()
    assert page.get_by_label("Happy Birthday, Tom Haddad!", exact=True).is_visible()
    assert float(page.locator(".calendar-controls strong").evaluate("element => getComputedStyle(element).fontSize.replace('px', '')")) >= 24
    assert float(page.locator(".calendar-weekday").first.evaluate("element => getComputedStyle(element).fontSize.replace('px', '')")) >= 10
    assert float(page.locator(".calendar-day > time").first.evaluate("element => getComputedStyle(element).fontSize.replace('px', '')")) >= 13
    assert page.get_by_role("gridcell", name="September 2026 17: Tom Haddad — last on-site day", exact=True).is_visible()
    assert page.get_by_role("gridcell", name="September 2026 18", exact=True).is_visible()
    assert page.get_by_role("button", name="Previous month", exact=True).is_disabled()
    assert page.get_by_role("button", name="Next month", exact=True).is_enabled()


def assert_calendar_navigation(page):
    previous = page.get_by_role("button", name="Previous month", exact=True)
    next_month = page.get_by_role("button", name="Next month", exact=True)
    next_month.click()
    assert page.get_by_role("grid", name="October 2026", exact=True).is_visible()
    assert page.get_by_text("October 2026", exact=True).count() == 1
    assert page.locator(".calendar-event-marker").count() == 3
    assert page.locator(".birthday-marker").count() == 2
    assert previous.is_enabled()
    next_month.click()
    assert page.get_by_role("grid", name="November 2026", exact=True).is_visible()
    assert page.get_by_text("November 2026", exact=True).count() == 1
    assert page.locator(".calendar-event-marker").count() == 2
    assert page.locator(".birthday-marker").count() == 3
    next_month.click()
    assert page.get_by_role("grid", name="December 2026", exact=True).is_visible()
    assert page.get_by_text("December 2026", exact=True).count() == 1
    assert page.locator(".calendar-event-marker").count() == 0
    assert page.locator(".birthday-marker").count() == 1
    assert next_month.is_disabled()
    previous.click()
    previous.click()
    previous.click()
    assert page.get_by_role("grid", name="September 2026", exact=True).is_visible()


def assert_sedation_reference(page):
    assert page.locator("input, select, textarea").count() == 0
    assert page.locator(".criteria-card").count() == 7
    assert page.get_by_role("heading", name="Sedation criteria, at a glance.", exact=True).is_visible()
    review_date = page.get_by_text("next review date February 2027", exact=True)
    assert review_date.is_visible()
    assert review_date.evaluate("element => getComputedStyle(element).color") == "rgb(0, 0, 0)"
    assert abs(review_date.bounding_box()["x"] + review_date.bounding_box()["width"] - page.locator(".reference-heading").bounding_box()["x"] - page.locator(".reference-heading").bounding_box()["width"]) < 2
    for heading in CARD_HEADINGS:
        assert page.get_by_role("heading", name=heading, exact=True).is_visible()
    assert page.get_by_text("One-page clinical reference.", exact=False).count() == 0
    assert page.get_by_text("Boundary:", exact=True).count() == 0
    assert page.get_by_text("Peritoneal-dialysis cases must be booked at Antioch only—not Walnut Creek.", exact=False).is_visible()
    assert page.get_by_text("All hemodialysis and peritoneal-dialysis patients require a STAT potassium order.", exact=False).is_visible()


def assert_coverage_reference(page):
    assert page.get_by_role("heading", name="DSA GI MA-MD Podlets", exact=True).is_visible()
    assert page.get_by_text("2026 assignments", exact=False).is_visible()
    assert page.locator(".site-podlets").count() == 2
    assert page.locator(".pod-card").count() == 6
    assert page.locator(".pod-schedule").count() == 0
    assert page.locator(".ma-chip").count() == 11
    assert page.locator(".ma-assignment > small").count() == 0
    assert page.get_by_text("Pod 04", exact=True).count() == 0
    assert page.locator(".provider-avatar img").count() == 24
    assert page.locator(".provider-initials").count() == 2
    for provider in PROVIDERS:
        assert page.locator(".provider-panel").get_by_text(provider, exact=True).first.is_visible()
    assert page.get_by_text("Anarosa Mejia", exact=False).is_visible()
    assert page.get_by_text("Robbie Molden", exact=False).is_visible()
    assert page.get_by_text("Megan Palsa", exact=False).is_visible()
    assert page.evaluate("Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0)")


def assert_orientation_reference(page):
    assert page.get_by_role("heading", name="New Physician Orientation Materials", exact=True).count() == 1
    assert page.get_by_text("Your field guide to the first 90 days.", exact=True).count() == 0
    assert page.locator(".orientation-heading, .orientation-notice").count() == 0
    assert page.locator(".orientation-subtab").count() == 12
    assert page.locator(".orientation-subtab[aria-selected='true']").count() == 1
    assert page.locator(".orientation-card").count() == 1
    assert page.locator("details.orientation-card").count() == 0
    assert page.locator(".orientation-content img").count() == 0
    assert page.get_by_text("Call Schedule", exact=True).is_visible()
    assert page.get_by_text("WCR Door Codes: 6210", exact=True).count() == 0
    assert float(page.locator(".orientation-content").evaluate("element => getComputedStyle(element).fontSize.replace('px', '')")) >= 14
    assert page.locator(".orientation-content > .orientation-list-grid > li").count() >= 4
    assert page.locator(".orientation-content li > p").count() == 0
    first_subtab = page.locator(".orientation-subtab").first
    assert float(first_subtab.locator("strong").evaluate("element => getComputedStyle(element).fontSize.replace('px', '')")) >= 14
    assert float(first_subtab.locator("small").evaluate("element => getComputedStyle(element).fontSize.replace('px', '')")) >= 10
    assert float(first_subtab.locator("span").evaluate("element => getComputedStyle(element).fontSize.replace('px', '')")) >= 10
    assert float(first_subtab.evaluate("element => getComputedStyle(element).minHeight.replace('px', '')")) >= 78
    first_list_line = page.locator(".orientation-content li > .orientation-list-line").first
    assert first_list_line.evaluate("element => getComputedStyle(element).display") == "inline"
    assert first_list_line.evaluate("element => getComputedStyle(element).marginTop") == "0px"
    assert first_list_line.evaluate("element => getComputedStyle(element).marginBottom") == "0px"


def assert_choosing_wisely(page):
    choosing_wisely_tab = page.get_by_role("tab", name="Choosing Wisely CRC surveillance graduation", exact=False)
    choosing_wisely_tab.click()
    assert choosing_wisely_tab.get_attribute("aria-selected") == "true"
    panel = page.get_by_role("tabpanel", name="Choosing Wisely CRC surveillance graduation", exact=False)
    assert panel.get_by_role("heading", name="GI Choosing Wisely TPIP Consensus Recommendations and Implementation", exact=True).is_visible()
    assert panel.locator(".cw-smartphrase-code").count() == 4
    for smartphrase in ["DSAGIGRADNOTE", "DSAGIGRADLETTER", "DSAGIGRADMA", "DSAGIGRADDC"]:
        phrase = panel.get_by_text(smartphrase, exact=True)
        assert phrase.is_visible()
        assert int(phrase.evaluate("element => getComputedStyle(element).fontWeight")) >= 700
    assert panel.get_by_text("Continue routine screening and surveillance colonoscopies in patients aged 70-75", exact=True).is_visible()
    assert panel.get_by_text("Discontinue surveillance colonoscopies for all patients age > 85", exact=True).is_visible()
    assert panel.get_by_text("Based on a careful review of this patient's age, medical history, and prior colon cancer screening, no further colon cancer screening indicated (PROMPT updated).", exact=True).is_visible()
    assert panel.get_by_role("heading", name="Graduation Smartphrase for Patient Discharge Instructions", exact=True).is_visible()
    assert panel.get_by_role("heading", name="Graduation Smartphrase for Procedural Note", exact=True).is_visible()
    assert panel.get_by_role("heading", name="PROMPT Outreach Discontinuation Letter", exact=True).is_visible()
    assert panel.get_by_text("No further colon cancer screening indicated due to age. Can consider surveillance colonoscopy in *** years depending on patient preferences, health status and discussion with PCP at that time.", exact=True).is_visible()
    assert panel.get_by_text("Dear @Fname@ @Lname@,", exact=True).is_visible()
    assert panel.get_by_role("link", name="UCSF ePrognosis colorectal cancer screening tool", exact=True).get_attribute("href") == "https://eprognosis.ucsf.edu/cancer/partials/colorectal-cancer.php"
    for omitted_line in ["AFM email", "Smartphrase sharing", "Communication with PA", "CW-PROMPT list"]:
        assert panel.get_by_text(omitted_line, exact=False).count() == 0


def assert_all_orientation_sections_are_clean(page):
    for index in range(page.locator(".orientation-subtab").count()):
        page.locator(".orientation-subtab").nth(index).click()
        assert page.locator(".orientation-content li > p").count() == 0
        assert page.locator(".orientation-content li").evaluate_all(
            "elements => elements.every((element) => element.firstElementChild?.classList.contains('orientation-list-line'))"
        )
        assert page.locator(".orientation-content li > .orientation-list-line").evaluate_all(
            "elements => elements.every((element) => getComputedStyle(element).display === 'inline' && getComputedStyle(element).marginTop === '0px' && getComputedStyle(element).marginBottom === '0px')"
        )
        assert page.locator(".orientation-content p, .orientation-content .orientation-list-line").evaluate_all(
            """elements => elements.every((paragraph) => {
              if (!/^\\s*[^:\\n]{1,90}:(?=\\s|$)/.test(paragraph.textContent)) return true;
              const first = Array.from(paragraph.childNodes).find((node) => node.textContent.trim());
              return first?.nodeType === Node.ELEMENT_NODE && ['STRONG', 'B'].includes(first.tagName);
            })"""
        )


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)

    desktop = browser.new_page(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
    desktop_errors = capture_console_errors(desktop)
    desktop.goto(BASE_URL)
    desktop.wait_for_load_state("networkidle")
    assert_tabs(desktop)
    assert_home(desktop)
    assert_calendar_navigation(desktop)
    assert desktop.get_by_role("tab", name="Home", exact=True).get_attribute("aria-selected") == "true"
    desktop.evaluate("document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 0)")
    desktop.wait_for_timeout(100)
    desktop.screenshot(path=OUTPUT / "dsa-gi-home-countdowns-desktop.png", full_page=False)
    desktop.locator(".year-calendar").scroll_into_view_if_needed()
    steve_birthday = desktop.get_by_label("Happy Birthday, Steve Cheng!", exact=True)
    steve_birthday.hover()
    desktop.wait_for_timeout(200)
    birthday_tooltip = steve_birthday.get_by_role("tooltip")
    assert birthday_tooltip.is_visible()
    assert birthday_tooltip.get_by_text("Happy Birthday, Steve Cheng!", exact=True).is_visible()
    assert birthday_tooltip.locator("img").evaluate("image => image.complete && image.naturalWidth > 0")
    desktop.screenshot(path=OUTPUT / "dsa-gi-calendar-birthday-desktop.png", full_page=False)
    desktop.locator(".year-calendar").focus()
    tom_event = desktop.locator(".calendar-event-marker").first
    assert float(tom_event.evaluate("element => getComputedStyle(element).fontSize.replace('px', '')")) >= 12
    tom_event.focus()
    desktop.wait_for_timeout(200)
    assert tom_event.get_by_role("tooltip").is_visible()
    assert float(tom_event.get_by_role("tooltip").locator("strong").evaluate("element => getComputedStyle(element).fontSize.replace('px', '')")) >= 13
    desktop.screenshot(path=OUTPUT / "dsa-gi-calendar-desktop.png", full_page=False)
    desktop.locator(".year-calendar").focus()

    desktop.get_by_role("tab", name="Procedure Sedation Criteria", exact=False).click()
    assert_sedation_reference(desktop)
    assert desktop.get_by_role("tab", name="Procedure Sedation Criteria", exact=False).get_attribute("aria-selected") == "true"
    desktop.screenshot(path=OUTPUT / "dsa-gi-folder-tabs-sedation-desktop.png", full_page=True)

    desktop.get_by_role("tab", name="DSA GI MA-MD Podlets", exact=False).click()
    desktop.wait_for_timeout(700)
    assert_coverage_reference(desktop)
    assert desktop.get_by_role("tab", name="DSA GI MA-MD Podlets", exact=False).get_attribute("aria-selected") == "true"
    george = desktop.locator(".site-drv .pod-card").nth(0).locator(".ma-chip", has_text="George")
    george.hover()
    assert george.get_by_role("tooltip").is_visible()
    assert "Float" in george.get_by_role("tooltip").inner_text()
    assert "Mon PM" in george.get_by_role("tooltip").inner_text()
    desktop.wait_for_timeout(200)
    desktop.screenshot(path=OUTPUT / "dsa-gi-ma-coverage-tooltip.png", full_page=False)
    desktop.get_by_role("heading", name="DSA GI MA-MD Podlets", exact=True).hover()

    marissa = desktop.locator(".site-wcr .pod-card").nth(1).locator(".ma-chip", has_text="Marissa")
    marissa.focus()
    assert marissa.get_by_role("tooltip").is_visible()
    assert "Coverage" in marissa.get_by_role("tooltip").inner_text()
    assert desktop.evaluate("document.body.scrollHeight") < 1700
    desktop.get_by_role("heading", name="DSA GI MA-MD Podlets", exact=True).focus()
    desktop.screenshot(path=OUTPUT / "dsa-gi-folder-tabs-podlets-desktop.png", full_page=True)

    desktop.get_by_role("tab", name="New Physician Orientation Materials", exact=False).click()
    desktop.wait_for_timeout(300)
    assert_orientation_reference(desktop)
    assert_choosing_wisely(desktop)
    desktop.locator(".cw-smartphrase-panel").scroll_into_view_if_needed()
    desktop.screenshot(path=OUTPUT / "dsa-gi-orientation-choosing-wisely.png", full_page=False)
    assert_all_orientation_sections_are_clean(desktop)
    assert desktop.get_by_role("tab", name="New Physician Orientation Materials", exact=False).get_attribute("aria-selected") == "true"
    desktop.wait_for_timeout(350)
    desktop.screenshot(path=OUTPUT / "dsa-gi-orientation-desktop.png", full_page=False)

    people_tab = desktop.get_by_role("tab", name="People Management staff and PAs", exact=False)
    people_tab.click()
    assert desktop.get_by_text("WCR Door Codes: 6210", exact=True).is_visible()
    assert desktop.get_by_text("DSA GI PAs: Sabrina Han, Megan Palsa, Robbie Molden", exact=True).is_visible()
    assert desktop.locator(".orientation-card-sensitive").count() == 1
    assert desktop.locator(".orientation-group-grid").count() == 1
    assert desktop.locator(".orientation-site-group").count() == 3
    assert desktop.get_by_role("heading", name="Walnut Creek", exact=True).is_visible()
    assert desktop.get_by_role("heading", name="Deer Valley", exact=True).is_visible()
    assert desktop.get_by_role("heading", name="Departmentwide & regional", exact=True).is_visible()
    assert desktop.locator(".site-group-wcr").get_by_text("WCR Door Codes: 6210", exact=True).is_visible()
    assert desktop.locator(".site-group-wcr").get_by_text("DRV Door Codes", exact=False).count() == 0
    assert desktop.locator(".site-group-drv").get_by_text(
        "DRV Door Codes: 6363 (GI office), 3636 (GI unit), 2525 (staff break room/scrubs), 7343 (additional DRV office space)",
        exact=True,
    ).is_visible()
    assert desktop.get_by_text("WCR Door Codes:", exact=True).evaluate("element => element.tagName") == "STRONG"
    desktop.wait_for_timeout(350)
    desktop.screenshot(path=OUTPUT / "dsa-gi-orientation-people-grouped.png", full_page=False)

    people_tab.press("ArrowRight")
    assert desktop.get_by_role("tab", name="Contacts Phone and voicemail directory", exact=False).get_attribute("aria-selected") == "true"
    assert desktop.get_by_text("DSA General GI number (for patients): (925) 295-4080", exact=True).is_visible()
    assert desktop.locator(".orientation-site-group").count() == 4
    assert desktop.get_by_role("heading", name="Dublin", exact=True).is_visible()
    assert desktop.locator(".site-group-dublin").get_by_text("James Patricio", exact=False).is_visible()
    assert desktop.get_by_text("DSA General GI number (for patients):", exact=True).evaluate("element => element.tagName") == "STRONG"
    desktop.wait_for_timeout(350)
    desktop.screenshot(path=OUTPUT / "dsa-gi-orientation-contacts-grouped.png", full_page=False)

    search = desktop.get_by_role("searchbox", name="Search the field guide")
    search.fill("QuikAction")
    desktop.wait_for_timeout(400)
    assert desktop.locator(".orientation-subtab").count() == 1
    assert desktop.locator(".orientation-card").count() == 1
    assert desktop.locator(".orientation-card").get_by_text("MA-MD Partnership", exact=True).is_visible()
    assert desktop.locator(".orientation-card").evaluate("element => getComputedStyle(element).getPropertyValue('--section-accent').trim()") == "#c65f82"
    assert desktop.get_by_text("Please feel free to send any questions or concerns about performance issues to Dr. Gonzales", exact=False).is_visible()
    desktop.screenshot(path=OUTPUT / "dsa-gi-orientation-search.png", full_page=False)
    desktop.get_by_role("button", name="Clear search").click()
    assert desktop.locator(".orientation-subtab").count() == 12
    assert desktop.locator(".orientation-card").count() == 1

    mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    mobile_errors = capture_console_errors(mobile)
    mobile.goto(BASE_URL)
    mobile.wait_for_load_state("networkidle")
    assert_tabs(mobile)
    assert_home(mobile)
    assert mobile.locator(".countdown-strip").evaluate("element => element.scrollWidth > element.clientWidth")
    mobile.screenshot(path=OUTPUT / "dsa-gi-home-countdowns-mobile.png", full_page=False)
    mobile.locator(".year-calendar").scroll_into_view_if_needed()
    mobile_birthday = mobile.get_by_label("Happy Birthday, Steve Cheng!", exact=True)
    mobile_birthday.focus()
    mobile.wait_for_timeout(200)
    assert mobile_birthday.get_by_role("tooltip").is_visible()
    assert mobile_birthday.get_by_role("tooltip").get_by_text("Happy Birthday, Steve Cheng!", exact=True).is_visible()
    assert mobile_birthday.get_by_role("tooltip").locator("img").evaluate("image => image.complete && image.naturalWidth > 0")
    mobile.screenshot(path=OUTPUT / "dsa-gi-calendar-birthday-mobile.png", full_page=False)
    mobile.locator(".year-calendar").focus()
    mobile_event = mobile.locator(".calendar-event-marker").first
    mobile_event.focus()
    mobile.wait_for_timeout(200)
    assert mobile_event.get_by_role("tooltip").is_visible()
    assert float(mobile_event.get_by_role("tooltip").locator("strong").evaluate("element => getComputedStyle(element).fontSize.replace('px', '')")) >= 15
    mobile.screenshot(path=OUTPUT / "dsa-gi-calendar-mobile.png", full_page=False)
    mobile.locator(".year-calendar").focus()
    mobile.get_by_role("tab", name="Procedure Sedation Criteria", exact=False).click()
    assert_sedation_reference(mobile)
    mobile.screenshot(path=OUTPUT / "dsa-gi-folder-tabs-sedation-mobile.png", full_page=False)
    mobile.get_by_role("tab", name="DSA GI MA-MD Podlets", exact=False).click()
    mobile.wait_for_timeout(700)
    assert_coverage_reference(mobile)
    assert mobile.locator(".pod-card").nth(0).get_by_text("Pod 01", exact=True).is_visible()
    mobile.screenshot(path=OUTPUT / "dsa-gi-folder-tabs-podlets-mobile.png", full_page=True)

    mobile.get_by_role("tab", name="New Physician Orientation Materials", exact=False).click()
    mobile.wait_for_timeout(300)
    assert_orientation_reference(mobile)
    assert mobile.locator(".orientation-tools").is_visible()
    assert mobile.locator(".orientation-subtabs").evaluate("element => element.scrollWidth > element.clientWidth")
    mobile.screenshot(path=OUTPUT / "dsa-gi-orientation-mobile.png", full_page=False)
    assert_choosing_wisely(mobile)
    assert mobile.locator(".cw-smartphrase-grid").evaluate("element => getComputedStyle(element).gridTemplateColumns.split(' ').length") == 1
    mobile.locator(".cw-smartphrase-panel").scroll_into_view_if_needed()
    mobile.screenshot(path=OUTPUT / "dsa-gi-orientation-choosing-wisely-mobile.png", full_page=False)

    assert not desktop_errors, desktop_errors
    assert not mobile_errors, mobile_errors
    browser.close()

print("Visual QA passed: Home countdowns, September–December GI birthdays, four folder tabs, 12-section field guide including Choosing Wisely, podlet tooltips, portraits, and mobile layout.")
