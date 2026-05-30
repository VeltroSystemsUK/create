# Agency Patterns Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 15 new block types, 4 style variants, 6 animation presets, and 4 SEO features to the Framework Builder, sourced from analysis of 8 UK web design agency sites.

**Architecture:** Hybrid approach — new block types added to `js/blocks.js` BLOCK_DEFS with render functions in `js/canvas.js`, CSS in `css/blocks.css`, right-panel editors in `js/panels.js`. Style variants extend existing blocks via new props. Animation presets add CSS keyframes + IntersectionObserver. SEO features modify `js/export.js`.

**Tech Stack:** Vanilla JS, CSS keyframes, IntersectionObserver API, string-concatenation HTML rendering (existing pattern)

**Existing patterns to follow:**

- Block defs: `js/blocks.js` — `FB.blocks.BLOCK_DEFS` object with `label`, `sublabel`, `icon`, `iconBg`, `iconColor`, `defaultProps`
- Canvas render: `js/canvas.js` — `FB.canvas.renderBlockHTML` switch statement, returns HTML string with inline styles and `contenteditable` attributes
- Right panel: `js/panels.js` — `FB.panels.renderRightPanel` with `if (block.type === "...")` content sections, shared style/typography/spacing/animation sections
- Export: `js/export.js` — `FB.export.getBlockCSS` extracts CSS by type prefix, `FB.export.generateHTML` builds full HTML
- CSS: `css/blocks.css` — keyframe animations prefixed `fb-`, block styles prefixed `fw-`

---

### Phase 1: CSS Foundation — Animation Presets + Base Styles

**Files:**

- Modify: `css/blocks.css` — add ~200 lines of CSS for 6 new animation presets and base styles for new blocks

- [ ] **Step 1: Add 6 new animation keyframes to the top of `css/blocks.css`**

Append these keyframes after the existing `fb-flip` keyframe (around line 21), before the `[class*="fb-anim-"]` selector block:

```css
/* ── AGENCY PATTERN ANIMATIONS ── */
@keyframes fb-scrollReveal {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes fb-floatOrb {
  0% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -40px) scale(1.1);
  }
  50% {
    transform: translate(-20px, -60px) scale(0.95);
  }
  75% {
    transform: translate(-40px, -20px) scale(1.05);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}
@keyframes fb-neonGlow {
  0%,
  100% {
    box-shadow:
      0 0 5px rgba(205, 254, 0, 0.3),
      0 0 20px rgba(205, 254, 0, 0.1);
  }
  50% {
    box-shadow:
      0 0 15px rgba(205, 254, 0, 0.5),
      0 0 40px rgba(205, 254, 0, 0.2);
  }
}
@keyframes fb-gradientText {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes fb-hoverUnderline {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
@keyframes fb-carouselLoop {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
```

- [ ] **Step 2: Add animation class bindings for the 6 new presets**

Append after the existing `.fb-anim-flip` class (around line 35):

```css
.fb-anim-scrollReveal {
  animation-name: fb-scrollReveal;
}
.fb-anim-floatOrb {
  animation-name: fb-floatOrb;
  animation-iteration-count: infinite;
}
.fb-anim-neonGlow {
  animation-name: fb-neonGlow;
  animation-iteration-count: infinite;
}
.fb-anim-gradientText {
  animation-name: fb-gradientText;
  animation-duration: 4s;
  animation-iteration-count: infinite;
  background-size: 200% 200%;
}
.fb-anim-carouselLoop {
  animation-name: fb-carouselLoop;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
```

- [ ] **Step 3: Add base styles for all 15 new block types**

Append to the end of `css/blocks.css`:

