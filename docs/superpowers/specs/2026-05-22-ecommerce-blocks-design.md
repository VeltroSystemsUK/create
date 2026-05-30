# Ecommerce Blocks Design Spec

**Date:** 2026-05-22
**Project:** Framework Builder — Visual Website Builder
**Scope:** Frontend ecommerce blocks only (no backend, no payment processing)

## Architecture

- **Block definitions:** `FB.blocks.ECOMMERCE_DEFS` in `js/blocks.js`
- **Panel:** New "Ecommerce" accordion in `js/panels.js` with sub-accordions (Product Display, Shopping, Marketing)
- **Render:** New `case` entries in `FB.canvas.renderBlockHTML()` in `js/canvas.js`
- **CSS:** `.fw-ecom-` prefixed classes in `css/blocks.css`
- **JS init:** Cart state (`FB.cart = { items: [] }`), countdown timers, filter interactions in `js/canvas.js`
- **Theming:** All blocks inherit `bg`, `textColor`, `accentColor` from props. Sale color uses `saleColor` (default `#ef4444`)
- **No backend:** All data is placeholder/static from block props

## Product Display (5 blocks)

### 1. Product Card (`ecomProductCard`)

- Image, title, price (optional sale price strikethrough), star rating, add-to-cart button
- Hover: image zoom, button reveal
- Props: `imageUrl`, `title`, `price`, `salePrice`, `rating`, `reviewCount`, `btnText`, `badge`

### 2. Product Grid (`ecomProductGrid`)

- 2-4 column responsive grid of product cards
- Props: `columns`, `products` (array), `gap`, `bg`, `textColor`, `accentColor`

### 3. Featured Product (`ecomFeaturedProduct`)

- Split layout: large image left, details right (title, description, price, variants, quantity, add-to-cart)
- Props: `imageUrl`, `title`, `description`, `price`, `salePrice`, `variants`, `btnText`

### 4. Product Carousel (`ecomProductCarousel`)

- Horizontal scroll strip of product cards with prev/next arrows
- Props: `products`, `cardsVisible`, `bg`, `textColor`, `accentColor`

### 5. Product Quick View (`ecomQuickView`)

- Modal overlay triggered by clicking a product
- Props: `triggerText`, `modalBg`, `overlayOpacity`

## Shopping (3 blocks)

### 6. Cart Drawer (`ecomCartDrawer`)

- Slide-in panel from right with line items, quantity stepper, subtotal, checkout button
- Props: `bg`, `textColor`, `accentColor`, `emptyText`, `checkoutBtnText`

### 7. Cart Summary (`ecomCartSummary`)

- Standalone block: subtotal, shipping, tax, discount input, grand total
- Props: `bg`, `textColor`, `accentColor`, `shippingText`, `taxRate`

### 8. Checkout Form (`ecomCheckoutForm`)

- Two-column: billing/shipping fields left, order summary right
- Props: `bg`, `textColor`, `accentColor`, `heading`, `btnText`

## Marketing (5 blocks)

### 9. Sale Banner (`ecomSaleBanner`)

- Full-width horizontal discount strip
- Props: `headline`, `subtext`, `bg` (default `#ef4444`), `textColor`, `btnText`, `btnUrl`

### 10. Countdown Timer (`ecomCountdown`)

- Large digit blocks: days/hours/minutes/seconds
- Props: `headline`, `targetDate`, `bg`, `textColor`, `accentColor`

### 11. Coupon Input (`ecomCouponInput`)

- Centered promo code field with apply button
- Props: `headline`, `placeholder`, `btnText`, `bg`, `textColor`, `accentColor`

### 12. Shipping Progress (`ecomShippingProgress`)

- "You're $X away from free shipping!" with animated progress bar
- Props: `threshold`, `currentAmount`, `headline`, `bg`, `textColor`, `accentColor`

### 13. Product Reviews (`ecomReviews`)

- Star rating summary + individual review cards
- Props: `rating`, `reviewCount`, `reviews`, `bg`, `textColor`, `accentColor`

## Implementation Order

1. Product Card → Product Grid → Featured Product → Product Carousel → Quick View
2. Cart Drawer → Cart Summary → Checkout Form
3. Sale Banner → Countdown Timer → Coupon Input → Shipping Progress → Reviews

## Constraints

- Pure CSS/vanilla JS, no external dependencies
- All blocks use `contenteditable` for inline editing
- All blocks use `data-field` attributes for property mapping
- Follow existing `fw-` class naming convention with `.fw-ecom-` prefix
- Match existing aesthetic: dark backgrounds, Lexend font, accent color `#CDFE00`
- No `async/await`, no external API calls
