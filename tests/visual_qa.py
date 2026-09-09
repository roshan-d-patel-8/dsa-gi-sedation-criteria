import re
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


def assert_global_zoom(page, mobile=False):
    zoom_trigger = page.get_by_role("button", name="Zoom page", exact=False)
    assert zoom_trigger.is_visible()
    assert zoom_trigger.get_attribute("aria-expanded") == "false"
    zoom_trigger.click()
    zoom_panel = page.get_by_role("group", name="Page zoom controls", exact=True)
    assert zoom_panel.is_visible()
    assert zoom_panel.locator("output").inner_text() == "100%"
    assert zoom_panel.get_by_role("button", name="Reset to 100%", exact=True).is_disabled()
    zoom_panel.get_by_role("button", name="Zoom in", exact=True).click()
    surface = page.locator(".page-zoom-surface")
    assert surface.get_attribute("data-zoom") == "110"
    assert surface.evaluate("element => getComputedStyle(element).zoom") == "1.1"
    assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")
    assert zoom_panel.locator("output").inner_text() == "110%"
    page.screenshot(path=OUTPUT / ("dsa-gi-zoom-control-mobile.png" if mobile else "dsa-gi-zoom-control-desktop.png"), full_page=False)
    page.keyboard.press("Escape")
    assert zoom_panel.count() == 0

    for tab_name in ["Home", "Procedure Sedation Criteria", "DSA GI MA-MD Podlets", "New Physician Orientation Materials"]:
        page.get_by_role("tab", name=tab_name, exact=False).click()
        assert page.get_by_role("button", name="Zoom page, currently 110%", exact=True).is_visible()
        assert page.locator(".page-zoom-surface").get_attribute("data-zoom") == "110"

    page.reload()
    page.wait_for_load_state("networkidle")
    assert page.get_by_role("button", name="Zoom page, currently 110%", exact=True).is_visible()
    page.get_by_role("button", name="Zoom page, currently 110%", exact=True).click()
    page.get_by_role("button", name="Reset to 100%", exact=True).click()
    assert page.locator(".page-zoom-surface").get_attribute("data-zoom") == "100"
    assert page.evaluate("localStorage.getItem('dsa-gi-page-zoom')") == "100"
    page.keyboard.press("Escape")


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
    announcements = page.locator(".calendar-announcements")
    assert announcements.get_attribute("aria-label") == "Announcements for September 2026"
    assert announcements.get_by_role("heading", name="Announcements", exact=True).is_visible()
    assert announcements.locator(".announcement-card").count() == 2
    assert announcements.get_by_text("Pharmacy Authorization form for Desktop Medicine", exact=True).is_visible()
    assert announcements.get_by_text("Due Sep 14", exact=True).get_attribute("datetime") == "2026-09-14"
    assert announcements.get_by_text("NCAL GI 2-hour TPIP makeup", exact=True).is_visible()
    assert announcements.get_by_text("Nov 5 · 6–8 PM", exact=True).get_attribute("datetime") == "2026-11-05T18:00:00-08:00"
    assert page.locator(".calendar-weekday").count() == 7
    assert page.locator(".calendar-day:not(.calendar-day-empty)").count() == 30
    assert page.locator(".birthday-marker").count() == 4
    assert page.get_by_label("Happy Birthday, Steve Cheng!", exact=True).is_visible()
    assert page.get_by_label("Happy Birthday, Sammy Tesfay!", exact=True).is_visible()
    assert page.get_by_label("Happy Birthday, Ahilan Arulanandan!", exact=True).is_visible()
    assert page.get_by_label("Happy Birthday, Tom Haddad!", exact=True).is_visible()
    farewell = page.get_by_label("Tom's Farewell Happy Hour, Thu · Sep 10, 2026, Barebottle Brewing Co. · Walnut Creek Taproom & Kitchen", exact=True)
    assert farewell.is_visible()
    assert page.locator(".calendar-social-marker").count() == 1
    assert page.get_by_role("gridcell", name="September 2026 10: Tom's Farewell Happy Hour", exact=True).is_visible()
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
    assert page.locator(".calendar-announcements").get_attribute("aria-label") == "Announcements for October 2026"
    assert page.locator(".announcement-card").count() == 0
    assert page.get_by_text("No announcements for this month.", exact=True).is_visible()
    assert page.locator(".calendar-event-marker").count() == 3
    assert page.locator(".birthday-marker").count() == 2
    assert previous.is_enabled()
    next_month.click()
    assert page.get_by_role("grid", name="November 2026", exact=True).is_visible()
    assert page.get_by_text("November 2026", exact=True).count() == 1
    assert page.locator(".announcement-card").count() == 0
    assert page.locator(".calendar-event-marker").count() == 2
    assert page.locator(".birthday-marker").count() == 4
    roshan_birthday = page.get_by_label("Happy Birthday, Roshan Patel!", exact=True)
    assert roshan_birthday.is_visible()
    roshan_birthday.focus()
    page.wait_for_timeout(200)
    assert roshan_birthday.get_by_role("tooltip").get_by_text("Happy Birthday, Roshan Patel!", exact=True).is_visible()
    assert roshan_birthday.get_by_role("tooltip").locator("img").evaluate("image => image.complete && image.naturalWidth > 0")
    page.screenshot(path=OUTPUT / "dsa-gi-calendar-roshan-birthday-desktop.png", full_page=False)
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
    assert page.locator(".announcement-card").count() == 2


