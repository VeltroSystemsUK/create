// ── VELTRO ENGINE BATCH 7: SPATIAL & LAYOUT (8 NEW WIDGETS) ──
// 1. 3D Carousel
FB.widgets.register("carousel3d", {
  label: "3D Carousel",
  sublabel: "Rotating 3D card carousel with rich content",
  icon: "◈",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    cardCount: 6,
    rotationSpeed: 0.5,
    autoRotate: true,
    clickableCards: true,
    showCardNumbers: false,
    cardScale: 1.0,
    // New: Card content array
    cards: Array.from({length:6}, (_,i)=>({
      title: "Card " + (i+1),
      subtitle: "",
      description: "",
      image: "",
      imagePosition: "top",
      bgColor: "#4a90e2",
      textColor: "#ffffff",
      accentColor: "#cdfe00",
      link: "",
      linkText: "Learn More"
    })),
  },
  render: function (p) {
    var id = p._blockId || "carousel";
    var cardCount = p.cardCount || 6;
    var cards = p.cards || [];

    // Ensure we have enough cards
    while (cards.length < cardCount) {
      var idx = cards.length;
      cards.push({
        title: "Card " + (idx+1),
        subtitle: "",
        description: "",
        image: "",
        imagePosition: "top",
        bgColor: "#4a90e2",
        textColor: "#ffffff",
        accentColor: "#cdfe00",
        link: "",
        linkText: "Learn More"
      });
    }

    var cardsHtml = "";
    for (var i = 0; i < cardCount; i++) {
      var angle = (i * 360) / cardCount;
      var card = cards[i] || {};
      var cardBg = card.bgColor || "#4a90e2";
      var cardText = card.textColor || "#ffffff";
      var cardAccent = card.accentColor || "#cdfe00";

      var cardContent = '<div class="veltro-card-content" style="padding:12px;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:' + cardText + '">';

      if (card.title) cardContent += '<h3 class="veltro-card-title" style="margin:0 0 4px;font-size:0.9rem;font-weight:700">' + card.title + '</h3>';
      if (card.subtitle) cardContent += '<p class="veltro-card-subtitle" style="margin:0 0 4px;font-size:0.75rem;opacity:0.8">' + card.subtitle + '</p>';
      if (card.description) cardContent += '<p class="veltro-card-description" style="margin:0 0 6px;font-size:0.7rem;opacity:0.75;line-height:1.3">' + card.description + '</p>';
      if (card.link && card.linkText) cardContent += '<a href="#" class="veltro-card-link" style="font-size:0.7rem;color:' + cardAccent + ';text-decoration:none;font-weight:600">' + card.linkText + '</a>';

      cardContent += '</div>';

      var cardImageHtml = card.image && card.imagePosition !== 'background'
        ? '<div class="veltro-card-image" style="width:100%;height:60px;overflow:hidden"><img src="' + card.image + '" style="width:100%;height:100%;object-fit:cover;border-radius:4px"></div>'
        : '';

      var cardNumber = p.showCardNumbers ? '<span class="veltro-card-number" style="position:absolute;bottom:4px;right:8px;font-size:0.7rem;opacity:0.6">' + (i+1) + '/' + cardCount + '</span>' : '';

      var backgroundStyle = card.image && card.imagePosition === 'background'
        ? 'background:url("' + card.image + '") ' + cardBg + ';background-size:cover;background-position:center;'
        : 'background:' + cardBg + ';';

      cardsHtml +=
        '<div class="veltro-carousel-card" style="position:absolute;width:120px;height:160px;' + backgroundStyle + 'border-radius:12px;border:1px solid rgba(255,255,255,0.1);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:0.9rem;font-weight:600;color:' + cardText + ';transform:rotateY(' + angle + 'deg) translateZ(200px) scale(' + p.cardScale + ');backface-visibility:hidden;cursor:' + (card.link ? 'pointer' : 'default') + '" data-link="' + (card.link || '') + '">' +
        cardImageHtml +
        cardContent +
        cardNumber +
        '</div>';
    }

    return (
      '<div class="veltro-carousel-wrap" id="carousel-' + id + '" data-rotation-speed="' + (p.rotationSpeed || 0.5) + '" data-auto-rotate="' + (p.autoRotate !== false ? '1' : '0') + '" data-clickable-cards="' + (p.clickableCards !== false ? '1' : '0') + '" style="height:' + p.height + 'px;background:' + p.bg + ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center;perspective:1000px"><div class="veltro-carousel-stage" style="position:relative;width:120px;height:160px;transform-style:preserve-3d" data-carousel-init="1">' + cardsHtml + '</div></div>'
    );
  },
  editPanel: function (id, p) {
    var html = '';
    // Render card count and basic settings
    html += '<div class="rp-row"><label for="card_count_' + id + '">Card Count</label>';
    html += '<input id="card_count_' + id + '" name="card_count" type="number" min="1" max="20" value="' + (p.cardCount || 6) + '" data-prop="cardCount" data-block-id="' + id + '" style="width:60px">';
    html += '</div>';

    // Render card properties array editor
    html += FB.panels.renderArrayEditor(id, 'cards', p.cards || [], 'carousel3d');

    return html;
  },
});

