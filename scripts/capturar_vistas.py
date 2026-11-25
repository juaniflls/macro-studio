"""Capturas reproducibles de la aplicación pública; no alteran los modelos."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "index.html"
OUT = ROOT / "assets" / "screenshots" / "actuales"
OUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as pw:
    launch = {"headless": True, "args": ["--no-sandbox"]}
    if Path("/usr/bin/chromium").exists():
        launch["executable_path"] = "/usr/bin/chromium"
    browser = pw.chromium.launch(**launch)
    page = browser.new_page(viewport={"width": 1900, "height": 940}, device_scale_factor=1, reduced_motion="reduce")
    errors = []
    page.on("pageerror", lambda exc: errors.append(str(exc)))
    page.set_content(HTML.read_text(encoding="utf-8"), wait_until="load")
    page.locator(".pres-entry").nth(1).click()
    page.locator(".case-entry").nth(4).click()
    page.locator("#policy-input").check()
    page.wait_for_timeout(350)
    assert "monetaria expansiva" in page.locator(".case-heading h1").inner_text().lower()

    def capture(name, locator=None):
        if locator is not None:
            locator.scroll_into_view_if_needed(timeout=10000)
        page.wait_for_timeout(120)
        path = OUT / name
        page.screenshot(path=str(path), animations="disabled")
        assert path.stat().st_size > 15000
        print("Captura:", path.name)

    capture("01-escenario-y-diagnostico.png")
    capture("02-politica-economica.png", page.locator(".policy-panel"))
    capture("03-mapa-causal.png", page.locator(".causal-panel"))
    capture("04-bienes-y-laboral.png", page.locator('[data-market="goods"] svg').first)
    capture("05-explicaciones-causales.png", page.locator('[data-market="goods"] .narrative-second').first)
    capture("06-monetario-y-cambiario.png", page.locator('[data-market="money"] svg').first)
    capture("07-modelo-is-lm-bp.png", page.locator(".combined-card svg").first)
    narrative = page.locator(".combined-card .narrative")
    if narrative.count():
        narrative.first.screenshot(path=str(OUT / "08-interpretacion-is-lm-bp.png"), animations="disabled")
    assert len(list(OUT.glob("*.png"))) == 8
    assert not errors, errors
    browser.close()
