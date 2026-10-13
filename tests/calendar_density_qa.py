"""Calendar density, accessible milestone details, and Pacific expiry checks."""
import os
from pathlib import Path
from playwright.sync_api import expect, sync_playwright


BASE_URL = os.environ.get("VISUAL_QA_URL", "http://127.0.0.1:5173")
OUTPUT = Path(os.environ.get("VISUAL_QA_OUTPUT", "/private/tmp/dsa-gi-calendar-density"))
OUTPUT.mkdir(parents=True, exist_ok=True)


def fits_viewport(page, locator):
    box = locator.bounding_box()
    assert box and box["width"] > 0 and box["height"] > 0
    assert box["x"] >= 11 and box["y"] >= 11, box
    assert box["x"] + box["width"] <= page.viewport_size["width"] - 11, box
    assert box["y"] + box["height"] <= page.viewport_size["height"] - 11, box


def assert_density(page, width, touch):
    page.clock.install(time="2026-10-12T12:00:00-07:00")
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    expect(page.get_by_role("tab", name="Calendar", exact=True)).to_have_attribute("aria-selected", "true")
    assert page.locator(".calendar-tab-icon rect").count() == 1
    cards = page.locator(".countdown-card")
    assert cards.count() == 5
    assert cards.locator("time").evaluate_all("es => es.map(e => e.dateTime)") == ["2026-10-16", "2026-10-17", "2026-10-19", "2026-11-02", "2026-11-18"]
    assert cards.locator(".countdown-number strong").all_text_contents() == ["4", "5", "7", "21", "37"]
    assert cards.locator(".pixel-number").count() == 5
    assert page.locator(".countdown-strip").evaluate("e => e.scrollWidth <= e.clientWidth")
    calendar = page.locator(".calendar-main").bounding_box()
    sidebar = page.locator(".calendar-sidebar").bounding_box()
    countdown = page.locator(".countdown-section").bounding_box()
    if width > 980:
        assert sidebar["x"] >= calendar["x"] + calendar["width"]
        assert abs(countdown["y"] - calendar["y"]) <= 1
        assert calendar["y"] < (140 if width > 1120 else 220), calendar
    else:
        assert countdown["y"] + countdown["height"] <= calendar["y"]
        assert sidebar["y"] >= calendar["y"] + calendar["height"]
        assert page.locator(".countdown-section").evaluate('e => Boolean(e.compareDocumentPosition(document.querySelector(".calendar-main")) & Node.DOCUMENT_POSITION_FOLLOWING)')
    bulletin = page.locator(".calendar-announcements").bounding_box()
    assert countdown["y"] + countdown["height"] <= bulletin["y"]
    colors = cards.evaluate_all("es => es.map(e => getComputedStyle(e).backgroundColor)")
    assert len(set(colors)) == 3
    page.screenshot(path=OUTPUT / f"calendar-density-{width}.png", full_page=True)

    for index in range(cards.count()):
        tile = cards.nth(index)
        tile.scroll_into_view_if_needed()
        box = tile.bounding_box()
        assert abs(box["width"] - box["height"]) <= 1, box
        assert box["width"] >= 44 and box["width"] < 115, box
        assert tile.evaluate("e => e.scrollHeight <= e.clientHeight + 1"), tile.inner_text()
        tooltip = page.locator(f'#{tile.get_attribute("aria-describedby")}')
        if not touch:
            tile.hover()
            expect(tooltip).to_be_visible()
            assert tooltip.locator("strong").text_content() in tile.get_attribute("aria-label")
            fits_viewport(page, tooltip)
            if index == 0:
                page.screenshot(path=OUTPUT / f"calendar-hover-{width}.png")
            tile.focus()
            expect(tooltip).to_be_visible()
        if touch:
            tile.tap()
        elif index in (1, 2):
            tile.focus()
            page.keyboard.press("Enter" if index == 1 else "Space")
        else:
            tile.click()
        dialog = page.get_by_role("dialog")
        expect(dialog).to_be_visible()
        expect(dialog.locator("h2")).to_have_text(tooltip.locator("strong").text_content())
        assert dialog.locator("time").get_attribute("datetime") == tile.locator("time").get_attribute("datetime")
        fits_viewport(page, dialog)
        close = dialog.get_by_role("button", name="Close milestone details")
        expect(close).to_be_focused()
        if index == 0:
            link = dialog.get_by_role("link", name="Take the survey", exact=False)
            expect(link).to_have_attribute("href", "https://tpmghr.kp.org/physician-opinion-survey")
            expect(link).to_have_attribute("target", "_blank")
            page.keyboard.press("Shift+Tab")
            expect(link).to_be_focused()
            page.keyboard.press("Tab")
            expect(close).to_be_focused()
            page.screenshot(path=OUTPUT / f"calendar-details-{width}.png")
        if index % 3 == 0:
            close.tap() if touch else close.click()
        elif index % 3 == 1:
            page.keyboard.press("Escape")
        else:
            page.locator(".social-event-dialog-backdrop").click(position={"x": 3, "y": 3})
        expect(dialog).to_have_count(0)
        expect(tile).to_be_focused()

    page.get_by_role("tab", name="Calendar", exact=True).scroll_into_view_if_needed()
    page.get_by_role("button", name="Zoom page", exact=False).click()
    zoom = page.get_by_role("group", name="Page zoom controls", exact=True)
    for _ in range(3):
        zoom.get_by_role("button", name="Zoom in", exact=True).click()
    assert page.locator(".page-zoom-surface").get_attribute("data-zoom") == "140"
    page.keyboard.press("Escape")
    cards.first.scroll_into_view_if_needed()
    if not touch:
        cards.first.hover()
        fits_viewport(page, page.locator("#countdown-details-2026-10-16"))
    cards.first.tap() if touch else cards.first.click()
    fits_viewport(page, page.get_by_role("dialog"))
    page.keyboard.press("Escape")
    expect(cards.first).to_be_focused()
    assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")

    # The minute refresh removes a zero-day tile even when its detail card is open.
    cards.first.click()
    page.clock.set_system_time("2026-10-16T12:00:00-07:00")
    page.clock.run_for(60_100)
    expect(cards).to_have_count(4)
    expect(page.get_by_role("dialog")).to_have_count(0)
    assert page.locator(".page-zoom-surface").get_attribute("inert") is None
    assert page.locator(".calendar-event-marker").filter(has_text="2026 TPMG POS and JAMM Survey").is_visible()
    assert not errors, errors


if __name__ == "__main__":
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        for width, height, touch in [(1440, 1000, False), (1024, 768, False), (390, 844, True), (320, 568, True)]:
            page = browser.new_page(viewport={"width": width, "height": height}, has_touch=touch)
            assert_density(page, width, touch)
            page.close()
        browser.close()
    print("Calendar density QA passed: square pixel tiles, sidebar/mobile wrap, full hover/focus/tap details, survey destination, focus trap/return, close/Escape/backdrop, 140% zoom, Pacific expiry, and no errors.")
