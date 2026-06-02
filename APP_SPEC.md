# Framework Builder — Application Specification

Version 1.0 | 108 Widgets | 14 Creative Domains | 3-Stage AI Pipeline

---

## 1. Architecture Overview

```
framework-builder.html          Main app shell (toolbar, panels, canvas, overlays)
├── src/main.js                 ES module entry point (load order critical)
├── js/
│   ├── state.js                Global state (blocks, history, theme, pages)
│   ├── events.js               Event system for block communication
│   ├── bindings.js             Widget-to-widget data bindings
│   ├── pages.js                Multi-page management
│   ├── blocks.js               Standard block definitions (nav, hero, services...)
│   ├── theme.js                Theme management (accent, bg, text, fonts)
│   ├── canvas.js               Canvas rendering, block CRUD, drop zones
│   ├── panels.js               Left/right panels, settings UI, morph sliders
│   ├── export.js               HTML/React/TSX code export
│   ├── project.js              Save/load projects (localStorage)
│   ├── widgets.js              Widget registry, prop metadata, auto-generated settings
│   ├── creative-library.js     14-domain creative patterns library
│   ├── ai-knowledge.js         AI system prompt (Creative Designer persona)
│   ├── ai-service.js           Single-prompt Gemini API wrapper
│   ├── ai-agent.js             Multi-agent pipeline (brand/layout/veltro workers)
│   ├── ai-templates.js         AI Template Builder overlay UI
│   ├── design.js               Design Studio (Fabric.js canvas for graphics)
│   ├── motion-creator.js       Motion animation creator
│   ├── deep-scrape.js          Full-site crawling utility
│   ├── app.js                  App initialization, keyboard shortcuts
│   ├── theme-toggle.js         Dark/light mode toggle
│   └── language.js             Google Translate integration
├── widgets/
│   ├── basic.js                8 widgets (heading, divider, spacer, icon, html...)
│   ├── content.js              6 widgets (image, button, video, iconBox...)
│   ├── media.js                2 widgets (imageGallery, soundCloud)
│   ├── layout.js               11 widgets (row, tabs, accordion, container...)
│   ├── interactive.js          6 widgets (counter, countdown, alert...)
│   ├── gallery-like.js         3 widgets (gallery, portfolio, slides)
│   ├── embed.js                7 widgets (googleMaps, lottie, codeBlock...)
│   ├── design-templates.js     Design Studio presets (hero, OG, card, square...)
│   └── veltro/
│       ├── index.js            Veltro engine entry point
│       ├── core.js             Mouse tracking, Matter.js loader
│       ├── inits.js            All widget initializers (~6K lines)
│       ├── orig-text.js        6 typography widgets
│       ├── orig-fx.js          24 visual effect widgets
│       ├── batch-cursor.js     5 cursor interaction widgets
│       ├── batch-text.js       3 animated text widgets
│       ├── batch-physics.js    8 physics simulation widgets
│       ├── batch-scroll.js     6 scroll-driven widgets
│       ├── batch-ambient.js    6 ambient background widgets
│       └── batch-spatial.js    10 spatial/3D widgets
├── css/                        Stylesheets (layout, canvas, widgets, blocks...)
└── server.py                   Python dev server (port 8899), AI pipeline, scrapers
```

---

## 2. Widget Registry (108 Total)

### Basic (8)
| Type | Label | Key Props |
|------|-------|-----------|
| `heading` | Heading | text, tag, align, color, size |
| `divider` | Divider | width, height, color, style(solid/dashed/dotted) |
| `spacer` | Spacer | height |
| `icon` | Icon | icon, size, color |
| `html` | HTML | html |
| `shortcode` | Shortcode | shortcode |
| `blockquote` | Blockquote | quote, attribution, borderColor |
| `textPath` | Text Path | text, fontSize, color |

### Content (6)
| Type | Label | Key Props |
|------|-------|-----------|
| `image` | Image | src, alt, width, align, borderRadius |
| `button` | Button | text, url, size(sm/md/lg), align, bg, color |
| `video` | Video | src, controls, aspectRatio |
| `iconBox` | Icon Box | icon, title, desc, align |
| `iconList` | Icon List | items[{icon,text}], color |
| `socialIcons` | Social Icons | items[{icon,url,label}], shape(circle/square/rounded), size |

