FB.ai = FB.ai || {};

FB.ai.open = function () {
  FB.ai._state = "prompt";
  FB.ai._brandContext = "";
  document.getElementById("ds-ai-template-overlay").style.display = "flex";
  FB.ai._render();
};

FB.ai.close = function () {
  var overlay = document.getElementById("ds-ai-template-overlay");
  if (overlay) overlay.style.display = "none";
  FB.ai._state = "prompt";
  FB.ai._generated = null;
};

FB.ai._state = "prompt";
FB.ai._generated = null;
FB.ai._abortController = null;
FB.ai._agentMode = localStorage.getItem("fb-agent-mode") !== "false";

FB.ai._toggleAgentMode = function () {
  FB.ai._agentMode = !FB.ai._agentMode;
  localStorage.setItem("fb-agent-mode", FB.ai._agentMode ? "true" : "false");
  FB.ai._render();
};

FB.ai._render = function () {
  var main = document.getElementById("ds-ai-template-main");
  if (!main) return;
  var key = FB.ai.getApiKey();
  var h = "";

  if (!key) {
    h += '<div class="ai-section">';
    h += '<div class="ai-section-title">🔑 Anthropic API Key</div>';
    h +=
      '<p style="font-size:11px;color:#888;margin:0 0 8px">Get your free key at <a href="https://console.anthropic.com/account/keys" target="_blank" style="color:#CDFE00">console.anthropic.com/account/keys</a></p>';
    h += '<label for="ai-api-key-input" style="font-size:11px;color:#aaa;display:block;margin-bottom:4px">API Key</label>';
    h += '<div style="display:flex;gap:6px">';
    h +=
      '<input id="ai-api-key-input" type="password" placeholder="Paste your Anthropic API key..." style="flex:1;padding:8px;background:#1a1a1a;border:1px solid #333;border-radius:6px;color:#fff;font-size:12px">';
    h += '<button class="ds-save-btn" onclick="FB.ai._saveKey()">Save</button>';
    h += "</div></div>";
    main.innerHTML = h;
    return;
  }

  h += '<div class="ai-section">';
  h +=
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">';
  h += '<div class="ai-section-title">🤖 AI Template Builder</div>';
  h += '<div style="display:flex;align-items:center;gap:6px">';
  var agentOn = FB.ai._agentMode;
  h +=
    '<button onclick="FB.ai._toggleAgentMode()" title="' +
    (agentOn
      ? "Multi-agent pipeline: brand + layout + Veltro workers"
      : "Single-prompt mode") +
    '" style="font-size:10px;padding:3px 9px;border-radius:10px;border:1px solid ' +
    (agentOn ? "#CDFE00" : "#444") +
    ";background:" +
    (agentOn ? "#CDFE00" : "transparent") +
    ";color:" +
    (agentOn ? "#000" : "#666") +
    ';cursor:pointer;font-weight:600">⚡ Agent ' +
    (agentOn ? "ON" : "OFF") +
    "</button>";
  h +=
    '<button class="tb-btn" onclick="FB.ai._showSettings()" style="font-size:10px">⚙ API Key</button>';
  h += "</div>";
  h += "</div>";
  h += "</div>";

  if (FB.ai._state === "prompt" || FB.ai._state === "generating") {
    h += '<div class="ai-section">';
    h +=
      '<textarea id="ai-prompt-input" class="ai-prompt-input" placeholder="Describe the website you want to build...&#10;&#10;Examples:&#10;· A bold creative agency with dark mode, orbs hero, glass services cards, and testimonials&#10;· A minimalist SaaS landing page with split hero, feature grid, pricing, and FAQ&#10;· A playful ecommerce storefront with bubble hero, product grid, and countdown sale">';
    if (FB.ai._promptText) h += FB.ai._esc(FB.ai._promptText);
    h += "</textarea>";
    h += '<div style="display:flex;gap:6px;margin-top:6px;align-items:center">';
    h += '<input id="ai-brand-url" type="text" placeholder="Brand URL (optional — scrape for context)" style="flex:1;padding:6px 10px;background:#1a1a1a;border:1px solid #333;border-radius:6px;color:#fff;font-size:11px">';
    h += '<button class="tb-btn" onclick="FB.ai._scrapeBrand()" style="font-size:10px;white-space:nowrap" title="Scrape URL for brand colors, tone, and content">🔍 Scrape</button>';
    h += '</div>';
    h += '<div id="ai-brand-ctx" style="display:none;margin-top:4px;padding:6px 10px;background:#1a2a1a;border:1px solid #2a4a2a;border-radius:4px;font-size:10px;color:#7ab648"></div>';
    h += '<div style="display:flex;gap:6px;margin-top:8px">';
    h +=
      '<button class="ds-save-btn" onclick="FB.ai._generate()" ' +
      (FB.ai._state === "generating" ? "disabled" : "") +
      ">" +
      (FB.ai._state === "generating"
        ? "⏳ Generating..."
        : "✨ Generate Template") +
      "</button>";
    h +=
      '<button class="tb-btn" onclick="FB.ai._generateSection()" ' +
      (FB.ai._state === "generating" ? "disabled" : "") +
      ">➕ Generate Section</button>";
    h +=
      '<button class="tb-btn" onclick="FB.ai._generateFromURL()" ' +
      (FB.ai._state === "generating" ? "disabled" : "") +
      ' id="ai-pipeline-btn" title="3-stage pipeline: Brand Decoder → Component Chef → Layout Architect">' +
      "🚀 From URL</button>";
    h += "</div>";
    if (FB.ai._state === "generating") {
      h +=
        '<div class="ai-generating"><div class="ai-spinner"></div><span>' +
        (FB.ai._genStatus || "Thinking...") +
        "</span></div>";
    }
    h += "</div>";
  }

  if (FB.ai._error) {
    h +=
      '<div class="ai-section"><div class="ai-error">⚠ ' +
      FB.ai._esc(FB.ai._error) +
      "</div></div>";
  }

  if (FB.ai._generated) {
    h += FB.ai._renderPreview();
  }

  main.innerHTML = h;
};

