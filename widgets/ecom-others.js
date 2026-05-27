/* ===== Ecommerce Blocks (Reviews, Filters, Trust, Related, Tabs) ===== */

/* ── Product Reviews ── */
FB.widgets.register("ecomReviews", {
  label: "Product Reviews",
  icon: "\u2B50",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    rating: 4.7,
    reviewCount: 128,
    reviews: [
      {
        name: "Sarah M.",
        rating: 5,
        date: "2 days ago",
        text: "Absolutely love this product! Quality is outstanding and delivery was super fast.",
      },
      {
        name: "James T.",
        rating: 4,
        date: "1 week ago",
        text: "Great value for money. Would recommend.",
      },
      {
        name: "Emma L.",
        rating: 5,
        date: "2 weeks ago",
        text: "Exceeded my expectations.",
      },
    ],
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
  },
  render: function (p) {
    var reviewCards = (p.reviews || [])
      .map(function (r) {
        var rs = "";
        for (var k = 0; k < Math.floor(r.rating || 0); k++) rs += "\u2605";
        return (
          '<div class="fw-ecom-review-card"><div class="fw-ecom-review-header"><span class="fw-ecom-review-name">' +
          _ecomEsc(r.name || "") +
          '</span><span class="fw-ecom-review-date">' +
          _ecomEsc(r.date || "") +
          '</span></div><div class="fw-ecom-review-stars" style="color:#FFD700">' +
          rs +
          '</div><div class="fw-ecom-review-text">' +
          _ecomEsc(r.text || "") +
          "</div></div>"
        );
      })
      .join("");
    var bigStars = "";
    for (var m = 0; m < Math.floor(p.rating || 0); m++) bigStars += "\u2605";
    return (
      '<div class="fw-ecom-reviews" style="background:' +
      (p.bg || "#111") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '"><div class="fw-ecom-reviews-summary"><div class="big-rating">' +
      (p.rating || 0) +
      '</div><div class="stars" style="color:#FFD700">' +
      bigStars +
      '</div><div class="count">' +
      (p.reviewCount || 0) +
      " reviews</div></div>" +
      reviewCards +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var e = function (v) {
      return v !== undefined && v !== null
        ? String(v).replace(/"/g, "&quot;")
        : "";
    };
    var revs = p.reviews || [];
    var html =
      '<div class="rp-row"><label>Average Rating</label><input type="number" min="0" max="5" step="0.1" value="' +
      e(String(p.rating || 0)) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','rating',+this.value)\" /></div>" +
      '<div class="rp-row"><label>Review Count</label><input type="number" min="0" value="' +
      e(String(p.reviewCount || 0)) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','reviewCount',+this.value)\" /></div><div class=\"rp-row\"><label>Reviews</label></div>";
    for (var i = 0; i < revs.length; i++) {
      html +=
        '<div style="margin-bottom:8px;padding:8px;background:rgba(255,255,255,0.05);border-radius:6px">' +
        '<input type="text" placeholder="Name" style="width:100%;margin-bottom:4px;box-sizing:border-box" value="' +
        e(revs[i].name || "") +
        '" onchange="(function(el,i){var t=p.reviews;t[i].name=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','reviews',t);})(this," +
        i +
        ')" />' +
        '<input type="number" min="0" max="5" placeholder="Rating" style="width:100%;margin-bottom:4px;box-sizing:border-box" value="' +
        e(String(revs[i].rating || 0)) +
        '" onchange="(function(el,i){var t=p.reviews;t[i].rating=+el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','reviews',t);})(this," +
        i +
        ')" />' +
        '<input type="text" placeholder="Date" style="width:100%;margin-bottom:4px;box-sizing:border-box" value="' +
        e(revs[i].date || "") +
        '" onchange="(function(el,i){var t=p.reviews;t[i].date=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','reviews',t);})(this," +
        i +
        ')" />' +
        '<textarea rows="2" placeholder="Review text" style="width:100%;box-sizing:border-box" onchange="(function(el,i){var t=p.reviews;t[i].text=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','reviews',t);})(this," +
        i +
        ')" >' +
        e(revs[i].text || "") +
        "</textarea>";
      if (revs.length > 1) {
        html +=
          '<button style="font-size:0.8rem;margin-top:4px" onclick="var t=p.reviews;t.splice(' +
          i +
          ",1);FB.panels.updateWidgetProp('" +
          id +
          "','reviews',t)" +
          '">Remove</button>';
      }
      html += "</div>";
    }
    html +=
      "<button style=\"font-size:0.85rem\" onclick=\"var t=p.reviews;t.push({name:'',rating:5,date:'',text:''});FB.panels.updateWidgetProp('" +
      id +
      "','reviews',t)" +
      '">+ Add Review</button>';
    return html;
  },
});

