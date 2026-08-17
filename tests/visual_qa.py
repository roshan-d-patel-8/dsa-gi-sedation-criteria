from pathlib import Path
from playwright.sync_api import sync_playwright


OUTPUT = Path("/Users/roshanpatel/.codex/visualizations/2026/08/17/01a00e0b-24f2-7521-b4c6-d94a41e34be5")
BASE_URL = "http://127.0.0.1:5173"


def fill_basics(page, procedure, site, bmi):
    page.get_by_text(procedure, exact=True).click()
    page.get_by_text(site, exact=True).click()
    page.locator(".bmi-field input").fill(str(bmi))


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    desktop = browser.new_page(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
    desktop_errors = []
    desktop.on("console", lambda message: desktop_errors.append(message.text) if message.type == "error" else None)
    desktop.goto(BASE_URL)
    desktop.wait_for_load_state("networkidle")
    fill_basics(desktop, "EGD", "Other DSA GI site", 56)
    assert desktop.locator(".result-panel > h2").inner_text() == "Operating room"
    desktop.screenshot(path=OUTPUT / "dsa-gi-sedation-desktop.png", full_page=True)

    desktop.get_by_role("button", name="Medication guide").click()
    assert desktop.get_by_text("Naltrexone timing, at a glance.").is_visible()
    desktop.screenshot(path=OUTPUT / "dsa-gi-sedation-medications.png", full_page=True)

    mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    mobile_errors = []
    mobile.on("console", lambda message: mobile_errors.append(message.text) if message.type == "error" else None)
    mobile.goto(BASE_URL)
    mobile.wait_for_load_state("networkidle")
    fill_basics(mobile, "Colonoscopy", "Pleasanton", 52)
    assert mobile.locator(".result-panel > h2").inner_text() == "MAC"
    assert mobile.get_by_role("heading", name="Pleasanton exclusion", exact=True).is_visible()
    mobile.screenshot(path=OUTPUT / "dsa-gi-sedation-mobile.png", full_page=False)

    assert not desktop_errors, desktop_errors
    assert not mobile_errors, mobile_errors
    browser.close()

print("Visual QA passed: desktop, medication guide, and mobile routing scenarios.")
