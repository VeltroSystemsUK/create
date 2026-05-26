// Multi-agent AI pipeline for high-fidelity site generation.
// Flow: [brandWorker + layoutWorker] parallel → veltroWorker → validator
// Each worker gets a focused system prompt, not the full 240-line monolith.

FB.agent = FB.agent || {};

// ── Promise-based Gemini call ──
FB.agent._call = function (system, userContent, opts) {
  opts = opts || {};
  var apiKey = FB.ai.getApiKey();
  if (!apiKey)
    return Promise.reject(new Error("No Gemini API key configured."));

  var body = {
    contents: [
      {
        role: "user",
        parts: [{ text: system + "\n\n---\n\n" + userContent }],
      },
    ],
    generationConfig: {
      temperature: opts.temperature !== undefined ? opts.temperature : 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: opts.maxTokens || 8192,
    },
  };

  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    var url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
      encodeURIComponent(apiKey);
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        var text = "";
        if (
          data.candidates &&
          data.candidates[0] &&
          data.candidates[0].content
        ) {
          text = (data.candidates[0].content.parts || [])
            .map(function (p) {
              return p.text || "";
            })
            .join("");
        }
        resolve(text);
      } else {
        var msg = "API error " + xhr.status;
        try {
          var e = JSON.parse(xhr.responseText);
          if (e.error && e.error.message) msg = e.error.message;
        } catch (_) {}
        reject(new Error(msg));
      }
    };
    xhr.onerror = function () {
      reject(new Error("Network error — check connection and API key."));
    };
    xhr.send(JSON.stringify(body));
  });
};

// ── Brand Worker ──
// Extracts structured brand parameters from the brief text.
FB.agent._BRAND_PROMPT =
  "You are a brand strategist. Extract structured brand parameters from a website brief.\n" +
  "Return ONLY valid JSON — no markdown fences, no commentary:\n" +
  '{ "industry": "agency", "tone": "bold and editorial", "accentColor": "#CDFE00",\n' +
  '  "bgColor": "#111111", "textColor": "#f7f6f2",\n' +
  '  "keywords": ["motion", "creative", "digital"], "targetAudience": "startups" }\n' +
  "Choose accentColor that fits the brand — don't always use lime. Options: #CDFE00 (lime), #3b82f6 (blue), #ec4899 (pink), #f97316 (orange), #8b5cf6 (purple), or a custom fit.\n" +
  "bgColor should be dark (#0a0a0a to #1a1a1a) for creative/luxury brands, light (#ffffff to #f5f5f5) for clean/professional brands.";

FB.agent._brandWorker = function (brief) {
  return FB.agent
    ._call(FB.agent._BRAND_PROMPT, "Brief: " + brief, {
      temperature: 0.3,
    })
    .then(function (text) {
      var parsed = FB.ai._extractJSON(text);
      return (
        parsed || {
          industry: "creative",
          tone: "bold",
          accentColor: "#CDFE00",
          bgColor: "#111111",
          textColor: "#f7f6f2",
          keywords: [],
          targetAudience: "general",
        }
      );
    });
};

// ── Layout Worker ──
// Generates the structural page layout — standard blocks only, no Veltro.
FB.agent._LAYOUT_PROMPT =
  "You are a web layout architect. Generate a complete website layout as JSON.\n" +
  "Return ONLY valid JSON — no markdown fences, no commentary.\n" +
  'Format: { "name": "Site Name", "blocks": [ { "id": "nav_1", "type": "nav", "props": {...} }, ... ] }\n' +
  "CRITICAL: Every block MUST have a unique 'id' field (e.g. nav_1, hero_1, services_2).\n" +
  "Generate 6-10 blocks for a full page. Use brand colors from context.\n\n" +
  "## Available block types (standard blocks only — no Veltro):\n\n" +
  "NAV: nav, megaNav, slideNav, fullscreenMenu\n" +
  "HERO: hero, splitHero, orbsHero, videoHero\n" +
  "CONTENT: marquee, services, features, process, work, stats, resultsGrid, glassCards, pricing, team, testimonial, faq, timeline, counterSection, wordSwap, trustPill, metricBox\n" +
  "SPECIALTY: portfolioGrid, clientCarousel, horizontalScroll, chatWidget, cookieConsent\n" +
  "MEDIA: liteVideo, splitText, maskReveal, glitchText, svgDraw, noiseSection, cornerSection, iridescentBtn, particleButton, circularList, scrollIndicator\n" +
  "LAYOUT: textBlock, colorBlock, imageTextTop, imageTextBottom, imageTextLeft, imageTextRight, row, container, tabs, accordion, toggle\n" +
  "ECOMMERCE: ecomProductCard, ecomProductGrid, ecomFeaturedProduct, ecomProductCarousel, ecomCartDrawer, ecomCheckoutForm, ecomSaleBanner, ecomCountdown, ecomReviews, ecomFilters, ecomTrustBadges, ecomNewsletter\n\n" +
  "## Design rules:\n" +
  "- Use provided accentColor consistently across all blocks\n" +
  "- Alternate dark and light sections for rhythm\n" +
  "- Use <em> tags for emphasis words in headlines\n" +
  "- Generate realistic placeholder content (real company names, real-looking data)\n" +
  "- Use https://images.unsplash.com/photo-XXXXX?w=SIZE for placeholder images\n" +
  "- End with footer or cookieConsent";

