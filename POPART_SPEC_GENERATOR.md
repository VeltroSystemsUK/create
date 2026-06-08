# Pop Art Spec Generator

## Overview

The **Pop Art Spec Generator** is a complete system for generating Lottie-compatible animation specifications in the style of 1960s comic book Pop Art (inspired by Roy Lichtenstein and Andy Warhol). It bridges the gap between Pop Art visual aesthetics and Lottie's technical constraints through a structured knowledgebase, RAG (Retrieval-Augmented Generation) pipeline, and comprehensive validation system.

### Key Features

- **Structured Ideation Engine**: Converts natural language prompts into production-ready animation specifications
- **Knowledgebase-Driven**: Enforces 1960s Pop Art style matrix with strict rules for linework, color, texture, and typography
- **RAG Pipeline**: Retrieves relevant examples and constraints, feeds them to Claude LLM for context-aware generation
- **Constraint Validation**: Real-time validation against 11+ Lottie technical constraints
- **Lottie Export**: Generates Lottie-compatible JSON ready for web animation
- **4-Section Structure**: Every spec has CONCEPT OVERVIEW, PALETTE & TEXTURES, VECTOR LAYER HIERARCHY, and MOTION & KEYFRAMES

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│  User Prompt (HTML Interface)                   │
│  "a retro phone ringing dramatically"           │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│  RAG Pipeline (popart-generator.js)             │
│  1. Retrieve similar examples                   │
│  2. Build system prompt with constraints        │
│  3. Call Claude API with context                │
│  4. Parse structured response                   │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│  Validation Engine (popart-validator.js)        │
│  10 validation categories:                      │
│  - Path complexity                              │
│  - Layer nesting depth                          │
│  - Animation loop seamlessness                  │
│  - Unsupported features                         │
│  - Color palette compliance                     │
│  - Text handling                                │
│  - Linework specifications                      │
│  - Pattern optimization                         │
│  - Motion principles                            │
│  - Framerate settings                           │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│  Output: Valid Spec                             │
│  - JSON structure ready for export              │
│  - Lottie-compatible format                     │
│  - All constraints verified                     │
└─────────────────────────────────────────────────┘
```

---

## System Components

### 1. **Knowledgebase** (`src/popart-knowledgebase.json`)

Comprehensive reference containing:

#### Style Matrix
- **Linework Rules**: 3-8px heavy black strokes, round caps/joins
- **Color Palette**: Primary colors (#FF00FF, #00FFFF, #FFFF00) + black/white
- **Shading/Texture**: Diagonal stripes (6px spacing) instead of expensive dot grids
- **Typography**: Blocky sans-serif, converted to paths, heavy shadows

#### Lottie Constraints
- Max 2000 total vector nodes per composition
- Max 3 levels of layer nesting
- Supported features: path keyframing, scale, rotation, opacity, trim paths
- Unsupported: blurs, gradients, raster masks, layer styles
- Recommended FPS: 24 or 30
- Easing curves: snappy with overshoot bounces

#### Motion Principles
- Pacing: slow reveal (12-24 frames), quick pop (4-8 frames), hold (12-16), ease out (8-12)
- Loop structure: frame 0 must equal final frame
- Animation segments: Build → Pop → Ring → Cool Down

#### Validation Rules
11 constraint checks with severity levels (critical/warning/info)

### 2. **Generator** (`src/popart-generator.js`)

Implements the RAG pipeline:

```javascript
// 1. Retrieve context from knowledgebase
const context = PopArtGenerator.retrieveContext("phone ringing");

// 2. Build system prompt with constraints
const systemPrompt = PopArtGenerator.buildSystemPrompt(context);

// 3. Call Claude API
const response = await fetch('https://api.anthropic.com/v1/messages', {
  system: systemPrompt,
  messages: [{ role: 'user', content: userPrompt }]
});

// 4. Parse and validate response
const spec = PopArtGenerator.parseSpec(response.text);
const validation = PopArtGenerator.validateSpec(spec);

// 5. Export as Lottie JSON
const lottieJson = PopArtGenerator.exportAsLottie(spec);
```

**Key Methods:**
- `retrieveContext()`: Finds relevant examples and constraints
- `buildSystemPrompt()`: Injects knowledgebase into LLM context
- `generateSpec()`: Orchestrates the full pipeline
- `parseSpec()`: Converts text/JSON to structured format
- `validateSpec()`: Runs all constraint checks
- `exportAsLottie()`: Converts to Lottie JSON format

### 3. **Validator** (`src/popart-validator.js`)

Real-time constraint validation with detailed reporting:

```javascript
const report = PopArtValidator.validate(spec);

