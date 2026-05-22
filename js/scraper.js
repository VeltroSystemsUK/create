FB.scraper = {};

FB.scraper.importURL = function (url) {
  if (!url) {
    FB.util.showToast("Please enter a URL");
    return;
  }
  FB.util.showToast("Importing " + url + "...");
  FB.scraper._loading(true);

  fetch("/api/scrape", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: url }),
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      FB.scraper._loading(false);
      if (data.error) {
        FB.util.showToast("Import error: " + data.error);
        return;
      }
      if (data.html) {
        FB.scraper._parseHTML(data.html, data.markdown || null, url);
      } else if (data.markdown) {
        FB.scraper._parseMarkdown(data.markdown, url);
      } else {
        FB.util.showToast("No content returned");
      }
    })
    .catch(function (err) {
      FB.scraper._loading(false);
      FB.util.showToast(
        "Import failed. Check the server is running via ./start.sh",
      );
      console.error("Import error:", err);
    });
};

FB.scraper._loading = function (show) {
  var btn = document.getElementById("scrape-btn");
  if (btn) btn.textContent = show ? "Importing..." : "Import Web";
};

// ── HTML PARSER (preserves design/structure) ──

FB.scraper._parseHTML = function (rawHtml, fallbackMarkdown, sourceUrl) {
  FB.state.saveHistory();
  var blocks = [];
  var siteName = "";
  try {
    siteName = new URL(sourceUrl).hostname.replace("www.", "");
  } catch (_) {}

  // Parse HTML into a temp DOM tree
  var parser = document.createElement("div");
  parser.innerHTML = rawHtml;

  blocks.push({
    id: FB.state.genId(),
    type: "textBlock",
    props: {
      headline: "Imported: " + siteName,
      body:
        "Source: " +
        sourceUrl +
        "\nRecreated from scraped HTML. Edit and enhance with Framework blocks.",
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
      paddingV: 48,
      paddingH: 48,
    },
  });

  // Walk child elements and convert to blocks.
  // If top-level has < 3 children (common with wrapper divs), go one level
  // deeper to find semantic sections before giving up.
  var rawChildren = Array.from(parser.children);
  var children = rawChildren;
  if (rawChildren.length < 3) {
    var deeper = [];
    rawChildren.forEach(function (wrapper) {
      var subs = Array.from(
        wrapper.querySelectorAll(
          ":scope > section, :scope > article, :scope > header, :scope > footer, :scope > main, :scope > div[class]",
        ),
      );
      if (subs.length >= 2) {
        deeper = deeper.concat(subs);
      } else {
        deeper.push(wrapper);
      }
    });
    if (deeper.length >= 2) children = deeper;
  }
  var blockCount = 0;
  for (var ci = 0; ci < children.length && blockCount < 12; ci++) {
    var el = children[ci];
    var tag = el.tagName ? el.tagName.toLowerCase() : "";
    var block = FB.scraper._elementToBlock(el, tag, siteName);
    if (block) {
      blocks.push(block);
      blockCount++;
    }
  }

  // If no blocks from HTML, try markdown as fallback
  if (blocks.length <= 1 && fallbackMarkdown) {
    FB.scraper._parseMarkdown(fallbackMarkdown, sourceUrl);
    return;
  }

  // Add footer
  blocks.push({
    id: FB.state.genId(),
    type: "footer",
    props: {
      logoText: siteName || "Imported Site",
      tagline: "Imported via Firecrawl \u00B7 Edit freely",
      cols: [
        {
          heading: "Source",
          links: [sourceUrl, "Rebuilt with Framework Builder"],
        },
        {
          heading: "Edit",
          links: ["Add blocks", "Change colors", "Export code"],
        },
      ],
      copyright:
        "\u00A9 " + new Date().getFullYear() + " Imported via Firecrawl",
      bg: "#111111",
      accentColor: "#CDFE00",
    },
  });

  blocks.forEach(function (b) {
    FB.state.blocks.push(b);
  });
  FB.canvas.render();
  FB.util.showToast(
    "Imported " + (blocks.length - 2) + " sections from " + siteName,
  );
  FB.export.close();
};