```css
/* ── AGENCY PATTERN BLOCKS ── */

/* videoHero */
.fw-video-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.fw-video-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}
.fw-video-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.fw-video-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 2rem;
}
.fw-video-content h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1rem;
}
.fw-video-content p {
  font-size: 1.125rem;
  opacity: 0.85;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.fw-video-cta-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
.fw-video-cta-primary,
.fw-video-cta-secondary {
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}
.fw-video-cta-primary {
  color: #fff;
}
.fw-video-cta-secondary {
  background: transparent;
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
}
.fw-video-cta-primary:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}
.fw-video-cta-secondary:hover {
  border-color: #fff;
}

/* splitHero */
.fw-split-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  min-height: 80vh;
}
.fw-split-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem;
}
.fw-split-text h1 {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1rem;
}
.fw-split-text p {
  font-size: 1.125rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}
.fw-split-media {
  position: relative;
  overflow: hidden;
}
.fw-split-media iframe,
.fw-split-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
@media (max-width: 768px) {
  .fw-split-hero {
    grid-template-columns: 1fr;
  }
  .fw-split-text {
    padding: 2rem;
  }
}

/* orbsHero */
.fw-orbs-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.fw-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  animation: fb-floatOrb 15s ease-in-out infinite;
}
.fw-orbs-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 2rem;
}
.fw-orbs-content h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1rem;
}
.fw-orbs-content p {
  font-size: 1.125rem;
  opacity: 0.85;
  margin-bottom: 2rem;
}

/* megaNav */
.fw-mega-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  position: relative;
}
.fw-mega-logo {
  font-size: 1.5rem;
  font-weight: 700;
}
.fw-mega-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.fw-mega-links > li {
  position: relative;
}
.fw-mega-links > li > a {
  text-decoration: none;
  padding: 0.5rem 0;
  display: block;
  transition: color 0.3s;
}
.fw-mega-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: inherit;
  padding: 2rem;
  min-width: 600px;
  display: none;
  z-index: 100;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.fw-mega-links > li:hover .fw-mega-dropdown {
  display: block;
}
.fw-mega-grid {
  display: grid;
  gap: 1rem;
}
.fw-mega-link {
  text-decoration: none;
  padding: 0.75rem 0;
  display: block;
  font-size: 1.25rem;
  font-weight: 500;
  transition: color 0.3s;
}
.fw-mega-link:hover {
  opacity: 0.7;
}

/* slideNav */
.fw-slide-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
}
.fw-slide-trigger {
  display: none;
}
.fw-slide-panel {
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow-y: auto;
  padding: 2rem;
}
.fw-slide-trigger:checked ~ .fw-slide-panel {
  right: 0;
}
.fw-slide-panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.fw-slide-panel li {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.fw-slide-panel a {
  display: block;
  padding: 1rem 0;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 500;
}

/* resultsGrid */
.fw-results-grid {
  padding: 4rem 2rem;
}
.fw-results-grid h2 {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.fw-results-grid > p {
  opacity: 0.7;
  margin-bottom: 3rem;
  max-width: 600px;
}
.fw-results-grid-inner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}
.fw-result-card {
  position: relative;
  padding: 2rem;
  border-radius: 16px;
  overflow: hidden;
}
.fw-result-glow {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(205, 254, 0, 0.06) 0%,
    transparent 60%
  );
  pointer-events: none;
}
.fw-result-card:hover .fw-result-glow {
  opacity: 1;
}
.fw-result-type {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.6;
  margin-bottom: 0.25rem;
}
.fw-result-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.fw-result-loc {
  font-size: 0.875rem;
  opacity: 0.6;
  margin-bottom: 1rem;
}
.fw-result-desc {
  font-size: 0.9rem;
  opacity: 0.75;
  margin-bottom: 1.5rem;
}
.fw-metric-box {
  margin-bottom: 1.5rem;
}
.fw-metric-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.fw-metric-label {
  font-size: 0.8rem;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.fw-metric-value {
  font-size: 1rem;
  font-weight: 600;
}
.fw-metric-note {
  font-size: 0.8rem;
  opacity: 0.7;
}
.fw-client-proof {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}
.fw-proof-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.fw-proof-name {
  font-weight: 600;
  font-size: 0.875rem;
}
.fw-proof-brand {
  font-size: 0.75rem;
  opacity: 0.6;
}
.fw-proof-quote {
  font-size: 0.8rem;
  opacity: 0.75;
  font-style: italic;
  margin-top: 0.25rem;
}
.fw-verified {
  display: inline-block;
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

/* glassCards */
.fw-glass-cards {
  padding: 4rem 2rem;
}
.fw-glass-cards h2 {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 3rem;
}
.fw-glass-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
.fw-glass-card {
  padding: 2rem;
  border-radius: 16px;
  transition: all 0.3s ease;
}
.fw-glass-card:hover {
  transform: translateY(-4px);
}
.fw-glass-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.fw-glass-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.fw-glass-card p {
  font-size: 0.9rem;
  opacity: 0.7;
}

/* portfolioGrid */
.fw-portfolio-grid {
  padding: 4rem 2rem;
}
.fw-portfolio-grid h2 {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 3rem;
}
.fw-portfolio-inner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
.fw-portfolio-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/10;
  cursor: pointer;
}
.fw-portfolio-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.fw-portfolio-item:hover img {
  transform: scale(1.05);
}
.fw-portfolio-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s;
}
.fw-portfolio-item:hover .fw-portfolio-overlay {
  opacity: 1;
}
.fw-portfolio-overlay h3 {
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
}
.fw-portfolio-overlay p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

/* clientCarousel */
.fw-client-carousel {
  padding: 3rem 0;
  overflow: hidden;
}
.fw-client-carousel h3 {
  text-align: center;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  opacity: 0.5;
  margin-bottom: 2rem;
}
.fw-carousel-track {
  display: flex;
  gap: 3rem;
  animation: fb-carouselLoop 30s linear infinite;
  width: max-content;
}
.fw-carousel-track:hover {
  animation-play-state: paused;
}
.fw-carousel-logo {
  height: 40px;
  opacity: 0.4;
  transition: opacity 0.3s;
  filter: grayscale(1);
}
.fw-carousel-logo:hover {
  opacity: 0.8;
  filter: grayscale(0);
}

/* trustPill */
.fw-trust-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 100px;
}
.fw-trust-stars {
  display: flex;
  gap: 2px;
}
.fw-star {
  width: 16px;
  height: 16px;
}
.fw-trust-text {
  font-size: 0.875rem;
  line-height: 1.2;
}
.fw-trust-platform {
  font-weight: 600;
}
.fw-trust-verified {
  font-size: 0.7rem;
  opacity: 0.6;
}
.fw-trust-logo {
  width: 20px;
  height: 20px;
}

/* metricBox */
.fw-metric-box-standalone {
  text-align: center;
  padding: 1.5rem;
}
.fw-metric-before {
  font-size: 1rem;
  opacity: 0.5;
  text-decoration: line-through;
}
.fw-metric-arrow {
  font-size: 1.25rem;
  margin: 0 0.5rem;
}
.fw-metric-after {
  font-size: 2rem;
  font-weight: 700;
}
.fw-metric-note-standalone {
  font-size: 0.8rem;
  opacity: 0.6;
  margin-top: 0.5rem;
}

/* wordSwap */
.fw-word-swap-inline {
  display: inline-block;
}
.fw-word-item {
  display: inline-block;
  opacity: 0;
  position: absolute;
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
  transform: translateY(10px);
}
.fw-word-item.active {
  opacity: 1;
  position: relative;
  transform: none;
}
.fw-word-swap-wrap {
  position: relative;
  display: inline-block;
  min-width: 200px;
}
.fw-gradient-lime {
  background: linear-gradient(135deg, #84cc16, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.fw-gradient-teal {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.fw-gradient-rose {
  background: linear-gradient(135deg, #f43f5e, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.fw-gradient-coffee {
  background: linear-gradient(135deg, #92400e, #d97706);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* chatWidget */
.fw-chat-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
}
.fw-chat-toggle:hover {
  transform: scale(1.1);
}
.fw-chat-container {
  position: fixed;
  bottom: 6rem;
  right: 2rem;
  width: 360px;
  max-height: 500px;
  border-radius: 16px;
  overflow: hidden;
  z-index: 999;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
  display: none;
}
.fw-chat-container.open {
  display: flex;
  flex-direction: column;
}
.fw-chat-header {
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.fw-chat-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
}
.fw-chat-body {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}
.fw-chat-message {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  max-width: 85%;
}
.fw-chat-input {
  display: flex;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.fw-chat-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: inherit;
  font-size: 0.875rem;
}
.fw-chat-input button {
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
}

/* cookieConsent */
.fw-cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 2rem;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.fw-cookie-message {
  flex: 1;
  min-width: 200px;
  font-size: 0.875rem;
  opacity: 0.85;
}
.fw-cookie-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.fw-cookie-btn {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
}
.fw-cookie-btn-primary {
  color: #fff;
}
.fw-cookie-btn-secondary {
  background: transparent;
  color: inherit;
  border-color: rgba(255, 255, 255, 0.3);
}
.fw-cookie-btn-tertiary {
  background: transparent;
  color: inherit;
  opacity: 0.6;
}

/* liteVideo */
.fw-lite-video {
  position: relative;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
}
.fw-lite-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.fw-lite-play-btn {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  transition: background 0.3s;
}
.fw-lite-play-btn:hover {
  background: rgba(0, 0, 0, 0.5);
}
.fw-lite-play-btn svg {
  width: 64px;
  height: 64px;
}
.fw-lite-video.loaded .fw-lite-poster,
.fw-lite-video.loaded .fw-lite-play-btn {
  display: none;
}
.fw-lite-video iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Scroll indicator */
.fw-scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}
.fw-scroll-line {
  width: 1px;
  height: 40px;
  margin: 0.5rem auto 0;
  position: relative;
  overflow: hidden;
}
.fw-scroll-line::after {
  content: "";
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: currentColor;
  animation: scrollLine 2s ease-in-out infinite;
}
```

- [ ] **Step 4: Verify CSS file is valid**

Run: Open `framework-builder.html` in browser, verify no console errors related to CSS.

---

### Phase 2: New Block Definitions (15 entries in BLOCK_DEFS)

**Files:**

- Modify: `js/blocks.js` — add 15 new entries to `FB.blocks.BLOCK_DEFS`

- [ ] **Step 1: Add 15 new block definitions to `js/blocks.js`**

Insert these entries into `FB.blocks.BLOCK_DEFS` after the existing `team` block (around line 329, before the closing `};`):

