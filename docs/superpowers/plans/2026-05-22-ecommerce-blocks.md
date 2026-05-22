# Ecommerce Blocks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 13 frontend ecommerce blocks to the Framework Builder under a new "Ecommerce" section in the left panel.

**Architecture:** New `FB.blocks.ECOMMERCE_DEFS` object in `js/blocks.js`, new "Ecommerce" accordion with sub-accordions in `js/panels.js`, 13 render cases in `js/canvas.js`, CSS with `.fw-ecom-` prefix in `css/blocks.css`, cart state + init functions in `js/canvas.js`. All pure CSS/vanilla JS, no external dependencies.

**Tech Stack:** Vanilla JS, CSS, existing Framework Builder patterns (contenteditable, data-field props, IntersectionObserver animations)

---

### Task 1: ECOMMERCE_DEFS block definitions

**Files:**

- Modify: `js/blocks.js:1241` (add after closing `};` of CUSTOM_BLOCK_DEFS)

- [ ] **Step 1: Add ECOMMERCE_DEFS object**

Add after line 1241 (after the closing `};` of CUSTOM_BLOCK_DEFS):

```js
FB.blocks.ECOMMERCE_DEFS = {
  ecommerceProductCard: {
    label: "Product Card",
    sublabel: "Image, price, rating, add-to-cart",
    icon: "\u{1F6CD}",
    iconBg: "#6366f1",
    iconColor: "#d0d0d0",
    defaultProps: {
      imageUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      title: "Premium Watch",
      price: 149.99,
      salePrice: 99.99,
      rating: 4.5,
      reviewCount: 128,
      btnText: "Add to Cart",
      badge: "Sale",
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
      saleColor: "#ef4444",
    },
  },
  ecommerceProductGrid: {
    label: "Product Grid",
    sublabel: "Multi-column product layout",
    icon: "\u229E",
    iconBg: "#6366f1",
    iconColor: "#d0d0d0",
    defaultProps: {
      columns: 3,
      products: [
        {
          title: "Product One",
          price: 49.99,
          salePrice: 39.99,
          rating: 4,
          badge: "New",
        },
        {
          title: "Product Two",
          price: 79.99,
          salePrice: "",
          rating: 5,
          badge: "",
        },
        {
          title: "Product Three",
          price: 29.99,
          salePrice: 19.99,
          rating: 3,
          badge: "Sale",
        },
        {
          title: "Product Four",
          price: 59.99,
          salePrice: "",
          rating: 4,
          badge: "",
        },
        {
          title: "Product Five",
          price: 89.99,
          salePrice: 69.99,
          rating: 5,
          badge: "Hot",
        },
        {
          title: "Product Six",
          price: 19.99,
          salePrice: "",
          rating: 4,
          badge: "",
        },
      ],
      gap: 16,
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
      saleColor: "#ef4444",
    },
  },
  ecommerceFeaturedProduct: {
    label: "Featured Product",
    sublabel: "Split layout product showcase",
    icon: "\u2605",
    iconBg: "#6366f1",
    iconColor: "#d0d0d0",
    defaultProps: {
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      title: "Premium Headphones",
      description:
        "High-fidelity audio with active noise cancellation. 30-hour battery life.",
      price: 299.99,
      salePrice: 249.99,
      variants: ["Black", "Silver", "Navy"],
      btnText: "Add to Cart",
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
      saleColor: "#ef4444",
    },
  },
  ecommerceProductCarousel: {
    label: "Product Carousel",
    sublabel: "Horizontal scrolling products",
    icon: "\u2192",
    iconBg: "#6366f1",
    iconColor: "#d0d0d0",
    defaultProps: {
      products: [
        { title: "Item A", price: 29.99, salePrice: "", rating: 4 },
        { title: "Item B", price: 49.99, salePrice: 34.99, rating: 5 },
        { title: "Item C", price: 19.99, salePrice: "", rating: 3 },
        { title: "Item D", price: 59.99, salePrice: "", rating: 4 },
        { title: "Item E", price: 39.99, salePrice: 24.99, rating: 5 },
        { title: "Item F", price: 79.99, salePrice: "", rating: 4 },
      ],
      cardsVisible: 4,
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
      saleColor: "#ef4444",
    },
  },
  ecommerceQuickView: {
    label: "Product Quick View",
    sublabel: "Modal product preview",
    icon: "\u25C9",
    iconBg: "#6366f1",
    iconColor: "#d0d0d0",
    defaultProps: {
      triggerText: "Quick View",
      title: "Product Name",
      price: 99.99,
      salePrice: 79.99,
      imageUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
      modalBg: "#1a1a1a",
      overlayOpacity: 0.85,
      accentColor: "#CDFE00",
      saleColor: "#ef4444",
    },
  },
  ecommerceCartDrawer: {
    label: "Cart Drawer",
    sublabel: "Slide-in cart panel",
    icon: "\u{1F6D2}",
    iconBg: "#6366f1",
    iconColor: "#d0d0d0",
    defaultProps: {
      items: [
        { title: "Premium Watch", price: 149.99, qty: 1, imageUrl: "" },
        { title: "Leather Strap", price: 29.99, qty: 2, imageUrl: "" },
      ],
      emptyText: "Your cart is empty",
      checkoutBtnText: "Checkout",
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
    },
  },
  ecommerceCartSummary: {
    label: "Cart Summary",
    sublabel: "Totals and checkout info",
    icon: "\u03A3",
    iconBg: "#6366f1",
    iconColor: "#d0d0d0",
    defaultProps: {
      subtotal: 209.97,
      shippingText: "Free shipping",
      taxRate: 0.08,
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
    },
  },
  ecommerceCheckoutForm: {
    label: "Checkout Form",
    sublabel: "Billing and payment fields",
    icon: "\u{1F4CB}",
    iconBg: "#6366f1",
    iconColor: "#d0d0d0",
    defaultProps: {
      heading: "Checkout",
      btnText: "Place Order",
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
    },
  },
  ecommerceSaleBanner: {
    label: "Sale Banner",
    sublabel: "Promotional discount strip",
    icon: "%",
    iconBg: "#6366f1",
    iconColor: "#d0d0d0",
    defaultProps: {
      headline: "Summer Sale \u2014 Up to 50% Off",
      subtext: "Limited time only. No code needed.",
      btnText: "Shop Now",
      btnUrl: "#",
      bg: "#ef4444",
      textColor: "#ffffff",
      accentColor: "#ffffff",
    },
  },
  ecommerceCountdown: {
    label: "Countdown Timer",
    sublabel: "Flash sale countdown",
    icon: "\u23F1",
    iconBg: "#6366f1",
    iconColor: "#d0d0d0",
    defaultProps: {
      headline: "Sale Ends In",
      targetDate: "2026-06-01T00:00:00",
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
    },
  },
  ecommerceCouponInput: {
    label: "Coupon Input",
    sublabel: "Promo code field",
    icon: "\u{1F3AB}",
    iconBg: "#6366f1",
    iconColor: "#d0d0d0",
    defaultProps: {
      headline: "Have a promo code?",
      placeholder: "Enter code",
      btnText: "Apply",
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
    },
  },
  ecommerceShippingProgress: {
    label: "Shipping Progress",
    sublabel: "Free shipping progress bar",
    icon: "\u{1F4E6}",
    iconBg: "#6366f1",
    iconColor: "#d0d0d0",
    defaultProps: {
      threshold: 50,
      currentAmount: 32,
      headline: "You're $18 away from free shipping!",
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
    },
  },
  ecommerceReviews: {
    label: "Product Reviews",
    sublabel: "Star ratings and review cards",
    icon: "\u2606",
    iconBg: "#6366f1",
    iconColor: "#d0d0d0",
    defaultProps: {
      rating: 4.8,
      reviewCount: 234,
      reviews: [
        {
          name: "Sarah M.",
          rating: 5,
          text: "Absolutely love this product. Exceeded expectations!",
          date: "2 days ago",
        },
        {
          name: "James K.",
          rating: 4,
          text: "Great quality, fast shipping. Would buy again.",
          date: "1 week ago",
        },
        {
          name: "Emily R.",
          rating: 5,
          text: "Perfect gift. My partner was thrilled.",
          date: "2 weeks ago",
        },
      ],
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
    },
  },
};
```

