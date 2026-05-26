FB.canvas = {};

FB.canvas.renderBlockHTML = function (block) {
  if (FB.widgets.get(block.type)) {
    return (
      '<div class="fw-widget fw-widget-' +
      block.type +
      '">' +
      FB.widgets.render(
        block.type,
        Object.assign({}, block.props, { _blockId: block.id }),
      ) +
      "</div>"
    );
  }
  var p = block.props;

  FB.canvas.renderTrustPillInline = function (p) {
    var stars = "";
    for (var i = 0; i < (p.ratingCount || 5); i++) {
      stars +=
        '<svg class="fw-star" viewBox="0 0 24 24" fill="' +
        (p.starColor || "#FFD700") +
        '" style="width:16px;height:16px"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.851 1.416 8.26L12 18.902l-7.416 4.957L6 15.599 0 9.748l8.332-1.73z"/></svg>';
    }
    return (
      '<div class="fw-trust-pill" style="background:rgba(255,255,255,0.05);color:' +
      (p.textColor || "#fff") +
      '">' +
      '<div class="fw-trust-stars">' +
      stars +
      "</div>" +
      '<div class="fw-trust-text"><div class="fw-trust-platform">' +
      (p.ratingText || "") +
      "</div>" +
      '<div class="fw-trust-verified">' +
      (p.verifiedDate || "") +
      "</div></div></div>"
    );
  };

  switch (block.type) {
    case "nav":
      return (
        '<nav class="fw-nav-block" style="background:' +
        p.bg +
        '">' +
        '<div class="fw-nav-logo fw-nav-entrance fw-nav-entrance-d1" style="color:' +
        p.textColor +
        '">' +
        (p.logoImage
          ? '<img src="' +
            p.logoImage +
            '" alt="' +
            (p.logoText || "") +
            '" style="max-height:36px;width:auto;display:block">'
          : '<span contenteditable data-field="logoText">' +
            p.logoText +
            "</span>") +
        "</div>" +
        '<ul class="fw-nav-links fw-nav-entrance fw-nav-entrance-d2">' +
        (p.links || [])
          .map(function (l) {
            return '<li><a href="#">' + l + "</a></li>";
          })
          .join("") +
        "</ul>" +
        '<button class="fw-nav-cta fw-nav-entrance fw-nav-entrance-d3" style="background:' +
        p.accentColor +
        '">' +
        p.ctaText +
        "</button></nav>"
      );

    case "hero":
      var words = (p.headline || "").split(" ");
      var wordHtml = words
        .map(function (w, i) {
          return (
            '<span class="fw-hero-word" style="transition-delay:' +
            i * 80 +
            'ms">' +
            w +
            "</span>"
          );
        })
        .join(" ");
      return (
        '<div class="fw-hero-block" style="background:' +
        p.bg +
        '">' +
        (p.blobStyle === "blob" && p.showBlob
          ? '<div class="fw-hero-blob"></div>'
          : "") +
        (p.blobStyle === "orbs"
          ? '<div class="fw-orb" style="width:30%;height:45%;left:10%;top:10%;background:#4b858e;opacity:0.6"></div><div class="fw-orb" style="width:20%;height:35%;left:60%;top:50%;background:#d31468;opacity:0.5"></div>'
          : "") +
        (p.blobStyle === "gradient"
          ? '<div style="position:absolute;inset:0;background:linear-gradient(135deg,' +
            p.accentColor +
            '22,transparent)"></div>'
          : "") +
        (p.blobStyle === "video"
          ? '<video class="fw-video-bg" autoplay muted loop playsinline><source src="' +
            (p.videoUrl || "") +
            '" type="video/webm"></video><div class="fw-video-overlay" style="background:#000;opacity:0.5"></div>'
          : "") +
        '<p class="fw-hero-eyebrow" style="color:' +
        p.accentColor +
        '" contenteditable data-field="eyebrow">' +
        p.eyebrow +
        "</p>" +
        '<h1 class="fw-hero-h1" contenteditable data-field="headline">' +
        wordHtml +
        "</h1>" +
        '<p class="fw-hero-sub" contenteditable data-field="subtext">' +
        p.subtext +
        "</p>" +
        '<button class="fw-hero-cta" style="background:' +
        p.accentColor +
        '" contenteditable data-field="ctaText">' +
        p.ctaText +
        "</button>" +
        '<div class="fw-scroll-indicator" style="color:' +
        p.textColor +
        '"><span style="font-size:11px;letter-spacing:2px;text-transform:uppercase">Scroll</span><div class="fw-scroll-line"></div></div></div>'
      );

    case "marquee":
      var mItems = (p.items || [])
        .map(function (i) {
          return (
            '<span class="fw-marquee-item" style="color:' +
            p.textColor +
            '">' +
            i +
            " \u2726</span>"
          );
        })
        .join("");
      return (
        '<div class="fw-marquee-block" style="background:' +
        p.bg +
        '">' +
        '<div class="fw-marquee-inner" style="animation-duration:' +
        (p.speed || 16) +
        's">' +
        mItems +
        mItems +
        "</div></div>"
      );

    case "work":
      var cards = (p.cards || [])
        .map(function (c) {
          return (
            '<div class="fw-work-card">' +
            '<div class="fw-work-card-bg" style="background:' +
            c.bg +
            '"></div>' +
            '<div class="fw-work-card-overlay">' +
            '<div class="fw-work-card-tag" style="color:' +
            p.accentColor +
            '">' +
            c.tag +
            "</div>" +
            '<div class="fw-work-card-title">' +
            c.title +
            "</div></div></div>"
          );
        })
        .join("");
      return (
        '<div class="fw-work-block fw-entrance" style="background:' +
        p.bg +
        '">' +
        '<div class="fw-work-label" contenteditable data-field="label">' +
        p.label +
        "</div>" +
        '<h2 class="fw-work-h2" contenteditable data-field="headline">' +
        p.headline +
        "</h2>" +
        '<div class="fw-work-grid">' +
        cards +
        "</div></div>"
      );

    case "services":
      var sRows = (p.services || [])
        .map(function (s) {
          return (
            '<div class="fw-service-row">' +
            '<span class="fw-service-num">' +
            s.num +
            "</span>" +
            '<span class="fw-service-name">' +
            s.name +
            "</span>" +
            '<span class="fw-service-arrow">\u2192</span></div>'
          );
        })
        .join("");
      return (
        '<div class="fw-services-block fw-entrance" style="background:' +
        p.bg +
        '">' +
        '<div class="fw-services-inner"><div>' +
        '<div class="fw-services-label" contenteditable data-field="label">' +
        (p.label || "What we do.") +
        "</div>" +
        '<h2 class="fw-services-h2" contenteditable data-field="headline">' +
        (p.headline || "Our services.").replace(/\n/, "<br>") +
        "</h2>" +
        '<p class="fw-services-desc" contenteditable data-field="description">' +
        (p.description || "Expert solutions tailored for your success.") +
        "</p></div>" +
        '<div class="fw-services-list">' +
        sRows +
        "</div></div></div>"
      );

    case "stats":
      var sCells = (p.stats || [])
        .map(function (s) {
          return (
            '<div class="fw-stat-cell"><div class="fw-stat-num">' +
            s.num +
            '</div><div class="fw-stat-label">' +
            s.label +
            "</div></div>"
          );
        })
        .join("");
      return (
        '<div class="fw-stats-block fw-entrance" style="background:' +
        p.bg +
        '"><div class="fw-stats-grid">' +
        sCells +
        "</div></div>"
      );

    case "testimonial":
      return (
        '<div class="fw-testimonial-block fw-entrance" style="background:' +
        p.bg +
        '">' +
        '<div class="fw-testimonial-inner">' +
        '<div class="fw-testimonial-slide active">' +
        '<div class="fw-testimonial-img"><div class="fw-testimonial-img-name">Client.</div></div>' +
        '<div><span class="fw-quote-mark" style="color:' +
        p.accentColor +
        '">\u201C</span>' +
        '<p class="fw-quote-text" contenteditable data-field="quote">' +
        p.quote +
        "</p>" +
        '<p class="fw-quote-attr" contenteditable data-field="attribution">' +
        p.attribution +
        "</p></div></div>" +
        '<div class="fw-testimonial-dots" style="display:flex;gap:8px;justify-content:center;margin-top:1.5rem">' +
        '<span class="fw-t-dot active" style="width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.3);cursor:pointer;transition:all 0.3s"></span>' +
        "</div></div></div>"
      );

    case "process":
      var pSteps = (p.steps || [])
        .map(function (s) {
          return (
            '<div class="fw-process-step">' +
            '<div class="fw-step-num">' +
            s.num +
            "</div>" +
            '<div class="fw-step-title">' +
            s.title +
            "</div>" +
            '<div class="fw-step-desc">' +
            s.desc +
            "</div></div>"
          );
        })
        .join("");
      return (
        '<div class="fw-process-block fw-entrance" style="background:' +
        p.bg +
        '">' +
        '<div class="fw-process-label" contenteditable data-field="label">' +
        p.label +
        "</div>" +
        '<h2 class="fw-process-h2" contenteditable data-field="headline">' +
        (p.headline || "How it works.").replace(/\n/, "<br>") +
        "</h2>" +
        '<div class="fw-process-steps">' +
        pSteps +
        "</div></div>"
      );

    case "cta":
      var ctaBtn =
        p.buttonStyle === "filled"
          ? '<button class="fw-cta-btn" style="background:' +
            p.accentColor +
            '" contenteditable data-field="btnText">' +
            p.btnText +
            "</button>"
          : p.buttonStyle === "outlined"
            ? '<button class="fw-cta-btn" style="background:transparent;border:2px solid ' +
              p.accentColor +
              ";color:" +
              p.textColor +
              '" contenteditable data-field="btnText">' +
              p.btnText +
              "</button>"
            : p.buttonStyle === "floating-pulse"
              ? '<button class="fw-cta-btn" style="background:' +
                p.accentColor +
                ';position:fixed;bottom:2rem;right:2rem;width:80px;height:80px;border-radius:50%;animation:fb-pulse 2s infinite;z-index:100" contenteditable data-field="btnText">' +
                p.btnText +
                "</button>"
              : '<button class="fw-cta-btn" style="background:' +
                p.accentColor +
                '" contenteditable data-field="btnText">' +
                p.btnText +
                '</button><button class="fw-cta-btn" style="background:transparent;border:2px solid ' +
                p.accentColor +
                ";color:" +
                p.textColor +
                ';margin-left:1rem">Learn More</button>';
      return (
        '<div class="fw-cta-block fw-entrance" style="background:' +
        p.bg +
        '">' +
        '<h2 class="fw-cta-h2" style="color:' +
        p.textColor +
        '" contenteditable data-field="headline">' +
        (p.headline || "Ready to get started?").replace(/\n/, "<br>") +
        "</h2>" +
        ctaBtn +
        "</div>"
      );

    case "footer":
      if (p.layoutStyle === "minimal") {
        return (
          '<div class="fw-footer-block fw-entrance" style="background:' +
          p.bg +
          '">' +
          '<div class="fw-footer-bottom" style="padding:2rem;text-align:center"><span contenteditable data-field="copyright">' +
          p.copyright +
          "</span></div></div>"
        );
      }
      var fCols = (p.cols || [])
        .map(function (c) {
          return (
            '<div class="fw-footer-nav-group"><h4>' +
            c.heading +
            "</h4>" +
            c.links
              .map(function (l) {
                return '<a href="#">' + l + "</a>";
              })
              .join("") +
            "</div>"
          );
        })
        .join("");
      return (
        '<div class="fw-footer-block fw-entrance" style="background:' +
        p.bg +
        '">' +
        '<div class="fw-footer-top"><div>' +
        '<div class="fw-footer-logo" contenteditable data-field="logoText">' +
        p.logoText +
        "</div>" +
        '<div class="fw-footer-tagline" contenteditable data-field="tagline">' +
        p.tagline +
        "</div></div>" +
        '<div class="fw-footer-nav">' +
        fCols +
        "</div></div>" +
        '<div class="fw-footer-bottom"><span contenteditable data-field="copyright">' +
        p.copyright +
        "</span><span>Privacy \u00B7 Terms</span></div></div>"
      );

    case "textBlock":
      return (
        '<div class="fw-text-block" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        ";padding:" +
        p.paddingV +
        "px " +
        p.paddingH +
        'px">' +
        '<h2 contenteditable data-field="headline" style="color:' +
        p.textColor +
        '">' +
        p.headline +
        "</h2>" +
        '<p contenteditable data-field="body" style="color:' +
        p.textColor +
        '">' +
        p.body +
        "</p></div>"
      );

    case "colorBlock":
      return (
        '<div class="fw-color-block" style="background:' +
        p.bg +
        ";padding:" +
        p.paddingV +
        "px " +
        p.paddingH +
        'px">' +
        '<div class="fw-color-block-inner">' +
        '<h2 contenteditable data-field="headline" style="color:' +
        p.textColor +
        '">' +
        p.headline +
        "</h2>" +
        '<p contenteditable data-field="body" style="color:' +
        p.textColor +
        '">' +
        p.body +
        "</p></div></div>"
      );

    case "features":
      return (
        '<div class="fw-features-block fw-entrance" style="background:' +
        p.bg +
        ';padding:5rem 3rem">' +
        '<div class="fw-features-label" style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#999;margin-bottom:1rem" contenteditable data-field="label">' +
        p.label +
        "</div>" +
        '<h2 class="fw-features-h2" style="font-family:\'Lexend\',sans-serif;font-size:clamp(2rem,5vw,4rem);font-weight:800;letter-spacing:-2px;color:' +
        p.textColor +
        ';line-height:1;margin-bottom:3rem" contenteditable data-field="headline">' +
        p.headline +
        "</h2>" +
        '<div class="fw-features-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:2rem">' +
        (p.items || [])
          .map(function (i) {
            return (
              '<div class="fw-feature-card" style="padding:2rem;background:' +
              (p.bg === "#ffffff" ? "#f7f6f2" : "#1a1a1f") +
              ';border-radius:4px">' +
              '<div style="font-size:2rem;margin-bottom:1rem">' +
              i.icon +
              "</div>" +
              "<h3 style=\"font-family:'Lexend',sans-serif;font-size:1.15rem;font-weight:700;color:" +
              p.textColor +
              ';margin-bottom:0.6rem">' +
              i.title +
              "</h3>" +
              '<p style="font-size:14px;font-weight:300;line-height:1.6;color:' +
              p.textColor +
              '">' +
              i.desc +
              "</p></div>"
            );
          })
          .join("") +
        "</div></div>"
      );

    case "pricing":
      return (
        '<div class="fw-pricing-block fw-entrance" style="background:' +
        p.bg +
        ';padding:5rem 3rem">' +
        '<div class="fw-pricing-label" style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#999;margin-bottom:1rem" contenteditable data-field="label">' +
        p.label +
        "</div>" +
        '<h2 class="fw-pricing-h2" style="font-family:\'Lexend\',sans-serif;font-size:clamp(2rem,5vw,4rem);font-weight:800;letter-spacing:-2px;color:' +
        p.textColor +
        ';line-height:1;margin-bottom:3rem" contenteditable data-field="headline">' +
        p.headline +
        "</h2>" +
        '<div class="fw-pricing-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;align-items:start">' +
        (p.tiers || [])
          .map(function (t) {
            return (
              '<div class="fw-tier-card" style="background:' +
              (t.featured ? "#111" : "#fff") +
              ";padding:2.5rem 2rem;border-radius:4px;position:relative;" +
              (t.featured
                ? "color:#fff;transform:scale(1.05)"
                : "color:#111;border:1px solid #eee") +
              '">' +
              (t.featured
                ? '<div style="position:absolute;top:0;left:0;right:0;background:#CDFE00;color:#111;text-align:center;font-size:10px;letter-spacing:3px;text-transform:uppercase;padding:4px;font-weight:600">Popular</div>'
                : "") +
              "<h3 style=\"font-family:'Lexend',sans-serif;font-size:1.2rem;font-weight:700;margin-bottom:0.5rem;" +
              (t.featured ? "color:#fff" : "color:#111") +
              '">' +
              t.name +
              "</h3>" +
              "<div style=\"font-family:'Lexend',sans-serif;font-size:3rem;font-weight:800;letter-spacing:-2px;" +
              (t.featured ? "color:#CDFE00" : "color:#111") +
              '">' +
              t.price +
              "</div>" +
              '<div style="font-size:12px;color:' +
              (t.featured ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)") +
              ';margin-bottom:1.5rem">per month</div>' +
              '<ul style="list-style:none;padding:0;margin-bottom:2rem">' +
              t.features
                .map(function (f) {
                  return (
                    '<li style="padding:0.4rem 0;font-size:13px;border-bottom:1px solid ' +
                    (t.featured
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.06)") +
                    '">' +
                    f +
                    "</li>"
                  );
                })
                .join("") +
              "</ul>" +
              '<button style="width:100%;padding:0.8rem;background:' +
              (t.featured ? "#CDFE00" : "#111") +
              ";color:" +
              (t.featured ? "#111" : "#fff") +
              ';border:none;border-radius:4px;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;cursor:pointer">' +
              t.cta +
              "</button></div>"
            );
          })
          .join("") +
        "</div></div>"
      );

    case "team":
      return (
        '<div class="fw-team-block fw-entrance" style="background:' +
        p.bg +
        ';padding:5rem 3rem">' +
        '<div class="fw-team-label" style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#999;margin-bottom:1rem" contenteditable data-field="label">' +
        p.label +
        "</div>" +
        '<h2 class="fw-team-h2" style="font-family:\'Lexend\',sans-serif;font-size:clamp(2rem,5vw,4rem);font-weight:800;letter-spacing:-2px;color:' +
        p.textColor +
        ';line-height:1;margin-bottom:3rem" contenteditable data-field="headline">' +
        p.headline +
        "</h2>" +
        '<div class="fw-team-grid" style="display:grid;grid-template-columns:repeat(' +
        Math.min((p.members || []).length, 3) +
        ',1fr);gap:2rem">' +
        (p.members || [])
          .map(function (m) {
            return (
              '<div class="fw-team-card" style="padding:2rem;background:' +
              (p.bg === "#ffffff" ? "#f7f6f2" : "#1a1a1f") +
              ';border-radius:4px;text-align:center">' +
              '<div style="width:80px;height:80px;border-radius:50%;background:' +
              p.accentColor +
              "22;margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;font-family:'Lexend',sans-serif;font-size:1.8rem;font-weight:700;color:" +
              p.accentColor +
              '">' +
              m.name.charAt(0) +
              "</div>" +
              "<h3 style=\"font-family:'Lexend',sans-serif;font-size:1.15rem;font-weight:700;color:" +
              p.textColor +
              ';margin-bottom:0.3rem">' +
              m.name +
              "</h3>" +
              '<div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:' +
              p.accentColor +
              ';margin-bottom:0.8rem">' +
              m.role +
              "</div>" +
              '<p style="font-size:13px;font-weight:300;line-height:1.6;color:' +
              p.textColor +
              '">' +
              m.bio +
              "</p></div>"
            );
          })
          .join("") +
        "</div></div>"
      );

    case "videoHero":
      return (
        '<div class="fw-video-hero" style="background:' +
        p.bg +
        '">' +
        '<video class="fw-video-bg" autoplay muted loop playsinline' +
        (p.posterUrl ? ' poster="' + p.posterUrl + '"' : "") +
        ">" +
        (p.videoUrl
          ? '<source src="' + p.videoUrl + '" type="video/webm">'
          : "") +
        "</video>" +
        '<div class="fw-video-overlay" style="background:' +
        p.overlayColor +
        ";opacity:" +
        p.overlayOpacity +
        '"></div>' +
        '<div class="fw-video-content" style="color:' +
        p.textColor +
        '">' +
        "<h1>" +
        p.headline +
        "</h1>" +
        "<p>" +
        p.subtext +
        "</p>" +
        '<div class="fw-video-cta-group">' +
        '<button class="fw-video-cta-primary" style="background:' +
        p.accentColor +
        ";color:" +
        (p.accentColor === "#CDFE00" ? "#111" : "#fff") +
        '" contenteditable data-field="ctaPrimary">' +
        p.ctaPrimary +
        "</button>" +
        '<button class="fw-video-cta-secondary" contenteditable data-field="ctaSecondary">' +
        p.ctaSecondary +
        "</button>" +
        "</div>" +
        (p.showRating
          ? '<div style="margin-top:2rem">' +
            FB.canvas.renderTrustPillInline(p) +
            "</div>"
          : "") +
        "</div></div>"
      );

    case "splitHero":
      var _embedUrl = p.embedUrl || p.imageUrl || p.imageSrc || "";
      var splitMedia =
        p.embedType === "vimeo" && _embedUrl
          ? '<iframe src="https://player.vimeo.com/video/' +
            _embedUrl.split("/").pop() +
            '?background=1&autoplay=1&loop=1&muted=1" frameborder="0" allow="autoplay" style="position:absolute;inset:0;width:100%;height:100%"></iframe>'
          : _embedUrl
            ? '<img src="' +
              _embedUrl +
              '" alt="' +
              (p.imageAlt || "") +
              '" style="width:100%;height:100%;object-fit:cover">'
            : '<div style="width:100%;height:100%;background:var(--surface-1)"></div>';
      return (
        '<div class="fw-split-hero" style="background:' +
        p.bg +
        '">' +
        '<div class="fw-split-text" style="color:' +
        p.textColor +
        '">' +
        '<p class="fw-hero-eyebrow" style="color:' +
        p.accentColor +
        '" contenteditable data-field="eyebrow">' +
        p.eyebrow +
        "</p>" +
        '<h1 contenteditable data-field="headline">' +
        p.headline +
        "</h1>" +
        '<p contenteditable data-field="subtext">' +
        p.subtext +
        "</p>" +
        '<button class="fw-hero-cta" style="background:' +
        p.accentColor +
        '" contenteditable data-field="ctaText">' +
        p.ctaText +
        "</button>" +
        "</div>" +
        '<div class="fw-split-media">' +
        splitMedia +
        "</div></div>"
      );

    case "orbsHero":
      var orbsHtml = (p.orbs || [])
        .map(function (o, i) {
          return (
            '<div class="fw-orb" style="width:' +
            o.size +
            "%;height:" +
            o.size * 1.5 +
            "%;left:" +
            o.x +
            "%;top:" +
            o.y +
            "%;background:" +
            o.color +
            ";opacity:" +
            o.opacity +
            ";animation-delay:" +
            i * -3 +
            's"></div>'
          );
        })
        .join("");
      var wordsHtml = (p.words || [])
        .map(function (w, i) {
          return (
            '<span class="fw-word-item' +
            (i === 0 ? " active" : "") +
            " fw-gradient-" +
            w.gradient +
            '">' +
            w.text +
            "</span>"
          );
        })
        .join("");
      return (
        '<div class="fw-orbs-hero" style="background:' +
        p.bg +
        '">' +
        orbsHtml +
        '<div class="fw-orbs-content" style="color:' +
        p.textColor +
        '">' +
        "<h1>" +
        p.headline +
        '<span class="fw-word-swap-wrap">' +
        wordsHtml +
        "</span></h1>" +
        '<p contenteditable data-field="subtext">' +
        p.subtext +
        "</p>" +
        '<button class="fw-hero-cta" style="background:' +
        p.accentColor +
        '" contenteditable data-field="ctaText">' +
        p.ctaText +
        "</button>" +
        "</div></div>"
      );

    case "megaNav":
      var megaLinks = (p.links || [])
        .map(function (l) {
          if (l.children && l.children.length) {
            var childrenHtml = l.children
              .map(function (c) {
                return (
                  '<a href="' +
                  c.url +
                  '" class="fw-mega-link">' +
                  c.label +
                  "</a>"
                );
              })
              .join("");
            return (
              '<li><a href="' +
              l.url +
              '">' +
              l.label +
              "</a>" +
              '<div class="fw-mega-dropdown"><div class="fw-mega-grid">' +
              childrenHtml +
              "</div></div></li>"
            );
          }
          return '<li><a href="' + l.url + '">' + l.label + "</a></li>";
        })
        .join("");
      return (
        '<nav class="fw-mega-nav" style="background:' +
        p.bg +
        '">' +
        '<div class="fw-mega-logo" style="color:' +
        p.textColor +
        '">' +
        (p.logoImage
          ? '<img src="' +
            p.logoImage +
            '" alt="' +
            (p.logoText || "") +
            '" style="max-height:36px;width:auto;display:block">'
          : '<span contenteditable data-field="logoText">' +
            p.logoText +
            "</span>") +
        "</div>" +
        '<ul class="fw-mega-links">' +
        megaLinks +
        "</ul>" +
        '<button class="fw-nav-cta" style="background:' +
        p.accentColor +
        '" contenteditable data-field="ctaText">' +
        p.ctaText +
        "</button></nav>"
      );

    case "slideNav":
      var slideLinks = (p.links || [])
        .map(function (l) {
          if (l.children && l.children.length) {
            var subHtml = l.children
              .map(function (c) {
                return (
                  '<li><a href="' +
                  c.url +
                  '" style="font-size:1rem;padding-left:1rem">' +
                  c.label +
                  "</a></li>"
                );
              })
              .join("");
            return (
              '<li><a href="' +
              l.url +
              '" style="font-size:1.5rem">' +
              l.label +
              "</a><ul>" +
              subHtml +
              "</ul></li>"
            );
          }
          return (
            '<li><a href="' +
            l.url +
            '" style="font-size:1.5rem">' +
            l.label +
            "</a></li>"
          );
        })
        .join("");
      return (
        '<div class="fw-slide-nav" style="background:' +
        p.bg +
        '">' +
        '<div class="fw-mega-logo" style="color:' +
        p.textColor +
        '">' +
        (p.logoImage
          ? '<img src="' +
            p.logoImage +
            '" alt="' +
            (p.logoText || "") +
            '" style="max-height:36px;width:auto;display:block">'
          : '<span contenteditable data-field="logoText">' +
            p.logoText +
            "</span>") +
        "</div>" +
        '<label class="fw-nav-cta" style="background:' +
        p.accentColor +
        ';cursor:pointer" for="slide-nav-toggle">Menu</label>' +
        '<input type="checkbox" id="slide-nav-toggle" class="fw-slide-trigger">' +
        '<div class="fw-slide-panel" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<label for="slide-nav-toggle" style="cursor:pointer;font-size:2rem;display:block;margin-bottom:2rem">\u2715</label>' +
        "<ul>" +
        slideLinks +
        "</ul></div></div>"
      );

    case "resultsGrid":
      var resultCards = (p.cards || [])
        .map(function (c) {
          var metricsHtml = (c.metrics || [])
            .map(function (m) {
              return (
                '<div class="fw-metric-box"><div class="fw-metric-line">' +
                '<span class="fw-metric-label">' +
                m.label +
                "</span>" +
                '<span class="fw-metric-value"><span class="fw-metric-before">' +
                m.before +
                "</span>" +
                '<span class="fw-metric-arrow"> \u2192 </span>' +
                '<span class="fw-metric-after">' +
                m.after +
                "</span></span></div>" +
                '<div class="fw-metric-note">' +
                m.note +
                "</div></div>"
              );
            })
            .join("");
          var t = c.testimonial || {};
          return (
            '<div class="fw-result-card" style="background:' +
            (p.cardBg || "rgba(255,255,255,0.03)") +
            ";border:1px solid " +
            (p.cardBorder || "rgba(255,255,255,0.08)") +
            '">' +
            '<div class="fw-result-glow"></div>' +
            '<p class="fw-result-type">' +
            c.type +
            "</p>" +
            '<h3 class="fw-result-name">' +
            c.clientName +
            "</h3>" +
            '<p class="fw-result-loc">' +
            c.location +
            "</p>" +
            '<p class="fw-result-desc">' +
            c.description +
            "</p>" +
            metricsHtml +
            '<div class="fw-client-proof"><div class="fw-proof-avatar" style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:16px">\uD83D\uDC64</div>' +
            '<div><div class="fw-proof-name">' +
            (t.name || "") +
            '</div><div class="fw-proof-brand">' +
            (t.brand || "") +
            "</div>" +
            '<div class="fw-proof-quote">"' +
            (t.quote || "") +
            '"</div></div></div>' +
            '<span class="fw-verified">Verified</span></div>'
          );
        })
        .join("");
      return (
        '<div class="fw-results-grid" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<p class="fw-results-label" style="color:' +
        p.accentColor +
        '" contenteditable data-field="label">' +
        p.label +
        "</p>" +
        '<h2 contenteditable data-field="headline">' +
        p.headline +
        "</h2>" +
        '<p contenteditable data-field="subtitle">' +
        p.subtitle +
        "</p>" +
        '<div class="fw-results-grid-inner">' +
        resultCards +
        "</div></div>"
      );

    case "glassCards":
      var glassCards = (p.cards || [])
        .map(function (c) {
          return (
            '<div class="fw-glass-card" style="background:' +
            p.cardBg +
            ";border:1px solid " +
            p.cardBorder +
            '">' +
            '<div class="fw-glass-icon" style="background:' +
            p.accentColor +
            '22">' +
            c.icon +
            "</div>" +
            "<h3>" +
            c.title +
            "</h3><p>" +
            c.description +
            "</p></div>"
          );
        })
        .join("");
      return (
        '<div class="fw-glass-cards" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<p style="color:' +
        p.accentColor +
        '" contenteditable data-field="label">' +
        p.label +
        "</p>" +
        '<h2 contenteditable data-field="headline">' +
        p.headline +
        "</h2>" +
        '<div class="fw-glass-grid">' +
        glassCards +
        "</div></div>"
      );

    case "portfolioGrid":
      var portItems = (p.items || [])
        .map(function (item) {
          return (
            '<div class="fw-portfolio-item">' +
            '<img src="' +
            item.image +
            '" alt="' +
            item.title +
            '" loading="lazy">' +
            '<div class="fw-portfolio-overlay"><h3>' +
            item.title +
            "</h3><p>" +
            item.category +
            "</p></div></div>"
          );
        })
        .join("");
      return (
        '<div class="fw-portfolio-grid" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<p style="color:' +
        p.accentColor +
        '" contenteditable data-field="label">' +
        p.label +
        "</p>" +
        '<h2 contenteditable data-field="headline">' +
        p.headline +
        "</h2>" +
        '<div class="fw-portfolio-inner">' +
        portItems +
        "</div></div>"
      );

    case "clientCarousel": {
      var ccStyle = p.style || "pill";
      var ccMode = p.mode || "marquee";
      var ccTwoRows = !!p.twoRows;
      var ccSpeed = p.speed || 30;
      var ccGap = p.gap || 24;
      var ccFontSize = p.fontSize || 14;
      var ccShowLabel = p.showLabel !== false;
      var ccAccent = p.accentColor || "#CDFE00";
      var ccSep = p.separator || "✦";
      var ccPaddingV = p.paddingV || 48;
      var ccBg = p.bg || "#111111";
      var ccText = p.textColor || "#f7f6f2";
      var ccClients =
        p.clients && p.clients.length
          ? p.clients
          : [
              "Acme Corp",
              "TechCo",
              "DesignLab",
              "StartupXYZ",
              "BrandHQ",
              "MediaPlus",
            ];

      // Build individual items
      var ccItems;
      if (p.logos && p.logos.length) {
        ccItems = p.logos.map(function (l) {
          return (
            '<span class="fw-cc-item"><img src="' +
            l.src +
            '" alt="' +
            l.alt +
            '" loading="lazy" style="height:28px;filter:grayscale(1);opacity:0.55;transition:all 0.3s"></span>'
          );
        });
      } else {
        ccItems = ccClients.map(function (c) {
          return '<span class="fw-cc-item">' + c + "</span>";
        });
      }

      var ccSepHtml =
        ccStyle === "minimal"
          ? '<span class="fw-cc-sep" aria-hidden="true">' + ccSep + "</span>"
          : "";
      var ccItemsHtml = ccItems.join(ccSepHtml);
      var ccContainerStyle = [
        "background:" + ccBg,
        "color:" + ccText,
        "--cc-accent:" + ccAccent,
        "--cc-gap:" + ccGap + "px",
        "--cc-speed:" + ccSpeed + "s",
        "--cc-bg:" + ccBg,
        "font-size:" + ccFontSize + "px",
        "padding:" + ccPaddingV + "px 0",
      ].join(";");

      var ccLabelHtml = ccShowLabel
        ? '<p class="fw-cc-label">' + (p.label || "Trusted by") + "</p>"
        : "";

      if (ccMode === "grid") {
        return (
          '<div class="fw-client-carousel" data-style="' +
          ccStyle +
          '" data-mode="grid" style="' +
          ccContainerStyle +
          '">' +
          ccLabelHtml +
          '<div class="fw-cc-grid">' +
          ccItemsHtml +
          "</div></div>"
        );
      }

      // Marquee — duplicate for seamless loop
      var ccLoopHtml = ccItemsHtml + ccSepHtml + ccItemsHtml;
      var ccRow1 =
        '<div class="fw-cc-track" style="animation-duration:' +
        ccSpeed +
        's">' +
        ccLoopHtml +
        "</div>";
      var ccRow2 = "";
      if (ccTwoRows) {
        var ccRevItems = ccItems.slice().reverse();
        var ccRevHtml =
          ccRevItems.join(ccSepHtml) + ccSepHtml + ccRevItems.join(ccSepHtml);
        ccRow2 =
          '<div class="fw-cc-track fw-cc-track--rev" style="animation-duration:' +
          ccSpeed * 1.2 +
          's">' +
          ccRevHtml +
          "</div>";
      }

      return (
        '<div class="fw-client-carousel" data-style="' +
        ccStyle +
        '" data-mode="marquee" style="' +
        ccContainerStyle +
        '">' +
        ccLabelHtml +
        '<div class="fw-cc-viewport">' +
        ccRow1 +
        ccRow2 +
        "</div></div>"
      );
    }

    case "trustPill":
      return (
        '<div class="fw-trust-pill" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<div class="fw-trust-stars">' +
        Array(p.stars)
          .fill(
            '<svg class="fw-star" viewBox="0 0 24 24" fill="' +
              p.starColor +
              '"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.851 1.416 8.26L12 18.902l-7.416 4.957L6 15.599 0 9.748l8.332-1.73z"/></svg>',
          )
          .join("") +
        "</div>" +
        '<div class="fw-trust-text"><div class="fw-trust-platform" contenteditable data-field="ratingText">' +
        p.ratingText +
        "</div>" +
        '<div class="fw-trust-verified">' +
        p.verifiedDate +
        "</div></div></div>"
      );

    case "metricBox":
      return (
        '<div class="fw-metric-box-standalone" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<p style="font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;opacity:0.6;margin-bottom:0.5rem" contenteditable data-field="label">' +
        p.label +
        "</p>" +
        '<div><span class="fw-metric-before">' +
        p.before +
        "</span>" +
        '<span class="fw-metric-arrow" style="color:' +
        p.accentColor +
        '">' +
        p.arrow +
        "</span>" +
        '<span class="fw-metric-after" style="color:' +
        p.accentColor +
        '"' +
        (p.animateCounter ? ' data-counter="' + p.after + '"' : "") +
        ">" +
        p.after +
        "</span></div>" +
        '<p class="fw-metric-note-standalone">' +
        p.note +
        "</p></div>"
      );

    case "wordSwap":
      var wsItems = (p.words || [])
        .map(function (w, i) {
          return (
            '<span class="fw-word-item' +
            (i === 0 ? " active" : "") +
            " fw-gradient-" +
            w.gradient +
            '">' +
            w.text +
            "</span>"
          );
        })
        .join("");
      return (
        '<div class="fw-orbs-hero" style="background:' +
        p.bg +
        ';min-height:50vh">' +
        '<div class="fw-orbs-content" style="color:' +
        p.textColor +
        '">' +
        "<h1>" +
        p.prefix +
        '<span class="fw-word-swap-wrap">' +
        wsItems +
        "</span></h1></div></div>"
      );

    case "chatWidget":
      return (
        '<div class="fw-chat-toggle" style="background:' +
        p.accentColor +
        '" onclick="this.nextElementSibling.classList.toggle(\'open\')">' +
        (p.statusDot
          ? '<span class="fw-chat-status-dot" style="position:absolute;top:0;right:0"></span>'
          : "") +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' +
        (p.accentColor === "#CDFE00" ? "#111" : "#fff") +
        '" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>' +
        '<div class="fw-chat-container" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<div class="fw-chat-header" style="border-bottom:1px solid rgba(255,255,255,0.1)">' +
        (p.statusDot ? '<span class="fw-chat-status-dot"></span>' : "") +
        '<span contenteditable data-field="welcomeText">' +
        p.welcomeText +
        "</span></div>" +
        '<div class="fw-chat-body"><div class="fw-chat-message" style="background:rgba(255,255,255,0.05)">' +
        p.welcomeText +
        "</div></div>" +
        '<div class="fw-chat-input"><input type="text" placeholder="Type a message..."><button>\u27A4</button></div></div>'
      );

    case "cookieConsent":
      var catHtml = (p.categories || [])
        .map(function (c) {
          var checked = c.required ? "checked disabled" : "checked";
          return (
            '<div class="fw-cookie-category" style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;align-items:flex-start;gap:0.5rem">' +
            '<input type="checkbox" class="fw-cookie-cat-toggle" data-cat="' +
            (c.id || "") +
            '" ' +
            checked +
            ' style="margin-top:0.2rem">' +
            '<div style="flex:1">' +
            "<strong>" +
            c.name +
            "</strong>" +
            (c.required
              ? ' <span style="font-size:0.7rem;opacity:0.5">Always Active</span>'
              : "") +
            '<p style="font-size:0.8rem;opacity:0.6;margin-top:0.25rem">' +
            (c.description || "") +
            "</p></div></div>"
          );
        })
        .join("");
      return (
        '<div class="fw-cookie-banner" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<div class="fw-cookie-message"><strong>' +
        (p.title || "") +
        "</strong><br>" +
        (p.message || "") +
        "</div>" +
        '<div class="fw-cookie-options">' +
        '<button class="fw-cookie-btn fw-cookie-btn-secondary" data-cookie-action="decline">' +
        (p.declineText || "Decline") +
        "</button>" +
        '<button class="fw-cookie-btn fw-cookie-btn-tertiary" data-cookie-action="customize">' +
        (p.customizeText || "Customize") +
        "</button>" +
        '<button class="fw-cookie-btn fw-cookie-btn-primary" data-cookie-action="accept" style="background:' +
        p.accentColor +
        ";color:" +
        (p.accentColor === "#CDFE00" ? "#111" : "#fff") +
        '">' +
        (p.acceptText || "Accept All") +
        "</button>" +
        "</div>" +
        '<div class="fw-cookie-categories" style="width:100%;margin-top:1rem;display:none">' +
        catHtml +
        "</div></div>"
      );

    case "liteVideo":
      var embedSrc =
        p.platform === "vimeo"
          ? "https://player.vimeo.com/video/" +
            p.videoId +
            "?autoplay=1&muted=1"
          : "https://www.youtube.com/embed/" + p.videoId + "?autoplay=1&mute=1";
      return (
        '<div class="fw-lite-video" style="background:' +
        p.bg +
        "\" onclick=\"this.classList.add('loaded');this.innerHTML='<iframe src=" +
        embedSrc +
        " allow=autoplay></iframe>'\">" +
        '<img class="fw-lite-poster" src="' +
        p.posterUrl +
        '" alt="' +
        p.title +
        '" loading="lazy">' +
        '<div class="fw-lite-play-btn"><svg viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg></div></div>'
      );

    case "faq":
      var faqItems = (p.items || [])
        .map(function (item, i) {
          return (
            '<details class="fw-faq-item' +
            (i === 0 ? " open" : "") +
            '" style="border-bottom:1px solid rgba(128,128,128,0.15)">' +
            '<summary class="fw-faq-question" style="color:' +
            (p.textColor || "#111") +
            '">' +
            '<span class="fw-faq-q-text">' +
            item.question +
            "</span>" +
            '<span class="fw-faq-icon" style="color:' +
            (p.accentColor || "#CDFE00") +
            '">\u2795</span>' +
            "</summary>" +
            '<div class="fw-faq-answer" style="color:' +
            (p.textColor || "#111") +
            '">' +
            item.answer +
            "</div>" +
            "</details>"
          );
        })
        .join("");
      return (
        '<div class="fw-faq-block" style="background:' +
        (p.bg || "#ffffff") +
        ';padding:4rem 2rem">' +
        '<div style="max-width:800px;margin:0 auto">' +
        '<h2 class="fw-faq-title" style="color:' +
        (p.textColor || "#111") +
        ';font-size:clamp(1.5rem,4vw,2.5rem);font-weight:700;margin-bottom:2rem;text-align:center">' +
        p.title +
        "</h2>" +
        '<div class="fw-faq-list">' +
        faqItems +
        "</div>" +
        "</div></div>"
      );

    case "imageTextTop":
    case "imageTextBottom":
    case "imageTextLeft":
    case "imageTextRight":
      var frameClass = p.frameStyle
        ? " fw-img-frame frame-" + p.frameStyle
        : "";
      var imgWrap =
        '<div class="fw-img-wrap' +
        frameClass +
        '" style="' +
        (p.frameStyle === "polaroid" ? "" : "") +
        '">' +
        '<img src="' +
        p.imageUrl +
        '" alt="' +
        p.imageAlt +
        '" style="width:100%;height:' +
        p.imageHeight +
        "px;object-fit:" +
        p.imageFit +
        ";border-radius:" +
        (p.frameStyle ? "0" : p.imageRadius) +
        'px;display:block"></div>';
      var txt =
        '<div style="text-align:' +
        p.textAlign +
        '">' +
        '<h2 contenteditable data-field="headline" style="color:' +
        p.textColor +
        ';margin-bottom:0.75rem">' +
        p.headline +
        "</h2>" +
        '<p contenteditable data-field="body" style="color:' +
        p.textColor +
        ';opacity:0.85;line-height:1.7">' +
        p.body +
        "</p></div>";
      var inner = "";
      if (p.imagePosition === "top") {
        inner = imgWrap + '<div style="margin-top:1.5rem">' + txt + "</div>";
      } else if (p.imagePosition === "bottom") {
        inner = txt + '<div style="margin-top:1.5rem">' + imgWrap + "</div>";
      } else if (p.imagePosition === "left") {
        inner =
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:2.5rem;align-items:center">' +
          imgWrap +
          txt +
          "</div>";
      } else {
        inner =
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:2.5rem;align-items:center">' +
          txt +
          imgWrap +
          "</div>";
      }
      return (
        '<div class="fw-image-text-block" style="background:' +
        p.bg +
        ";padding:" +
        p.paddingV +
        "px " +
        p.paddingH +
        'px">' +
        inner +
        "</div>"
      );

    case "splitText":
      var splitChars = (p.headline || "")
        .split("")
        .map(function (ch, i) {
          if (ch === " ")
            return (
              '<span class="fw-split-char" style="transition-delay:' +
              i * (p.staggerDelay || 40) +
              'ms">&nbsp;</span>'
            );
          return (
            '<span class="fw-split-char" style="transition-delay:' +
            i * (p.staggerDelay || 40) +
            'ms">' +
            ch +
            "</span>"
          );
        })
        .join("");
      return (
        '<div class="fw-split-text-block fw-entrance" style="background:' +
        p.bg +
        ';padding:5rem 3rem">' +
        '<h1 class="fw-split-headline" style="color:' +
        p.textColor +
        '">' +
        splitChars +
        "</h1>" +
        '<p class="fw-split-sub" style="color:' +
        p.textColor +
        '" contenteditable data-field="subtext">' +
        p.subtext +
        "</p></div>"
      );

    case "maskReveal":
      return (
        '<div class="fw-mask-reveal-block fw-entrance" style="background:' +
        p.bg +
        ';padding:5rem 3rem">' +
        '<h1 class="fw-mask-reveal-wrap" style="color:' +
        p.textColor +
        '" contenteditable data-field="headline">' +
        p.headline +
        "</h1>" +
        '<p class="fw-mask-reveal-sub" style="color:' +
        p.textColor +
        '" contenteditable data-field="subtext">' +
        p.subtext +
        "</p></div>"
      );

    case "fullscreenMenu":
      var fsLinks = (p.links || [])
        .map(function (l, i) {
          return (
            '<li class="fw-fs-menu-item" style="transition-delay:' +
            i * 80 +
            'ms"><a href="' +
            (l.url || "#") +
            '" style="color:' +
            p.menuTextColor +
            '">' +
            l.label +
            "</a></li>"
          );
        })
        .join("");
      return (
        '<nav class="fw-fullscreen-menu" style="background:' +
        p.bg +
        '">' +
        '<div class="fw-fs-topbar">' +
        '<div class="fw-fs-logo" style="color:' +
        p.textColor +
        '">' +
        (p.logoImage
          ? '<img src="' +
            p.logoImage +
            '" alt="' +
            (p.logoText || "") +
            '" style="max-height:36px;width:auto;display:block">'
          : '<span contenteditable data-field="logoText">' +
            p.logoText +
            "</span>") +
        "</div>" +
        '<label for="fw-fs-toggle" class="fw-fs-hamburger" style="color:' +
        p.textColor +
        '"><span></span><span></span><span></span></label></div>' +
        '<input type="checkbox" id="fw-fs-toggle" class="fw-fs-trigger" style="display:none">' +
        '<div class="fw-fs-overlay" style="background:' +
        p.menuBg +
        '">' +
        '<ul class="fw-fs-nav-list">' +
        fsLinks +
        "</ul></div></nav>"
      );

    case "circularList": {
      var clItems = p.items || [
        "Design",
        "Develop",
        "Deploy",
        "Grow",
        "Optimise",
        "Scale",
      ];
      var clN = clItems.length;
      var clMode = p.mode || "ring";
      var clStyle = p.itemStyle || "pill";
      var clSize = +(p.ringSize || 320);
      var clR = clSize / 2 - 54;
      var clCx = clSize / 2;
      var clCy = clSize / 2;
      var clAccent = p.accentColor || "#CDFE00";
      var clText = p.textColor || "#f7f6f2";
      var clBg = p.bg || "#111111";
      var clSpeed = +(p.rotateSpeed || 25);
      var clAutoRotate = !!p.autoRotate;
      var clConnectors = p.showConnectors !== false;
      var clNumbers = p.showNumbers !== false;
      var clMultiColor = !!p.multiColor;
      var clGlow = !!p.glowItems;
      var clCenterText = p.centerText || String(clN);
      var clCenterSub = p.centerSubtext || "items";
      var clPaddingV = +(p.paddingV || 80);
      var clFontSize = +(p.fontSize || 12);

      // Compute item positions
      var clPos = [];
      for (var ci = 0; ci < clN; ci++) {
        var clDeg;
        if (clMode === "arc") {
          clDeg = -180 + (180 / Math.max(clN - 1, 1)) * ci;
        } else {
          clDeg = -90 + (360 / clN) * ci;
        }
        var clRad = (clDeg * Math.PI) / 180;
        clPos.push({
          x: Math.round(clCx + clR * Math.cos(clRad)),
          y: Math.round(clCy + clR * Math.sin(clRad)),
        });
      }

      // SVG connectors
      var clSvg = "";
      if (clConnectors) {
        var clLines = clPos
          .map(function (pos) {
            return (
              '<line x1="' +
              clCx +
              '" y1="' +
              clCy +
              '" x2="' +
              pos.x +
              '" y2="' +
              pos.y +
              '" stroke="' +
              clAccent +
              '" stroke-opacity="0.15" stroke-width="1" stroke-dasharray="3 5"/>'
            );
          })
          .join("");
        clSvg =
          '<svg style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none">' +
          clLines +
          "</svg>";
      }

      // Items
      var clItemsHtml = clPos
        .map(function (pos, ci) {
          var col = clMultiColor
            ? "hsl(" + Math.round((ci * 360) / clN) + ",80%,65%)"
            : clAccent;
          var glowStyle = clGlow
            ? "filter:drop-shadow(0 0 8px " + col + ")"
            : "";
          var numHtml = clNumbers
            ? '<span class="fw-cl-num" style="background:' +
              col +
              ';color:#000">' +
              (ci + 1).toString().padStart(2, "0") +
              "</span>"
            : "";
          return (
            '<div class="fw-cl-item fw-cl-s-' +
            clStyle +
            '" style="position:absolute;left:' +
            pos.x +
            "px;top:" +
            pos.y +
            "px;font-size:" +
            clFontSize +
            "px;" +
            glowStyle +
            '" data-i="' +
            ci +
            '">' +
            numHtml +
            '<span class="fw-cl-name" style="color:' +
            clText +
            '">' +
            clItems[ci] +
            "</span></div>"
          );
        })
        .join("");

      var clSpinClass = clAutoRotate ? " fw-cl-spinning" : "";
      var clStageStyle =
        "position:relative;width:" +
        clSize +
        "px;height:" +
        clSize +
        "px;margin:0 auto;flex-shrink:0;--cl-speed:" +
        clSpeed +
        "s";
      var clRingBorder =
        p.ringBorder !== false
          ? '<div style="position:absolute;inset:0;border-radius:50%;border:1px solid rgba(255,255,255,0.07)"></div>'
          : "";
      var clInnerDot =
        '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:' +
        Math.round(clR * 0.14) +
        "px;height:" +
        Math.round(clR * 0.14) +
        "px;border-radius:50%;background:" +
        clAccent +
        ';opacity:0.12"></div>';

      return (
        '<div class="fw-circular-list" style="background:' +
        clBg +
        ";padding:" +
        clPaddingV +
        'px 3rem">' +
        (p.label
          ? '<p class="fw-cl-label" style="color:' +
            clAccent +
            '">' +
            p.label +
            "</p>"
          : "") +
        '<div class="fw-cl-stage' +
        clSpinClass +
        '" style="' +
        clStageStyle +
        '">' +
        clRingBorder +
        clSvg +
        '<div class="fw-cl-group">' +
        clItemsHtml +
        "</div>" +
        '<div class="fw-cl-center" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center">' +
        clInnerDot +
        '<div style="position:relative;color:' +
        clAccent +
        ';font-size:2.4rem;font-weight:800;line-height:1;font-family:Lexend,sans-serif">' +
        clCenterText +
        "</div>" +
        '<div style="color:' +
        clText +
        ';opacity:0.32;font-size:0.58rem;text-transform:uppercase;letter-spacing:3px;margin-top:0.2rem">' +
        clCenterSub +
        "</div></div></div></div>"
      );
    }

    case "glitchText":
      return (
        '<div class="fw-glitch-block" style="background:' +
        p.bg +
        ';padding:5rem 3rem">' +
        '<h1 class="fw-glitch-headline" data-text="' +
        p.headline +
        '" style="color:' +
        p.textColor +
        '" contenteditable data-field="headline">' +
        p.headline +
        "</h1>" +
        '<p class="fw-glitch-sub" style="color:' +
        p.textColor +
        ';opacity:0.6" contenteditable data-field="subtext">' +
        p.subtext +
        "</p></div>"
      );

    case "svgDraw":
      return (
        '<div class="fw-svg-draw-block" data-anim-duration="' +
        (p.animDuration || 3) +
        '" style="background:' +
        p.bg +
        ';padding:5rem 3rem;text-align:center">' +
        '<svg class="fw-svg-draw-svg" viewBox="0 0 400 80" style="max-width:600px">' +
        '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" ' +
        'font-family="Lexend,sans-serif" font-size="48" font-weight="800" ' +
        'fill="none" stroke="' +
        p.accentColor +
        '" stroke-width="1.5" ' +
        'stroke-dasharray="1000" stroke-dashoffset="1000" ' +
        'class="fw-svg-draw-text">' +
        (p.headline || "") +
        "</text></svg>" +
        '<p class="fw-svg-draw-sub" style="color:' +
        p.textColor +
        ';opacity:0.6;margin-top:1.5rem" contenteditable data-field="subtext">' +
        (p.subtext || "") +
        "</p></div>"
      );

    case "dayNightSwitcher":
      return (
        '<div class="fw-daynight-block" style="background:' +
        p.bg +
        ';padding:3rem;text-align:center">' +
        '<div class="fw-dn-dial">' +
        '<div class="fw-dn-orbit fw-dn-orbit-outer"></div>' +
        '<div class="fw-dn-orbit fw-dn-orbit-middle"></div>' +
        '<div class="fw-dn-orbit fw-dn-orbit-inner"></div>' +
        '<div class="fw-dn-sun" style="background:#FFD700"></div>' +
        '<div class="fw-dn-moon" style="background:#C0C0C0"></div></div>' +
        '<p class="fw-dn-time" style="color:' +
        p.textColor +
        ';margin-top:1rem;font-size:0.875rem" id="fw-dn-time-display"></p></div>'
      );

    case "particleButton":
      var particles = "";
      for (var pi = 0; pi < (p.particleCount || 12); pi++) {
        var px = Math.cos((pi / (p.particleCount || 12)) * Math.PI * 2) * 60;
        var py = Math.sin((pi / (p.particleCount || 12)) * Math.PI * 2) * 60;
        particles +=
          '<span class="fw-particle" style="left:calc(50% + ' +
          px +
          "px);top:calc(50% + " +
          py +
          "px);background:" +
          p.accentColor +
          ";animation-delay:" +
          pi * -0.3 +
          's"></span>';
      }
      return (
        '<div class="fw-particle-btn-block" style="background:' +
        p.bg +
        ';padding:4rem 3rem;text-align:center">' +
        '<div class="fw-particle-btn-wrap">' +
        particles +
        '<button class="fw-particle-btn" style="background:' +
        p.accentColor +
        ";color:" +
        (p.accentColor === "#CDFE00" ? "#111" : "#fff") +
        '" contenteditable data-field="buttonText">' +
        p.buttonText +
        "</button></div></div>"
      );

    case "noiseSection":
      return (
        '<div class="fw-noise-section fw-entrance" style="background:' +
        p.bg +
        ';padding:5rem 3rem">' +
        '<div class="fw-noise-overlay" style="opacity:' +
        (p.noiseOpacity || 0.04) +
        '"></div>' +
        '<h2 class="fw-noise-headline" style="color:' +
        p.textColor +
        '" contenteditable data-field="headline">' +
        p.headline +
        "</h2>" +
        '<p class="fw-noise-sub" style="color:' +
        p.textColor +
        ';opacity:0.6" contenteditable data-field="subtext">' +
        p.subtext +
        "</p></div>"
      );

    case "scrollIndicator":
      return (
        '<div class="fw-scroll-ind-block" style="background:' +
        p.bg +
        ';padding:3rem 3rem 4rem">' +
        '<div class="fw-scroll-ind-track" style="height:' +
        (p.height || 3) +
        "px;position:" +
        (p.position || "top") +
        '">' +
        '<div class="fw-scroll-ind-fill" style="background:' +
        p.accentColor +
        '"></div></div>' +
        '<p style="color:' +
        p.textColor +
        ';opacity:0.4;font-size:0.75rem;text-align:center;margin-top:1rem;text-transform:uppercase;letter-spacing:2px">Scroll Progress</p></div>'
      );

    case "timeline":
      var tlEvents = (p.events || [])
        .map(function (ev, i) {
          var side = i % 2 === 0 ? "left" : "right";
          return (
            '<div class="fw-tl-item fw-tl-' +
            side +
            '">' +
            '<div class="fw-tl-dot" style="background:' +
            p.accentColor +
            '"></div>' +
            '<div class="fw-tl-content">' +
            '<span class="fw-tl-year" style="color:' +
            p.accentColor +
            '">' +
            ev.year +
            "</span>" +
            '<h3 class="fw-tl-title" style="color:' +
            p.textColor +
            '">' +
            ev.title +
            "</h3>" +
            '<p class="fw-tl-desc" style="color:' +
            p.textColor +
            ';opacity:0.6">' +
            ev.desc +
            "</p></div></div>"
          );
        })
        .join("");
      return (
        '<div class="fw-timeline-block fw-entrance" style="background:' +
        p.bg +
        ';padding:5rem 3rem">' +
        '<p class="fw-tl-label" style="color:' +
        p.accentColor +
        '" contenteditable data-field="label">' +
        p.label +
        "</p>" +
        '<h2 class="fw-tl-headline" style="color:' +
        p.textColor +
        '" contenteditable data-field="headline">' +
        p.headline +
        "</h2>" +
        '<div class="fw-tl-line" style="background:' +
        p.accentColor +
        '22"></div>' +
        '<div class="fw-tl-events">' +
        tlEvents +
        "</div></div>"
      );

    case "iridescentBtn":
      return (
        '<div class="fw-iridescent-block" style="background:' +
        p.bg +
        ';padding:5rem 3rem;text-align:center">' +
        '<h2 class="fw-iridescent-headline" style="color:' +
        p.textColor +
        '" contenteditable data-field="headline">' +
        p.headline +
        "</h2>" +
        '<button class="fw-iridescent-btn" style="color:' +
        (p.accentColor === "#CDFE00" ? "#111" : "#fff") +
        '" contenteditable data-field="btnText">' +
        p.btnText +
        "</button></div>"
      );

    case "counterSection":
      var ctrItems = (p.counters || [])
        .map(function (c) {
          return (
            '<div class="fw-ctr-cell">' +
            '<div class="fw-ctr-num" data-target="' +
            c.num +
            '" style="color:' +
            p.accentColor +
            '">0' +
            c.suffix +
            "</div>" +
            '<div class="fw-ctr-label" style="color:' +
            p.textColor +
            ';opacity:0.6">' +
            c.label +
            "</div></div>"
          );
        })
        .join("");
      return (
        '<div class="fw-counter-block fw-entrance" style="background:' +
        p.bg +
        ';padding:5rem 3rem">' +
        '<p class="fw-ctr-label-top" style="color:' +
        p.accentColor +
        '" contenteditable data-field="label">' +
        p.label +
        "</p>" +
        '<h2 class="fw-ctr-headline" style="color:' +
        p.textColor +
        '" contenteditable data-field="headline">' +
        p.headline +
        "</h2>" +
        '<div class="fw-ctr-grid">' +
        ctrItems +
        "</div></div>"
      );

    case "socialLinks":
      var SL_PLAT = {
        instagram: {
          label: "Instagram",
          color: "#E1306C",
          path: "M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3zm5 3a5 5 0 100 10A5 5 0 0012 7zm0 2a3 3 0 110 6 3 3 0 010-6zm5.5-.5a1 1 0 110 2 1 1 0 010-2z",
        },
        twitter: {
          label: "X / Twitter",
          color: "#ffffff",
          path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
        },
        tiktok: {
          label: "TikTok",
          color: "#69C9D0",
          path: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.19a8.16 8.16 0 004.77 1.52V6.28a4.85 4.85 0 01-1-.41z",
        },
        youtube: {
          label: "YouTube",
          color: "#FF0000",
          path: "M21.58 7.19a2.76 2.76 0 00-1.95-1.95C18 4.89 12 4.89 12 4.89s-6 0-7.63.35a2.76 2.76 0 00-1.95 1.95A28.9 28.9 0 002 12a28.9 28.9 0 00.42 4.81 2.76 2.76 0 001.95 1.95C6 19.11 12 19.11 12 19.11s6 0 7.63-.35a2.76 2.76 0 001.95-1.95A28.9 28.9 0 0022 12a28.9 28.9 0 00-.42-4.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z",
        },
        linkedin: {
          label: "LinkedIn",
          color: "#0A66C2",
          path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zm2-5a2 2 0 110 4 2 2 0 010-4z",
        },
        facebook: {
          label: "Facebook",
          color: "#1877F2",
          path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
        },
        pinterest: {
          label: "Pinterest",
          color: "#E60023",
          path: "M12 2C6.48 2 2 6.48 2 12a10 10 0 006.32 9.29c-.14-.7-.26-1.79.05-2.56l1.08-4.58s-.28-.55-.28-1.37c0-1.29.75-2.25 1.68-2.25.79 0 1.18.6 1.18 1.31 0 .8-.51 2-77 3.1-.22.91.45 1.65 1.35 1.65 1.62 0 2.71-2.09 2.71-4.56 0-1.89-1.28-3.21-3.12-3.21-2.12 0-3.37 1.59-3.37 3.23 0 .64.25 1.32.55 1.7a.22.22 0 01.05.21l-.2.83c-.04.14-.12.17-.26.1-.96-.45-1.56-1.86-1.56-2.99 0-2.43 1.82-4.66 5.25-4.66 2.76 0 4.9 1.96 4.9 4.59 0 2.74-1.73 4.95-4.13 4.95-.8 0-1.56-.42-1.82-91l-.5 1.86c-.18.69-.66 1.55-.99 2.08A10 10 0 0022 12c0-5.52-4.48-10-10-10z",
        },
        snapchat: {
          label: "Snapchat",
          color: "#FFFC00",
          path: "M12 2a7.5 7.5 0 00-7.5 7.5v.7c-.21.1-.44.16-.7.16a1.7 1.7 0 01-.95-.3c-.07-.06-.14-.09-.22-.09-.14 0-.27.1-.3.24-.05.33.15.62.65.82.06.03.2.08.34.12a3.3 3.3 0 01-.12.5c0 .44.3.78.71.79.3.01.58-.14.87-.42.05-.05.1-.07.16-.07.05 0 .13.03.2.1.4.4 1.06.87 2.06 1.13.03 0 .05.04.05.07v.1c0 .07-.07.2-.24.33-.39.32-.95.48-1.6.48-.1 0-.22-.01-.33-.01l-.12-.02-.06.11c-.1.17-.21.32-.48.34h-.05c-.04 0-.24.02-.35.09-.14.1-.14.24-.02.34.16.13.43.23.62.29.57.16 1.16.25 1.76.25.28 0 .56-.02.85-.07l.06-.01.06.02c.2.05.41.08.62.08.3 0 .61-.08.89-.23.25.05.5.08.77.08 1 0 2.04-.35 2.71-1.11l.07-.08c.14-.16.26-.34.34-.53.37-.1.7-.25.95-.46.05-.04.08-.08.08-.13 0-.08-.07-.15-.16-.16a.35.35 0 01-.16-.06c-.18-.14-.22-.34-.22-.55v-.03c.3-.29.49-.56.54-.68.15-.32.22-.66.22-1.03v-.08a1.9 1.9 0 01-.64-.15v-.7A7.5 7.5 0 0012 2z",
        },
        threads: {
          label: "Threads",
          color: "#ffffff",
          path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.42 7.49a5.06 5.06 0 00-.22-.1c-.13-2.04-1.22-3.21-3.09-3.22h-.05c-1.11 0-2.04.47-2.6 1.33l1.02.7c.42-.64 1.08-.77 1.58-.77h.03c.61 0 1.07.18 1.37.54.22.26.36.62.43 1.07a7.9 7.9 0 00-1.75-.06c-1.76.1-2.89 1.1-2.82 2.49.04.71.4 1.32.99 1.72.5.34 1.15.51 1.82.47 1.08-.06 1.93-.55 2.43-1.38.38-.63.58-1.44.6-2.47.32.19.59.43.79.73.36.54.43 1.14.2 1.71-.23.56-.71 1.02-1.37 1.3-1.21.52-2.59.46-3.9-.17-1.63-.79-2.5-2.13-2.42-3.78.07-1.47.87-2.74 2.14-3.57 1.08-.73 2.47-1.05 3.96-.89l.12.02c1.24.16 2.2.53 2.9 1.12.64.54 1.04 1.24 1.2 2.08l1.17-.21c-.2-1.07-.7-1.97-1.48-2.64z",
        },
        github: {
          label: "GitHub",
          color: "#ffffff",
          path: "M12 2C6.37 2 2 6.37 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z",
        },
        discord: {
          label: "Discord",
          color: "#5865F2",
          path: "M20.32 4.37a19.8 19.8 0 00-4.88-1.52.07.07 0 00-.08.04 13.8 13.8 0 00-.61 1.25 18.3 18.3 0 00-5.49 0 12.6 12.6 0 00-.62-1.25.08.08 0 00-.08-.04A19.7 19.7 0 003.68 4.37a.07.07 0 00-.03.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 00.03.06 19.9 19.9 0 005.99 3.03.08.08 0 00.08-.03c.46-.63.87-1.3 1.23-2a.08.08 0 00-.04-.1 13.1 13.1 0 01-1.87-.9.08.08 0 010-.13c.13-.09.25-.19.37-.29a.07.07 0 01.08-.01c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 01.08.01c.12.1.24.2.37.29a.08.08 0 010 .13 12.3 12.3 0 01-1.87.89.08.08 0 00-.04.11c.36.7.77 1.36 1.22 1.99a.07.07 0 00.08.03 19.8 19.8 0 006-3.03.08.08 0 00.03-.05c.5-5.18-.84-9.67-3.55-13.66a.06.06 0 00-.03-.03zM8.02 15.33c-1.18 0-2.16-1.09-2.16-2.42s.96-2.42 2.16-2.42c1.21 0 2.18 1.1 2.16 2.42 0 1.33-.95 2.42-2.16 2.42zm7.97 0c-1.18 0-2.16-1.09-2.16-2.42s.96-2.42 2.16-2.42c1.21 0 2.18 1.1 2.16 2.42 0 1.33-.95 2.42-2.16 2.42z",
        },
        behance: {
          label: "Behance",
          color: "#1769FF",
          path: "M22 7h-7V5h7v2zM2 19V5h7.27C12 5 14 6.26 14 9c0 1.57-.79 2.54-2 3.06 1.84.56 3 1.73 3 4 0 2.96-2.31 3-4.37 3H2zm2-8h4.27c1.11 0 1.73-.56 1.73-1.5S9.56 8 8.5 8H4v3zm0 6h4.63C10 17 11 16.5 11 15s-1-2-2.37-2H4v4zm11.5.5c1 .15 1.83-.57 2-1.5H15a3 3 0 003-3 3 3 0 00-3-3 3 3 0 00-3 3h6c-.17 1.03-1 1.85-2 2-.59 0-1.08-.27-1.4-.7H13c.56 1.06 1.66 1.7 2.5 2z",
        },
        dribbble: {
          label: "Dribbble",
          color: "#EA4C89",
          path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.6 4.61a8.5 8.5 0 011.93 5.31c-.28-.05-3.1-.63-5.94-.27-.07-.14-.12-.29-.18-.44a25.4 25.4 0 00-.56-1.24c3.14-1.28 4.58-3.12 4.76-3.36zM12 3.48c2.17 0 4.15.81 5.66 2.15-.15.22-1.44 1.94-4.48 3.08-1.4-2.57-2.95-4.68-3.19-5A8.7 8.7 0 0112 3.48zm-3.63.8a53.9 53.9 0 013.17 4.94c-4 1.06-7.52 1.04-7.9 1.04a8.58 8.58 0 014.73-5.98zM3.45 12v-.26c.37.01 4.51.07 8.78-1.21.25.48.48.97.69 1.45-.11.03-.23.07-.34.1-4.4 1.42-6.74 5.3-6.94 5.63A8.52 8.52 0 013.45 12zm8.55 8.55a8.48 8.48 0 01-5.24-1.8c.15-.31 1.89-3.66 6.7-5.34l.05-.02a35.3 35.3 0 011.82 6.48 8.4 8.4 0 01-3.33.68zm4.76-1.46c-.09-.52-.54-3.01-1.66-6.08 2.68-.42 5.02.27 5.31.37a8.47 8.47 0 01-3.65 5.71z",
        },
        whatsapp: {
          label: "WhatsApp",
          color: "#25D366",
          path: "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.16c-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zm-5.42 7.4h-.004a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26C2.16 6.44 6.6 2 12.05 2c2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 6.99c-.003 5.45-4.437 9.88-9.885 9.88zM20.46 3.53A11.82 11.82 0 0012.05 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.68 1.45h.005c6.56 0 11.89-5.34 11.89-11.9a11.82 11.82 0 00-3.48-8.37z",
        },
      };
      var slStyle = p.style || "cards";
      var slBg = p.bg || "#0a0a0f";
      var slAcc = p.accentColor || "#ec4899";
      var slTxt = p.textColor || "#f7f6f2";
      var slPV = +(p.paddingV || 80);
      var slCols = +(p.columns || 3);
      var slNetworks = p.networks || [];
      var slUsePlat = p.usePlatformColors !== false;
      var slCards = slNetworks
        .map(function (n) {
          var pd = SL_PLAT[n.platform] || {
            label: n.platform,
            color: slAcc,
            path: "M12 2a10 10 0 100 20A10 10 0 0012 2z",
          };
          var ic = slUsePlat ? pd.color : slAcc;
          var icon =
            '<svg class="fw-sl-icon" viewBox="0 0 24 24" fill="' +
            ic +
            '"><path d="' +
            pd.path +
            '"/></svg>';
          if (slStyle === "strip" || slStyle === "icons") {
            return (
              '<a class="fw-sl-chip" href="' +
              (n.url || "#") +
              '" style="--sl-ic:' +
              ic +
              '" title="' +
              pd.label +
              '">' +
              icon +
              "</a>"
            );
          }
          if (slStyle === "minimal") {
            return (
              '<a class="fw-sl-row" href="' +
              (n.url || "#") +
              '" style="--sl-ic:' +
              ic +
              '">' +
              '<span class="fw-sl-row-icon">' +
              icon +
              "</span>" +
              '<span class="fw-sl-row-name" style="color:' +
              slTxt +
              '">' +
              pd.label +
              "</span>" +
              (n.handle && p.showHandles !== false
                ? '<span class="fw-sl-row-handle">' + n.handle + "</span>"
                : "") +
              '<span class="fw-sl-row-arrow" style="color:' +
              slAcc +
              '">→</span>' +
              "</a>"
            );
          }
          if (slStyle === "neon") {
            return (
              '<a class="fw-sl-neon" href="' +
              (n.url || "#") +
              '" style="--sl-ic:' +
              ic +
              ";--sl-bg:" +
              slBg +
              '">' +
              '<div class="fw-sl-neon-icon">' +
              icon +
              "</div>" +
              '<div class="fw-sl-neon-info">' +
              '<span class="fw-sl-neon-name" style="color:' +
              slTxt +
              '">' +
              pd.label +
              "</span>" +
              (n.handle && p.showHandles !== false
                ? '<span class="fw-sl-neon-handle">' + n.handle + "</span>"
                : "") +
              "</div>" +
              (n.followers && p.showFollowers !== false
                ? '<span class="fw-sl-neon-count" style="color:' +
                  ic +
                  '">' +
                  n.followers +
                  "</span>"
                : "") +
              "</a>"
            );
          }
          return (
            '<a class="fw-sl-card" href="' +
            (n.url || "#") +
            '" style="--sl-ic:' +
            ic +
            '">' +
            '<div class="fw-sl-card-icon">' +
            icon +
            "</div>" +
            '<div class="fw-sl-card-info">' +
            '<span class="fw-sl-card-name" style="color:' +
            slTxt +
            '">' +
            pd.label +
            "</span>" +
            (n.handle && p.showHandles !== false
              ? '<span class="fw-sl-card-handle">' + n.handle + "</span>"
              : "") +
            "</div>" +
            (n.followers && p.showFollowers !== false
              ? '<div class="fw-sl-card-followers"><span class="fw-sl-card-count" style="color:' +
                ic +
                '">' +
                n.followers +
                '</span><span class="fw-sl-card-flabel">followers</span></div>'
              : "") +
            "</a>"
          );
        })
        .join("");
      var slTrackStyle =
        slStyle === "strip" || slStyle === "icons"
          ? "display:flex;flex-wrap:wrap;gap:" +
            +(p.gap || 16) +
            "px;align-items:center;justify-content:center"
          : "display:grid;grid-template-columns:repeat(" +
            slCols +
            ",1fr);gap:" +
            +(p.gap || 16) +
            "px";
      return (
        '<div class="fw-sl-wrap fw-entrance" style="background:' +
        slBg +
        ";padding:" +
        slPV +
        'px 3rem">' +
        (p.showLabel !== false && p.label
          ? '<p class="fw-sl-label" style="color:' +
            slAcc +
            '" contenteditable data-field="label">' +
            p.label +
            "</p>"
          : "") +
        (p.headline
          ? '<h2 class="fw-sl-headline" style="color:' +
            slTxt +
            '" contenteditable data-field="headline">' +
            p.headline +
            "</h2>"
          : "") +
        '<div class="fw-sl-track" style="' +
        slTrackStyle +
        '">' +
        slCards +
        "</div>" +
        "</div>"
      );

    case "whatsappWidget":
      var waPhone = (p.phone || "").replace(/[^0-9+]/g, "");
      var waMsg = encodeURIComponent(
        p.message || "Hi! I'd love to find out more.",
      );
      var waHref =
        "https://wa.me/" + waPhone.replace(/^\+/, "") + "?text=" + waMsg;
      var waAcc = p.accentColor || "#25D366";
      var waBg = p.bg || "#0a0a0a";
      var waTxt = p.textColor || "#f7f6f2";
      var waStyle = p.style || "card";
      var waIcon =
        '<svg class="fw-wa-icon" viewBox="0 0 24 24" fill="' +
        waAcc +
        '"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.16c-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zm-5.42 7.4h-.004a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26C2.16 6.44 6.6 2 12.05 2c2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 6.99c-.003 5.45-4.437 9.88-9.885 9.88zM20.46 3.53A11.82 11.82 0 0012.05 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.68 1.45h.005c6.56 0 11.89-5.34 11.89-11.9a11.82 11.82 0 00-3.48-8.37z"/></svg>';
      if (waStyle === "banner") {
        return (
          '<div class="fw-wa-banner fw-entrance" style="background:' +
          waBg +
          ";padding:" +
          +(p.paddingV || 64) * 0.5 +
          "px 3rem;border-left:3px solid " +
          waAcc +
          '">' +
          '<div class="fw-wa-banner-inner">' +
          waIcon +
          '<div class="fw-wa-banner-text">' +
          '<span class="fw-wa-banner-label" style="color:' +
          waTxt +
          '" contenteditable data-field="label">' +
          (p.label || "Chat with us") +
          "</span>" +
          (p.subtext
            ? '<span class="fw-wa-banner-sub" style="color:' +
              waTxt +
              '">' +
              p.subtext +
              "</span>"
            : "") +
          "</div>" +
          '<a class="fw-wa-btn fw-wa-btn--sm" href="' +
          waHref +
          '" style="background:' +
          waAcc +
          ';color:#fff">' +
          (p.buttonText || "Open WhatsApp") +
          "</a>" +
          "</div></div>"
        );
      }
      return (
        '<div class="fw-wa-wrap fw-entrance" style="background:' +
        waBg +
        ";padding:" +
        +(p.paddingV || 64) +
        'px 3rem">' +
        '<div class="fw-wa-card" style="border-color:rgba(' +
        (waBg === "#ffffff" || waBg === "#fff" ? "0,0,0" : "255,255,255") +
        ',0.08)">' +
        '<div class="fw-wa-card-header">' +
        '<div class="fw-wa-avatar" style="background:' +
        (p.avatarBg || "#128C7E") +
        '">' +
        waIcon +
        "</div>" +
        '<div class="fw-wa-card-meta">' +
        '<span class="fw-wa-card-name" style="color:' +
        waTxt +
        '" contenteditable data-field="label">' +
        (p.label || "Chat with us") +
        "</span>" +
        (p.showStatus !== false
          ? '<span class="fw-wa-status"><span class="fw-wa-dot" style="background:' +
            waAcc +
            '"></span><span style="color:' +
            waTxt +
            '">' +
            (p.statusText || "Online now") +
            "</span></span>"
          : "") +
        "</div>" +
        "</div>" +
        '<p class="fw-wa-subtext" style="color:' +
        waTxt +
        '">' +
        (p.subtext || "") +
        "</p>" +
        '<a class="fw-wa-btn" href="' +
        waHref +
        '" style="background:' +
        waAcc +
        ';color:#fff">' +
        waIcon +
        "<span>" +
        (p.buttonText || "Start a conversation") +
        "</span>" +
        "</a>" +
        "</div></div>"
      );

    case "cornerSection":
      return (
        '<div class="fw-corner-block fw-entrance" style="background:' +
        p.bg +
        ';padding:5rem 3rem">' +
        '<div class="fw-corner fw-corner-tl" style="border-color:' +
        p.accentColor +
        '"></div>' +
        '<div class="fw-corner fw-corner-tr" style="border-color:' +
        p.accentColor +
        '"></div>' +
        '<div class="fw-corner fw-corner-bl" style="border-color:' +
        p.accentColor +
        '"></div>' +
        '<div class="fw-corner fw-corner-br" style="border-color:' +
        p.accentColor +
        '"></div>' +
        '<h2 class="fw-corner-headline" style="color:' +
        p.textColor +
        '" contenteditable data-field="headline">' +
        p.headline +
        "</h2>" +
        '<p class="fw-corner-sub" style="color:' +
        p.textColor +
        ';opacity:0.6" contenteditable data-field="subtext">' +
        p.subtext +
        "</p></div>"
      );

    case "horizontalScroll":
      var hsMode = p.mode || "cards";
      var hsStyle = p.cardStyle || "gradient";
      var hsW = +(p.cardWidth || 320);
      var hsGap = +(p.gap || 24);
      var hsAcc = p.accentColor || "#CDFE00";
      var hsTxt = p.textColor || "#f7f6f2";
      var hsBg = p.bg || "#111111";
      var hsPV = +(p.paddingV || 80);
      var hsScrollDist = hsW + hsGap;
      var hsCards2 = (p.cards || [])
        .map(function (c, ci) {
          var num = (ci + 1 < 10 ? "0" : "") + (ci + 1);
          if (hsMode === "timeline") {
            return (
              '<div class="fw-hs-card fw-hs-card--timeline" style="width:' +
              hsW +
              "px;--hs-acc:" +
              hsAcc +
              '">' +
              '<div class="fw-hs-tl-year" style="color:' +
              hsAcc +
              '">' +
              (c.tag || String(2024 - ci)) +
              "</div>" +
              '<div class="fw-hs-tl-dot" style="background:' +
              hsAcc +
              '"></div>' +
              '<h3 class="fw-hs-tl-title" style="color:' +
              hsTxt +
              '">' +
              c.title +
              "</h3>" +
              '<p class="fw-hs-tl-sub" style="color:' +
              hsTxt +
              '">' +
              (c.subtitle || c.category || "") +
              "</p>" +
              "</div>"
            );
          }
          var cardW = hsMode === "featured" ? Math.round(hsW * 1.3) : hsW;
          var aspect =
            hsMode === "showcase"
              ? "padding-top:160%"
              : hsMode === "featured"
                ? "padding-top:56%"
                : "padding-top:70%";
          var numHtml =
            p.showNumbers !== false
              ? '<div class="fw-hs-card-num">' + num + "</div>"
              : "";
          var tagHtml =
            p.showTags !== false && c.tag
              ? '<span class="fw-hs-card-tag" style="background:' +
                hsAcc +
                ';color:#111">' +
                c.tag +
                "</span>"
              : "";
          var catHtml = c.category
            ? '<span class="fw-hs-card-cat">' + c.category + "</span>"
            : "";
          var subHtml =
            p.showSubtitle !== false && c.subtitle
              ? '<p class="fw-hs-card-sub">' + c.subtitle + "</p>"
              : "";
          return (
            '<div class="fw-hs-card fw-hs-card--' +
            hsStyle +
            '" style="width:' +
            cardW +
            'px">' +
            '<div class="fw-hs-card-bg" style="' +
            aspect +
            ";background:" +
            (c.bg || "#222") +
            '"></div>' +
            '<div class="fw-hs-card-overlay">' +
            numHtml +
            '<div class="fw-hs-card-bottom">' +
            (tagHtml || catHtml
              ? '<div class="fw-hs-card-meta">' + tagHtml + catHtml + "</div>"
              : "") +
            '<h3 class="fw-hs-card-title">' +
            c.title +
            "</h3>" +
            subHtml +
            "</div>" +
            "</div>" +
            "</div>"
          );
        })
        .join("");
      var hsArrows =
        p.showArrows !== false
          ? '<div class="fw-hs-arrows">' +
            '<button class="fw-hs-arrow" style="color:' +
            hsTxt +
            "\" onclick=\"var t=this.closest('.fw-hs-wrap').querySelector('.fw-hs-track');t.scrollBy({left:-" +
            hsScrollDist +
            ",behavior:'smooth'})\">" +
            '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 3.5L5.5 9 11 14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            "</button>" +
            '<button class="fw-hs-arrow" style="color:' +
            hsTxt +
            "\" onclick=\"var t=this.closest('.fw-hs-wrap').querySelector('.fw-hs-track');t.scrollBy({left:" +
            hsScrollDist +
            ",behavior:'smooth'})\">" +
            '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 3.5L12.5 9 7 14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            "</button>" +
            "</div>"
          : "";
      var hsProgress =
        p.showProgress !== false
          ? '<div class="fw-hs-progress"><div class="fw-hs-progress-bar" style="background:' +
            hsAcc +
            '"></div></div>'
          : "";
      var hsOnscroll =
        p.showProgress !== false
          ? " onscroll=\"var r=this.scrollLeft/(this.scrollWidth-this.clientWidth||1);this.closest('.fw-hs-wrap').querySelector('.fw-hs-progress-bar').style.width=(r*100)+'%'\""
          : "";
      return (
        '<div class="fw-hs-wrap fw-entrance" style="background:' +
        hsBg +
        ";padding:" +
        hsPV +
        "px 0 " +
        hsPV +
        'px 3rem">' +
        '<div class="fw-hs-header" style="padding-right:3rem;margin-bottom:' +
        (hsMode === "timeline" ? "3rem" : "2rem") +
        '">' +
        "<div>" +
        '<p class="fw-hs-label" style="color:' +
        hsAcc +
        '" contenteditable data-field="label">' +
        (p.label || "") +
        "</p>" +
        '<h2 class="fw-hs-headline" style="color:' +
        hsTxt +
        '" contenteditable data-field="headline">' +
        (p.headline || "") +
        "</h2>" +
        (p.subtext
          ? '<p class="fw-hs-subtext" style="color:' +
            hsTxt +
            '" contenteditable data-field="subtext">' +
            p.subtext +
            "</p>"
          : "") +
        "</div>" +
        hsArrows +
        "</div>" +
        hsProgress +
        '<div class="fw-hs-track" style="gap:' +
        hsGap +
        'px"' +
        hsOnscroll +
        ">" +
        hsCards2 +
        "</div>" +
        "</div>"
      );

    case "ecomProductCard":
      var pcStars = "";
      for (var i = 0; i < Math.floor(p.rating || 0); i++) pcStars += "★";
      return (
        '<div class="fw-ecom-product-card" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<div class="fw-ecom-product-card-img-wrap">' +
        '<img class="fw-ecom-product-card-img" src="' +
        (p.imageUrl || "") +
        '" alt="">' +
        (p.badge
          ? '<span class="fw-ecom-product-card-badge" style="background:' +
            (p.saleColor || "#ef4444") +
            '">' +
            p.badge +
            "</span>"
          : "") +
        "</div>" +
        '<div class="fw-ecom-product-card-body">' +
        '<h3 class="fw-ecom-product-card-title" contenteditable data-field="title">' +
        p.title +
        "</h3>" +
        '<div class="fw-ecom-product-card-rating" style="color:#FFD700">' +
        pcStars +
        (p.reviewCount
          ? ' <span style="opacity:0.5;font-size:12px">(' +
            p.reviewCount +
            ")</span>"
          : "") +
        "</div>" +
        '<div class="fw-ecom-product-card-price">' +
        (p.salePrice
          ? '<span class="original">' +
            p.price +
            '</span><span class="sale" style="color:' +
            (p.saleColor || "#ef4444") +
            '">' +
            p.salePrice +
            "</span>"
          : '<span class="current">' + p.price + "</span>") +
        "</div>" +
        '<button class="fw-ecom-product-card-btn" style="background:' +
        p.accentColor +
        ';color:#111" contenteditable data-field="btnText">' +
        p.btnText +
        "</button></div></div>"
      );

    case "ecomProductGrid":
      var gridCards = (p.products || [])
        .map(function (prod) {
          var gs = "";
          for (var j = 0; j < Math.floor(prod.rating || 0); j++) gs += "★";
          return (
            '<div class="fw-ecom-product-card">' +
            '<div class="fw-ecom-product-card-img-wrap">' +
            '<img class="fw-ecom-product-card-img" src="' +
            (prod.imageUrl || "") +
            '" alt="">' +
            (prod.badge
              ? '<span class="fw-ecom-product-card-badge" style="background:' +
                (p.saleColor || "#ef4444") +
                '">' +
                prod.badge +
                "</span>"
              : "") +
            "</div>" +
            '<div class="fw-ecom-product-card-body">' +
            '<h3 class="fw-ecom-product-card-title">' +
            prod.title +
            "</h3>" +
            '<div class="fw-ecom-product-card-rating" style="color:#FFD700">' +
            gs +
            "</div>" +
            '<div class="fw-ecom-product-card-price">' +
            (prod.salePrice
              ? '<span class="original">' +
                prod.price +
                '</span><span class="sale" style="color:' +
                (p.saleColor || "#ef4444") +
                '">' +
                prod.salePrice +
                "</span>"
              : '<span class="current">' + prod.price + "</span>") +
            "</div>" +
            '<button class="fw-ecom-product-card-btn" style="background:' +
            (p.accentColor || "#CDFE00") +
            ';color:#111">Add to Cart</button></div></div>'
          );
        })
        .join("");
      return (
        '<div class="fw-ecom-product-grid" style="grid-template-columns:repeat(' +
        (p.columns || 3) +
        ",1fr);gap:" +
        (p.gap || 24) +
        "px;background:" +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        gridCards +
        "</div>"
      );

    case "ecomFeaturedProduct":
      return (
        '<div class="fw-ecom-featured" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<div class="fw-ecom-featured-image">' +
        '<img src="' +
        (p.imageUrl || "") +
        '" alt="">' +
        "</div>" +
        '<div class="fw-ecom-featured-details">' +
        '<h2 contenteditable data-field="title">' +
        p.title +
        "</h2>" +
        '<p contenteditable data-field="description">' +
        p.description +
        "</p>" +
        '<div class="fw-ecom-featured-price">' +
        (p.salePrice
          ? '<span class="original">' +
            p.price +
            '</span><span class="sale">' +
            p.salePrice +
            "</span>"
          : "<span>" + p.price + "</span>") +
        "</div>" +
        (p.variants
          ? '<div class="fw-ecom-featured-variants" contenteditable data-field="variants">' +
            p.variants +
            "</div>"
          : "") +
        '<div class="fw-ecom-featured-qty">' +
        "<button>−</button><span>1</span><button>+</button>" +
        "</div>" +
        '<button class="fw-ecom-featured-btn" style="background:' +
        p.accentColor +
        ';color:#111" contenteditable data-field="btnText">' +
        p.btnText +
        "</button></div></div>"
      );

    case "ecomProductCarousel":
      var carouselCards = (p.products || [])
        .map(function (cp) {
          return (
            '<div class="fw-ecom-carousel-card">' +
            '<img src="' +
            (cp.imageUrl || "") +
            '" alt="">' +
            '<div class="fw-ecom-carousel-card-title">' +
            cp.title +
            "</div>" +
            '<div class="fw-ecom-carousel-card-price">' +
            (cp.salePrice
              ? '<span style="text-decoration:line-through;opacity:0.5;font-size:12px">' +
                cp.price +
                '</span> <span style="color:' +
                (p.saleColor || "#ef4444") +
                '">' +
                cp.salePrice +
                "</span>"
              : cp.price) +
            "</div></div>"
          );
        })
        .join("");
      return (
        '<div class="fw-ecom-carousel" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        "<button class=\"fw-ecom-carousel-btn prev\" onclick=\"this.parentElement.querySelector('.fw-ecom-carousel-track').scrollBy({left:-240,behavior:'smooth'})\">‹</button>" +
        '<div class="fw-ecom-carousel-track">' +
        carouselCards +
        "</div>" +
        "<button class=\"fw-ecom-carousel-btn next\" onclick=\"this.parentElement.querySelector('.fw-ecom-carousel-track').scrollBy({left:240,behavior:'smooth'})\">›</button>" +
        "</div>"
      );

    case "ecomQuickView":
      return (
        '<div class="fw-ecom-quickview" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<button class="fw-ecom-quickview-btn" style="border-color:' +
        p.accentColor +
        ";color:" +
        p.accentColor +
        "\" contenteditable data-field=\"triggerText\" onclick=\"this.closest('.fw-ecom-quickview').querySelector('.fw-ecom-quickview-modal').style.display='flex'\">" +
        p.triggerText +
        "</button>" +
        '<div class="fw-ecom-quickview-modal" style="display:none">' +
        '<div class="fw-ecom-quickview-overlay" style="background:rgba(0,0,0,' +
        (p.overlayOpacity || 0.8) +
        ')" onclick="this.parentElement.style.display=\'none\'"></div>' +
        '<div class="fw-ecom-quickview-content" style="background:' +
        (p.modalBg || "#1a1a1a") +
        '">' +
        "<button class=\"fw-ecom-quickview-close\" onclick=\"this.closest('.fw-ecom-quickview-modal').style.display='none'\">×</button>" +
        '<img src="' +
        (p.imageUrl || "") +
        '" alt="">' +
        '<h3 contenteditable data-field="title">' +
        p.title +
        "</h3>" +
        '<div class="price">' +
        (p.salePrice
          ? '<span style="text-decoration:line-through;opacity:0.5">' +
            p.price +
            '</span> <span style="color:' +
            (p.saleColor || "#ef4444") +
            '">' +
            p.salePrice +
            "</span>"
          : p.price) +
        "</div>" +
        '<div class="desc" contenteditable data-field="description">' +
        p.description +
        "</div>" +
        '<button class="add-btn" style="background:' +
        p.accentColor +
        ';color:#111" contenteditable data-field="btnText">' +
        p.btnText +
        "</button></div></div></div>"
      );

    case "ecomCartDrawer":
      return (
        '<div class="fw-ecom-cart-drawer" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<div class="fw-ecom-cart-drawer-header">' +
        "<h3>Your Cart</h3>" +
        '<button class="fw-ecom-cart-drawer-close">×</button>' +
        "</div>" +
        '<div class="fw-ecom-cart-drawer-item">' +
        '<img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120" alt="">' +
        '<div class="fw-ecom-cart-drawer-item-info">' +
        '<div class="fw-ecom-cart-drawer-item-title">Premium Watch</div>' +
        '<div class="fw-ecom-cart-drawer-item-price">£129.00</div>' +
        '<div class="fw-ecom-cart-drawer-qty"><button>−</button><span>1</span><button>+</button></div>' +
        "</div></div>" +
        '<div class="fw-ecom-cart-drawer-item">' +
        '<img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120" alt="">' +
        '<div class="fw-ecom-cart-drawer-item-info">' +
        '<div class="fw-ecom-cart-drawer-item-title">Wireless Headphones</div>' +
        '<div class="fw-ecom-cart-drawer-item-price">£89.00</div>' +
        '<div class="fw-ecom-cart-drawer-qty"><button>−</button><span>2</span><button>+</button></div>' +
        "</div></div>" +
        '<div class="fw-ecom-cart-drawer-footer">' +
        '<div class="fw-ecom-cart-drawer-subtotal"><span>Subtotal</span><span>£307.00</span></div>' +
        '<button class="fw-ecom-cart-drawer-checkout" style="background:' +
        p.accentColor +
        ';color:#111" contenteditable data-field="checkoutBtnText">' +
        p.checkoutBtnText +
        "</button></div></div>"
      );

    case "ecomCartSummary":
      var taxRate = p.taxRate || 20;
      return (
        '<div class="fw-ecom-cart-summary" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        "<h3>Order Summary</h3>" +
        '<div class="fw-ecom-cart-summary-row"><span>Subtotal</span><span>£307.00</span></div>' +
        '<div class="fw-ecom-cart-summary-row"><span>' +
        (p.shippingText || "Shipping") +
        "</span><span>£5.00</span></div>" +
        '<div class="fw-ecom-cart-summary-row"><span>Tax (' +
        taxRate +
        "%)</span><span>£61.40</span></div>" +
        '<div class="fw-ecom-cart-summary-row total"><span>Total</span><span>£373.40</span></div>' +
        '<div class="fw-ecom-cart-summary-coupon">' +
        '<input type="text" placeholder="Promo code">' +
        '<button style="background:' +
        p.accentColor +
        ';color:#111">Apply</button>' +
        "</div></div>"
      );

    case "ecomCheckoutForm":
      return (
        '<div class="fw-ecom-checkout" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<div class="fw-ecom-checkout-form">' +
        '<h2 contenteditable data-field="heading">' +
        p.heading +
        "</h2>" +
        '<div class="fw-ecom-checkout-field"><label>Email</label><input type="email" placeholder="you@example.com"></div>' +
        '<div class="fw-ecom-checkout-row">' +
        '<div class="fw-ecom-checkout-field"><label>First Name</label><input type="text" placeholder="John"></div>' +
        '<div class="fw-ecom-checkout-field"><label>Last Name</label><input type="text" placeholder="Doe"></div>' +
        "</div>" +
        '<div class="fw-ecom-checkout-field"><label>Address</label><input type="text" placeholder="123 Main St"></div>' +
        '<div class="fw-ecom-checkout-row">' +
        '<div class="fw-ecom-checkout-field"><label>City</label><input type="text" placeholder="London"></div>' +
        '<div class="fw-ecom-checkout-field"><label>Postcode</label><input type="text" placeholder="EC1A 1BB"></div>' +
        "</div>" +
        '<div class="fw-ecom-checkout-field"><label>Card Number</label><input type="text" placeholder="4242 4242 4242 4242"></div>' +
        '<div class="fw-ecom-checkout-row">' +
        '<div class="fw-ecom-checkout-field"><label>Expiry</label><input type="text" placeholder="MM/YY"></div>' +
        '<div class="fw-ecom-checkout-field"><label>CVV</label><input type="text" placeholder="123"></div>' +
        "</div>" +
        '<button class="fw-ecom-checkout-submit" style="background:' +
        p.accentColor +
        ';color:#111" contenteditable data-field="btnText">' +
        p.btnText +
        "</button></div>" +
        '<div class="fw-ecom-checkout-summary">' +
        "<h4>Order Summary</h4>" +
        '<div class="fw-ecom-checkout-summary-item">' +
        '<img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80" alt="">' +
        '<div class="fw-ecom-checkout-summary-item-name">Premium Watch × 1</div>' +
        '<div class="fw-ecom-checkout-summary-item-price">£129.00</div>' +
        "</div>" +
        '<div class="fw-ecom-checkout-summary-item">' +
        '<img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80" alt="">' +
        '<div class="fw-ecom-checkout-summary-item-name">Headphones × 2</div>' +
        '<div class="fw-ecom-checkout-summary-item-price">£178.00</div>' +
        "</div>" +
        '<div class="fw-ecom-cart-summary-row" style="margin-top:16px"><span>Subtotal</span><span>£307.00</span></div>' +
        '<div class="fw-ecom-cart-summary-row total"><span>Total</span><span>£373.40</span></div>' +
        "</div></div>"
      );

    case "ecomSaleBanner":
      return (
        '<div class="fw-ecom-sale-banner" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<h2 contenteditable data-field="headline">' +
        p.headline +
        "</h2>" +
        '<p contenteditable data-field="subtext">' +
        p.subtext +
        "</p>" +
        '<a class="fw-ecom-sale-banner-btn" href="' +
        (p.btnUrl || "#") +
        '" style="background:' +
        p.textColor +
        ";color:" +
        p.bg +
        '" contenteditable data-field="btnText">' +
        p.btnText +
        "</a></div>"
      );

    case "ecomCountdown":
      return (
        '<div class="fw-ecom-countdown" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '" data-target-date="' +
        (p.targetDate || "") +
        '">' +
        '<h3 contenteditable data-field="headline">' +
        p.headline +
        "</h3>" +
        '<div class="fw-ecom-countdown-digits">' +
        '<div class="fw-ecom-countdown-digit"><span class="number" style="border-color:' +
        p.accentColor +
        ";color:" +
        p.accentColor +
        '" data-unit="days">12</span><span class="label">Days</span></div>' +
        '<div class="fw-ecom-countdown-digit"><span class="number" style="border-color:' +
        p.accentColor +
        ";color:" +
        p.accentColor +
        '" data-unit="hours">08</span><span class="label">Hours</span></div>' +
        '<div class="fw-ecom-countdown-digit"><span class="number" style="border-color:' +
        p.accentColor +
        ";color:" +
        p.accentColor +
        '" data-unit="minutes">45</span><span class="label">Minutes</span></div>' +
        '<div class="fw-ecom-countdown-digit"><span class="number" style="border-color:' +
        p.accentColor +
        ";color:" +
        p.accentColor +
        '" data-unit="seconds">30</span><span class="label">Seconds</span></div>' +
        "</div></div>"
      );

    case "ecomCouponInput":
      return (
        '<div class="fw-ecom-coupon" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<h3 contenteditable data-field="headline">' +
        p.headline +
        "</h3>" +
        '<div class="fw-ecom-coupon-form">' +
        '<input type="text" placeholder="' +
        (p.placeholder || "Enter code here") +
        '">' +
        '<button style="background:' +
        p.accentColor +
        ';color:#111" contenteditable data-field="btnText">' +
        p.btnText +
        "</button></div></div>"
      );

    case "ecomShippingProgress":
      var pct = Math.min(
        100,
        Math.round(((p.currentAmount || 0) / (p.threshold || 50)) * 100),
      );
      var remaining = Math.max(0, (p.threshold || 50) - (p.currentAmount || 0));
      return (
        '<div class="fw-ecom-shipping" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<h4 contenteditable data-field="headline">' +
        p.headline +
        "</h4>" +
        '<div class="fw-ecom-shipping-bar">' +
        '<div class="fw-ecom-shipping-fill" style="width:' +
        pct +
        "%;background:" +
        p.accentColor +
        '"></div>' +
        "</div>" +
        '<div class="fw-ecom-shipping-text">£<strong>' +
        (p.currentAmount || 0) +
        "</strong> of £<strong>" +
        (p.threshold || 50) +
        "</strong>" +
        (remaining > 0
          ? " — add <strong>£" + remaining + "</strong> more for free shipping!"
          : " — <strong>You qualify for free shipping!</strong>") +
        "</div></div>"
      );

    case "ecomReviews":
      var reviewCards = (p.reviews || [])
        .map(function (r) {
          var rs = "";
          for (var k = 0; k < Math.floor(r.rating || 0); k++) rs += "★";
          return (
            '<div class="fw-ecom-review-card">' +
            '<div class="fw-ecom-review-header">' +
            '<span class="fw-ecom-review-name">' +
            r.name +
            "</span>" +
            '<span class="fw-ecom-review-date">' +
            r.date +
            "</span></div>" +
            '<div class="fw-ecom-review-stars">' +
            rs +
            "</div>" +
            '<div class="fw-ecom-review-text">' +
            r.text +
            "</div></div>"
          );
        })
        .join("");
      var bigStars = "";
      for (var m = 0; m < Math.floor(p.rating || 0); m++) bigStars += "★";
      return (
        '<div class="fw-ecom-reviews" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<div class="fw-ecom-reviews-summary">' +
        '<div class="big-rating">' +
        (p.rating || 0) +
        "</div>" +
        '<div class="stars">' +
        bigStars +
        "</div>" +
        '<div class="count">' +
        (p.reviewCount || 0) +
        " reviews</div></div>" +
        reviewCards +
        "</div>"
      );

    case "ecomFilters":
      var catBtns = (p.categories || [])
        .map(function (c, i) {
          return (
            '<button class="fw-ecom-filter-btn' +
            (i === 0 ? " active" : "") +
            '" style="' +
            (i === 0
              ? "background:" + p.accentColor + ";color:#111;"
              : "background:rgba(255,255,255,0.05);") +
            '">' +
            c +
            "</button>"
          );
        })
        .join("");
      var sortOpts = (p.sortOptions || [])
        .map(function (s) {
          return "<option>" + s + "</option>";
        })
        .join("");
      return (
        '<div class="fw-ecom-filters" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<div class="fw-ecom-filters-top">' +
        '<div class="fw-ecom-filters-cats">' +
        catBtns +
        "</div>" +
        '<div class="fw-ecom-filters-controls">' +
        (p.showPriceRange
          ? '<div class="fw-ecom-filters-price"><label>£<input type="number" value="0" min="0" style="width:60px;padding:6px;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:rgba(255,255,255,0.05);color:inherit;font-family:Lexend,sans-serif;"> — £<input type="number" value="500" min="0" style="width:60px;padding:6px;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:rgba(255,255,255,0.05);color:inherit;font-family:Lexend,sans-serif;"></label></div>'
          : "") +
        '<select class="fw-ecom-filters-sort" style="padding:8px 12px;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:rgba(255,255,255,0.05);color:inherit;font-family:Lexend,sans-serif;">' +
        sortOpts +
        "</select>" +
        (p.showGridToggle
          ? '<div class="fw-ecom-filters-grid-toggle"><button class="active" title="Grid view">⊞</button><button title="List view">☰</button></div>'
          : "") +
        "</div></div>" +
        '<div class="fw-ecom-filters-results" style="color:' +
        p.accentColor +
        '" contenteditable data-field="resultsText">' +
        p.resultsText +
        "</div></div>"
      );

    case "ecomTrustBadges":
      var badgeItems = (p.badges || [])
        .map(function (b) {
          return (
            '<div class="fw-ecom-trust-badge">' +
            '<div class="fw-ecom-trust-badge-icon">' +
            b.icon +
            "</div>" +
            '<div class="fw-ecom-trust-badge-title">' +
            b.title +
            "</div>" +
            '<div class="fw-ecom-trust-badge-desc">' +
            b.desc +
            "</div></div>"
          );
        })
        .join("");
      return (
        '<div class="fw-ecom-trust-badges" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        badgeItems +
        "</div>"
      );

    case "ecomNewsletter":
      return (
        '<div class="fw-ecom-newsletter" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<div class="fw-ecom-newsletter-inner">' +
        '<h2 contenteditable data-field="headline">' +
        p.headline +
        "</h2>" +
        '<p contenteditable data-field="subtext">' +
        p.subtext +
        "</p>" +
        '<div class="fw-ecom-newsletter-form">' +
        '<input type="email" placeholder="' +
        (p.placeholder || "Enter your email") +
        '">' +
        '<button style="background:' +
        p.accentColor +
        ';color:#111" contenteditable data-field="btnText">' +
        p.btnText +
        "</button></div></div></div>"
      );

    case "ecomRelatedProducts":
      var relCards = (p.products || [])
        .map(function (rp) {
          return (
            '<div class="fw-ecom-related-card">' +
            '<div class="fw-ecom-related-card-img-wrap">' +
            '<img src="' +
            (rp.imageUrl || "") +
            '" alt="">' +
            "</div>" +
            '<div class="fw-ecom-related-card-title">' +
            rp.title +
            "</div>" +
            '<div class="fw-ecom-related-card-price">' +
            (rp.salePrice
              ? '<span style="text-decoration:line-through;opacity:0.5;font-size:13px">' +
                rp.price +
                '</span> <span style="color:' +
                (p.saleColor || "#ef4444") +
                '">' +
                rp.salePrice +
                "</span>"
              : rp.price) +
            "</div></div>"
          );
        })
        .join("");
      return (
        '<div class="fw-ecom-related" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<h3 contenteditable data-field="heading">' +
        p.heading +
        "</h3>" +
        '<div class="fw-ecom-related-grid">' +
        relCards +
        "</div></div>"
      );

    case "ecomProductTabs":
      var tabBtns = (p.tabs || [])
        .map(function (t, i) {
          return (
            '<button class="fw-ecom-tab-btn' +
            (i === 0 ? " active" : "") +
            '" style="' +
            (i === 0
              ? "border-bottom-color:" +
                p.accentColor +
                ";color:" +
                p.accentColor +
                ";"
              : "border-bottom-color:transparent;") +
            '" data-tab-index="' +
            i +
            '">' +
            t.label +
            "</button>"
          );
        })
        .join("");
      var tabPanels = (p.tabs || [])
        .map(function (t, i) {
          return (
            '<div class="fw-ecom-tab-panel"' +
            (i === 0 ? "" : ' style="display:none"') +
            ' data-tab="' +
            i +
            '">' +
            t.content +
            "</div>"
          );
        })
        .join("");
      return (
        '<div class="fw-ecom-tabs" style="background:' +
        p.bg +
        ";color:" +
        p.textColor +
        '">' +
        '<div class="fw-ecom-tab-bar">' +
        tabBtns +
        "</div>" +
        '<div class="fw-ecom-tab-content">' +
        tabPanels +
        "</div></div>"
      );

    case "imageBlock":
      return (
        '<div class="fw-image-block" style="text-align:center">' +
        '<img src="' +
        (p.src || "") +
        '" alt="' +
        (p.alt || "") +
        '" style="max-width:100%;height:auto;object-fit:' +
        (p.objectFit || "contain") +
        '">' +
        "</div>"
      );

    default:
      return (
        '<div style="padding:2rem;color:#999">Unknown block type: ' +
        block.type +
        "</div>"
      );
  }
};

