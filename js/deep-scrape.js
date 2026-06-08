// Deep Scrape — full-site crawl + AI synthesis pipeline.
// States: idle → mapping → crawling → [review] → synthesising → result

FB.deepScrape = FB.deepScrape || {};

FB.deepScrape._state = "idle";
FB.deepScrape._pages = []; // [{ url, title, markdown }]
FB.deepScrape._result = null; // { template: { name, blocks }, validation }
FB.deepScrape._mode = null; // "auto" | "review"
FB.deepScrape._error = null;
FB.deepScrape._statusMsg = null;
FB.deepScrape._urlCount = 0;

FB.deepScrape._SYNTH_PROMPT =
  "You are a web designer synthesising multiple scraped pages into a single Veltro Create template.\n" +
  "You will receive content from multiple pages, each labeled '## PAGE: <url>'.\n\n" +
  "Your job:\n" +
  "1. Read all pages to understand the brand: industry, tone, colors, audience, key offerings.\n" +
  '2. Generate a single unified website template as JSON: { "name": "Brand Name", "blocks": [...] }\n' +
  "3. The template covers the full brand story: nav → hero → key sections from each page → footer.\n" +
  "4. Generate 8-16 blocks total. Draw the best content from across all pages.\n\n" +
  "Return ONLY valid JSON — no markdown fences, no commentary.\n\n" +
  "## BLOCK TYPES — use EXACT prop names shown:\n" +
  '{"type":"nav","props":{"logoText":"Brand","links":["Link1","Link2"],"ctaText":"CTA","bg":"#111","textColor":"#fff","accentColor":"#CDFE00"}}\n' +
  '{"type":"hero","props":{"eyebrow":"Tagline","headline":"Main headline","subtext":"Description","ctaText":"Button →","bg":"#111","textColor":"#f7f6f2","accentColor":"#CDFE00","showBlob":false}}\n' +
  '{"type":"features","props":{"label":"Section label","headline":"Section title","items":[{"icon":"✦","title":"Feature","desc":"Description"}],"bg":"#fff","textColor":"#111","accentColor":"#CDFE00"}}\n' +
  '{"type":"textBlock","props":{"headline":"Section title","body":"Paragraph text here.","bg":"#fff","textColor":"#111","paddingV":48,"paddingH":48}}\n' +
  '{"type":"colorBlock","props":{"headline":"Title","body":"Short callout text","bg":"#CDFE00","textColor":"#111","paddingV":60,"paddingH":48}}\n' +
  '{"type":"stats","props":{"stats":[{"num":"99%","label":"Metric"}],"bg":"#111","accentColor":"#CDFE00"}}\n' +
  '{"type":"testimonial","props":{"quote":"Quote text","attribution":"Name — Role","bg":"#111","accentColor":"#CDFE00"}}\n' +
  '{"type":"cta","props":{"headline":"Call to action","btnText":"Get started →","bg":"#111","textColor":"#fff"}}\n' +
  '{"type":"footer","props":{"logoText":"Brand","tagline":"Tagline","cols":[{"heading":"Links","links":["A","B"]}],"copyright":"© 2025","bg":"#111","accentColor":"#CDFE00","textColor":"#fff"}}\n\n' +
  "## Veltro canvas widgets (add 1-2 to enhance the design):\n" +
  "TYPOGRAPHY: kineticText, textScramble, typewriterReveal, morphingText\n" +
  "PHYSICS: bubblePop, gravityWells, fluidSimulation, pendulumWave\n" +
  "BACKGROUNDS: morphBlob, gradientFlow, auroraBorealis, particleNebula, geometricPatterns, liquidGradient, shaderBg, constellationLines\n" +
  "SCROLL: scrollProgressRing, stickyScrollStack, mosaicAssemble, parallaxImageStack\n" +
  "SPATIAL: tiltCard3d, carousel3d, holographicCard, glitchSection\n\n" +
  "## Rules:\n" +
  "- Every block MUST have: id (unique, e.g. nav_1), type, props\n" +
  "- Use EXACT prop names from the schemas above — headline not title, subtext not description, ctaText not cta\n" +
  "- COLORS: Extract real brand colors from the scraped content. Replace placeholder #111/#fff/#CDFE00 with the site's actual colors.\n" +
  "- textColor must be dark (#111111) on light backgrounds, light (#f7f6f2) on dark backgrounds\n" +
  "- Nav and Footer are mandatory\n" +
  "- Hero uses the main value proposition from the homepage. Max 1 hero.\n" +
  "- Veltro widgets as backgrounds: set height 500-700 and insert behind hero or between sections\n" +
  '- Return { "name": "Brand Name", "blocks": [...] } — nothing else\n\n' +
  "## SCRAPED CONTENT:\n";

