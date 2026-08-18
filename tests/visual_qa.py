from pathlib import Path

from playwright.sync_api import sync_playwright


OUTPUT = Path("/Users/roshanpatel/.codex/visualizations/2026/08/17/01a00e0b-24f2-7521-b4c6-d94a41e34be5")
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
    assert page.get_by_role("tab").count() == 2
    assert page.get_by_role("tab", name="Procedure Sedation Criteria", exact=False).is_visible()
    assert page.get_by_role("tab", name="DSA GI MA-MD Podlets", exact=False).is_visible()


def assert_sedation_reference(page):
    assert page.locator("input, select, textarea").count() == 0
    assert page.locator(".criteria-card").count() == 7
    assert page.get_by_role("heading", name="Sedation criteria, at a glance.", exact=True).is_visible()
    for heading in CARD_HEADINGS:
        assert page.get_by_role("heading", name=heading, exact=True).is_visible()
    assert page.get_by_text("One-page clinical reference.", exact=False).count() == 0
    assert page.get_by_text("Boundary:", exact=True).count() == 0


def assert_coverage_reference(page):
    assert page.get_by_role("heading", name="DSA GI MA-MD Podlets", exact=True).is_visible()
    assert page.get_by_text("2026 assignments", exact=False).is_visible()
    assert page.locator(".site-podlets").count() == 2
    assert page.locator(".pod-card").count() == 6
    assert page.get_by_text("Pod 04", exact=True).count() == 0
    assert page.locator(".provider-avatar img").count() == 23
    assert page.locator(".provider-initials").count() == 3
    for provider in PROVIDERS:
        assert page.locator(".provider-panel").get_by_text(provider, exact=True).first.is_visible()
    assert page.get_by_text("Anarosa Mejia", exact=False).is_visible()
    assert page.get_by_text("Robbie Molden", exact=False).is_visible()
    assert page.get_by_text("Megan Palsa", exact=False).is_visible()
    assert page.evaluate("Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0)")


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
    assert desktop.evaluate("document.body.scrollHeight") < 1900
    desktop.screenshot(path=OUTPUT / "dsa-gi-folder-tabs-podlets-desktop.png", full_page=True)

    mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    mobile_errors = capture_console_errors(mobile)
    mobile.goto(BASE_URL)
    mobile.wait_for_load_state("networkidle")
    assert_tabs(mobile)
    mobile.get_by_role("tab", name="DSA GI MA-MD Podlets", exact=False).click()
    mobile.wait_for_timeout(700)
    assert_coverage_reference(mobile)
    assert mobile.locator(".pod-card").nth(0).get_by_text("Pod 01", exact=True).is_visible()
    mobile.screenshot(path=OUTPUT / "dsa-gi-folder-tabs-podlets-mobile.png", full_page=True)

    assert not desktop_errors, desktop_errors
    assert not mobile_errors, mobile_errors
    browser.close()

print("Visual QA passed: folder tabs, sedation reference, podlet rosters, portraits, and mobile layout.")
