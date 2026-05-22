FB.templates = {};

FB.templates.save = function () {
  var name = prompt("Template name:", "My Template");
  if (!name) return;
  var templates = JSON.parse(localStorage.getItem("fb-templates") || "[]");
  templates.push({
    id: Date.now(),
    name: name,
    version: 1,
    created: new Date().toISOString(),
    blocks: JSON.parse(JSON.stringify(FB.state.blocks)),
    count: FB.state.blocks.length,
  });
  localStorage.setItem("fb-templates", JSON.stringify(templates));
  localStorage.removeItem("fb-autosave");
  FB.util.showToast("\u2705 Template saved: " + name);
};

FB.templates.load = function (id) {
  var templates = JSON.parse(localStorage.getItem("fb-templates") || "[]");
  var tpl = templates.find(function (t) {
    return t.id === id;
  });
  if (!tpl) return;
  if (FB.state.blocks.length > 0) {
    if (!confirm("Load this template? Current canvas will be replaced."))
      return;
  }
  FB.state.saveHistory();
  FB.state.blocks = JSON.parse(JSON.stringify(tpl.blocks));
  FB.state.selectedId = null;
  FB.canvas.render();
  FB.panels.renderRightPanel();
  FB.util.showToast("\uD83D\uDCC2 Loaded: " + tpl.name);
};

FB.templates.delete = function (id) {
  var templates = JSON.parse(localStorage.getItem("fb-templates") || "[]");
  templates = templates.filter(function (t) {
    return t.id !== id;
  });
  localStorage.setItem("fb-templates", JSON.stringify(templates));
  FB.panels.openTemplateManager();
};

FB.templates.exportJSON = function () {
  var data = {
    name: "Exported Template",
    version: 1,
    created: new Date().toISOString(),
    blocks: JSON.parse(JSON.stringify(FB.state.blocks)),
  };
  var blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "template.fwb.json";
  a.click();
};

FB.templates.importJSON = function (file) {
  var reader = new FileReader();
  reader.onload = function (e) {
    try {
      var data = JSON.parse(e.target.result);
      if (data && data.blocks) {
        FB.state.saveHistory();
        FB.state.blocks = data.blocks;
        FB.state.selectedId = null;
        FB.canvas.render();
        FB.panels.renderRightPanel();
        FB.util.showToast("\uD83D\uDCC2 Template imported");
      }
    } catch (err) {
      FB.util.showToast("\u274C Invalid template file");
    }
  };
  reader.readAsText(file);
};

FB.templates.loadStarter = function () {
  var types = [
    "nav",
    "hero",
    "marquee",
    "work",
    "services",
    "stats",
    "testimonial",
    "process",
    "cta",
    "footer",
  ];
  var allDefs = Object.assign(
    {},
    FB.blocks.BLOCK_DEFS,
    FB.blocks.CUSTOM_BLOCK_DEFS,
  );
  FB.state.blocks = types.map(function (type) {
    return {
      id: FB.state.genId(),
      type: type,
      props: JSON.parse(JSON.stringify(allDefs[type].defaultProps)),
    };
  });
};

FB.templates.loadBuiltIn = function (name) {
  var url = "templates/" + name + ".json";
  fetch(url)
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      if (FB.state.blocks.length > 0) {
        if (!confirm("Load this template? Current canvas will be replaced."))
          return;
      }
      FB.state.saveHistory();
      FB.state.blocks = JSON.parse(JSON.stringify(data.blocks));
      FB.state.selectedId = null;
      FB.canvas.render();
      FB.panels.renderRightPanel();
      FB.util.showToast("\uD83D\uDCC2 Loaded: " + data.name);
      FB.export.close();
    })
    .catch(function () {
      FB.util.showToast("\u274C Failed to load template");
    });
};