FB.canvas.initAnimations = function () {
  if (!("IntersectionObserver" in window)) return;
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );
  document.querySelectorAll(".fw-entrance").forEach(function (el) {
    observer.observe(el);
  });
};

FB.canvas.initWordSwap = function () {
  var containers = document.querySelectorAll(".fw-word-swap-wrap");
  containers.forEach(function (container) {
    var items = container.querySelectorAll(".fw-word-item");
    if (items.length <= 1) return;
    var current = 0;
    var speed = 2500;
    var heroBlock = container.closest(".fw-orbs-hero, .fw-video-hero");
    if (heroBlock) {
      var blockEl = heroBlock.closest(".canvas-block");
      if (blockEl) {
        var blockId = blockEl.getAttribute("data-id");
        var block = FB.state.blocks.find(function (b) {
          return b.id === blockId;
        });
        if (block && block.props.wordSpeed) speed = block.props.wordSpeed;
      }
    }
    setInterval(function () {
      items[current].classList.remove("active");
      current = (current + 1) % items.length;
      items[current].classList.add("active");
    }, speed);
  });
};

FB.canvas.initSplitText = function () {
  if (!("IntersectionObserver" in window)) return;
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target
            .querySelectorAll(".fw-split-char")
            .forEach(function (ch) {
              ch.classList.add("revealed");
            });
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );
  document.querySelectorAll(".fw-split-text-block").forEach(function (el) {
    obs.observe(el);
  });
};

