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

// ── Lazy initializer support ──
// inits-lazy.js loads this batch file for all text-effect initializers. Keep
// these local so Design Studio live previews and exported pages use one path.
(function () {
  function observeAndRun(el, start, stop) {
    if (!el || !start) return;
    if (!("IntersectionObserver" in window)) {
      start();
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        if (entries[0] && entries[0].isIntersecting) start();
        else if (stop) stop();
      },
      { threshold: 0.01 },
    );
    io.observe(el);
  }

  window._VeltroInitKineticText = function () {
    document
      .querySelectorAll(".fw-widget-kineticText:not([data-kinetic-init]), .ds-live-kinetic-text:not([data-kinetic-init])")
      .forEach(function (el) {
        el.setAttribute("data-kinetic-init", "1");
      });
  };

  window._VeltroInitTextMask = function () {
    document
      .querySelectorAll(".fw-widget-textMask:not([data-mask-init]), .veltro-textmask-wrap:not([data-mask-init])")
      .forEach(function (el) {
        el.setAttribute("data-mask-init", "1");
      });
  };

  window._VeltroInitTextScramble = function () {
    document
      .querySelectorAll(".veltro-scramble-wrap:not([data-init])")
      .forEach(function (wrap) {
        wrap.setAttribute("data-init", "1");
        var text = wrap.querySelector(".veltro-scramble-text");
        if (!text) return;
        var original = wrap.dataset.text || text.textContent || "SCRAMBLE";
        var charset = wrap.dataset.charset || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        var speed = +(wrap.dataset.scrambleSpeed || wrap.dataset.speed || 60);
        var revealSpeed = +(wrap.dataset.revealSpeed || 900);
        var autoScramble = wrap.dataset.autoScramble === "1";
        var autoInterval = +(wrap.dataset.autoInterval || 1200);
        var activeUntil = autoScramble ? Date.now() + Math.min(autoInterval, 900) : 0;
        var hovering = false;

        function restore() {
          if (wrap.isConnected) text.textContent = original;
        }

        text.addEventListener("mouseenter", function () {
          hovering = true;
          activeUntil = Date.now() + revealSpeed;
        });
        text.addEventListener("mouseleave", function () {
          hovering = false;
          setTimeout(restore, Math.min(revealSpeed, 700));
        });

        if (autoScramble) {
          setInterval(function () {
            if (!wrap.isConnected) return;
            activeUntil = Date.now() + Math.max(320, Math.min(autoInterval * 0.62, 1400));
            setTimeout(restore, Math.max(340, Math.min(autoInterval * 0.68, 1500)));
          }, Math.max(autoInterval, 500));
        }

        var timer = setInterval(function () {
          if (!wrap.isConnected) {
            clearInterval(timer);
            return;
          }
          if (!hovering && Date.now() > activeUntil) return;
          var result = "";
          for (var i = 0; i < original.length; i++) {
            result += original.charAt(i) === " " ? " " : charset[Math.floor(Math.random() * charset.length)];
          }
          text.textContent = result;
        }, Math.max(speed, 20));
      });
  };

  window._VeltroInitTypewriter = function () {
    document
      .querySelectorAll(".veltro-typewriter-wrap:not([data-init])")
      .forEach(function (wrap) {
        wrap.setAttribute("data-init", "1");
        var target = wrap.querySelector(".veltro-typewriter-text") || wrap.querySelector(".veltro-typewriter");
        if (!target) return;
        var original = wrap.dataset.text || target.dataset.text || target.textContent || "Hello, World!";
        var speed = +(wrap.dataset.speed || 80);
        var delay = +(wrap.dataset.delay || 1800);
        var loop = wrap.dataset.loop !== "0";
        var index = 0;
        target.textContent = "";
        function type() {
          if (!wrap.isConnected) return;
          if (index < original.length) {
            target.textContent += original.charAt(index++);
            setTimeout(type, speed);
          } else if (loop) {
            setTimeout(function () {
              if (!wrap.isConnected) return;
              target.textContent = "";
              index = 0;
              type();
            }, delay);
          }
        }
        type();
      });
  };

  window._VeltroInitCounter = function () {
    document
      .querySelectorAll(".veltro-counter-wrap:not([data-init])")
      .forEach(function (wrap) {
        wrap.setAttribute("data-init", "1");
        var el = wrap.querySelector(".veltro-counter");
        if (!el) return;
        var target = +(wrap.dataset.value || el.dataset.value || 1000);
        var prefix = wrap.dataset.prefix || "";
        var suffix = wrap.dataset.suffix || "+";
        var duration = +(wrap.dataset.duration || 2000);
        var startTime = Date.now();
        function update() {
          if (!wrap.isConnected) return;
          var progress = Math.min((Date.now() - startTime) / duration, 1);
          var ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = prefix + Math.round(target * ease) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        update();
      });
  };

  window._VeltroInitLiquidText = function () {
    document
      .querySelectorAll(".veltro-liquid-wrap:not([data-init])")
      .forEach(function (wrap) {
        wrap.setAttribute("data-init", "1");
        var chars = wrap.querySelectorAll(".veltro-liquid-char");
        if (!chars.length) return;
        var amplitude = +(wrap.dataset.amplitude || 10);
        var frequency = +(wrap.dataset.frequency || 0.05);
        var speed = +(wrap.dataset.speed || 0.04);
        var time = 0;
        var rafId = 0;
        function animate() {
          if (!wrap.isConnected) return;
          time += speed;
          chars.forEach(function (char, i) {
            char.style.transform = "translateY(" + Math.sin(i * frequency + time) * amplitude + "px)";
          });
          rafId = requestAnimationFrame(animate);
        }
        function start() {
          if (!rafId) rafId = requestAnimationFrame(animate);
        }
        function stop() {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        observeAndRun(wrap, start, stop);
      });
  };

  window._VeltroInitWaveText = function () {
    document
      .querySelectorAll(".fw-widget-waveText:not([data-wave-init]), .veltro-wave-wrap:not([data-wave-init])")
      .forEach(function (el) {
        el.setAttribute("data-wave-init", "1");
        var chars = el.querySelectorAll(".veltro-wave-char");
        if (!chars.length) return;
        var source = el.classList.contains("veltro-wave-wrap") ? el : el.querySelector(".veltro-wave-wrap") || el;
        var amplitude = +(source.dataset.amplitude || 12);
        var frequency = +(source.dataset.frequency || 0.3);
        var speed = +(source.dataset.speed || 0.05);
        var t = 0;
        var rafId = 0;
        function animate() {
          if (!el.isConnected) return;
          t += speed;
          chars.forEach(function (char, i) {
            char.style.transform = "translateY(" + Math.sin(t + i * frequency) * amplitude + "px)";
          });
          rafId = requestAnimationFrame(animate);
        }
        function start() {
          if (!rafId) rafId = requestAnimationFrame(animate);
        }
        function stop() {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        observeAndRun(el, start, stop);
      });
  };

  window._VeltroInitRotatingText3d = function () {
    document
      .querySelectorAll(".fw-widget-rotatingText3d:not([data-rot3d-init]), .veltro-rot3d-wrap:not([data-rot3d-init])")
      .forEach(function (el) {
        el.setAttribute("data-rot3d-init", "1");
        var t = 0;
        function animate() {
          if (!el.isConnected) return;
          t += 0.5;
          el.style.transform = "perspective(500px) rotateY(" + t + "deg)";
          requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
      });
  };

  window._VeltroInitMorphingText = function () {
    document
      .querySelectorAll(".fw-widget-morphingText:not([data-morph-init]), .veltro-morph-wrap:not([data-morph-init])")
      .forEach(function (el) {
        el.setAttribute("data-morph-init", "1");
        var wrap = el.classList.contains("veltro-morph-wrap") ? el : el.querySelector(".veltro-morph-wrap");
        if (!wrap) return;
        var spans = wrap.querySelectorAll(".veltro-morph-word");
        if (!spans.length) return;
        var index = 0;
        var morphSpeed = +(wrap.dataset.morphSpeed || 1600);
        var fadeSpeed = +(wrap.dataset.fadeSpeed || 300);
        function show(next) {
          spans.forEach(function (span, i) {
            span.style.opacity = i === next ? "1" : "0";
          });
        }
        show(0);
        setInterval(function () {
          if (!wrap.isConnected) return;
          spans[index].style.opacity = "0";
          setTimeout(function () {
            index = (index + 1) % spans.length;
            show(index);
          }, fadeSpeed);
        }, Math.max(morphSpeed, 500));
      });
  };

  window._VeltroInitKineticScramble = function () {
    document
      .querySelectorAll(".fw-widget-kineticScramble:not([data-ks-init]), .veltro-scramble-wrap:not([data-ks-init])")
      .forEach(function (el) {
        el.setAttribute("data-ks-init", "1");
        if (el.classList.contains("veltro-scramble-wrap")) {
          window._VeltroInitTextScramble();
          return;
        }
        var text = el.querySelector(".veltro-ks-text");
        if (!text) return;
        var original = text.dataset.text || text.textContent || "SCRAMBLE";
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        function scramble() {
          var progress = 0;
          var interval = setInterval(function () {
            if (!el.isConnected) {
              clearInterval(interval);
              return;
            }
            progress += 0.05;
            text.textContent = original
              .split("")
              .map(function (c, i) {
                return i < progress * original.length ? original[i] : chars[Math.floor(Math.random() * chars.length)];
              })
              .join("");
            if (progress >= 1) {
              clearInterval(interval);
              text.textContent = original;
            }
          }, 50);
        }
        scramble();
        setInterval(scramble, 2200);
      });
  };

  window._VeltroInitMagText = function () {
    document
      .querySelectorAll(".veltro-magtext-content:not([data-init])")
      .forEach(function (content) {
        content.setAttribute("data-init", "1");
        var wrap = content.closest(".veltro-magtext-wrap");
        if (!wrap) return;
        var chars = content.querySelectorAll(".veltro-mag-char");
        function applyFromPoint(mx, my) {
          chars.forEach(function (char) {
            var rect = char.getBoundingClientRect();
            var wr = wrap.getBoundingClientRect();
            var cx = rect.left - wr.left + rect.width / 2;
            var cy = rect.top - wr.top + rect.height / 2;
            var dist = Math.hypot(mx - cx, my - cy);
            var radius = +char.dataset.magneticRadius || 150;
            var strength = +char.dataset.magneticStrength || 0.5;
            if (dist < radius) {
              var force = (1 - dist / radius) * strength * 30;
              var angle = Math.atan2(cy - my, cx - mx);
              char.style.transform = "translate(" + Math.cos(angle) * force + "px," + Math.sin(angle) * force + "px)";
            } else {
              char.style.transform = "translate(0,0)";
            }
          });
        }
        wrap.addEventListener("mousemove", function (e) {
          var r = wrap.getBoundingClientRect();
          applyFromPoint(e.clientX - r.left, e.clientY - r.top);
        });
        wrap.addEventListener("mouseleave", function () {
          chars.forEach(function (char) {
            char.style.transform = "translate(0,0)";
          });
        });
        if (wrap.closest("#ds-veltro-canvas-layer")) {
          var phase = 0;
          setInterval(function () {
            if (!wrap.isConnected) return;
            phase += 0.35;
            applyFromPoint(wrap.clientWidth / 2 + Math.cos(phase) * 80, wrap.clientHeight / 2 + Math.sin(phase) * 40);
          }, 80);
        }
      });
  };
})();
