"""Real Chromium smoke test. Run: pip install playwright && playwright install chromium."""
from pathlib import Path
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
(root / "test-results").mkdir(exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch()
    for width, height, label in [(1440, 1000, "desktop"), (390, 844, "mobile")]:
        page = browser.new_page(viewport={"width": width, "height": height})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        # Automated CI never fetches community tiles (OSMF forbids headless scans).
        page.route("https://tile.openstreetmap.org/**", lambda route: route.fulfill(
            status=200, content_type="image/svg+xml",
            body='<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#e7e9df"/></svg>'))
        page.goto((root / "index.html").as_uri())
        page.locator(".restaurant-card").first.wait_for()
        assert page.locator(".restaurant-card").count() == 6
        assert page.locator(".leaflet-marker-icon").count() == 6
        assert page.locator(".leaflet-control-attribution").is_visible()
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), "horizontal overflow"
        if label == "mobile":
            assert page.locator(".map").is_visible()
            assert page.locator(".map").bounding_box()["y"] < height / 2, "map must appear above fold"
        page.screenshot(path=str(root / f"test-results/{label}.png"), full_page=True)
        page.locator("#search").fill("없는메뉴123")
        assert not page.locator("#map-selection").is_visible(), "empty results must hide stale selected menu"
        assert page.locator(".leaflet-marker-icon").count() == 0
        page.locator("#search").fill("고등어")
        assert page.locator(".restaurant-card").count() == 1
        page.locator("[data-detail=fish]").first.click()
        assert page.locator("#detail-dialog").is_visible()
        page.locator("[data-tab=evidence]").click()
        assert "현재 매칭된 공식 항목은 없어요" in page.locator("#detail-panel").inner_text()
        page.keyboard.press("Escape")
        page.locator("#reset").click()
        if label == "mobile":
            page.locator("#mobile-map-toggle").click()
            page.locator('.leaflet-marker-icon[title="바다한상 (가상 식당)"]').click()
            assert "바다한상" in page.locator("#map-selection").inner_text()
            page.screenshot(path=str(root / "test-results/mobile-map.png"), full_page=True)
        assert not errors, errors
        page.close()
    browser.close()
print("Desktop/mobile Chromium smoke checks passed")