FB.canvas.initMaskReveal = function () {
  if (!("IntersectionObserver" in window)) return;
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );
  document.querySelectorAll(".fw-mask-reveal-block").forEach(function (el) {
    obs.observe(el);
  });
};

FB.canvas.initCounters = function () {
  if (!("IntersectionObserver" in window)) return;
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-target"));
          if (!target) return;
          var suffix = el.textContent.replace(/[0-9]/g, "");
          var current = 0;
          var duration = 2000;
          var step = target / (duration / 16);
          var timer = setInterval(function () {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current) + suffix;
          }, 16);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );
  document.querySelectorAll(".fw-ctr-num[data-target]").forEach(function (el) {
    obs.observe(el);
  });
};

FB.canvas.initGlitch = function () {
  var els = document.querySelectorAll(".fw-glitch-headline");
  els.forEach(function (el) {
    setInterval(
      function () {
        el.style.animation = "none";
        el.offsetHeight;
        el.style.animation = "";
      },
      3000 + Math.random() * 2000,
    );
  });
};

FB.canvas.initParticles = function () {
  document.querySelectorAll(".fw-particle-btn").forEach(function (btn) {
    btn.addEventListener("mouseenter", function () {
      var wrap = btn.closest(".fw-particle-btn-wrap");
      if (!wrap) return;
      wrap.querySelectorAll(".fw-particle").forEach(function (p) {
        p.style.animation = "none";
        p.offsetHeight;
        p.style.animation = "";
      });
    });
  });
};