// 3. Perspective Rooms
FB.widgets.register("perspectiveRooms", {
  label: "Perspective Rooms",
  sublabel: "3D room layout with customizable content",
  icon: "◉",
  iconBg: "#0d1a1a",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    roomCount: 3,
    perspective: 800,
    autoRotate: true,
    autoRotateInterval: 8000,
    highlightColor: "#cdfe00",
    // Legacy comma-separated format support
    colors: "#cdfe00,#3b82f6,#ec4899",
    roomLabels: "Room 1,Room 2,Room 3",
    // New: Room content array
    rooms: [
      {
        title: "Room 1",
        subtitle: "",
        description: "",
        bgColor: "#cdfe00",
        textColor: "#111111",
        bgImage: "",
        imageOpacity: 0.3,
        navLabel: "1",
        cta: ""
      },
      {
        title: "Room 2",
        subtitle: "",
        description: "",
        bgColor: "#3b82f6",
        textColor: "#ffffff",
        bgImage: "",
        imageOpacity: 0.3,
        navLabel: "2",
        cta: ""
      },
      {
        title: "Room 3",
        subtitle: "",
        description: "",
        bgColor: "#ec4899",
        textColor: "#ffffff",
        bgImage: "",
        imageOpacity: 0.3,
        navLabel: "3",
        cta: ""
      }
    ]
  },
  render: function (p) {
    var id = p._blockId || "rooms";
    var roomCount = p.roomCount || 3;
    var rooms = p.rooms || [];

    // Ensure we have enough rooms
    while (rooms.length < roomCount) {
      var idx = rooms.length;
      rooms.push({
        title: "Room " + (idx + 1),
        subtitle: "",
        description: "",
        bgColor: ["#cdfe00", "#3b82f6", "#ec4899"][idx % 3],
        textColor: idx === 0 ? "#111111" : "#ffffff",
        bgImage: "",
        imageOpacity: 0.3,
        navLabel: String(idx + 1),
        cta: ""
      });
    }

    var roomsHtml = "";
    for (var i = 0; i < roomCount; i++) {
      var room = rooms[i] || {};
      var bgStyle = room.bgImage
        ? 'background:url("' + room.bgImage + '") ' + (room.bgColor || "#cdfe00") + ';background-size:cover;background-position:center;'
        : 'background:' + (room.bgColor || "#cdfe00") + ';';

      var contentHtml = '';
      if (room.title || room.subtitle || room.description || room.cta) {
        contentHtml = '<div class="veltro-room-content" style="color:' + (room.textColor || "#fff") + ';padding:20px;text-align:center;z-index:10;position:relative">';
        if (room.title) contentHtml += '<h3 class="veltro-room-title" style="margin:0 0 8px;font-size:1.5rem;font-weight:700">' + room.title + '</h3>';
        if (room.subtitle) contentHtml += '<p class="veltro-room-subtitle" style="margin:0 0 8px;font-size:0.9rem;opacity:0.9">' + room.subtitle + '</p>';
        if (room.description) contentHtml += '<p class="veltro-room-description" style="margin:0 0 12px;font-size:0.85rem;opacity:0.85;max-width:250px;line-height:1.4">' + room.description + '</p>';
        if (room.cta) contentHtml += '<a class="veltro-room-cta" style="display:inline-block;padding:6px 16px;background:' + (p.highlightColor || "#cdfe00") + ';color:#111;border-radius:4px;font-size:0.85rem;font-weight:600;text-decoration:none;cursor:pointer;transition:opacity 0.2s">' + room.cta + '</a>';
        contentHtml += '</div>';
      }

      if (room.bgImage) {
        contentHtml = '<div class="veltro-room-overlay" style="position:absolute;inset:0;background:rgba(0,0,0,' + (room.imageOpacity || 0.3) + ');z-index:5"></div>' + contentHtml;
      }

      var roomOpacity = i === 0 ? '1' : '0';
      roomsHtml +=
        '<div class="veltro-room" data-tz="' + (i * -200) + '" data-room="' + i + '" style="position:absolute;inset:0;' + bgStyle + 'opacity:' + roomOpacity + ';transform:translateZ(' + (i * -200) + 'px);border:2px solid rgba(255,255,255,0.1);border-radius:16px;display:flex;align-items:center;justify-content:center;overflow:hidden;transition:opacity 0.3s ease">' + contentHtml + '</div>';
    }

    var navDotsHtml = "";
    for (var n = 0; n < roomCount; n++) {
      var navLabel = (rooms[n] && rooms[n].navLabel) || String(n + 1);
      navDotsHtml +=
        '<button class="veltro-room-nav" data-room-idx="' +
        n +
        '" title="' + (rooms[n] && rooms[n].title || "Room " + (n + 1)) + '" style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.3);margin:0 4px;cursor:pointer;transition:all 0.3s ease;color:#fff;font-size:0.8rem;font-weight:600">' + navLabel + '</button>';
    }

    return (
      '<div class="veltro-rooms-wrap" id="rooms-' + id + '" data-room-count="' + roomCount + '" data-perspective="' + p.perspective + '" data-highlight-color="' + (p.highlightColor || "#cdfe00") + '" data-auto-rotate="' + (p.autoRotate !== false ? '1' : '0') + '" data-auto-rotate-interval="' + (p.autoRotateInterval || 8000) + '" style="height:' + p.height + 'px;background:' + p.bg + ';position:relative;overflow:hidden;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;perspective:' + p.perspective + 'px"><div class="veltro-rooms-stage" style="position:relative;width:300px;height:300px;transform-style:preserve-3d">' + roomsHtml + '</div><div class="veltro-room-nav-row" style="margin-top:20px;display:flex;align-items:center;gap:0;flex-wrap:wrap;justify-content:center">' + navDotsHtml + '</div></div>'
    );
  },
  editPanel: function (id, p) {
    var html = '';
    // Render room count and basic settings
    html += '<div class="rp-row"><label for="room_count_' + id + '">Room Count</label>';
    html += '<input id="room_count_' + id + '" name="room_count" type="number" min="1" max="10" value="' + (p.roomCount || 3) + '" data-prop="roomCount" data-block-id="' + id + '" style="width:60px">';
    html += '</div>';

    // Render room properties array editor
    html += FB.panels.renderArrayEditor(id, 'rooms', p.rooms || [], 'perspectiveRooms');

    return html;
  },
});

