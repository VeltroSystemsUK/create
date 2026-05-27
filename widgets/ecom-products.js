/* ===== Ecommerce Product Blocks ===== */

// Shared HTML escaping
function _ecomEsc(v) {
  return v !== undefined && v !== null
    ? String(v)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
    : "";
}

// Shared star renderer
function _ecomStars(count) {
  var s = "";
  for (var i = 0; i < Math.floor(count || 0); i++) s += "\u2605";
  return s;
}

/* ── Product Card ── */
FB.widgets.register("ecomProductCard", {
  label: "Product Card",
  icon: "\uD83D\uDED2",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    title: "Premium Watch",
    price: "\u00A3129.00",
    salePrice: "",
    rating: 4,
    reviewCount: 24,
    btnText: "Add to Cart",
    badge: "",
    badgeColor: "#ef4444",
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
  },
  render: function (p) {
    var stars = _ecomStars(p.rating);
    return (
      '<div class="fw-ecom-product-card" style="background:' +
      (p.bg || "#111") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '">' +
      '<div class="fw-ecom-product-card-img-wrap">' +
      (p.imageUrl
        ? '<img class="fw-ecom-product-card-img" src="' +
          _ecomEsc(p.imageUrl) +
          '" alt="">'
        : '<div style="padding:2rem;text-align:center;opacity:0.3">No image</div>') +
      (p.badge
        ? '<span class="fw-ecom-product-card-badge" style="background:' +
          (p.badgeColor || "#ef4444") +
          '">' +
          _ecomEsc(p.badge) +
          "</span>"
        : "") +
      "</div>" +
      '<div class="fw-ecom-product-card-body">' +
      '<h3 class="fw-ecom-product-card-title">' +
      _ecomEsc(p.title) +
      "</h3>" +
      '<div class="fw-ecom-product-card-rating" style="color:#FFD700">' +
      stars +
      (p.reviewCount
        ? ' <span style="opacity:0.5;font-size:12px">(' +
          (p.reviewCount || 0) +
          ")</span>"
        : "") +
      "</div>" +
      '<div class="fw-ecom-product-card-price">' +
      (p.salePrice
        ? '<span class="original">' +
          _ecomEsc(p.price) +
          '</span><span class="sale" style="color:' +
          (p.badgeColor || "#ef4444") +
          '">' +
          _ecomEsc(p.salePrice) +
          "</span>"
        : '<span class="current">' + _ecomEsc(p.price) + "</span>") +
      "</div>" +
      '<button class="fw-ecom-product-card-btn" style="background:' +
      (p.accentColor || "#CDFE00") +
      ';color:#111">' +
      _ecomEsc(p.btnText) +
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
      '<div class="rp-row"><label>Image URL</label>' +
      '<input type="text" value="' +
      e(p.imageUrl || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','imageUrl',this.value)\" /></div>" +
      '<div class="rp-row"><label>Title</label>' +
      '<input type="text" value="' +
      e(p.title || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','title',this.value)\" /></div>" +
      '<div class="rp-row"><label>Price</label>' +
      '<input type="text" value="' +
      e(p.price || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','price',this.value)\" /></div>" +
      '<div class="rp-row"><label>Sale Price (leave blank for none)</label>' +
      '<input type="text" value="' +
      e(p.salePrice || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','salePrice',this.value)\" /></div>" +
      '<div class="rp-row"><label>Rating (0-5)</label>' +
      '<input type="number" min="0" max="5" step="0.5" value="' +
      e(String(p.rating || 0)) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','rating',+this.value)\" /></div>" +
      '<div class="rp-row"><label>Review Count</label>' +
      '<input type="number" min="0" value="' +
      e(String(p.reviewCount || 0)) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','reviewCount',+this.value)\" /></div>" +
      '<div class="rp-row"><label>Badge Text</label>' +
      '<input type="text" value="' +
      e(p.badge || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','badge',this.value)\" /></div>" +
      '<div class="rp-row"><label>Badge Color</label>' +
      '<input type="color" value="' +
      e(p.badgeColor || "#ef4444") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','badgeColor',this.value)\" /></div>" +
      '<div class="rp-row"><label>Button Text</label>' +
      '<input type="text" value="' +
      e(p.btnText || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','btnText',this.value)\" /></div>"
    );
  },
});

/* ── Product Grid ── */
FB.widgets.register("ecomProductGrid", {
  label: "Product Grid",
  icon: "\u229E",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    columns: 3,
    gap: 24,
    products: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        title: "Premium Watch",
        price: "\u00A3129.00",
        salePrice: "",
        rating: 4,
        badge: "",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        title: "Wireless Headphones",
        price: "\u00A389.00",
        salePrice: "\u00A369.00",
        rating: 5,
        badge: "Sale",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
        title: "Sunglasses",
        price: "\u00A345.00",
        salePrice: "",
        rating: 3,
        badge: "",
      },
    ],
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
    saleColor: "#ef4444",
  },
  render: function (p) {
    var cards = (p.products || [])
      .map(function (prod) {
        var gs = _ecomStars(prod.rating);
        return (
          '<div class="fw-ecom-product-card">' +
          '<div class="fw-ecom-product-card-img-wrap">' +
          (prod.imageUrl
            ? '<img class="fw-ecom-product-card-img" src="' +
              _ecomEsc(prod.imageUrl) +
              '" alt="">'
            : '<div style="padding:2rem;text-align:center;opacity:0.3">No image</div>') +
          (prod.badge
            ? '<span class="fw-ecom-product-card-badge" style="background:' +
              (p.saleColor || "#ef4444") +
              '">' +
              _ecomEsc(prod.badge) +
              "</span>"
            : "") +
          "</div>" +
          '<div class="fw-ecom-product-card-body">' +
          '<h3 class="fw-ecom-product-card-title">' +
          _ecomEsc(prod.title) +
          "</h3>" +
          '<div class="fw-ecom-product-card-rating" style="color:#FFD700">' +
          gs +
          "</div>" +
          '<div class="fw-ecom-product-card-price">' +
          (prod.salePrice
            ? '<span class="original">' +
              _ecomEsc(prod.price) +
              '</span><span class="sale" style="color:' +
              (p.saleColor || "#ef4444") +
              '">' +
              _ecomEsc(prod.salePrice) +
              "</span>"
            : '<span class="current">' + _ecomEsc(prod.price) + "</span>") +
          "</div>" +
          '<button class="fw-ecom-product-card-btn" style="background:' +
          (p.accentColor || "#CDFE00") +
          ';color:#111">Add to Cart</button></div></div>'
        );
      })
      .join("");
    return (
      '<div class="fw-ecom-product-grid" style="display:grid;grid-template-columns:repeat(' +
      (p.columns || 3) +
      ",1fr);gap:" +
      (p.gap || 24) +
      "px;background:" +
      (p.bg || "#111") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '">' +
      cards +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var e = function (v) {
      return v !== undefined && v !== null
        ? String(v).replace(/"/g, "&quot;")
        : "";
    };
    var prods = p.products || [];
    var html =
      '<div class="rp-row"><label>Columns</label>' +
      '<input type="number" min="1" max="6" value="' +
      e(String(p.columns || 3)) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','columns',+this.value)\" /></div>" +
      '<div class="rp-row"><label>Gap (px)</label>' +
      '<input type="number" min="0" value="' +
      e(String(p.gap || 24)) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','gap',+this.value)\" /></div><div class=\"rp-row\"><label>Products</label></div>";
    for (var i = 0; i < prods.length; i++) {
      html +=
        '<div style="margin-bottom:8px;padding:8px;background:rgba(255,255,255,0.05);border-radius:6px">' +
        '<input type="text" placeholder="Image URL" style="width:100%;margin-bottom:4px;box-sizing:border-box" value="' +
        e(prods[i].imageUrl || "") +
        '" onchange="(function(el,i){var t=p.products;t[i].imageUrl=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','products',t);})(this," +
        i +
        ')" />' +
        '<input type="text" placeholder="Title" style="width:100%;margin-bottom:4px;box-sizing:border-box" value="' +
        e(prods[i].title || "") +
        '" onchange="(function(el,i){var t=p.products;t[i].title=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','products',t);})(this," +
        i +
        ')" />' +
        '<div style="display:flex;gap:4px;margin-bottom:4px">' +
        '<input type="text" placeholder="Price" style="flex:1" value="' +
        e(prods[i].price || "") +
        '" onchange="(function(el,i){var t=p.products;t[i].price=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','products',t);})(this," +
        i +
        ')" />' +
        '<input type="text" placeholder="Sale" style="flex:1" value="' +
        e(prods[i].salePrice || "") +
        '" onchange="(function(el,i){var t=p.products;t[i].salePrice=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','products',t);})(this," +
        i +
        ')" />' +
        "</div>" +
        '<div style="display:flex;gap:4px;margin-bottom:4px">' +
        '<input type="number" min="0" max="5" placeholder="Rating" style="flex:1" value="' +
        e(String(prods[i].rating || 0)) +
        '" onchange="(function(el,i){var t=p.products;t[i].rating=+el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','products',t);})(this," +
        i +
        ')" />' +
        '<input type="text" placeholder="Badge" style="flex:1" value="' +
        e(prods[i].badge || "") +
        '" onchange="(function(el,i){var t=p.products;t[i].badge=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','products',t);})(this," +
        i +
        ')" />' +
        "</div>";
      if (prods.length > 1) {
        html +=
          '<button style="font-size:0.8rem" onclick="var t=p.products;t.splice(' +
          i +
          ",1);FB.panels.updateWidgetProp('" +
          id +
          "','products',t)" +
          '">Remove</button>';
      }
      html += "</div>";
    }
    html +=
      "<button style=\"font-size:0.85rem\" onclick=\"var t=p.products;t.push({imageUrl:'',title:'New Product',price:'',salePrice:'',rating:0,badge:''});FB.panels.updateWidgetProp('" +
      id +
      "','products',t)" +
      '">+ Add Product</button>';
    return html;
  },
});

