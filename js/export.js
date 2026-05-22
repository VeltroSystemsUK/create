FB.export = {};

FB.export.getBlockCSS = function () {
  var result =
    "@keyframes marqueeRoll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}\n";
  var typePrefixes = {
    nav: "fw-nav-",
    hero: "fw-hero-",
    marquee: "fw-marquee-",
    work: "fw-work-",
    services: "fw-services-",
    stats: "fw-stats-",
    testimonial: "fw-testimonial-",
    process: "fw-process-",
    cta: "fw-cta-",
    footer: "fw-footer-",
    textBlock: "fw-text-",
    colorBlock: "fw-color-",
    features: "fw-features-",
    pricing: "fw-pricing-",
    team: "fw-team-",
    videoHero: "fw-video-",
    splitHero: "fw-split-",
    orbsHero: "fw-orbs-",
    megaNav: "fw-mega-",
    slideNav: "fw-slide-",
    resultsGrid: "fw-results-",
    glassCards: "fw-glass-",
    portfolioGrid: "fw-portfolio-",
    clientCarousel: "fw-client-",
    trustPill: "fw-trust-",
    metricBox: "fw-metric-",
    wordSwap: "fw-word-",
    chatWidget: "fw-chat-",
    cookieConsent: "fw-cookie-",
    liteVideo: "fw-lite-",
  };
  var usedTypes = new Set();
  FB.state.blocks.forEach(function (b) {
    usedTypes.add(b.type);
  });
  var usedPrefixesSet = new Set();
  usedTypes.forEach(function (t) {
    if (typePrefixes[t]) usedPrefixesSet.add(typePrefixes[t]);
  });
  var usedPrefixes = [];
  usedPrefixesSet.forEach(function (p) {
    usedPrefixes.push(p);
  });

  try {
    for (var si = 0; si < document.styleSheets.length; si++) {
      var sheet = document.styleSheets[si];
      var rules;
      try {
        rules = sheet.cssRules;
      } catch (e) {
        continue;
      }
      if (!rules) continue;
      for (var ri = 0; ri < rules.length; ri++) {
        var rule = rules[ri];
        if (rule.selectorText) {
          for (var pi = 0; pi < usedPrefixes.length; pi++) {
            var p = usedPrefixes[pi];
            if (rule.selectorText.indexOf(p) > -1) {
              result += rule.cssText + "\n";
              break;
            }
          }
        }
      }
    }
  } catch (e) {}
  return result;
};

FB.export.generateMetaTags = function (seo) {
  seo = seo || {};
  var pageState = FB.state.page || {};
  var title = seo.siteName || "My Site";
  var description =
    seo.siteDescription || "A website built with Framework Builder";
  if (pageState.title) title = pageState.title;
  if (pageState.description) description = pageState.description;
  var url = seo.canonicalUrl || window.location.href;
  var image = seo.ogImage || "";
  var locale = seo.locale || "en_GB";
  var robots = seo.robots || "index, follow, max-image-preview:large";
  var themeColor = seo.themeColor || "#111111";
  var googleVerification = seo.googleVerification || "";
  var twitterHandle = seo.twitterHandle || "";
  FB.state.blocks.forEach(function (b) {
    if (
      (b.type === "hero" || b.type === "videoHero" || b.type === "splitHero") &&
      b.props.headline
    ) {
      title = seo.siteName
        ? seo.siteName +
          " \u2014 " +
          b.props.headline.replace(/<[^>]*>/g, "").substring(0, 60)
        : b.props.headline.replace(/<[^>]*>/g, "").substring(0, 60);
    }
    if (
      (b.type === "hero" || b.type === "videoHero" || b.type === "splitHero") &&
      b.props.subtext
    ) {
      description = b.props.subtext.substring(0, 160);
    }
  });
  var tags = "";
  tags += "<title>" + title + "</title>\n";
  tags += '<meta name="description" content="' + description + '">\n';
  tags += '<meta name="robots" content="' + robots + '">\n';
  tags += '<meta name="theme-color" content="' + themeColor + '">\n';
  if (googleVerification) {
    tags +=
      '<meta name="google-site-verification" content="' +
      googleVerification +
      '">\n';
  }
  tags += '<meta property="og:type" content="website">\n';
  tags += '<meta property="og:locale" content="' + locale + '">\n';
  tags += '<meta property="og:url" content="' + url + '">\n';
  tags += '<meta property="og:title" content="' + title + '">\n';
  tags += '<meta property="og:description" content="' + description + '">\n';
  if (image) {
    tags += '<meta property="og:image" content="' + image + '">\n';
    tags += '<meta property="og:image:width" content="1200">\n';
    tags += '<meta property="og:image:height" content="630">\n';
    tags += '<meta property="og:image:alt" content="' + title + '">\n';
  }
  tags += '<meta name="twitter:card" content="summary_large_image">\n';
  tags += '<meta name="twitter:title" content="' + title + '">\n';
  tags += '<meta name="twitter:description" content="' + description + '">\n';
  if (image) {
    tags += '<meta name="twitter:image" content="' + image + '">\n';
  }
  if (twitterHandle) {
    tags += '<meta name="twitter:site" content="' + twitterHandle + '">\n';
  }
  tags += '<link rel="canonical" href="' + url + '">\n';
  if (pageState.favicon)
    tags += '<link rel="icon" href="' + pageState.favicon + '">\n';
  return tags;
};