FB.deepScrape.open = function () {
  FB.deepScrape._state = "idle";
  FB.deepScrape._pages = [];
  FB.deepScrape._result = null;
  FB.deepScrape._mode = null;
  FB.deepScrape._error = null;
  FB.deepScrape._statusMsg = null;
  FB.deepScrape._urlCount = 0;
  document.getElementById("ds-deep-scrape-overlay").style.display = "flex";
  FB.deepScrape._render();
};

FB.deepScrape.close = function () {
  document.getElementById("ds-deep-scrape-overlay").style.display = "none";
  FB.deepScrape._state = "idle";
  FB.deepScrape._pages = [];
  FB.deepScrape._result = null;
  FB.deepScrape._mode = null;
  FB.deepScrape._error = null;
  FB.deepScrape._statusMsg = null;
  FB.deepScrape._urlCount = 0;
};

FB.deepScrape._esc = function (s) {
  var d = document.createElement("div");
  d.textContent = String(s || "");
  return d.innerHTML;
};

FB.deepScrape._render = function () {
  var main = document.getElementById("ds-deep-scrape-main");
  if (!main) return;

  var key = FB.ai.getApiKey();
  var h = "";

  if (!key) {
    h += '<div class="ai-section">';
    h += '<div class="ai-section-title">🔑 Anthropic API Key Required</div>';
    h +=
      '<p style="font-size:13px;color:var(--text-muted);margin:0 0 12px;line-height:1.6">Deep Scrape uses Claude to synthesise scraped pages. Get a free key at <a href="https://console.anthropic.com/account/keys" target="_blank" style="color:var(--accent)">console.anthropic.com/account/keys</a></p>';
    h += '<label for="ds-api-key-input" style="font-size:12px;color:var(--text-secondary);display:block;margin-bottom:6px">API Key</label>';
    h += '<div style="display:flex;gap:8px">';
    h +=
      '<input id="ds-api-key-input" type="password" placeholder="Paste your Anthropic API key..." style="flex:1;padding:10px 14px;background:var(--surface-1);border:1px solid var(--border);border-radius:6px;color:var(--text-primary);font-size:14px;font-family:inherit">';
    h +=
      '<button class="ds-save-btn" onclick="FB.deepScrape._saveKey()">Save</button>';
    h += "</div></div>";
    main.innerHTML = h;
    return;
  }

  if (FB.deepScrape._error) {
    h +=
      '<div class="ai-section"><div class="ai-error">⚠ ' +
      FB.deepScrape._esc(FB.deepScrape._error) +
      "</div></div>";
  }

  var state = FB.deepScrape._state;

  if (state === "idle") {
    h += '<div class="ai-section">';
    h +=
      '<p style="font-size:13px;color:var(--text-muted);margin:0 0 16px;line-height:1.6">Enter a URL to crawl the entire site. All major pages will be scraped and synthesised into a single unified template by AI.</p>';
    h +=
      '<input type="url" id="ds-url-input" placeholder="https://example.com" style="width:100%;padding:10px 14px;background:var(--surface-1);border:1px solid var(--border);border-radius:6px;color:var(--text-primary);font-size:14px;font-family:inherit;box-sizing:border-box;margin-bottom:12px">';
    h += '<div style="display:flex;gap:8px;margin-bottom:12px">';
    h +=
      '<button class="tb-export" onclick="FB.deepScrape._start(\'auto\')" style="flex:1;justify-content:center">⚡ Auto Crawl</button>';
    h +=
      '<button class="tb-btn" onclick="FB.deepScrape._start(\'review\')" style="flex:1">👁 Review First</button>';
    h += "</div>";
    h +=
      '<div style="font-size:11px;color:var(--text-muted);padding:10px 12px;background:var(--surface-1);border-radius:4px;line-height:1.5"><strong>Auto</strong> — crawl and synthesise in one go. <strong>Review</strong> — see discovered pages and remove any before synthesis.</div>';
    h += "</div>";
  }

  if (state === "mapping") {
    h += '<div class="ai-section">';
    h +=
      '<div class="ai-generating"><div class="ai-spinner"></div><span>' +
      FB.deepScrape._esc(FB.deepScrape._statusMsg || "Discovering pages...") +
      "</span></div>";
    h += "</div>";
  }

  if (state === "crawling") {
    h += '<div class="ai-section">';
    h +=
      '<div class="ai-generating"><div class="ai-spinner"></div><span>' +
      FB.deepScrape._esc(FB.deepScrape._statusMsg || "Scraping pages...") +
      "</span></div>";
    h += "</div>";
  }

  if (state === "review") {
    h += '<div class="ai-section">';
    h +=
      '<div class="ai-section-title">📄 Discovered Pages (' +
      FB.deepScrape._pages.length +
      ")</div>";
    h +=
      '<p style="font-size:11px;color:#888;margin:0 0 10px">Remove any pages you don\'t want included before synthesis.</p>';
    h += '<div class="ai-generated-blocks">';
    FB.deepScrape._pages.forEach(function (page, i) {
      h += '<div class="ai-block-card">';
      h +=
        '<div class="ai-block-card-icon" style="background:#2a1a4a;color:#a78bfa;font-size:16px">📄</div>';
      h += '<div class="ai-block-card-info">';
      h +=
        '<div class="ai-block-card-label">' +
        FB.deepScrape._esc(page.title) +
        "</div>";
      h +=
        '<div class="ai-block-card-sub" style="font-size:9px">' +
        FB.deepScrape._esc(page.url) +
        "</div>";
      h += "</div>";
      h += '<div class="ai-block-card-actions">';
      h +=
        '<button class="tb-btn" onclick="FB.deepScrape._removePage(' +
        i +
        ')" style="font-size:10px;padding:2px 6px">✕</button>';
      h += "</div></div>";
    });
    h += "</div>";
    h +=
      '<div class="ai-actions" style="margin-top:10px;display:flex;gap:6px">';
    h +=
      '<button class="ds-save-btn" onclick="FB.deepScrape._synthesise()" style="flex:1">✨ Synthesise → (' +
      FB.deepScrape._pages.length +
      " pages)</button>";
    h +=
      '<button class="tb-btn" onclick="FB.deepScrape.close()">Cancel</button>';
    h += "</div></div>";
  }

  if (state === "synthesising") {
    h += '<div class="ai-section">';
    h +=
      '<div class="ai-generating"><div class="ai-spinner"></div><span>' +
      FB.deepScrape._esc(
        FB.deepScrape._statusMsg || "Building unified design...",
      ) +
      "</span></div>";
    h += "</div>";
  }

  if (state === "result") {
    h += FB.deepScrape._renderResult();
  }

  main.innerHTML = h;
};

