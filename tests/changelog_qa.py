"""Focused local/live checks for the public Change Log view."""
import os
import re
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from playwright.sync_api import expect, sync_playwright


ROOT = Path(__file__).parents[1]


def url_with_view(url, open_view):
    parts = urlsplit(url)
    query = dict(parse_qsl(parts.query, keep_blank_values=True))
    if open_view:
        query["view"] = "change-log"
    else:
        query.pop("view", None)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


def expected_entries():
    source = (ROOT / "CHANGELOG.md").read_text()
    return re.findall(r"^##\s+([^\s]+)\s+—\s+(\d{4}-\d{2}-\d{2})$", source, flags=re.MULTILINE)


def assert_change_log(page, base_url, screenshot_path=None):
    home_url = url_with_view(base_url, False)
    page.goto(home_url)
    page.wait_for_load_state("networkidle")

    portal = page.get_by_role("navigation", name="Site updates")
    link = portal.locator("a")
    link.scroll_into_view_if_needed()
    expect(link).to_be_visible()
    expect(link).to_contain_text("Change Log")
    expect(link).to_contain_text("See what information was added, corrected, or removed.")
    assert link.bounding_box()["height"] >= 44
    assert page.locator(".site-footer").bounding_box()["y"] >= portal.bounding_box()["y"] + portal.bounding_box()["height"]

    link.click()
    expect(page).to_have_url(re.compile(r"[?&]view=change-log(?:&|$)"))
    expect(page.get_by_role("heading", name="Change Log", exact=True)).to_be_visible()
    expect(page.get_by_text("What information was added, corrected, or removed—newest first.", exact=True)).to_be_visible()

    entries = expected_entries()
    cards = page.locator(".change-log-entry")
    assert cards.count() == len(entries)
    assert cards.first.get_by_text("Release 0.37.0", exact=True).is_visible()
    assert cards.first.get_by_text("Added", exact=True).is_visible()
    assert cards.first.get_by_text("October 9, 2026", exact=True).is_visible()
    assert cards.first.get_by_text("Add a Home-only Change Log link immediately below the 2026 calendar and before the global footer.", exact=True).is_visible()
    dates = cards.locator("time").evaluate_all("items => items.map(item => item.dateTime)")
    assert dates == sorted(dates, reverse=True)
    assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")

    if screenshot_path:
        page.screenshot(path=screenshot_path, full_page=False)

    page.go_back()
    expect(page.locator(".year-calendar")).to_be_visible()
    assert "view=change-log" not in page.url
    page.go_forward()
    expect(page.get_by_role("heading", name="Change Log", exact=True)).to_be_visible()
    expect(page.get_by_role("tab", name="Home", exact=False)).to_have_attribute("aria-selected", "true")
    page.get_by_role("link", name="Back to Home", exact=False).click()
    expect(page.locator(".year-calendar")).to_be_visible()
    assert "view=change-log" not in page.url

    page.goto(url_with_view(base_url, True))
    page.wait_for_load_state("networkidle")
    expect(page.get_by_role("heading", name="Change Log", exact=True)).to_be_visible()
    assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")
    page.get_by_role("link", name="Back to Home", exact=False).click()
    expect(page.locator(".year-calendar")).to_be_visible()


if __name__ == "__main__":
    base_url = os.environ.get("VISUAL_QA_URL", "http://127.0.0.1:5173")
    output = Path(os.environ.get("VISUAL_QA_OUTPUT", "/private/tmp/dsa-gi-changelog-qa"))
    output.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        for width, height, touch in [(1440, 1000, False), (390, 844, True), (320, 568, True)]:
            page = browser.new_page(viewport={"width": width, "height": height}, has_touch=touch)
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
            assert_change_log(page, base_url, output / f"change-log-{width}.png")
            assert not errors, errors
        browser.close()
    print("Change Log QA passed: Home placement, maintained newest-first history, direct link, browser navigation, return link, desktop/touch layout, viewport fit, and no console/page errors.")