FB.canvas.initDayNight = function () {
  var display = document.getElementById("fw-dn-time-display");
  if (!display) return;
  function updateTime() {
    var now = new Date();
    var h = now.getHours();
    var phase = "night";
    if (h >= 5 && h < 11) phase = "morning";
    else if (h >= 11 && h < 17) phase = "day";
    else if (h >= 17 && h < 20) phase = "evening";
    var timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    display.textContent =
      phase.charAt(0).toUpperCase() + phase.slice(1) + " \u00b7 " + timeStr;
  }
  updateTime();
  setInterval(updateTime, 1000);
};

FB.canvas.initScrollIndicator = function () {
  var fill = document.querySelector(".fw-scroll-ind-fill");
  if (!fill) return;
  window.addEventListener(
    "scroll",
    function () {
      var h = document.documentElement;
      var pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      fill.style.width = pct + "%";
    },
    { passive: true },
  );
};

FB.canvas.initSvgDraw = function () {
  if (!("IntersectionObserver" in window)) return;
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var text = entry.target.querySelector(".fw-svg-draw-text");
          if (text) {
            var dur = +(entry.target.dataset.animDuration || 3);
            text.style.strokeDashoffset = "0";
            text.style.transition =
              "stroke-dashoffset " + dur + "s cubic-bezier(0.16, 1, 0.3, 1)";
          }
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );
  document
    .querySelectorAll(".fw-svg-draw-block:not([data-svg-initialized])")
    .forEach(function (el) {
      el.setAttribute("data-svg-initialized", "1");
      obs.observe(el);
    });
};