FB.scraper._getStyle = function (el, prop) {
  var v = el.style ? el.style[prop] : "";
  if (v && v !== "normal" && v !== "none" && v !== "0px") return v;
  return "";
};

FB.scraper._extractText = function (el) {
  var text = el.textContent || "";
  return text.replace(/\s+/g, " ").trim().substring(0, 600);
};

FB.scraper._findHeading = function (el) {
  var h = el.querySelector("h1, h2, h3, h4");
  return h ? h.textContent.replace(/\s+/g, " ").trim() : "";
};

FB.scraper._elementToBlock = function (el, tag, siteName) {
  var style = el.style || {};
  var bg = FB.scraper._getStyle(el, "backgroundColor") || "";
  var color = FB.scraper._getStyle(el, "color") || "";
  var textAlign = FB.scraper._getStyle(el, "textAlign") || "";
  var padding = FB.scraper._getStyle(el, "padding") || "";
  var fontWeight = FB.scraper._getStyle(el, "fontWeight") || "";
  var fontSize = FB.scraper._getStyle(el, "fontSize") || "";

  // Detect if this is navigation-like
  var hasNavLinks =
    el.querySelectorAll("a[href]").length > 3 &&
    el.querySelectorAll("a[href]").length >
      el.querySelectorAll("p, h1, h2, h3, h4, h5, h6").length;

  // Detect if this is footer-like
  var isFooter =
    tag === "footer" ||
    (el.querySelectorAll("a").length > 5 &&
      el.textContent.length > 100 &&
      !hasNavLinks);

  // Detect if contains images
  var imgs = el.querySelectorAll("img");
  var hasImage = imgs.length > 0;

  // Extract heading
  var heading = FB.scraper._findHeading(el);
  var body = FB.scraper._extractText(el);

  // Clean up
  if (body.length > 800) body = body.substring(0, 800) + "...";

  // Strip transparent/inherited values — they render as invisible on canvas
  if (
    bg === "rgba(0, 0, 0, 0)" ||
    bg === "transparent" ||
    bg === "initial" ||
    bg === "inherit"
  )
    bg = "";
  if (
    color === "rgba(0, 0, 0, 0)" ||
    color === "transparent" ||
    color === "initial" ||
    color === "inherit"
  )
    color = "";

  // Calculate accent from existing style
  var accent = bg ? bg : color ? color : "#CDFE00";

  // Map tag name to block type
  if (isFooter) {
    var links = [];
    el.querySelectorAll("a").forEach(function (a) {
      var t = a.textContent.trim();
      if (t) links.push(t);
    });
    return {
      id: FB.state.genId(),
      type: "footer",
      props: {
        logoText: heading || siteName || "Footer",
        tagline: body.substring(0, 100),
        cols: [
          { heading: "Links", links: links.slice(0, 8) },
          { heading: "Info", links: ["Edit in Framework Builder"] },
        ],
        copyright: "\u00A9 " + new Date().getFullYear(),
        bg: bg || "#111111",
        accentColor: accent || "#CDFE00",
      },
    };
  }

  if (hasNavLinks) {
    var navLinks = [];
    el.querySelectorAll("a[href]").forEach(function (a) {
      var t = a.textContent.trim();
      if (t && navLinks.length < 6) navLinks.push(t);
    });
    return {
      id: FB.state.genId(),
      type: "nav",
      props: {
        logoText: heading || siteName || "Site",
        links: navLinks,
        ctaText: "Get Started",
        bg: bg || "#111111",
        textColor: color || "#ffffff",
        accentColor: accent || "#CDFE00",
      },
    };
  }

  // Hero-like sections have big text, heading, maybe image
  // Hero: only for explicit header elements or big-font headings \u2014 not every section.
  // Always dark bg because the hero CSS text colours are hardcoded light.
  var isHero =
    tag === "header" ||
    (heading && (fontSize.indexOf("clamp") > -1 || parseInt(fontSize) > 24));
  if (isHero) {
    var heroBg =
      bg && bg !== "#ffffff" && bg !== "rgb(255, 255, 255)" ? bg : "#111111";
    return {
      id: FB.state.genId(),
      type: "hero",
      props: {
        eyebrow: "",
        headline: heading || "Imported Section",
        subtext: body.substring(0, 300),
        ctaText: "Learn more \u2192",
        bg: heroBg,
        textColor: "#f7f6f2",
        accentColor: "#CDFE00",
        showBlob: !bg,
      },
    };
  }

  // Image-heavy section
  if (hasImage && heading) {
    return {
      id: FB.state.genId(),
      type: "textBlock",
      props: {
        headline: heading,
        body: body.substring(0, 300),
        bg: bg || "#ffffff",
        textColor: color || "#111111",
        accentColor: accent || "#CDFE00",
        paddingV: 48,
        paddingH: 48,
      },
    };
  }

  // Feature-like / card grid sections
  var childDivs = el.querySelectorAll("> div, > article, > li");
  if (childDivs.length >= 3) {
    var items = [];
    childDivs.forEach(function (cd) {
      var ch = FB.scraper._findHeading(cd);
      var cb = FB.scraper._extractText(cd).substring(0, 100);
      if (ch)
        items.push({ icon: "\u2726", title: ch, desc: cb || "Edit this item" });
    });
    if (items.length > 0) {
      return {
        id: FB.state.genId(),
        type: "features",
        props: {
          label: heading || "Features",
          headline: "What we offer",
          items: items.slice(0, 6),
          bg: bg || "#ffffff",
          textColor: color || "#111111",
          accentColor: accent || "#CDFE00",
        },
      };
    }
  }

  // Default: textBlock with extracted styling
  return {
    id: FB.state.genId(),
    type: "textBlock",
    props: {
      headline: heading || "Content",
      body: body || "Edit this content",
      bg: bg || "#ffffff",
      textColor: color || "#111111",
      accentColor: accent || "#CDFE00",
      paddingV: 48,
      paddingH: 48,
    },
  };
};