FB.deepScrape._saveKey = function () {
  var input = document.getElementById("ds-api-key-input");
  if (input && input.value.trim()) {
    FB.ai.setApiKey(input.value.trim());
    FB.deepScrape._render();
  }
};

FB.deepScrape._removePage = function (idx) {
  if (!FB.deepScrape._pages || idx < 0 || idx >= FB.deepScrape._pages.length) return;
  FB.deepScrape._pages.splice(idx, 1);
  FB.deepScrape._render();
};

FB.deepScrape._start = function (mode) {
  if (FB.deepScrape._state !== "idle") return;
  var input = document.getElementById("ds-url-input");
  var url = input ? input.value.trim() : "";
  if (!url) {
    FB.util.showToast("Please enter a URL");
    return;
  }
  if (!url.startsWith("http")) url = "https://" + url;

  FB.deepScrape._mode = mode;
  FB.deepScrape._error = null;
  FB.deepScrape._pages = [];
  FB.deepScrape._state = "mapping";
  try {
    FB.deepScrape._statusMsg =
      "Discovering pages on " + new URL(url).hostname + "...";
  } catch (_) {
    FB.deepScrape._statusMsg = "Discovering pages...";
  }
  FB.deepScrape._render();

  fetch("/api/deep-scrape/map", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: url }),
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      if (data.error) {
        FB.deepScrape._error = data.error;
        FB.deepScrape._state = "idle";
        FB.deepScrape._render();
        return;
      }
      FB.deepScrape._urlCount = data.count;
      FB.deepScrape._crawl(data.urls);
    })
    .catch(function (err) {
      FB.deepScrape._error = "Map failed: " + err.message;
      FB.deepScrape._state = "idle";
      FB.deepScrape._render();
    });
};