// report.isValid: boolean
// report.categories: { critical, warning, info }
// report.checks: detailed results for each validation
// report.summary: human-readable summary
```

**Validation Categories:**
1. **Structure**: All 4 required sections present
2. **Path Complexity**: ≤ 2000 nodes total
3. **Layer Nesting**: ≤ 3 levels deep
4. **Animation Loop**: Seamless (frame 0 = final frame)
5. **Framerate**: 24 or 30 fps
6. **Unsupported Features**: No blurs, gradients, masks
7. **Color Palette**: Hex format, saturated primary colors
8. **Text Handling**: Converted to vector paths
9. **Linework**: 3-8px stroke width
10. **Pattern Optimization**: Efficient texture patterns
11. **Motion Principles**: Proper easing and pacing

### 4. **User Interface** (`popart-spec-generator.html`)

Interactive web interface:

- **Input Panel**: Prompt entry with quick-start examples
- **Output Panel**: 4-section spec with collapsible details
- **Validation Panel**: Real-time constraint checking with color-coded severity
- **Export Button**: Downloads Lottie JSON or Motion Creator project file
- **Live Feedback**: Status badges, validation warnings, raw JSON view

---

## Usage Guide

### Quick Start

1. **Open the interface**:
   ```
   http://localhost:3000/popart-spec-generator.html
   ```

2. **Enter a theme**:
   ```
   "a retro phone ringing dramatically"
   ```

3. **Click Generate Spec**

4. **Review the output**:
   - Check validation panel for any issues
   - Expand each section to review details
   - View raw JSON for integration

5. **Export**:
   - Click "Export JSON" to download Lottie format
   - Import into Motion Creator or web animation library

### Example Prompts

| Prompt | Style | Complexity |
|--------|-------|------------|
| "retro phone ringing dramatically" | Classic 60s | Medium |
| "exploding fireworks with comic book effects" | Action-packed | High |
| "blinking neon sign with geometric patterns" | Retro-futuristic | Medium |
| "spinning vinyl record with stars bursting" | Groovy | Medium |
| "atomic explosion mushroom cloud with sound waves" | Sci-Fi Pop Art | High |

---

## API Integration

### Claude API Setup

Set your API key before using:

```html
<script>
  window.ANTHROPIC_API_KEY = 'your-api-key-here';
</script>
```

### Request Flow

```javascript
const result = await PopArtGenerator.generateSpec(userPrompt);

