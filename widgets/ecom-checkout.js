/* ===== Ecommerce Checkout & Supporting Blocks ===== */

/* ── Cart Drawer ── */
FB.widgets.register("ecomCartDrawer", {
  label: "Cart Drawer",
  icon: "\uD83D\uDECD",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    emptyText: "Your cart is empty",
    checkoutBtnText: "Checkout",
    bg: "#1a1a1a",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
  },
  render: function (p) {
    return (
      '<div class="fw-ecom-cart-drawer" style="background:' +
      (p.bg || "#1a1a1a") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '">' +
      '<div class="fw-ecom-cart-drawer-header"><h3>Your Cart</h3><button class="fw-ecom-cart-drawer-close">\u00D7</button></div>' +
      '<div class="fw-ecom-cart-drawer-item">' +
      '<img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120" alt="">' +
      '<div class="fw-ecom-cart-drawer-item-info">' +
      '<div class="fw-ecom-cart-drawer-item-title">Premium Watch</div>' +
      '<div class="fw-ecom-cart-drawer-item-price">\u00A3129.00</div>' +
      '<div class="fw-ecom-cart-drawer-qty"><button>\u2212</button><span>1</span><button>+</button></div></div></div>' +
      '<div class="fw-ecom-cart-drawer-item">' +
      '<img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120" alt="">' +
      '<div class="fw-ecom-cart-drawer-item-info">' +
      '<div class="fw-ecom-cart-drawer-item-title">Wireless Headphones</div>' +
      '<div class="fw-ecom-cart-drawer-item-price">\u00A389.00</div>' +
      '<div class="fw-ecom-cart-drawer-qty"><button>\u2212</button><span>2</span><button>+</button></div></div></div>' +
      '<div class="fw-ecom-cart-drawer-footer">' +
      '<div class="fw-ecom-cart-drawer-subtotal"><span>Subtotal</span><span>\u00A3307.00</span></div>' +
      '<button class="fw-ecom-cart-drawer-checkout" style="background:' +
      (p.accentColor || "#CDFE00") +
      ';color:#111">' +
      _ecomEsc(p.checkoutBtnText || "Checkout") +
      "</button></div></div>"
    );
  },
  editPanel: function (id, p) {
    var e = function (v) {
      return v !== undefined && v !== null
        ? String(v).replace(/"/g, "&quot;")
        : "";
    };
    return (
      '<div class="rp-row"><label>Empty Text</label><input type="text" value="' +
      e(p.emptyText || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','emptyText',this.value)\" /></div>" +
      '<div class="rp-row"><label>Checkout Button Text</label><input type="text" value="' +
      e(p.checkoutBtnText || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','checkoutBtnText',this.value)\" /></div>"
    );
  },
});

/* ── Cart Summary ── */
FB.widgets.register("ecomCartSummary", {
  label: "Cart Summary",
  icon: "\u03A3",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    shippingText: "Shipping",
    taxRate: 20,
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
  },
  render: function (p) {
    var tr = p.taxRate || 20;
    return (
      '<div class="fw-ecom-cart-summary" style="background:' +
      (p.bg || "#111") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '">' +
      "<h3>Order Summary</h3>" +
      '<div class="fw-ecom-cart-summary-row"><span>Subtotal</span><span>\u00A3307.00</span></div>' +
      '<div class="fw-ecom-cart-summary-row"><span>' +
      _ecomEsc(p.shippingText || "Shipping") +
      "</span><span>\u00A35.00</span></div>" +
      '<div class="fw-ecom-cart-summary-row"><span>Tax (' +
      tr +
      "%)</span><span>\u00A361.40</span></div>" +
      '<div class="fw-ecom-cart-summary-row total"><span>Total</span><span>\u00A3373.40</span></div>' +
      '<div class="fw-ecom-cart-summary-coupon">' +
      '<input type="text" placeholder="Promo code">' +
      '<button style="background:' +
      (p.accentColor || "#CDFE00") +
      ';color:#111">Apply</button></div></div>'
    );
  },
  editPanel: function (id, p) {
    var e = function (v) {
      return v !== undefined && v !== null
        ? String(v).replace(/"/g, "&quot;")
        : "";
    };
    return (
      '<div class="rp-row"><label>Shipping Text</label><input type="text" value="' +
      e(p.shippingText || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','shippingText',this.value)\" /></div>" +
      '<div class="rp-row"><label>Tax Rate (%)</label><input type="number" min="0" max="100" value="' +
      e(String(p.taxRate || 20)) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','taxRate',+this.value)\" /></div>"
    );
  },
});

/* ── Checkout Form ── */
FB.widgets.register("ecomCheckoutForm", {
  label: "Checkout Form",
  icon: "\uD83D\uDCCB",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    heading: "Checkout",
    btnText: "Place Order",
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
  },
  render: function (p) {
    return (
      '<div class="fw-ecom-checkout" style="background:' +
      (p.bg || "#111") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '">' +
      '<div class="fw-ecom-checkout-form">' +
      "<h2>" +
      _ecomEsc(p.heading || "Checkout") +
      "</h2>" +
      '<div class="fw-ecom-checkout-field"><label>Email</label><input type="email" placeholder="you@example.com"></div>' +
      '<div class="fw-ecom-checkout-row">' +
      '<div class="fw-ecom-checkout-field"><label>First Name</label><input type="text" placeholder="John"></div>' +
      '<div class="fw-ecom-checkout-field"><label>Last Name</label><input type="text" placeholder="Doe"></div></div>' +
      '<div class="fw-ecom-checkout-field"><label>Address</label><input type="text" placeholder="123 Main St"></div>' +
      '<div class="fw-ecom-checkout-row">' +
      '<div class="fw-ecom-checkout-field"><label>City</label><input type="text" placeholder="London"></div>' +
      '<div class="fw-ecom-checkout-field"><label>Postcode</label><input type="text" placeholder="EC1A 1BB"></div></div>' +
      '<div class="fw-ecom-checkout-field"><label>Card Number</label><input type="text" placeholder="4242 4242 4242 4242"></div>' +
      '<div class="fw-ecom-checkout-row">' +
      '<div class="fw-ecom-checkout-field"><label>Expiry</label><input type="text" placeholder="MM/YY"></div>' +
      '<div class="fw-ecom-checkout-field"><label>CVV</label><input type="text" placeholder="123"></div></div>' +
      '<button class="fw-ecom-checkout-submit" style="background:' +
      (p.accentColor || "#CDFE00") +
      ';color:#111">' +
      _ecomEsc(p.btnText || "Place Order") +
      "</button></div>" +
      '<div class="fw-ecom-checkout-summary">' +
      "<h4>Order Summary</h4>" +
      '<div class="fw-ecom-checkout-summary-item"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80" alt="">' +
      '<div class="fw-ecom-checkout-summary-item-name">Premium Watch \u00D7 1</div>' +
      '<div class="fw-ecom-checkout-summary-item-price">\u00A3129.00</div></div>' +
      '<div class="fw-ecom-checkout-summary-item"><img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80" alt="">' +
      '<div class="fw-ecom-checkout-summary-item-name">Headphones \u00D7 2</div>' +
      '<div class="fw-ecom-checkout-summary-item-price">\u00A3178.00</div></div>' +
      '<div class="fw-ecom-cart-summary-row" style="margin-top:16px"><span>Subtotal</span><span>\u00A3307.00</span></div>' +
      '<div class="fw-ecom-cart-summary-row total"><span>Total</span><span>\u00A3373.40</span></div></div></div>'
    );
  },
  editPanel: function (id, p) {
    var e = function (v) {
      return v !== undefined && v !== null
        ? String(v).replace(/"/g, "&quot;")
        : "";
    };
    return (
      '<div class="rp-row"><label>Heading</label><input type="text" value="' +
      e(p.heading || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','heading',this.value)\" /></div>" +
      '<div class="rp-row"><label>Button Text</label><input type="text" value="' +
      e(p.btnText || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','btnText',this.value)\" /></div>"
    );
  },
});

/* ── Sale Banner ── */
FB.widgets.register("ecomSaleBanner", {
  label: "Sale Banner",
  icon: "\uD83D\uDD25",
  iconBg: "#ef4444",
  iconColor: "#fff",
  category: "ecommerce",
  defaultProps: {
    headline: "SUMMER SALE",
    subtext: "Up to 50% off selected items",
    btnText: "Shop Now",
    btnUrl: "#",
    bg: "#ef4444",
    textColor: "#ffffff",
    accentColor: "#CDFE00",
  },
  render: function (p) {
    return (
      '<div class="fw-ecom-sale-banner" style="background:' +
      (p.bg || "#ef4444") +
      ";color:" +
      (p.textColor || "#fff") +
      '">' +
      "<h2>" +
      _ecomEsc(p.headline || "") +
      "</h2>" +
      "<p>" +
      _ecomEsc(p.subtext || "") +
      "</p>" +
      '<a class="fw-ecom-sale-banner-btn" href="' +
      _ecomEsc(p.btnUrl || "#") +
      '" style="background:' +
      (p.textColor || "#fff") +
      ";color:" +
      (p.bg || "#ef4444") +
      '">' +
      _ecomEsc(p.btnText || "") +
      "</a></div>"
    );
  },
  editPanel: function (id, p) {
    var e = function (v) {
      return v !== undefined && v !== null
        ? String(v).replace(/"/g, "&quot;")
        : "";
    };
    return (
      '<div class="rp-row"><label>Headline</label><input type="text" value="' +
      e(p.headline || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','headline',this.value)\" /></div>" +
      '<div class="rp-row"><label>Subtext</label><input type="text" value="' +
      e(p.subtext || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','subtext',this.value)\" /></div>" +
      '<div class="rp-row"><label>Button Text</label><input type="text" value="' +
      e(p.btnText || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','btnText',this.value)\" /></div>" +
      '<div class="rp-row"><label>Button URL</label><input type="text" value="' +
      e(p.btnUrl || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','btnUrl',this.value)\" /></div>"
    );
  },
});

/* ── Countdown Timer ── */
FB.widgets.register("ecomCountdown", {
  label: "Countdown Timer",
  icon: "\u23F1",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    headline: "Sale Ends In",
    targetDate: "2026-06-01T00:00:00",
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
  },
  render: function (p) {
    var ac = p.accentColor || "#CDFE00";
    return (
      '<div class="fw-ecom-countdown" style="background:' +
      (p.bg || "#111") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '" data-target-date="' +
      _ecomEsc(p.targetDate || "") +
      '">' +
      "<h3>" +
      _ecomEsc(p.headline || "") +
      "</h3>" +
      '<div class="fw-ecom-countdown-digits">' +
      '<div class="fw-ecom-countdown-digit"><span class="number" style="border-color:' +
      ac +
      ";color:" +
      ac +
      '" data-unit="days">12</span><span class="label">Days</span></div>' +
      '<div class="fw-ecom-countdown-digit"><span class="number" style="border-color:' +
      ac +
      ";color:" +
      ac +
      '" data-unit="hours">08</span><span class="label">Hours</span></div>' +
      '<div class="fw-ecom-countdown-digit"><span class="number" style="border-color:' +
      ac +
      ";color:" +
      ac +
      '" data-unit="minutes">45</span><span class="label">Minutes</span></div>' +
      '<div class="fw-ecom-countdown-digit"><span class="number" style="border-color:' +
      ac +
      ";color:" +
      ac +
      '" data-unit="seconds">30</span><span class="label">Seconds</span></div>' +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var e = function (v) {
      return v !== undefined && v !== null
        ? String(v).replace(/"/g, "&quot;")
        : "";
    };
    return (
      '<div class="rp-row"><label>Headline</label><input type="text" value="' +
      e(p.headline || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','headline',this.value)\" /></div>" +
      '<div class="rp-row"><label>Target Date/Time</label><input type="text" value="' +
      e(p.targetDate || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','targetDate',this.value)\" /></div>"
    );
  },
});

/* ── Coupon Input ── */
FB.widgets.register("ecomCouponInput", {
  label: "Coupon Input",
  icon: "\uD83C\uDFF7",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    headline: "Have a promo code?",
    placeholder: "Enter code here",
    btnText: "Apply",
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
  },
  render: function (p) {
    return (
      '<div class="fw-ecom-coupon" style="background:' +
      (p.bg || "#111") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '">' +
      "<h3>" +
      _ecomEsc(p.headline || "") +
      "</h3>" +
      '<div class="fw-ecom-coupon-form">' +
      '<input type="text" placeholder="' +
      _ecomEsc(p.placeholder || "Enter code here") +
      '">' +
      '<button style="background:' +
      (p.accentColor || "#CDFE00") +
      ';color:#111">' +
      _ecomEsc(p.btnText || "Apply") +
      "</button></div></div>"
    );
  },
  editPanel: function (id, p) {
    var e = function (v) {
      return v !== undefined && v !== null
        ? String(v).replace(/"/g, "&quot;")
        : "";
    };
    return (
      '<div class="rp-row"><label>Headline</label><input type="text" value="' +
      e(p.headline || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','headline',this.value)\" /></div>" +
      '<div class="rp-row"><label>Placeholder</label><input type="text" value="' +
      e(p.placeholder || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','placeholder',this.value)\" /></div>" +
      '<div class="rp-row"><label>Button Text</label><input type="text" value="' +
      e(p.btnText || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','btnText',this.value)\" /></div>"
    );
  },
});

/* ── Shipping Progress ── */
FB.widgets.register("ecomShippingProgress", {
  label: "Shipping Progress",
  icon: "\uD83D\uDCE6",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    threshold: 50,
    currentAmount: 32,
    headline: "Free shipping on orders over \u00A350",
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
  },
  render: function (p) {
    var pct = Math.min(
      100,
      Math.round(((p.currentAmount || 0) / (p.threshold || 50)) * 100),
    );
    var remaining = Math.max(0, (p.threshold || 50) - (p.currentAmount || 0));
    return (
      '<div class="fw-ecom-shipping" style="background:' +
      (p.bg || "#111") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '">' +
      "<h4>" +
      _ecomEsc(p.headline || "") +
      "</h4>" +
      '<div class="fw-ecom-shipping-bar">' +
      '<div class="fw-ecom-shipping-fill" style="width:' +
      pct +
      "%;background:" +
      (p.accentColor || "#CDFE00") +
      '"></div></div>' +
      '<div class="fw-ecom-shipping-text">\u00A3<strong>' +
      (p.currentAmount || 0) +
      "</strong> of \u00A3<strong>" +
      (p.threshold || 50) +
      "</strong>" +
      (remaining > 0
        ? " — add <strong>\u00A3" +
          remaining +
          "</strong> more for free shipping!"
        : " — <strong>You qualify for free shipping!</strong>") +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var e = function (v) {
      return v !== undefined && v !== null
        ? String(v).replace(/"/g, "&quot;")
        : "";
    };
    return (
      '<div class="rp-row"><label>Headline</label><input type="text" value="' +
      e(p.headline || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','headline',this.value)\" /></div>" +
      '<div class="rp-row"><label>Free Shipping Threshold (\u00A3)</label>' +
      '<input type="number" min="0" value="' +
      e(String(p.threshold || 50)) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','threshold',+this.value)\" /></div>" +
      '<div class="rp-row"><label>Current Amount (\u00A3)</label>' +
      '<input type="number" min="0" value="' +
      e(String(p.currentAmount || 0)) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','currentAmount',+this.value)\" /></div>"
    );
  },
});

/* ── Newsletter Signup ── */
FB.widgets.register("ecomNewsletter", {
  label: "Newsletter Signup",
  icon: "\u2709",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    headline: "Get 10% Off Your First Order",
    subtext:
      "Join our mailing list for exclusive deals, new arrivals, and style inspiration.",
    placeholder: "Enter your email",
    btnText: "Subscribe",
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
  },
  render: function (p) {
    return (
      '<div class="fw-ecom-newsletter" style="background:' +
      (p.bg || "#111") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '">' +
      '<div class="fw-ecom-newsletter-inner">' +
      "<h2>" +
      _ecomEsc(p.headline || "") +
      "</h2>" +
      "<p>" +
      _ecomEsc(p.subtext || "") +
      "</p>" +
      '<div class="fw-ecom-newsletter-form">' +
      '<input type="email" placeholder="' +
      _ecomEsc(p.placeholder || "Enter your email") +
      '">' +
      '<button style="background:' +
      (p.accentColor || "#CDFE00") +
      ';color:#111">' +
      _ecomEsc(p.btnText || "Subscribe") +
      "</button></div></div></div>"
    );
  },
  editPanel: function (id, p) {
    var e = function (v) {
      return v !== undefined && v !== null
        ? String(v).replace(/"/g, "&quot;")
        : "";
    };
    return (
      '<div class="rp-row"><label>Headline</label><input type="text" value="' +
      e(p.headline || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','headline',this.value)\" /></div>" +
      '<div class="rp-row"><label>Subtext</label><input type="text" value="' +
      e(p.subtext || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','subtext',this.value)\" /></div>" +
      '<div class="rp-row"><label>Placeholder</label><input type="text" value="' +
      e(p.placeholder || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','placeholder',this.value)\" /></div>" +
      '<div class="rp-row"><label>Button Text</label><input type="text" value="' +
      e(p.btnText || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','btnText',this.value)\" /></div>"
    );
  },
});