FB.templates.populateTemplates = function () {
  var panel = document.getElementById("templates-panel");
  if (!panel) return;

  var tplColor = "#3b82f6";
  var builtIn = [
    { name: "agency", label: "Agency", icon: "\uD83C\uDFE2" },
    { name: "portfolio", label: "Portfolio", icon: "\uD83D\uDDBC" },
    { name: "saas", label: "SaaS", icon: "\u2601" },
    { name: "landing", label: "Landing", icon: "\uD83D\uDE80" },
    { name: "coming-soon", label: "Coming Soon", icon: "\u23F3" },
    { name: "fshape-grid", label: "F-Shape", icon: "F" },
    { name: "holy-grail", label: "Holy Grail", icon: "\u2728" },
    { name: "asymmetric-split", label: "Asymmetric", icon: "\u25F0" },
    { name: "bento-grid", label: "Bento Grid", icon: "\u25A4" },
    { name: "minimal-portfolio", label: "Minimal", icon: "\u25FB" },
    { name: "bold-creative", label: "Bold Creative", icon: "\uD83C\uDFA8" },
    { name: "dark-saas", label: "Dark SaaS", icon: "\uD83D\uDDA5" },
    { name: "eco-friendly", label: "Eco Brand", icon: "\uD83C\uDF31" },
    { name: "luxury-brand", label: "Luxury", icon: "\uD83D\uDC8E" },
    { name: "startup-pitch", label: "Startup", icon: "\uD83D\uDCA1" },
    { name: "restaurant", label: "Restaurant", icon: "\uD83C\uDF7D" },
    { name: "fitness", label: "Fitness", icon: "\uD83D\uDCAA" },
    { name: "photography", label: "Photography", icon: "\uD83D\uDCF8" },
    { name: "consulting", label: "Consulting", icon: "\uD83D\uDCCA" },
    { name: "nonprofit", label: "Nonprofit", icon: "\uD83E\uDD1D" },
  ];
  var html = "";
  builtIn.forEach(function (t) {
    html +=
      '<div class="block-item" onclick="FB.templates.loadBuiltIn(\'' +
      t.name +
      '\')" style="cursor:pointer">' +
      FB.panels._icon(t.icon, tplColor, 28, 22, 14) +
      '<div><div class="block-label" style="font-size:11px">' +
      t.label +
      "</div></div>" +
      "</div>";
  });
  panel.innerHTML = html;
};

