from pathlib import Path

from playwright.sync_api import sync_playwright


OUTPUT = Path("/Users/roshanpatel/.codex/visualizations/2026/08/26/01a0400c-bddd-77a3-8ade-1e0e824ba005")
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
    assert page.get_by_role("tab").count() == 3
    assert page.get_by_role("tab", name="Procedure Sedation Criteria", exact=False).is_visible()
    assert page.get_by_role("tab", name="DSA GI MA-MD Podlets", exact=False).is_visible()
    assert page.get_by_role("tab", name="New Physician Orientation Materials", exact=False).is_visible()


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


def assert_coverage_reference(page):
    assert page.get_by_role("heading", name="DSA GI MA-MD Podlets", exact=True).is_visible()
    assert page.get_by_text("2026 assignments", exact=False).is_visible()
    assert page.locator(".site-podlets").count() == 2
    assert page.locator(".pod-card").count() == 6
    assert page.locator(".pod-schedule").count() == 0
    assert page.locator(".ma-chip").count() == 11
    assert page.locator(".ma-assignment > small").count() == 0
    assert page.get_by_text("Pod 04", exact=True).count() == 0
    assert page.locator(".provider-avatar img").count() == 23
    assert page.locator(".provider-initials").count() == 3
    for provider in PROVIDERS:
        assert page.locator(".provider-panel").get_by_text(provider, exact=True).first.is_visible()
    assert page.get_by_text("Anarosa Mejia", exact=False).is_visible()
    assert page.get_by_text("Robbie Molden", exact=False).is_visible()
    assert page.get_by_text("Megan Palsa", exact=False).is_visible()
    assert page.evaluate("Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0)")


def assert_orientation_reference(page):
    assert page.get_by_role("heading", name="Your field guide to the first 90 days.", exact=True).is_visible()
    assert page.locator(".orientation-subtab").count() == 11
    assert page.locator(".orientation-subtab[aria-selected='true']").count() == 1
    assert page.locator(".orientation-card").count() == 1
    assert page.locator("details.orientation-card").count() == 0
    assert page.locator(".orientation-content img").count() == 0
    assert page.get_by_text("Call Schedule", exact=True).is_visible()
    assert page.get_by_text("WCR Door Codes: 6210", exact=True).count() == 0
    assert float(page.locator(".orientation-content").evaluate("element => getComputedStyle(element).fontSize.replace('px', '')")) >= 14
    assert page.locator(".orientation-content > .orientation-list-grid > li").count() >= 4
    assert page.locator(".orientation-content li > p").count() == 0
    first_list_line = page.locator(".orientation-content li > .orientation-list-line").first
    assert first_list_line.evaluate("element => getComputedStyle(element).display") == "inline"
    assert first_list_line.evaluate("element => getComputedStyle(element).marginTop") == "0px"
    assert first_list_line.evaluate("element => getComputedStyle(element).marginBottom") == "0px"


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
    assert_all_orientation_sections_are_clean(desktop)
    assert desktop.get_by_role("tab", name="New Physician Orientation Materials", exact=False).get_attribute("aria-selected") == "true"
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
    assert desktop.locator(".orientation-subtab").count() == 11
    assert desktop.locator(".orientation-card").count() == 1

    mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    mobile_errors = capture_console_errors(mobile)
    mobile.goto(BASE_URL)
    mobile.wait_for_load_state("networkidle")
    assert_tabs(mobile)
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

    assert not desktop_errors, desktop_errors
    assert not mobile_errors, mobile_errors
    browser.close()

print("Visual QA passed: three folder tabs, orientation sub-tabs/cards/search, larger type, podlet tooltips, portraits, and mobile layout.")