/* ── Featured Product ── */
FB.widgets.register("ecomFeaturedProduct", {
  label: "Featured Product",
  icon: "\u2605",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    title: "Premium Chronograph Watch",
    description:
      "Handcrafted stainless steel timepiece with sapphire crystal glass. Water resistant to 100m. Swiss automatic movement with 42-hour power reserve.",
    price: "\u00A3349.00",
    salePrice: "\u00A3279.00",
    variants: "Black / Silver / Rose Gold",
    btnText: "Add to Cart",
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
    saleColor: "#ef4444",
  },
  render: function (p) {
    return (
      '<div class="fw-ecom-featured" style="background:' +
      (p.bg || "#111") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '">' +
      '<div class="fw-ecom-featured-image">' +
      (p.imageUrl
        ? '<img src="' + _ecomEsc(p.imageUrl) + '" alt="">'
        : '<div style="padding:3rem;text-align:center;opacity:0.3">No image</div>') +
      "</div>" +
      '<div class="fw-ecom-featured-details">' +
      "<h2>" +
      _ecomEsc(p.title) +
      "</h2>" +
      "<p>" +
      _ecomEsc(p.description) +
      "</p>" +
      '<div class="fw-ecom-featured-price">' +
      (p.salePrice
        ? '<span class="original">' +
          _ecomEsc(p.price) +
          '</span><span class="sale">' +
          _ecomEsc(p.salePrice) +
          "</span>"
        : "<span>" + _ecomEsc(p.price) + "</span>") +
      "</div>" +
      (p.variants
        ? '<div class="fw-ecom-featured-variants">' +
          _ecomEsc(p.variants) +
          "</div>"
        : "") +
      '<div class="fw-ecom-featured-qty"><button>\u2212</button><span>1</span><button>+</button></div>' +
      '<button class="fw-ecom-featured-btn" style="background:' +
      (p.accentColor || "#CDFE00") +
      ';color:#111">' +
      _ecomEsc(p.btnText) +
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
      '<div class="rp-row"><label>Image URL</label>' +
      '<input type="text" value="' +
      e(p.imageUrl || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','imageUrl',this.value)\" /></div>" +
      '<div class="rp-row"><label>Title</label>' +
      '<input type="text" value="' +
      e(p.title || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','title',this.value)\" /></div>" +
      '<div class="rp-row"><label>Description</label>' +
      '<textarea rows="4" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','description',this.value)\">" +
      e(p.description || "") +
      "</textarea></div>" +
      '<div class="rp-row"><label>Price</label>' +
      '<input type="text" value="' +
      e(p.price || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','price',this.value)\" /></div>" +
      '<div class="rp-row"><label>Sale Price</label>' +
      '<input type="text" value="' +
      e(p.salePrice || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','salePrice',this.value)\" /></div>" +
      '<div class="rp-row"><label>Variants</label>' +
      '<input type="text" value="' +
      e(p.variants || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','variants',this.value)\" /></div>" +
      '<div class="rp-row"><label>Button Text</label>' +
      '<input type="text" value="' +
      e(p.btnText || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','btnText',this.value)\" /></div>"
    );
  },
});

/* ── Product Carousel ── */
FB.widgets.register("ecomProductCarousel", {
  label: "Product Carousel",
  icon: "\u27F3",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    cardsVisible: 4,
    products: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        title: "Watch",
        price: "\u00A3129.00",
        salePrice: "",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        title: "Headphones",
        price: "\u00A389.00",
        salePrice: "\u00A369.00",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
        title: "Sunglasses",
        price: "\u00A345.00",
        salePrice: "",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400",
        title: "Boots",
        price: "\u00A3199.00",
        salePrice: "",
      },
    ],
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
    saleColor: "#ef4444",
  },
  render: function (p) {
    var cards = (p.products || [])
      .map(function (cp) {
        return (
          '<div class="fw-ecom-carousel-card">' +
          (cp.imageUrl
            ? '<img src="' + _ecomEsc(cp.imageUrl) + '" alt="">'
            : '<div style="padding:2rem;text-align:center;opacity:0.3">No image</div>') +
          '<div class="fw-ecom-carousel-card-title">' +
          _ecomEsc(cp.title) +
          "</div>" +
          '<div class="fw-ecom-carousel-card-price">' +
          (cp.salePrice
            ? '<span style="text-decoration:line-through;opacity:0.5;font-size:12px">' +
              _ecomEsc(cp.price) +
              '</span> <span style="color:' +
              (p.saleColor || "#ef4444") +
              '">' +
              _ecomEsc(cp.salePrice) +
              "</span>"
            : _ecomEsc(cp.price)) +
          "</div></div>"
        );
      })
      .join("");
    return (
      '<div class="fw-ecom-carousel" style="background:' +
      (p.bg || "#111") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '">' +
      "<button class=\"fw-ecom-carousel-btn prev\" onclick=\"this.parentElement.querySelector('.fw-ecom-carousel-track').scrollBy({left:-240,behavior:'smooth'})\">\u2039</button>" +
      '<div class="fw-ecom-carousel-track">' +
      cards +
      "</div>" +
      "<button class=\"fw-ecom-carousel-btn next\" onclick=\"this.parentElement.querySelector('.fw-ecom-carousel-track').scrollBy({left:240,behavior:'smooth'})\">\u203A</button>" +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var e = function (v) {
      return v !== undefined && v !== null
        ? String(v).replace(/"/g, "&quot;")
        : "";
    };
    var prods = p.products || [];
    var html =
      '<div class="rp-row"><label>Cards Visible</label>' +
      '<input type="number" min="1" max="8" value="' +
      e(String(p.cardsVisible || 4)) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','cardsVisible',+this.value)\" /></div>" +
      '<div class="rp-row"><label>Products</label></div>';
    for (var i = 0; i < prods.length; i++) {
      html +=
        '<div style="margin-bottom:8px;padding:8px;background:rgba(255,255,255,0.05);border-radius:6px">' +
        '<input type="text" placeholder="Image URL" style="width:100%;margin-bottom:4px;box-sizing:border-box" value="' +
        e(prods[i].imageUrl || "") +
        '" onchange="(function(el,i){var t=p.products;t[i].imageUrl=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','products',t);})(this," +
        i +
        ')" />' +
        '<input type="text" placeholder="Title" style="width:100%;margin-bottom:4px;box-sizing:border-box" value="' +
        e(prods[i].title || "") +
        '" onchange="(function(el,i){var t=p.products;t[i].title=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','products',t);})(this," +
        i +
        ')" />' +
        '<div style="display:flex;gap:4px">' +
        '<input type="text" placeholder="Price" style="flex:1" value="' +
        e(prods[i].price || "") +
        '" onchange="(function(el,i){var t=p.products;t[i].price=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','products',t);})(this," +
        i +
        ')" />' +
        '<input type="text" placeholder="Sale" style="flex:1" value="' +
        e(prods[i].salePrice || "") +
        '" onchange="(function(el,i){var t=p.products;t[i].salePrice=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','products',t);})(this," +
        i +
        ')" />' +
        "</div>";
      if (prods.length > 1) {
        html +=
          '<button style="font-size:0.8rem;margin-top:4px" onclick="var t=p.products;t.splice(' +
          i +
          ",1);FB.panels.updateWidgetProp('" +
          id +
          "','products',t)" +
          '">Remove</button>';
      }
      html += "</div>";
    }
    html +=
      "<button style=\"font-size:0.85rem\" onclick=\"var t=p.products;t.push({imageUrl:'',title:'New Product',price:'',salePrice:''});FB.panels.updateWidgetProp('" +
      id +
      "','products',t)" +
      '">+ Add Product</button>';
    return html;
  },
});

