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


def capture_console_errors(page):
    errors = []
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    return errors


def assert_static_reference(page):
    assert page.locator("button").count() == 0
    assert page.locator("nav").count() == 0
    assert page.locator("input, select, textarea").count() == 0
    assert page.locator(".criteria-card").count() == 7
    assert page.get_by_role("heading", name="Sedation criteria, at a glance.", exact=True).is_visible()
    for heading in CARD_HEADINGS:
        assert page.get_by_role("heading", name=heading, exact=True).is_visible()

    assert page.get_by_text("Discontinue 7 days before surgery and/or opioid administration.", exact=True).is_visible()
    assert page.get_by_text("Stop 3 days before surgery.", exact=True).is_visible()
    assert page.get_by_text("Stop 1 month before surgery.", exact=True).is_visible()
    assert page.get_by_text("MS Contin", exact=True).is_visible()
    assert page.get_by_text("Oral Dilaudid", exact=True).is_visible()
    assert page.get_by_text("Fentanyl Patch", exact=True).is_visible()
    assert page.get_by_text("Norco, Percocet, or Vicodin >4 tabs/day", exact=True).is_visible()


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)

    desktop = browser.new_page(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
    desktop_errors = capture_console_errors(desktop)
    desktop.goto(BASE_URL)
    desktop.wait_for_load_state("networkidle")
    assert_static_reference(desktop)
    desktop.wait_for_timeout(700)
    assert desktop.evaluate("document.body.scrollHeight") < 1800
    desktop.screenshot(path=OUTPUT / "dsa-gi-sedation-reference-desktop.png", full_page=True)

    mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    mobile_errors = capture_console_errors(mobile)
    mobile.goto(BASE_URL)
    mobile.wait_for_load_state("networkidle")
    assert_static_reference(mobile)
    mobile.wait_for_timeout(700)

    previous_y = -1
    for heading in CARD_HEADINGS:
        y_position = mobile.get_by_role("heading", name=heading, exact=True).bounding_box()["y"]
        assert y_position > previous_y
        previous_y = y_position
    mobile.screenshot(path=OUTPUT / "dsa-gi-sedation-reference-mobile.png", full_page=True)

    assert not desktop_errors, desktop_errors
    assert not mobile_errors, mobile_errors
    browser.close()

print("Visual QA passed: static criteria matrix, integrated medication holds, and responsive order.")