- [ ] **Step 2: Verify syntax**
      Run: `node -c js/blocks.js`
      Expected: No output

---

### Task 2: Ecommerce section in left panel

**Files:**

- Modify: `js/panels.js:116` (add ecommerce sections after existing sections map)
- Modify: `js/canvas.js:2443` (update allDefs to include ECOMMERCE_DEFS)

- [ ] **Step 1: Add ecommerce sub-sections**
      After line 116 in panels.js (after `};` of sections object), add:

```js
var ecommerceSections = {
  "Product Display": [
    "ecommerceProductCard",
    "ecommerceProductGrid",
    "ecommerceFeaturedProduct",
    "ecommerceProductCarousel",
    "ecommerceQuickView",
  ],
  Shopping: [
    "ecommerceCartDrawer",
    "ecommerceCartSummary",
    "ecommerceCheckoutForm",
  ],
  Marketing: [
    "ecommerceSaleBanner",
    "ecommerceCountdown",
    "ecommerceCouponInput",
    "ecommerceShippingProgress",
    "ecommerceReviews",
  ],
};
var ecommerceColor = "#6366f1";
```

- [ ] **Step 2: Render ecommerce accordion**
      After the existing `Object.keys(sections).forEach(...)` loop (around line 130), add the ecommerce rendering loop that creates section headers and block items using `FB.blocks.ECOMMERCE_DEFS`.

