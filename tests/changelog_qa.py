"""Focused local/live checks for the public What's New view."""
import json
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
    return json.loads((ROOT / "content/practice-updates.json").read_text())


def assert_change_log(page, base_url, screenshot_path=None):
    home_url = url_with_view(base_url, False)
    page.goto(home_url)
    page.wait_for_load_state("networkidle")

    portal = page.get_by_role("navigation", name="Site updates")
    link = portal.locator("a")
    expect(link).to_be_visible()
    expect(link).to_contain_text("What's New")
    assert page.locator('.site-header').get_by_role('navigation', name='Site updates').count() == 1
    assert page.locator('.home-page .change-log-portal').count() == 0
    for tab_name in ['Calendar', 'Procedure Sedation Criteria', 'Podlets', 'Field Guide', 'Desktop Medicine']:
        page.get_by_role('tab', name=tab_name, exact=False).click()
        page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        box = link.bounding_box()
        header = page.locator('.site-header').bounding_box()
        assert box['height'] >= 44 and box['width'] <= 130
        assert box['y'] >= 0 and box['y'] + box['height'] <= header['y'] + header['height'] + 1
        assert box['x'] >= 0 and box['x'] + box['width'] <= page.viewport_size['width']
        assert page.evaluate('point => document.elementFromPoint(...point).closest("a") === document.querySelector(".header-updates a")', [box['x'] + box['width'] / 2, box['y'] + box['height'] / 2])
        if page.evaluate('matchMedia("(pointer: coarse)").matches'):
            link.tap()
        else:
            link.click()
        expect(page.get_by_role('heading', name="What's New", exact=True)).to_be_visible()
        expect(link).to_have_attribute('aria-current', 'page')
        page.get_by_role('link', name='Back to Calendar', exact=False).click()
    page.evaluate('window.scrollTo(0, 0)')
    calendar_tab = page.get_by_role('tab', name='Calendar', exact=False)
    tab_box = calendar_tab.bounding_box()
    strip_box = page.locator('.folder-tabs').bounding_box()
    assert tab_box['x'] >= strip_box['x'] - 1 and tab_box['x'] + tab_box['width'] <= strip_box['x'] + strip_box['width'] + 1
    if screenshot_path:
        page.screenshot(path=Path(screenshot_path).with_name(f"whats-new-home-{page.viewport_size['width']}.png"))
    link.click()
    expect(page).to_have_url(re.compile(r"[?&]view=change-log(?:&|$)"))
    expect(page.get_by_role("heading", name="What's New", exact=True)).to_be_visible()
    expect(page.get_by_text("Clinical guidance, workflow changes, and new practice references—newest first. Dates indicate when this reference was updated.", exact=True)).to_be_visible()

    entries = expected_entries()
    cards = page.locator(".change-log-entry")
    assert cards.count() == len(entries)
    for card, entry in zip(cards.all(), entries):
        expect(card.get_by_role("heading", name=entry["title"], exact=True)).to_be_visible()
        assert card.locator("time").get_attribute("datetime") == entry["date"]
        assert card.locator("li").all_text_contents() == entry["changes"]
    text = page.locator(".change-log-page").inner_text()
    assert "dysautonomia" in text and "STAT potassium" in text and "PROMPT" in text
    assert not re.search(r"Release \d|hover|viewport|formatting|regression|keyboard|screenshot|pixel|deployment", text, re.I)
    dates = cards.locator("time").evaluate_all("items => items.map(item => item.dateTime)")
    assert dates == sorted(dates, reverse=True)
    assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")

    if screenshot_path:
        page.screenshot(path=screenshot_path, full_page=False)

    page.go_back()
    expect(page.locator(".year-calendar")).to_be_visible()
    assert "view=change-log" not in page.url
    page.go_forward()
    expect(page.get_by_role("heading", name="What's New", exact=True)).to_be_visible()
    expect(page.get_by_role("tab", name="Calendar", exact=False)).to_have_attribute("aria-selected", "true")
    page.get_by_role("link", name="Back to Calendar", exact=False).click()
    expect(page.locator(".year-calendar")).to_be_visible()
    assert "view=change-log" not in page.url

    page.goto(url_with_view(base_url, True))
    page.wait_for_load_state("networkidle")
    expect(page.get_by_role("heading", name="What's New", exact=True)).to_be_visible()
    assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")
    page.get_by_role("link", name="Back to Calendar", exact=False).click()
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
    print("What's New QA passed: compact shared-header access from every tab while scrolled, maintained newest-first history, direct link, browser navigation, return link, desktop/touch layout, viewport fit, and no console/page errors.")
