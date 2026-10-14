"""Desktop Medicine release QA for content, interaction, and responsive bounds."""

import os
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


BASE_URL = os.environ.get("VISUAL_QA_URL", "http://127.0.0.1:5173")
OUTPUT = Path(os.environ.get("VISUAL_QA_OUTPUT", "/private/tmp/dsa-gi-dtm-qa"))
OUTPUT.mkdir(parents=True, exist_ok=True)


def assert_dtm(page, mobile=False):
    page.get_by_role("tab", name="Desktop Medicine", exact=False).click()
    expect(page.get_by_role("tab", name="Desktop Medicine", exact=False)).to_have_attribute("aria-selected", "true")
    expect(page.get_by_role("heading", name="Pharmacy refill support is live.", exact=True)).to_be_visible()
    expect(page.get_by_text("Oct 14 · 2026", exact=True)).to_have_attribute("datetime", "2026-10-14")
    expect(page.get_by_role("heading", name="What changes in Phase I", exact=True)).to_be_visible()
    expect(page.get_by_role("heading", name="Outside Phase I", exact=True)).to_be_visible()
    expect(page.get_by_text("SSRIs, SNRIs, and TCAs", exact=True)).to_be_visible()
    expect(page.get_by_role("heading", name="Medication matrix", exact=True)).to_be_visible()
    assert page.locator(".dtm-group").count() == 5
    assert page.locator(".dtm-group").first.get_attribute("open") is not None
    assert page.locator(".dtm-group tbody tr").count() == 54
    expect(page.get_by_text("Remicade", exact=True)).to_be_visible()
    expect(page.get_by_text("Up to the next related lab due date (max- 6 months)", exact=True).first).to_be_visible()
    assert page.get_by_text("TCA's?", exact=True).count() == 0
    assert page.locator(".dtm-table-wrap").first.evaluate("element => element.scrollWidth >= element.clientWidth")
    assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")
    page.screenshot(path=OUTPUT / ("dtm-mobile.png" if mobile else "dtm-desktop.png"), full_page=True)


if __name__ == "__main__":
    errors = []
    with sync_playwright() as playwright:
        launch_options = {"headless": True}
        if executable_path := os.environ.get("PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH"):
            launch_options["executable_path"] = executable_path
        browser = playwright.chromium.launch(**launch_options)
        for width, height, mobile in [(1440, 1000, False), (390, 844, True), (320, 720, True)]:
            page = browser.new_page(viewport={"width": width, "height": height})
            page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.goto(BASE_URL, wait_until="networkidle")
            assert_dtm(page, mobile=mobile)
            page.close()
        browser.close()
    assert not errors, errors
    print("DTM QA passed: source copy, 54 medication rows, keyboard-accessible tab, desktop/390/320 bounds, and no console errors.")