// ── MARKDOWN PARSER (structure-aware block detection) ──

FB.scraper._parseMarkdown = function (markdown, sourceUrl) {
  FB.state.saveHistory();
  var siteName = "";
  try {
    siteName = new URL(sourceUrl).hostname.replace("www.", "");
  } catch (_) {}

  // Helper: extract clean text (strip markdown syntax)
  function cleanText(t) {
    return t
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // strip images entirely — alt text is useless noise
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → display text only
      .replace(/[*_~`#>|]/g, "") // markdown syntax chars
      .replace(/\s+/g, " ")
      .trim();
  }
  function isLink(l) {
    return /\[([^\]]+)\]\([^)]+\)/.test(l);
  }
  function isImage(l) {
    return /!\[([^\]]*)\]\([^)]+\)/.test(l);
  }
  function extractLinks(t) {
    var r = [];
    t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (m, text) {
      r.push(text);
    });
    return r;
  }
  function extractImages(t) {
    var r = [];
    t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (m, a, s) {
      r.push({ alt: a, src: s });
    });
    return r;
  }

  var blocks = [];
  var rawLines = markdown.split("\n");
  var sections = [];
  var currentSec = { heading: "", lines: [] };

  // Split markdown into sections by headings, HR dividers, and substantial blank gaps.
  // Blank lines only split when both the current section AND the upcoming content
  // each have ≥ 3 lines — prevents nav links / single callouts becoming solo blocks.
  for (var i = 0; i < rawLines.length; i++) {
    var line = rawLines[i];
    var trimmed = line.trim();
    // Heading starts a new section
    if (/^#{1,6}\s/.test(trimmed)) {
      if (currentSec.lines.length > 0 || currentSec.heading)
        sections.push(currentSec);
      currentSec = {
        heading: trimmed
          .replace(/^#+\s*/, "")
          .replace(/\*+/g, "")
          .trim(),
        lines: [],
      };
      continue;
    }
    // HR dividers split sections
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      if (currentSec.lines.length > 0 || currentSec.heading) {
        sections.push(currentSec);
        currentSec = { heading: "", lines: [] };
      }
      continue;
    }
    // Blank line: only split if current section has ≥ 3 lines AND
    // there are ≥ 3 more non-empty lines before the next heading/HR.
    if (trimmed === "" && currentSec.lines.length >= 3) {
      var nextCount = 0;
      for (var j = i + 1; j < rawLines.length; j++) {
        var nt = rawLines[j].trim();
        if (!nt) continue;
        if (
          /^#{1,6}\s/.test(nt) ||
          nt === "---" ||
          nt === "***" ||
          nt === "___"
        )
          break;
        nextCount++;
        if (nextCount >= 3) break;
      }
      if (nextCount >= 3) {
        sections.push(currentSec);
        currentSec = { heading: "", lines: [] };
        continue;
      }
    }
    if (trimmed) {
      currentSec.lines.push(trimmed);
    }
  }
  if (currentSec.lines.length > 0) sections.push(currentSec);

  // Header block
  blocks.push({
    id: FB.state.genId(),
    type: "textBlock",
    props: {
      headline: "Imported: " + siteName,
      body: "Source: " + sourceUrl,
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
      paddingV: 48,
      paddingH: 48,
    },
  });

  // Classify each section
  for (var si = 0; si < sections.length && blocks.length < 16; si++) {
    var sec = sections[si];
    var text = sec.lines.join("\n");
    var links = extractLinks(text);
    var images = extractImages(text);
    var hasHeading = !!sec.heading;
    var linkCount = links.length;
    var imageCount = images.length;
    var totalLines = sec.lines.length;
    var longText = text.length > 200;

    // Detect: FOOTER (copyright + many links, typically at the end)
    if (
      (text.indexOf("\u00A9") > -1 ||
        text.toLowerCase().indexOf("copyright") > -1 ||
        text.toLowerCase().indexOf("all rights") > -1) &&
      linkCount > 2
    ) {
      var fLinks = links.slice(0, 8);
      blocks.push({
        id: FB.state.genId(),
        type: "footer",
        props: {
          logoText: siteName,
          tagline: "Imported site",
          cols: [
            { heading: "Links", links: fLinks },
            { heading: "Info", links: ["Edit in Framework Builder"] },
          ],
          copyright: "\u00A9 " + new Date().getFullYear(),
          bg: "#111111",
          accentColor: "#CDFE00",
        },
      });
      continue;
    }

    // Detect: NAV (mostly links, few images, no long text)
    if (linkCount >= 4 && !longText && imageCount === 0) {
      blocks.push({
        id: FB.state.genId(),
        type: "nav",
        props: {
          logoText: siteName,
          links: links.slice(0, 6),
          ctaText: "Get Started",
          bg: "#111111",
          textColor: "#ffffff",
          accentColor: "#CDFE00",
        },
      });
      continue;
    }

    // Detect: HERO (heading + short body + CTA links)
    if (hasHeading && totalLines <= 5 && (linkCount >= 1 || imageCount >= 1)) {
      var subtext = cleanText(text).replace(sec.heading, "").trim();
      var cta = links.length > 0 ? links[0] : "Learn more";
      blocks.push({
        id: FB.state.genId(),
        type: "hero",
        props: {
          eyebrow: "",
          headline: sec.heading,
          subtext: subtext.substring(0, 300),
          ctaText: cta + " \u2192",
          bg: "#ffffff",
          accentColor: "#CDFE00",
          showBlob: false,
        },
      });
      continue;
    }

    // Detect: IMAGE GALLERY (mostly images) — skip if no readable text
    if (imageCount >= 3) {
      var galleryText = cleanText(text);
      if (galleryText.length < 30 && !sec.heading) continue;
      blocks.push({
        id: FB.state.genId(),
        type: "textBlock",
        props: {
          headline: sec.heading || "Gallery",
          body: galleryText.substring(0, 1500),
          bg: "#ffffff",
          textColor: "#111111",
          accentColor: "#CDFE00",
          paddingV: 48,
          paddingH: 48,
        },
      });
      continue;
    }

    // Detect: FEATURES GRID (multiple short lines with links or bold items)
    var shortItems = sec.lines.filter(function (l) {
      var c = cleanText(l);
      return (
        c.length > 5 &&
        c.length < 120 &&
        (l.indexOf("*") > -1 || l.indexOf("[") > -1)
      );
    });
    if (shortItems.length >= 3 && (linkCount >= 3 || imageCount >= 2)) {
      var items = [];
      shortItems.slice(0, 6).forEach(function (l) {
        var c = cleanText(l);
        var img = extractImages(l);
        items.push({
          icon: img.length > 0 ? "\uD83D\uDDBC" : "\u2726",
          title: c.substring(0, 60),
          desc: "",
        });
      });
      blocks.push({
        id: FB.state.genId(),
        type: "features",
        props: {
          label: sec.heading || "Highlights",
          headline: "Key features",
          items: items,
          bg: "#ffffff",
          textColor: "#111111",
          accentColor: "#CDFE00",
        },
      });
      continue;
    }

    // Detect: CTA / BUTTON (mostly action links, little text)
    if (linkCount >= 2 && totalLines <= 4 && !longText) {
      blocks.push({
        id: FB.state.genId(),
        type: "cta",
        props: {
          headline: sec.heading || "Get started today",
          btnText: links[0] + " \u2192",
          bg: "#111111",
          textColor: "#ffffff",
        },
      });
      continue;
    }

    // Default: TEXT BLOCK
    // Clean raw markdown syntax from body before rendering
    var cleanBody = cleanText(text).substring(0, 2000);
    // Skip sections with no meaningful content (images-only, nav fragments, etc.)
    if (cleanBody.length < 30 && !sec.heading) continue;
    if (sec.heading || cleanBody.length > 30) {
      blocks.push({
        id: FB.state.genId(),
        type: "textBlock",
        props: {
          headline: sec.heading || "Content",
          body: cleanBody,
          bg: "#ffffff",
          textColor: "#111111",
          accentColor: "#CDFE00",
          paddingV: 48,
          paddingH: 48,
        },
      });
    }
  }

  // Ensure we have at least some content
  if (blocks.length <= 1) {
    blocks.push({
      id: FB.state.genId(),
      type: "textBlock",
      props: {
        headline: "Scraped Content",
        body: markdown.substring(0, 3000),
        bg: "#ffffff",
        textColor: "#111111",
        paddingV: 48,
        paddingH: 48,
      },
    });
  }

  // Add footer if not already detected
  var hasFooter = blocks.some(function (b) {
    return b.type === "footer";
  });
  if (!hasFooter) {
    blocks.push({
      id: FB.state.genId(),
      type: "footer",
      props: {
        logoText: siteName || "Imported Site",
        tagline: "Imported via Firecrawl",
        cols: [
          {
            heading: "Source",
            links: [sourceUrl, "Rebuilt with Framework Builder"],
          },
          {
            heading: "Edit",
            links: ["Add blocks", "Change colors", "Export code"],
          },
        ],
        copyright: "\u00A9 " + new Date().getFullYear(),
        bg: "#111111",
        accentColor: "#CDFE00",
      },
    });
  }

  blocks.forEach(function (b) {
    FB.state.blocks.push(b);
  });
  FB.canvas.render();
  FB.util.showToast(
    "Imported " + (blocks.length - 2) + " sections from " + siteName,
  );
  FB.export.close();
};

// ── AI IMPORT ──

FB.scraper.aiImport = function (url, apiKey, provider) {
  FB.util.showToast("AI importing " + url + "...");
  FB.scraper._loading(true);

  fetch("/api/ai-import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: url,
      apiKey: apiKey,
      provider: provider || "anthropic",
    }),
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      FB.scraper._loading(false);
      if (data.error) {
        FB.util.showToast("AI import error: " + data.error);
        return;
      }
      if (!data.blocks || !data.blocks.length) {
        FB.util.showToast("No blocks generated");
        return;
      }
      // Store API key for reuse
      localStorage.setItem("fb-ai-key", apiKey);
      localStorage.setItem("fb-ai-provider", provider || "anthropic");

      // Create blocks on canvas
      FB.state.saveHistory();
      data.blocks.forEach(function (b) {
        var type = b.type;
        var props = b.props || {};
        function esc(s) {
          return String(s || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        }
        if (type === "hero") {
          props.eyebrow = esc(
            props.eyebrow || props.tagline || props.subtitle || "",
          );
          props.headline = esc(props.headline || props.title || "Welcome");
          props.subtext = esc(
            props.subtext || props.description || props.body || "",
          );
          props.ctaText = esc(
            props.ctaText || props.cta || props.button || "Learn more →",
          );
          props.bg = props.bg || "#ffffff";
          props.textColor = props.textColor || "#111111";
          props.accentColor = props.accentColor || "#CDFE00";
          props.showBlob = false;
        } else if (type === "textBlock" || type === "colorBlock") {
          props.headline = esc(props.headline || props.title || "Content");
          props.body = esc(props.body || props.description || props.text || "");
          props.bg = props.bg || "#ffffff";
          props.textColor = props.textColor || "#111111";
          props.paddingV = props.paddingV || 48;
          props.paddingH = props.paddingH || 48;
        } else if (type === "features") {
          props.label = props.label || "Features";
          props.headline = esc(
            props.headline || props.title || "What we offer",
          );
          props.items = (props.items || []).slice(0, 6).map(function (it) {
            return {
              icon: it.icon || "✦",
              title: esc(it.title || it.name || "Item"),
              desc: esc(it.desc || it.description || ""),
            };
          });
          props.bg = props.bg || "#ffffff";
          props.textColor = props.textColor || "#111111";
          props.accentColor = props.accentColor || "#CDFE00";
        } else if (type === "nav") {
          props.links = (props.links || []).slice(0, 6);
          props.logoText = esc(props.logoText || "Site");
          props.bg = props.bg || "#111111";
          props.textColor = props.textColor || "#fff";
          props.accentColor = props.accentColor || "#CDFE00";
        } else if (type === "footer") {
          props.cols = props.cols || [{ heading: "Links", links: ["Edit me"] }];
          props.bg = props.bg || "#111111";
          props.accentColor = props.accentColor || "#CDFE00";
          props.textColor = props.textColor || "#fff";
        } else if (type === "cta") {
          props.headline = esc(props.headline || props.title || "Get started");
          props.btnText = esc(
            props.btnText || props.cta || props.button || "Go →",
          );
          props.bg = props.bg || "#111111";
          props.textColor = props.textColor || "#fff";
        } else if (type === "stats") {
          props.stats = (props.stats || []).slice(0, 4);
          props.bg = props.bg || "#1a1a2e";
          props.accentColor = props.accentColor || "#CDFE00";
        } else if (type === "testimonial") {
          props.quote = esc(props.quote || props.body || "Great work");
          props.attribution = esc(
            props.attribution || props.author || "Client",
          );
          props.bg = props.bg || "#1a1a2e";
          props.accentColor = props.accentColor || "#CDFE00";
        }
        if (!props.textColor) props.textColor = "#111111";
        var block = {
          id: FB.state.genId(),
          type: type,
          props: props,
        };
        FB.state.blocks.push(block);
      });
      FB.canvas.render();
      // Reveal hero words for AI-imported blocks
      setTimeout(function () {
        document.querySelectorAll(".fw-hero-word").forEach(function (el, i) {
          setTimeout(function () {
            el.classList.add("revealed");
          }, i * 80);
        });
      }, 100);
      FB.util.showToast(
        "AI imported " +
          data.blocks.length +
          " blocks from " +
          (data.siteName || url),
      );
      FB.export.close();
    })
    .catch(function (err) {
      FB.scraper._loading(false);
      FB.util.showToast("AI import failed: " + err.message);
    });
};

FB.scraper.openAiImport = function () {
  var savedKey = localStorage.getItem("fb-ai-key") || "";
  var savedProvider = localStorage.getItem("fb-ai-provider") || "anthropic";

  var html =
    '<div class="modal-head"><h3>AI Import</h3><button class="modal-close" onclick="FB.export.close()">\u2715</button></div>' +
    '<div style="padding:24px;display:flex;flex-direction:column;gap:16px">' +
    '<p style="font-size:13px;color:var(--text-muted);line-height:1.6">Enter a URL and your AI API key. The AI will analyze the scraped content and generate Framework Builder blocks that recreate the page design.</p>' +
    '<input type="url" id="ai-import-url" placeholder="https://example.com" value="" style="width:100%;padding:10px 14px;background:var(--surface-1);border:1px solid var(--border);border-radius:6px;color:var(--text-primary);font-size:14px;font-family:inherit;box-sizing:border-box" />' +
    '<select id="ai-import-provider" style="width:100%;padding:10px 14px;background:var(--surface-1);border:1px solid var(--border);border-radius:6px;color:var(--text-primary);font-size:13px;font-family:inherit">' +
    '<option value="anthropic"' +
    (savedProvider === "anthropic" ? " selected" : "") +
    ">Anthropic Claude</option>" +
    '<option value="openai"' +
    (savedProvider === "openai" ? " selected" : "") +
    ">OpenAI GPT-4o</option>" +
    '<option value="gemini"' +
    (savedProvider === "gemini" ? " selected" : "") +
    ">Google Gemini</option>" +
    "</select>" +
    '<input type="password" id="ai-import-key" placeholder="API Key" value="' +
    savedKey +
    '" style="width:100%;padding:10px 14px;background:var(--surface-1);border:1px solid var(--border);border-radius:6px;color:var(--text-primary);font-size:13px;font-family:inherit;box-sizing:border-box" />' +
    '<div style="display:flex;gap:8px">' +
    '<button class="tb-export" id="ai-import-btn" onclick="var url=document.getElementById(\'ai-import-url\').value;var key=document.getElementById(\'ai-import-key\').value;var prov=document.getElementById(\'ai-import-provider\').value;FB.scraper.aiImport(url,key,prov)" style="flex:1;justify-content:center">AI Import</button>' +
    '<button class="tb-btn" onclick="FB.export.close()" style="flex:0">Cancel</button></div>' +
    '<div style="font-size:11px;color:var(--text-muted);padding:8px;background:var(--surface-1);border-radius:4px;line-height:1.5">Your API key is sent directly to the AI provider and is not stored on our server. It is saved locally in your browser for reuse. The AI is prompted to analyze the page structure and generate appropriate Framework Builder blocks (Nav, Hero, Features, Grids, Footer, etc).</div>' +
    "</div>";

  var mt = document.getElementById("modal-title");
  if (mt) mt.textContent = "AI Import";
  var tabs = document.getElementById("modal-tabs");
  if (tabs) tabs.style.display = "none";
  var co = document.getElementById("code-output");
  if (co && co.parentElement) co.parentElement.innerHTML = html;
  document.getElementById("modal-overlay").classList.add("open");
};

FB.scraper.openImportDialog = function () {
  var html =
    '<div class="modal-head"><h3>Import Website</h3><button class="modal-close" onclick="FB.export.close()">\u2715</button></div>' +
    '<div style="padding:24px;display:flex;flex-direction:column;gap:16px">' +
    '<p style="font-size:13px;color:var(--text-muted);line-height:1.6">Enter a URL to scrape. The page will be parsed into editable blocks preserving design where possible. Powered by Firecrawl.</p>' +
    '<input type="url" id="import-url" placeholder="https://example.com" style="width:100%;padding:10px 14px;background:var(--surface-1);border:1px solid var(--border);border-radius:6px;color:var(--text-primary);font-size:14px;font-family:inherit;box-sizing:border-box" />' +
    '<div style="display:flex;gap:8px">' +
    '<button class="tb-export" id="scrape-btn" onclick="var url=document.getElementById(\'import-url\').value;FB.scraper.importURL(url)" style="flex:1;justify-content:center">Import Web</button>' +
    '<button class="tb-btn" onclick="FB.export.close()" style="flex:0">Cancel</button></div>' +
    '<div style="font-size:11px;color:var(--text-muted);padding:8px;background:var(--surface-1);border-radius:4px;line-height:1.5">The importer extracts sections, colors, headings, links, and images from the HTML. Navigation and footer sections are detected automatically. Elements map to Framework block types (Nav, Hero, Features, Text, Footer) with their original background colors preserved.</div>' +
    "</div>";

  var mt = document.getElementById("modal-title");
  if (mt) mt.textContent = "Import Website";
  var tabs = document.getElementById("modal-tabs");
  if (tabs) tabs.style.display = "none";
  var co = document.getElementById("code-output");
  if (co && co.parentElement) co.parentElement.innerHTML = html;
  document.getElementById("modal-overlay").classList.add("open");
};