```javascript
  videoHero: {
    label: "Video Hero",
    sublabel: "Full-screen video + dual CTAs",
    icon: "▶",
    iconBg: "#1a1a3a",
    iconColor: "#CDFE00",
    defaultProps: {
      videoUrl: "https://www.codeguys.co.uk/assets/img/Codeguys-Video.webm",
      posterUrl: "",
      headline: "Award-Winning Web Design<br>for Growing Businesses",
      subtext: "We create bespoke websites and digital campaigns that drive real results.",
      ctaPrimary: "Get an Estimate →",
      ctaSecondary: "Free Site Audit",
      overlayColor: "#000000",
      overlayOpacity: 0.6,
      showRating: true,
      ratingText: "5 Rating on Google",
      ratingCount: 5,
      bg: "#111111",
      accentColor: "#CDFE00",
      textColor: "#ffffff",
    },
  },
  splitHero: {
    label: "Split Hero",
    sublabel: "2-col: text + media",
    icon: "◫",
    iconBg: "#2a1a1a",
    iconColor: "#CDFE00",
    defaultProps: {
      eyebrow: "Design · Develop · Deliver",
      headline: "We build better<br>brand <em>experiences.</em>",
      subtext: "From strategy to launch — bold, considered digital work.",
      ctaText: "See our work →",
      embedUrl: "https://player.vimeo.com/video/706573272",
      embedType: "vimeo",
      imageAlt: "Brand work showcase",
      bg: "#f7f6f2",
      accentColor: "#CDFE00",
      textColor: "#111111",
      reverse: false,
    },
  },
  orbsHero: {
    label: "Orbs Hero",
    sublabel: "Animated orbs + word-swap",
    icon: "◉",
    iconBg: "#3a1a2a",
    iconColor: "#CDFE00",
    defaultProps: {
      headline: "We'll get you<br>more ",
      words: [
        { text: "leads ", gradient: "lime" },
        { text: "conversions ", gradient: "teal" },
        { text: "exposure ", gradient: "rose" },
        { text: "customers ", gradient: "coffee" },
      ],
      subtext: "Digital marketing that drives business growth through web design, SEO, and paid ads.",
      ctaText: "See what we do →",
      orbs: [
        { color: "#4b858e", size: 30, x: 10, y: 10, opacity: 0.8 },
        { color: "#d31468", size: 15, x: 5, y: 70, opacity: 0.9 },
        { color: "#b8be14", size: 20, x: 40, y: 60, opacity: 0.6 },
        { color: "#d31468", size: 18, x: 58, y: 85, opacity: 0.8 },
        { color: "#4b858e", size: 22, x: 77, y: 25, opacity: 0.7 },
      ],
      wordSpeed: 2500,
      bg: "#0a0a0a",
      accentColor: "#CDFE00",
      textColor: "#ffffff",
    },
  },
  megaNav: {
    label: "Mega Nav",
    sublabel: "Hover mega-dropdown",
    icon: "▦",
    iconBg: "#1a2a4a",
    iconColor: "#CDFE00",
    defaultProps: {
      logoText: "YourBrand.",
      links: [
        { label: "Philosophy", url: "#" },
        { label: "People", url: "#" },
        { label: "Work", url: "#" },
        { label: "Offering", url: "#", children: [
          { label: "Brand", url: "#" },
          { label: "Digital", url: "#" },
          { label: "Social", url: "#" },
          { label: "Packaging", url: "#" },
        ]},
        { label: "Contact", url: "#" },
      ],
      ctaText: "Start a project",
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
    },
  },
  slideNav: {
    label: "Slide Nav",
    sublabel: "Slide-in mobile menu",
    icon: "☰",
    iconBg: "#2a2a1a",
    iconColor: "#CDFE00",
    defaultProps: {
      logoText: "YourBrand.",
      links: [
        { label: "Home", url: "#" },
        { label: "Services", url: "#", children: [
          { label: "Web Design", url: "#" },
          { label: "SEO", url: "#" },
          { label: "Ads", url: "#" },
        ]},
        { label: "Our Work", url: "#" },
        { label: "About", url: "#" },
        { label: "Contact", url: "#" },
      ],
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
    },
  },
  resultsGrid: {
    label: "Results Grid",
    sublabel: "Case study cards + metrics",
    icon: "▣",
    iconBg: "#1a3a2a",
    iconColor: "#CDFE00",
    defaultProps: {
      label: "Proven Results",
      headline: "Real Growth for Local Businesses",
      subtitle: "We don't just build websites — we improve visibility, speed and conversions.",
      cards: [
        {
          type: "SEO Growth", clientName: "Walking Food Tours UK", location: "Multi-City/UK",
          description: "Local SEO, technical fixes, content optimisation and internal linking.",
          metrics: [{ label: "Monthly clicks", before: "400", after: "1000", note: "+150% in 6 months" }],
          testimonial: { name: "Gareth B.", brand: "Walking Food Tours", quote: "Really proactive and I recommend highly." },
        },
        {
          type: "Bespoke Software", clientName: "CRM System Build", location: "Chester/Cheshire",
          description: "Custom CRM/API to improve workflow and synchronise to payroll.",
          metrics: [{ label: "Processing time", before: "45 min", after: "3 min", note: "93% reduction" }],
          testimonial: { name: "Sarah T.", brand: "Ops Director", quote: "Transformed our workflow completely." },
        },
        {
          type: "Web Design", clientName: "E-commerce Redesign", location: "Liverpool",
          description: "Full redesign with improved UX, faster load times, and mobile-first approach.",
          metrics: [{ label: "Conversion rate", before: "1.2%", after: "3.8%", note: "+216% improvement" }],
          testimonial: { name: "Mike R.", brand: "Retail Co.", quote: "Sales doubled within 3 months." },
        },
      ],
      bg: "#111111",
      accentColor: "#CDFE00",
      textColor: "#ffffff",
    },
  },
  glassCards: {
    label: "Glass Cards",
    sublabel: "Glass-morphism service cards",
    icon: "◇",
    iconBg: "#1a1a2e",
    iconColor: "#CDFE00",
    defaultProps: {
      label: "What we do",
      headline: "Everything you need.",
      cards: [
        { icon: "🎨", title: "Brand Design", description: "Logos, guidelines, and complete brand identities." },
        { icon: "💻", title: "Web Development", description: "Responsive, fast, and accessible websites." },
        { icon: "📱", title: "Mobile Apps", description: "Native and cross-platform applications." },
        { icon: "📈", title: "SEO & Marketing", description: "Data-driven campaigns that convert." },
        { icon: "🔧", title: "Support & Hosting", description: "Reliable infrastructure and ongoing care." },
        { icon: "🤖", title: "AI Integration", description: "Smart automation and AI-powered tools." },
      ],
      bg: "#111111",
      cardBg: "rgba(255,255,255,0.03)",
      cardBorder: "rgba(255,255,255,0.08)",
      accentColor: "#CDFE00",
      textColor: "#ffffff",
    },
  },
  portfolioGrid: {
    label: "Portfolio Grid",
    sublabel: "Image grid + hover overlays",
    icon: "▤",
    iconBg: "#2a1a3a",
    iconColor: "#CDFE00",
    defaultProps: {
      label: "Our Work",
      headline: "Selected Projects.",
      items: [
        { image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600", title: "Project One", category: "Fintech · Platform" },
        { image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", title: "Project Two", category: "SaaS · Brand" },
        { image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600", title: "Project Three", category: "E-commerce · UI" },
        { image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600", title: "Project Four", category: "Mobile · App" },
        { image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600", title: "Project Five", category: "Web · Strategy" },
        { image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600", title: "Project Six", category: "Digital · Campaign" },
      ],
      bg: "#f7f6f2",
      accentColor: "#CDFE00",
      textColor: "#111111",
    },
  },
  clientCarousel: {
    label: "Client Carousel",
    sublabel: "Auto-scrolling logo strip",
    icon: "»",
    iconBg: "#3a3a00",
    iconColor: "#111",
    defaultProps: {
      label: "Trusted by",
      logos: [
        { src: "https://via.placeholder.com/120x40", alt: "Client 1" },
        { src: "https://via.placeholder.com/120x40", alt: "Client 2" },
        { src: "https://via.placeholder.com/120x40", alt: "Client 3" },
        { src: "https://via.placeholder.com/120x40", alt: "Client 4" },
        { src: "https://via.placeholder.com/120x40", alt: "Client 5" },
        { src: "https://via.placeholder.com/120x40", alt: "Client 6" },
        { src: "https://via.placeholder.com/120x40", alt: "Client 7" },
        { src: "https://via.placeholder.com/120x40", alt: "Client 8" },
      ],
      bg: "#f7f6f2",
      speed: 30,
      showArrows: false,
      autoplay: true,
      textColor: "#111111",
    },
  },
  trustPill: {
    label: "Trust Pill",
    sublabel: "Star rating + verification",
    icon: "★",
    iconBg: "#2a2a1a",
    iconColor: "#FFD700",
    defaultProps: {
      stars: 5,
      ratingText: "5 Rating on Google",
      platform: "Google",
      platformLogo: "",
      verifiedDate: "Verified as of May 2026",
      bg: "rgba(255,255,255,0.05)",
      textColor: "#ffffff",
      starColor: "#FFD700",
    },
  },
  metricBox: {
    label: "Metric Box",
    sublabel: "Before → after display",
    icon: "→",
    iconBg: "#1a3a1a",
    iconColor: "#CDFE00",
    defaultProps: {
      label: "Monthly clicks",
      before: "400",
      after: "1000",
      note: "+150% increase in 6 months",
      arrow: "→",
      bg: "rgba(255,255,255,0.03)",
      accentColor: "#CDFE00",
      textColor: "#ffffff",
      animateCounter: true,
    },
  },
  wordSwap: {
    label: "Word Swap",
    sublabel: "Rotating gradient keywords",
    icon: "⇄",
    iconBg: "#3a1a1a",
    iconColor: "#CDFE00",
    defaultProps: {
      prefix: "We'll get you<br>more ",
      words: [
        { text: "leads ", gradient: "lime" },
        { text: "conversions ", gradient: "teal" },
        { text: "exposure ", gradient: "rose" },
        { text: "customers ", gradient: "coffee" },
      ],
      speed: 2500,
      bg: "#0a0a0a",
      textColor: "#ffffff",
    },
  },
  chatWidget: {
    label: "Chat Widget",
    sublabel: "Floating chat bubble",
    icon: "💬",
    iconBg: "#1a2a1a",
    iconColor: "#CDFE00",
    defaultProps: {
      welcomeText: "Hi! How can I assist you today?",
      avatarUrl: "",
      avatarAlt: "Chat",
      bg: "#1a1a2e",
      textColor: "#ffffff",
      accentColor: "#CDFE00",
      statusDot: true,
    },
  },
  cookieConsent: {
    label: "Cookie Consent",
    sublabel: "GDPR consent banner",
    icon: "🍪",
    iconBg: "#3a2a1a",
    iconColor: "#CDFE00",
    defaultProps: {
      title: "We value your privacy",
      message: "We use cookies to enhance your browsing experience and analyse our traffic.",
      acceptText: "Accept All",
      declineText: "Reject All",
      customizeText: "Customise",
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
      categories: [
        { name: "Necessary", description: "Required for basic site functionality.", required: true },
        { name: "Analytics", description: "Help us understand how visitors interact.", required: false },
        { name: "Marketing", description: "Used to deliver relevant advertisements.", required: false },
      ],
    },
  },
  liteVideo: {
    label: "Lite Video",
    sublabel: "Lazy video embed",
    icon: "▶",
    iconBg: "#1a1a3a",
    iconColor: "#CDFE00",
    defaultProps: {
      videoId: "706573272",
      platform: "vimeo",
      posterUrl: "https://i.vimeocdn.com/video/1426239039-d29b3a5c0f39aaf5cdf087be140bf7e64c90386c43c55e1f94d82f6025af37bd-d_1600x900",
      title: "Brand Showreel",
      autoplay: false,
      loop: false,
      bg: "#111111",
    },
  },
```

