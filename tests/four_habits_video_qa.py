"""Focused local/live placement and responsive checks for the Four Habits video."""
import os
from pathlib import Path
from playwright.sync_api import expect, sync_playwright


VIDEO_TITLE = "The Four Habits (featuring Habit Zero!)"
EMBED = "https://www.youtube-nocookie.com/embed/8v02PAIYWyw?rel=0"
WATCH = "https://youtu.be/8v02PAIYWyw"


def select_month(page, month):
    controls = page.locator(".calendar-controls")
    months = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"]
    current = months.index(controls.locator("strong").inner_text().split()[0])
    target = months.index(month)
    for _ in range(abs(current - target)):
        controls.get_by_role("button", name="Next month" if target > current else "Previous month").click()
    expect(controls.locator("strong")).to_have_text(f"{month} 2026")


def assert_video(page, scope):
    video = scope.locator(".patient-communication-video")
    expect(video).to_be_visible()
    expect(video.get_by_role("heading", name=VIDEO_TITLE, exact=True)).to_be_visible()
    expect(video.get_by_text("Companion video · 3:39", exact=True)).to_be_visible()
    iframe = video.locator("iframe")
    expect(iframe).to_have_attribute("src", EMBED)
    expect(iframe).to_have_attribute("title", VIDEO_TITLE)
    assert iframe.get_attribute("allowfullscreen") is not None
    assert iframe.get_attribute("loading") == "lazy"
    assert "autoplay=1" not in iframe.get_attribute("src")
    link = video.get_by_role("link", name="Watch on YouTube · 3:39", exact=False)
    expect(link).to_have_attribute("href", WATCH)
    expect(link).to_have_attribute("target", "_blank")
    assert link.bounding_box()["height"] >= 44
    iframe.scroll_into_view_if_needed()
    box = iframe.bounding_box()
    assert box["width"] > 0 and box["height"] > 0 and abs(box["width"] / box["height"] - 16 / 9) < .02, box
    assert video.evaluate("element => element.scrollWidth <= element.clientWidth + 1")
    assert box["x"] >= 0 and box["x"] + box["width"] <= page.viewport_size["width"] + 1
    assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")
    return video


def check(page, base_url, output, width, zoom):
    page.goto(base_url, wait_until="networkidle")
    if zoom == 140:
        page.get_by_role("button", name="Zoom page", exact=False).click()
        panel = page.get_by_role("group", name="Page zoom controls", exact=True)
        for _ in range(3):
            panel.get_by_role("button", name="Zoom in", exact=True).click()
        page.keyboard.press("Escape")
        expect(page.locator(".page-zoom-surface")).to_have_attribute("data-zoom", "140")
    select_month(page, "September")
    resources = page.locator(".department-resources")
    assert resources.locator(".department-resource-card").count() == 2
    entry = resources.locator(".department-resource-entry").filter(
        has=page.get_by_role("button", name="Open The Four Habits presentation, 19 slides", exact=True))
    assert entry.count() == 1
    video = assert_video(page, entry)
    assert entry.locator(".department-resource-card").bounding_box()["y"] < video.bounding_box()["y"]
    page.screenshot(path=output / f"four-habits-september-{width}-{zoom}.png", full_page=False)
    for month in ["August", "October"]:
        select_month(page, month)
        assert page.locator(".patient-communication-video").count() == 0

    page.get_by_role("tab", name="Field Guide", exact=False).click()
    page.locator("#orientation-clinic-tab").click()
    foldout = page.locator(".topic-clinic-communication")
    expect(foldout).not_to_have_attribute("open", "")
    # Keep the pointer target below the sticky guide toolbar at high zoom.
    foldout.locator("summary").evaluate("element => element.scrollIntoView({block: 'end'})")
    summary_box = foldout.locator("summary").bounding_box()
    foldout.locator("summary").click(position={"x": summary_box["width"] - 12, "y": summary_box["height"] - 12})
    expect(foldout).to_have_attribute("open", "")
    assert_video(page, foldout)
    page.screenshot(path=output / f"four-habits-clinic-{width}-{zoom}.png", full_page=False)
    foldout.locator("summary").press("Enter")
    expect(foldout).not_to_have_attribute("open", "")
    foldout.locator("summary").press("Space")
    assert_video(page, foldout)
    page.locator(".orientation-expand-all").click()
    page.locator(".orientation-expand-all").click()
    assert page.locator(".orientation-content details").evaluate_all("items => items.every(item => !item.open)")
    search = page.locator(".orientation-search input")
    search.fill("Habit Zero")
    expect(page.locator("#orientation-clinic-tab")).to_be_visible()
    expect(page.locator(".topic-clinic-communication")).to_contain_text(VIDEO_TITLE)
    search.fill("")


if __name__ == "__main__":
    base_url = os.environ.get("VISUAL_QA_URL", "http://127.0.0.1:5173")
    output = Path(os.environ.get("VISUAL_QA_OUTPUT", "/private/tmp/dsa-gi-four-habits-qa"))
    output.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        for width, height, touch in [(1440, 1000, False), (390, 844, True), (320, 568, True)]:
            for zoom in [100, 140]:
                print(f"Checking {width}px at {zoom}%", flush=True)
                page = browser.new_page(viewport={"width": width, "height": height}, has_touch=touch)
                errors = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                check(page, base_url, output, width, zoom)
                assert not errors, errors
                page.close()
        browser.close()
    print("Four Habits placements, month isolation, foldout/search, desktop/mobile and 140% zoom: PASS")
