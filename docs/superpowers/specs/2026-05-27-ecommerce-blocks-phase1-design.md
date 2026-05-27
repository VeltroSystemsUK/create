# Ecommerce Product Blocks — Design Spec (Phase 1)

**Date:** 2026-05-27
**Status:** Draft

## Overview

Convert 5 ecommerce product blocks from `FB.blocks.ECOMMERCE_DEFS` (plain prop definitions with switch-case rendering in `canvas.js` and zero edit panels) to proper `FB.widgets.register()` widgets with full `render()` and `editPanel()` functions.

Each widget gets its own file in `widgets/` with complete edit controls for every prop, XSS-safe HTML escaping, and consistent metadata.

## Architecture

### Current State

```
blocks.js:1216-1699  →  ECOMMERCE_DEFS (props only, no render/edit)
canvas.js:2454-3130+ →  switch-case rendering for each ecom block
panels.js            →  NO edit panel handling for ecom blocks
```

Blocks get inserted from the library palette, rendered with hardcoded HTML from canvas.js, and have **zero right-panel edit controls**. The only editing is via `contenteditable` attributes on some title/text fields.

### Target State

```
widgets/ecom-products.js → 5 FB.widgets.register() calls
blocks.js:1216-1699     →  REMOVED (ECOMMERCE_DEFS deleted)
canvas.js:2454-3130+    →  switch-case entries REMOVED
```

Each widget has its own `render()` and `editPanel()`. Panels.js auto-detects widgets and delegates to their `editPanel()` — no changes needed in panels.js.

### Block Palette Visibility

All 5 blocks will continue to appear in the block library sidebar. The palette rendering in panels.js already maps `FB.widgets._registry` alongside `BLOCK_DEFS` and `ECOMMERCE_DEFS`:

```js
var allDefs = Object.assign(
  {},
  FB.blocks.BLOCK_DEFS,
  FB.blocks.CUSTOM_BLOCK_DEFS,
  FB.widgets._registry,
);
```

So removing them from `ECOMMERCE_DEFS` while adding them to `_registry` means they remain visible. The old `ECOMMERCE_DEFS` reference will be cleaned up entirely from blocks.js since no blocks will remain there.

---

## 1. ecomProductCard

### Props

```js
{
  imageUrl: "https://images.unsplash.com/...",
  title: "Premium Watch",
  price: "£129.00",
  salePrice: "",
  rating: 4,
  reviewCount: 24,
  btnText: "Add to Cart",
  badge: "",
  badgeColor: "#ef4444",
  bg: "#111111",
  textColor: "#f7f6f2",
  accentColor: "#CDFE00",
}
```

### Behaviour

- Image wraps in a container with aspect-ratio crop
- Title is editable inline (contenteditable) and in the edit panel
- Price shows original + sale price when `salePrice` is set, with saleColor
- Rating renders filled stars from `rating` (0-5), review count shown in parens
- Badge ribbon appears in top-right of image when `badge` is non-empty
- Button uses accentColor background

### Edit Panel Controls

| Control      | Type               | Prop                        |
| ------------ | ------------------ | --------------------------- |
| Image URL    | text input         | imageUrl                    |
| Title        | text input         | title                       |
| Price        | text input         | price                       |
| Sale Price   | text input         | salePrice (empty = no sale) |
| Rating       | number input (0-5) | rating                      |
| Review Count | number input       | reviewCount                 |
| Badge Text   | text input         | badge (empty = hidden)      |
| Badge Color  | color input        | badgeColor                  |
| Button Text  | text input         | btnText                     |

### UI States

| State       | Behaviour                                           |
| ----------- | --------------------------------------------------- |
| No image    | Grey placeholder with "Add image" text              |
| Sale active | Price shows strikethrough original + red sale price |
| Badge set   | Ribbon badge in image top-right corner              |
| No badge    | Clean image top-right                               |
| 0 rating    | "No reviews" text instead of stars                  |

---

## 2. ecomProductGrid

### Props

```js
{
  columns: 3,
  gap: 24,
  products: [
    { imageUrl: "", title: "", price: "", salePrice: "", rating: 0, badge: "" }
  ],
  bg: "#111111",
  textColor: "#f7f6f2",
  accentColor: "#CDFE00",
  saleColor: "#ef4444",
}
```

### Behaviour

- CSS Grid layout with `columns` count
- Each product card renders using the same card markup as ecomProductCard
- Products are editable individually in the edit panel
- Add/remove products (minimum 1, no maximum)

### Edit Panel Controls

| Control                                                         | Type                                 | Prop                                  |
| --------------------------------------------------------------- | ------------------------------------ | ------------------------------------- |
| Columns                                                         | number input (1-6)                   | columns                               |
| Gap (px)                                                        | number input                         | gap                                   |
| Per-product: Image URL, Title, Price, Sale Price, Rating, Badge | text/num inputs per product in array | products[]                            |
| Add Product                                                     | button                               | pushes new product to array           |
| Remove Product                                                  | button                               | splices from array (hidden at 1 item) |

### UI States

| State                        | Behaviour                            |
| ---------------------------- | ------------------------------------ |
| 1 product                    | Single column layout                 |
| 6 columns                    | Dense grid, cards squash accordingly |
| All products without images  | Grey placeholders                    |
| Mixed sale/non-sale products | Each renders independently           |