- [ ] **Step 2: Verify block definitions load**

Open `framework-builder.html` in browser. Check the left panel — all 15 new blocks should appear in the block library with their icons and labels.

---

### Phase 3: Canvas Render Functions (15 new cases)

**Files:**

- Modify: `js/canvas.js` — add 15 new `case` blocks in `FB.canvas.renderBlockHTML` switch statement

- [ ] **Step 1: Add render functions for all 15 new block types**

Insert these cases into the switch statement in `FB.canvas.renderBlockHTML` (after the existing cases, before the `default` or closing brace). Each follows the existing pattern: string concatenation with inline styles and `contenteditable` attributes.

```javascript
    case "videoHero":
      return '<div class="fw-video-hero" style="background:' + p.bg + '">' +
        '<video class="fw-video-bg" autoplay muted loop playsinline' + (p.posterUrl ? ' poster="' + p.posterUrl + '"' : '') + '>' +
        '<source src="' + p.videoUrl + '" type="video/webm"></video>' +
        '<div class="fw-video-overlay" style="background:' + p.overlayColor + ';opacity:' + p.overlayOpacity + '"></div>' +
        '<div class="fw-video-content" style="color:' + p.textColor + '">' +
        '<h1>' + p.headline + '</h1>' +
        '<p>' + p.subtext + '</p>' +
        '<div class="fw-video-cta-group">' +
        '<button class="fw-video-cta-primary" style="background:' + p.accentColor + ';color:' + (p.accentColor === '#CDFE00' ? '#111' : '#fff') + '" contenteditable data-field="ctaPrimary">' + p.ctaPrimary + '</button>' +
        '<button class="fw-video-cta-secondary" contenteditable data-field="ctaSecondary">' + p.ctaSecondary + '</button>' +
        '</div>' +
        (p.showRating ? '<div style="margin-top:2rem">' + FB.canvas.renderTrustPillInline(p) + '</div>' : '') +
        '</div></div>';

    case "splitHero":
      var mediaHtml = p.embedType === 'vimeo'
        ? '<iframe src="https://player.vimeo.com/video/' + p.embedUrl.split('/').pop() + '?background=1&autoplay=1&loop=1&muted=1" frameborder="0" allow="autoplay" style="position:absolute;inset:0;width:100%;height:100%"></iframe>'
        : '<img src="' + p.embedUrl + '" alt="' + p.imageAlt + '" style="width:100%;height:100%;object-fit:cover">';
      var orderStyle = p.reverse ? 'style="direction:rtl"' : '';
      var innerStyle = p.reverse ? 'style="direction:ltr"' : '';
      return '<div class="fw-split-hero" style="background:' + p.bg + '" ' + orderStyle + '>' +
        '<div class="fw-split-text" style="color:' + p.textColor + '" ' + innerStyle + '>' +
        '<p class="fw-hero-eyebrow" style="color:' + p.accentColor + '" contenteditable data-field="eyebrow">' + p.eyebrow + '</p>' +
        '<h1 contenteditable data-field="headline">' + p.headline + '</h1>' +
        '<p contenteditable data-field="subtext">' + p.subtext + '</p>' +
        '<button class="fw-hero-cta" style="background:' + p.accentColor + '" contenteditable data-field="ctaText">' + p.ctaText + '</button>' +
        '</div>' +
        '<div class="fw-split-media">' + mediaHtml + '</div></div>';

    case "orbsHero":
      var orbsHtml = (p.orbs || []).map(function(o, i) {
        return '<div class="fw-orb" style="width:' + o.size + '%;height:' + (o.size * 1.5) + '%;left:' + o.x + '%;top:' + o.y + '%;background:' + o.color + ';opacity:' + o.opacity + ';animation-delay:' + (i * -3) + 's"></div>';
      }).join('');
      var wordsHtml = (p.words || []).map(function(w, i) {
        return '<span class="fw-word-item' + (i === 0 ? ' active' : '') + ' fw-gradient-' + w.gradient + '">' + w.text + '</span>';
      }).join('');
      return '<div class="fw-orbs-hero" style="background:' + p.bg + '">' + orbsHtml +
        '<div class="fw-orbs-content" style="color:' + p.textColor + '">' +
        '<h1>' + p.headline + '<span class="fw-word-swap-wrap">' + wordsHtml + '</span></h1>' +
        '<p contenteditable data-field="subtext">' + p.subtext + '</p>' +
        '<button class="fw-hero-cta" style="background:' + p.accentColor + '" contenteditable data-field="ctaText">' + p.ctaText + '</button>' +
        '</div></div>';

    case "megaNav":
      var megaLinks = (p.links || []).map(function(l) {
        if (l.children && l.children.length) {
          var childrenHtml = l.children.map(function(c) {
            return '<a href="' + c.url + '" class="fw-mega-link">' + c.label + '</a>';
          }).join('');
          return '<li><a href="' + l.url + '">' + l.label + '</a>' +
            '<div class="fw-mega-dropdown"><div class="fw-mega-grid">' + childrenHtml + '</div></div></li>';
        }
        return '<li><a href="' + l.url + '">' + l.label + '</a></li>';
      }).join('');
      return '<nav class="fw-mega-nav" style="background:' + p.bg + '">' +
        '<div class="fw-mega-logo" style="color:' + p.textColor + '" contenteditable data-field="logoText">' + p.logoText + '</div>' +
        '<ul class="fw-mega-links">' + megaLinks + '</ul>' +
        '<button class="fw-nav-cta" style="background:' + p.accentColor + '" contenteditable data-field="ctaText">' + p.ctaText + '</button></nav>';

    case "slideNav":
      var slideLinks = (p.links || []).map(function(l) {
        if (l.children && l.children.length) {
          var subHtml = l.children.map(function(c) {
            return '<li><a href="' + c.url + '" style="font-size:1rem;padding-left:1rem">' + c.label + '</a></li>';
          }).join('');
          return '<li><a href="' + l.url + '" style="font-size:1.5rem">' + l.label + '</a><ul>' + subHtml + '</ul></li>';
        }
        return '<li><a href="' + l.url + '" style="font-size:1.5rem">' + l.label + '</a></li>';
      }).join('');
      return '<div class="fw-slide-nav" style="background:' + p.bg + '">' +
        '<div class="fw-mega-logo" style="color:' + p.textColor + '" contenteditable data-field="logoText">' + p.logoText + '</div>' +
        '<label class="fw-nav-cta" style="background:' + p.accentColor + ';cursor:pointer" for="slide-nav-toggle">Menu</label>' +
        '<input type="checkbox" id="slide-nav-toggle" class="fw-slide-trigger">' +
        '<div class="fw-slide-panel" style="background:' + p.bg + ';color:' + p.textColor + '">' +
        '<label for="slide-nav-toggle" style="cursor:pointer;font-size:2rem;display:block;margin-bottom:2rem">✕</label>' +
        '<ul>' + slideLinks + '</ul></div></div>';

    case "resultsGrid":
      var resultCards = (p.cards || []).map(function(c) {
        var metricsHtml = (c.metrics || []).map(function(m) {
          return '<div class="fw-metric-box"><div class="fw-metric-line">' +
            '<span class="fw-metric-label">' + m.label + '</span>' +
            '<span class="fw-metric-value"><span class="fw-metric-before">' + m.before + '</span>' +
            '<span class="fw-metric-arrow"> → </span>' +
            '<span class="fw-metric-after">' + m.after + '</span></span></div>' +
            '<div class="fw-metric-note">' + m.note + '</div></div>';
        }).join('');
        var t = c.testimonial || {};
        return '<div class="fw-result-card" style="background:' + (p.cardBg || 'rgba(255,255,255,0.03)') + ';border:1px solid ' + (p.cardBorder || 'rgba(255,255,255,0.08)') + '">' +
          '<div class="fw-result-glow"></div>' +
          '<p class="fw-result-type">' + c.type + '</p>' +
          '<h3 class="fw-result-name">' + c.clientName + '</h3>' +
          '<p class="fw-result-loc">' + c.location + '</p>' +
          '<p class="fw-result-desc">' + c.description + '</p>' +
          metricsHtml +
          '<div class="fw-client-proof"><div class="fw-proof-avatar" style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:16px">👤</div>' +
          '<div><div class="fw-proof-name">' + (t.name || '') + '</div><div class="fw-proof-brand">' + (t.brand || '') + '</div>' +
          '<div class="fw-proof-quote">"' + (t.quote || '') + '"</div></div></div>' +
          '<span class="fw-verified">Verified</span></div>';
      }).join('');
      return '<div class="fw-results-grid" style="background:' + p.bg + ';color:' + p.textColor + '">' +
        '<p class="fw-results-label" style="color:' + p.accentColor + '" contenteditable data-field="label">' + p.label + '</p>' +
        '<h2 contenteditable data-field="headline">' + p.headline + '</h2>' +
        '<p contenteditable data-field="subtitle">' + p.subtitle + '</p>' +
        '<div class="fw-results-grid-inner">' + resultCards + '</div></div>';

    case "glassCards":
      var glassCards = (p.cards || []).map(function(c) {
        return '<div class="fw-glass-card" style="background:' + p.cardBg + ';border:1px solid ' + p.cardBorder + '">' +
          '<div class="fw-glass-icon" style="background:' + p.accentColor + '22">' + c.icon + '</div>' +
          '<h3>' + c.title + '</h3><p>' + c.description + '</p></div>';
      }).join('');
      return '<div class="fw-glass-cards" style="background:' + p.bg + ';color:' + p.textColor + '">' +
        '<p style="color:' + p.accentColor + '" contenteditable data-field="label">' + p.label + '</p>' +
        '<h2 contenteditable data-field="headline">' + p.headline + '</h2>' +
        '<div class="fw-glass-grid">' + glassCards + '</div></div>';

    case "portfolioGrid":
      var portItems = (p.items || []).map(function(item) {
        return '<div class="fw-portfolio-item">' +
          '<img src="' + item.image + '" alt="' + item.title + '" loading="lazy">' +
          '<div class="fw-portfolio-overlay"><h3>' + item.title + '</h3><p>' + item.category + '</p></div></div>';
      }).join('');
      return '<div class="fw-portfolio-grid" style="background:' + p.bg + ';color:' + p.textColor + '">' +
        '<p style="color:' + p.accentColor + '" contenteditable data-field="label">' + p.label + '</p>' +
        '<h2 contenteditable data-field="headline">' + p.headline + '</h2>' +
        '<div class="fw-portfolio-inner">' + portItems + '</div></div>';

    case "clientCarousel":
      var logoItems = (p.logos || []).map(function(l) {
        return '<img class="fw-carousel-logo" src="' + l.src + '" alt="' + l.alt + '" loading="lazy">';
      }).join('');
      return '<div class="fw-client-carousel" style="background:' + p.bg + ';color:' + p.textColor + '">' +
        '<h3>' + p.label + '</h3>' +
        '<div class="fw-carousel-track" style="animation-duration:' + p.speed + 's">' +
        logoItems + logoItems + '</div></div>';

    case "trustPill":
      return '<div class="fw-trust-pill" style="background:' + p.bg + ';color:' + p.textColor + '">' +
        '<div class="fw-trust-stars">' +
        Array(p.stars).fill('<svg class="fw-star" viewBox="0 0 24 24" fill="' + p.starColor + '"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.851 1.416 8.26L12 18.902l-7.416 4.957L6 15.599 0 9.748l8.332-1.73z"/></svg>').join('') +
        '</div>' +
        '<div class="fw-trust-text"><div class="fw-trust-platform" contenteditable data-field="ratingText">' + p.ratingText + '</div>' +
        '<div class="fw-trust-verified">' + p.verifiedDate + '</div></div></div>';

    case "metricBox":
      return '<div class="fw-metric-box-standalone" style="background:' + p.bg + ';color:' + p.textColor + '">' +
        '<p style="font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;opacity:0.6;margin-bottom:0.5rem" contenteditable data-field="label">' + p.label + '</p>' +
        '<div><span class="fw-metric-before">' + p.before + '</span>' +
        '<span class="fw-metric-arrow" style="color:' + p.accentColor + '">' + p.arrow + '</span>' +
        '<span class="fw-metric-after" style="color:' + p.accentColor + '"' + (p.animateCounter ? ' data-counter="' + p.after + '"' : '') + '>' + p.after + '</span></div>' +
        '<p class="fw-metric-note-standalone">' + p.note + '</p></div>';

    case "wordSwap":
      var wsItems = (p.words || []).map(function(w, i) {
        return '<span class="fw-word-item' + (i === 0 ? ' active' : '') + ' fw-gradient-' + w.gradient + '">' + w.text + '</span>';
      }).join('');
      return '<div class="fw-orbs-hero" style="background:' + p.bg + ';min-height:50vh">' +
        '<div class="fw-orbs-content" style="color:' + p.textColor + '">' +
        '<h1>' + p.prefix + '<span class="fw-word-swap-wrap">' + wsItems + '</span></h1></div></div>';

    case "chatWidget":
      return '<div class="fw-chat-toggle" style="background:' + p.accentColor + '" onclick="this.nextElementSibling.classList.toggle(\'open\')">' +
        (p.statusDot ? '<span class="fw-chat-status-dot" style="position:absolute;top:0;right:0"></span>' : '') +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + (p.accentColor === '#CDFE00' ? '#111' : '#fff') + '" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>' +
        '<div class="fw-chat-container" style="background:' + p.bg + ';color:' + p.textColor + '">' +
        '<div class="fw-chat-header" style="border-bottom:1px solid rgba(255,255,255,0.1)">' +
        (p.statusDot ? '<span class="fw-chat-status-dot"></span>' : '') +
        '<span contenteditable data-field="welcomeText">' + p.welcomeText + '</span></div>' +
        '<div class="fw-chat-body"><div class="fw-chat-message" style="background:rgba(255,255,255,0.05)">' + p.welcomeText + '</div></div>' +
        '<div class="fw-chat-input"><input type="text" placeholder="Type a message..."><button>➤</button></div></div>';

    case "cookieConsent":
      var catHtml = (p.categories || []).map(function(c) {
        return '<div style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.1)">' +
          '<strong>' + c.name + '</strong>' + (c.required ? ' <span style="font-size:0.7rem;opacity:0.5">Always Active</span>' : '') +
          '<p style="font-size:0.8rem;opacity:0.6;margin-top:0.25rem">' + c.description + '</p></div>';
      }).join('');
      return '<div class="fw-cookie-banner" style="background:' + p.bg + ';color:' + p.textColor + '">' +
        '<div class="fw-cookie-message"><strong>' + p.title + '</strong><br>' + p.message + '</div>' +
        '<div class="fw-cookie-options">' +
        '<button class="fw-cookie-btn fw-cookie-btn-secondary">' + p.declineText + '</button>' +
        '<button class="fw-cookie-btn fw-cookie-btn-tertiary">' + p.customizeText + '</button>' +
        '<button class="fw-cookie-btn fw-cookie-btn-primary" style="background:' + p.accentColor + ';color:' + (p.accentColor === '#CDFE00' ? '#111' : '#fff') + '">' + p.acceptText + '</button>' +
        '</div>' +
        '<div style="width:100%;margin-top:1rem;display:none" id="cookie-categories">' + catHtml + '</div></div>';

    case "liteVideo":
      var embedSrc = p.platform === 'vimeo'
        ? 'https://player.vimeo.com/video/' + p.videoId + '?autoplay=1&muted=1'
        : 'https://www.youtube.com/embed/' + p.videoId + '?autoplay=1&mute=1';
      return '<div class="fw-lite-video" style="background:' + p.bg + '" onclick="this.classList.add(\'loaded\');this.innerHTML=\'<iframe src=' + embedSrc + ' allow=autoplay></iframe>\'">' +
        '<img class="fw-lite-poster" src="' + p.posterUrl + '" alt="' + p.title + '" loading="lazy">' +
        '<div class="fw-lite-play-btn"><svg viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg></div></div>';
```