FB.ai._renderPreview = function () {
  var tpl = FB.ai._generated;
  if (!tpl || !tpl.blocks || !tpl.blocks.length) return "";
  var h = '<div class="ai-section">';
  h +=
    '<div class="ai-section-title">📄 ' +
    FB.ai._esc(tpl.name || "Generated Template") +
    "</div>";
  h += '<div class="ai-generated-blocks">';

  var allDefs = Object.assign(
    {},
    FB.blocks.BLOCK_DEFS,
    FB.blocks.CUSTOM_BLOCK_DEFS,
    FB.blocks.ECOMMERCE_DEFS,
  );

  tpl.blocks.forEach(function (block, i) {
    var def = allDefs[block.type] || FB.widgets.get(block.type) || {};
    var label = def.label || block.type;
    var sub = def.sublabel || "";
    var icon = def.icon || "□";
    var color = "#555";
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
      FB.ai._esc(label) +
      "</div>";
    if (sub)
      h += '<div class="ai-block-card-sub">' + FB.ai._esc(sub) + "</div>";
    h += "</div>";
    h += '<div class="ai-block-card-actions">';
    h +=
      '<button class="tb-btn" onclick="FB.ai._removeBlock(' +
      i +
      ')" title="Remove" style="font-size:10px;padding:2px 6px">✕</button>';
    h += "</div></div>";
  });

  h += "</div>";

  h += '<div class="ai-actions" style="display:flex;gap:6px;margin-top:10px">';
  h +=
    '<button class="ds-save-btn" onclick="FB.ai._approve()" style="flex:1">✓ Approve & Load Template</button>';
  h += '<button class="tb-btn" onclick="FB.ai._reject()">✕ Discard</button>';
  h +=
    '<button class="tb-btn" onclick="FB.ai._regenerate()">⟳ Regenerate</button>';
  h += "</div>";
  h += "</div>";
  return h;
};

FB.ai._brandContext = "";

FB.ai._scrapeBrand = function () {
  var url = document.getElementById("ai-brand-url");
  var ctx = document.getElementById("ai-brand-ctx");
  if (!url || !url.value.trim()) return;
  ctx.style.display = "block";
  ctx.textContent = "Scraping...";
  
  function tryEndpoint(endpoint, onSuccess) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          var title = data.title || "";
          var desc = data.description || "";
          var content = (data.markdown || data.content || "").slice(0, 3000);
          var ctxText = "BRAND CONTEXT from " + url.value.trim() + ":\nTitle: " + title + "\nDescription: " + desc;
          if (data.palette) ctxText += "\nBrand colors: " + JSON.stringify(data.palette);
          ctxText += "\n\nContent sample:\n" + content;
          FB.ai._brandContext = ctxText;
          ctx.textContent = "✓ Brand context captured (" + content.length + " chars)";
          ctx.style.background = "#1a2a1a"; ctx.style.borderColor = "#2a4a2a";
        } catch(e) {
          ctx.textContent = "✗ Failed to parse response"; ctx.style.background = "#2a1a1a"; ctx.style.borderColor = "#4a2a2a";
        }
      } else {
        onSuccess();
      }
    };
    xhr.onerror = function () { onSuccess(); };
    xhr.send(JSON.stringify({ url: url.value.trim() }));
  }
  
  tryEndpoint("/api/scrape", function () {
    tryEndpoint("/api/brand-scrape", function () {
      ctx.textContent = "✗ All scrape methods failed. Is the URL accessible?"; ctx.style.background = "#2a1a1a"; ctx.style.borderColor = "#4a2a2a";
    });
  });
};