FB.agent._layoutWorker = function (brief, brand) {
  var context =
    "Brief: " +
    brief +
    "\n\nBrand parameters: " +
    JSON.stringify(brand, null, 2);
  return FB.agent
    ._call(FB.agent._LAYOUT_PROMPT, context, {
      temperature: 0.75,
    })
    .then(function (text) {
      var parsed = FB.ai._extractJSON(text);
      if (!parsed || !Array.isArray(parsed.blocks)) {
        throw new Error("Layout worker returned invalid JSON");
      }
      parsed.blocks.forEach(function (b, i) {
        if (!b.id) b.id = b.type + "_" + (i + 1);
      });
      return parsed;
    });
};

// ── Veltro Worker ──
// Reads the layout's block IDs and injects 1-3 Veltro widgets at strategic positions.
FB.agent._VELTRO_PROMPT =
  "You are a Veltro creative director. You receive an existing page layout and enhance it with 1-3 Veltro canvas widgets.\n" +
  "Return the COMPLETE layout JSON with Veltro blocks ADDED — preserve all existing blocks unchanged.\n" +
  "Return ONLY valid JSON — no markdown fences, no commentary.\n\n" +
  "## Rules:\n" +
  "- Add only 1-3 Veltro blocks. They are the star, not background noise.\n" +
  "- Insert them at strategic positions (backgrounds behind heroes, between major sections).\n" +
  "- Veltro blocks used as backgrounds should have height: 500-700.\n" +
  "- Assign unique IDs to new Veltro blocks (e.g. veltro_bg_1, ring_1, nebula_1).\n" +
  "- Use widget bindings where they add a clear interactive story (scroll drives effects, etc.).\n\n" +
  "## Available Veltro widgets:\n\n" +
  "TYPOGRAPHY: kineticText (text,fontSize,fontWeightRange,speed), textScramble (text,triggerMode,cipherStyle), typewriterReveal (texts[],cursorStyle,speed), morphingText (words[],morphSpeed), kineticScramble (text,cipherSpeed)\n\n" +
  "PHYSICS: bubblePop (bubbleCount,colors[],popSize), gravityWells (particleCount,wellCount,wellMode), fluidSimulation (particleCount,viscosity,fluidMode), pendulumWave (count,speed,layout,bobShape), blackHole (particleCount,blackHoleSize,gravityStrength)\n\n" +
  "BACKGROUNDS: morphBlob (blobSize,morphSpeed,colors[]), gradientFlow (colors[],speed,angle), auroraBorealis (colors[],waveSpeed,intensity), particleNebula (particleCount,starCount,nebulaColors), geometricPatterns (pattern,colorScheme), liquidGradient (colors[],flowSpeed), shaderBg (effect), constellationLines (nodeCount,connectionDistance,lineGlow)\n\n" +
  "SCROLL: scrollProgressRing (ringSize,ringColor,progressColor), stickyScrollStack (stackCount,stickyOffset), mosaicAssemble (cols,rows,assembleDuration), parallaxImageStack (layers[],parallaxStrength)\n\n" +
  "SPATIAL: tiltCard3d (tiltDegree,perspective,glare), carousel3d (cardCount,cardContent[],rotationSpeed), holographicCard (cardContent,shimmerSpeed,colors[]), glitchSection (intensity,speed,glitchType)\n\n" +
  "## Widget bindings (use to create interactive stories):\n" +
  "Emitters: scrollProgressRing → scrollProgress (0→1)\n" +
  "Receivers: particleNebula → intensity, gradientFlow → speed, glitchSection → glitchRate\n" +
  'Syntax: add "bindings": [{ "sourceId": "ring_1", "sourceEvent": "scrollProgress", "targetProp": "intensity", "inputRange": [0,1], "outputRange": [0,1] }] to the receiver block.\n\n' +
  "## Classic combos:\n" +
  "- Dark agency hero → auroraBorealis or particleNebula background behind hero\n" +
  "- Scroll story → scrollProgressRing + particleNebula bound to scrollProgress\n" +
  "- Tech/crypto → constellationLines or shaderBg (effect: plasma)\n" +
  "- Luxury brand → holographicCard or liquidGradient\n" +
  "- Portfolio → parallaxImageStack or mosaicAssemble";