- [ ] **Step 2: Add helper function for trust pill inline rendering**

Add this helper function before the switch statement in `renderBlockHTML` (around line 16):

```javascript
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
```

- [ ] **Step 3: Verify new blocks render on canvas**

Open `framework-builder.html` in browser. Click each new block in the library — it should appear on the canvas with correct HTML structure.

---

### Phase 4: Right Panel Content Editors

**Files:**

- Modify: `js/panels.js` — add content editor sections for new block types in `renderRightPanel`

- [ ] **Step 1: Add content editors for all 15 new block types**

In `FB.panels.renderRightPanel`, add these blocks after the existing `if (block.type === "cta")` section (around line 573):

```javascript
if (block.type === "videoHero") {
  contentHtml +=
    '<div class="rp-row"><label>Headline (HTML allowed)</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','headline',this.value)\">" +
    p.headline +
    "</textarea></div>";
  contentHtml +=
    '<div class="rp-row"><label>Subtext</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','subtext',this.value)\">" +
    p.subtext +
    "</textarea></div>";
  contentHtml +=
    '<div class="rp-row"><label>Video URL</label><input type="text" value="' +
    p.videoUrl +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','videoUrl',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>CTA Primary</label><input type="text" value="' +
    p.ctaPrimary +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','ctaPrimary',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>CTA Secondary</label><input type="text" value="' +
    p.ctaSecondary +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','ctaSecondary',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label><input type="checkbox" ' +
    (p.showRating ? "checked" : "") +
    " onchange=\"FB.panels.updateProp('" +
    block.id +
    "','showRating',this.checked)\"> Show rating pill</label></div>";
}
if (block.type === "splitHero") {
  contentHtml +=
    '<div class="rp-row"><label>Eyebrow</label><input type="text" value="' +
    p.eyebrow +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','eyebrow',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>Headline (HTML allowed)</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','headline',this.value)\">" +
    p.headline +
    "</textarea></div>";
  contentHtml +=
    '<div class="rp-row"><label>Subtext</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','subtext',this.value)\">" +
    p.subtext +
    "</textarea></div>";
  contentHtml +=
    '<div class="rp-row"><label>CTA Text</label><input type="text" value="' +
    p.ctaText +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','ctaText',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>Media URL</label><input type="text" value="' +
    p.embedUrl +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','embedUrl',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label><input type="checkbox" ' +
    (p.reverse ? "checked" : "") +
    " onchange=\"FB.panels.updateProp('" +
    block.id +
    "','reverse',this.checked)\"> Reverse layout</label></div>";
}
if (block.type === "orbsHero") {
  contentHtml +=
    '<div class="rp-row"><label>Headline prefix</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','headline',this.value)\">" +
    p.headline +
    "</textarea></div>";
  contentHtml +=
    '<div class="rp-row"><label>Subtext</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','subtext',this.value)\">" +
    p.subtext +
    "</textarea></div>";
  contentHtml +=
    '<div class="rp-row"><label>CTA Text</label><input type="text" value="' +
    p.ctaText +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','ctaText',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>Word Speed (ms)</label><input type="number" value="' +
    p.wordSpeed +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','wordSpeed',+this.value)\"></div>";
}
if (block.type === "resultsGrid") {
  contentHtml +=
    '<div class="rp-row"><label>Section Label</label><input type="text" value="' +
    p.label +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','label',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>Headline</label><input type="text" value="' +
    p.headline +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','headline',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>Subtitle</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','subtitle',this.value)\">" +
    p.subtitle +
    "</textarea></div>";
}
if (block.type === "glassCards") {
  contentHtml +=
    '<div class="rp-row"><label>Section Label</label><input type="text" value="' +
    p.label +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','label',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>Headline</label><input type="text" value="' +
    p.headline +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','headline',this.value)\"></div>";
}
if (block.type === "portfolioGrid") {
  contentHtml +=
    '<div class="rp-row"><label>Section Label</label><input type="text" value="' +
    p.label +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','label',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>Headline</label><input type="text" value="' +
    p.headline +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','headline',this.value)\"></div>";
}
if (block.type === "clientCarousel") {
  contentHtml +=
    '<div class="rp-row"><label>Label</label><input type="text" value="' +
    p.label +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','label',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>Speed (s)</label><input type="number" value="' +
    p.speed +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','speed',+this.value)\"></div>";
}
if (block.type === "trustPill") {
  contentHtml +=
    '<div class="rp-row"><label>Rating Text</label><input type="text" value="' +
    p.ratingText +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','ratingText',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>Stars</label><input type="number" value="' +
    p.stars +
    '" min="0" max="5" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','stars',+this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>Verified Date</label><input type="text" value="' +
    p.verifiedDate +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','verifiedDate',this.value)\"></div>";
}
if (block.type === "metricBox") {
  contentHtml +=
    '<div class="rp-row"><label>Label</label><input type="text" value="' +
    p.label +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','label',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>Before</label><input type="text" value="' +
    p.before +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','before',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>After</label><input type="text" value="' +
    p.after +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','after',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>Note</label><input type="text" value="' +
    p.note +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','note',this.value)\"></div>";
}
if (block.type === "wordSwap") {
  contentHtml +=
    '<div class="rp-row"><label>Headline prefix (HTML allowed)</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','prefix',this.value)\">" +
    p.prefix +
    "</textarea></div>";
  contentHtml +=
    '<div class="rp-row"><label>Word Speed (ms)</label><input type="number" value="' +
    p.speed +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','speed',+this.value)\"></div>";
}
if (block.type === "chatWidget") {
  contentHtml +=
    '<div class="rp-row"><label>Welcome Text</label><input type="text" value="' +
    p.welcomeText +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','welcomeText',this.value)\"></div>";
}
if (block.type === "cookieConsent") {
  contentHtml +=
    '<div class="rp-row"><label>Title</label><input type="text" value="' +
    p.title +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','title',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>Message</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','message',this.value)\">" +
    p.message +
    "</textarea></div>";
  contentHtml +=
    '<div class="rp-row"><label>Accept Text</label><input type="text" value="' +
    p.acceptText +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','acceptText',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>Decline Text</label><input type="text" value="' +
    p.acceptText +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','declineText',this.value)\"></div>";
}
if (block.type === "liteVideo") {
  contentHtml +=
    '<div class="rp-row"><label>Video ID</label><input type="text" value="' +
    p.videoId +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','videoId',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>Title</label><input type="text" value="' +
    p.title +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','title',this.value)\"></div>";
  contentHtml +=
    '<div class="rp-row"><label>Poster URL</label><input type="text" value="' +
    p.posterUrl +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','posterUrl',this.value)\"></div>";
}
```