FB.deepScrape._crawl = function (urls) {
  FB.deepScrape._state = "crawling";
  FB.deepScrape._statusMsg =
    "Scraping " + urls.length + " pages, please wait...";
  FB.deepScrape._render();

  fetch("/api/deep-scrape/crawl", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls: urls }),
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      if (data.error) {
        FB.deepScrape._error = data.error;
        FB.deepScrape._state = "idle";
        FB.deepScrape._render();
        return;
      }
      FB.deepScrape._pages = data.pages || [];
      if (FB.deepScrape._pages.length === 0) {
        FB.deepScrape._error =
          data.warning ||
          "No pages could be scraped. Check the URL and try again.";
        FB.deepScrape._state = "idle";
        FB.deepScrape._render();
        return;
      }
      if (FB.deepScrape._mode === "review") {
        FB.deepScrape._state = "review";
        FB.deepScrape._render();
      } else {
        FB.deepScrape._synthesise();
      }
    })
    .catch(function (err) {
      FB.deepScrape._error = "Crawl failed: " + err.message;
      FB.deepScrape._state = "idle";
      FB.deepScrape._render();
    });
};

FB.deepScrape._synthesise = function () {
  if (!FB.deepScrape._pages.length) {
    FB.deepScrape._error = "No pages to synthesise";
    FB.deepScrape._state = "idle";
    FB.deepScrape._render();
    return;
  }

  FB.deepScrape._state = "synthesising";
  FB.deepScrape._statusMsg =
    "Building unified design from " + FB.deepScrape._pages.length + " pages...";
  FB.deepScrape._render();

  var content = FB.deepScrape._pages
    .map(function (page) {
      return (
        "## PAGE: " +
        page.url +
        "\n### " +
        page.title +
        "\n\n" +
        page.markdown.slice(0, 3000)
      );
    })
    .join("\n\n---\n\n");

  FB.agent
    ._call(FB.deepScrape._SYNTH_PROMPT, content, {
      temperature: 0.75,
      maxTokens: 8192,
    })
    .then(function (text) {
      var raw = text.trim();
      if (raw.startsWith("```")) {
        raw = raw
          .replace(/^```[a-zA-Z]*\n?/, "")
          .replace(/\n?```\s*$/, "")
          .trim();
      }
      var parsed = FB.ai._extractJSON(raw);
      if (!parsed || !Array.isArray(parsed.blocks)) {
        throw new Error("AI returned invalid template JSON");
      }
      var ids = {};
      parsed.blocks.forEach(function (b, i) {
        if (!b.id || ids[b.id]) b.id = (b.type || "block") + "_" + (i + 1);
        ids[b.id] = true;
      });
      var validation = FB.agent._validate(parsed);
      FB.deepScrape._result = { template: parsed, validation: validation };
      FB.deepScrape._state = "result";
      FB.deepScrape._error = !validation.valid
        ? "Minor issues detected: " + validation.errors.join("; ")
        : null;
      FB.deepScrape._render();
    })
    .catch(function (err) {
      FB.deepScrape._error =
        "Synthesis failed: " + (err.message || String(err));
      FB.deepScrape._state = FB.deepScrape._pages.length ? "review" : "idle";
      FB.deepScrape._render();
    });
};

