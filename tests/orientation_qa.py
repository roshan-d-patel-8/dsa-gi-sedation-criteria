"""Shared local/live checks for each orientation section's foldout control."""
from playwright.sync_api import expect


def assert_section_foldout_toggle(page):
    content = page.locator(".orientation-content")
    button = page.locator(".orientation-expand-all")
    foldouts = content.locator("details")
    expect(button).to_be_visible()
    assert button.get_attribute("aria-controls") == content.get_attribute("id")
    assert button.locator("svg path").count() == 2
    assert button.bounding_box()["height"] >= 44
    if not foldouts.count():
        expect(button).to_be_disabled()
        assert button.get_attribute("title") == "This section is already fully visible"
        return

    expect(button).to_be_enabled()
    expect(button).to_have_text("Expand all")
    button.click()  # Real pointer activation also covers touch-browser contexts.
    expect(button).to_have_text("Collapse all")
    expect(button).to_have_attribute("aria-expanded", "true")
    assert foldouts.evaluate_all("items => items.every(item => item.open)")
    # Closing one foldout must restore the Expand all action for a mixed state.
    foldouts.first.locator("summary").first.click()
    expect(button).to_have_text("Expand all")
    expect(button).to_have_attribute("aria-expanded", "false")
    button.click()
    expect(button).to_have_text("Collapse all")
    assert foldouts.evaluate_all("items => items.every(item => item.open)")
    button.press("Enter")
    expect(button).to_have_text("Expand all")
    assert foldouts.evaluate_all("items => items.every(item => !item.open)")
    button.press("Space")
    expect(button).to_have_text("Collapse all")
    button.click()
    expect(button).to_have_text("Expand all")
    assert foldouts.evaluate_all("items => items.every(item => !item.open)")


def assert_all_section_foldout_toggles(page):
    tabs = page.locator(".orientation-subtab")
    assert tabs.count() == 12
    for index in range(tabs.count()):
        tabs.nth(index).click()
        assert_section_foldout_toggle(page)
        button = page.locator(".orientation-expand-all")
        button.scroll_into_view_if_needed()
        box = button.bounding_box()
        assert box["x"] >= 0 and box["x"] + box["width"] <= page.viewport_size["width"] + 1
        assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")


def assert_outside_kp_referrals(page):
    services_tab = page.locator(".orientation-subtab").filter(has_text="Services")
    services_tab.click()
    content = page.locator(".orientation-content")
    foldouts = content.locator("details.orientation-topic-group")
    assert foldouts.count() == 3
    outside = content.locator("details.topic-services-outside")
    expect(outside.locator("summary")).to_contain_text("Outside KP Referrals")
    outside.locator("summary").click()
    expect(outside).to_have_attribute("open", "")
    expect(outside.get_by_text("KP Transplant Coordinators", exact=True)).to_be_visible()
    expect(outside.get_by_role("link", name="Coordinator line: 510-625-2923", exact=True)).to_have_attribute("href", "tel:5106252923")
    expect(outside.get_by_text("Kristina Beloso, RN", exact=True)).to_be_visible()
    expect(outside.get_by_text("NCAL · A, B, C, G, I", exact=True)).to_be_visible()
    expect(outside.get_by_text("Linda Le, RN", exact=True)).to_be_visible()
    expect(outside.get_by_text("Part-time · all Mayo Clinic Arizona referrals", exact=True)).to_be_visible()
    expect(outside.get_by_text("UCSF Hepatology & Liver Transplant Clinic", exact=True)).to_be_visible()
    expect(outside.get_by_role("link", name="Primary · try first: 415-353-1888", exact=True)).to_have_attribute("href", "tel:4153531888")
    expect(outside.get_by_text("415-353-2318 · option 5", exact=True)).to_be_visible()
    expect(outside.get_by_text("Source: Suk Seo · October 2026", exact=True)).to_be_visible()
    assert content.get_by_text("Transfer 4153531888 to call on all hepatologist", exact=True).count() == 0
    assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")


if __name__ == "__main__":
    import os
    from pathlib import Path
    from playwright.sync_api import sync_playwright

    url = os.environ.get("VISUAL_QA_URL", "http://127.0.0.1:5173")
    output = Path(os.environ.get("VISUAL_QA_OUTPUT", "/private/tmp/dsa-gi-orientation-toggle-qa"))
    output.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        for width, height, touch in [(1440, 1000, False), (390, 844, True), (320, 568, True)]:
            page = browser.new_page(viewport={"width": width, "height": height}, has_touch=touch)
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
            page.goto(url)
            page.wait_for_load_state("networkidle")
            for selector, variable in [("script[src]", "ORIENTATION_QA_SCRIPT"), ("link[rel='stylesheet']", "ORIENTATION_QA_STYLE")]:
                expected = os.environ.get(variable)
                if expected:
                    assert page.locator(selector).evaluate_all("items => items.map(item => item.src || item.href)") == [url.split("?")[0] + expected]
            page.get_by_role("tab", name="New Physician Orientation Materials", exact=False).click()
            assert_outside_kp_referrals(page)
            assert_all_section_foldout_toggles(page)
            page.locator(".orientation-subtab").first.click()
            button = page.locator(".orientation-expand-all")
            button.scroll_into_view_if_needed()
            page.screenshot(path=output / f"orientation-map-{width}.png")
            # Search opens matching ancestors and the control follows that new state.
            search = page.get_by_role("searchbox")
            search.fill("vacation")
            expect(page.locator(".orientation-content mark.search-highlight").first).to_be_visible()
            foldouts = page.locator(".orientation-content details")
            all_open = foldouts.evaluate_all("items => items.length > 0 && items.every(item => item.open)")
            expect(button).to_have_text("Collapse all" if all_open else "Expand all")
            if not all_open:
                button.click()
            expect(button).to_have_text("Collapse all")
            button.click()
            assert foldouts.evaluate_all("items => items.every(item => !item.open)")
            page.get_by_role("button", name="Clear search", exact=True).click()
            expect(button).to_have_text("Expand all")
            if not touch:
                page.locator(".zoom-trigger").click()
                for _ in range(3):
                    page.get_by_role("button", name="Zoom in", exact=True).click()
                page.keyboard.press("Escape")
                assert_all_section_foldout_toggles(page)
            assert not errors, errors
            page.close()
        browser.close()
    print("Orientation toggle QA passed: all 12 sections, desktop/390/320 touch, mixed state, keyboard, search, zoom, map icon, bounds, and no console/page errors.")