FB.export.escapeJson = function (str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\n")
    .replace(/\t/g, "\\t");
};

FB.export.generateJSONLD = function (seo) {
  seo = seo || {};
  var orgName = seo.siteName || "My Company";
  var url = seo.canonicalUrl || window.location.href;
  var description = seo.siteDescription || "";
  var logo = seo.logoUrl || "";
  var sameAs = seo.socialLinks || [];
  var localBiz = seo.localBusiness || {};
  var title = orgName;
  FB.state.blocks.forEach(function (b) {
    if (
      (b.type === "hero" || b.type === "videoHero" || b.type === "splitHero") &&
      b.props.headline
    ) {
      title = b.props.headline.replace(/<[^>]*>/g, "").substring(0, 120);
    }
    if (b.type === "nav" && b.props.logoText) orgName = b.props.logoText;
  });

  var schemas = [];

  var org = {
    "@context": "https://schema.org",
    "@id": url + "#organization",
    "@type": "Organization",
    name: orgName,
    url: url,
  };
  if (logo) org["logo"] = logo;
  if (description) org["description"] = description;
  if (sameAs.length) org["sameAs"] = sameAs;
  schemas.push(org);

  schemas.push({
    "@context": "https://schema.org",
    "@id": url + "#website",
    "@type": "WebSite",
    name: orgName,
    url: url,
    publisher: { "@id": url + "#organization" },
  });

  schemas.push({
    "@context": "https://schema.org",
    "@id": url + "#webpage",
    "@type": "WebPage",
    name: title,
    url: url,
    description: description,
    isPartOf: { "@id": url + "#website" },
    about: { "@id": url + "#organization" },
  });

  if (localBiz.latitude && localBiz.longitude) {
    var lb = {
      "@context": "https://schema.org",
      "@id": url + "#localbusiness",
      "@type": "LocalBusiness",
      name: orgName,
      url: url,
      geo: {
        "@type": "GeoCoordinates",
        latitude: localBiz.latitude,
        longitude: localBiz.longitude,
      },
    };
    if (localBiz.areaServed && localBiz.areaServed.length) {
      lb["areaServed"] = localBiz.areaServed.map(function (a) {
        return { "@type": a.type || "City", name: a.name };
      });
    }
    if (localBiz.priceRange) lb["priceRange"] = localBiz.priceRange;
    if (localBiz.telephone) lb["telephone"] = localBiz.telephone;
    if (localBiz.addressLocality) {
      lb["address"] = {
        "@type": "PostalAddress",
        addressLocality: localBiz.addressLocality,
        addressRegion: localBiz.addressRegion || "",
        addressCountry: localBiz.addressCountry || "",
      };
    }
    if (localBiz.openingHours && localBiz.openingHours.length) {
      lb["openingHoursSpecification"] = localBiz.openingHours.map(function (h) {
        return {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days,
          opens: h.opens || "09:00",
          closes: h.closes || "17:00",
        };
      });
    }
    schemas.push(lb);
  }

  var faqBlocks = FB.state.blocks.filter(function (b) {
    return b.type === "faq";
  });
  faqBlocks.forEach(function (fb) {
    if (fb.props.items && fb.props.items.length) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: fb.props.items.map(function (item) {
          return {
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          };
        }),
      });
    }
  });

  var navBlocks = FB.state.blocks.filter(function (b) {
    return b.type === "nav" || b.type === "megaNav" || b.type === "slideNav";
  });
  navBlocks.forEach(function (nb, ni) {
    if (nb.props.links && nb.props.links.length) {
      var navItems = nb.props.links.map(function (link, i) {
        var entry = {
          "@type": "SiteNavigationElement",
          position: i + 1,
          name: typeof link === "string" ? link : link.label,
          url: typeof link === "string" ? "#" : link.url || "#",
        };
        return entry;
      });
      schemas.push({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Main Navigation",
        itemListElement: navItems,
      });
    }
  });

  var result = "";
  schemas.forEach(function (s) {
    result +=
      '<script type="application/ld+json">' +
      JSON.stringify(s) +
      "<\/script>\n";
  });
  return result;
};