- [ ] **Step 2: Verify right panel editors work**

Open `framework-builder.html`, click each new block type on canvas, verify the right panel shows appropriate content editors. Changing values should update the canvas in real-time.

---

### Phase 5: Style Variants (extend existing blocks)

**Files:**

- Modify: `js/blocks.js` — add variant props to existing block defaultProps
- Modify: `js/canvas.js` — add variant rendering logic
- Modify: `js/panels.js` — add variant selectors to right panel

- [ ] **Step 1: Add `blobStyle` prop to hero block**

In `js/blocks.js`, add to hero `defaultProps`:

```javascript
      blobStyle: "blob", // "blob", "orbs", "gradient", "solid", "video"
```

- [ ] **Step 2: Add `menuStyle` prop to nav block**

In `js/blocks.js`, add to nav `defaultProps`:

```javascript
      menuStyle: "simple", // "simple", "mega", "slide"
```

- [ ] **Step 3: Add `buttonStyle` prop to cta block**

In `js/blocks.js`, add to cta `defaultProps`:

```javascript
      buttonStyle: "filled", // "filled", "outlined", "floating-pulse", "dual"
```

- [ ] **Step 4: Add `layoutStyle` prop to footer block**

In `js/blocks.js`, add to footer `defaultProps`:

```javascript
      layoutStyle: "columns", // "columns", "mega", "minimal"
```