// 4. Floating Islands
FB.widgets.register("floatingIslands", {
  label: "Floating Islands",
  sublabel: "Floating content blocks",
  icon: "◈",
  iconBg: "#1a1a0d",
  iconColor: "#fbbf24",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    islandCount: 5,
    floatRange: 20,
    speed: 1,
    islandLabels: "1,2,3,4,5",
  },
  render: function (p) {
    var id = p._blockId || "islands";
    var islandLabels = FB.widgets.safeSplit(p.islandLabels, "1,2,3,4,5");
    var itemsHtml = "";
    for (var i = 0; i < (p.islandCount || 5); i++) {
      var size = 80 + Math.random() * 60;
      itemsHtml +=
        '<div class="veltro-island" style="position:absolute;width:' +
        size +
        "px;height:" +
        size +
        "px;background:linear-gradient(135deg,rgba(205,254,0,0.2) 0%,rgba(60,165,250,0.2) 100%);border-radius:" +
        size / 4 +
        "px;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:700;color:#fff;left:" +
        (10 + Math.random() * 70) +
        "%;top:" +
        (10 + Math.random() * 70) +
        "%;animation:vtfloat " +
        (3 + Math.random() * 2) +
        "s ease-in-out infinite;animation-delay:" +
        Math.random() * 2 +
        's">' +
        (islandLabels[i] || (i + 1)) +
        "</div>";
    }
    return (
      '<div class="veltro-islands-wrap" id="islands-' +
      id +
      '" data-island-count="' +
      p.islandCount +
      '" data-float-range="' +
      p.floatRange +
      '" data-speed="' +
      p.speed +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px">' +
      itemsHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

// 5. Layered Parallax
FB.widgets.register("layeredParallax", {
  label: "Layered Parallax",
  sublabel: "Multi-depth layers",
  icon: "▣",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    layerCount: 5,
    depthIntensity: 0.5,
    overlayText: "DEPTH",
    scrollParallax: true,
    mouseParallax: true,
    scrollStrength: 0.8,
    cursorStrength: 1.0,
    perspective: 1000,
  },
  render: function (p) {
    var id = p._blockId || "layerPar";
    var layersHtml = "";
    for (var i = 0; i < (p.layerCount || 5); i++) {
      var depth = (i + 1) / (p.layerCount || 5);
      layersHtml +=
        '<div class="veltro-layer" data-depth="' +
        depth +
        '" style="position:absolute;inset:0;background:radial-gradient(circle at ' +
        (30 + i * 10) +
        "% " +
        (40 + i * 8) +
        "%,rgba(205,254,0," +
        (0.03 + depth * 0.08) +
        ') 0%,transparent 50%);transform:translateZ(0)\"></div>';
    }
    return (
      '<div class="veltro-layerpar-wrap" id="layerpar-' +
      id +
      '" data-layer-count="' +
      p.layerCount +
      '" data-depth-intensity="' +
      p.depthIntensity +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center">' +
layersHtml +
       '<div style="position:relative;z-index:10"><h2 style="color:#fff;font-size:3rem;font-weight:800;margin:0;text-shadow:0 4px 20px rgba(0,0,0,0.5)">' +
       (p.overlayText || "DEPTH") +
       '</h2></div></div>'
    );
  },
  editPanel: function (id, p) { return ""; },
});

// 6. Kinetic Layout
FB.widgets.register("kineticLayout", {
  label: "Kinetic Layout",
  sublabel: "Items repel from cursor",
  icon: "◉",
  iconBg: "#1a0d1a",
  iconColor: "#f472b6",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    elementCount: 9,
    responseRadius: 120,
    repulseStrength: 50,
    itemSize: 80,
    accentColor: "#cdfe00",
    mode: "repulse",
    elementLabels: "1,2,3,4,5,6,7,8,9",
  },
  render: function (p) {
    var id = p._blockId || "kinetic";
    var size = p.itemSize || 80;
    var accent = p.accentColor || "#cdfe00";
    var elementLabels = FB.widgets.safeSplit(p.elementLabels, "1,2,3,4,5,6,7,8,9");
    var itemsHtml = "";
    for (var i = 0; i < (p.elementCount || 9); i++) {
      itemsHtml +=
        '<div class="veltro-kinetic-item" style="width:' +
        size +
        "px;height:" +
        size +
        "px;background:linear-gradient(135deg,rgba(205,254,0,0.12) 0%,rgba(60,165,250,0.12) 100%);border-radius:12px;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:800;color:" +
        accent +
        ';will-change:transform">' +
        (elementLabels[i] || (i + 1)) +
        "</div>";
    }
    return (
      '<div class="veltro-kinetic-wrap" id="kinetic-' +
      id +
      '" data-response-radius="' +
      (p.responseRadius || 120) +
      '" data-repulse-strength="' +
      (p.repulseStrength || 50) +
      '" data-mode="' +
      (p.mode || "repulse") +
      '" style="height:' +
      (p.height || 400) +
      "px;background:" +
      (p.bg || "#0d0d1a") +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:16px;padding:24px">' +
      itemsHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

// 7. Morphing Grid
FB.widgets.register("morphingGrid", {
  label: "Morphing Grid",
  sublabel: "Auto-cycles between layouts",
  icon: "⊞",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 440,
    bg: "#0d0d1a",
    itemCount: 6,
    cycleSpeed: 2.5,
    transitionDuration: 0.6,
    accentColor: "#cdfe00",
    itemBg: "rgba(255,255,255,0.05)",
    gap: 10,
    autoCycle: true,
    itemLabels: "1,2,3,4,5,6",
  },
  render: function (p) {
    var id = p._blockId || "morphGrid";
    var count = Math.min(Math.max(p.itemCount || 6, 4), 9);
    var gap = p.gap || 10;
    var dur = p.transitionDuration || 0.6;
    var accent = p.accentColor || "#cdfe00";
    var ibg = p.itemBg || "rgba(255,255,255,0.05)";
    var itemLabels = FB.widgets.safeSplit(p.itemLabels, "1,2,3,4,5,6");
    var itemsHtml = "";
    for (var i = 0; i < count; i++) {
      itemsHtml +=
        '<div class="veltro-morphgrid-item" style="flex:0 0 30%;height:120px;min-height:60px;background:' +
        ibg +
        ";border-radius:10px;border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:800;color:" +
        accent +
        ";transition:flex-basis " +
        dur +
        "s ease,height " +
        dur +
        "s ease,opacity " +
        dur +
        's ease;overflow:hidden">' +
        (itemLabels[i] || (i + 1)) +
        "</div>";
    }
    return (
      '<div class="veltro-morphgrid-wrap" id="morphgrid-' +
      id +
      '" data-cycle-speed="' +
      (p.cycleSpeed || 2.5) +
      '" data-auto-cycle="' +
      (p.autoCycle !== false ? "1" : "0") +
      '" data-item-count="' +
      count +
      '" data-gap="' +
      gap +
      '" style="height:' +
      (p.height || 440) +
      "px;background:" +
      (p.bg || "#0d0d1a") +
      ';position:relative;overflow:hidden;border-radius:4px"><div class="veltro-morphgrid-inner" style="display:flex;flex-wrap:wrap;align-content:flex-start;gap:' +
      gap +
      "px;padding:" +
      gap +
      'px;height:100%;overflow:hidden">' +
      itemsHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

// 8. Spatial Navigation
FB.widgets.register("spatialNavigation", {
  label: "Spatial Navigation",
  sublabel: "3D navigation system",
  icon: "◈",
  iconBg: "#1a0d2e",
  iconColor: "#a78bfa",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    navItems: "Home,About,Work,Contact",
    perspective: 800,
    spacing: 100,
  },
  render: function (p) {
    var id = p._blockId || "spatialNav";
    var items = FB.widgets.safeSplit(p.navItems, "Home,About,Work,Contact");
    var itemsHtml = items
      .map(function (item, i) {
        return (
          '<div class="veltro-spatial-item" style="padding:20px 40px;background:linear-gradient(135deg,rgba(205,254,0,0.15) 0%,rgba(60,165,250,0.15) 100%);border-radius:12px;border:1px solid rgba(255,255,255,0.1);font-size:1.5rem;font-weight:700;color:#fff;transform:translateZ(' +
          i * 50 +
          'px)">' +
          item.trim() +
          "</div>"
        );
      })
      .join("");
    return (
      '<div class="veltro-spatial-wrap" id="spatial-' +
      id +
      '" data-nav-items="' +
      p.navItems +
      '" data-perspective="' +
      p.perspective +
      '" data-spacing="' +
      p.spacing +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ";position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center;perspective:" +
      p.perspective +
      'px"><div class="veltro-spatial-nav" style="display:flex;flex-direction:column;gap:' +
      p.spacing +
      'px;transform-style:preserve-3d">' +
      itemsHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

// ── Missing Original Widgets ──

// cursorLens
FB.widgets.register("cursorLens", {
  label: "Cursor Lens",
  sublabel: "Magnify on hover",
  icon: "🔍",
  iconBg: "#f97316",
  iconColor: "#fff",
  category: "veltro",
  subCategory: "cursor",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    image: "https://picsum.photos/800/400?random=1",
    lensSize: 120,
    magnification: 2,
  },
  render: function (p) {
    var id = p._blockId || "lens0";
    return (
      '<div class="veltro-lens-wrap fw-widget-cursorLens" id="lens-' +
      id +
      '" data-lens-size="' +
      (p.lensSize || 120) +
      '" data-magnification="' +
      (p.magnification || 2) +
      '" style="height:' +
      (p.height || 300) +
      "px;background:" +
      (p.bg || "#0d0d1a") +
      ';position:relative;overflow:hidden;border-radius:4px;cursor:none"><img class="veltro-lens-bg" src="' +
      (p.image || "https://picsum.photos/800/400?random=1") +
      '" style="width:100%;height:100%;object-fit:cover"><div class="veltro-lens-mask" style="position:absolute;width:' +
      (p.lensSize || 120) +
      "px;height:" +
      (p.lensSize || 120) +
      'px;border-radius:50%;border:2px solid rgba(255,255,255,0.5);overflow:hidden;pointer-events:none;transform:translate(-50%,-50%);left:var(--lx,50%);top:var(--ly,50%)"><img src="' +
      (p.image || "https://picsum.photos/800/400?random=1") +
      '" style="position:absolute;width:' +
      (p.magnification || 2) * 100 +
      "%;height:" +
      (p.magnification || 2) * 100 +
      '%;object-fit:cover;left:var(--lx-offset,0);top:var(--ly-offset,0)"></div></div>'
    );
  },
  editPanel: function (id, p) { return ""; },
});

// shaderBg
FB.widgets.register("shaderBg", {
  label: "Shader Background",
  sublabel: "WebGL GLSL backgrounds",
  icon: "🌊",
  iconBg: "#3b82f6",
  iconColor: "#fff",
  category: "veltro",
  subCategory: "backgrounds",
  defaultProps: {
    height: 400,
    bg: "#050510",
    shaderType: "noise",
    speed: 0.5,
    intensity: 1,
    color1: "#3b82f6",
    color2: "#8b5cf6",
  },
  render: function (p) {
    var id = p._blockId || "shader0";
    return (
      '<div class="veltro-shader-wrap" id="shader-' +
      id +
      '" data-shader-type="' +
      (p.shaderType || "noise") +
      '" data-speed="' +
      (p.speed || 0.5) +
      '" data-intensity="' +
      (p.intensity || 1) +
      '" data-color1="' +
      (p.color1 || "#3b82f6") +
      '" data-color2="' +
      (p.color2 || "#8b5cf6") +
      '" style="height:' +
      (p.height || 400) +
      "px;background:" +
      (p.bg || "#050510") +
      ';position:relative;overflow:hidden;border-radius:4px"><canvas class="veltro-shader-canvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas></div>'
    );
  },
  editPanel: function (id, p) { return ""; },
});

// infiniteCanvas
FB.widgets.register("infiniteCanvas", {
  label: "Infinite Canvas",
  sublabel: "Pan & zoom space",
  icon: "🗺️",
  iconBg: "#10b981",
  iconColor: "#fff",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 400,
    bg: "#0a0a1a",
    gridSize: 40,
    gridColor: "rgba(255,255,255,0.05)",
  },
  render: function (p) {
    var id = p._blockId || "infinite0";
    return (
      '<div class="veltro-infinite-wrap" id="infinite-' +
      id +
      '" data-grid-size="' +
      (p.gridSize || 40) +
      '" data-grid-color="' +
      (p.gridColor || "rgba(255,255,255,0.05)") +
      '" style="height:' +
      (p.height || 400) +
      "px;background:" +
      (p.bg || "#0a0a1a") +
      ';position:relative;overflow:hidden;border-radius:4px;cursor:grab"><canvas class="veltro-infinite-canvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas></div>'
    );
  },
  editPanel: function (id, p) { return ""; },
});

// 8. Isometric Grid
FB.widgets.register("isometricGrid", {
  label: "Isometric Grid",
  sublabel: "3D isometric tile layout",
  icon: "⬡",
  iconBg: "#0d1a2e",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    rows: 3,
    cols: 4,
    gap: 12,
    perspective: 1200,
    tileColor: "#4a90e2",
    tileSize: 80,
    animationType: "none",
    gridColor: "rgba(205,254,0,0.1)",
  },
  render: function (p) {
    var id = p._blockId || "isogrid";
    var rows = p.rows || 3;
    var cols = p.cols || 4;
    var gap = p.gap || 12;
    var size = p.tileSize || 80;
    var tilesHtml = "";

    for (var i = 0; i < rows * cols; i++) {
      tilesHtml +=
        '<div class="veltro-iso-tile" style="width:' +
        size +
        "px;height:" +
        size +
        "px;background:" +
        (p.tileColor || "#4a90e2") +
        ';border:1px solid rgba(205,254,0,0.2);display:flex;align-items:center;justify-content:center;border-radius:4px;transform:perspective(' +
        (p.perspective || 1200) +
        "px) rotateX(20deg) rotateZ(45deg);font-size:0.8rem;font-weight:700;color:#fff\">" +
        (i + 1) +
        "</div>";
    }

    return (
      '<div class="veltro-isogrid-wrap" id="isogrid-' +
      id +
      '" data-rows="' +
      rows +
      '" data-cols="' +
      cols +
      '" data-perspective="' +
      (p.perspective || 1200) +
      '" style="height:' +
      (p.height || 500) +
      "px;background:" +
      (p.bg || "#0d0d1a") +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center;perspective:' +
      (p.perspective || 1200) +
      'px"><div style="display:grid;grid-template-columns:repeat(' +
      cols +
      ",1fr);grid-template-rows:repeat(" +
      rows +
      ",1fr);gap:" +
      gap +
      "px;padding:20px;perspective:" +
      (p.perspective || 1200) +
      "px\">" +
      tilesHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

// ── INITIALIZER FUNCTIONS ──
// These are called after widgets are rendered to set up interactions

window._VeltroInitCarousel3d = function () {
  document
    .querySelectorAll(".veltro-carousel-wrap[data-carousel-init]:not([data-carousel-loaded])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-carousel-loaded", "1");
      var stage = wrap.querySelector(".veltro-carousel-stage");
      if (!stage) return;
      var rotationSpeed = parseFloat(wrap.dataset.rotationSpeed) || 0.5;
      var autoRotate = wrap.dataset.autoRotate === "1";
      var clickable = wrap.dataset.clickableCards === "1";
      var currentRotation = 0;
      var autoRotateTimer = null;

      function updateRotation() {
        stage.style.transform = "rotateY(" + currentRotation + "deg)";
      }

      function startAutoRotate() {
        if (!autoRotate || autoRotateTimer) return;
        autoRotateTimer = setInterval(function () {
          currentRotation -= 360 / 6;
          updateRotation();
        }, 3000);
      }

      function stopAutoRotate() {
        if (autoRotateTimer) {
          clearInterval(autoRotateTimer);
          autoRotateTimer = null;
        }
      }

      if (clickable) {
        wrap.addEventListener("click", function (e) {
          var card = e.target.closest(".veltro-carousel-card");
          if (card && card.dataset.link) {
            window.open(card.dataset.link, "_blank");
          }
        });
      }

      wrap.addEventListener("mouseenter", stopAutoRotate);
      wrap.addEventListener("mouseleave", startAutoRotate);

      updateRotation();
      startAutoRotate();
    });
};

window._VeltroInitPerspectiveRooms = function () {
  document
    .querySelectorAll(".veltro-rooms-wrap:not([data-rooms-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-rooms-init", "1");
      var rooms = wrap.querySelectorAll(".veltro-room");
      var navDots = wrap.querySelectorAll(".veltro-room-nav");
      if (!rooms.length || !navDots.length) return;

      var currentRoom = 0;
      var autoRotate = wrap.dataset.autoRotate === "1";
      var autoRotateInterval = parseInt(wrap.dataset.autoRotateInterval) || 8000;
      var autoRotateTimer = null;

      function showRoom(index) {
        currentRoom = index % rooms.length;
        // Update room opacity
        for (var i = 0; i < rooms.length; i++) {
          var room = rooms[i];
          if (room && room.style) {
            room.style.opacity = i === currentRoom ? "1" : "0";
          }
        }
        // Update nav dot highlighting
        for (var i = 0; i < navDots.length; i++) {
          var dot = navDots[i];
          if (dot && dot.style) {
            dot.style.background = i === currentRoom ? wrap.dataset.highlightColor : "rgba(255,255,255,0.2)";
          }
        }
      }

      function startAutoRotate() {
        if (!autoRotate || autoRotateTimer) return;
        autoRotateTimer = setInterval(function () {
          currentRoom = (currentRoom + 1) % rooms.length;
          showRoom(currentRoom);
        }, autoRotateInterval);
      }

      function stopAutoRotate() {
        if (autoRotateTimer) {
          clearInterval(autoRotateTimer);
          autoRotateTimer = null;
        }
      }

      navDots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          showRoom(i);
          stopAutoRotate();
          startAutoRotate();
        });
      });

      wrap.addEventListener("mouseenter", stopAutoRotate);
      wrap.addEventListener("mouseleave", startAutoRotate);

      showRoom(currentRoom);
      startAutoRotate();
    });
};

window._VeltroInitKineticLayout = function () {
  document
    .querySelectorAll(".veltro-kinetic-wrap:not([data-kinetic-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-kinetic-init", "1");
      var items = Array.from(wrap.querySelectorAll(".veltro-kinetic-item"));
      if (!items.length) return;

      var radius = parseFloat(wrap.dataset.responseRadius) || 120;
      var strength = parseFloat(wrap.dataset.repulseStrength) || 50;
      var mode = wrap.dataset.mode || "repulse";
      var state = items.map(function () {
        return { cx: 0, cy: 0 };
      });
      var mx = -9999,
        my = -9999,
        raf = null;

      function lerp(a, b, t) {
        return a + (b - a) * t;
      }

      function tick() {
        var rect = wrap.getBoundingClientRect();
        var settled = true;
        items.forEach(function (item, i) {
          var s = state[i];
          var ir = item.getBoundingClientRect();
          var icx = ir.left + ir.width / 2 - rect.left;
          var icy = ir.top + ir.height / 2 - rect.top;
          var dx = mx - icx,
            dy = my - icy;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var targetX = 0,
            targetY = 0;
          if (mx !== -9999 && dist < radius && dist > 1) {
            var factor = 1 - dist / radius;
            var norm = 1 / dist;
            if (mode === "repulse") {
              targetX = -dx * norm * factor * strength;
              targetY = -dy * norm * factor * strength;
            } else {
              targetX = dx * norm * factor * strength;
              targetY = dy * norm * factor * strength;
            }
          }
          s.cx = lerp(s.cx, targetX, 0.1);
          s.cy = lerp(s.cy, targetY, 0.1);
          item.style.transform =
            "translate(" + s.cx.toFixed(2) + "px," + s.cy.toFixed(2) + "px)";
          if (
            Math.abs(s.cx - targetX) > 0.05 ||
            Math.abs(s.cy - targetY) > 0.05
          )
            settled = false;
        });
        raf = settled ? null : requestAnimationFrame(tick);
      }

      function startRaf() {
        if (!raf) raf = requestAnimationFrame(tick);
      }

      wrap.addEventListener("mousemove", function (e) {
        var rect = wrap.getBoundingClientRect();
        mx = e.clientX - rect.left;
        my = e.clientY - rect.top;
        startRaf();
      });
      wrap.addEventListener("mouseleave", function () {
        mx = -9999;
        my = -9999;
        startRaf();
      });
    });
};

window._VeltroInitFloatingIslands = function () {
  // Floating Islands uses CSS animations - no additional initialization needed
};

window._VeltroInitLayeredParallax = function () {
  document
    .querySelectorAll(".veltro-parallax-wrap:not([data-parallax-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-parallax-init", "1");
      var layers = wrap.querySelectorAll(".veltro-parallax-layer");
      if (!layers.length) return;

      var scrollStrength = parseFloat(wrap.dataset.scrollStrength) || 0.8;
      var cursorStrength = parseFloat(wrap.dataset.cursorStrength) || 1.0;
      var mouseParallax = wrap.dataset.mouseParallax !== "0";
      var scrollParallax = wrap.dataset.scrollParallax !== "0";

      if (mouseParallax) {
        wrap.addEventListener("mousemove", function (e) {
          var rect = wrap.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          layers.forEach(function (layer, i) {
            var depth = (i + 1) / layers.length;
            var offsetX = (x - rect.width / 2) * depth * cursorStrength * 0.01;
            var offsetY = (y - rect.height / 2) * depth * cursorStrength * 0.01;
            layer.style.transform =
              "translate(" + offsetX + "px," + offsetY + "px)";
          });
        });
      }

      if (scrollParallax) {
        window.addEventListener("scroll", function () {
          var rect = wrap.getBoundingClientRect();
          var scrollY = window.scrollY;
          layers.forEach(function (layer, i) {
            var depth = (i + 1) / layers.length;
            var offsetY = scrollY * depth * scrollStrength * 0.05;
            layer.style.transform =
              "translateY(" + offsetY + "px)";
          });
        });
      }
    });
};