FB.export._extractDomains = function () {
  var domains = {};
  FB.state.blocks.forEach(function (b) {
    var p = b.props;
    [p.posterUrl, p.videoUrl, p.embedUrl, p.image, p.src].forEach(function (u) {
      if (u && typeof u === "string" && u.startsWith("http")) {
        try {
          var d = new URL(u).hostname;
          if (d !== window.location.hostname) domains[d] = true;
        } catch (e) {}
      }
    });
    if (p.cards) {
      p.cards.forEach(function (c) {
        if (c.image && c.image.startsWith("http")) {
          try {
            domains[new URL(c.image).hostname] = true;
          } catch (e) {}
        }
      });
    }
    if (p.items) {
      p.items.forEach(function (it) {
        if (it.image && it.image.startsWith("http")) {
          try {
            domains[new URL(it.image).hostname] = true;
          } catch (e) {}
        }
      });
    }
    if (p.members) {
      p.members.forEach(function (m) {
        if (m.image && m.image.startsWith("http")) {
          try {
            domains[new URL(m.image).hostname] = true;
          } catch (e) {}
        }
      });
    }
    if (p.logos) {
      p.logos.forEach(function (l) {
        if (l.src && l.src.startsWith("http")) {
          try {
            domains[new URL(l.src).hostname] = true;
          } catch (e) {}
        }
      });
    }
  });
  return Object.keys(domains);
};

FB.export.generateResourceHints = function () {
  var hints = "";
  hints += '<link rel="preconnect" href="https://fonts.googleapis.com">\n';
  hints +=
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n';
  hints +=
    '<link rel="dns-prefetch" href="https://www.google-analytics.com">\n';

  var domains = FB.export._extractDomains();
  var skip = [
    "fonts.googleapis.com",
    "fonts.gstatic.com",
    "www.google-analytics.com",
  ];
  domains.forEach(function (d) {
    if (skip.indexOf(d) === -1) {
      hints += '<link rel="preconnect" href="https://' + d + '" crossorigin>\n';
    }
  });

  var heroBlock = FB.state.blocks.find(function (b) {
    return (
      b.type === "hero" || b.type === "videoHero" || b.type === "splitHero"
    );
  });
  if (heroBlock) {
    var hp = heroBlock.props;
    var heroImg =
      hp.posterUrl || hp.image || hp.embedType === "vimeo" ? "" : "";
    if (heroImg) {
      hints +=
        '<link rel="preload" as="image" href="' +
        heroImg +
        '" fetchpriority="high">\n';
    }
  }

  return hints;
};