FB.agent._veltroWorker = function (brief, brand, layout) {
  var blockList = layout.blocks
    .map(function (b, i) {
      return i + 1 + ". id=" + b.id + " type=" + b.type;
    })
    .join("\n");

  var context = [
    "Brief: " + brief,
    "Brand: tone=" +
      brand.tone +
      " | accent=" +
      brand.accentColor +
      " | bg=" +
      brand.bgColor,
    "",
    "Existing layout (" + layout.blocks.length + " blocks):",
    blockList,
    "",
    "Full layout JSON (return this with Veltro blocks added):",
    JSON.stringify(layout),
  ].join("\n");

  return FB.agent
    ._call(FB.agent._VELTRO_PROMPT, context, {
      temperature: 0.8,
    })
    .then(function (text) {
      var parsed = FB.ai._extractJSON(text);
      if (!parsed || !Array.isArray(parsed.blocks)) return layout;
      return parsed;
    });
};

// ── Validator ──
// Pure JS check — no AI call. Returns { valid, errors[] }.
FB.agent._validate = function (template) {
  var errors = [];
  if (!template || !Array.isArray(template.blocks)) {
    return { valid: false, errors: ["Missing blocks array"] };
  }

  var ids = {};
  template.blocks.forEach(function (b) {
    if (b.id) ids[b.id] = true;
  });

  template.blocks.forEach(function (b, i) {
    if (!b.type) errors.push("Block[" + i + "] missing type");
    if (!b.props)
      errors.push("Block[" + i + "] (" + (b.type || "?") + ") missing props");
    if (b.bindings && Array.isArray(b.bindings)) {
      b.bindings.forEach(function (binding, bi) {
        if (!binding.sourceId) {
          errors.push(
            "Block " + b.id + " binding[" + bi + "] missing sourceId",
          );
        } else if (!ids[binding.sourceId]) {
          errors.push(
            "Block " +
              b.id +
              " binding[" +
              bi +
              "]: sourceId '" +
              binding.sourceId +
              "' not in template",
          );
        }
        if (!binding.sourceEvent)
          errors.push(
            "Block " + b.id + " binding[" + bi + "] missing sourceEvent",
          );
        if (!binding.targetProp)
          errors.push(
            "Block " + b.id + " binding[" + bi + "] missing targetProp",
          );
      });
    }
  });

  return { valid: errors.length === 0, errors: errors };
};

// ── Orchestrator ──
// Main entry point. Returns a Promise<{ template, brand, validation }>.
// onProgress(message) is called with status strings during generation.
FB.agent.generate = function (brief, opts, onProgress) {
  opts = opts || {};
  onProgress = onProgress || function () {};

  onProgress("Analysing brief...");

  // Stage 1: parallel — extract brand + draft layout
  return Promise.all([
    FB.agent._brandWorker(brief),
    FB.agent._layoutWorker(brief, {}),
  ])
    .then(function (results) {
      var brand = results[0];
      var layout = results[1];

      onProgress(
        "Layout ready (" + layout.blocks.length + " blocks). Adding Veltro...",
      );

      // Stage 2: Veltro worker enriches layout with canvas widgets + bindings
      return FB.agent
        ._veltroWorker(brief, brand, layout)
        .then(function (enriched) {
          return { brand: brand, template: enriched };
        });
    })
    .then(function (state) {
      onProgress("Validating...");
      var validation = FB.agent._validate(state.template);

      if (!validation.valid && !opts.noRetry) {
        // One reflective retry: give the Veltro worker the error list
        onProgress("Fixing " + validation.errors.length + " issue(s)...");
        var retryBrief =
          brief +
          "\n\nIMPORTANT: Fix these validation errors from the previous attempt:\n" +
          validation.errors.join("\n");
        return FB.agent
          ._veltroWorker(retryBrief, state.brand, state.template)
          .then(function (fixed) {
            var finalValidation = FB.agent._validate(fixed);
            return {
              template: fixed,
              brand: state.brand,
              validation: finalValidation,
            };
          });
      }

      return {
        template: state.template,
        brand: state.brand,
        validation: validation,
      };
    });
};