// Returns:
{
  success: true,
  spec: { /* 4-section specification */ },
  validation: {
    isValid: true,
    issues: [],
    warnings: [],
    summary: "0 critical issues, 0 warnings"
  },
  rawResponse: "..." // Original Claude response
}
```

---

## Output Structure

Every generated spec has 4 mandatory sections:

### 1. CONCEPT_OVERVIEW
```json
{
  "title": "The Retro Ring of Anxiety",
  "description": "A classic 1960s rotary telephone...",
  "duration_frames": 48,
  "fps": 24,
  "loop_duration_seconds": 2.0
}
```

### 2. PALETTE_TEXTURES
```json
{
  "primary_colors": [
    { "name": "Phone Magenta", "hex": "#FF0055" },
    { "name": "Background Cyan", "hex": "#00E5FF" }
  ],
  "shadow_texture": "45-degree diagonal hash marks",
  "pattern_type": "diagonal_stripes"
}
```

### 3. VECTOR_LAYER_HIERARCHY
```json
{
  "root_composition": "24fps, 48 frames, 500x500px",
  "layer_tree": [
    {
      "name": "Phone_Base_Group",
      "children": [...]
    }
  ],
  "total_estimated_nodes": 380,
  "nesting_depth_check": 3
}
```

### 4. MOTION_KEYFRAMES
```json
{
  "animation_segments": [
    {
      "segment": "Frames 0-12 (The Build)",
      "description": "Receiver shakes..."
    }
  ],
  "easing_curves": {
    "pop_burst": [0.175, 0.885, 0.32, 1.275]
  },
  "seamless_loop_check": "PASS"
}
```

---

## Constraint Rules Reference

### Critical (Must Pass)
- ✅ All 4 sections present
- ✅ ≤ 2000 total vector nodes
- ✅ ≤ 3 nesting levels
- ✅ Seamless loop (frame 0 = final)
- ✅ No unsupported features (blurs, gradients, etc.)
- ✅ Text converted to paths

### Warnings (Recommended)
- ⚠️ Framerate 24 or 30 fps
- ⚠️ Primary Pop Art colors
- ⚠️ Stroke width 3-8px
- ⚠️ Avoid Ben-Day dots (use stripes)

### Info (Optional)
- ℹ️ Motion segments documented
- ℹ️ Easing curves specified

---

## Styling Guidelines

### Linework
```css
/* Heavy, uniform black strokes */
stroke: #111111;
stroke-width: 5px;
stroke-linecap: round;
stroke-linejoin: round;
```

### Color Palette
```
Primary: #FF00FF (Magenta), #00FFFF (Cyan), #FFFF00 (Yellow)
Shadows: #111111 (Deep Black)
Highlights: #FFFFFF (Stark White)
```

### Textures
```
✓ Diagonal stripes (6px spacing) - GOOD
✓ Vertical lines - GOOD
✗ Dense dot grids - AVOID (performance)
✗ Soft gradients - AVOID (not Pop Art)
```

### Typography
```
Families: Impact, Futura Bold, Cooper Black
Must convert to paths before export
Add heavy dropshadow (2-4px offset, 80% opacity)
```

---

## Technical Specifications

### Lottie JSON Output

Generated JSON is compatible with:
- Lottie Web (JavaScript)
- Lottie Android
- Lottie iOS
- Adobe After Effects (via plugin)

### Browser Support

Requires:
- ES6+ JavaScript
- Fetch API
- localStorage (optional)
- 400x400px+ viewport (recommended)

### Performance Targets

- **Load time**: < 100ms for spec generation
- **Validation**: < 50ms
- **Export**: < 200ms
- **Animation runtime**: 60fps playback

---

## Examples & Gallery

### Example 1: "The Retro Ring of Anxiety"
**Theme**: Rotary telephone ringing
**Duration**: 2 seconds (48 frames at 24fps)
**Style**: Classic 1960s anxiety
**Output**: [See generated spec above]

### Example 2: "Atomic Bloom"
**Theme**: Mushroom cloud explosion
**Duration**: 3 seconds (72 frames)
**Color Scheme**: Yellow burst, cyan background, magenta shock waves
**Nesting**: 3 levels (Cloud > Layers > Details)

### Example 3: "Groovy Record Spin"
**Theme**: Vinyl record with stars
**Duration**: 2.5 seconds
**Animation**: Rotation + star pop effects
**Patterns**: Vertical speed lines, concentric circles

---

## Troubleshooting

### "Invalid API key"
- Ensure `window.ANTHROPIC_API_KEY` is set
- Check key has `messages` permission in Anthropic console

### "Validation failed: too many nodes"
- Reduce detail in layer hierarchy
- Consolidate similar shapes into groups
- Estimate nodes and request simplification

### "Seamless loop check failed"
- Verify frame 0 and final frame have identical element positions
- Check rotation/scale/opacity return to original values
- Add explicit "reset" keyframe at end of animation

### "Text not converted to paths"
- All text must be vector shapes in Lottie
- Mention "convert to paths" or "vector text" in prompt
- Validator will flag font dependencies

---

## Roadmap

- [ ] **v1.1**: Interactive layer preview
- [ ] **v1.2**: Drag-and-drop spec builder
- [ ] **v1.3**: Style variant templates (Warholian, Comic Book, Graffiti)
- [ ] **v1.4**: Audio sync (match animation to sound effects)
- [ ] **v1.5**: Batch generation for animation sequences
- [ ] **v2.0**: Real-time Lottie player with editing

---

## Resources

- **Lottie Docs**: https://airbnb.io/lottie/
- **Pop Art History**: Modern art movement (1950s-1970s)
- **Roy Lichtenstein**: Master of comic book-inspired fine art
- **Ben-Day Dots**: Printing technique referenced in visual style

---

## License

Part of the Framework project. Internal use.

---

**Created**: June 2026  
**Last Updated**: June 5, 2026  
**Version**: 1.0.0