FB.export.generateHTML = function () {
  var headingFont = (FB.state.theme || {}).fontHeading || "Lexend";
  var bodyFont = (FB.state.theme || {}).fontBody || "Lexend";
  var fontFamilies = ["Lexend"];
  if (headingFont !== "Lexend") fontFamilies.push(headingFont);
  if (bodyFont !== "Lexend" && bodyFont !== headingFont)
    fontFamilies.push(bodyFont);
  var fontLink = fontFamilies
    .map(function (f) {
      return (
        '<link href="https://fonts.googleapis.com/css2?family=' +
        encodeURIComponent(f) +
        ':wght@300;400;500;600;700;800&display=swap" rel="stylesheet">'
      );
    })
    .join("\n");
  var bodyContent = FB.state.blocks
    .filter(function (b) {
      return !b.parentId;
    })
    .map(function (b, idx) {
      var wrapper = document.querySelector(
        '.canvas-block[data-id="' + b.id + '"]',
      );
      if (!wrapper) return "";
      var inner = wrapper.cloneNode(true);
      inner
        .querySelectorAll(".block-controls,.drag-handle,.block-label-overlay")
        .forEach(function (e) {
          e.remove();
        });
      inner.className = "";
      inner.removeAttribute("data-id");
      var html = inner.innerHTML.trim();
      if (idx > 1) {
        html = html.replace(
          /<img /g,
          '<img loading="lazy" fetchpriority="low" ',
        );
      }
      if (b.type === "nav" || b.type === "megaNav" || b.type === "slideNav")
        return (
          '<header>\n<nav aria-label="Main navigation">\n' +
          html +
          "\n</nav>\n</header>"
        );
      if (b.type === "footer") return "<footer>\n" + html + "\n</footer>";
      return (
        '<section aria-label="' +
        (b.props.label || b.type) +
        '" data-scroll>\n' +
        html +
        "\n</section>"
      );
    })
    .join("\n\n");

  var seo = FB.export._getSeoSettings();
  var blockCSS = FB.export.getBlockCSS();
  var theme = FB.state.theme || {};
  var page = FB.state.page || {};
  var themeCSS =
    ":root{" +
    "--page-accent:" +
    (theme.accent || "#CDFE00") +
    ";" +
    "--page-bg:" +
    (theme.bg || "#111111") +
    ";" +
    "--page-text:" +
    (theme.text || "#f7f6f2") +
    ";" +
    "--page-surface:" +
    (theme.surface || "#1a1a2a") +
    ";" +
    "--page-font-heading:'" +
    (theme.fontHeading || "Lexend") +
    "',sans-serif;" +
    "--page-font-body:'" +
    (theme.fontBody || "Lexend") +
    "',sans-serif;" +
    "}\n";
  var scrollAnimCSS =
    "[data-scroll]{opacity:0;transform:translateY(28px);transition:opacity 0.7s ease,transform 0.7s ease}[data-scroll].is-visible{opacity:1;transform:none}\n";
  var scrollAnimJS =
    '<script>(function(){var o=new IntersectionObserver(function(e){e.forEach(function(e){if(e.isIntersecting){e.target.classList.add("is-visible");o.unobserve(e.target)}})},{threshold:0.12});document.querySelectorAll("[data-scroll]").forEach(function(e){o.observe(e)})}())<\/script>\n';
  var customCSS = page.customCSS ? page.customCSS + "\n" : "";

  return (
    '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
    '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    FB.export.generateResourceHints() +
    fontLink +
    "\n" +
    FB.export.generateMetaTags(seo) +
    FB.export.generateJSONLD(seo) +
    "<style>\n*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n" +
    "body { font-family: 'Lexend', sans-serif; }\n" +
    themeCSS +
    scrollAnimCSS +
    blockCSS +
    customCSS +
    "</style>\n</head>\n<body>\n" +
    '<a href="#main-content" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden">Skip to main content</a>\n' +
    bodyContent +
    "\n" +
    scrollAnimJS +
    "</body>\n</html>"
  );
};

FB.export._getSeoSettings = function () {
  var seo = {};
  try {
    var saved = localStorage.getItem("fb-seo-settings");
    if (saved) seo = JSON.parse(saved);
  } catch (e) {}
  return seo;
};

