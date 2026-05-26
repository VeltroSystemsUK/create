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
  "You are a web designer synthesising multiple scraped pages into a single Framework Builder template.\n" +
  "You will receive content from multiple pages, each labeled '## PAGE: <url>'.\n\n" +
  "Your job:\n" +
  "1. Read all pages to understand the brand: industry, tone, colors, audience, key offerings.\n" +
  '2. Generate a single unified website template as JSON: { "name": "Brand Name", "blocks": [...] }\n' +
  "3. The template covers the full brand story: nav → hero → key sections from each page → footer.\n" +
  "4. Generate 8-16 blocks total. Draw the best content from across all pages.\n\n" +
  "Return ONLY valid JSON — no markdown fences, no commentary.\n\n" +
  "## Standard block types (use these for the main sections):\n" +
  "nav, hero, splitHero, features, services, stats, testimonial, process, work, pricing, faq, textBlock, colorBlock, footer\n\n" +
  "## Veltro canvas widgets (add 1-2 to enhance the design):\n" +
  "TYPOGRAPHY: kineticText, textScramble, typewriterReveal, morphingText\n" +
  "PHYSICS: bubblePop, gravityWells, fluidSimulation, pendulumWave\n" +
  "BACKGROUNDS: morphBlob, gradientFlow, auroraBorealis, particleNebula, geometricPatterns, liquidGradient, shaderBg, constellationLines\n" +
  "SCROLL: scrollProgressRing, stickyScrollStack, mosaicAssemble, parallaxImageStack\n" +
  "SPATIAL: tiltCard3d, carousel3d, holographicCard, glitchSection\n\n" +
  "## Rules:\n" +
  "- Every block MUST have: id (unique, e.g. nav_1), type, props\n" +
  "- Infer brand accent color from the content (or use #CDFE00 as default)\n" +
  "- Nav and Footer are mandatory\n" +
  "- Hero uses the main value proposition from the homepage\n" +
  "- TextColor must be dark (#111111) on light backgrounds, light (#f7f6f2) on dark\n" +
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
  FB.deepScrape._error = null;
  FB.deepScrape._statusMsg = null;
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
    h += '<div class="ai-section-title">🔑 Gemini API Key Required</div>';
    h +=
      '<p style="font-size:11px;color:#888;margin:0 0 8px">Deep Scrape uses Gemini to synthesise scraped pages. Get a free key at <a href="https://aistudio.google.com/apikey" target="_blank" style="color:#CDFE00">aistudio.google.com/apikey</a></p>';
    h += '<div style="display:flex;gap:6px">';
    h +=
      '<input id="ds-api-key-input" type="password" placeholder="Paste your Gemini API key..." style="flex:1;padding:8px;background:#1a1a1a;border:1px solid #333;border-radius:6px;color:#fff;font-size:12px">';
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
    h += '<div class="ai-section-title">🕷 Deep Scrape</div>';
    h +=
      '<p style="font-size:11px;color:#888;margin:0 0 10px;line-height:1.6">Enter a URL to crawl the entire site. All major pages will be scraped and synthesised into a single unified template by AI.</p>';
    h +=
      '<input type="url" id="ds-url-input" placeholder="https://example.com" style="width:100%;padding:10px;background:#1a1a1a;border:1px solid #333;border-radius:6px;color:#fff;font-size:13px;font-family:inherit;box-sizing:border-box;margin-bottom:10px">';
    h += '<div style="display:flex;gap:8px">';
    h +=
      '<button class="ds-save-btn" onclick="FB.deepScrape._start(\'auto\')" style="flex:1">⚡ Auto</button>';
    h +=
      '<button class="tb-btn" onclick="FB.deepScrape._start(\'review\')" style="flex:1">👁 Review</button>';
    h += "</div>";
    h +=
      '<div style="font-size:10px;color:#555;margin-top:8px;line-height:1.5"><strong style="color:#888">Auto</strong> — crawl and synthesise in one go. <strong style="color:#888">Review</strong> — see discovered pages and remove any before synthesis.</div>';
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
  FB.deepScrape._pages.splice(idx, 1);
  FB.deepScrape._render();
};

FB.deepScrape._start = function (mode) {
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
        page.markdown.slice(0, 2000)
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
      var validation = FB.ai._validate(parsed);
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
  FB.deepScrape._result.template.blocks.splice(idx, 1);
  FB.deepScrape._render();
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
    var block = {
      id: b.id || FB.state.genId(),
      type: b.type,
      props: Object.assign({}, defaults, b.props || {}),
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