- [ ] **Step 3: Update insertBlock to check ECOMMERCE_DEFS**
      In `FB.canvas.insertBlock` and `FB.canvas.insertBlockIntoContainer`, change:
      `var allDefs = Object.assign({}, FB.blocks.BLOCK_DEFS, FB.blocks.CUSTOM_BLOCK_DEFS, FB.widgets._registry);`
      to:
      `var allDefs = Object.assign({}, FB.blocks.BLOCK_DEFS, FB.blocks.CUSTOM_BLOCK_DEFS, FB.blocks.ECOMMERCE_DEFS || {}, FB.widgets._registry);`

- [ ] **Step 4: Verify syntax**
      Run: `node -c js/panels.js && node -c js/canvas.js`

---

### Task 3: Product Card render + CSS

**Files:**

- Modify: `js/canvas.js:1725` (add case before `default:`)
- Modify: `css/blocks.css:1414` (add CSS at end)

- [ ] **Step 1: Add render case** - Build HTML with badge, image div, title (contenteditable), star rating, price (with optional sale strikethrough), add-to-cart button. Use `p` for all props.
- [ ] **Step 2: Add CSS** - `.fw-ecom-product-card` with hover lift, badge positioning, image zoom on hover, star rating layout, price styling, button hover.
- [ ] **Step 3: Verify** `node -c js/canvas.js`

---

### Task 4: Product Grid render + CSS

**Files:**

- Modify: `js/canvas.js` (add case)
- Modify: `css/blocks.css` (add CSS)

- [ ] **Step 1: Add render case** - Map `p.products` array to product card HTML, wrap in grid with `grid-template-columns: repeat(N, 1fr)`.
- [ ] **Step 2: Add CSS** - `.fw-ecom-product-grid` with responsive grid, media queries for 2-col and 1-col breakpoints.

---

### Task 5: Featured Product render + CSS

**Files:**

- Modify: `js/canvas.js` (add case)
- Modify: `css/blocks.css` (add CSS)

- [ ] **Step 1: Add render case** - Split layout: image div left, info right (title, description, price, variant swatches, qty stepper, add-to-cart button).
- [ ] **Step 2: Add CSS** - `.fw-ecom-featured` grid layout, variant buttons, qty controls, responsive collapse to single column.

---

### Task 6: Product Carousel render + CSS

**Files:**

- Modify: `js/canvas.js` (add case)
- Modify: `css/blocks.css` (add CSS)

- [ ] **Step 1: Add render case** - Map products to compact cards in horizontal scroll container with snap.
- [ ] **Step 2: Add CSS** - `.fw-ecom-carousel-track` with flex, overflow-x auto, scroll-snap.

---

### Task 7: Quick View render + CSS

**Files:**

- Modify: `js/canvas.js` (add case)
- Modify: `css/blocks.css` (add CSS)

- [ ] **Step 1: Add render case** - Trigger button + hidden modal overlay with product image, title, price, add-to-cart, close button.
- [ ] **Step 2: Add CSS** - `.fw-ecom-qv-overlay` fixed fullscreen, `.fw-ecom-qv-modal` centered grid, responsive single column.

---

