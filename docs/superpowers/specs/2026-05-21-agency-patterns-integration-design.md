# Framework Builder — Agency Patterns Integration Design

**Date:** 2026-05-21
**Source:** Analysis of 8 UK web design agency sites
**Target:** Framework Builder block system (`/home/shauntuhey/Framework`)

## Architecture Overview

Hybrid integration approach:

- **15 new block types** → added to `js/blocks.js` BLOCK_DEFS, rendered in `js/canvas.js`, styled in `css/blocks.css`
- **4 style variants** → new props on existing blocks (hero, nav, cta, footer)
- **6 animation presets** → CSS keyframes in `css/blocks.css` + IntersectionObserver in `js/app.js`
- **4 SEO features** → export-level changes in `js/export.js`

## New Block Types (15)

### 1. videoHero

- **Props:** `videoUrl` (string), `posterUrl` (string), `headline` (string), `subtext` (string), `ctaPrimary` (string), `ctaSecondary` (string), `overlayColor` (string), `overlayOpacity` (number), `showRating` (bool), `ratingText` (string), `ratingCount` (number), `bg` (fallback color)
- **Render:** Full-viewport section with `<video>` background, dark overlay, centered content, dual CTA buttons, optional trust pill below
- **CSS:** `.fw-video-hero`, `.fw-video-bg`, `.fw-video-overlay`, `.fw-hero-content`, `.fw-hero-cta-group`, `.fw-trust-pill`

### 2. splitHero

- **Props:** `eyebrow` (string), `headline` (string), `subtext` (string), `ctaText` (string), `embedUrl` (string), `embedType` (vimeo|youtube|image), `imageAlt` (string), `bg` (string), `accentColor` (string), `reverse` (bool)
- **Render:** 2-column CSS grid, text left / media right (or reversed), responsive stack on mobile
- **CSS:** `.fw-split-hero`, `.fw-split-text`, `.fw-split-media`

### 3. orbsHero

- **Props:** `headline` (string), `subtext` (string), `ctaText` (string), `bg` (string), `accentColor` (string), `orbs` (array of {color, size, x, y, opacity}), `words` (array of strings for word-swap), `wordSpeed` (number)
- **Render:** Full-viewport with absolutely positioned orb divs (animated via CSS keyframes), word-swap headline, CTA
- **CSS:** `.fw-orbs-hero`, `.fw-orb`, `.fw-word-swap`, `.fw-text-gradient`

### 4. megaNav

- **Props:** `logoText` (string), `logoUrl` (string), `links` (array of {label, url, children: [{label, url}]}), `ctaText` (string), `ctaUrl` (string), `bg` (string), `textColor` (string), `accentColor` (string), `dropdownColumns` (number)
- **Render:** Horizontal nav with hover-triggered mega dropdown (CSS grid columns), mobile hamburger
- **CSS:** `.fw-mega-nav`, `.fw-mega-dropdown`, `.fw-mega-grid`, `.fw-mega-link`

### 5. slideNav

- **Props:** `logoText` (string), `links` (array of {label, url, children: [{label, url}]}), `bg` (string), `textColor` (string), `accentColor` (string)
- **Render:** Checkbox-triggered full-screen slide-in menu with multi-level navigation (back button for sub-menus)
- **CSS:** `.fw-slide-nav`, `.fw-slide-trigger`, `.fw-slide-panel`, `.fw-slide-sub`, `.fw-slide-back`

### 6. resultsGrid