---

## 3. ecomFeaturedProduct

### Props

```js
{
  imageUrl: "https://images.unsplash.com/...",
  title: "Premium Chronograph Watch",
  description: "Handcrafted stainless steel timepiece...",
  price: "£349.00",
  salePrice: "£279.00",
  variants: "Black / Silver / Rose Gold",
  btnText: "Add to Cart",
  bg: "#111111",
  textColor: "#f7f6f2",
  accentColor: "#CDFE00",
  saleColor: "#ef4444",
}
```

### Behaviour

- Split layout: image left, details right
- Image fills left half
- Description supports multi-line text
- Variants shown as inline text (comma-separated)
- Quantity selector with −/+ buttons
- CTA button with accent colour

### Edit Panel Controls

| Control     | Type       | Prop        |
| ----------- | ---------- | ----------- |
| Image URL   | text input | imageUrl    |
| Title       | text input | title       |
| Description | textarea   | description |
| Price       | text input | price       |
| Sale Price  | text input | salePrice   |
| Variants    | text input | variants    |
| Button Text | text input | btnText     |

---

## 4. ecomProductCarousel

### Props

```js
{
  cardsVisible: 4,
  products: [
    { imageUrl: "", title: "", price: "", salePrice: "" }
  ],
  bg: "#111111",
  textColor: "#f7f6f2",
  accentColor: "#CDFE00",
  saleColor: "#ef4444",
}
```

### Behaviour

- Horizontal scrollable strip of product cards
- Left/right arrow buttons scroll the track
- `cardsVisible` controls how many cards are visible before scrolling
- Scroll snaps to card boundaries

### Edit Panel Controls

| Control                                      | Type            | Prop               |
| -------------------------------------------- | --------------- | ------------------ |
| Cards Visible                                | number input    | cardsVisible       |
| Per-product: Image, Title, Price, Sale Price | text/num inputs | products[]         |
| Add Product                                  | button          | pushes new product |
| Remove Product                               | button          | splices from array |

---

## 5. ecomQuickView

### Props

```js
{
  triggerText: "Quick View",
  imageUrl: "https://images.unsplash.com/...",
  title: "Premium Watch",
  price: "£129.00",
  salePrice: "",
  description: "Product description here...",
  btnText: "Add to Cart",
  modalBg: "#1a1a1a",
  overlayOpacity: 0.8,
  bg: "#111111",
  textColor: "#f7f6f2",
  accentColor: "#CDFE00",
  saleColor: "#ef4444",
}
```

### Behaviour

- Trigger button opens a modal overlay
- Modal contains product image, title, price, description, and CTA
- Close button and overlay click close the modal
- Overlay opacity controlled by `overlayOpacity`

### Edit Panel Controls

| Control          | Type        | Prop        |
| ---------------- | ----------- | ----------- |
| Trigger Text     | text input  | triggerText |
| Image URL        | text input  | imageUrl    |
| Title            | text input  | title       |
| Price            | text input  | price       |
| Sale Price       | text input  | salePrice   |
| Description      | textarea    | description |
| Button Text      | text input  | btnText     |
| Modal Background | color input | modalBg     |

---

## Cleanup

After migrating all 5 blocks to `widgets/ecom-products.js`:

1. **Remove** `FB.blocks.ECOMMERCE_DEFS` from `blocks.js` entirely (lines 1216-1699)
2. **Remove** all 18 `case "ecom*"` entries from the switch-case in `canvas.js` (lines 2454-3150+)
3. **Add** `import "../widgets/ecom-products.js"` to `src/main.js`

**Why remove all 18 ecom cases even though we're only migrating 5?**
The remaining 13 blocks still need their rendering. We'll do those in Phase 2/3. For now, the 13 unchanged blocks will lose their rendering unless we keep their canvas.js cases. So we actually need to **keep the remaining 13 cases** until Phase 2/3.

**Revised cleanup plan:**

- Remove only the 5 migrated case entries from canvas.js
- Remove the 5 migrated entries from ECOMMERCE_DEFS in blocks.js
- Keep the remaining 13 entries as-is (they still work, just without edit panels)
- Remove ECOMMERCE_DEFS entirely ONLY after all 18 are migrated

## File Structure

```
widgets/ecom-products.js  — FB.widgets.register for all 5 product blocks
src/main.js              — add import line
```

Each registration in `ecom-products.js` follows this template:

```js
FB.widgets.register("ecomProductCard", {
  label: "Product Card",
  icon: "...",
  iconBg: "...",
  iconColor: "...",
  category: "ecommerce",
  defaultProps: {
    /* all defaults */
  },
  render: function (p) {
    var esc = function (v) {
      /* HTML escape */
    };
    // Return HTML string
  },
  editPanel: function (id, p) {
    var esc = function (v) {
      /* attribute escape */
    };
    // Return HTML string with rp-row + FB.panels.updateWidgetProp()
  },
});
```

The `category: "ecommerce"` will be surfaced alongside "content", "media", "interactive" categories in the block palette.

---

## Open Questions

None at this stage. Each block has clearly defined props, behaviours, and edit controls. Phase 2 (checkout) and Phase 3 (supporting) will follow the same pattern.