FB.export.calculateSEOScore = function () {
  var seo = FB.export._getSeoSettings();
  var score = 0;
  var breakdown = [];

  var meta = 0;
  if (seo.siteName && seo.siteName !== "My Site") meta += 3;
  if (
    seo.siteDescription &&
    seo.siteDescription !== "A website built with Framework Builder"
  )
    meta += 3;
  meta += 3;
  meta += 3;
  meta += 3;
  if (seo.robots) meta += 1;
  if (seo.themeColor) meta += 1;
  if (seo.googleVerification) meta += 1;
  score += meta;
  breakdown.push({ category: "Meta Tags", score: meta, max: 15 });

  var social = 0;
  social += 3;
  social += 3;
  if (seo.ogImage) social += 6;
  if (seo.twitterHandle) social += 3;
  social += 3;
  score += social;
  breakdown.push({ category: "Social Sharing", score: social, max: 15 });

  var schema = 0;
  schema += 4;
  schema += 4;
  schema += 4;
  if (seo.localBusiness && seo.localBusiness.latitude) schema += 4;
  var hasFaq = FB.state.blocks.some(function (b) {
    return b.type === "faq" && b.props.items && b.props.items.length;
  });
  if (hasFaq) schema += 4;
  var hasNav = FB.state.blocks.some(function (b) {
    return b.type === "nav" || b.type === "megaNav" || b.type === "slideNav";
  });
  if (hasNav) schema += 4;
  score += schema;
  breakdown.push({ category: "Structured Data", score: schema, max: 20 });

  var perf = 0;
  perf += 3;
  perf += 3;
  var domains = FB.export._extractDomains();
  if (domains.length > 0) perf += 3;
  perf += 3;
  perf += 3;
  score += perf;
  breakdown.push({ category: "Performance", score: perf, max: 15 });

  var a11y = 0;
  a11y += 3;
  a11y += 3;
  a11y += 3;
  a11y += 3;
  a11y += 3;
  score += a11y;
  breakdown.push({ category: "Accessibility", score: a11y, max: 15 });

  var intl = 0;
  if (seo.locale) intl += 5;
  if (seo.hreflang && seo.hreflang.length) intl += 5;
  score += intl;
  breakdown.push({ category: "International", score: intl, max: 10 });

  var img = 0;
  img += 5;
  img += 5;
  score += img;
  breakdown.push({ category: "Image Optimization", score: img, max: 10 });

  return { total: score, breakdown: breakdown };
};