### Media (2)
| Type | Label | Key Props |
|------|-------|-----------|
| `imageGallery` | Image Gallery | columns, gap, images[], captions[] |
| `soundCloud` | SoundCloud | url |

### Layout (11)
| Type | Label | Key Props |
|------|-------|-----------|
| `row` | Row / Columns | columns, layout, gap |
| `tabs` | Tabs | items[{title,content}], activeTab |
| `accordion` | Accordion | items[{title,content}] |
| `toggle` | Toggle | items[{title,content}] |
| `priceTable` | Price Table | title, price, period, currency, features[], cta, featured |
| `priceList` | Price List | items[{title,desc,price,image,tag}], columns |
| `flipBox` | Flip Box | frontTitle, frontDesc, backTitle, backDesc, height |
| `cta` | CTA | title, desc, btnText, bg, color |
| `footerWidget` | Footer | columns, col1-4Title/Content/Links, copyright, bg |
| `container` | Section | columns, bgColor, bgSize, bgPosition, minHeight |
| `twmWorkspace` | TWM Workspace | nodes[{title,desc,label}] |

### Interactive (6)
| Type | Label | Key Props |
|------|-------|-----------|
| `counter` | Counter | number, prefix, suffix, title, color, size |
| `countdown` | Countdown | date, label |
| `animatedHeadline` | Animated Headline | beforeText, words[], afterText, color |
| `hotspot` | Hotspot | src, hotspots[{x,y,label}] |
| `progressTracker` | Progress Tracker | steps[{title,desc}], current |
| `alert` | Alert | title, desc, type(info/success/warning/error), dismissible |

### Gallery-Like (3)
| Type | Label | Key Props |
|------|-------|-----------|
| `gallery` | Gallery | images[], columns, gap |
| `portfolio` | Portfolio Grid | items[{title,tag,image}], columns |
| `slides` | Slides | slides[{title,desc,cta,bgImage}] |

### Embed (7)
| Type | Label | Key Props |
|------|-------|-----------|
| `googleMaps` | Google Maps | address, zoom, height |
| `codeBlock` | Code Block | code, language |
| `shareButtons` | Share Buttons | networks[], url |
| `videoPlaylist` | Video Playlist | videos[{src,title}], active |
| `lottie` | Lottie Animation | src, autoplay, loop, height, speed, bg |
| `motionBlock` | Motion Animation | animData, height, bg, loop |
| `htmlEmbed` | HTML Embed | html |

### Veltro Engine (64)
Categorized into 8 sub-categories loaded from `widgets/veltro/`:

**Typography (6)** — `orig-text.js`: kineticText, textScramble, typewriterReveal, textMask, morphingCounter, liquidText
**Visual Effects (24)** — `orig-fx.js`: imagePhysics, magneticCursor, particleTrail, cursorRipple, stickyScrollStack, scrollVelocitySkew, parallaxImageStack, mosaicAssemble, scrollProgressRing, magneticScroll, morphBlob, noiseGrain, gradientFlow, sectionBackground, glassmorphismStack, tiltCard3d, glitchSection, audioVisualizer, depthOfField, holographicCard, soundReactive, mirrorReflection, constellationLines, geometryDraw
**Cursor (5)** — `batch-cursor.js`: multiShapeTrail, magneticText, cursorDistortion, colorSampler, gravityCursor
**Text Animation (3)** — `batch-text.js`: waveText, morphingText, kineticScramble
**Physics (8)** — `batch-physics.js`: gravityWells, clothSimulation, magneticFields, pendulumWave, collisionChaos, blackHole, physicsSandbox, fluidSimulation
**Scroll (6)** — `batch-scroll.js`: parallaxDepth, scrollTriggered, horizontalScrollGallery, velocitySkew, scrollFluid, velocityFluidBg
**Ambient (6)** — `batch-ambient.js`: auroraBorealis, particleNebula, geometricPatterns, liquidGradient, holographicOverlay, lightLeaks
**Spatial/3D (10)** — `batch-spatial.js`: carousel3d, perspectiveRooms, floatingIslands, layeredParallax, kineticLayout, morphingGrid, spatialNavigation, cursorLens, shaderBg, infiniteCanvas

---

## 3. Settings System