- **Props:** `label` (string), `headline` (string), `subtitle` (string), `cards` (array of {type, clientName, location, description, metrics: [{label, before, after, note}], testimonial: {avatar, name, brand, quote}, bg`(string),`accentColor` (string)
- **Render:** 3-column responsive grid of result cards with glow effect, metric boxes (before→after), client proof section
- **CSS:** `.fw-results-grid`, `.fw-result-card`, `.fw-result-glow`, `.fw-metric-box`, `.fw-client-proof`

### 7. glassCards

- **Props:** `label` (string), `headline` (string), `cards` (array of {icon, title, description, link}), `bg` (string), `cardBg` (string), `cardBorder` (string), `accentColor` (string)
- **Render:** Grid of glass-morphism cards with rgba backgrounds, subtle borders, hover transitions
- **CSS:** `.fw-glass-cards`, `.fw-glass-card`, `.fw-glass-icon`, `.fw-glass-hover`

### 8. portfolioGrid

- **Props:** `label` (string), `headline` (string), `items` (array of {image, title, category, overlayText}), `bg` (string), `accentColor` (string)
- **Render:** Image grid with hover overlays showing project info, optional modal trigger
- **CSS:** `.fw-portfolio-grid`, `.fw-portfolio-item`, `.fw-portfolio-overlay`

### 9. clientCarousel

- **Props:** `label` (string), `logos` (array of {src, alt, width, height}), `bg` (string), `speed` (number), `showArrows` (bool), `autoplay` (bool)
- **Render:** Auto-scrolling logo carousel using CSS animation (no external dependency), pause on hover
- **CSS:** `.fw-client-carousel`, `.fw-carousel-track`, `.fw-carousel-logo`

### 10. trustPill

- **Props:** `stars` (number), `ratingText` (string), `platform` (string), `platformLogo` (string), `verifiedDate` (string), `bg` (string), `textColor` (string), `starColor` (string)
- **Render:** Inline flex container with SVG stars, rating text, platform logo, verification date
- **CSS:** `.fw-trust-pill`, `.fw-star`, `.fw-verified`

### 11. metricBox

- **Props:** `label` (string), `before` (string), `after` (string), `note` (string), `arrow` (string), `bg` (string), `accentColor` (string), `animateCounter` (bool)
- **Render:** Metric display with before value, arrow, after value (animated counter), note below
- **CSS:** `.fw-metric-box`, `.fw-metric-line`, `.fw-metric-label`, `.fw-metric-value`, `.fw-metric-note`, `.fw-counter`

### 12. wordSwap

- **Props:** `prefix` (string), `words` (array of {text, gradient}), `speed` (number), `bg` (string), `textColor` (string)
- **Render:** Headline with rotating word that changes with fade/slide animation, each word has different gradient color
- **CSS:** `.fw-word-swap-container`, `.fw-word-item`, `.fw-word-active`, `.fw-gradient-lime`, `.fw-gradient-teal`, `.fw-gradient-rose`

### 13. chatWidget

- **Props:** `welcomeText` (string), `avatarUrl` (string), `avatarAlt` (string), `bg` (string), `textColor` (string), `accentColor` (string), `statusDot` (bool)
- **Render:** Floating chat bubble (bottom-right), expands to chat interface with header, message area, input field
- **CSS:** `.fw-chat-toggle`, `.fw-chat-container`, `.fw-chat-header`, `.fw-chat-body`, `.fw-chat-input`, `.fw-chat-message`

### 14. cookieConsent

- **Props:** `title` (string), `message` (string), `acceptText` (string), `declineText` (string), `customizeText` (string), `bg` (string), `textColor` (string), `accentColor` (string), `categories` (array of {name, description, required: bool})
- **Render:** Fixed bottom banner with message, three buttons, expandable categories for customization
- **CSS:** `.fw-cookie-banner`, `.fw-cookie-message`, `.fw-cookie-options`, `.fw-cookie-categories`

### 15. liteVideo

- **Props:** `videoId` (string), `platform` (vimeo|youtube), `posterUrl` (string), `title` (string), `autoplay` (bool), `loop` (bool), `bg` (string)
- **Render:** Lightweight video embed with poster image, play button overlay, loads full player only on click
- **CSS:** `.fw-lite-video`, `.fw-lite-poster`, `.fw-lite-play-btn`

## Style Variants (4)

### hero: blobStyle prop

- Values: `"blob"` (existing), `"orbs"`, `"gradient"`, `"solid"`, `"video"`
- Controls background treatment of the hero block

### nav: menuStyle prop

- Values: `"simple"` (existing), `"mega"`, `"slide"`
- Controls navigation dropdown behavior

### cta: buttonStyle prop

- Values: `"filled"` (existing), `"outlined"`, `"floating-pulse"`, `"dual"`
- Controls CTA button appearance and behavior

### footer: layoutStyle prop

- Values: `"columns"` (existing), `"mega"`, `"minimal"`
- Controls footer layout complexity

## Animation Presets (6)

All use IntersectionObserver for scroll-triggered activation. Added to `css/blocks.css` and right-panel animation selector.

1. **scrollReveal** — fade + slide up on scroll entry
2. **floatingOrbs** — continuous floating animation with random-ish movement
3. **neonGlow** — pulsing box-shadow glow effect
4. **gradientText** — animated background-position on gradient text
5. **hoverUnderline** — width 0→100% underline on hover
6. **carouselLoop** — continuous horizontal translate animation

## SEO System (4)

### Meta Tag Generator (export.js)

- Added to exported HTML `<head>`: title, description, og:title, og:description, og:image, og:url, twitter:card, twitter:title, twitter:description, canonical
- Props sourced from project settings or block-level overrides

### JSON-LD Schema (export.js)

- Organization schema (name, url, logo, sameAs)
- LocalBusiness schema (name, address, telephone, geo)
- BreadcrumbList schema (from nav structure)

### Resource Hints (export.js)

- `<link rel="preconnect">` for Google Fonts, CDNs
- `<link rel="preload">` for critical fonts
- `<link rel="dns-prefetch">` for third-party domains

### Semantic HTML Export (canvas.js render + export.js)

- Blocks render with semantic tags: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- ARIA attributes: aria-label, aria-expanded, aria-roledescription
- Skip link added to exported output
- Proper heading hierarchy (single h1, nested h2-h6)

## File Changes

| File             | Changes                                                                        |
| ---------------- | ------------------------------------------------------------------------------ |
| `js/blocks.js`   | Add 15 new BLOCK_DEFS entries, extend 4 existing blocks with variant props     |
| `css/blocks.css` | Add ~400 lines of CSS for new blocks, 6 animation keyframes, variant styles    |
| `js/canvas.js`   | Add render functions for 15 new block types                                    |
| `js/export.js`   | Add meta tag generator, JSON-LD schema, resource hints, semantic HTML wrapping |
| `js/app.js`      | Add IntersectionObserver for scroll-triggered animations                       |
| `js/panels.js`   | Add right-panel controls for new props and animation presets                   |
| `css/canvas.css` | Minor adjustments for new block preview styling                                |

## Implementation Order

1. CSS foundation (blocks.css — animations, variants, base styles)
2. New block definitions (blocks.js — 15 new entries)
3. Block render functions (canvas.js — HTML generation)
4. Right panel controls (panels.js — prop editors)
5. Style variants (extend existing blocks)
6. Animation system (IntersectionObserver in app.js)
7. SEO export system (export.js)
8. Integration testing