FB.ai._generateFromURL = function () {
  var url = document.getElementById("ai-brand-url");
  if (!url || !url.value.trim()) {
    FB.ai._error = "Enter a URL first, then click 🚀 From URL";
    FB.ai._render();
    return;
  }
  var apiKey = FB.ai.getApiKey();
  if (!apiKey) {
    FB.ai._error = "API key required. Click the 🔑 API Key button to add your Gemini API key.";
    FB.ai._render();
    return;
  }
  FB.ai._state = "generating";
  FB.ai._genStatus = "Pipeline: Brand Decoder → Component Chef → Layout Architect...";
  FB.ai._render();
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/ai-pipeline");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        var data = JSON.parse(xhr.responseText);
        if (data.template && data.template.blocks) {
          FB.ai._generated = data.template;
          FB.ai._state = "review";
          FB.ai._error = null;
          FB.ai._render();
          return;
        }
      } catch(e) {}
    }
    FB.ai._error = "Pipeline failed: " + (xhr.responseText || "Unknown error").slice(0, 200);
    FB.ai._state = "prompt";
    FB.ai._render();
  };
  xhr.onerror = function () {
    FB.ai._error = "Server error. Is the Python server running on :8899?";
    FB.ai._state = "prompt";
    FB.ai._render();
  };
  xhr.send(JSON.stringify({ url: url.value.trim(), apiKey: FB.ai.getApiKey() }));
};

FB.ai._generate = function () {
  var input = document.getElementById("ai-prompt-input");
  if (!input || !input.value.trim()) return;
  FB.ai._promptText = input.value.trim();
  FB.ai._error = null;
  FB.ai._generated = null;
  FB.ai._state = "generating";
  FB.ai._render();

  if (FB.ai._agentMode) {
    FB.ai._genStatus = "Analysing brief...";
    FB.ai._render();
    var promptWithCtx = FB.ai._promptText;
    if (FB.ai._brandContext) promptWithCtx = FB.ai._brandContext + "\n\nUser request: " + FB.ai._promptText;
    FB.agent
      .generate(promptWithCtx, {}, function (status) {
        FB.ai._genStatus = status;
        FB.ai._render();
      })
      .then(function (result) {
        FB.ai._generated = result.template;
        FB.ai._state = "review";
        FB.ai._error = null;
        if (result.validation && !result.validation.valid) {
          FB.ai._error = "Minor issues: " + result.validation.errors.join("; ");
        }
        FB.ai._render();
      })
      .catch(function (err) {
        FB.ai._error = err.message || String(err);
        FB.ai._state = "prompt";
        FB.ai._render();
      });
  } else {
    FB.ai._genStatus = "Consulting the creative agent...";
    FB.ai._render();
    var prompt = "Generate a COMPLETE multi-section website template. The user wants: ";
    if (FB.ai._brandContext) prompt = FB.ai._brandContext + "\n\nGenerate a website for: ";
    prompt += FB.ai._promptText + "\n\nGenerate 8-14 blocks using mostly widget types for maximum visual variety.";
    FB.ai.generateTemplate(
      prompt,
      function () {},
      function (result) {
        FB.ai._generated = result;
        FB.ai._state = "review";
        FB.ai._error = null;
        FB.ai._render();
      },
      function (err) {
        FB.ai._error = err;
        FB.ai._state = "prompt";
        FB.ai._render();
      },
    );
  }
};

