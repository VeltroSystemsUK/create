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
        try {
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
        } catch (e) {
          reject(new Error("Failed to parse API response: " + e.message));
        }
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
  "You are a visionary brand strategist. Extract brand parameters that will inspire a bold, award-winning website.\n" +
  "Return ONLY valid JSON — no markdown fences, no commentary:\n" +
  '{ "industry": "agency", "tone": "bold and editorial", "accentColor": "#CDFE00",\n' +
  '  "bgColor": "#111111", "textColor": "#f7f6f2",\n' +
  '  "keywords": ["motion", "creative", "digital"], "targetAudience": "startups",\n' +
  '  "vibe": "brutalist-dark", "visualStyle": "kinetic-typography-meets-glassmorphism" }\n' +
  "Choose accentColor creatively — NEVER default to lime. Pick from: #CDFE00 (lime), #3b82f6 (blue), #ec4899 (pink), #f97316 (orange), #8b5cf6 (purple), #34d399 (green), #f59e0b (amber), or craft a custom hex that matches the industry.\n" +
  "bgColor: dark (#0a0a0a-#1a1a1a) for creative/luxury/tech. Light (#ffffff-#f5f5f5) for clean/professional/corporate.\n" +
  "vibe options: brutalist-dark, editorial-minimal, glassmorphism-premium, kinetic-playful, retro-brutalist, neo-brutalist, swiss-clean, cyberpunk-neon, organic-soft, luxury-gold, earthy-organic, modern-homestead, brutalist-bodega, heritage-orchard\n" +
  "visualStyle: describe the intended visual language in 3-5 words\n" +
  FB.creative.getColorPalettes();

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
  "You are an Award-Winning Creative Director running a 'Creative Agency in a Box.' You architect emotionally engaging, conversion-optimized websites by combining blocks, widgets, and Veltro visual effects. Your templates win design awards.\n\n" +
  "Return ONLY valid JSON — no markdown, no commentary:\n" +
  '{ "name": "Brand Concept Name", "blocks": [ { "id": "hero_1", "type": "orbsHero", "props": {...} }, ... ] }\n\n' +
  "## ANTI-PATTERNS — If you do ANY of these, restart from scratch:\n" +
  "1. NEVER use the same block type twice. Every block type must be UNIQUE. No nav→hero→services→testimonial chains.\n" +
  "2. NEVER start with 'nav' followed by 'hero' followed by 'services.' This is the Wix template — it's banned.\n" +
  "3. NEVER use plain blocks (textBlock, colorBlock, features) for more than 20% of the layout. Widgets MUST dominate.\n" +
  "4. NEVER make two adjacent sections the same visual weight. Alternate: heavy→light→heavy→light.\n" +
  "5. NEVER use generic placeholder text like 'Lorem ipsum' or 'Your headline here.' Use REAL brand-specific copy.\n\n" +
  "## CREATIVE MANDATE — Follow these or the design is garbage:\n" +
  "1. 50%+ blocks MUST be widget types: animatedHeadline, morphingCounter, typewriterReveal, kineticText, textScramble, imageGallery, portfolio, slides, counter, countdown, iconBox, flipBox, tabs, accordion, toggle, priceTable, cta, noiseGrain, gradientFlow, liquidGradient, auroraBorealis, particleNebula, blockquote, textPath, alert, googleMaps.\n" +
  "2. Hero MUST be: animatedHeadline OR typewriterReveal OR textScramble OR kineticText — anything but plain hero/splitHero.\n" +
  "3. Background between sections: inject a Veltro ambient widget (auroraBorealis, liquidGradient, particleNebula, noiseGrain, gradientFlow) between every 2-3 content sections.\n" +
  "4. Social proof: use counter + testimonial + blockquote as a TRIPLE PUNCH section. Not just one testimonial.\n" +
  "5. Call to action: use cta widget with bold accent background. NOT a plain button. Make it unmissable.\n" +
  "6. Footer: use footerWidget OR socialIcons + googleMaps + alert combo. Never a plain text footer.\n" +
  "7. Chunk your layout into visual beats: OPENING(hero+bg) → VALUE(counters+icons) → PROOF(testimonials+gallery) → CONVERT(cta+pricing) → CLOSE(footer).\n" +
  "8. Every single block must have unique, specific, real-world copy. Restaurant names, product prices, location addresses, real stats.\n\n" +
  "## THEME GUIDES:\n" +
  "- Editorial Luxury: high contrast, generous whitespace, serif-adjacent typography (Lexend bold), dark bg, gold/bronze accents, image-heavy, glassmorphism cards.\n" +
  "- Cyberpunk/Techwear: neon accents on darkest bg (#050510), glitch effects, kinetic typography, grid-heavy layouts, tech-blue or magenta accents.\n" +
  "- Soft Wellness Minimalist: light warm bg (#faf8f5), soft green/sage accents, rounded corners, organic shapes, generous padding, calm rhythm.\n" +
  "- Neo-Brutalist Indie: raw borders, bold primary colors, sharp corners, oversized typography, collage-style image placement, high-energy layout.\n\n" +
  "## COMPLETE BLOCK & WIDGET INVENTORY:\n" +
  "STANDARD BLOCKS: nav, hero, marquee, work, services, stats, testimonial, process, cta, footer, features, pricing, team, videoHero, splitHero, orbsHero, megaNav, slideNav, resultsGrid, glassCards, portfolioGrid, clientCarousel, trustPill, metricBox, wordSwap, chatWidget, cookieConsent, liteVideo, faq, splitText, maskReveal, fullscreenMenu, circularList, glitchText, svgDraw, noiseSection, scrollIndicator, timeline, textBlock, colorBlock, imageTextTop, imageTextBottom, imageTextLeft, imageTextRight\n" +
  "ECOMMERCE: ecomProductCard, ecomProductGrid, ecomFeaturedProduct, ecomProductCarousel, ecomSaleBanner, ecomNewsletter, ecomCountdown, ecomReviews, ecomTrustBadges\n" +
  "VELTRO AMBIENT (background mood): auroraBorealis, liquidGradient, particleNebula, geometricPatterns, gradientFlow, shaderBg, constellationLines, noiseGrain, lightLeaks, holographicOverlay\n" +
  "VELTRO TYPOGRAPHY: kineticText, textScramble, typewriterReveal, textMask, morphingCounter, liquidText, waveText, morphingText, kineticScramble\n" +
  "VELTRO PHYSICS: gravityWells, clothSimulation, magneticFields, pendulumWave, collisionChaos, blackHole, imagePhysics, fluidSimulation, physicsSandbox\n" +
  "VELTRO CURSOR: multiShapeTrail, magneticCursor, particleTrail, cursorRipple, cursorDistortion, magneticText, gravityCursor, colorSampler, cursorLens\n" +
  "VELTRO SCROLL: scrollTriggered, stickyScrollStack, mosaicAssemble, parallaxImageStack, scrollProgressRing, parallaxDepth, horizontalScrollGallery, velocitySkew, scrollFluid, velocityFluidBg\n" +
  "VELTRO SPATIAL/3D: tiltCard3d, carousel3d, perspectiveRooms, floatingIslands, layeredParallax, kineticLayout, morphingGrid, spatialNavigation, infiniteCanvas\n" +
  "VELTRO VISUAL: morphBlob, glassmorphismStack, glitchSection, audioVisualizer, depthOfField, holographicCard, soundReactive, mirrorReflection, geometryDraw\n\n" +
  "## COMPOSITION RECIPES (use these patterns):\n" +
  "- Luxe Ecommerce: megaNav → orbsHero (product hero) → marquee (brand strip) → ecomFeaturedProduct → glassCards (USPs) → parallaxImageStack (lookbook) → testimonial → ecomProductGrid → ecomNewsletter → colorBlock (dark CTA)\n" +
  "- Cyberpunk Store: slideNav → videoHero → textScramble (tagline) → ecomProductGrid (neon borders) → splitText (brand story) → ecomProductCarousel → glitchSection → ecomSaleBanner → ecomCountdown\n" +
  "- Wellness Brand: nav (clean) → splitHero (hero product image) → services (ingredients) → ecomProductGrid (soft cards) → testimonial (social proof) → counterSection (impact stats) → imageTextBottom (lifestyle) → ecomNewsletter\n" +
  "- Brutalist Shop: fullscreenMenu → colorBlock (statement yellow) → ecomFeaturedProduct → horizontalScrollGallery → work (raw product shots) → textBlock (manifesto) → ecomProductGrid (tight grid) → cta (bold black/white)\n\n" +
  "Generate 10-15 blocks. At least HALF must be WIDGET types (not standard blocks). Widgets render differently from blocks creating genuine visual diversity.\n\n" +
  "WIDGET TYPES YOU MUST USE (pick 6-9 per template):\n" +
  "- hero-level: animatedHeadline, morphingCounter, typewriterReveal, kineticText, textScramble\n" +
  "- content: imageGallery, portfolio, slides, counter, countdown, iconBox, iconList, blockquote, textPath, image, button\n" +
  "- layout: tabs, accordion, toggle, flipBox, priceTable, priceList, cta, footerWidget\n" +
  "- display: gallery, googleMaps, codeBlock, socialIcons, videoPlaylist\n" +
  "- ambient (use as section backgrounds): noiseGrain, gradientFlow, liquidGradient, auroraBorealis, particleNebula\n\n" +
  "CREATIVE RECIPES (use these as starting points):\n" +
  "- nav → animatedHeadline(hero) → gradientFlow(bg between sections) → tabs(services) → counter(stats) → imageGallery(work) → testimonial → cta\n" +
  "- megaNav → typewriterReveal(hero) → auroraBorealis(bg) → flipBox(team cards) → portfolio(projects) → morphingCounter(impact) → priceTable(pricing) → cta\n" +
  "- slideNav → textScramble(hero) → noiseGrain(bg) → accordion(faq) → counterSection → blockquote(testimonial) → imageGallery → cta\n\n" +
  "Use images from https://picsum.photos/WIDTH/HEIGHT?random=N for placeholder imagery.\n\n" +
  FB.creative.getLayoutLibrary();