- [ ] **Step 5: Add variant rendering to canvas.js**

In the `case "hero":` section, replace the blob line:

```javascript
// Replace: (p.showBlob ? '<div class="fw-hero-blob"></div>' : "")
// With:
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
    : "");
```

In the `case "nav":` section, wrap the existing render in a style check:

```javascript
// At the start of case "nav":
if (p.menuStyle === "mega") {
  /* render mega nav - same as megaNav block */
} else if (p.menuStyle === "slide") {
  /* render slide nav - same as slideNav block */
} else {
  /* existing simple nav render */
}
```

In the `case "cta":` section, modify the button rendering:

```javascript
// Replace the button line with variant-aware rendering:
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
```

In the `case "footer":` section, add variant logic:

```javascript
// At the start of case "footer":
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
// existing columns render continues for "columns" and "mega"
```

- [ ] **Step 6: Add variant selectors to right panel**

In `js/panels.js`, add these within the existing block type content sections:

For hero (after existing hero content):

```javascript
contentHtml +=
  '<div class="rp-row"><label>Background Style</label><select onchange="FB.panels.updateProp(\'' +
  block.id +
  "','blobStyle',this.value)\">" +
  '<option value="blob"' +
  (p.blobStyle === "blob" ? " selected" : "") +
  ">Blob</option>" +
  '<option value="orbs"' +
  (p.blobStyle === "orbs" ? " selected" : "") +
  ">Orbs</option>" +
  '<option value="gradient"' +
  (p.blobStyle === "gradient" ? " selected" : "") +
  ">Gradient</option>" +
  '<option value="solid"' +
  (p.blobStyle === "solid" ? " selected" : "") +
  ">Solid</option>" +
  '<option value="video"' +
  (p.blobStyle === "video" ? " selected" : "") +
  ">Video</option>" +
  "</select></div>";
```

For nav:

```javascript
contentHtml +=
  '<div class="rp-row"><label>Menu Style</label><select onchange="FB.panels.updateProp(\'' +
  block.id +
  "','menuStyle',this.value)\">" +
  '<option value="simple"' +
  (p.menuStyle === "simple" ? " selected" : "") +
  ">Simple</option>" +
  '<option value="mega"' +
  (p.menuStyle === "mega" ? " selected" : "") +
  ">Mega Dropdown</option>" +
  '<option value="slide"' +
  (p.menuStyle === "slide" ? " selected" : "") +
  ">Slide-in Panel</option>" +
  "</select></div>";
```

For cta:

```javascript
contentHtml +=
  '<div class="rp-row"><label>Button Style</label><select onchange="FB.panels.updateProp(\'' +
  block.id +
  "','buttonStyle',this.value)\">" +
  '<option value="filled"' +
  (p.buttonStyle === "filled" ? " selected" : "") +
  ">Filled</option>" +
  '<option value="outlined"' +
  (p.buttonStyle === "outlined" ? " selected" : "") +
  ">Outlined</option>" +
  '<option value="floating-pulse"' +
  (p.buttonStyle === "floating-pulse" ? " selected" : "") +
  ">Floating Pulse</option>" +
  '<option value="dual"' +
  (p.buttonStyle === "dual" ? " selected" : "") +
  ">Dual Buttons</option>" +
  "</select></div>";
```

For footer:

```javascript
contentHtml +=
  '<div class="rp-row"><label>Layout Style</label><select onchange="FB.panels.updateProp(\'' +
  block.id +
  "','layoutStyle',this.value)\">" +
  '<option value="columns"' +
  (p.layoutStyle === "columns" ? " selected" : "") +
  ">Columns</option>" +
  '<option value="mega"' +
  (p.layoutStyle === "mega" ? " selected" : "") +
  ">Mega</option>" +
  '<option value="minimal"' +
  (p.layoutStyle === "minimal" ? " selected" : "") +
  ">Minimal</option>" +
  "</select></div>";
```