FB.canvas.initCountdown = function () {
  document
    .querySelectorAll(".fw-ecom-countdown[data-target-date]")
    .forEach(function (el) {
      var target = new Date(el.getAttribute("data-target-date")).getTime();
      if (isNaN(target)) return;
      var daysEl = el.querySelector('[data-unit="days"]');
      var hoursEl = el.querySelector('[data-unit="hours"]');
      var minutesEl = el.querySelector('[data-unit="minutes"]');
      var secondsEl = el.querySelector('[data-unit="seconds"]');
      var pad = function (n) {
        return n < 10 ? "0" + n : "" + n;
      };
      var tick = function () {
        var now = Date.now();
        var diff = Math.max(0, target - now);
        var d = Math.floor(diff / 86400000);
        var h = Math.floor((diff % 86400000) / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);
        if (daysEl) daysEl.textContent = pad(d);
        if (hoursEl) hoursEl.textContent = pad(h);
        if (minutesEl) minutesEl.textContent = pad(m);
        if (secondsEl) secondsEl.textContent = pad(s);
        if (diff === 0) clearInterval(interval);
      };
      tick();
      var interval = setInterval(tick, 1000);
    });
};

FB.canvas.initProductTabs = function () {
  document.querySelectorAll(".fw-ecom-tabs").forEach(function (container) {
    var accent = container.style.getPropertyValue("--accent") || "#CDFE00";
    container.querySelectorAll(".fw-ecom-tab-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = this.getAttribute("data-tab-index");
        container.querySelectorAll(".fw-ecom-tab-btn").forEach(function (b) {
          b.classList.remove("active");
          b.style.borderBottomColor = "transparent";
          b.style.color = "inherit";
        });
        this.classList.add("active");
        this.style.borderBottomColor = accent;
        this.style.color = accent;
        container.querySelectorAll(".fw-ecom-tab-panel").forEach(function (pp) {
          pp.style.display = "none";
        });
        var target = container.querySelector(
          '.fw-ecom-tab-panel[data-tab="' + idx + '"]',
        );
        if (target) target.style.display = "block";
      });
    });
  });
};

