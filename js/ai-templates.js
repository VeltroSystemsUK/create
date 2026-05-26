FB.ai = FB.ai || {};

FB.ai.open = function () {
  FB.ai._state = "prompt";
  document.getElementById("ds-ai-template-overlay").style.display = "flex";
  FB.ai._render();
};

FB.ai.close = function () {
  document.getElementById("ds-ai-template-overlay").style.display = "none";
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
    h += '<div class="ai-section-title">🔑 Gemini API Key</div>';
    h +=
      '<p style="font-size:11px;color:#888;margin:0 0 8px">Get your free key at <a href="https://aistudio.google.com/apikey" target="_blank" style="color:#CDFE00">aistudio.google.com/apikey</a></p>';
    h += '<div style="display:flex;gap:6px">';
    h +=
      '<input id="ai-api-key-input" type="password" placeholder="Paste your Gemini API key..." style="flex:1;padding:8px;background:#1a1a1a;border:1px solid #333;border-radius:6px;color:#fff;font-size:12px">';
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
    FB.agent
      .generate(FB.ai._promptText, {}, function (status) {
        FB.ai._genStatus = status;
        FB.ai._render();
      })
      .then(function (result) {
        FB.ai._generated = result.template;
        FB.ai._state = "review";
        FB.ai._error = null;
        if (result.validation && !result.validation.valid) {
          FB.ai._error =
            "Minor issues detected: " + result.validation.errors.join("; ");
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
    var prompt =
      "Generate a COMPLETE multi-section website template. The user wants: " +
      FB.ai._promptText +
      "\n\nGenerate 5-12 blocks for a full page. Be creative and bold.";
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
  var tpl = FB.ai._generated;
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
  FB.util.showToast("✓ Template loaded: " + (tpl.name || "AI Generated"));
  FB.ai.close();
  FB.export.close();
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