FB.deepScrape._renderResult = function () {
  var tpl = FB.deepScrape._result && FB.deepScrape._result.template;
  if (!tpl || !tpl.blocks) return "";

  var allDefs = Object.assign(
    {},
    FB.blocks.BLOCK_DEFS,
    FB.blocks.CUSTOM_BLOCK_DEFS,
    FB.blocks.ECOMMERCE_DEFS,
  );

  var h = '<div class="ai-section">';
  h +=
    '<div class="ai-section-title">📄 ' +
    FB.deepScrape._esc(tpl.name || "Deep Scraped Template") +
    "</div>";
  h += '<div class="ai-generated-blocks">';

  tpl.blocks.forEach(function (block, i) {
    var def = allDefs[block.type] || FB.widgets.get(block.type) || {};
    var label = def.label || block.type;
    var sub = def.sublabel || "";
    var icon = def.icon || "□";
    h += '<div class="ai-block-card">';
    h +=
      '<div class="ai-block-card-icon" style="background:' +
      (def.iconBg || "#2a2a2a") +
      ";color:" +
      (def.iconColor || "#ccc") +
      '">' +
      icon +
      "</div>";
    h += '<div class="ai-block-card-info">';
    h +=
      '<div class="ai-block-card-label">' +
      (i + 1) +
      ". " +
      FB.deepScrape._esc(label) +
      "</div>";
    if (sub)
      h +=
        '<div class="ai-block-card-sub">' + FB.deepScrape._esc(sub) + "</div>";
    h += "</div>";
    h += '<div class="ai-block-card-actions">';
    h +=
      '<button class="tb-btn" onclick="FB.deepScrape._removeBlock(' +
      i +
      ')" style="font-size:10px;padding:2px 6px">✕</button>';
    h += "</div></div>";
  });

  h += "</div>";
  h += '<div class="ai-actions" style="display:flex;gap:6px;margin-top:10px">';
  h +=
    '<button class="ds-save-btn" onclick="FB.deepScrape._approve()" style="flex:1">✓ Approve & Load</button>';
  h +=
    '<button class="tb-btn" onclick="FB.deepScrape.close()">✕ Discard</button>';
  h +=
    '<button class="tb-btn" onclick="FB.deepScrape._synthesise()">⟳ Regenerate</button>';
  h += "</div></div>";
  return h;
};

FB.deepScrape._removeBlock = function (idx) {
  if (!FB.deepScrape._result || !FB.deepScrape._result.template) return;
  if (!FB.deepScrape._result.template.blocks || idx < 0 || idx >= FB.deepScrape._result.template.blocks.length) return;
  FB.deepScrape._result.template.blocks.splice(idx, 1);
  FB.deepScrape._render();
};