FB.canvas._loadGoogleFont = function (family) {
  if (!family) return;
  var id = "gf-" + family.replace(/\s+/g, "-").toLowerCase();
  if (document.getElementById(id)) return;
  var link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=" +
    encodeURIComponent(family) +
    ":wght@100;300;400;500;600;700;900&display=swap";
  document.head.appendChild(link);
};

FB.canvas._applyHoverStyles = function (block) {
  var p = block.props || {};
  var styleId = "fb-hover-" + block.id;
  var existing = document.getElementById(styleId);
  var rules = [];
  if (p._hoverBg) rules.push("background:" + p._hoverBg + "!important");
  if (p._hoverOpacity !== undefined && p._hoverOpacity !== "")
    rules.push("opacity:" + p._hoverOpacity);
  if (p._hoverScale && p._hoverScale !== 1)
    rules.push("transform:scale(" + p._hoverScale + ")");
  if (p._hoverTransition) rules.push("transition:" + p._hoverTransition);
  if (!rules.length) {
    if (existing) existing.remove();
    return;
  }
  var css =
    '.canvas-block[data-id="' + block.id + '"]:hover{' + rules.join(";") + "}";
  if (!existing) {
    existing = document.createElement("style");
    existing.id = styleId;
    document.head.appendChild(existing);
  }
  existing.textContent = css;
};