### Task 8: Cart Drawer render + CSS

**Files:**

- Modify: `js/canvas.js` (add case)
- Modify: `css/blocks.css` (add CSS)

- [ ] **Step 1: Add render case** - Toggle button + slide-in panel with cart items (thumbnail, title, qty stepper, price, remove), subtotal, checkout button.
- [ ] **Step 2: Add CSS** - `.fw-ecom-cart-panel` fixed right-side slide-in, item layout, responsive full-width on mobile.

---

### Task 9: Cart Summary render + CSS

**Files:**

- Modify: `js/canvas.js` (add case)
- Modify: `css/blocks.css` (add CSS)

- [ ] **Step 1: Add render case** - Order summary rows: subtotal, shipping, tax, total. Calculate tax from `p.taxRate`.
- [ ] **Step 2: Add CSS** - `.fw-ecom-cart-summary` bordered card, summary rows with flex spacing.

---

### Task 10: Checkout Form render + CSS

**Files:**

- Modify: `js/canvas.js` (add case)
- Modify: `css/blocks.css` (add CSS)

- [ ] **Step 1: Add render case** - Two-column: shipping fields (name, email, address, city, postcode, phone) + payment method buttons left, order summary placeholder right, submit button.
- [ ] **Step 2: Add CSS** - `.fw-ecom-checkout` grid, form inputs with focus states, payment buttons, responsive collapse.

---

### Task 11: Sale Banner render + CSS

**Files:**

- Modify: `js/canvas.js` (add case)
- Modify: `css/blocks.css` (add CSS)

- [ ] **Step 1: Add render case** - Full-width banner with headline, subtext, CTA button.
- [ ] **Step 2: Add CSS** - `.fw-ecom-sale-banner` flex layout, responsive centering.

---

### Task 12: Countdown Timer render + CSS + JS

**Files:**

- Modify: `js/canvas.js` (add case + initCountdown function)
- Modify: `css/blocks.css` (add CSS)

- [ ] **Step 1: Add render case** - Four digit boxes (days, hours, minutes, seconds) with `data-target` attribute.
- [ ] **Step 2: Add CSS** - Large digit boxes with background, accent-colored labels.
- [ ] **Step 3: Add `FB.canvas.initCountdown`** - Parse `data-target`, setInterval updating every second, padStart(2, "0").

---

### Task 13: Coupon Input render + CSS

**Files:**

- Modify: `js/canvas.js` (add case)
- Modify: `css/blocks.css` (add CSS)

- [ ] **Step 1: Add render case** - Centered headline + input field + apply button row.
- [ ] **Step 2: Add CSS** - `.fw-ecom-coupon` centered layout, input focus states.

---

### Task 14: Shipping Progress render + CSS

**Files:**

- Modify: `js/canvas.js` (add case)
- Modify: `css/blocks.css` (add CSS)

- [ ] **Step 1: Add render case** - Calculate percentage from `currentAmount/threshold`, show remaining or success message, progress bar with fill width.
- [ ] **Step 2: Add CSS** - `.fw-ecom-sp-track` thin bar, `.fw-ecom-sp-fill` animated fill.

---

### Task 15: Product Reviews render + CSS

**Files:**

- Modify: `js/canvas.js` (add case)
- Modify: `css/blocks.css` (add CSS)

- [ ] **Step 1: Add render case** - Summary (big number, stars, count) + review cards (name, date, stars, text).
- [ ] **Step 2: Add CSS** - `.fw-ecom-reviews-block` centered summary, card grid with borders.

---

### Task 16: Wire up init functions and version bump

**Files:**

- Modify: `js/canvas.js` (add initCountdown to render setTimeout)
- Modify: `js/app.js` (add initCountdown to FB.init)
- Modify: `framework-builder.html` (bump versions)

- [ ] **Step 1:** Add `FB.canvas.initCountdown();` to canvas.js render setTimeout
- [ ] **Step 2:** Add `FB.canvas.initCountdown();` to app.js after initSvgDraw
- [ ] **Step 3:** Bump versions: blocks.js v4, canvas.js v11, panels.js v7, app.js v3, blocks.css v3, layout.css v3
- [ ] **Step 4:** Run `node -c js/blocks.js && node -c js/canvas.js && node -c js/panels.js && node -c js/app.js && echo "ALL OK"`
