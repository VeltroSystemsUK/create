// ── Creative Library — Domain-specific composition patterns, Veltro mappings, and color palettes ──
// Referenced by the AI agent to inject domain expertise into template generation.

FB.creative = FB.creative || {};

FB.creative.DOMAINS = [
  {
    domain: "Ecommerce",
    themes: ["Editorial Luxury", "Cyberpunk/Techwear", "Soft Wellness Minimalist", "Neo-Brutalist Indie"],
    recipes: [
      "Luxe Ecommerce: megaNav → orbsHero (product hero) → marquee (brand strip) → ecomFeaturedProduct → glassCards (USPs) → parallaxImageStack (lookbook) → testimonial → ecomProductGrid → ecomNewsletter → colorBlock (dark CTA)",
      "Cyberpunk Store: slideNav → videoHero → textScramble (tagline) → ecomProductGrid (neon borders) → splitText (brand story) → ecomProductCarousel → glitchSection → ecomSaleBanner → ecomCountdown",
      "Wellness Brand: nav (clean) → splitHero (hero product image) → services (ingredients) → ecomProductGrid (soft cards) → testimonial (social proof) → counterSection (impact stats) → imageTextBottom (lifestyle) → ecomNewsletter",
      "Brutalist Shop: fullscreenMenu → colorBlock (statement yellow) → ecomFeaturedProduct → horizontalScrollGallery → work (raw product shots) → textBlock (manifesto) → ecomProductGrid (tight grid) → cta (bold black/white)"
    ],
    veltro: "auroraBorealis, tiltCard3d, glitchSection, multiShapeTrail, holographicCard, gradientFlow, scrollTriggered, particleNebula, kineticText, morphingText",
    colors: "lime #CDFE00, blue #3b82f6, pink #ec4899, orange #f97316, purple #8b5cf6"
  },
  {
    domain: "Farm-to-Table",
    themes: ["Earthy Organic Editorial", "Modern Homestead", "Brutalist Bodega", "Heritage Orchard"],
    recipes: [
      "Earthy Organic Editorial: megaNav → splitHero (hero harvest shot) → marquee (farm names) → services (produce categories) → imageTextLeft (farmer story) → ecomProductGrid (seasonal boxes) → testimonial → glassCards (sustainability) → ecomNewsletter → footerWidget",
      "Modern Homestead: nav (clean) → orbsHero (dramatic produce) → counterSection (impact stats) → ecomFeaturedProduct (signature box) → imageTextRight (traceability) → ecomProductGrid (crisp grid) → trustPill → splitText (manifesto) → ecomNewsletter",
      "Brutalist Bodega: fullscreenMenu → colorBlock (neon statement) → imageTextBottom (raw produce) → horizontalScrollGallery (market stalls) → ecomProductGrid (tight grid) → textBlock (community manifesto) → cta (bold) → socialIcons",
      "Heritage Orchard: nav (warm) → splitHero (orchard hero) → timeline (family history) → imageTextTop (craft process) → ecomProductCard (featured preserves) → testimonial (customer love) → imageTextBottom (lifestyle) → ecomNewsletter (seasonal alerts)"
    ],
    veltro: "noiseGrain, morphBlob, auroraBorealis, gradientFlow, imagePhysics, scrollTriggered, parallaxDepth",
    colors: "terracotta #8B5E3C, olive #6B8E23, warm tan #D4A574, deep forest #2D5016, rust #C44E2D, cream #F5E6D3"
  },
  {
    domain: "Manufacturing",
    themes: ["Precision Aerospace & Defense", "Heavy Industrial & Automation", "Next-Gen CleanTech / Biotech", "Neo-Brutalist Infrastructure"],
    recipes: [
      "Precision Aerospace: megaNav (enterprise) → orbsHero (blueprint globe) → counterSection (specs/kpi) → services (capabilities icons) → imageTextLeft (factory floor) → process (assembly flow) → glassCards (certifications) → ecomProductCard (flagship product) → trustPill (ISO badges) → footerWidget",
      "Heavy Industrial: fullscreenMenu → videoHero (factory reel) → marquee (client logos) → work (project portfolio) → stats (tonnage/output) → imageTextRight (machinery) → testimonial (procurement officers) → splitText (capability statement) → cta (RFQ button) → footerWidget",
      "CleanTech/Biotech: nav (clean white) → splitHero (lab imagery) → features (research pillars) → timeline (milestones) → imageTextLeft (innovation) → glassCards (technology stack) → counterSection (impact metrics) → ecomProductGrid (solutions) → ecomNewsletter → footerWidget",
      "Brutalist Infrastructure: fullscreenMenu → colorBlock (raw statement) → imageTextTop (mega-project) → horizontalScrollGallery (site photography) → services (capabilities) → textBlock (engineering manifesto) → stats (scale) → clientCarousel (government/enterprise) → cta (bold)"
    ],
    veltro: "geometricPatterns, sectionBackground, constellationLines, shaderBg, svgDraw, kineticText, morphingCounter, tiltCard3d, infiniteCanvas, magneticFields",
    colors: "safety orange #FF4F00, tactical blue #004E7C, machined black #1A1A1A, steel #C0C0C0, factory floor #0A0A0A, terminal green #00FF88"
  },
  {
    domain: "Construction",
    themes: ["Architectural Minimalist / Avant-Garde", "Heavy Civil & Infrastructure", "Sustainable Eco-Build & Urban Green", "Modern Residential / Craft Builder"],
    recipes: [
      "Architectural Minimalist: megaNav (luxury) → splitHero (signature building) → marquee (award logos) → services (disciplines) → work (project portfolio) → imageTextLeft (design philosophy) → glassCards (sustainability) → parallaxImageStack (interior layers) → testimonial → footerWidget",
      "Heavy Civil Infrastructure: fullscreenMenu → videoHero (drone site footage) → counterSection (project scale stats) → process (construction phases) → imageTextRight (heavy equipment) → horizontalScrollGallery (project sites) → timeline (milestones) → stats (safety records) → cta (bid invitation) → trustPill (certifications) → footerWidget",
      "Sustainable Eco-Build: nav (clean) → orbsHero (rendering flythrough) → features (green tech) → imageTextTop (mass timber) → services (sustainability) → glassCards (LEED/WELL certs) → counterSection (carbon stats) → imageTextBottom (urban integration) → ecomNewsletter → footerWidget",
      "Modern Craft Builder: nav (warm) → splitHero (custom home) → timeline (build journey) → imageTextLeft (craftsmanship) → portfolio (finished projects) → testimonial (homeowner stories) → imageTextRight (interior details) → glassCards (material palette) → cta (consultation) → footerWidget"
    ],
    veltro: "mosaicAssemble, stickyScrollStack, parallaxDepth, svgDraw, geometryDraw, noiseGrain, tiltCard3d, perspectiveRooms, infiniteCanvas, layeredParallax, sectionBackground",
    colors: "steel blue #2C3E50, hazard amber #F39C12, architectural white #ECF0F1, concrete grey #7F8C8D, deep foundation #1B2631, premium brass #D4AF37"
  },
  {
    domain: "Beauty / Salon",
    themes: ["Editorial Luxury Spa", "Avant-Garde Neo-Salon", "Clinical Clean-Tech Aesthetics", "Cozy Organic Apothecary"],
    recipes: [
      "Editorial Luxury Spa: megaNav (premium) → splitHero (signature treatment imagery) → marquee (brand philosophy) → services (treatment menu) → imageTextLeft (spa environment) → glassCards (product range) → parallaxImageStack (texture close-ups) → testimonial (client transformations) → priceTable (membership tiers) → ecomNewsletter (exclusive offers) → footerWidget",
      "Avant-Garde Neo-Salon: slideNav (edgy) → videoHero (runway reel) → imageTextRight (creative director) → portfolio (lookbook grid) → wordSwap (trending styles) → splitText (brand manifesto) → ecomProductGrid (product line) → glitchSection (neon edge) → socialIcons → cta (book now)",
      "Clinical Clean-Tech Aesthetics: nav (crisp white) → orbsHero (treatment visualization) → features (technology stack) → counterSection (clinical results) → imageTextLeft (medical expertise) → glassCards (treatment categories) → timeline (patient journey) → trustPill (certifications) → ecomProductCard (clinical skincare) → faq → cta",
      "Cozy Organic Apothecary: nav (warm botanical) → splitHero (herbal imagery) → timeline (heritage story) → services (holistic treatments) → imageTextTop (ingredient sourcing) → testimonial (healing stories) → imageTextBottom (apothecary interior) → ecomProductGrid (natural products) → blockquote (wellness philosophy) → ecomNewsletter → footerWidget"
    ],
    veltro: "liquidGradient, morphBlob, lightLeaks, depthOfField, holographicCard, auroraBorealis, scrollFluid, tiltCard3d, cursorDistortion, holographicOverlay, mirrorReflection",
    colors: "warm alabaster #F5E6D3, linen cream #E8D5C4, dusty rose #C9A9A6, deep botanical #2F4F4F, champagne gold #D4AF37, soft lavender #F0E6EF, warm clay #8B6B5E"
  },
  {
    domain: "Law / CPA",
    themes: ["High-End Prestige Partner", "Hyper-Modern FinTech Advisory", "Accessible Boutique", "Neo-Brutalist White-Collar"],
    recipes: [
      "High-End Prestige Partner: megaNav (blue/navy) → splitHero (partner portrait + tagline) → services (practice areas with icons) → counterSection (case statistics) → glassCards (industry recognition) → testimonial (client testimonials) → timeline (firm milestones) → team (partner profiles) → trustPill (bar admissions) → faq → cta (schedule consultation) → footerWidget",
      "Hyper-Modern FinTech Advisory: nav (dark, clean) → orbsHero (data visualization globe) → morphingCounter (live financial metrics) → services (tax/audit/advisory) → stats (client savings) → imageTextLeft (technology stack) → glassCards (service packages) → trustPill (SOC2/PCI compliance) → ecomNewsletter (tax alerts) → cta (secure portal) → footerWidget",
      "Accessible Boutique: nav (warm, rounded) → splitHero (firm photo + welcome) → features (client-first values) → team (attorney/staff grid) → imageTextLeft (community involvement) → testimonial (client stories) → accordion (FAQ) → priceTable (service tiers) → blockquote (founding philosophy) → cta (free consultation) → footerWidget",
      "Neo-Brutalist White-Collar: fullscreenMenu → colorBlock (bold authority statement) → wordSwap (practice areas cycling) → stats (aggressive case metrics) → imageTextTop (courtroom/boardroom) → timeline (landmark cases) → counterSection (damages recovered) → textBlock (litigation philosophy) → cta (bold, urgent) → footerWidget"
    ],
    veltro: "morphingCounter, typewriterReveal, tiltCard3d, gradientFlow, glassmorphismStack, scrollProgressRing, stickyScrollStack, noiseGrain, sectionBackground, constellationLines",
    colors: "navy authority #1B365D, forest prestige #2D5016, parchment bond #F5F0E8, warm leather #8B7355, midnight depth #0A1628, premium brass #C9A96E"
  },
  {
    domain: "Automotive",
    themes: ["Luxury Showroom / Concierge Dealer", "High-Velocity Performance Lab", "Transparent Local Garage", "Neo-Brutalist Moto-Club"],
    recipes: [
      "Luxury Showroom: megaNav (premium) → videoHero (cinematic walkaround) → marquee (brand partners) → ecomFeaturedProduct (hero vehicle) → horizontalScrollGallery (inventory carousel) → glassCards (ownership services) → tiltCard3d (vehicle detail cards) → testimonial (owner stories) → counterSection (performance stats) → cta (book test drive) → footerWidget",
      "High-Velocity Performance Lab: slideNav (aggressive) → videoHero (dyno/track footage) → kineticScramble (spec reveal) → ecomProductCard (tuning packages) → services (performance upgrades) → imageTextRight (build gallery) → counterSection (power/torque metrics) → portfolio (completed builds) → cta (book dyno session) → footerWidget",
      "Transparent Local Garage: nav (clean, trustworthy) → splitHero (shop photo + slogan) → services (repair menu) → priceTable (service pricing) → team (mechanic profiles) → trustPill (certifications) → testimonial (customer reviews) → googleMaps (location) → alert (current specials) → cta (book appointment) → footerWidget",
      "Neo-Brutalist Moto-Club: fullscreenMenu → colorBlock (raw statement) → portfolio (custom builds) → imageTextTop (workshop photography) → horizontalScrollGallery (bike gallery) → textBlock (club manifesto) → timeline (restoration stories) → socialIcons → cta (join the club) → footerWidget"
    ],
    veltro: "velocitySkew, scrollVelocity, tiltCard3d, carousel3d, cursorLens, glassmorphismStack, velocityFluidBg, noiseGrain, sectionBackground, scrollProgressRing, imagePhysics",
    colors: "carbon black #1A1A1A, brushed alloy #C0C0C0, hazard crimson #DC143C, tuner neon #00FF44, midnight metallic #0A1628, showroom white #F5F5F5, racing orange #FF6600"
  },
  {
    domain: "Fitness / Health",
    themes: ["High-Octane Performance Lab", "Mindful Wellness Minimalist", "Clinical Biohacking & Longevity", "Community Powerhouse"],
    recipes: [
      "High-Octane Performance Lab: slideNav (aggressive) → videoHero (training montage) → morphingCounter (transformation stats) → services (training programs) → imageTextRight (facility tour) → priceTable (membership tiers) → team (coach profiles) → testimonial (client transformations) → scrollProgressRing (achievement tracker) → cta (start trial) → footerWidget",
      "Mindful Wellness Minimalist: nav (soft, clean) → splitHero (studio photography) → marquee (wellness philosophy) → services (class types) → imageTextLeft (mindfulness practice) → testimonial (healing journeys) → glassCards (membership benefits) → counterSection (wellness metrics) → blockquote (founder's message) → cta (book session) → footerWidget",
      "Clinical Biohacking & Longevity: nav (crisp, medical) → orbsHero (data visualization) → features (technology stack) → counterSection (biometric results) → timeline (treatment journey) → glassmorphismStack (service layers) → trustPill (clinical certifications) → imageTextLeft (lab photography) → ecomProductGrid (supplements/devices) → faq → cta → footerWidget",
      "Community Powerhouse: nav (bold, vibrant) → splitHero (group class imagery) → marquee (community slogans) → horizontalScrollGallery (facility tour) → priceTable (membership tiers) → team (instructor grid) → testimonial (member stories) → socialIcons → alert (current promotions) → cta (join now) → footerWidget"
    ],
    veltro: "scrollProgressRing, morphingCounter, velocitySkew, scrollVelocity, cursorRipple, tiltCard3d, audioVisualizer, soundReactive, velocityFluidBg, auroraBorealis, collisionChaos, depthOfField",
    colors: "competition black #0A0A0A, electric ultraviolet #7C3AED, recovery green #00FF88, cardio red #FF4B4B, calm oat #F5E6D3, hydration blue #3B82F6, energy amber #F59E0B"
  },
  {
    domain: "Hospitality",
    themes: ["High-End Mixology Den", "Underground Club / Rave Vault", "Modern Heritage Gastropub", "Neon Tiki / Rooftop Lounge"],
    recipes: [
      "High-End Mixology Den: megaNav (dark, premium) → splitHero (signature cocktail imagery) → marquee (spirit partners) → glassCards (cocktail menu) → imageTextLeft (mixologist story) → parallaxImageStack (bar interior layers) → testimonial (guest reviews) → priceList (bottle service) → typewriterReveal (house philosophy) → cta (reserve table) → footerWidget",
      "Underground Club / Rave Vault: fullscreenMenu → videoHero (event reel) → glitchSection (neon header) → soundReactive (live audio visualizer) → horizontalScrollGallery (event photography) → timeline (upcoming DJs) → kineticScramble (set times) → marquee (ticket alerts) → cta (buy tickets) → socialIcons → footerWidget",
      "Modern Heritage Gastropub: nav (warm, textured) → splitHero (pub interior + food) → services (dining/bar/events) → imageTextLeft (brewing heritage) → priceList (food menu) → team (chef/brewer profiles) → testimonial (diner reviews) → timeline (pub history) → googleMaps (location) → cta (book a table) → footerWidget",
      "Neon Tiki / Rooftop Lounge: nav (vibrant) → orbsHero (sunset visual) → parallaxImageStack (venue layers) → liquidGradient (tropical colors) → priceTable (VIP packages) → socialIcons → marquee (event calendar) → imageTextBottom (rooftop photography) → countdown (next event) → cta (join guestlist) → footerWidget"
    ],
    veltro: "liquidGradient, liquidText, lightLeaks, audioVisualizer, soundReactive, gradientFlow, holographicCard, cursorRipple, glitchSection, velocityFluidBg, noiseGrain, mirrorReflection",
    colors: "midnight void #0D0D0D, antique brass #C9A96E, emerald velvet #006B4B, deep wine #8B0000, neon pink #FF1493, cyan strobe #00FFFF, candlelight cream #F5E6D3, deep purple haze #1A0A2E"
  },
  {
    domain: "Medical Retail",
    themes: ["Clinical Elite", "Empathetic Wellness Practice", "Modern High-Tech Apothecary", "Minimalist Specialist"],
    recipes: [
      "Clinical Elite: megaNav (crisp white/silver) → splitHero (flagship clinic imagery) → services (treatment categories) → trustPill (accreditations) → team (practitioner profiles) → glassCards (treatment tiers) → counterSection (patient outcomes) → testimonial (patient stories) → faq (common questions) → cta (book consultation) → footerWidget",
      "Empathetic Wellness Practice: nav (warm, rounded) → splitHero (pet/patient photography) → features (care philosophy) → team (vet/dentist profiles) → timeline (patient journey) → testimonial (recovery stories) → imageTextLeft (clinic environment) → priceTable (service pricing) → alert (emergency info) → cta (schedule visit) → footerWidget",
      "Modern High-Tech Apothecary: megaNav (dark, scientific) → orbsHero (molecular visualization) → morphingCounter (prescription stats) → services (lab services) → imageTextLeft (compounding lab) → ecomProductGrid (health products) → trustPill (FDA/GPhC certs) → glassmorphismStack (service layers) → faq → cta (order prescription) → footerWidget",
      "Minimalist Specialist: nav (ultra-clean) → splitHero (consultation imagery) → features (specialist areas) → timeline (treatment process) → glassCards (case studies) → testimonial (referral stories) → blockquote (medical philosophy) → trustPill (board certifications) → faq → cta (refer a patient) → footerWidget"
    ],
    veltro: "glassmorphismStack, morphingCounter, tiltCard3d, depthOfField, scrollProgressRing, gradientFlow, noiseGrain, auroraBorealis, typewriterReveal, morphBlob",
    colors: "surgical white #FFFFFF, scrub blue #E8F4F8, medical teal #2E86AB, bandage cream #F5F0E8, deep clinical navy #1B4965, pharmacy green #7AB648, soft healing pink #C9A9A6"
  },
  {
    domain: "Education & E-Learning",
    themes: ["Ivy League Prestige", "EdTech Disruptor", "Modern Creative Academy", "Inclusive Growth Hub"],
    recipes: [
      "Ivy League Prestige: megaNav (navy/crimson) → splitHero (campus photography) → marquee (accreditation strip) → services (academic departments) → counterSection (enrollment stats) → timeline (institutional history) → team (faculty profiles) → testimonial (alumni success) → trustPill (rankings/badges) → faq → cta (apply now) → footerWidget",
      "EdTech Disruptor: slideNav (sleek dark) → orbsHero (data globe) → morphingCounter (learner metrics) → features (platform capabilities) → imageTextLeft (learning interface) → glassCards (course categories) → counterSection (completion rates) → testimonial (student outcomes) → priceTable (subscription tiers) → cta (start free trial) → footerWidget",
      "Modern Creative Academy: fullscreenMenu → videoHero (student work reel) → portfolio (student projects) → wordSwap (career outcomes) → imageTextRight (studio environment) → timeline (curriculum journey) → team (instructor profiles) → splitText (educational philosophy) → cta (apply for intake) → socialIcons → footerWidget",
      "Inclusive Growth Hub: nav (warm, welcoming) → splitHero (campus community) → features (support services) → imageTextTop (student life) → team (staff/faculty grid) → testimonial (student journeys) → glassCards (program pathways) → counterSection (success metrics) → priceTable (tuition/funding) → cta (start application) → footerWidget"
    ],
    veltro: "scrollProgressRing, morphingCounter, stickyScrollStack, tiltCard3d, gradientFlow, constellationLines, typewriterReveal, glassmorphismStack, noiseGrain, sectionBackground",
    colors: "crimson #8B0000, navy #1B365D, parchment #F5F0E8, edtech neon #00D4FF, academy purple #7C3AED, warm sand #E8D5C4, chalkboard green #2D5016"
  },
  {
    domain: "Local Retail & Boutique",
    themes: ["Curated Indie Boutique", "Urban Maker Market", "Sustainable General Store", "High-Vibe Pop-Up Bodega"],
    recipes: [
      "Curated Indie Boutique: megaNav (warm, elegant) → splitHero (hero product photography) → marquee (brand story) → ecomFeaturedProduct (signature item) → parallaxImageStack (collection lookbook) → testimonial (customer love) → ecomProductGrid (curated collection) → imageTextBottom (studio/workshop) → cta (shop collection) → socialIcons → footerWidget",
      "Urban Maker Market: fullscreenMenu → colorBlock (statement hero) → horizontalScrollGallery (maker stalls) → ecomProductGrid (tight grid) → imageTextLeft (craft process) → wordSwap (materials/values) → testimonial (community love) → portfolio (behind the scenes) → cta (visit market) → footerWidget",
      "Sustainable General Store: nav (clean, green-forward) → splitHero (store interior) → features (ethical commitments) → ecomProductGrid (product categories) → timeline (sourcing journey) → imageTextRight (local suppliers) → counterSection (impact metrics) → trustPill (certifications) → cta (shop sustainably) → footerWidget",
      "High-Vibe Pop-Up Bodega: slideNav (neon edge) → videoHero (street footage) → glitchSection (brand header) → ecomProductGrid (drop collection) → kineticScramble (limited edition tags) → marquee (location alerts) → imageTextBottom (pop-up photography) → countdown (next drop) → cta (join waitlist) → socialIcons → footerWidget"
    ],
    veltro: "noiseGrain, tiltCard3d, imagePhysics, floatingIslands, cursorLens, parallaxImageStack, gradientFlow, lightLeaks, glitchSection, morphBlob",
    colors: "oatmeal #F5E6D3, terracotta #C44E2D, sage #87A96B, neon pink #FF1493, lime pop #CDFE00, warm clay #8B6B5E, kraft paper #C4A35A"
  },
  {
    domain: "Food & Culinary",
    themes: ["Gastronomic Atelier", "Neon Street Food Market", "High-Speed Digital QSR", "Artisanal Hearth"],
    recipes: [
      "Gastronomic Atelier: megaNav (dark, refined) → splitHero (signature dish macro) → marquee (press/awards) → glassCards (tasting menu) → imageTextLeft (chef story) → parallaxImageStack (dining room layers) → testimonial (critic reviews) → priceTable (reservations) → typewriterReveal (philosophy) → cta (book a table) → footerWidget",
      "Neon Street Food Market: fullscreenMenu → videoHero (street cooking footage) → glitchSection (neon menu) → horizontalScrollGallery (vendor stalls) → ecomProductGrid (food items) → soundReactive (audio vibe) → marquee (daily specials) → timeline (upcoming locations) → cta (order now) → socialIcons → footerWidget",
      "High-Speed Digital QSR: nav (bold, efficient) → splitHero (signature items) → ecomProductGrid (menu grid) → priceList (combo deals) → counterSection (served/stats) → scrollProgressRing (order tracker) → trustPill (quality badges) → imageTextBottom (store interior) → alert (current deals) → cta (start order) → footerWidget",
      "Artisanal Hearth: nav (warm, textured) → splitHero (wood-fired/baking photography) → timeline (heritage story) → services (dining/wholesale) → imageTextLeft (ingredient sourcing) → testimonial (diner stories) → ecomProductGrid (artisan goods) → glassCards (process values) → cta (reserve/order) → footerWidget"
    ],
    veltro: "liquidGradient, noiseGrain, lightLeaks, scrollFluid, velocityFluidBg, tiltCard3d, glitchSection, holographicCard, cursorRipple, soundReactive, morphBlob",
    colors: "charcoal #1A1A1A, alabaster #F5F0E8, neon lime #CDFE00, hot pink #FF1493, tomato red #FF4B4B, wheat gold #D4A574, burnt timber #5C3A21"
  },
  {
    domain: "Home Trades",
    themes: ["Grid System Specialist", "Trusted Heritage Trade", "Rapid Response Force", "Eco-Energy Engineer"],
    recipes: [
      "Grid System Specialist: megaNav (dark, precision) → orbsHero (smart-home visualization) → morphingCounter (live service metrics) → services (trade specializations) → imageTextLeft (van/engineer photography) → glassCards (service packages) → process (installation workflow) → trustPill (NICEIC/GasSafe certs) → testimonial → cta (book engineer) → footerWidget",
      "Trusted Heritage Trade: nav (warm, maritime blue) → splitHero (family/team photography) → timeline (company heritage) → services (trade services) → imageTextRight (completed projects) → testimonial (customer trust) → team (engineer profiles) → counterSection (years/callouts) → priceTable (service tiers) → cta (request quote) → footerWidget",
      "Rapid Response Force: nav (high-contrast alert) → videoHero (emergency response footage) → marquee (coverage areas) → services (emergency services) → alert (24/7 availability) → priceList (fixed-price repairs) → imageTextTop (response vehicles) → trustPill (accreditations) → chatWidget → cta (call now) → footerWidget",
      "Eco-Energy Engineer: nav (clean, green-forward) → splitHero (heat pump/solar installation) → features (eco benefits) → counterSection (carbon savings) → imageTextLeft (installation process) → glassCards (grant/funding info) → process (installation journey) → trustPill (MCS certs) → testimonial → cta (free survey) → footerWidget"
    ],
    veltro: "svgDraw, sectionBackground, constellationLines, morphingCounter, tiltCard3d, gradientFlow, noiseGrain, scrollProgressRing, glassmorphismStack, cursorLens",
    colors: "neon blue #00D4FF, copper #C44E2D, hazard orange #FF4F00, maritime navy #1B365D, forest green #2D5016, parchment #F5F0E8, sage #87A96B, clinical silver #C0C0C0"
  }
];

// Build the combined prompt segment for layout worker
FB.creative.getLayoutLibrary = function () {
  var parts = [];
  FB.creative.DOMAINS.forEach(function (d) {
    parts.push("## " + d.domain.toUpperCase() + " PATTERNS:");
    d.recipes.forEach(function (r) { parts.push("- " + r); });
    parts.push(d.domain + " Veltro choices: " + d.veltro);
    parts.push("");
  });
  return parts.join("\n");
};

// Build the color palette segment for brand worker
FB.creative.getColorPalettes = function () {
  var parts = [];
  FB.creative.DOMAINS.forEach(function (d) {
    parts.push("For " + d.domain.toLowerCase() + " brands, use: " + d.colors);
  });
  return parts.join("\n");
};
