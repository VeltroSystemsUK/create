// ── VELTRO ENGINE BATCH 2: TYPOGRAPHY (4 NEW WIDGETS) ──
// 1. Wave Text
FB.widgets.register("waveText", {
  label: "Wave Text",
  sublabel: "Sine wave animation",
  icon: "~",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "typography",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    text: "WAVE",
    fontSize: 80,
    fontWeight: 800,
    textColor: "#cdfe00",
    amplitude: 20,
    frequency: 0.1,
    speed: 0.05,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a0d2e",
    bgImage: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#60a5fa",
    borderStyle: "solid",
    paddingV: 24,
    paddingH: 24,
    marginV: 0,
    marginH: 0,
    boxShadow: false,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowBlur: 10,
    shadowSpread: 0,
    opacity: 100,
    entranceAnim: "none",
    animDuration: 600,
    animDelay: 0,
    hoverEffect: "none",
    hoverScale: 1.02,
    hoverTransition: 300,
    waveDirection: "up",
    phaseOffset: 0,
    dualColour: false,
    dualColour2: "#3b82f6",
    fontFamily: "Lexend",
    letterSpacing: 0,
    textTransform: "none",
    glowEffect: false,
    glowColor: "#cdfe00",
    glowSize: 15,
    textShadow: false,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowBlur: 4,
    textAlign: "center",
  },
  render: function (p) {
    var id = p._blockId || "wave";
    var chars = (p.text || "WAVE").split("");
    var charHtml = chars
      .map(function (c, i) {
        var col = "";
        if (p.dualColour) {
          var colors = [p.textColor || "#cdfe00", p.dualColour2 || "#3b82f6"];
          col = "color:" + colors[i % 2] + ";";
        }
        return (
          '<span class="veltro-wave-char" data-index="' +
          i +
          '" style="display:inline-block;transition:none;' +
          col +
          '">' +
          c +
          "</span>"
        );
      })
      .join("");
    var containerBg = "";
    if (p.bgType === "gradient") {
      containerBg =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a0d2e") +
        ");";
    } else if (p.bgType === "image" && p.bgImage) {
      containerBg = "background:url(" + p.bgImage + ") center/cover;";
    } else {
      containerBg = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px " +
        (p.borderStyle || "solid") +
        " " +
        (p.borderColor || "#60a5fa") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow) {
      containerShadow =
        "box-shadow:0 " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowBlur || 10) * 2 +
        "px " +
        (p.shadowSpread || 0) +
        "px " +
        (p.shadowColor || "rgba(0,0,0,0.3)") +
        ";";
    }
    var hoverClass = "";
    var hoverStyle = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
      hoverStyle = "transition:all " + (p.hoverTransition || 300) + "ms ease;";
    }
    var animClass = "";
    var animStyle = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
      animStyle =
        "animation-duration:" +
        (p.animDuration || 600) +
        "ms;animation-delay:" +
        (p.animDelay || 0) +
        "ms;animation-fill-mode:both;";
    }
    var glowStyle = "";
    if (p.glowEffect) {
      glowStyle =
        "filter:drop-shadow(0 0 " +
        (p.glowSize || 15) +
        "px " +
        (p.glowColor || "#cdfe00") +
        ");";
    }
    var textShadowStyle = "";
    if (p.textShadow) {
      textShadowStyle =
        "text-shadow:" +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) * 2 +
        "px " +
        (p.textShadowColor || "rgba(0,0,0,0.5)") +
        ";";
    }
    var textTransformStyle = "";
    if (p.textTransform && p.textTransform !== "none") {
      textTransformStyle = "text-transform:" + p.textTransform + ";";
    }
    return (
      '<div class="veltro-wave-wrap' +
      animClass +
      hoverClass +
      '" id="wave-' +
      id +
      '" data-amplitude="' +
      (p.amplitude || 20) +
      '" data-frequency="' +
      (p.frequency || 0.1) +
      '" data-speed="' +
      (p.speed || 0.05) +
      '" data-wave-direction="' +
      (p.waveDirection || "up") +
      '" data-phase-offset="' +
      (p.phaseOffset || 0) +
      '" data-dual-colour="' +
      (p.dualColour ? "1" : "0") +
      '" style="height:' +
      (p.height || 300) +
      "px;" +
      containerBg +
      containerBorder +
      containerShadow +
      hoverStyle +
      animStyle +
      "border-radius:" +
      (p.borderRadius || 8) +
      "px;" +
      "padding:" +
      (p.paddingV || 24) +
      "px " +
      (p.paddingH || 24) +
      "px;" +
      "margin:" +
      (p.marginV || 0) +
      "px " +
      (p.marginH || 0) +
      "px;" +
      "opacity:" +
      (p.opacity || 100) / 100 +
      ";" +
      'display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;"><div class="veltro-wave-content" style="font-size:' +
      (p.fontSize || 80) +
      "px;font-weight:" +
      (p.fontWeight || 800) +
      ";color:" +
      (p.textColor || "#cdfe00") +
      ";font-family:'" +
      (p.fontFamily || "Lexend") +
      "',sans-serif;user-select:none;letter-spacing:" +
      (p.letterSpacing || 0) +
      "px;text-align:" +
      (p.textAlign || "center") +
      ";" +
      glowStyle +
      textShadowStyle +
      textTransformStyle +
      '" data-wave-init="1">' +
      charHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
  render: function (p) {
    var id = p._blockId || "rot3d";
    var containerBg = "";
    if (p.bgType === "gradient") {
      containerBg =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a0d2e") +
        ");";
    } else if (p.bgType === "image" && p.bgImage) {
      containerBg = "background:url(" + p.bgImage + ") center/cover;";
    } else {
      containerBg = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px " +
        (p.borderStyle || "solid") +
        " " +
        (p.borderColor || "#a78bfa") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow) {
      containerShadow =
        "box-shadow:0 " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowBlur || 10) * 2 +
        "px " +
        (p.shadowSpread || 0) +
        "px " +
        (p.shadowColor || "rgba(0,0,0,0.3)") +
        ";";
    }
    var hoverClass = "";
    var hoverStyle = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
      hoverStyle = "transition:all " + (p.hoverTransition || 300) + "ms ease;";
    }
    var animClass = "";
    var animStyle = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
      animStyle =
        "animation-duration:" +
        (p.animDuration || 600) +
        "ms;animation-delay:" +
        (p.animDelay || 0) +
        "ms;animation-fill-mode:both;";
    }
    var glowStyle = "";
    if (p.glowEffect) {
      glowStyle =
        "filter:drop-shadow(0 0 " +
        (p.glowSize || 15) +
        "px " +
        (p.glowColor || "#a78bfa") +
        ");";
    }
    var textShadowStyle = "";
    if (p.textShadow) {
      textShadowStyle =
        "text-shadow:" +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) * 2 +
        "px " +
        (p.textShadowColor || "rgba(0,0,0,0.5)") +
        ";";
    }
    var textTransformStyle = "";
    if (p.textTransform && p.textTransform !== "none") {
      textTransformStyle = "text-transform:" + p.textTransform + ";";
    }
    var rotX = p.rotateX ? "1" : "0";
    var rotY = p.rotateY ? "1" : "0";
    var autoRot = p.autoRotate ? "1" : "0";
    var mouseDrv = p.mouseDriven ? "1" : "0";
    var dualCol = p.dualColour ? "1" : "0";
    return (
      '<div class="veltro-rot3d-wrap' +
      animClass +
      hoverClass +
      '" id="rot3d-' +
      id +
      '" data-rotation-speed="' +
      (p.rotationSpeed || 0.02) +
      '" data-perspective="' +
      (p.perspective || 800) +
      '" data-rotate-x="' +
      rotX +
      '" data-rotate-y="' +
      rotY +
      '" data-auto-rotate="' +
      autoRot +
      '" data-mouse-driven="' +
      mouseDrv +
      '" data-depth="' +
      (p.depth || 200) +
      '" data-dual-colour="' +
      dualCol +
      '" style="height:' +
      (p.height || 300) +
      "px;" +
      containerBg +
      containerBorder +
      containerShadow +
      hoverStyle +
      animStyle +
      "border-radius:" +
      (p.borderRadius || 8) +
      "px;" +
      "padding:" +
      (p.paddingV || 24) +
      "px " +
      (p.paddingH || 24) +
      "px;" +
      "margin:" +
      (p.marginV || 0) +
      "px " +
      (p.marginH || 0) +
      "px;" +
      "opacity:" +
      (p.opacity || 100) / 100 +
      ";" +
      "display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;perspective:" +
      (p.perspective || 800) +
      'px;"><div class="veltro-rot3d-text" style="font-size:' +
      (p.fontSize || 72) +
      "px;font-weight:" +
      (p.fontWeight || 800) +
      ";color:" +
      (p.textColor || "#cdfe00") +
      ";font-family:'" +
      (p.fontFamily || "Lexend") +
      "',sans-serif;transform-style:preserve-3d;user-select:none;letter-spacing:" +
      (p.letterSpacing || 0) +
      "px;text-align:" +
      (p.textAlign || "center") +
      ";" +
      glowStyle +
      textShadowStyle +
      textTransformStyle +
      '" data-rot3d-init="1">' +
      (p.text || "ROTATE") +
      "</div></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

// 3. Morphing Text
FB.widgets.register("morphingText", {
  label: "Morphing Text",
  sublabel: "Shape-shifting words",
  icon: "⟳",
  iconBg: "#0d1a1a",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "typography",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    words: "Create,Design,Build,Launch",
    fontSize: 72,
    fontWeight: 800,
    textColor: "#cdfe00",
    morphSpeed: 2000,
    fadeSpeed: 500,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a0d2e",
    bgImage: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#34d399",
    borderStyle: "solid",
    paddingV: 24,
    paddingH: 24,
    marginV: 0,
    marginH: 0,
    boxShadow: false,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowBlur: 10,
    shadowSpread: 0,
    opacity: 100,
    entranceAnim: "none",
    animDuration: 600,
    animDelay: 0,
    hoverEffect: "none",
    hoverScale: 1.02,
    hoverTransition: 300,
    morphDirection: "forward",
    highlightCurrent: true,
    highlightColor: "#cdfe00",
    fontFamily: "Lexend",
    letterSpacing: 0,
    textTransform: "none",
    glowEffect: false,
    glowColor: "#34d399",
    glowSize: 15,
    textShadow: false,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowBlur: 4,
    dualColour: false,
    dualColour2: "#3b82f6",
  },
  render: function (p) {
    var id = p._blockId || "morph";
    var words = FB.widgets.safeSplit(p.words, "Create,Design,Build,Launch");
    var wordsHtml = words
      .map(function (w, i) {
        return (
          '<span class="veltro-morph-word" data-index="' +
          i +
          '" style="position:absolute;opacity:0;transition:opacity ' +
          (p.fadeSpeed || 500) +
          'ms ease-in-out">' +
          w.trim() +
          "</span>"
        );
      })
      .join("");
    var containerBg = "";
    if (p.bgType === "gradient") {
      containerBg =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a0d2e") +
        ");";
    } else if (p.bgType === "image" && p.bgImage) {
      containerBg = "background:url(" + p.bgImage + ") center/cover;";
    } else {
      containerBg = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px " +
        (p.borderStyle || "solid") +
        " " +
        (p.borderColor || "#34d399") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow) {
      containerShadow =
        "box-shadow:0 " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowBlur || 10) * 2 +
        "px " +
        (p.shadowSpread || 0) +
        "px " +
        (p.shadowColor || "rgba(0,0,0,0.3)") +
        ";";
    }
    var hoverClass = "";
    var hoverStyle = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
      hoverStyle = "transition:all " + (p.hoverTransition || 300) + "ms ease;";
    }
    var animClass = "";
    var animStyle = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
      animStyle =
        "animation-duration:" +
        (p.animDuration || 600) +
        "ms;animation-delay:" +
        (p.animDelay || 0) +
        "ms;animation-fill-mode:both;";
    }
    var glowStyle = "";
    if (p.glowEffect) {
      glowStyle =
        "filter:drop-shadow(0 0 " +
        (p.glowSize || 15) +
        "px " +
        (p.glowColor || "#34d399") +
        ");";
    }
    var textShadowStyle = "";
    if (p.textShadow) {
      textShadowStyle =
        "text-shadow:" +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) * 2 +
        "px " +
        (p.textShadowColor || "rgba(0,0,0,0.5)") +
        ";";
    }
    var textTransformStyle = "";
    if (p.textTransform && p.textTransform !== "none") {
      textTransformStyle = "text-transform:" + p.textTransform + ";";
    }
    return (
      '<div class="veltro-morph-wrap' +
      animClass +
      hoverClass +
      '" id="morph-' +
      id +
      '" data-morph-speed="' +
      (p.morphSpeed || 2000) +
      '" data-fade-speed="' +
      (p.fadeSpeed || 500) +
      '" data-words="' +
      (p.words || "Create,Design,Build,Launch") +
      '" data-morph-direction="' +
      (p.morphDirection || "forward") +
      '" data-highlight="' +
      (p.highlightCurrent ? "1" : "0") +
      '" data-highlight-color="' +
      (p.highlightColor || "#cdfe00") +
      '" data-dual-colour="' +
      (p.dualColour ? "1" : "0") +
      '" data-dual-colour2="' +
      (p.dualColour2 || "#3b82f6") +
      '" style="height:' +
      (p.height || 300) +
      "px;" +
      containerBg +
      containerBorder +
      containerShadow +
      hoverStyle +
      animStyle +
      "border-radius:" +
      (p.borderRadius || 8) +
      "px;" +
      "padding:" +
      (p.paddingV || 24) +
      "px " +
      (p.paddingH || 24) +
      "px;" +
      "margin:" +
      (p.marginV || 0) +
      "px " +
      (p.marginH || 0) +
      "px;" +
      "opacity:" +
      (p.opacity || 100) / 100 +
      ";" +
      'display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;"><div class="veltro-morph-content" style="font-size:' +
      (p.fontSize || 72) +
      "px;font-weight:" +
      (p.fontWeight || 800) +
      ";color:" +
      (p.textColor || "#cdfe00") +
      ";font-family:'" +
      (p.fontFamily || "Lexend") +
      "',sans-serif;position:relative;width:100%;text-align:center;letter-spacing:" +
      (p.letterSpacing || 0) +
      "px;" +
      glowStyle +
      textShadowStyle +
      textTransformStyle +
      '" data-morph-init="1">' +
      wordsHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

// 4. Kinetic Scramble
FB.widgets.register("kineticScramble", {
  label: "Kinetic Scramble",
  sublabel: "Digital cipher effect",
  icon: "⌘",
  iconBg: "#1a0d1a",
  iconColor: "#f472b6",
  category: "veltro",
  subCategory: "typography",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    text: "SCRAMBLE",
    fontSize: 72,
    fontWeight: 800,
    textColor: "#cdfe00",
    scrambleSpeed: 100,
    revealSpeed: 2000,
    charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%",
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a0d2e",
    bgImage: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#f472b6",
    borderStyle: "solid",
    paddingV: 24,
    paddingH: 24,
    marginV: 0,
    marginH: 0,
    boxShadow: false,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowBlur: 10,
    shadowSpread: 0,
    opacity: 100,
    entranceAnim: "none",
    animDuration: 600,
    animDelay: 0,
    hoverEffect: "none",
    hoverScale: 1.02,
    hoverTransition: 300,
    autoScramble: false,
    autoScrambleInterval: 3000,
    revealTrigger: "hover",
    fontFamily: "monospace",
    letterSpacing: 4,
    textTransform: "none",
    glowEffect: false,
    glowColor: "#f472b6",
    glowSize: 15,
    textShadow: false,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowBlur: 4,
    textAlign: "center",
    cipherStyle: "random",
  },
  render: function (p) {
    var id = p._blockId || "scramble";
    var containerBg = "";
    if (p.bgType === "gradient") {
      containerBg =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a0d2e") +
        ");";
    } else if (p.bgType === "image" && p.bgImage) {
      containerBg = "background:url(" + p.bgImage + ") center/cover;";
    } else {
      containerBg = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px " +
        (p.borderStyle || "solid") +
        " " +
        (p.borderColor || "#f472b6") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow) {
      containerShadow =
        "box-shadow:0 " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowBlur || 10) * 2 +
        "px " +
        (p.shadowSpread || 0) +
        "px " +
        (p.shadowColor || "rgba(0,0,0,0.3)") +
        ";";
    }
    var hoverClass = "";
    var hoverStyle = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
      hoverStyle = "transition:all " + (p.hoverTransition || 300) + "ms ease;";
    }
    var animClass = "";
    var animStyle = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
      animStyle =
        "animation-duration:" +
        (p.animDuration || 600) +
        "ms;animation-delay:" +
        (p.animDelay || 0) +
        "ms;animation-fill-mode:both;";
    }
    var glowStyle = "";
    if (p.glowEffect) {
      glowStyle =
        "filter:drop-shadow(0 0 " +
        (p.glowSize || 15) +
        "px " +
        (p.glowColor || "#f472b6") +
        ");";
    }
    var textShadowStyle = "";
    if (p.textShadow) {
      textShadowStyle =
        "text-shadow:" +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) * 2 +
        "px " +
        (p.textShadowColor || "rgba(0,0,0,0.5)") +
        ";";
    }
    var textTransformStyle = "";
    if (p.textTransform && p.textTransform !== "none") {
      textTransformStyle = "text-transform:" + p.textTransform + ";";
    }
    return (
      '<div class="veltro-scramble-wrap' +
      animClass +
      hoverClass +
      '" id="scramble-' +
      id +
      '" data-scramble-speed="' +
      (p.scrambleSpeed || 100) +
      '" data-reveal-speed="' +
      (p.revealSpeed || 2000) +
      '" data-charset="' +
      (p.charset || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%") +
      '" data-text="' +
      (p.text || "SCRAMBLE") +
      '" data-auto-scramble="' +
      (p.autoScramble ? "1" : "0") +
      '" data-auto-interval="' +
      (p.autoScrambleInterval || 3000) +
      '" data-reveal-trigger="' +
      (p.revealTrigger || "hover") +
      '" data-cipher-style="' +
      (p.cipherStyle || "random") +
      '" style="height:' +
      (p.height || 300) +
      "px;" +
      containerBg +
      containerBorder +
      containerShadow +
      hoverStyle +
      animStyle +
      "border-radius:" +
      (p.borderRadius || 8) +
      "px;" +
      "padding:" +
      (p.paddingV || 24) +
      "px " +
      (p.paddingH || 24) +
      "px;" +
      "margin:" +
      (p.marginV || 0) +
      "px " +
      (p.marginH || 0) +
      "px;" +
      "opacity:" +
      (p.opacity || 100) / 100 +
      ";" +
      'display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;"><div class="veltro-scramble-text" style="font-size:' +
      (p.fontSize || 72) +
      "px;font-weight:" +
      (p.fontWeight || 800) +
      ";color:" +
      (p.textColor || "#cdfe00") +
      ";font-family:'" +
      (p.fontFamily || "monospace") +
      "',sans-serif;user-select:none;letter-spacing:" +
      (p.letterSpacing || 4) +
      "px;text-align:" +
      (p.textAlign || "center") +
      ";" +
      glowStyle +
      textShadowStyle +
      textTransformStyle +
      '" data-scramble-init="1">' +
      (p.text || "SCRAMBLE") +
      "</div></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

