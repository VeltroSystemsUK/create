// Interactive Widgets

FB.widgets.register("counter", {
  label: "Counter",
  icon: "#",
  iconBg: "#1a2a1a",
  iconColor: "#CDFE00",
  category: "interactive",
  defaultProps: {
    number: 100,
    prefix: "",
    suffix: "+",
    title: "Projects",
    color: "#111111",
    size: 48,
  },
  render: function (p) {
    return (
      '<div class="fw-counter" style="text-align:center;padding:1rem">' +
      '<div class="fw-counter-number" style="font-family:\'Lexend\',sans-serif;font-size:' +
      (p.size || 48) +
      "px;font-weight:800;line-height:1;color:" +
      (p.color || "#111") +
      '">' +
      (p.prefix || "") +
      "<span>" +
      (p.number || 100) +
      "</span>" +
      (p.suffix || "") +
      "</div>" +
      '<div class="fw-counter-title" style="font-size:14px;color:#666;margin-top:4px">' +
      (p.title || "") +
      "</div></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("countdown", {
  label: "Countdown",
  icon: "\u23F1",
  iconBg: "#1a1a2a",
  iconColor: "#CDFE00",
  category: "interactive",
  defaultProps: { date: "2027-01-01", label: "New Year" },
  render: function (p) {
    return (
      '<div style="padding:1rem;text-align:center">' +
      (p.label
        ? '<div style="font-size:14px;font-weight:500;margin-bottom:1rem">' +
          p.label +
          "</div>"
        : "") +
      '<div class="fw-countdown" style="display:flex;gap:1rem;justify-content:center">' +
      '<div class="fw-countdown-unit"><div class="fw-countdown-num" style="font-family:\'Lexend\',sans-serif;font-size:3rem;font-weight:800;line-height:1">--</div><div class="fw-countdown-label" style="font-size:11px;text-transform:uppercase;color:#999;letter-spacing:2px">Days</div></div>' +
      '<div class="fw-countdown-unit"><div class="fw-countdown-num" style="font-family:\'Lexend\',sans-serif;font-size:3rem;font-weight:800;line-height:1">--</div><div class="fw-countdown-label" style="font-size:11px;text-transform:uppercase;color:#999;letter-spacing:2px">Hours</div></div>' +
      '<div class="fw-countdown-unit"><div class="fw-countdown-num" style="font-family:\'Lexend\',sans-serif;font-size:3rem;font-weight:800;line-height:1">--</div><div class="fw-countdown-label" style="font-size:11px;text-transform:uppercase;color:#999;letter-spacing:2px">Mins</div></div>' +
      '<div class="fw-countdown-unit"><div class="fw-countdown-num" style="font-family:\'Lexend\',sans-serif;font-size:3rem;font-weight:800;line-height:1">--</div><div class="fw-countdown-label" style="font-size:11px;text-transform:uppercase;color:#999;letter-spacing:2px">Secs</div></div></div></div>'
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("animatedHeadline", {
  label: "Animated Headline",
  icon: "\uD83D\uDDA5",
  iconBg: "#2a1a2a",
  iconColor: "#CDFE00",
  category: "interactive",
  defaultProps: {
    beforeText: "We build",
    words: ["great", "amazing", "fast"],
    afterText: "things",
    color: "#111",
  },
  render: function (p) {
    var words = p.words || [];
    return (
      '<div class="fw-animated-headline" style="text-align:center;padding:1rem;font-family:\'Lexend\',sans-serif;font-size:clamp(1.5rem,4vw,3rem);font-weight:800;letter-spacing:-1px;color:' +
      (p.color || "#111") +
      '">' +
      (p.beforeText || "") +
      ' <span class="fw-ah-words" style="display:inline-block;overflow:hidden;vertical-align:bottom">' +
      words
        .map(function (w, i) {
          return (
            '<span class="fw-ah-word' +
            (i === 0 ? " active" : "") +
            '" style="' +
            (i === 0
              ? "display:inline-block;animation:ahFadeIn 0.4s ease"
              : "display:none") +
            '">' +
            w +
            "</span>"
          );
        })
        .join("") +
      "</span> " +
      (p.afterText || "") +
      "</div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("hotspot", {
  label: "Hotspot",
  icon: "\uD83D\uDCCD",
  iconBg: "#1a3a2a",
  iconColor: "#CDFE00",
  category: "interactive",
  defaultProps: {
    src: "",
    hotspots: [
      { x: 30, y: 30, label: "Hotspot 1" },
      { x: 70, y: 70, label: "Hotspot 2" },
    ],
  },
  render: function (p) {
    if (!p.src)
      return '<div style="padding:1rem;text-align:center;color:#999;border:2px dashed #ddd;border-radius:6px;margin:0.5rem 1rem;padding:3rem">\uD83D\uDCCD Hotspot<br><span style="font-size:11px">Set image in panel</span></div>';
    var markers = (p.hotspots || [])
      .map(function (m) {
        return (
          '<div class="fw-hotspot-marker" style="position:absolute;left:' +
          m.x +
          "%;top:" +
          m.y +
          '%;width:24px;height:24px;background:var(--accent);border-radius:50%;cursor:pointer;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#111;box-shadow:0 2px 8px rgba(0,0,0,0.2)" title="' +
          m.label +
          '">+</div>'
        );
      })
      .join("");
    return (
      '<div style="padding:0.5rem 1rem"><div class="fw-hotspot-img" style="position:relative;display:inline-block;width:100%"><img src="' +
      p.src +
      '" style="width:100%;border-radius:6px;display:block">' +
      markers +
      "</div></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("progressTracker", {
  label: "Progress Tracker",
  icon: "\u25A3",
  iconBg: "#2a1a2a",
  iconColor: "#CDFE00",
  category: "interactive",
  defaultProps: {
    steps: [
      { title: "Step 1", desc: "Start" },
      { title: "Step 2", desc: "Finish" },
    ],
    current: 1,
  },
  render: function (p) {
    var steps = p.steps || [];
    var current = p.current || 1;
    return (
      '<div class="fw-tracker" style="display:flex;padding:1rem;gap:0">' +
      steps
        .map(function (s, i) {
          var active = i < current;
          return (
            '<div class="fw-tracker-step' +
            (active ? " active" : "") +
            '" style="flex:1;text-align:center;position:relative">' +
            (i < steps.length - 1
              ? '<div style="position:absolute;top:16px;left:60%;width:80%;height:2px;background:' +
                (active ? "var(--accent)" : "#ddd") +
                '"></div>'
              : "") +
            '<div class="fw-tracker-dot" style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 6px;font-size:14px;font-weight:700;background:' +
            (active ? "var(--accent)" : "#eee") +
            ";color:" +
            (active ? "#111" : "#999") +
            '">' +
            (i + 1) +
            "</div>" +
            '<div class="fw-tracker-label" style="font-size:11px;color:' +
            (active ? "#111" : "#999") +
            ";font-weight:" +
            (active ? "500" : "400") +
            '">' +
            s.title +
            "</div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("alert", {
  label: "Alert",
  icon: "\u26A0",
  iconBg: "#2a2a1a",
  iconColor: "#f0ad4e",
  category: "interactive",
  defaultProps: {
    title: "Notice",
    desc: "This is an alert message",
    type: "info",
    dismissible: true,
  },
  render: function (p) {
    return (
      '<div class="fw-alert fw-alert-' +
      (p.type || "info") +
      '" style="padding:1rem 1.25rem;border-radius:6px;display:flex;align-items:flex-start;gap:12px;margin:0.5rem 1rem;font-size:14px">' +
      '<div style="flex:1"><strong>' +
      (p.title || "") +
      "</strong>" +
      (p.desc ? "<br><span>" + p.desc + "</span>" : "") +
      "</div>" +
      (p.dismissible
        ? '<button class="fw-alert-dismiss" style="background:none;border:none;font-size:18px;cursor:pointer;color:inherit;padding:0;line-height:1;margin-left:auto" onclick="this.parentElement.style.display=\'none\'">\u00D7</button>'
        : "") +
      "</div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});