/* ── Quick View ── */
FB.widgets.register("ecomQuickView", {
  label: "Quick View",
  icon: "\uD83D\uDC41",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    triggerText: "Quick View",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    title: "Premium Watch",
    price: "\u00A3129.00",
    salePrice: "",
    description: "Click to open a modal quick-view of this product.",
    btnText: "Add to Cart",
    modalBg: "#1a1a1a",
    overlayOpacity: 0.8,
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
    saleColor: "#ef4444",
  },
  render: function (p) {
    return (
      '<div class="fw-ecom-quickview" style="background:' +
      (p.bg || "#111") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '">' +
      '<button class="fw-ecom-quickview-btn" style="border-color:' +
      (p.accentColor || "#CDFE00") +
      ";color:" +
      (p.accentColor || "#CDFE00") +
      "\" onclick=\"this.closest('.fw-ecom-quickview').querySelector('.fw-ecom-quickview-modal').style.display='flex'\">" +
      _ecomEsc(p.triggerText) +
      "</button>" +
      '<div class="fw-ecom-quickview-modal" style="display:none">' +
      '<div class="fw-ecom-quickview-overlay" style="background:rgba(0,0,0,' +
      (p.overlayOpacity || 0.8) +
      ')" onclick="this.parentElement.style.display=\'none\'"></div>' +
      '<div class="fw-ecom-quickview-content" style="background:' +
      (p.modalBg || "#1a1a1a") +
      '">' +
      "<button class=\"fw-ecom-quickview-close\" onclick=\"this.closest('.fw-ecom-quickview-modal').style.display='none'\">\u00D7</button>" +
      (p.imageUrl
        ? '<img src="' + _ecomEsc(p.imageUrl) + '" alt="">'
        : '<div style="padding:2rem;text-align:center;opacity:0.3">No image</div>') +
      "<h3>" +
      _ecomEsc(p.title) +
      "</h3>" +
      '<div class="price">' +
      (p.salePrice
        ? '<span style="text-decoration:line-through;opacity:0.5">' +
          _ecomEsc(p.price) +
          '</span> <span style="color:' +
          (p.saleColor || "#ef4444") +
          '">' +
          _ecomEsc(p.salePrice) +
          "</span>"
        : _ecomEsc(p.price)) +
      "</div>" +
      '<div class="desc">' +
      _ecomEsc(p.description) +
      "</div>" +
      '<button class="add-btn" style="background:' +
      (p.accentColor || "#CDFE00") +
      ';color:#111">' +
      _ecomEsc(p.btnText) +
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
      '<div class="rp-row"><label>Trigger Text</label>' +
      '<input type="text" value="' +
      e(p.triggerText || "Quick View") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','triggerText',this.value)\" /></div>" +
      '<div class="rp-row"><label>Image URL</label>' +
      '<input type="text" value="' +
      e(p.imageUrl || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','imageUrl',this.value)\" /></div>" +
      '<div class="rp-row"><label>Title</label>' +
      '<input type="text" value="' +
      e(p.title || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','title',this.value)\" /></div>" +
      '<div class="rp-row"><label>Price</label>' +
      '<input type="text" value="' +
      e(p.price || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','price',this.value)\" /></div>" +
      '<div class="rp-row"><label>Sale Price</label>' +
      '<input type="text" value="' +
      e(p.salePrice || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','salePrice',this.value)\" /></div>" +
      '<div class="rp-row"><label>Description</label>' +
      '<textarea rows="3" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','description',this.value)\">" +
      e(p.description || "") +
      "</textarea></div>" +
      '<div class="rp-row"><label>Button Text</label>' +
      '<input type="text" value="' +
      e(p.btnText || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','btnText',this.value)\" /></div>" +
      '<div class="rp-row"><label>Modal Background</label>' +
      '<input type="color" value="' +
      e(p.modalBg || "#1a1a1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','modalBg',this.value)\" /></div>"
    );
  },
});