/* ── Filters & Sort ── */
FB.widgets.register("ecomFilters", {
  label: "Filters & Sort",
  icon: "\u2699",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    categories: ["All", "Clothing", "Accessories", "Footwear", "Electronics"],
    sortOptions: [
      "Featured",
      "Price: Low to High",
      "Price: High to Low",
      "Newest",
      "Best Rating",
    ],
    showPriceRange: true,
    showGridToggle: true,
    resultsText: "24 products found",
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
  },
  render: function (p) {
    var catBtns = (p.categories || [])
      .map(function (c, i) {
        return (
          '<button class="fw-ecom-filter-btn' +
          (i === 0 ? " active" : "") +
          '" style="' +
          (i === 0
            ? "background:" + (p.accentColor || "#CDFE00") + ";color:#111;"
            : "background:rgba(255,255,255,0.05);") +
          '">' +
          _ecomEsc(c) +
          "</button>"
        );
      })
      .join("");
    var sortOpts = (p.sortOptions || [])
      .map(function (s) {
        return "<option>" + _ecomEsc(s) + "</option>";
      })
      .join("");
    return (
      '<div class="fw-ecom-filters" style="background:' +
      (p.bg || "#111") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '"><div class="fw-ecom-filters-top"><div class="fw-ecom-filters-cats">' +
      catBtns +
      '</div><div class="fw-ecom-filters-controls">' +
      (p.showPriceRange
        ? '<div class="fw-ecom-filters-price"><label>\u00A3<input type="number" value="0" min="0" style="width:60px;padding:6px;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:rgba(255,255,255,0.05);color:inherit;font-family:Lexend,sans-serif;"> \u2014 \u00A3<input type="number" value="500" min="0" style="width:60px;padding:6px;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:rgba(255,255,255,0.05);color:inherit;font-family:Lexend,sans-serif;"></label></div>'
        : "") +
      '<select class="fw-ecom-filters-sort" style="padding:8px 12px;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:rgba(255,255,255,0.05);color:inherit;font-family:Lexend,sans-serif;">' +
      sortOpts +
      "</select>" +
      (p.showGridToggle
        ? '<div class="fw-ecom-filters-grid-toggle"><button class="active" title="Grid view">\u229E</button><button title="List view">\u2630</button></div>'
        : "") +
      '</div></div><div class="fw-ecom-filters-results" style="color:' +
      (p.accentColor || "#CDFE00") +
      '">' +
      _ecomEsc(p.resultsText || "") +
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
      '<div class="rp-row"><label>Categories (comma-separated)</label><input type="text" value="' +
      e((p.categories || []).join(", ")) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','categories',this.value.split(',').map(function(s){return s.trim()}))\" /></div>" +
      '<div class="rp-row"><label>Sort Options (comma-separated)</label><input type="text" value="' +
      e((p.sortOptions || []).join(", ")) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','sortOptions',this.value.split(',').map(function(s){return s.trim()}))\" /></div>" +
      '<div class="rp-row"><label><input type="checkbox"' +
      (p.showPriceRange !== false ? " checked" : "") +
      " onclick=\"FB.panels.updateWidgetProp('" +
      id +
      "','showPriceRange',this.checked)\" /> Show Price Range</label></div>" +
      '<div class="rp-row"><label><input type="checkbox"' +
      (p.showGridToggle !== false ? " checked" : "") +
      " onclick=\"FB.panels.updateWidgetProp('" +
      id +
      "','showGridToggle',this.checked)\" /> Show Grid/List Toggle</label></div>" +
      '<div class="rp-row"><label>Results Text</label><input type="text" value="' +
      e(p.resultsText || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','resultsText',this.value)\" /></div>"
    );
  },
});