### Auto-Generated Settings Panels
Every widget has a `defaultProps` object and an `editPanel` function (currently returns `""` for all widgets). The system auto-generates settings UI via `FB.widgets.generateEditPanel()`.

### Property Metadata (`js/widgets.js`)
- `FB.widgets._propMeta` — 400+ property definitions mapping prop names to control types (color, range, select, checkbox, text, number)
- `FB.widgets._skipProps` — 27 properties excluded from auto-generated panels (handled by right panel sections)
- `FB.widgets._propOrder` — Controls display order of common properties
- `FB.widgets.safeSplit()` — Handles AI-generated array props in string-expected fields

### Control Types
| Type | Renders As | Used For |
|------|-----------|----------|
| `color` | `<input type="color">` | hex colors (#cdfe00) |
| `range` | `<input type="range">` | numbers with min/max/step |
| `select` | `<select>` | enumerated values (mode, shape, type) |
| `checkbox` | `<input type="checkbox">` | boolean toggles |
| `number` | `<input type="number">` | numeric values |
| `text` | text input or textarea | strings, URLs, long content |

### Inference (for unmapped props)
Properties NOT in `_propMeta` are auto-detected:
- `boolean` → checkbox
- `number` → range slider
- `string starting with #` → color picker
- `Array` → JSON textarea (multiline)
- `object` → JSON textarea

---

## 4. AI Systems

### 4.1 Creative Library (`js/creative-library.js`)
14 domains × 4 themes each = 56 total. Each domain has: recipes (archetypal block chains), Veltro mappings, color palettes.

| # | Domain | Themes |
|---|--------|--------|
| 1 | Ecommerce | Editorial Luxury, Cyberpunk, Soft Wellness, Neo-Brutalist |
| 2 | Farm-to-Table | Earthy Organic, Modern Homestead, Brutalist Bodega, Heritage Orchard |
| 3 | Manufacturing | Precision Aerospace, Heavy Industrial, CleanTech, Brutalist Infrastructure |
| 4 | Construction | Architectural Minimalist, Heavy Civil, Sustainable Eco-Build, Modern Craft |
| 5 | Beauty/Salon | Editorial Luxury Spa, Avant-Garde, Clinical Clean-Tech, Cozy Organic |
| 6 | Law/CPA | High-End Prestige, Hyper-Modern FinTech, Accessible Boutique, Neo-Brutalist |
| 7 | Automotive | Luxury Showroom, High-Velocity Performance, Transparent Garage, Moto-Club |
| 8 | Fitness | High-Octane Performance, Mindful Wellness, Clinical Biohacking, Community |
| 9 | Hospitality | High-End Mixology, Underground Club, Modern Gastropub, Neon Tiki |
| 10 | Medical Retail | Clinical Elite, Empathetic Wellness, High-Tech Apothecary, Minimalist |
| 11 | Education | Ivy League, EdTech Disruptor, Creative Academy, Inclusive Growth |
| 12 | Local Retail | Curated Boutique, Urban Maker, Sustainable General, Pop-Up Bodega |
| 13 | Food & Culinary | Gastronomic Atelier, Street Food, Digital QSR, Artisanal Hearth |
| 14 | Home Trades | Grid System, Trusted Heritage, Rapid Response, Eco-Energy |

### 4.2 Multi-Agent Pipeline (`js/ai-agent.js`)
Three parallel workers orchestrated by `FB.agent.generate(brief)`:

1. **Brand Worker** — Extracts brand parameters (industry, tone, accentColor, vibe, visualStyle) from the brief
2. **Layout Worker** — Generates 10-15 block structural layout using creative patterns + widget types (50%+ widgets required)
3. **Veltro Worker** — Injects 2-4 Veltro canvas widgets with bindings for interactive effects

Features:
- Anti-pattern enforcement (no nav→hero→services chains, no duplicate types)
- Temperature: 0.95 for creative variation
- Validation retry on error
- Uses `FB.creative.getLayoutLibrary()` for domain-specific recipes

### 4.3 3-Stage Server Pipeline (`server.py` → `/api/ai-pipeline`)
Production pipeline for URL-to-template conversion:

1. **Scrape** — Fetches URL content (Firecrawl CLI or built-in urllib fallback)
2. **Brand Decoder** — Gemini extracts industry, value proposition, aesthetic archetype
3. **Component Chef** — Gemini prunes 120+ component inventory to ~25 curated matches
4. **Layout Architect** — Gemini generates template JSON using only curated components

### 4.4 AI Template Builder (`js/ai-templates.js`)
Overlay UI with:
- Gemini API key management (sessionStorage)
- Prompt textarea with placeholder examples
- Brand URL input + 🔍 Scrape button (for context injection)
- 🚀 From URL button (3-stage pipeline)
- ✨ Generate Template (multi-agent)
- ➕ Generate Section (single-prompt, 1-3 blocks)
- Agent mode toggle (⚡ Agent ON/OFF)
- Review → Approve flow with canvas placement

---

## 5. Widget Bindings

Emitter → Receiver wiring for interactive effects:

| Emitter | Event | Receivers (target properties) |
|---------|-------|------------------------------|
| `scrollProgressRing` | scrollProgress (0→1) | particleNebula→intensity, gradientFlow→speed, glitchSection→glitchRate, auroraBorealis→speed, tiltCard3d→maxTilt, holographicOverlay→intensity |
| `magneticScroll` | scrollProgress (0→1) | Same as above |

Binding format:
```json
{
  "sourceId": "ring_1",
  "sourceEvent": "scrollProgress",
  "targetProp": "intensity",
  "inputRange": [0, 1],
  "outputRange": [0, 1]
}
```

---

## 6. Server API Endpoints (`server.py`, Port 8899)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/scrape` | POST | Scrape URL with Firecrawl CLI (markdown + HTML + palette) |
| `/api/fetch` | POST | Fetch page via Playwright (node fetch-page.js) |
| `/api/brand-scrape` | POST | Built-in scraper — no external CLI needed |
| `/api/ai-import` | POST | Scrape URL → AI converts to blocks (needs AI API key) |
| `/api/ai-pipeline` | POST | 3-stage pipeline: Brand Decoder → Component Chef → Layout Architect |
| `/api/ai-image` | POST | AI image generation |
| `/api/designs` | GET/POST | Design Studio templates CRUD |
| `/api/cms/*` | POST/GET | CMS content/schema/auth/media endpoints |

---

## 7. Key Technical Details

### Canvas Rendering
- `FB.canvas.render()` — clears and rebuilds all blocks from `FB.state.blocks`
- Each block wrapped in `.canvas-block` with drag handles and controls
- Widget blocks rendered via `FB.widgets.render(type, props)`
- Standard blocks rendered via `FB.canvas.renderBlockHTML(block)`
- After render: Veltro initializers called for canvas-based widgets

### Initializers (`widgets/veltro/inits.js`)
- `window._VeltroInitAll()` runs all initializers after canvas render
- Each initializer uses `:not([data-*-init])` selectors for idempotency
- Canvas-based widgets use IntersectionObserver for performance
- Shared mouse tracking via `window._VeltroMouse`
- Matter.js physics lazy-loaded via CDN

### Settings Right Panel
- Style section: background color/alpha/gradient, typography, spacing, border
- Morph slider: preset visual styles
- Scroll States: enter/center/exit timeline behaviors
- Cast a Spell: quick styling commands (Make Premium, Minimal, Brutalist, Cyber Glow)
- Advanced: per-property controls from `_propMeta`

### Design Studio
- Fabric.js 5.3.1 canvas for graphic design
- Toggle between Builder mode and Design mode
- Presets: Hero Banner, OG Image, Feature Card, Square, Wide
- Default preset changed to "blank" (was "og")

---

## 8. Build & Development

```bash
# Install dependencies
npm install

# Start dev server (Vite HMR on :3000, proxies to :8899)
npm run dev

# Start Python backend (port 8899)
python server.py

# Access the app
http://localhost:8899/framework-builder.html
```

### File Size Summary
- Total JS: ~55K lines across ~35 files
- Widget definitions: ~14K lines (8 active batch files + 6 standard widget files)
- AI system: ~3K lines (agent, knowledge, templates, service)
- Initializers: ~6K lines
- CSS: ~3K lines across 9 files
- Server: ~1K lines Python

### Browser Support
- Modern Chrome/Edge/Firefox (ES modules required)
- No IE11 support
- Fabric.js 5.3.1 for canvas graphics
- Matter.js 0.19 for physics
- DOMPurify for HTML sanitization