FB.BLOCK_THEMES = {
  headers: [
    {
      id: "theme-header-minimal",
      label: "Minimal Header",
      icon: "\u2014",
      iconBg: "#1a1a1a",
      iconColor: "#fff",
      blockType: "nav",
      props: {
        logoText: "studio.",
        links: ["Work", "About", "Contact"],
        ctaText: "",
        bg: "#ffffff",
        textColor: "#111111",
        accentColor: "#111111",
        menuStyle: "simple",
      },
    },
    {
      id: "theme-header-glass",
      label: "Glass Header",
      icon: "\u25C7",
      iconBg: "rgba(255,255,255,0.1)",
      iconColor: "#CDFE00",
      blockType: "nav",
      props: {
        logoText: "NEXUS",
        links: ["Home", "Services", "Portfolio", "Blog", "Contact"],
        ctaText: "Get Started",
        bg: "rgba(17,17,17,0.6)",
        textColor: "#f7f6f2",
        accentColor: "#CDFE00",
        menuStyle: "simple",
      },
    },
    {
      id: "theme-header-gradient",
      label: "Gradient Header",
      icon: "\u2588",
      iconBg: "linear-gradient(135deg,#667eea,#764ba2)",
      iconColor: "#fff",
      blockType: "nav",
      props: {
        logoText: "Prism",
        links: ["Features", "Pricing", "Docs", "Community"],
        ctaText: "Sign Up Free",
        bg: "linear-gradient(135deg,#667eea,#764ba2)",
        textColor: "#ffffff",
        accentColor: "#ffffff",
        menuStyle: "simple",
      },
    },
    {
      id: "theme-header-dark-bold",
      label: "Dark Bold Header",
      icon: "\u25A0",
      iconBg: "#0a0a0a",
      iconColor: "#ff4444",
      blockType: "nav",
      props: {
        logoText: "REBEL\u00AE",
        links: ["Work", "Studio", "Journal", "Store"],
        ctaText: "Book a Call",
        bg: "#0a0a0a",
        textColor: "#ffffff",
        accentColor: "#ff4444",
        menuStyle: "simple",
      },
    },
  ],
  heroes: [
    {
      id: "theme-hero-minimal",
      label: "Minimal Hero",
      icon: "H",
      iconBg: "#f5f5f5",
      iconColor: "#111",
      blockType: "hero",
      props: {
        eyebrow: "Design Studio",
        headline: "Less is<br><em>more.</em>",
        subtext: "We strip away the unnecessary to reveal what truly matters.",
        ctaText: "View our work",
        bg: "#f5f5f5",
        textColor: "#111111",
        accentColor: "#111111",
        showBlob: false,
        blobStyle: "none",
        _heroHeadlineSize: 64,
        _heroSubtextSize: 18,
        _textColor: "#111111",
        _subtextColor: "rgba(0,0,0,0.5)",
      },
    },
    {
      id: "theme-hero-gradient-dark",
      label: "Dark Gradient Hero",
      icon: "H",
      iconBg: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
      iconColor: "#00d4ff",
      blockType: "hero",
      props: {
        eyebrow: "Next Generation Platform",
        headline: "Build the<br><em>future.</em>",
        subtext: "AI-powered tools for teams that move fast and break nothing.",
        ctaText: "Start Building \u2192",
        bg: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
        textColor: "#f7f6f2",
        accentColor: "#00d4ff",
        showBlob: true,
        blobStyle: "blob",
        _heroHeadlineSize: 64,
        _heroSubtextSize: 18,
        _textColor: "#f7f6f2",
        _subtextColor: "rgba(255,255,255,0.5)",
      },
    },
    {
      id: "theme-hero-warm",
      label: "Warm Hero",
      icon: "H",
      iconBg: "linear-gradient(135deg,#f093fb,#f5576c)",
      iconColor: "#fff",
      blockType: "hero",
      props: {
        eyebrow: "Welcome to Paradise",
        headline: "Feel the<br><em>warmth.</em>",
        subtext: "Tropical escapes curated for the modern traveller.",
        ctaText: "Explore Destinations",
        bg: "linear-gradient(135deg,#f093fb,#f5576c)",
        textColor: "#ffffff",
        accentColor: "#ffffff",
        showBlob: true,
        blobStyle: "blob",
        _heroHeadlineSize: 64,
        _heroSubtextSize: 18,
        _textColor: "#ffffff",
        _subtextColor: "rgba(255,255,255,0.7)",
      },
    },
    {
      id: "theme-hero-earth",
      label: "Earth Tone Hero",
      icon: "H",
      iconBg: "#2d1b0e",
      iconColor: "#d4a574",
      blockType: "hero",
      props: {
        eyebrow: "Artisan Coffee Co.",
        headline: "Crafted with<br><em>purpose.</em>",
        subtext:
          "Single-origin beans, roasted to perfection. From farm to cup.",
        ctaText: "Shop Now",
        bg: "#2d1b0e",
        textColor: "#f7f6f2",
        accentColor: "#d4a574",
        showBlob: false,
        blobStyle: "none",
        _heroHeadlineSize: 64,
        _heroSubtextSize: 18,
        _textColor: "#f7f6f2",
        _subtextColor: "rgba(255,255,255,0.5)",
      },
    },
    {
      id: "theme-hero-neon",
      label: "Neon Hero",
      icon: "H",
      iconBg: "#0a0a0a",
      iconColor: "#39ff14",
      blockType: "hero",
      props: {
        eyebrow: "Digital Experience Agency",
        headline: "We make<br><em>noise.</em>",
        subtext: "Bold digital experiences that cut through the static.",
        ctaText: "See Our Work \u2192",
        bg: "#0a0a0a",
        accentColor: "#39ff14",
        showBlob: true,
        blobStyle: "blob",
      },
    },
  ],
  ctas: [
    {
      id: "theme-cta-minimal",
      label: "Minimal CTA",
      icon: "\u2192",
      iconBg: "#fff",
      iconColor: "#111",
      blockType: "cta",
      props: {
        headline: "Let's work together.",
        btnText: "Get in touch",
        bg: "#ffffff",
        textColor: "#111111",
        buttonStyle: "filled",
      },
    },
    {
      id: "theme-cta-gradient",
      label: "Gradient CTA",
      icon: "\u2192",
      iconBg: "linear-gradient(135deg,#f093fb,#f5576c)",
      iconColor: "#fff",
      blockType: "cta",
      props: {
        headline: "Ready to <em>transform</em><br>your business?",
        btnText: "Start Free Trial \u2192",
        bg: "linear-gradient(135deg,#f093fb,#f5576c)",
        textColor: "#ffffff",
        buttonStyle: "filled",
      },
    },
    {
      id: "theme-cta-dark-urgent",
      label: "Urgent CTA",
      icon: "!",
      iconBg: "#ff4444",
      iconColor: "#fff",
      blockType: "cta",
      props: {
        headline: "Only 3 spots left<br>this month.",
        btnText: "Claim Your Spot \u2192",
        bg: "#ff4444",
        textColor: "#ffffff",
        buttonStyle: "filled",
      },
    },
  ],
  footers: [
    {
      id: "theme-footer-minimal",
      label: "Minimal Footer",
      icon: "\u22A5",
      iconBg: "#f5f5f5",
      iconColor: "#111",
      blockType: "footer",
      props: {
        logoText: "studio.",
        tagline: "Design with purpose.",
        cols: [
          { heading: "Pages", links: ["Work", "About", "Contact"] },
          { heading: "Social", links: ["Twitter", "Instagram", "LinkedIn"] },
        ],
        copyright: "\u00A9 2026 studio. All rights reserved.",
        bg: "#f5f5f5",
        accentColor: "#111111",
        layoutStyle: "columns",
      },
    },
    {
      id: "theme-footer-dark-mega",
      label: "Dark Mega Footer",
      icon: "\u22A5",
      iconBg: "#0a0a0a",
      iconColor: "#CDFE00",
      blockType: "footer",
      props: {
        logoText: "NEXUS",
        tagline: "Building the future of digital.",
        cols: [
          {
            heading: "Product",
            links: ["Features", "Pricing", "Integrations", "Changelog"],
          },
          { heading: "Company", links: ["About", "Careers", "Press", "Blog"] },
          {
            heading: "Resources",
            links: ["Documentation", "Help Center", "Community", "Contact"],
          },
          { heading: "Legal", links: ["Privacy", "Terms", "Security"] },
        ],
        copyright: "\u00A9 2026 NEXUS Inc. All rights reserved.",
        bg: "#0a0a0a",
        accentColor: "#CDFE00",
        layoutStyle: "columns",
      },
    },
    {
      id: "theme-footer-warm",
      label: "Warm Footer",
      icon: "\u22A5",
      iconBg: "#2d1b0e",
      iconColor: "#d4a574",
      blockType: "footer",
      props: {
        logoText: "Brew Co.",
        tagline: "From farm to cup, since 2019.",
        cols: [
          {
            heading: "Shop",
            links: ["Single Origin", "Blends", "Subscriptions", "Equipment"],
          },
          {
            heading: "Learn",
            links: ["Brew Guides", "Our Story", "Sustainability"],
          },
          { heading: "Visit", links: ["London", "Edinburgh", "Bristol"] },
        ],
        copyright: "\u00A9 2026 Brew Co. Crafted with care.",
        bg: "#2d1b0e",
        accentColor: "#d4a574",
        layoutStyle: "columns",
      },
    },
  ],
  features: [
    {
      id: "theme-features-clean",
      label: "Clean Features",
      icon: "\u2726",
      iconBg: "#fff",
      iconColor: "#667eea",
      blockType: "features",
      props: {
        label: "Why choose us",
        headline: "Built for modern teams.",
        items: [
          {
            icon: "\u26A1",
            title: "Lightning Fast",
            desc: "Sub-second load times, globally distributed.",
          },
          {
            icon: "\uD83D\uDD12",
            title: "Enterprise Security",
            desc: "SOC 2 Type II certified, end-to-end encryption.",
          },
          {
            icon: "\uD83D\uDCCA",
            title: "Real-time Analytics",
            desc: "Live dashboards with actionable insights.",
          },
          {
            icon: "\uD83E\uDD1D",
            title: "Team Collaboration",
            desc: "Shared workspaces with role-based access.",
          },
        ],
        bg: "#ffffff",
        textColor: "#111111",
        accentColor: "#667eea",
      },
    },
    {
      id: "theme-features-dark",
      label: "Dark Features",
      icon: "\u2726",
      iconBg: "#111",
      iconColor: "#39ff14",
      blockType: "features",
      props: {
        label: "Capabilities",
        headline: "What we bring to the table.",
        items: [
          {
            icon: "\uD83C\uDFA8",
            title: "Brand Identity",
            desc: "Logos, guidelines, and complete visual systems.",
          },
          {
            icon: "\uD83D\uDCBB",
            title: "Web Development",
            desc: "Performant, accessible, and beautifully crafted.",
          },
          {
            icon: "\uD83D\uDCC8",
            title: "Growth Strategy",
            desc: "Data-driven campaigns that scale with you.",
          },
        ],
        bg: "#111111",
        textColor: "#f7f6f2",
        accentColor: "#39ff14",
      },
    },
  ],
  testimonials: [
    {
      id: "theme-testimonial-clean",
      label: "Clean Testimonial",
      icon: "\u201C",
      iconBg: "#fff",
      iconColor: "#667eea",
      blockType: "testimonial",
      props: {
        quote:
          "The team transformed our outdated platform into a modern, user-friendly experience. Our engagement metrics increased by 340% within the first quarter.",
        attribution: "Rachel Kim \u2014 VP of Product, TechForward",
        bg: "#ffffff",
        accentColor: "#667eea",
      },
    },
    {
      id: "theme-testimonial-dark",
      label: "Dark Testimonial",
      icon: "\u201C",
      iconBg: "#111",
      iconColor: "#CDFE00",
      blockType: "testimonial",
      props: {
        quote:
          "Working with this team has been a genuine pleasure. Their passion for what they do shines through in every single detail of the final product.",
        attribution: "Marcus Webb \u2014 Founder, LaunchPad Studios",
        bg: "#111111",
        accentColor: "#CDFE00",
      },
    },
  ],
  stats: [
    {
      id: "theme-stats-light",
      label: "Light Stats",
      icon: "##",
      iconBg: "#f5f5f5",
      iconColor: "#667eea",
      blockType: "stats",
      props: {
        stats: [
          { num: "500+", label: "Projects Delivered" },
          { num: "98%", label: "Client Satisfaction" },
          { num: "12", label: "Industry Awards" },
          { num: "50+", label: "Team Members" },
        ],
        bg: "#f5f5f5",
        accentColor: "#667eea",
      },
    },
    {
      id: "theme-stats-dark",
      label: "Dark Stats",
      icon: "##",
      iconBg: "#111",
      iconColor: "#39ff14",
      blockType: "stats",
      props: {
        stats: [
          { num: "10M+", label: "Users Reached" },
          { num: "340%", label: "Avg. ROI Increase" },
          { num: "200+", label: "Happy Clients" },
          { num: "8yr", label: "In Business" },
        ],
        bg: "#111111",
        accentColor: "#39ff14",
      },
    },
  ],
};