/* ── Trust Badges ── */
FB.widgets.register("ecomTrustBadges", {
  label: "Trust Badges",
  icon: "\uD83D\uDEE1",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    badges: [
      {
        icon: "\uD83D\uDD12",
        title: "Secure Checkout",
        desc: "256-bit SSL encryption",
      },
      {
        icon: "\uD83D\uDD04",
        title: "Free Returns",
        desc: "30-day return policy",
      },
      {
        icon: "\uD83D\uDE9A",
        title: "Free Shipping",
        desc: "Orders over \u00A350",
      },
      { icon: "\u2B50", title: "Top Rated", desc: "4.9/5 from 2,000+ reviews" },
    ],
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
  },
  render: function (p) {
    var badgeItems = (p.badges || [])
      .map(function (b) {
        return (
          '<div class="fw-ecom-trust-badge"><div class="fw-ecom-trust-badge-icon">' +
          (b.icon || "") +
          '</div><div class="fw-ecom-trust-badge-title">' +
          _ecomEsc(b.title || "") +
          '</div><div class="fw-ecom-trust-badge-desc">' +
          _ecomEsc(b.desc || "") +
          "</div></div>"
        );
      })
      .join("");
    return (
      '<div class="fw-ecom-trust-badges" style="background:' +
      (p.bg || "#111") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '">' +
      badgeItems +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var e = function (v) {
      return v !== undefined && v !== null
        ? String(v).replace(/"/g, "&quot;")
        : "";
    };
    var badges = p.badges || [];
    var html = '<div class="rp-row"><label>Trust Badges</label></div>';
    for (var i = 0; i < badges.length; i++) {
      html +=
        '<div style="margin-bottom:8px;padding:8px;background:rgba(255,255,255,0.05);border-radius:6px">' +
        '<input type="text" placeholder="Icon (emoji)" style="width:100%;margin-bottom:4px;box-sizing:border-box" value="' +
        e(badges[i].icon || "") +
        '" onchange="(function(el,i){var t=p.badges;t[i].icon=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','badges',t);})(this," +
        i +
        ')" />' +
        '<input type="text" placeholder="Title" style="width:100%;margin-bottom:4px;box-sizing:border-box" value="' +
        e(badges[i].title || "") +
        '" onchange="(function(el,i){var t=p.badges;t[i].title=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','badges',t);})(this," +
        i +
        ')" />' +
        '<input type="text" placeholder="Description" style="width:100%;box-sizing:border-box" value="' +
        e(badges[i].desc || "") +
        '" onchange="(function(el,i){var t=p.badges;t[i].desc=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','badges',t);})(this," +
        i +
        ')" />';
      if (badges.length > 1) {
        html +=
          '<button style="font-size:0.8rem;margin-top:4px" onclick="var t=p.badges;t.splice(' +
          i +
          ",1);FB.panels.updateWidgetProp('" +
          id +
          "','badges',t)" +
          '">Remove</button>';
      }
      html += "</div>";
    }
    html +=
      "<button style=\"font-size:0.85rem\" onclick=\"var t=p.badges;t.push({icon:'',title:'New Badge',desc:''});FB.panels.updateWidgetProp('" +
      id +
      "','badges',t)" +
      '">+ Add Badge</button>';
    return html;
  },
});