FB.deepScrape._normaliseBlock = function (type, props) {
  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  var p = Object.assign({}, props);
  if (type === "hero") {
    p.eyebrow = esc(p.eyebrow || p.tagline || p.subtitle || "");
    p.headline = esc(p.headline || p.title || "Welcome");
    p.subtext = esc(p.subtext || p.description || p.body || "");
    p.ctaText = esc(p.ctaText || p.cta || p.button || "Learn more →");
    p.bg = p.bg || "#111111";
    p.textColor = p.textColor || "#f7f6f2";
    p.accentColor = p.accentColor || "#CDFE00";
    p.showBlob = false;
  } else if (type === "nav") {
    p.logoText = esc(p.logoText || p.logo || p.brand || "Site");
    p.links = (p.links || p.navLinks || []).slice(0, 6);
    p.ctaText = esc(p.ctaText || p.cta || p.button || "Get Started");
    p.bg = p.bg || "#111111";
    p.textColor = p.textColor || "#ffffff";
    p.accentColor = p.accentColor || "#CDFE00";
  } else if (type === "footer") {
    p.logoText = esc(p.logoText || p.logo || p.brand || "Site");
    p.tagline = esc(p.tagline || "");
    p.cols = p.cols || [{ heading: "Links", links: ["Edit me"] }];
    p.copyright = esc(p.copyright || "© " + new Date().getFullYear());
    p.bg = p.bg || "#111111";
    p.accentColor = p.accentColor || "#CDFE00";
    p.textColor = p.textColor || "#ffffff";
  } else if (type === "features") {
    p.label = esc(p.label || p.subtitle || "");
    p.headline = esc(p.headline || p.title || "What we offer");
    p.items = (p.items || []).slice(0, 6).map(function (it) {
      return {
        icon: it.icon || "✦",
        title: esc(it.title || it.name || "Item"),
        desc: esc(it.desc || it.description || ""),
      };
    });
    p.bg = p.bg || "#ffffff";
    p.textColor = p.textColor || "#111111";
    p.accentColor = p.accentColor || "#CDFE00";
  } else if (type === "textBlock" || type === "colorBlock") {
    p.headline = esc(p.headline || p.title || "");
    p.body = esc(p.body || p.description || p.text || p.content || "");
    p.bg = p.bg || (type === "colorBlock" ? "#CDFE00" : "#ffffff");
    p.textColor = p.textColor || "#111111";
    p.paddingV = p.paddingV || 48;
    p.paddingH = p.paddingH || 48;
  } else if (type === "stats") {
    p.stats = (p.stats || []).slice(0, 4);
    p.bg = p.bg || "#111111";
    p.accentColor = p.accentColor || "#CDFE00";
  } else if (type === "testimonial") {
    p.quote = esc(p.quote || p.body || p.text || "");
    p.attribution = esc(p.attribution || p.author || p.name || "");
    p.bg = p.bg || "#111111";
    p.accentColor = p.accentColor || "#CDFE00";
  } else if (type === "cta") {
    p.headline = esc(p.headline || p.title || "Get started");
    p.btnText = esc(p.btnText || p.cta || p.button || "Go →");
    p.bg = p.bg || "#111111";
    p.textColor = p.textColor || "#ffffff";
  }
  if (!p.textColor) p.textColor = "#111111";
  return p;
};

FB.deepScrape._approve = function () {
  var tpl = FB.deepScrape._result && FB.deepScrape._result.template;
  if (!tpl || !tpl.blocks) return;

  if (FB.state.blocks.length > 0) {
    if (!confirm("Load this template? It will replace the current canvas."))
      return;
  }

  var allDefs = Object.assign(
    {},
    FB.blocks.BLOCK_DEFS,
    FB.blocks.CUSTOM_BLOCK_DEFS,
    FB.blocks.ECOMMERCE_DEFS,
  );

  FB.state.saveHistory();
  FB.state.blocks = tpl.blocks.map(function (b) {
    var def = allDefs[b.type] || FB.widgets.get(b.type) || {};
    var defaults = def.defaultProps || {};
    var normalisedProps = FB.deepScrape._normaliseBlock(b.type, b.props || {});
    var block = {
      id: b.id || FB.state.genId(),
      type: b.type,
      props: Object.assign({}, defaults, normalisedProps),
    };
    if (b.bindings && b.bindings.length) block.bindings = b.bindings;
    return block;
  });
  FB.state.selectedId = null;
  FB.canvas.render();
  FB.panels.renderRightPanel();
  FB.util.showToast("✓ Template loaded: " + (tpl.name || "Deep Scraped Site"));
  FB.deepScrape.close();
  FB.export.close();
};