def assert_sedation_reference(page):
    assert page.locator("input, select, textarea").count() == 0
    assert page.locator(".criteria-card").count() == 6
    assert page.get_by_role("heading", name="Sedation criteria, at a glance.", exact=True).is_visible()
    review_date = page.get_by_text("next review date February 2027", exact=True)
    assert review_date.is_visible()
    assert review_date.evaluate("element => getComputedStyle(element).color") == "rgb(0, 0, 0)"
    assert abs(review_date.bounding_box()["x"] + review_date.bounding_box()["width"] - page.locator(".reference-heading").bounding_box()["x"] - page.locator(".reference-heading").bounding_box()["width"]) < 2
    for heading in CARD_HEADINGS:
        assert page.get_by_role("heading", name=heading, exact=True).is_visible()
    assert page.get_by_role("heading", name="Medication holds", exact=True).count() == 0
    assert page.get_by_text("POM guidance", exact=True).count() == 0
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
    wcr_pod_three = page.locator(".site-wcr .pod-card").filter(has_text="Pod 03")
    assert wcr_pod_three.locator(".ma-roster").get_by_text("Martha", exact=True).is_visible()
    assert page.get_by_text("Natalie", exact=True).count() == 0
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
    schedule_accordions = page.locator(".orientation-content > details.orientation-topic-group")
    assert schedule_accordions.count() == 3
    assert schedule_accordions.evaluate_all("elements => elements.every((element) => !element.open)")
    call_schedule = page.locator(".topic-schedule-call")
    assert call_schedule.get_by_role("heading", name="Call Schedule", exact=True).is_visible()
    call_schedule.locator("summary").press("Enter")
    assert call_schedule.get_by_text("Weekday call Mon 8:30 AM - Fri 5:30 PM", exact=True).is_visible()
    assert page.get_by_text("WCR Door Codes: 6210", exact=True).count() == 0
    assert float(page.locator(".orientation-content").evaluate("element => getComputedStyle(element).fontSize.replace('px', '')")) >= 14
    assert call_schedule.locator(".orientation-list-grid > li").count() >= 6
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
    infographic_button = panel.get_by_role("button", name="Expand Choosing Wisely graduation infographic", exact=True)
    assert infographic_button.is_visible()
    assert infographic_button.locator("img").evaluate("image => image.decode().then(() => image.naturalWidth == 5504 && image.naturalHeight == 3072)")
    infographic_button.click()
    infographic_dialog = page.get_by_role("dialog", name="Choosing Wisely · Graduation from Surveillance Colonoscopy · January–July 2026", exact=True)
    assert infographic_dialog.is_visible()
    assert infographic_dialog.locator("img").evaluate("image => image.decode().then(() => image.naturalWidth == 5504 && image.naturalHeight == 3072)")
    assert page.get_by_role("button", name="Close Choosing Wisely infographic", exact=True).is_visible()
    page.keyboard.press("Escape")
    assert infographic_dialog.count() == 0
    infographic_button.click()
    page.locator(".cw-infographic-backdrop").click(position={"x": 5, "y": 5})
    assert infographic_dialog.count() == 0
    cw_topics = panel.locator(".orientation-cw-topic")
    assert cw_topics.count() == 8
    assert cw_topics.evaluate_all("elements => elements.every((element) => !element.open)")
    for index in range(cw_topics.count()):
        cw_topics.nth(index).locator("summary").click()
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
    expected_accordion_counts = [3, 3, 3, 5, 2, 3, 4, 8, 1, 1, 1, 5]
    for index in range(page.locator(".orientation-subtab").count()):
        page.locator(".orientation-subtab").nth(index).click()
        accordions = page.locator(".orientation-content details.orientation-site-group")
        assert accordions.count() == expected_accordion_counts[index]
        assert accordions.evaluate_all("elements => elements.every((element) => !element.open)")
        accordions.first.locator("summary").press("Enter")
        assert accordions.first.get_attribute("open") == ""
        assert page.locator(".orientation-content li > p").count() == 0
        assert page.locator(".orientation-content li:not(.skills-day-chapter)").evaluate_all(
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
    assert_global_zoom(desktop)
    assert_home(desktop)
    assert_calendar_navigation(desktop)
    assert desktop.get_by_role("tab", name="Home", exact=True).get_attribute("aria-selected") == "true"
    desktop.evaluate("document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 0)")
    desktop.wait_for_timeout(100)
    desktop.screenshot(path=OUTPUT / "dsa-gi-home-countdowns-desktop.png", full_page=False)
    desktop.locator(".year-calendar").scroll_into_view_if_needed()
    calendar_box = desktop.locator(".calendar-main").bounding_box()
    announcements_box = desktop.locator(".calendar-announcements").bounding_box()
    assert announcements_box["x"] > calendar_box["x"] + calendar_box["width"]
    desktop.screenshot(path=OUTPUT / "dsa-gi-calendar-announcements-desktop.png", full_page=False)
    steve_birthday = desktop.get_by_label("Happy Birthday, Steve Cheng!", exact=True)
    steve_birthday.hover()
    desktop.wait_for_timeout(200)
    birthday_tooltip = steve_birthday.get_by_role("tooltip")
    assert birthday_tooltip.is_visible()
    assert birthday_tooltip.get_by_text("Happy Birthday, Steve Cheng!", exact=True).is_visible()
    assert birthday_tooltip.locator("img").evaluate("image => image.complete && image.naturalWidth > 0")
    desktop.screenshot(path=OUTPUT / "dsa-gi-calendar-birthday-desktop.png", full_page=False)
    desktop.locator(".year-calendar").focus()
    farewell = desktop.get_by_label("Tom's Farewell Happy Hour, Thu · Sep 10, 2026, Barebottle Brewing Co. · Walnut Creek Taproom & Kitchen", exact=True)
    farewell.hover()
    desktop.wait_for_timeout(200)
    farewell_tooltip = farewell.get_by_role("tooltip")
    assert farewell_tooltip.is_visible()
    assert desktop.locator(".calendar-main").evaluate("element => getComputedStyle(element).overflow") == "visible"
    farewell_tooltip_box = farewell_tooltip.bounding_box()
    calendar_main_box = desktop.locator(".calendar-main").bounding_box()
    assert farewell_tooltip_box["y"] < calendar_main_box["y"]
    assert farewell_tooltip_box["y"] >= 0
    assert farewell_tooltip.get_by_text("Tom's Farewell Happy Hour", exact=True).is_visible()
    assert farewell_tooltip.get_by_text("Barebottle Brewing Co. · Walnut Creek Taproom & Kitchen", exact=True).is_visible()
    assert farewell_tooltip.locator("img").evaluate("image => image.decode().then(() => image.naturalWidth == 1672 && image.naturalHeight == 941)")
    desktop.screenshot(path=OUTPUT / "dsa-gi-calendar-tom-farewell-desktop.png", full_page=False)
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
    desktop.wait_for_timeout(850)
    desktop.evaluate("window.scrollTo(0, 0)")
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
    desktop.screenshot(path=OUTPUT / "dsa-gi-orientation-choosing-wisely-thumbnail.png", full_page=False)
    desktop.get_by_role("button", name="Expand Choosing Wisely graduation infographic", exact=True).click()
    desktop.wait_for_timeout(250)
    desktop.screenshot(path=OUTPUT / "dsa-gi-orientation-choosing-wisely-infographic.png", full_page=False)
    desktop.get_by_role("button", name="Close Choosing Wisely infographic", exact=True).click()
    desktop.locator(".cw-smartphrase-panel").scroll_into_view_if_needed()
    desktop.screenshot(path=OUTPUT / "dsa-gi-orientation-choosing-wisely.png", full_page=False)
    assert_all_orientation_sections_are_clean(desktop)
    assert desktop.get_by_role("tab", name="New Physician Orientation Materials", exact=False).get_attribute("aria-selected") == "true"
    desktop.wait_for_timeout(350)
    desktop.screenshot(path=OUTPUT / "dsa-gi-orientation-desktop.png", full_page=False)

    communication_tab = desktop.get_by_role("tab", name="Communication Approved channels", exact=False)
    communication_tab.click()
    communication_content = desktop.locator("#orientation-communication-panel .orientation-content")
    communication_accordions = communication_content.locator(":scope > details")
    assert communication_accordions.count() == 3
    assert communication_accordions.evaluate_all("elements => elements.every((element) => !element.open)")
    assert communication_content.locator(":scope > :not(details)").count() == 0

    email_directory = desktop.locator(".orientation-email-directory")
    assert email_directory.get_by_role("heading", name="Email Directory", exact=True).is_visible()
    email_directory.locator("summary").press("Enter")
    source_html = (Path(__file__).parents[1] / "src" / "orientation-source.html").read_text()
    source_emails = set(re.findall(r'href="mailto:([^\"]+)"', source_html, flags=re.IGNORECASE))
    rendered_emails = set(email_directory.locator('a[href^="mailto:"]').all_text_contents())
    assert source_emails == rendered_emails == {"dsagimdtimeoffrequests@kp.org", "dsagimds@kp.org"}
    assert email_directory.locator("tbody tr").count() == len(source_emails)
    assert email_directory.get_by_text("Physician schedule & time-off requests", exact=True).is_visible()
    assert email_directory.get_by_text("Centralized requests outside the annual vacation draft", exact=True).is_visible()
    assert email_directory.get_by_text("DSA GI MDs group email", exact=True).is_visible()
    assert email_directory.get_by_text("Put (PHI) in the subject line", exact=False).is_visible()
    desktop.context.grant_permissions(["clipboard-read", "clipboard-write"], origin=BASE_URL)
    copy_schedule_email = email_directory.get_by_role("button", name="Copy dsagimdtimeoffrequests@kp.org to clipboard", exact=True)
    copy_schedule_email.click()
    desktop.wait_for_timeout(120)
    assert copy_schedule_email.inner_text().strip() == "Copied"
    assert desktop.evaluate("navigator.clipboard.readText()") == "dsagimdtimeoffrequests@kp.org"

    secure_channels = desktop.locator(".orientation-secure-channels")
    secure_channels.locator("summary").press("Enter")
    assert secure_channels.get_by_text("Microsoft Teams: HIPAA compliant", exact=True).is_visible()
    assert secure_channels.get_by_text("KP iPhone", exact=True).is_visible()
    assert secure_channels.get_by_text("Health Connect Chart Chat", exact=True).is_visible()
    assert secure_channels.get_by_text("Outlook:", exact=False).count() == 0

    pool_party = desktop.locator(".orientation-pool-party")
    assert pool_party.count() == 1
    assert pool_party.get_by_role("heading", name="Pool Party", exact=True).is_visible()
    assert pool_party.get_attribute("open") is None
    pool_party.locator("summary").press("Enter")
    pool_rows = [
        ("P WCR GI APPT", "Urgent procedure scheduling requests"),
        ("P WCR GI MA", "Walnut Creek MA inbox"),
        ("P DRV GI MA", "Deer Valley MA inbox"),
        ("P WCR GI ADV", "Walnut Creek GI Advice RN"),
        ("P NCAL IBD PHARM", "Regional IBD pharmacy referrals"),
        ("P NCAL REG THERAPY PLAN", "Biologic infusion-order renewals"),
        ("P WCR INF RN", "Walnut Creek infusion RN inbox"),
        ("P DRV ONC RN", "Deer Valley infusion/oncology RN inbox"),
        ("P DUB INF RN", "Dublin infusion RN inbox"),
    ]
    assert pool_party.locator("tbody tr").count() == 9
    assert pool_party.get_by_role("button").count() == 9
    for pool, purpose in pool_rows:
        row = pool_party.locator("tr", has_text=pool)
        assert row.get_by_text(pool, exact=True).is_visible()
        assert purpose in row.locator("td").nth(1).inner_text()
        assert row.get_by_role("button", name=f"Copy {pool} to clipboard", exact=True).is_visible()
    copy_pool = pool_party.get_by_role("button", name="Copy P WCR GI APPT to clipboard", exact=True)
    copy_pool.click()
    desktop.wait_for_timeout(120)
    assert copy_pool.inner_text().strip() == "Copied"
    assert desktop.evaluate("navigator.clipboard.readText()") == "P WCR GI APPT"
    assert pool_party.locator(".pool-reference-only").count() == 3
    assert pool_party.get_by_text("routine infusion requests no longer need to be routed to them", exact=False).is_visible()
    email_directory.scroll_into_view_if_needed()
    desktop.screenshot(path=OUTPUT / "dsa-gi-orientation-communications-desktop.png", full_page=True)

    people_tab = desktop.get_by_role("tab", name="People Management staff and PAs", exact=False)
    people_tab.click()
    assert desktop.locator(".orientation-card-sensitive").count() == 1
    assert desktop.locator(".orientation-group-grid").count() == 1
    assert desktop.locator("details.orientation-site-group").count() == 3
    assert desktop.get_by_role("heading", name="Walnut Creek", exact=True).is_visible()
    assert desktop.get_by_role("heading", name="Deer Valley", exact=True).is_visible()
    assert desktop.get_by_role("heading", name="Departmentwide & regional", exact=True).is_visible()
    assert desktop.get_by_role("heading", name="Skills Day", exact=True).count() == 0
    assert desktop.locator(".orientation-skills-day").count() == 0
    assert desktop.locator("details.orientation-site-group[open]").count() == 0
    wcr_group = desktop.locator(".site-group-wcr")
    wcr_group.locator("summary").press("Enter")
    assert wcr_group.get_by_text("WCR Door Codes: 6210", exact=True).is_visible()
    assert desktop.locator(".site-group-wcr").get_by_text("WCR Door Codes: 6210", exact=True).is_visible()
    assert desktop.locator(".site-group-wcr").get_by_text("DRV Door Codes", exact=False).count() == 0
    drv_group = desktop.locator(".site-group-drv")
    drv_group.locator("summary").click()
    assert drv_group.get_by_text(
        "DRV Door Codes: 6363 (GI office), 3636 (GI unit), 2525 (staff break room/scrubs), 7343 (additional DRV office space)",
        exact=True,
    ).is_visible()
    departmentwide_group = desktop.locator(".site-group-departmentwide")
    departmentwide_group.locator("summary").click()
    assert departmentwide_group.get_by_text("DSA GI PAs: Sabrina Han, Megan Palsa, Robbie Molden", exact=True).is_visible()
    assert desktop.get_by_text("WCR Door Codes:", exact=True).evaluate("element => element.tagName") == "STRONG"
    departmentwide_group.scroll_into_view_if_needed()
    desktop.wait_for_timeout(350)
    desktop.screenshot(path=OUTPUT / "dsa-gi-orientation-people-grouped.png", full_page=False)

    people_tab.press("ArrowRight")
    assert desktop.get_by_role("tab", name="Contacts Phone and voicemail directory", exact=False).get_attribute("aria-selected") == "true"
    assert desktop.locator(".orientation-site-group").count() == 5
    assert desktop.locator("details.orientation-site-group[open]").count() == 0
    directory_access = desktop.locator(".topic-contact-directory")
    directory_access.locator("summary").press("Enter")
    assert directory_access.get_by_role("link", name="KPATHS Facility Information directory", exact=True).is_visible()
    assert desktop.get_by_role("heading", name="Dublin", exact=True).is_visible()
    contacts_departmentwide = desktop.locator(".site-group-departmentwide")
    contacts_departmentwide.locator("summary").click()
    assert contacts_departmentwide.get_attribute("open") == ""
    assert "DSA General GI number (for patients): (925) 295-4080" in contacts_departmentwide.inner_text()
    contacts_dublin = desktop.locator(".site-group-dublin")
    contacts_dublin.locator("summary").click()
    assert desktop.locator(".site-group-dublin").get_by_text("James Patricio", exact=False).is_visible()
    assert desktop.get_by_text("DSA General GI number (for patients):", exact=True).evaluate("element => element.tagName") == "STRONG"
    desktop.wait_for_timeout(350)
    desktop.screenshot(path=OUTPUT / "dsa-gi-orientation-contacts-grouped.png", full_page=False)

    procedures_tab = desktop.get_by_role("tab", name="Procedures Appointment types and documentation", exact=False)
    procedures_tab.click()
    assert desktop.locator(".orientation-procedure-grid").count() == 1
    assert desktop.locator("details.orientation-procedure-group").count() == 3
    assert desktop.locator("details.orientation-site-group").count() == 4
    assert desktop.locator("details.orientation-site-group[open]").count() == 0
    assert desktop.locator(".orientation-procedure-grid summary > i").count() == 4
    for heading in ["Appointment types", "Sedation & flex-sig routing", "Procedure documentation", "Skills Day"]:
        assert desktop.get_by_role("heading", name=heading, exact=True).is_visible()
    desktop.locator(".orientation-card").scroll_into_view_if_needed()
    desktop.wait_for_timeout(250)
    desktop.screenshot(path=OUTPUT / "dsa-gi-orientation-procedures-collapsed.png", full_page=False)

    type_group = desktop.locator(".procedure-group-types")
    type_group.locator("summary").press("Enter")
    assert type_group.get_by_text("CLNS – Screening/surveillance colonoscopy", exact=True).is_visible()
    routing_group = desktop.locator(".procedure-group-routing")
    routing_group.locator("summary").click()
    assert routing_group.get_by_text("if a patient has ESRD on HD/ PD", exact=False).is_visible()
    assert routing_group.get_by_text("We have flex-sig units", exact=False).is_visible()
    documentation_group = desktop.locator(".procedure-group-documentation")
    documentation_group.locator("summary").click()
    assert documentation_group.get_by_text("For pre-procedure H&P, use .prochpamb smartphrase.", exact=True).is_visible()
    skills_day = desktop.locator(".orientation-skills-day")
    skills_day.locator("summary").click()
    assert skills_day.locator("iframe").is_visible()
    assert skills_day.locator("iframe").get_attribute("title") == "DSA GI Skills Day 2025"
    assert skills_day.locator("iframe").get_attribute("src") == "https://www.youtube-nocookie.com/embed/WYdP1js9NPk?rel=0"
    assert skills_day.get_by_role("link", name="Open on YouTube", exact=True).get_attribute("href") == "https://youtu.be/WYdP1js9NPk"
    chapter_titles = [
        ("Variceal banding", "0:05", 5),
        ("Balloon dilation", "8:57", 537),
        ("Savary dilation", "15:30", 930),
        ("Swimmer's Position for Colonoscopy", "26:37", 1597),
        ("Clipping", "27:15", 1635),
        ("Endoloop", "31:02", 1862),
        ("ERBE Principles", "33:13", 1993),
        ("Spyglass (cholangioscopy)", "35:22", 2122),
        ("Trapezoid basket", "46:56", 2816),
    ]
    chapter_nav = skills_day.get_by_role("navigation", name="Skills Day video chapters")
    assert chapter_nav.is_visible()
    assert chapter_nav.get_by_role("link").count() == 9
    video_box = skills_day.locator(".skills-day-video").bounding_box()
    chapter_box = chapter_nav.bounding_box()
    assert chapter_box["x"] >= video_box["x"] + video_box["width"]
    for title, timestamp, seconds in chapter_titles:
        chapter_link = chapter_nav.get_by_role("link", name=f"{timestamp} {title}", exact=False)
        assert chapter_link.is_visible()
        assert chapter_link.get_attribute("href") == f"https://youtu.be/WYdP1js9NPk?t={seconds}s"
    balloon_chapter = chapter_nav.get_by_role("link", name="8:57 Balloon dilation", exact=False)
    balloon_chapter.click()
    chapter_player_src = skills_day.locator("iframe").get_attribute("src")
    assert chapter_player_src == "https://www.youtube-nocookie.com/embed/WYdP1js9NPk?rel=0&start=537&autoplay=1", chapter_player_src
    assert skills_day.locator("iframe").get_attribute("title") == "DSA GI Skills Day 2025 — Balloon dilation"
    assert balloon_chapter.get_attribute("aria-current") == "true"
    assert chapter_nav.get_by_text("Now playing: Balloon dilation (8:57)", exact=True).is_visible()
    procedures_tab.scroll_into_view_if_needed()
    desktop.wait_for_timeout(350)
    desktop.screenshot(path=OUTPUT / "dsa-gi-orientation-procedures-accordion.png", full_page=True)

    search = desktop.get_by_role("searchbox", name="Search the field guide")
    search.fill("QuikAction")
    desktop.wait_for_timeout(400)
    assert desktop.locator(".orientation-subtab").count() == 1
    assert desktop.locator(".orientation-card").count() == 1
    assert desktop.locator(".orientation-card").get_by_text("MA-MD Partnership", exact=True).is_visible()
    assert desktop.locator(".orientation-card").evaluate("element => getComputedStyle(element).getPropertyValue('--section-accent').trim()") == "#c65f82"
    search_highlights = desktop.locator(".orientation-content mark.search-highlight")
    assert search_highlights.count() > 0
    assert search_highlights.evaluate_all("elements => elements.every((element) => element.textContent.toLowerCase() === 'quikaction')")
    assert search_highlights.evaluate_all("elements => elements.every((element) => getComputedStyle(element).backgroundImage !== 'none')")
    assert desktop.locator(".topic-ma-results[open]").count() == 1
    assert desktop.locator(".orientation-topic-group[open]").count() == 1
    assert search_highlights.first.is_visible()
    assert search_highlights.first.evaluate("element => { const box = element.getBoundingClientRect(); return box.top >= 0 && box.bottom <= innerHeight; }")
    assert desktop.locator(".orientation-results").get_by_text("highlighted", exact=False).is_visible()
    desktop.screenshot(path=OUTPUT / "dsa-gi-orientation-search.png", full_page=False)
    desktop.get_by_role("button", name="Clear search").click()
    assert desktop.locator(".orientation-subtab").count() == 12
    assert desktop.locator(".orientation-card").count() == 1
    assert desktop.locator("mark.search-highlight").count() == 0
    assert desktop.locator(".orientation-content details[open]").count() == 0

    search.fill("prochpamb")
    desktop.wait_for_timeout(300)
    assert desktop.locator(".orientation-subtab").count() == 1
    assert desktop.locator(".procedure-group-documentation[open]").count() == 1
    assert desktop.locator(".orientation-content details[open]").count() == 1
    assert desktop.locator(".orientation-content mark.search-highlight").count() > 0
    desktop.get_by_role("button", name="Clear search").click()

    mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    mobile_errors = capture_console_errors(mobile)
    mobile.goto(BASE_URL)
    mobile.wait_for_load_state("networkidle")
    assert_tabs(mobile)
    assert_global_zoom(mobile, mobile=True)
    assert_home(mobile)
    assert mobile.locator(".countdown-strip").evaluate("element => element.scrollWidth > element.clientWidth")
    mobile.screenshot(path=OUTPUT / "dsa-gi-home-countdowns-mobile.png", full_page=False)
    mobile.locator(".year-calendar").scroll_into_view_if_needed()
    mobile_calendar_box = mobile.locator(".calendar-main").bounding_box()
    mobile_announcements_box = mobile.locator(".calendar-announcements").bounding_box()
    assert mobile_announcements_box["y"] >= mobile_calendar_box["y"] + mobile_calendar_box["height"]
    mobile.locator(".calendar-announcements").scroll_into_view_if_needed()
    mobile.screenshot(path=OUTPUT / "dsa-gi-calendar-announcements-mobile.png", full_page=False)
    mobile_birthday = mobile.get_by_label("Happy Birthday, Steve Cheng!", exact=True)
    mobile_birthday.focus()
    mobile.wait_for_timeout(200)
    assert mobile_birthday.get_by_role("tooltip").is_visible()
    assert mobile_birthday.get_by_role("tooltip").get_by_text("Happy Birthday, Steve Cheng!", exact=True).is_visible()
    assert mobile_birthday.get_by_role("tooltip").locator("img").evaluate("image => image.complete && image.naturalWidth > 0")
    mobile.screenshot(path=OUTPUT / "dsa-gi-calendar-birthday-mobile.png", full_page=False)
    mobile.locator(".year-calendar").focus()
    mobile_farewell = mobile.get_by_label("Tom's Farewell Happy Hour, Thu · Sep 10, 2026, Barebottle Brewing Co. · Walnut Creek Taproom & Kitchen", exact=True)
    mobile_farewell.focus()
    mobile.wait_for_timeout(200)
    assert mobile_farewell.get_by_role("tooltip").is_visible()
    assert mobile_farewell.get_by_role("tooltip").locator("img").evaluate("image => image.complete && image.naturalWidth == 1672")
    mobile.screenshot(path=OUTPUT / "dsa-gi-calendar-tom-farewell-mobile.png", full_page=False)
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
    mobile_search = mobile.get_by_role("searchbox", name="Search the field guide")
    mobile_search.fill("QuikAction")
    mobile.wait_for_timeout(300)
    assert mobile.locator(".orientation-subtab").count() == 1
    assert mobile.locator(".topic-ma-results[open]").count() == 1
    assert mobile.locator(".orientation-content mark.search-highlight").count() > 0
    assert mobile.locator(".orientation-content mark.search-highlight").first.is_visible()
    assert mobile.locator(".orientation-content mark.search-highlight").first.evaluate("element => { const box = element.getBoundingClientRect(); return box.top >= 0 && box.bottom <= innerHeight; }")
    mobile.screenshot(path=OUTPUT / "dsa-gi-orientation-search-mobile.png", full_page=False)
    mobile.get_by_role("button", name="Clear search").click()
    assert mobile.locator(".orientation-content details[open]").count() == 0
    mobile.get_by_role("tab", name="Communication Approved channels", exact=False).click()
    mobile_email_directory = mobile.locator(".orientation-email-directory")
    mobile_email_directory.locator("summary").click()
    assert mobile_email_directory.locator("tbody tr").count() == 2
    assert mobile_email_directory.locator(".email-directory-body").evaluate("element => element.scrollWidth <= element.clientWidth")
    assert mobile_email_directory.get_by_role("button", name="Copy dsagimdtimeoffrequests@kp.org to clipboard", exact=True).is_visible()
    mobile_pool_party = mobile.locator(".orientation-pool-party")
    mobile_pool_party.locator("summary").click()
    assert mobile_pool_party.locator("tbody tr").count() == 9
    assert mobile_pool_party.locator(".pool-party-body").evaluate("element => element.scrollWidth <= element.clientWidth")
    assert mobile_pool_party.get_by_role("button", name="Copy P NCAL REG THERAPY PLAN to clipboard", exact=True).is_visible()
    mobile_email_directory.scroll_into_view_if_needed()
    mobile.screenshot(path=OUTPUT / "dsa-gi-orientation-communications-mobile.png", full_page=False)
    assert_choosing_wisely(mobile)
    assert mobile.get_by_role("button", name="Expand Choosing Wisely graduation infographic", exact=True).bounding_box()["width"] <= 110
    assert mobile.locator(".cw-smartphrase-grid").evaluate("element => getComputedStyle(element).gridTemplateColumns.split(' ').length") == 1
    mobile.locator(".cw-smartphrase-panel").scroll_into_view_if_needed()
    mobile.screenshot(path=OUTPUT / "dsa-gi-orientation-choosing-wisely-mobile.png", full_page=False)
    mobile.get_by_role("tab", name="Procedures Appointment types and documentation", exact=False).click()
    assert mobile.locator(".orientation-procedure-grid").count() == 1
    assert mobile.locator("details.orientation-site-group[open]").count() == 0
    mobile_skills_day = mobile.locator(".orientation-skills-day")
    mobile_skills_day.locator("summary").click()
    assert mobile_skills_day.locator("iframe").is_visible()
    assert mobile_skills_day.evaluate("element => element.getBoundingClientRect().width <= document.documentElement.clientWidth")
    mobile_video_box = mobile_skills_day.locator(".skills-day-video").bounding_box()
    mobile_chapter_box = mobile_skills_day.locator(".skills-day-chapters").bounding_box()
    assert mobile_chapter_box["y"] >= mobile_video_box["y"] + mobile_video_box["height"]
    assert mobile_skills_day.get_by_role("navigation", name="Skills Day video chapters").get_by_role("link").count() == 9
    assert mobile_skills_day.locator(".skills-day-chapters").evaluate("element => element.scrollWidth <= element.clientWidth")
    assert mobile_skills_day.get_by_role("link", name="26:37 Swimmer's Position for Colonoscopy", exact=False).is_visible()
    mobile_skills_day.scroll_into_view_if_needed()
    mobile.screenshot(path=OUTPUT / "dsa-gi-orientation-skills-day-mobile.png", full_page=False)

    assert not desktop_errors, desktop_errors
    assert not mobile_errors, mobile_errors
    browser.close()

print("Visual QA passed: persistent upper-right zoom controls across all four primary pages, Home countdowns, September announcements, September–December GI birthdays, Tom farewell cocktail event, all 12 Field Guide sections with collapsed nested accordions, highlighted search matches with automatic accordion reveal, complete email and pool copy controls, Choosing Wisely with expandable infographic and topic folds, Skills Day video with nine timestamp chapter links, podlet tooltips, portraits, and mobile layout.")