window._VeltroInitMorphingGrid = function () {
  document
    .querySelectorAll(".fw-widget-morphingGrid:not([data-mg-init])")
    .forEach(function (el) {
      el.setAttribute("data-mg-init", "1");
      var wrap = el.querySelector(".veltro-morphgrid-wrap");
      if (!wrap) return;
      var items = wrap.querySelectorAll(".veltro-morphgrid-item");
      if (!items.length) return;

      var cycleSpeed = +(wrap.dataset.cycleSpeed || 2.5) * 1000;
      var autoCycle = wrap.dataset.autoCycle !== "0";
      var layoutIndex = 0;
      var timer = null;

      function applyLayout(index) {
        layoutIndex = index % 4;
        // This is a simplified version - full morphing logic would cycle through layouts
      }

      if (autoCycle) {
        timer = setInterval(function () {
          applyLayout(layoutIndex + 1);
        }, cycleSpeed);
      }
    });
};

window._VeltroInitSpatialNavigation = function () {
  document
    .querySelectorAll(".veltro-spatial-nav:not([data-spatial-nav-init])")
    .forEach(function (nav) {
      nav.setAttribute("data-spatial-nav-init", "1");
      var items = nav.querySelectorAll(".veltro-spatial-item");
      if (!items.length) return;

      items.forEach(function (item) {
        item.addEventListener("mouseenter", function () {
          item.style.transform = "scale(1.1)";
        });
        item.addEventListener("mouseleave", function () {
          item.style.transform = "scale(1)";
        });
      });
    });
};

window._VeltroInitIsometricGrid = function () {
  document
    .querySelectorAll(".veltro-isogrid-wrap:not([data-iso-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-iso-init", "1");
      var tiles = wrap.querySelectorAll(".veltro-iso-tile");
      if (!tiles.length) return;

      tiles.forEach(function (tile, i) {
        tile.addEventListener("mouseenter", function () {
          tile.style.transform = "perspective(1200px) rotateX(20deg) rotateZ(45deg) scale(1.05)";
        });
        tile.addEventListener("mouseleave", function () {
          tile.style.transform = "perspective(1200px) rotateX(20deg) rotateZ(45deg) scale(1)";
        });
      });
    });
};