FB.templates.populateBlockThemes = function () {
  var panel = document.getElementById("blockthemes-panel");
  if (!panel) return;
  var themeColors = {
    headers: "#6366f1",
    heroes: "#f59e0b",
    ctas: "#ef4444",
    footers: "#64748b",
    features: "#22c55e",
    testimonials: "#ec4899",
    stats: "#06b6d4",
  };
  var categories = [
    { key: "headers", label: "Headers" },
    { key: "heroes", label: "Heroes" },
    { key: "ctas", label: "CTAs" },
    { key: "footers", label: "Footers" },
    { key: "features", label: "Features" },
    { key: "testimonials", label: "Testimonials" },
    { key: "stats", label: "Stats" },
  ];
  var html = "";
  categories.forEach(function (cat) {
    var themes = FB.BLOCK_THEMES[cat.key] || [];
    if (themes.length === 0) return;
    var tColor = themeColors[cat.key] || "#6366f1";
    html +=
      '<div class="section-header">' +
      '<span class="section-dot" style="background:' +
      tColor +
      '"></span>' +
      cat.label +
      "</div>";
    themes.forEach(function (t) {
      html +=
        '<div class="block-item" onclick="FB.blockThemes.applyTheme(\'' +
        t.id +
        '\')" style="cursor:pointer">' +
        FB.panels._icon(t.icon, tColor, 24, 20, 8) +
        '<div><div class="block-label" style="font-size:11px">' +
        t.label +
        "</div></div>" +
        "</div>";
    });
  });
  panel.innerHTML = html;
};

FB.blockThemes = {};

FB.blockThemes.applyTheme = function (themeId) {
  var theme = null;
  Object.keys(FB.BLOCK_THEMES).forEach(function (cat) {
    var found = FB.BLOCK_THEMES[cat].find(function (t) {
      return t.id === themeId;
    });
    if (found) theme = found;
  });
  if (!theme) return;
  FB.state.saveHistory();
  var block = {
    id: FB.state.genId(),
    type: theme.blockType,
    props: JSON.parse(JSON.stringify(theme.props)),
  };
  FB.state.blocks.push(block);
  FB.canvas.render();
  FB.canvas.selectBlock(block.id);
  FB.util.showToast("\uD83C\uDFA8 " + theme.label + " added");
};