FB.agent._layoutWorker = function (brief, brand) {
  var context =
    "Brief: " +
    brief +
    "\n\nBrand parameters: " +
    JSON.stringify(brand, null, 2);
  return FB.agent
    ._call(FB.agent._LAYOUT_PROMPT, context, {
      temperature: 0.95,
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
  "You are a Veltro visual effects director. You take a page layout and INJECT cinematic, interactive magic using Veltro canvas widgets. Your job is to make the page unforgettable.\n" +
  "Return the COMPLETE layout JSON with Veltro blocks INSERTED at strategic positions. Preserve all existing blocks unchanged.\n" +
  "Return ONLY valid JSON — no markdown fences, no commentary.\n\n" +
  "## Rules:\n" +
  "- Add 2-4 Veltro blocks. Make them count. Every Veltro block must serve a clear emotional or interactive purpose.\n" +
  "- Match the Veltro widget to the brand theme:\n" +
  "  * Editorial Luxury: auroraBorealis or liquidGradient (ambient mood), tiltCard3d (product cards), holographicCard (premium shimmer)\n" +
  "  * Cyberpunk/Techwear: geometricPatterns or constellationLines (tech grid), glitchSection (edgy), multiShapeTrail or cursorDistortion (cursor magic)\n" +
  "  * Soft Wellness: morphBlob (organic shape), auroraBorealis (soft northern lights), particleNebula (gentle particles)\n" +
  "  * Neo-Brutalist: kineticText (bold variable type), collisionChaos or physicsSandbox (raw energy), noiseGrain (texture)\n" +
  "- Insert Veltro backgrounds (height: 500-700) behind heroes or between major content sections.\n" +
  "- Insert Veltro interaction widgets AFTER visual-heavy sections to reward user engagement.\n" +
  "- Use widget bindings to create scroll-driven magic: scrollProgressRing → auroraBorealis speed, or → particleNebula intensity.\n" +
  "- Assign unique IDs (e.g. v_bg_1, v_ring_1, v_tilt_1).\n\n" +
  "## Available Veltro widgets (use EXACT prop names):\n\n" +
  "TYPOGRAPHY:\n" +
  "- kineticText: text, tag(h1|h2|h3), mode(proximity|scroll|path), color, size, weight, minWeight, maxWeight, radius, fontFamily\n" +
  "- textScramble: text, fontSize, fontWeight, color, charset, scrambleSpeed, decodeTrigger(hover|click|scroll), cipherStyle(random|sequential|reverse)\n" +
  "- typewriterReveal: text, speed, cursor, color, fontSize, loop, delay, cursorStyle(blink|solid|underscore), multiText(comma-separated)\n" +
  "- morphingText: words(comma-separated), fontSize, fontWeight, textColor, morphSpeed, fadeSpeed, morphDirection(forward|reverse|random)\n" +
  "- kineticScramble: text, fontSize, fontWeight, textColor, scrambleSpeed, revealSpeed, cipherStyle\n" +
  "- waveText: text, fontSize, fontWeight, textColor, amplitude, frequency, speed, waveType(sine|cosine), glowEffect\n" +
  "- liquidText: text, fontSize, fontWeight, color, amplitude, frequency, speed, waveType, dualColour, glowEffect\n" +
  "- textMask: text, fontSize, fontWeight, bgImage, maskPosition(center|top|bottom|left|right), maskScale\n" +
  "- morphingCounter: value, prefix, suffix, duration, color, fontSize, numberFormat(plain|comma|dot), easingCurve(ease-out|ease-in-out|linear|spring), glowEffect\n\n" +
  "PHYSICS:\n" +
  "- physicsSandbox: items(string array), height, gravity, restitution, textColor, objectShape(box|circle|triangle), collisionFlash\n" +
  "- imagePhysics: images(url array), height, gravity, restitution, imageShape(square|circle|triangle|star|heart), imageSize, mouseInteraction\n" +
  "- gravityWells: particleCount, wellStrength, wellCount, wellRadius, particleSize, wellMode(attract|repel|orbit), particleColor, particleTrail, particleRandomColor, wellGlow\n" +
  "- fluidSimulation: particleCount, viscosity, color1, color2, fluidMode(flow|vortex|fountain|wave|burst|swirl), fluidDensity, fluidTurbulence, colorBlend(gradient|random|alternating|solid|velocity|position), fluidOpacity, mouseForce, fluidGlow, connectionLines\n" +
  "- clothSimulation: cols, rows, stiffness, damping, color, clothWind, pinEdges(top|all|none), mouseTear\n" +
  "- magneticFields: particleCount, fieldStrength, particleColor, fieldMode(dipole|quadrupole|vortex|random), fieldLines, particleTrail, particleGlow\n" +
  "- pendulumWave: count, amplitude, speed, color, pendulumLength, bobSize, bobShape(circle|square|diamond), waveMode(sine|cosine|random), layout(bottom|center|top), showTrail, glow\n" +
  "- collisionChaos: spawnRate, gravity, restitution, ballShape(circle|square|triangle), ballColors(comma-separated), maxBalls, ballGlow, spawnOnClick\n" +
  "- blackHole: particleCount, pullStrength, blackHoleSize, eventHorizon, accretionColor, accretionDisk, jetEnabled\n\n" +
  "BACKGROUNDS / AMBIENT:\n" +
  "- auroraBorealis: starCount, nebulaColors(comma-separated), speed\n" +
  "- particleNebula: particleCount, speed, intensity, nebulaColors(comma-separated)\n" +
  "- geometricPatterns: patternType(hexagons|triangles|circles|squares|diamonds|lines), colors(comma-separated), speed, cellSize, filled, flowSpeed\n" +
  "- liquidGradient: colors(comma-separated), flowSpeed, turbulence\n" +
  "- gradientFlow: colors(comma-separated), speed, angle\n" +
  "- shaderBg: shaderType(noise|waves|plasma|aurora), speed, intensity, color1, color2\n" +
  "- morphBlob: color, speed, complexity\n" +
  "- constellationLines: starCount, connectionDistance, starColor, lineColor\n" +
  "- noiseGrain: opacity, speed\n" +
  "- sectionBackground: pattern(dots|grid|diagonal|hexagons|circles), patternColor, patternSize\n" +
  "- lightLeaks: leakColor, intensity, direction(top-left|top-right|bottom-left|bottom-right)\n" +
  "- holographicOverlay: overlayColor, intensity, angle\n\n" +
  "CURSOR EFFECTS:\n" +
  "- magneticCursor: elementCount, magneticRadius, magneticStrength, elementColor, elementShape(circle|square|triangle|diamond), elementSize, repelMode, showCursor\n" +
  "- particleTrail: particleCount, particleSize, particleColor, fadeSpeed, particleShape(circle|square|triangle|star), particleTrail\n" +
  "- multiShapeTrail: trailLength, shapes(comma-separated), colors(comma-separated), speed, trailFade, trailGlow, glowSize, autonomousMode, colorMode(palette|gradient|rainbow)\n" +
  "- cursorRipple: rippleColor, rippleSize, rippleDuration, rippleShape(circle|square|diamond), rippleGlow\n" +
  "- magneticText: text, fontSize, textColor, magneticRadius, magneticStrength, letterSpacing, magneticEasing(ease-out|ease-in-out|spring), textGlow\n" +
  "- cursorDistortion: distortionRadius, distortionStrength, imageUrl, distortionType(lens|ripple|swirl|pinch), distortionChromatic\n" +
  "- gravityCursor: gravityStrength, particleCount, particleSize, particleColor, particleTrail, gravityMode(attract|repel), particleGlow\n" +
  "- cursorLens: image, lensSize, magnification\n\n" +
  "SCROLL:\n" +
  "- scrollProgressRing: ringColor, ringSize, ringWidth\n" +
  "- stickyScrollStack: cardCount, cardHeight, cardColor\n" +
  "- mosaicAssemble: rows, cols, gap, image\n" +
  "- parallaxImageStack: layerCount, images(comma-separated), depth, cardWidth, cardHeight\n" +
  "- scrollVelocitySkew: maxSkew, elasticity\n" +
  "- parallaxDepth: layerCount, speed, overlayText\n" +
  "- scrollTriggered: items(array), animationType(fadeUp|fadeIn|slideLeft|slideRight|scaleUp|rotateIn|flipIn|zoomIn), stagger, duration\n" +
  "- horizontalScrollGallery: itemCount, items(comma-separated), snap, momentum\n" +
  "- velocitySkew: maxSkew, elasticity, items(array)\n" +
  "- scrollFluid: color1, color2, scrollStrength, cursorStrength, decay, intensity\n" +
  "- velocityFluidBg: color1, color2, viscosityPreset(water|oil|honey|tar), scrollSensitivity, chaosEnabled\n\n" +
  "SPATIAL / 3D:\n" +
  "- tiltCard3d: cardBg, cardWidth, cardHeight, maxTilt, perspective\n" +
  "- carousel3d: cardCount, rotationSpeed, cards(array of {text,image})\n" +
  "- perspectiveRooms: roomCount, perspective, colors, roomLabels(comma-separated)\n" +
  "- floatingIslands: islandCount, floatRange, speed, islandLabels(comma-separated)\n" +
  "- layeredParallax: layerCount, depthIntensity, overlayText\n" +
  "- kineticLayout: elementCount, responseRadius, repulseStrength, itemSize, accentColor, mode(repulse|attract)\n" +
  "- morphingGrid: itemCount, cycleSpeed, transitionDuration, accentColor, autoCycle, itemLabels(comma-separated)\n" +
  "- spatialNavigation: navItems(comma-separated), perspective, spacing\n" +
  "- infiniteCanvas: gridSize, gridColor\n\n" +
  "VISUAL EFFECTS:\n" +
  "- glassmorphismStack: cardCount, cardColor, blur\n" +
  "- glitchSection: text, fontSize, fontWeight, color, intensity\n" +
  "- holographicCard: cardWidth, cardHeight, shimmerColor, intensity\n" +
  "- soundReactive: ringCount, ringColor, sensitivity\n" +
  "- depthOfField: layers, blurAmount, image\n" +
  "- mirrorReflection: image, reflectionOpacity\n" +
  "- audioVisualizer: barCount, barColor, barWidth, barGap\n" +
  "- geometryDraw: tool(line|circle|rect|arc), color, lineWidth\n\n" +
  "## Widget bindings (create interactive stories):\n" +
  "Emitters: scrollProgressRing → scrollProgress (0→1), magneticScroll → scrollProgress\n" +
  "Receivers: particleNebula → intensity/speed, gradientFlow → speed/angle, glitchSection → glitchRate,\n" +
  "  auroraBorealis → speed, tiltCard3d → maxTilt, noiseGrain → opacity,\n" +
  "  holographicOverlay → intensity, morphBlob → speed/complexity,\n" +
  "  liquidGradient → flowSpeed/turbulence, geometricPatterns → speed,\n" +
  "  gravityWells → particleCount/wellStrength, fluidSimulation → mouseForce,\n" +
  "  blackHole → pullStrength, collisionChaos → spawnRate,\n" +
  "  clothSimulation → stiffness, magneticFields → fieldStrength\n" +
  'Format: add "bindings": [{ "sourceId": "ring_1", "sourceEvent": "scrollProgress", "targetProp": "intensity", "inputRange": [0,1], "outputRange": [0,1] }] to the receiver block.\n\n' +
  "## Design combos:\n" +
  "- Cosmic: blackHole or auroraBorealis + particleNebula + constellationLines\n" +
  "- Lava Lamp: shaderBg(aurora) + kineticText(proximity mode) + scrollProgressRing bound to shaderBg speed\n" +
  "- Tech: geometricPatterns + kineticScramble + multiShapeTrail + scrollFluid\n" +
  "- Luxe: liquidGradient + tiltCard3d + holographicCard + gradientFlow\n" +
  "- Story: scrollTriggered items + scrollProgressRing bound to particleNebula + mosaicAssemble\n" +
  "- Portfolio: parallaxImageStack + morphingText + horizontalScrollGallery + glassmorphismStack\n" +
  "- Interact: imagePhysics + magneticCursor + gravityWells + cursorRipple";

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