FB.export.generateReact = function () {
  var componentName = "MyPage";
  var blockComponents = FB.state.blocks
    .filter(function (b) {
      return !b.parentId;
    })
    .map(function (b) {
      var p = b.props;
      switch (b.type) {
        case "nav":
          return (
            "  {/* Navigation */}\n  <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.2rem 3rem',background:'" +
            p.bg +
            "'}}>\n" +
            "    <div style={{fontFamily:\"'Lexend',sans-serif\",fontSize:'20px',fontWeight:800,color:'" +
            p.textColor +
            "'}}>{/* " +
            p.logoText +
            " */}</div>\n" +
            "    <div style={{display:'flex',gap:'2rem'}}>" +
            (p.links || [])
              .map(function (l) {
                return (
                  "<a href=\"#\" style={{color:'rgba(255,255,255,0.5)',textDecoration:'none',fontSize:'13px'}}>" +
                  l +
                  "</a>"
                );
              })
              .join("") +
            "</div>\n" +
            "    <button style={{background:'" +
            p.accentColor +
            "',color:'#111',padding:'6px 16px',fontSize:'12px',fontWeight:600,borderRadius:'2px',border:'none',cursor:'pointer'}}>" +
            p.ctaText +
            "</button>\n  </nav>"
          );
        case "hero":
          return (
            "  {/* Hero */}\n  <section style={{minHeight:'90vh',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'0 3rem 4rem',background:'" +
            p.bg +
            "'}}>\n" +
            "    <p style={{fontSize:'11px',letterSpacing:'4px',textTransform:'uppercase',color:'" +
            p.accentColor +
            "',marginBottom:'1.5rem'}}>" +
            p.eyebrow +
            "</p>\n" +
            "    <h1 style={{fontFamily:\"'Lexend',sans-serif\",fontSize:'clamp(3.5rem,8vw,7rem)',fontWeight:800,lineHeight:0.95,letterSpacing:'-3px',color:'#f7f6f2',marginBottom:'2rem'}} dangerouslySetInnerHTML={{__html: '" +
            p.headline.replace(/'/g, "\\'") +
            "'}} />\n" +
            "    <p style={{fontSize:'16px',fontWeight:300,lineHeight:1.7,color:'rgba(255,255,255,0.5)',maxWidth:'420px',marginBottom:'2.5rem'}}>" +
            p.subtext +
            "</p>\n" +
            "    <button style={{background:'" +
            p.accentColor +
            "',color:'#111',padding:'0.9rem 2.2rem',fontSize:'12px',fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',border:'none',borderRadius:'2px',cursor:'pointer'}}>" +
            p.ctaText +
            "</button>\n  </section>"
          );
        case "cta":
          return (
            "  {/* CTA */}\n  <section style={{background:'" +
            p.bg +
            "',padding:'5rem 3rem',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'2rem',flexWrap:'wrap'}}>\n" +
            "    <h2 style={{fontFamily:\"'Lexend',sans-serif\",fontSize:'clamp(2rem,5vw,4.5rem)',fontWeight:800,letterSpacing:'-2px',color:'" +
            p.textColor +
            "',lineHeight:1}} dangerouslySetInnerHTML={{__html: '" +
            p.headline.replace(/\n/g, "<br>").replace(/'/g, "\\'") +
            "'}} />\n" +
            "    <button style={{background:'#111',color:'#f7f6f2',padding:'1rem 2.5rem',fontSize:'12px',fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',border:'none',borderRadius:'2px',cursor:'pointer'}}>" +
            p.btnText +
            "</button>\n  </section>"
          );
        default:
          return "  {/* " + b.type + " block \u2014 add component here */}";
      }
    })
    .join("\n\n");

  return (
    "import React from 'react';\n\n" +
    "// Framework-style page \u2014 generated by Framework Builder\n" +
    "// Add this Google Font to your index.html:\n" +
    '// <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">\n\n' +
    "export default function " +
    componentName +
    "() {\n  return (\n" +
    "    <main style={{fontFamily:\"'Lexend',sans-serif\"}}>\n" +
    blockComponents +
    "\n    </main>\n  );\n}"
  );
};

FB.export.generateTypeScript = function () {
  var componentName = "MyPage";
  var blockComponents = FB.state.blocks
    .filter(function (b) {
      return !b.parentId;
    })
    .map(function (b) {
      var p = b.props;
      switch (b.type) {
        case "nav":
          return (
            "  {/* Navigation */}\n  <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.2rem 3rem',background:'" +
            p.bg +
            "'}}>\n" +
            "    <div style={{fontFamily:\"'Lexend',sans-serif\",fontSize:'20px',fontWeight:800,color:'" +
            p.textColor +
            "'}}>{/* " +
            p.logoText +
            " */}</div>\n" +
            "    <div style={{display:'flex',gap:'2rem'}}>" +
            (p.links || [])
              .map(function (l) {
                return (
                  "<a href=\"#\" style={{color:'rgba(255,255,255,0.5)',textDecoration:'none',fontSize:'13px'}}>" +
                  l +
                  "</a>"
                );
              })
              .join("") +
            "</div>\n" +
            "    <button style={{background:'" +
            p.accentColor +
            "',color:'#111',padding:'6px 16px',fontSize:'12px',fontWeight:600,borderRadius:'2px',border:'none',cursor:'pointer'}}>" +
            p.ctaText +
            "</button>\n  </nav>"
          );
        case "hero":
          return (
            "  {/* Hero */}\n  <section style={{minHeight:'90vh',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'0 3rem 4rem',background:'" +
            p.bg +
            "'}}>\n" +
            "    <p style={{fontSize:'11px',letterSpacing:'4px',textTransform:'uppercase',color:'" +
            p.accentColor +
            "',marginBottom:'1.5rem'}}>" +
            p.eyebrow +
            "</p>\n" +
            "    <h1 style={{fontFamily:\"'Lexend',sans-serif\",fontSize:'clamp(3.5rem,8vw,7rem)',fontWeight:800,lineHeight:0.95,letterSpacing:'-3px',color:'#f7f6f2',marginBottom:'2rem'}} dangerouslySetInnerHTML={{__html: '" +
            p.headline.replace(/'/g, "\\'") +
            "'}} />\n" +
            "    <p style={{fontSize:'16px',fontWeight:300,lineHeight:1.7,color:'rgba(255,255,255,0.5)',maxWidth:'420px',marginBottom:'2.5rem'}}>" +
            p.subtext +
            "</p>\n" +
            "    <button style={{background:'" +
            p.accentColor +
            "',color:'#111',padding:'0.9rem 2.2rem',fontSize:'12px',fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',border:'none',borderRadius:'2px',cursor:'pointer'}}>" +
            p.ctaText +
            "</button>\n  </section>"
          );
        case "cta":
          return (
            "  {/* CTA */}\n  <section style={{background:'" +
            p.bg +
            "',padding:'5rem 3rem',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'2rem',flexWrap:'wrap'}}>\n" +
            "    <h2 style={{fontFamily:\"'Lexend',sans-serif\",fontSize:'clamp(2rem,5vw,4.5rem)',fontWeight:800,letterSpacing:'-2px',color:'" +
            p.textColor +
            "',lineHeight:1}} dangerouslySetInnerHTML={{__html: '" +
            p.headline.replace(/\n/g, "<br>").replace(/'/g, "\\'") +
            "'}} />\n" +
            "    <button style={{background:'#111',color:'#f7f6f2',padding:'1rem 2.5rem',fontSize:'12px',fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',border:'none',borderRadius:'2px',cursor:'pointer'}}>" +
            p.btnText +
            "</button>\n  </section>"
          );
        default:
          return "  {/* " + b.type + " block \u2014 add component here */}";
      }
    })
    .join("\n\n");

  return (
    "import React from 'react';\n\n" +
    "type PageProps = {};\n\n" +
    "// Framework-style page \u2014 generated by Framework Builder\n" +
    "// Add this Google Font to your index.html:\n" +
    '// <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">\n\n' +
    "const " +
    componentName +
    ": React.FC<PageProps> = () => {\n  return (\n" +
    "    <main style={{fontFamily:\"'Lexend',sans-serif\"}}>\n" +
    blockComponents +
    "\n    </main>\n  );\n};\n\nexport default " +
    componentName +
    ";"
  );
};

FB.export.open = function (mode) {
  FB.export._mode = mode;
  // Restore modal body if template manager or settings replaced it
  var body = document.querySelector(".modal-body");
  if (body && !document.getElementById("code-output")) {
    body.innerHTML = '<pre class="code-output" id="code-output"></pre>';
  }
  // Restore modal tabs
  var tabs = document.getElementById("modal-tabs");
  if (tabs) tabs.style.display = "";
  document.getElementById("modal-overlay").classList.add("open");
  FB.export.generateCode(mode);
};

FB.export.close = function () {
  document.getElementById("modal-overlay").classList.remove("open");
};

FB.export.switchTab = function (mode) {
  FB.export._mode = mode;
  // Restore modal layout if settings/templates replaced it
  var body = document.querySelector(".modal-body");
  if (body && !document.getElementById("code-output")) {
    body.innerHTML = '<pre class="code-output" id="code-output"></pre>';
  }
  var tabs = document.getElementById("modal-tabs");
  if (tabs) tabs.style.display = "";
  document.querySelectorAll(".modal-tab").forEach(function (t) {
    t.classList.toggle("active", t.dataset.mode === mode);
  });
  FB.export.generateCode(mode);
};

FB.export.generateCode = function (mode) {
  var out = document.getElementById("code-output");
  if (!out) return;
  if (mode === "html") out.textContent = FB.export.generateHTML();
  else if (mode === "tsx") out.textContent = FB.export.generateTypeScript();
  else out.textContent = FB.export.generateReact();
};

FB.export.copyCode = function () {
  var out = document.getElementById("code-output");
  if (!out) return;
  navigator.clipboard.writeText(out.textContent).then(function () {
    FB.util.showToast("Copied to clipboard!");
  });
};

FB.export.downloadCode = function () {
  var out = document.getElementById("code-output");
  if (!out) return;
  var code = out.textContent;
  var ext =
    FB.export._mode === "html"
      ? "html"
      : FB.export._mode === "tsx"
        ? "tsx"
        : "jsx";
  var blob = new Blob([code], { type: "text/plain" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "my-site." + ext;
  a.click();
};
