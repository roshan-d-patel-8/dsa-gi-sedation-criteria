"""Source-screenshot fidelity and medication reference interaction checks."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright


def assert_medication_holds(page, output, mobile=False):
    trigger = page.get_by_role("button", name="Medication holds (DOAC/Diabetes meds)", exact=True)
    assert trigger.is_visible()
    assert trigger.locator("svg").is_visible()
    trigger_box = trigger.bounding_box()
    assert trigger_box["height"] >= 44
    review_box = page.locator(".reference-review-date").bounding_box()
    assert trigger_box["y"] >= review_box["y"] + review_box["height"]
    panel = page.get_by_role("dialog", name="Medication holds", exact=True)
    if mobile:
        trigger.tap()
    else:
        trigger.hover()
    panel.wait_for(state="visible")
    if mobile:
        assert panel.get_attribute("aria-modal") == "true"
    page.wait_for_timeout(250)

    # Expected copy transcribed independently from the two supplied screenshots.
    expected = {
        "Blood thinners": [
            ("2 days before", "Apixaban (Eliquis), dabigatran (Pradaxa), edoxaban (Savaysa), cilostazol (Pletal)\nSkip 4 doses\nRivaroxaban (Xarelto)\nSkip 2 doses"),
            ("3 days before", "Dipyridamole (Aggrenox)\nSkip 6 doses"),
            ("5 days before", "Clopidogrel (Plavix), warfarin (Coumadin), ticagrelor (Brilinta), prasugrel (Effient)"),
        ],
        "Diabetes medications": [
            ("Morning of procedure", "Exenatide (Byetta), lixisenatide (Adlyxin), liraglutide (Victoza, Saxenda)"),
            ("3 days before", "Canagliflozin (Invokana), dapagliflozin (Farxiga), empagliflozin (Jardiance), bexagliflozin (Brenzavvy)"),
            ("4 days before", "Ertugliflozin (Steglatro)"),
            ("1 week before", "Dulaglutide (Trulicity), semaglutide (Ozempic, Wegovy, Rybelsus), exenatide (Bydureon), tirzepatide (Mounjaro, Zepbound)"),
        ],
    }
    for title, rows in expected.items():
        section = panel.get_by_role("region", name=title, exact=True)
        groups = section.locator(".medication-hold-group")
        assert groups.count() == len(rows)
        for index, (timing, medications) in enumerate(rows):
            assert groups.nth(index).locator("h4").inner_text() == timing
            assert groups.nth(index).locator("ul").inner_text() == medications
    assert panel.locator(".medication-hold-group").count() == 7
    box = panel.bounding_box()
    assert box["x"] >= 0 and box["y"] >= 0
    assert box["x"] + box["width"] <= page.viewport_size["width"] + 1
    assert box["y"] + box["height"] <= page.viewport_size["height"] + 1
    assert panel.evaluate("element => element.scrollWidth <= element.clientWidth")
    page.screenshot(path=output / f"medication-holds-{'mobile' if mobile else 'desktop'}.png")

    def assert_closed():
        page.wait_for_timeout(350)
        assert panel.count() == 0
        assert trigger.get_attribute("aria-expanded") == "false"
        assert trigger.evaluate("element => document.activeElement === element"), page.evaluate("document.activeElement.outerHTML")
        assert page.locator(".page-zoom-surface[inert]").count() == 0
        assert page.evaluate("document.body.style.overflow") != "hidden"

    panel.get_by_role("button", name="Close medication holds", exact=True).click()
    assert_closed()
    trigger.tap() if mobile else trigger.click()
    panel.wait_for(state="visible")
    assert panel.get_attribute("aria-modal") == "true"
    assert page.locator(".page-zoom-surface[inert]").count() == 1
    page.keyboard.press("Tab")
    assert panel.get_by_role("button", name="Close medication holds", exact=True).evaluate("element => document.activeElement === element")
    page.keyboard.press("Shift+Tab")
    assert panel.get_by_role("button", name="Close medication holds", exact=True).evaluate("element => document.activeElement === element")
    panel.get_by_text("Dulaglutide", exact=False).scroll_into_view_if_needed()
    assert panel.get_by_text("Dulaglutide", exact=False).is_visible()
    page.keyboard.press("Escape")
    assert_closed()
    trigger.press("Enter")
    panel.wait_for(state="visible")
    page.locator(".medication-backdrop").click(position={"x": 5, "y": 5})
    assert_closed()
    if not mobile:
        page.get_by_role("tab", name="Procedure Sedation Criteria", exact=False).focus()
        trigger.focus()
        panel.wait_for(state="visible")
        page.keyboard.press("Escape")
        assert_closed()
    assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")


if __name__ == "__main__":
    output = Path(os.environ.get("VISUAL_QA_OUTPUT", "/private/tmp/dsa-gi-medication-qa"))
    output.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for width, height, touch, zoom in [(1440, 1000, False, 100), (1440, 1000, False, 140), (390, 844, True, 100), (320, 568, True, 100)]:
            print(f"Checking medication holds: {width}x{height}, touch={touch}, zoom={zoom}%", flush=True)
            page = browser.new_page(viewport={"width": width, "height": height}, has_touch=touch)
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
            page.goto(os.environ.get("MEDICATION_QA_URL", "http://127.0.0.1:5173"))
            page.wait_for_load_state("networkidle")
            page.get_by_role("tab", name="Procedure Sedation Criteria", exact=False).click()
            if zoom != 100:
                page.get_by_role("button", name="Zoom page, currently 100%", exact=True).click()
                for _ in range(3):
                    page.get_by_role("button", name="Zoom in", exact=True).click()
                page.keyboard.press("Escape")
            assert_medication_holds(page, output, touch)
            assert not errors, errors
            page.close()
        browser.close()
    print("Medication holds QA passed: source copy, hover/focus/click/tap, dismissal, focus return, modal isolation, scrolling, desktop 100/140%, mobile 390/320px.")