- [ ] **Step 7: Verify style variants work**

Open `framework-builder.html`, add existing blocks (hero, nav, cta, footer), change their style variant in the right panel, verify the canvas updates correctly.

---

### Phase 6: Animation System — IntersectionObserver

**Files:**

- Modify: `js/app.js` — add IntersectionObserver init for scroll animations
- Modify: `js/panels.js` — add 6 new animation types to the animation selector

- [ ] **Step 1: Add IntersectionObserver for scroll-triggered animations**

In `js/app.js`, add this function before `FB.init`:

```javascript
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
```

- [ ] **Step 2: Add 6 new animation types to the right panel selector**

In `js/panels.js`, find the `animTypes` array (around line 1305) and replace it:

```javascript
var animTypes = [
  "none",
  "fadeIn",
  "slideUp",
  "slideDown",
  "slideLeft",
  "slideRight",
  "zoomIn",
  "bounce",
  "pulse",
  "shake",
  "flip",
  "scrollReveal",
  "floatOrb",
  "neonGlow",
  "gradientText",
  "hoverUnderline",
  "carouselLoop",
];
```

- [ ] **Step 3: Add word-swap animation logic**

In `js/app.js`, add this function:

```javascript
FB.canvas.initWordSwap = function () {
  var containers = document.querySelectorAll(".fw-word-swap-wrap");
  containers.forEach(function (container) {
    var items = container.querySelectorAll(".fw-word-item");
    if (items.length <= 1) return;
    var current = 0;
    var speed = 2500;
    // Find speed from parent block props
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
```

Call `FB.canvas.initWordSwap()` after `FB.canvas.render()` in `FB.init`.

- [ ] **Step 4: Verify animations work**

Open `framework-builder.html`, add blocks with animations, preview in browser. Scroll-triggered animations should fire when blocks enter viewport. Word-swap should cycle through words.

---

### Phase 7: SEO Export System

**Files:**

- Modify: `js/export.js` — add meta tag generator, JSON-LD schema, resource hints, semantic HTML

- [ ] **Step 1: Add SEO meta tag generator**

Add this function to `FB.export`:

```javascript
FB.export.generateMetaTags = function () {
  var title = "My Site";
  var description = "A website built with Framework Builder";
  var url = window.location.href;
  var image = "";

  // Try to extract from blocks
  FB.state.blocks.forEach(function (b) {
    if (
      (b.type === "hero" || b.type === "videoHero" || b.type === "splitHero") &&
      b.props.headline
    ) {
      title = b.props.headline.replace(/<[^>]*>/g, "").substring(0, 60);
    }
    if (
      (b.type === "hero" || b.type === "videoHero" || b.type === "splitHero") &&
      b.props.subtext
    ) {
      description = b.props.subtext.substring(0, 160);
    }
  });

  return (
    "<title>" +
    title +
    "</title>\n" +
    '<meta name="description" content="' +
    description +
    '">\n' +
    '<meta property="og:title" content="' +
    title +
    '">\n' +
    '<meta property="og:description" content="' +
    description +
    '">\n' +
    '<meta property="og:url" content="' +
    url +
    '">\n' +
    (image ? '<meta property="og:image" content="' + image + '">\n' : "") +
    '<meta name="twitter:card" content="summary_large_image">\n' +
    '<meta name="twitter:title" content="' +
    title +
    '">\n' +
    '<meta name="twitter:description" content="' +
    description +
    '">\n' +
    '<link rel="canonical" href="' +
    url +
    '">\n'
  );
};
```

- [ ] **Step 2: Add JSON-LD schema generator**

```javascript
FB.export.generateJSONLD = function () {
  var orgName = "My Company";
  FB.state.blocks.forEach(function (b) {
    if (b.type === "nav" && b.props.logoText) orgName = b.props.logoText;
  });

  return (
    '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"' +
    orgName +
    '","url":"' +
    window.location.href +
    '"}</script>\n' +
    '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"' +
    orgName +
    '","url":"' +
    window.location.href +
    '"}</script>\n'
  );
};
```

- [ ] **Step 3: Add resource hints**

```javascript
FB.export.generateResourceHints = function () {
  return (
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '<link rel="dns-prefetch" href="https://www.google-analytics.com">\n'
  );
};
```

- [ ] **Step 4: Update generateHTML to include SEO**

In `FB.export.generateHTML`, replace the `<head>` section:

```javascript
// Replace the head section starting from '<!DOCTYPE html>'
return (
  '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
  '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
  FB.export.generateResourceHints() +
  fontLink +
  "\n" +
  FB.export.generateMetaTags() +
  FB.export.generateJSONLD() +
  "<style>\n*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n" +
  "body { font-family: 'Lexend', sans-serif; }\n" +
  blockCSS +
  "</style>\n</head>\n<body>\n" +
  '<a href="#main-content" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden">Skip to main content</a>\n' +
  bodyContent +
  "\n</body>\n</html>"
);
```

- [ ] **Step 5: Add semantic HTML wrapping to export**

In `FB.export.generateHTML`, wrap blocks with semantic tags:

```javascript
// In the bodyContent mapping, detect block types and wrap accordingly:
var bodyContent = FB.state.blocks
  .filter(function (b) {
    return !b.parentId;
  })
  .map(function (b) {
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
    // Semantic wrapping
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
      '">\n' +
      html +
      "\n</section>"
    );
  })
  .join("\n\n");
```

- [ ] **Step 6: Add new type prefixes to getBlockCSS**

In `FB.export.getBlockCSS`, add to `typePrefixes`:

```javascript
    videoHero: "fw-video-",
    splitHero: "fw-split-",
    orbsHero: "fw-orbs-",
    megaNav: "fw-mega-",
    slideNav: "fw-slide-",
    resultsGrid: "fw-results-",
    glassCards: "fw-glass-",
    portfolioGrid: "fw-portfolio-",
    clientCarousel: "fw-carousel-",
    trustPill: "fw-trust-",
    metricBox: "fw-metric-",
    wordSwap: "fw-word-",
    chatWidget: "fw-chat-",
    cookieConsent: "fw-cookie-",
    liteVideo: "fw-lite-",
```

- [ ] **Step 7: Verify export output**

Open `framework-builder.html`, add some new blocks, click Export. Check the generated HTML includes meta tags, JSON-LD, resource hints, semantic HTML wrapping, and all CSS for new blocks.

---

### Phase 8: Integration Testing & Polish

**Files:**

- Modify: `css/blocks.css` — fix any visual issues
- Modify: `js/canvas.js` — fix any render issues
- Modify: `js/panels.js` — fix any panel issues

- [ ] **Step 1: Full visual test**

Open `framework-builder.html`. For each of the 15 new blocks:

1. Add to canvas from library
2. Verify it renders correctly
3. Select it and verify right panel shows correct editors
4. Change a few props and verify canvas updates
5. Test style variants on existing blocks (hero, nav, cta, footer)

- [ ] **Step 2: Test export**

Add a mix of new and existing blocks, export HTML, verify:

- Meta tags present in `<head>`
- JSON-LD schema present
- Resource hints present
- Semantic HTML structure (header, nav, section, footer)
- All CSS for new blocks included
- No editor-only elements (block-controls, drag-handle) in output

- [ ] **Step 3: Test animations**

Add blocks with different animation presets, preview in browser, verify:

- scrollReveal fires on scroll entry
- floatOrb animates continuously
- neonGlow pulses
- gradientText animates background position
- carouselLoop scrolls continuously
- Word-swap cycles through words

- [ ] **Step 4: Test responsiveness**

Use the device toggle buttons (desktop/tablet/mobile) in the top bar. Verify:

- splitHero stacks on mobile
- megaNav degrades gracefully
- resultsGrid adapts to smaller screens
- glassCards reflow correctly
- portfolioGrid adapts