FB.canvas._applyWrapperStyles = function (block, wrapper) {
  if (!wrapper) {
    wrapper = document.querySelector(
      '.canvas-block[data-id="' + block.id + '"]',
    );
  }
  if (!wrapper) return;
  var p = block.props || {};

  // Opacity & z-index
  wrapper.style.opacity = p._opacity !== undefined ? p._opacity : "";
  wrapper.style.zIndex = p._zIndex || "";

  // Transform
  var transforms = [];
  if (p._rotate) transforms.push("rotate(" + p._rotate + "deg)");
  if (p._scale && p._scale !== 1) transforms.push("scale(" + p._scale + ")");
  if (p._translateX) transforms.push("translateX(" + p._translateX + "px)");
  if (p._translateY) transforms.push("translateY(" + p._translateY + "px)");
  if (p._skewX) transforms.push("skewX(" + p._skewX + "deg)");
  if (p._skewY) transforms.push("skewY(" + p._skewY + "deg)");
  wrapper.style.transform = transforms.length ? transforms.join(" ") : "";
  wrapper.style.transformOrigin = p._transformOrigin || "";

  // Spacing
  wrapper.style.lineHeight = p._lineHeight || "";
  wrapper.style.letterSpacing =
    p._letterSpacing !== undefined && p._letterSpacing !== 0
      ? p._letterSpacing + "px"
      : "";
  wrapper.style.wordSpacing =
    p._wordSpacing !== undefined && p._wordSpacing !== 0
      ? p._wordSpacing + "px"
      : "";
  wrapper.style.marginTop =
    p._marginTop !== undefined ? p._marginTop + "px" : "";
  wrapper.style.marginRight =
    p._marginRight !== undefined ? p._marginRight + "px" : "";
  wrapper.style.marginBottom =
    p._marginBottom !== undefined ? p._marginBottom + "px" : "";
  wrapper.style.marginLeft =
    p._marginLeft !== undefined ? p._marginLeft + "px" : "";

  // Dimensions
  wrapper.style.width = p._width ? p._width + (p._widthUnit || "px") : "";
  wrapper.style.minWidth = p._minWidth
    ? p._minWidth + (p._minWidthUnit || "px")
    : "";
  wrapper.style.maxWidth = p._maxWidth
    ? p._maxWidth + (p._maxWidthUnit || "px")
    : "";
  wrapper.style.minHeight = p._minHeight
    ? p._minHeight + (p._minHeightUnit || "px")
    : "";
  wrapper.style.maxHeight = p._maxHeight
    ? p._maxHeight + (p._maxHeightUnit || "px")
    : "";
  wrapper.style.aspectRatio = p._aspectRatio || "";

  // Typography
  if (p._fontFamily) {
    wrapper.style.fontFamily = "'" + p._fontFamily + "', sans-serif";
    wrapper.style.setProperty(
      "--hero-font-family",
      "'" + p._fontFamily + "', sans-serif",
    );
    FB.canvas._loadGoogleFont(p._fontFamily);
  } else {
    wrapper.style.fontFamily = "";
  }
  wrapper.style.fontSize = p._fontSize
    ? p._fontSize + (p._fontSizeUnit || "px")
    : "";
  wrapper.style.fontWeight = p._fontWeight || "";
  wrapper.style.textAlign = p._textAlign || "";

  // Hero-specific font sizing via CSS custom properties
  if (p._heroHeadlineSize) {
    wrapper.style.setProperty(
      "--hero-headline-size",
      p._heroHeadlineSize + "px",
    );
  }
  if (p._heroSubtextSize) {
    wrapper.style.setProperty("--hero-subtext-size", p._heroSubtextSize + "px");
  }
  if (p._fontFamily) {
    wrapper.style.setProperty(
      "--hero-font-family",
      "'" + p._fontFamily + "', sans-serif",
    );
  }
  if (p._textColor) {
    wrapper.style.setProperty("--hero-text-color", p._textColor);
  }
  if (p._subtextColor) {
    wrapper.style.setProperty("--hero-sub-color", p._subtextColor);
  }

  // Line clamp
  if (p._lineClamp && p._lineClamp > 0) {
    wrapper.style.display = "-webkit-box";
    wrapper.style.webkitLineClamp = p._lineClamp;
    wrapper.style.webkitBoxOrient = "vertical";
    wrapper.style.overflow = "hidden";
  } else {
    if (wrapper.style.webkitLineClamp) {
      wrapper.style.display = "";
      wrapper.style.webkitLineClamp = "";
      wrapper.style.webkitBoxOrient = "";
      wrapper.style.overflow = "";
    }
  }

  // Gradient background override
  if (p._bgGradient) {
    wrapper.style.background = p._bgGradient;
  } else {
    wrapper.style.background = "";
  }

  // Background color with optional alpha
  if (!p._bgGradient) {
    if (p._bgAlpha !== undefined && p._bgAlpha < 1) {
      var bgHex = (p.bg || "#111111").replace("#", "");
      var r = parseInt(bgHex.substring(0, 2), 16);
      var g = parseInt(bgHex.substring(2, 4), 16);
      var b2 = parseInt(bgHex.substring(4, 6), 16);
      wrapper.style.backgroundColor =
        "rgba(" + r + "," + g + "," + b2 + "," + p._bgAlpha + ")";
    } else {
      wrapper.style.backgroundColor = p.bg || "";
    }
  }

  // Effects
  wrapper.style.backdropFilter = p._backdropBlur
    ? "blur(" + p._backdropBlur + "px)"
    : "";
  wrapper.style.mixBlendMode = p._mixBlendMode || "";

  // Box shadow
  if (p._shadowX !== undefined) {
    var si = p._shadowInset ? "inset " : "";
    wrapper.style.boxShadow =
      si +
      (p._shadowX || 0) +
      "px " +
      (p._shadowY || 0) +
      "px " +
      (p._shadowBlur !== undefined ? p._shadowBlur : 0) +
      "px " +
      (p._shadowSpread !== undefined ? p._shadowSpread : 0) +
      "px " +
      (p._shadowColor || "rgba(0,0,0,0.3)");
  } else {
    wrapper.style.boxShadow = "";
  }

  // Border
  var bw = p._borderWidth !== undefined ? +p._borderWidth : 0;
  if (bw > 0) {
    wrapper.style.borderWidth = bw + "px";
    wrapper.style.borderStyle = p._borderStyle || "solid";
    wrapper.style.borderColor = p._borderColor || "#333333";
  } else {
    wrapper.style.borderWidth = "";
    wrapper.style.borderStyle = "";
    wrapper.style.borderColor = "";
  }
  wrapper.style.borderRadius =
    p._borderRadius !== undefined ? p._borderRadius + "px" : "";

  // Transition
  wrapper.style.transition = p._transition || "";

  // Animation
  wrapper.classList.forEach(function (c) {
    if (c.startsWith("fb-anim-")) wrapper.classList.remove(c);
  });
  if (p._anim && p._anim !== "none") {
    wrapper.classList.add("fb-anim-" + p._anim);
    wrapper.style.animationDuration = (p._animDuration || 0.6) + "s";
    wrapper.style.animationDelay = (p._animDelay || 0) + "s";
  } else {
    wrapper.style.animationDuration = "";
    wrapper.style.animationDelay = "";
  }

  // Hover styles
  FB.canvas._applyHoverStyles(block);
};

FB.canvas._renderBlock = function (block, parentEl) {
  var wrapper = document.createElement("div");
  wrapper.className = "canvas-block";
  wrapper.dataset.id = block.id;
  wrapper.dataset.type = block.type;
  if (block._locked) wrapper.classList.add("locked");
  if (block.id === FB.state.selectedId) wrapper.classList.add("selected");
  FB.canvas._applyWrapperStyles(block, wrapper);

  var handle = document.createElement("div");
  handle.className = "drag-handle";
  handle.draggable = true;
  handle.innerHTML =
    '<div class="drag-handle-icon"><span></span><span></span><span></span></div>';
  handle.addEventListener("dragstart", function (e) {
    FB.canvas._dragSrcId = block.id;
    FB.canvas._dragLibType = null;
    e.dataTransfer.effectAllowed = "move";
  });

  var controls = document.createElement("div");
  controls.className = "block-controls";
  controls.innerHTML =
    '<button class="bc-btn" title="Lock" onclick="FB.canvas.toggleLock(\'' +
    block.id +
    "')\">" +
    (block._locked ? "\uD83D\uDD13" : "\uD83D\uDD12") +
    "</button>" +
    '<button class="bc-btn" title="Move up" onclick="FB.canvas.moveBlock(\'' +
    block.id +
    "',-1)\">\u2191</button>" +
    '<button class="bc-btn" title="Move down" onclick="FB.canvas.moveBlock(\'' +
    block.id +
    "',1)\">\u2193</button>" +
    '<button class="bc-btn" title="Duplicate" onclick="FB.canvas.duplicateBlock(\'' +
    block.id +
    "')\">\u29C9</button>" +
    '<button class="bc-btn del" title="Delete" onclick="FB.canvas.deleteBlock(\'' +
    block.id +
    "')\">\u2715</button>";

  wrapper.innerHTML = FB.canvas.renderBlockHTML(block);
  wrapper.appendChild(handle);
  wrapper.appendChild(controls);

  // Resize handles
  var resizeR = document.createElement("div");
  resizeR.className = "resize-handle resize-handle-r";
  resizeR.dataset.dir = "r";
  wrapper.appendChild(resizeR);

  var resizeB = document.createElement("div");
  resizeB.className = "resize-handle resize-handle-b";
  resizeB.dataset.dir = "b";
  wrapper.appendChild(resizeB);

  var resizeBR = document.createElement("div");
  resizeBR.className = "resize-handle resize-handle-br";
  resizeBR.dataset.dir = "br";
  wrapper.appendChild(resizeBR);

  // Resize drag logic
  [resizeR, resizeB, resizeBR].forEach(function (rh) {
    rh.addEventListener("mousedown", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var dir = rh.dataset.dir;
      var startX = e.clientX;
      var startY = e.clientY;
      var startW = wrapper.offsetWidth;
      var startH = wrapper.offsetHeight;
      var cursor =
        dir === "r" ? "ew-resize" : dir === "b" ? "ns-resize" : "nwse-resize";
      document.body.style.cursor = cursor;
      document.body.style.userSelect = "none";

      function onMove(ev) {
        var dx = ev.clientX - startX;
        var dy = ev.clientY - startY;
        if (dir === "r" || dir === "br") {
          var newW = Math.max(200, startW + dx);
          wrapper.style.width = newW + "px";
          block.props._width = Math.round(newW);
          block.props._widthUnit = "px";
        }
        if (dir === "b" || dir === "br") {
          var newH = Math.max(100, startH + dy);
          wrapper.style.minHeight = newH + "px";
          block.props._minHeight = Math.round(newH);
          block.props._minHeightUnit = "px";
        }
      }

      function onUp() {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        FB.state.saveHistory();
        FB.panels.renderRightPanel();
      }

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  });

  if (block._name) {
    var label = document.createElement("div");
    label.className = "block-label-overlay";
    label.textContent = block._name;
    wrapper.appendChild(label);
  }

  wrapper.addEventListener("click", function (e) {
    if (e.target.closest(".block-controls") || e.target.closest(".drag-handle"))
      return;
    if (block._locked) return;
    FB.canvas.selectBlockLight(block.id);
  });

  wrapper.addEventListener("dblclick", function (e) {
    if (e.target.closest(".block-controls") || e.target.closest(".drag-handle"))
      return;
    if (block._locked) return;
    FB.canvas.selectBlock(block.id, true);
  });

  wrapper.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    FB.canvas.renameBlock(block.id);
  });

  wrapper.querySelectorAll("[contenteditable]").forEach(function (el) {
    el.addEventListener("blur", function () {
      var field = el.dataset.field;
      if (field) {
        FB.state.saveHistory();
        if (["headline", "quote"].includes(field)) {
          var clone = el.cloneNode(true);
          clone.querySelectorAll(".fw-hero-word").forEach(function (s) {
            while (s.firstChild) s.parentNode.insertBefore(s.firstChild, s);
            s.parentNode.removeChild(s);
          });
          block.props[field] = clone.innerHTML.trim();
        } else {
          block.props[field] = el.textContent.trim();
        }
      }
    });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Escape") el.blur();
    });
  });

  wrapper.addEventListener("dragover", function (e) {
    e.preventDefault();
    wrapper.classList.add("drag-over");
  });
  wrapper.addEventListener("dragleave", function (e) {
    if (!wrapper.contains(e.relatedTarget)) {
      wrapper.classList.remove("drag-over");
    }
  });
  wrapper.addEventListener("drop", function (e) {
    e.preventDefault();
    wrapper.classList.remove("drag-over");
    FB.canvas.handleDrop(block.id);
  });

  parentEl.appendChild(wrapper);

  if (block.type === "row") {
    FB.canvas._renderContainerChildren(block, wrapper);
  } else if (block.type === "container") {
    FB.canvas._renderContainerZone(block, wrapper);
  }
};

FB.canvas._renderContainerZone = function (containerBlock, wrapper) {
  FB.canvas._renderContainerChildren(containerBlock, wrapper);
};

FB.canvas._renderContainerChildren = function (containerBlock, wrapper) {
  var cols = wrapper.querySelectorAll(".fw-col");
  if (!cols || cols.length === 0) return;

  var children = FB.state.blocks.filter(function (b) {
    return b.parentId === containerBlock.id;
  });

  children.forEach(function (child) {
    var colIdx = child.columnIndex !== undefined ? child.columnIndex : 0;
    var colEl = cols[colIdx];
    if (!colEl) return;

    var label = colEl.querySelector(".fw-col-label");
    if (label) label.style.display = "none";

    var dz = FB.canvas.createDropZone(child.id);
    colEl.appendChild(dz);

    FB.canvas._renderBlock(child, colEl);
  });

  for (var ci = 0; ci < cols.length; ci++) {
    var colChildren = children.filter(function (c) {
      return (c.columnIndex !== undefined ? c.columnIndex : 0) === ci;
    });
    if (colChildren.length === 0) {
      var emptyDz = document.createElement("div");
      emptyDz.className = "drop-indicator col-drop";
      emptyDz.style.cssText =
        "min-height:80px;border:2px dashed var(--accent);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--accent);font-size:11px;cursor:pointer;margin:4px;padding:1rem";
      emptyDz.textContent = "+ Drop block here";
      emptyDz.addEventListener("dragover", function (e) {
        e.preventDefault();
        this.style.background = "rgba(205,254,0,0.08)";
      });
      emptyDz.addEventListener("dragleave", function () {
        this.style.background = "transparent";
      });
      emptyDz.addEventListener("drop", function (e) {
        e.preventDefault();
        this.style.background = "transparent";
        var colIdx =
          parseInt(this.parentElement ? this.parentElement.dataset.col : "0") ||
          0;
        FB.canvas.handleDropIntoContainer(containerBlock.id, colIdx, null);
      });
      cols[ci].appendChild(emptyDz);
    } else {
      var endDz = document.createElement("div");
      endDz.className = "drop-indicator";
      endDz.dataset.parentId = containerBlock.id;
      endDz.dataset.colIdx = ci;
      endDz.addEventListener("dragover", function (e) {
        e.preventDefault();
        this.classList.add("active");
      });
      endDz.addEventListener("dragleave", function () {
        this.classList.remove("active");
      });
      endDz.addEventListener("drop", function (e) {
        e.preventDefault();
        this.classList.remove("active");
        FB.canvas.handleDropIntoContainer(
          this.dataset.parentId,
          parseInt(this.dataset.colIdx) || 0,
          null,
        );
      });
      cols[ci].appendChild(endDz);
    }
  }
};

FB.canvas.render = function () {
  var canvas = document.getElementById("canvas");
  canvas.innerHTML = "";
  if (FB.state.blocks.length === 0) {
    canvas.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;color:#aaa;gap:16px;padding:3rem;text-align:center">' +
      '<div style="font-size:48px">\u229E</div>' +
      '<div style="font-size:18px;font-weight:300">Click a section from the left panel to add it</div>' +
      '<div style="font-size:13px">or drag blocks onto the canvas</div></div>';
    return;
  }

  var topBlocks = FB.state.blocks.filter(function (b) {
    return !b.parentId;
  });
  topBlocks.forEach(function (block) {
    var dz = FB.canvas.createDropZone(block.id);
    canvas.appendChild(dz);
    FB.canvas._renderBlock(block, canvas);
  });

  canvas.appendChild(FB.canvas.createDropZone(null));
  setTimeout(function () {
    FB.canvas.initTWM();
    FB.canvas.initHtmlEmbeds();
    FB.canvas.initSplitText();
    FB.canvas.initMaskReveal();
    FB.canvas.initCounters();
    FB.canvas.initGlitch();
    FB.canvas.initParticles();
    FB.canvas.initDayNight();
    FB.canvas.initScrollIndicator();
    FB.canvas.initSvgDraw();
    FB.canvas.initCountdown();
    FB.canvas.initProductTabs();
    if (typeof window._VeltroInitAll === "function") window._VeltroInitAll();
    if (typeof FB.panels.initLottie === "function") FB.panels.initLottie();
    if (typeof FB.panels.initMotionBlock === "function")
      FB.panels.initMotionBlock();
  }, 0);
  FB.panels.renderLayers();
};

FB.canvas.createDropZone = function (beforeId) {
  var dz = document.createElement("div");
  dz.className = "drop-indicator";
  dz.dataset.before = beforeId || "";
  dz.addEventListener("dragover", function (e) {
    e.preventDefault();
    dz.classList.add("active");
  });
  dz.addEventListener("dragleave", function () {
    dz.classList.remove("active");
  });
  dz.addEventListener("drop", function (e) {
    e.preventDefault();
    dz.classList.remove("active");
    FB.canvas.handleDrop(beforeId);
  });
  return dz;
};

FB.canvas.handleDropIntoContainer = function (parentId, colIdx, beforeId) {
  if (FB.canvas._dragLibType) {
    FB.state.saveHistory();
    var allDefs = Object.assign(
      {},
      FB.blocks.BLOCK_DEFS,
      FB.blocks.CUSTOM_BLOCK_DEFS,
      FB.blocks.ECOMMERCE_DEFS || {},
      FB.widgets._registry,
    );
    var def = allDefs[FB.canvas._dragLibType];
    if (!def) return;
    var block = {
      id: FB.state.genId(),
      type: FB.canvas._dragLibType,
      props: JSON.parse(JSON.stringify(def.defaultProps)),
      parentId: parentId,
      columnIndex: colIdx || 0,
    };
    FB.canvas._dragLibType = null;
    FB.canvas._insertBlockInState(block, beforeId, parentId);
    FB.canvas.render();
    FB.canvas.selectBlock(block.id);
  } else if (FB.canvas._dragSrcId) {
    FB.state.saveHistory();
    var srcIdx = FB.state.blocks.findIndex(function (b) {
      return b.id === FB.canvas._dragSrcId;
    });
    if (srcIdx === -1) return;
    var moved = FB.state.blocks.splice(srcIdx, 1)[0];
    moved.parentId = parentId;
    moved.columnIndex = colIdx || 0;
    FB.canvas._dragSrcId = null;
    FB.canvas._insertBlockInState(moved, beforeId, parentId);
    FB.canvas.render();
    FB.canvas.selectBlock(moved.id);
  }
};

FB.canvas._insertBlockInState = function (block, beforeId, parentId) {
  if (beforeId) {
    var idx = FB.state.blocks.findIndex(function (b) {
      return b.id === beforeId;
    });
    if (idx > -1) {
      FB.state.blocks.splice(idx, 0, block);
      return;
    }
  }
  FB.state.blocks.push(block);
};