FB.ai._generateSection = function () {
  var input = document.getElementById("ai-prompt-input");
  if (!input || !input.value.trim()) return;
  FB.ai._promptText = input.value.trim();
  FB.ai._error = null;
  FB.ai._generated = null;
  FB.ai._state = "generating";
  FB.ai._genStatus = "Designing section...";
  FB.ai._render();

  var prompt =
    "Generate 1-3 blocks as a SINGLE SECTION. The user wants: " +
    FB.ai._promptText +
    "\n\nReturn a compact template with just 1-3 related blocks that work together as a cohesive section.";

  FB.ai.generateTemplate(
    prompt,
    function (raw) {},
    function (result) {
      FB.ai._generated = result;
      FB.ai._state = "review";
      FB.ai._error = null;
      FB.ai._render();
    },
    function (err) {
      FB.ai._error = err;
      FB.ai._state = "prompt";
      FB.ai._render();
    },
  );
};

FB.ai._approve = function () {
  try {
    var tpl = FB.ai._generated;
    if (!tpl || !tpl.blocks) return;

    var allDefs = Object.assign(
      {},
      FB.blocks?.BLOCK_DEFS || {},
      FB.blocks?.CUSTOM_BLOCK_DEFS || {},
      FB.blocks?.ECOMMERCE_DEFS || {},
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
    FB.panels.setMode("app");
    FB.canvas.render();
    var cw = document.getElementById("canvas-wrap");
    var cc = document.getElementById("canvas-column");
    if (cw) { cw.style.display = "none"; void cw.offsetHeight; cw.style.display = ""; }
    if (cc) { cc.style.flex = ""; void cc.offsetHeight; cc.style.flex = "1"; }
    FB.panels.renderRightPanel();
    FB.util.showToast("✓ Template loaded: " + (tpl.name || "AI Generated"));
    FB.ai.close();
    FB.export.close();
  } catch(e) {
    console.error("[approve] ERROR:", e);
    FB.util.showToast("Error loading template: " + e.message);
  }
};

FB.ai._reject = function () {
  FB.ai._generated = null;
  FB.ai._state = "prompt";
  FB.ai._error = null;
  FB.ai._render();
};

FB.ai._regenerate = function () {
  FB.ai._generate();
};

FB.ai._removeBlock = function (idx) {
  if (!FB.ai._generated || !FB.ai._generated.blocks) return;
  if (idx < 0 || idx >= FB.ai._generated.blocks.length) return;
  FB.ai._generated.blocks.splice(idx, 1);
  FB.ai._render();
};

FB.ai._saveKey = function () {
  var input = document.getElementById("ai-api-key-input");
  if (input && input.value.trim()) {
    FB.ai.setApiKey(input.value.trim());
    FB.ai._render();
  }
};

FB.ai._showSettings = function () {
  var key = FB.ai.getApiKey() || "";
  var mask = key ? key.slice(0, 6) + "..." + key.slice(-4) : "None";
  var set = '<div class="ai-settings-popup" id="ai-settings-popup">';
  set +=
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">';
  set += '<strong style="font-size:12px">Gemini API Key</strong>';
  set +=
    '<button onclick="document.getElementById(\'ai-settings-popup\').remove()" style="background:none;border:none;color:#888;cursor:pointer">✕</button>';
  set += "</div>";
  set +=
    '<p style="font-size:10px;color:#888;margin:0 0 6px">Current: ' +
    mask +
    "</p>";
  set +=
    '<input id="ai-settings-input" type="password" placeholder="New API key" style="width:100%;padding:6px;background:#1a1a1a;border:1px solid #333;border-radius:4px;color:#fff;font-size:11px;margin-bottom:6px">';
  set += '<div style="display:flex;gap:4px">';
  set +=
    '<button class="ds-save-btn" onclick="FB.ai._saveSettingsKey()" style="font-size:10px;padding:4px 10px">Save</button>';
  set +=
    '<button class="tb-btn" onclick="FB.ai._clearKey()" style="font-size:10px;padding:4px 10px">Clear</button>';
  set += "</div></div>";
  var main = document.getElementById("ds-ai-template-main");
  if (main) main.insertAdjacentHTML("beforeend", set);
};

FB.ai._saveSettingsKey = function () {
  var input = document.getElementById("ai-settings-input");
  if (input && input.value.trim()) {
    FB.ai.setApiKey(input.value.trim());
    var popup = document.getElementById("ai-settings-popup");
    if (popup) popup.remove();
    FB.ai._render();
  }
};

FB.ai._clearKey = function () {
  FB.ai.clearApiKey();
  var popup = document.getElementById("ai-settings-popup");
  if (popup) popup.remove();
  FB.ai._render();
};

FB.ai._esc = function (s) {
  var d = document.createElement("div");
  d.textContent = String(s);
  return d.innerHTML;
};