/* ── Related Products ── */
FB.widgets.register("ecomRelatedProducts", {
  label: "Related Products",
  icon: "\uD83D\uDD17",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    heading: "You Might Also Like",
    products: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        title: "Classic Watch",
        price: "\u00A3129.00",
        salePrice: "",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        title: "Wireless Earbuds",
        price: "\u00A389.00",
        salePrice: "\u00A369.00",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
        title: "Aviator Sunglasses",
        price: "\u00A345.00",
        salePrice: "",
      },
    ],
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
    saleColor: "#ef4444",
  },
  render: function (p) {
    var relCards = (p.products || [])
      .map(function (rp) {
        return (
          '<div class="fw-ecom-related-card"><div class="fw-ecom-related-card-img-wrap">' +
          (rp.imageUrl
            ? '<img src="' + _ecomEsc(rp.imageUrl) + '" alt="">'
            : '<div style="padding:2rem;text-align:center;opacity:0.3">No image</div>') +
          '</div><div class="fw-ecom-related-card-title">' +
          _ecomEsc(rp.title) +
          '</div><div class="fw-ecom-related-card-price">' +
          (rp.salePrice
            ? '<span style="text-decoration:line-through;opacity:0.5;font-size:13px">' +
              _ecomEsc(rp.price) +
              '</span> <span style="color:' +
              (p.saleColor || "#ef4444") +
              '">' +
              _ecomEsc(rp.salePrice) +
              "</span>"
            : _ecomEsc(rp.price)) +
          "</div></div>"
        );
      })
      .join("");
    return (
      '<div class="fw-ecom-related" style="background:' +
      (p.bg || "#111") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '"><h3>' +
      _ecomEsc(p.heading || "") +
      '</h3><div class="fw-ecom-related-grid">' +
      relCards +
      "</div></div>"
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
      '<div class="rp-row"><label>Heading</label><input type="text" value="' +
      e(p.heading || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','heading',this.value)\" /></div><div class=\"rp-row\"><label>Products</label></div>";
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

/* ── Product Tabs ── */
FB.widgets.register("ecomProductTabs", {
  label: "Product Tabs",
  icon: "\uD83D\uDCD1",
  iconBg: "#3a3a3a",
  iconColor: "#CDFE00",
  category: "ecommerce",
  defaultProps: {
    tabs: [
      {
        label: "Description",
        content:
          "<p>Our premium collection features handcrafted materials with attention to every detail.</p>",
      },
      {
        label: "Specifications",
        content:
          "<table><tr><td>Material</td><td>Premium Stainless Steel</td></tr><tr><td>Weight</td><td>120g</td></tr></table>",
      },
      {
        label: "Shipping",
        content: "<p><strong>Standard Shipping:</strong> 3-5 business days</p>",
      },
    ],
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
  },
  render: function (p) {
    var tabBtns = (p.tabs || [])
      .map(function (t, i) {
        return (
          '<button class="fw-ecom-tab-btn' +
          (i === 0 ? " active" : "") +
          '" style="' +
          (i === 0
            ? "border-bottom-color:" +
              (p.accentColor || "#CDFE00") +
              ";color:" +
              (p.accentColor || "#CDFE00") +
              ";"
            : "border-bottom-color:transparent;") +
          '" data-tab-index="' +
          i +
          "\" onclick=\"var btns=this.parentElement.querySelectorAll('.fw-ecom-tab-btn');btns.forEach(function(b){b.classList.remove('active');b.style.borderBottomColor='transparent';b.style.color='inherit'});this.classList.add('active');this.style.borderBottomColor='" +
          (p.accentColor || "#CDFE00") +
          "';this.style.color='" +
          (p.accentColor || "#CDFE00") +
          "';var panels=this.closest('.fw-ecom-tabs').querySelectorAll('.fw-ecom-tab-panel');panels.forEach(function(p2,i2){p2.style.display=i2===" +
          i +
          "?'block':'none'});\">" +
          _ecomEsc(t.label || "") +
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
          (t.content || "") +
          "</div>"
        );
      })
      .join("");
    return (
      '<div class="fw-ecom-tabs" style="background:' +
      (p.bg || "#111") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '"><div class="fw-ecom-tab-bar">' +
      tabBtns +
      '</div><div class="fw-ecom-tab-content">' +
      tabPanels +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var e = function (v) {
      return v !== undefined && v !== null
        ? String(v).replace(/"/g, "&quot;")
        : "";
    };
    var tabs = p.tabs || [];
    var html = '<div class="rp-row"><label>Tabs</label></div>';
    for (var i = 0; i < tabs.length; i++) {
      html +=
        '<div style="margin-bottom:8px;padding:8px;background:rgba(255,255,255,0.05);border-radius:6px">' +
        '<input type="text" placeholder="Tab label" style="width:100%;margin-bottom:4px;box-sizing:border-box" value="' +
        e(tabs[i].label || "") +
        '" onchange="(function(el,i){var t=p.tabs;t[i].label=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','tabs',t);})(this," +
        i +
        ')" />' +
        '<textarea rows="3" placeholder="Tab content (HTML)" style="width:100%;box-sizing:border-box" onchange="(function(el,i){var t=p.tabs;t[i].content=el.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','tabs',t);})(this," +
        i +
        ')" >' +
        e(tabs[i].content || "") +
        "</textarea>";
      if (tabs.length > 1) {
        html +=
          '<button style="font-size:0.8rem;margin-top:4px" onclick="var t=p.tabs;t.splice(' +
          i +
          ",1);FB.panels.updateWidgetProp('" +
          id +
          "','tabs',t)" +
          '">Remove</button>';
      }
      html += "</div>";
    }
    html +=
      "<button style=\"font-size:0.85rem\" onclick=\"var t=p.tabs;t.push({label:'New Tab',content:''});FB.panels.updateWidgetProp('" +
      id +
      "','tabs',t)" +
      '">+ Add Tab</button>';
    return html;
  },
});