FB.canvas.handleDrop = function (targetId) {
  if (FB.canvas._dragLibType) {
    FB.state.saveHistory();
    var allDefs = Object.assign(
      {},
      FB.blocks.BLOCK_DEFS,
      FB.blocks.CUSTOM_BLOCK_DEFS,
      FB.blocks.ECOMMERCE_DEFS || {},
      FB.widgets._registry,
    );
    var def = allDefs[FB.canvas._dragLibType];
    if (!def) return;

    var targetBlock = targetId
      ? FB.state.blocks.find(function (b) {
          return b.id === targetId;
        })
      : null;

    // If target is inside a container, insert into that container instead
    if (targetBlock && targetBlock.parentId) {
      FB.canvas.handleDropIntoContainer(
        targetBlock.parentId,
        targetBlock.columnIndex || 0,
        targetId,
      );
      FB.canvas._dragLibType = null;
      return;
    }

    if (
      targetBlock &&
      (targetBlock.type === "row" || targetBlock.type === "container")
    ) {
      FB.canvas.handleDropIntoContainer(targetBlock.id, 0, null);
      FB.canvas._dragLibType = null;
      return;
    }

    var block = {
      id: FB.state.genId(),
      type: FB.canvas._dragLibType,
      props: JSON.parse(JSON.stringify(def.defaultProps)),
    };
    if (targetId) {
      var idx = FB.state.blocks.findIndex(function (b) {
        return b.id === targetId;
      });
      FB.state.blocks.splice(idx, 0, block);
    } else {
      FB.state.blocks.push(block);
    }
    FB.canvas._dragLibType = null;
    FB.canvas.render();
    FB.canvas.selectBlock(block.id);
  } else if (
    FB.canvas._dragSrcId &&
    targetId &&
    FB.canvas._dragSrcId !== targetId
  ) {
    var srcBlock = FB.state.blocks.find(function (b) {
      return b.id === FB.canvas._dragSrcId;
    });
    var tgtBlock = FB.state.blocks.find(function (b) {
      return b.id === targetId;
    });
    if (!srcBlock) return;

    if (
      tgtBlock &&
      (tgtBlock.type === "row" ||
        tgtBlock.type === "container" ||
        tgtBlock.parentId)
    ) {
      var containerId =
        tgtBlock.type === "row" || tgtBlock.type === "container"
          ? tgtBlock.id
          : tgtBlock.parentId;
      FB.state.saveHistory();
      var srcIdx = FB.state.blocks.findIndex(function (b) {
        return b.id === FB.canvas._dragSrcId;
      });
      var moved = FB.state.blocks.splice(srcIdx, 1)[0];
      moved.parentId = containerId;
      moved.columnIndex = tgtBlock.columnIndex || 0;
      FB.canvas._dragSrcId = null;
      var insertBefore = tgtBlock.parentId === containerId ? targetId : null;
      FB.canvas._insertBlockInState(moved, insertBefore, containerId);
      FB.canvas.render();
      FB.canvas.selectBlock(moved.id);
      return;
    }

    FB.state.saveHistory();
    var srcIdx = FB.state.blocks.findIndex(function (b) {
      return b.id === FB.canvas._dragSrcId;
    });
    var tgtIdx = FB.state.blocks.findIndex(function (b) {
      return b.id === targetId;
    });
    // Clear parentId when moving to top-level
    var moved = FB.state.blocks.splice(srcIdx, 1)[0];
    delete moved.parentId;
    delete moved.columnIndex;
    FB.state.blocks.splice(tgtIdx, 0, moved);
    FB.canvas._dragSrcId = null;
    FB.canvas.render();
  }
};

FB.canvas.selectBlock = function (id) {
  FB.state.selectedId = id;
  document.querySelectorAll(".canvas-block").forEach(function (el) {
    el.classList.toggle("selected", el.dataset.id === id);
  });
  FB.panels.renderRightPanel();
  FB.panels.renderLayers();
  document.getElementById("right-panel").classList.remove("collapsed");
  FB.panels.updatePanelsCollapsed();
  var el = document.querySelector('.canvas-block[data-id="' + id + '"]');
  if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

// Single-click selection — just selects visually, no right panel
FB.canvas.selectBlockLight = function (id) {
  FB.state.selectedId = id;
  document.querySelectorAll(".canvas-block").forEach(function (el) {
    el.classList.toggle("selected", el.dataset.id === id);
  });
  FB.panels.renderLayers();
};

FB.canvas._duplicateRecursive = function (src, idMap) {
  idMap = idMap || {};
  var newId = FB.state.genId();
  idMap[src.id] = newId;
  var clone = Object.assign({}, src, {
    id: newId,
    props: JSON.parse(JSON.stringify(src.props)),
    _name: src._name ? src._name + " (copy)" : undefined,
  });
  delete clone.parentId;
  delete clone.columnIndex;
  return clone;
};

FB.canvas.insertBlock = function (type, afterId) {
  FB.state.saveHistory();

  var targetBlock = afterId
    ? FB.state.blocks.find(function (b) {
        return b.id === afterId;
      })
    : null;

  if (targetBlock && targetBlock.parentId) {
    FB.canvas.insertBlockIntoContainer(
      type,
      targetBlock.parentId,
      targetBlock.columnIndex || 0,
      afterId,
    );
    return;
  }

  var allDefs = Object.assign(
    {},
    FB.blocks.BLOCK_DEFS,
    FB.blocks.CUSTOM_BLOCK_DEFS,
    FB.blocks.ECOMMERCE_DEFS || {},
    FB.widgets._registry,
  );
  var def = allDefs[type];
  if (!def) return;
  var block = {
    id: FB.state.genId(),
    type: type,
    props: JSON.parse(JSON.stringify(def.defaultProps)),
  };
  if (afterId) {
    var idx = FB.state.blocks.findIndex(function (b) {
      return b.id === afterId;
    });
    FB.state.blocks.splice(idx + 1, 0, block);
  } else {
    FB.state.blocks.push(block);
  }
  FB.canvas.render();
  FB.canvas.selectBlock(block.id);
  FB.util.showToast(def.label + " added");
};

FB.canvas.insertBlockIntoContainer = function (
  type,
  parentId,
  colIdx,
  beforeId,
) {
  FB.state.saveHistory();
  var allDefs = Object.assign(
    {},
    FB.blocks.BLOCK_DEFS,
    FB.blocks.CUSTOM_BLOCK_DEFS,
    FB.blocks.ECOMMERCE_DEFS || {},
    FB.widgets._registry,
  );
  var def = allDefs[type];
  if (!def) return;
  var block = {
    id: FB.state.genId(),
    type: type,
    props: JSON.parse(JSON.stringify(def.defaultProps)),
    parentId: parentId,
    columnIndex: colIdx || 0,
  };
  FB.canvas._insertBlockInState(block, beforeId, parentId);
  FB.canvas.render();
  FB.canvas.selectBlock(block.id);
  FB.util.showToast(def.label + " added");
};

FB.canvas.deleteBlock = function (id) {
  FB.state.saveHistory();

  var toDelete = [id];
  var children = FB.state.blocks.filter(function (b) {
    return b.parentId === id;
  });
  children.forEach(function (c) {
    toDelete.push(c.id);
  });

  FB.state.blocks = FB.state.blocks.filter(function (b) {
    return toDelete.indexOf(b.id) === -1;
  });
  if (FB.state.selectedId && toDelete.indexOf(FB.state.selectedId) > -1) {
    FB.state.selectedId = null;
    FB.panels.renderRightPanel();
  }
  FB.canvas.render();
  FB.util.showToast("Block removed");
};

FB.canvas.moveBlock = function (id, dir) {
  FB.state.saveHistory();
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;

  var siblings = FB.state.blocks.filter(function (b) {
    return (b.parentId || null) === (block.parentId || null);
  });
  var idx = siblings.indexOf(block);
  var newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= siblings.length) return;

  var srcIdx = FB.state.blocks.indexOf(block);
  var tgtBlock = siblings[newIdx];
  var tgtIdx = FB.state.blocks.indexOf(tgtBlock);
  var tmp = FB.state.blocks[srcIdx];
  FB.state.blocks[srcIdx] = FB.state.blocks[tgtIdx];
  FB.state.blocks[tgtIdx] = tmp;
  FB.canvas.render();
};

FB.canvas.duplicateBlock = function (id) {
  FB.state.saveHistory();
  var src = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!src) return;

  var clone = FB.canvas._duplicateRecursive(src);
  clone.parentId = src.parentId;
  clone.columnIndex = src.columnIndex;

  var children = FB.state.blocks.filter(function (b) {
    return b.parentId === id;
  });
  var childClones = [];
  var idMap = {};
  children.forEach(function (child) {
    var childClone = FB.canvas._duplicateRecursive(child);
    childClone.parentId = clone.id;
    childClone.columnIndex = child.columnIndex;
    childClones.push(childClone);
  });

  var idx = FB.state.blocks.findIndex(function (b) {
    return b.id === id;
  });
  FB.state.blocks.splice(idx + 1, 0, clone);
  childClones.forEach(function (cc) {
    FB.state.blocks.splice(idx + 1 + childClones.indexOf(cc) + 1, 0, cc);
  });
  FB.canvas.render();
  FB.canvas.selectBlock(clone.id);
  FB.util.showToast("Block duplicated");
};

FB.canvas.clearCanvas = function () {
  if (!FB.state.blocks.length) return;
  if (!confirm("Clear the canvas? This cannot be undone.")) return;
  FB.state.saveHistory();
  FB.state.blocks = [];
  FB.state.selectedId = null;
  FB.canvas.render();
  FB.panels.renderRightPanel();
  FB.util.showToast("Canvas cleared");
};

FB.canvas.togglePreview = function () {
  document.body.classList.toggle("preview");
  var btn = document.getElementById("preview-btn");
  var isPrev = document.body.classList.contains("preview");
  btn.classList.toggle("active", isPrev);
  var label = btn.querySelector("span");
  if (label) label.textContent = isPrev ? "Edit" : "Preview";
  if (!isPrev) {
    FB.canvas.render();
    if (FB.state.selectedId) FB.canvas.selectBlock(FB.state.selectedId);
  }
};

FB.canvas.refreshBlock = function (id) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  var wrapper = document.querySelector('.canvas-block[data-id="' + id + '"]');
  if (!wrapper) return;
  var handle = wrapper.querySelector(".drag-handle");
  var controls = wrapper.querySelector(".block-controls");
  wrapper.innerHTML = FB.canvas.renderBlockHTML(block);
  if (handle) wrapper.appendChild(handle);
  if (controls) wrapper.appendChild(controls);
  wrapper.querySelectorAll("[contenteditable]").forEach(function (el) {
    el.addEventListener("blur", function () {
      var field = el.dataset.field;
      if (field) {
        FB.state.saveHistory();
        if (["headline", "quote"].includes(field))
          block.props[field] = el.innerHTML;
        else block.props[field] = el.textContent.trim();
      }
    });
  });
  if (block.type === "container") {
    FB.canvas._renderContainerZone(block, wrapper);
  } else if (block.type === "row") {
    FB.canvas._renderContainerChildren(block, wrapper);
  }
  FB.canvas._applyWrapperStyles(block, wrapper);
  if (typeof window._VeltroInitAll === "function") {
    setTimeout(function () {
      window._VeltroInitAll();
    }, 0);
  }
};

FB.canvas.toggleLock = function (id) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  block._locked = !block._locked;
  FB.canvas.render();
};

FB.canvas.renameBlock = function (id) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  var def =
    FB.blocks.BLOCK_DEFS[block.type] ||
    FB.blocks.CUSTOM_BLOCK_DEFS[block.type] ||
    (FB.blocks.ECOMMERCE_DEFS && FB.blocks.ECOMMERCE_DEFS[block.type]);
  var name = prompt(
    "Block name:",
    block._name || (def ? def.label : block.type),
  );
  if (name) {
    block._name = name.trim();
    FB.canvas.render();
  }
};

// ── ANIMATIONS ──

FB.canvas.animSettings = {
  cursor: true,
  entrances: true,
  heroReveal: true,
  parallax: true,
  testimonialAuto: true,
  speed: 1.0,
};

FB.canvas.initAnimations = function () {
  var s = FB.canvas.animSettings;

  // Page enter transition
  var enter = document.getElementById("fw-page-enter");
  if (enter) {
    setTimeout(function () {
      enter.classList.add("done");
    }, 100);
  }

  // Scroll reveal observer
  FB.canvas._observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          FB.canvas._observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  // Hero entrance staggering
  if (s.heroReveal) {
    setTimeout(function () {
      document.querySelectorAll(".fw-nav-entrance").forEach(function (el, i) {
        setTimeout(function () {
          el.classList.add("visible");
        }, i * 100);
      });
    }, 400);
    setTimeout(function () {
      document.querySelectorAll(".fw-hero-word").forEach(function (el, i) {
        setTimeout(function () {
          el.classList.add("revealed");
        }, i * 80);
      });
      var heroEls = document.querySelectorAll(
        ".hero-sub, .hero-actions, .hero-ticker",
      );
      heroEls.forEach(function (el, i) {
        setTimeout(
          function () {
            el.classList.add("visible");
          },
          900 + i * 200,
        );
      });
    }, 600);
  }

  // Hero blob parallax
  if (s.parallax) {
    window.addEventListener(
      "scroll",
      function () {
        var blob = document.querySelector(".fw-hero-blob");
        if (blob) {
          blob.style.transform = "translateY(" + window.scrollY * 0.3 + "px)";
        }
      },
      { passive: true },
    );
  }

  // Testimonial carousel auto-rotation
  if (s.testimonialAuto) {
    FB.canvas._testInterval = setInterval(function () {
      var slides = document.querySelectorAll(".fw-testimonial-slide");
      if (slides.length < 2) return;
      var current = document.querySelector(".fw-testimonial-slide.active");
      var next = current && current.nextElementSibling;
      if (!next || !next.classList.contains("fw-testimonial-slide")) {
        next = slides[0];
      }
      slides.forEach(function (s) {
        s.classList.remove("active");
      });
      if (next) next.classList.add("active");
      var dots = document.querySelectorAll(".fw-t-dot");
      dots.forEach(function (d) {
        d.classList.remove("active");
      });
      var idx = Array.prototype.indexOf.call(slides, next);
      if (dots[idx]) dots[idx].classList.add("active");
    }, 4500);
  }

  // Custom cursor
  if (s.cursor) {
    FB.canvas._initCursor();
  }

  // Observe entrance elements
  document.querySelectorAll(".fw-entrance").forEach(function (el) {
    FB.canvas._observer.observe(el);
  });

  // TWM focus controller
  FB.canvas.initTWM();
};

FB.canvas._initCursor = function () {
  var cursor = document.createElement("div");
  cursor.id = "fw-cursor";
  cursor.style.cssText =
    "position:fixed;width:8px;height:8px;background:var(--accent,#CDFE00);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width 0.2s ease,height 0.2s ease;";
  document.body.appendChild(cursor);

  var targetX = 0,
    targetY = 0,
    currentX = 0,
    currentY = 0;

  document.addEventListener("mousemove", function (e) {
    targetX = e.clientX;
    targetY = e.clientY;
  });
  document.addEventListener("mouseleave", function () {});

  function lerp() {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    cursor.style.left = currentX + "px";
    cursor.style.top = currentY + "px";
    requestAnimationFrame(lerp);
  }
  lerp();
};

// TWM focus controller for tiling window manager
FB.canvas.initTWM = function () {
  try {
    document.querySelectorAll(".twm-workspace").forEach(function (ws) {
      if (!ws || !ws.querySelectorAll) return;
      var nodes = ws.querySelectorAll(".twm-node");
      nodes.forEach(function (node) {
        node.addEventListener("mouseenter", function () {
          nodes.forEach(function (n) {
            n.classList.remove("active-focus");
          });
          node.classList.add("active-focus");
        });
      });
    });
  } catch (_) {}
};

FB.canvas.initHtmlEmbeds = function () {
  document.querySelectorAll(".fw-html-embed").forEach(function (el) {
    if (el.shadowRoot) return;
    var wrapper = el.closest(".canvas-block");
    if (!wrapper) return;
    var blockId = wrapper.dataset.id;
    var block = FB.state.blocks.find(function (b) {
      return b.id === blockId;
    });
    if (!block || !block.props || !block.props.html) return;
    try {
      var root = el.attachShadow({ mode: "open" });
      root.innerHTML = block.props.html;
    } catch (_) {}
  });

  // Populate html-embed shadow DOMs
  document.querySelectorAll(".fw-html-embed").forEach(function (el) {
    if (el.shadowRoot) return;
    var wrapper = el.closest(".canvas-block");
    if (!wrapper) return;
    var blockId = wrapper.dataset.id;
    var block = FB.state.blocks.find(function (b) {
      return b.id === blockId;
    });
    if (!block || !block.props || !block.props.html) return;
    try {
      var root = el.attachShadow({ mode: "open" });
      root.innerHTML = block.props.html;
    } catch (_) {}
  });
};

FB.canvas.setDevice = function (device, btn) {
  FB.state.device = device;
  document.querySelectorAll(".dev-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  if (btn) btn.classList.add("active");
  var wrap = document.getElementById("canvas-wrap");
  var canvas = document.getElementById("canvas");
  if (device === "mobile") {
    wrap.classList.add("device-preview");
    canvas.style.cssText =
      "width:390px;min-width:0;max-width:390px;border-radius:44px;box-shadow:0 0 0 1px rgba(255,255,255,0.1),0 30px 80px rgba(0,0,0,0.7);overflow:hidden;transition:all 0.35s cubic-bezier(0.4,0,0.2,1)";
  } else if (device === "tablet") {
    wrap.classList.add("device-preview");
    canvas.style.cssText =
      "width:768px;min-width:0;max-width:768px;border-radius:20px;box-shadow:0 0 0 1px rgba(255,255,255,0.1),0 30px 80px rgba(0,0,0,0.7);overflow:hidden;transition:all 0.35s cubic-bezier(0.4,0,0.2,1)";
  } else {
    wrap.classList.remove("device-preview");
    canvas.style.cssText = "transition:all 0.35s cubic-bezier(0.4,0,0.2,1)";
    setTimeout(function () {
      canvas.style.cssText = "";
    }, 350);
  }
};

FB.canvas.initKeyboard = function () {
  document.addEventListener("keydown", function (e) {
    if (FB.design && FB.design._mode) return;
    var tag = document.activeElement ? document.activeElement.tagName : "";
    var isEditing =
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      (document.activeElement &&
        document.activeElement.contentEditable === "true");
    if (isEditing) return;

    var meta = e.metaKey || e.ctrlKey;

    if (meta && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      FB.state.undo();
      return;
    }
    if (meta && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
      e.preventDefault();
      FB.state.redo();
      return;
    }
    if (meta && e.key === "d") {
      e.preventDefault();
      if (FB.state.selectedId) FB.canvas.duplicateBlock(FB.state.selectedId);
      return;
    }
    if (e.key === "Delete" || e.key === "Backspace") {
      if (FB.state.selectedId) {
        e.preventDefault();
        FB.canvas.deleteBlock(FB.state.selectedId);
      }
      return;
    }
    if (e.key === "Escape") {
      FB.state.selectedId = null;
      document
        .querySelectorAll(".canvas-block.selected")
        .forEach(function (el) {
          el.classList.remove("selected");
        });
      document.getElementById("right-panel").classList.add("collapsed");
      if (FB.panels && FB.panels.updatePanelsCollapsed)
        FB.panels.updatePanelsCollapsed();
    }
    if (e.key === "ArrowUp" && FB.state.selectedId) {
      e.preventDefault();
      FB.canvas.moveBlock(FB.state.selectedId, -1);
    }
    if (e.key === "ArrowDown" && FB.state.selectedId) {
      e.preventDefault();
      FB.canvas.moveBlock(FB.state.selectedId, 1);
    }
  });
};

FB.canvas.initKeyboard();
