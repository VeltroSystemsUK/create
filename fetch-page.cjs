// Playwright page fetcher — returns HTML with computed styles inlined
const { chromium } = require("playwright");
const url = process.argv[2];
if (!url) {
  console.error("Usage: node fetch-page.js <url>");
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/usr/bin/chromium",
  });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });

  try {
    await page
      .goto(url, { waitUntil: "domcontentloaded", timeout: 15000 })
      .catch(() => {});
    // Wait extra for lazy-loaded content
    await page.waitForTimeout(3000);

    const result = await page.evaluate(() => {
      function inlineStyles(root) {
        root.querySelectorAll("*").forEach(function (el) {
          try {
            var cs = getComputedStyle(el);
            var props = [
              "color",
              "background-color",
              "background",
              "font-size",
              "font-weight",
              "font-family",
              "text-align",
              "line-height",
              "padding",
              "padding-top",
              "padding-bottom",
              "padding-left",
              "padding-right",
              "margin",
              "margin-top",
              "margin-bottom",
              "margin-left",
              "margin-right",
              "border",
              "border-radius",
              "display",
              "flex-direction",
              "justify-content",
              "align-items",
              "gap",
              "width",
              "min-height",
              "max-width",
              "opacity",
              "overflow",
              "top",
              "left",
              "text-transform",
              "letter-spacing",
            ];
            props.forEach(function (p) {
              var v = cs.getPropertyValue(p);
              if (
                v &&
                v !== "none" &&
                v !== "normal" &&
                v !== "0px" &&
                v !== "0" &&
                v !== "auto"
              ) {
                if (!el.style.getPropertyValue(p)) {
                  el.style.setProperty(p, v);
                }
              }
            });
          } catch (_) {}
        });
        return root.innerHTML;
      }

      var clone = document.documentElement.cloneNode(true);
      var styledHtml = inlineStyles(clone);
      return {
        title: document.title,
        html: "<!DOCTYPE html><html>" + styledHtml + "</html>",
        url: window.location.href,
      };
    });

    console.log(JSON.stringify(result));
  } catch (e) {
    console.error(JSON.stringify({ error: e.message }));
  } finally {
    await browser.close();
  }
})();
