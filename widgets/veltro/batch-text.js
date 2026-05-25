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
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Text & Wave</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      (p.text || "WAVE") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Height: ' +
      (p.height || 300) +
      'px</label><input type="range" min="100" max="600" value="' +
      (p.height || 300) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Size: ' +
      (p.fontSize || 80) +
      'px</label><input type="range" min="24" max="150" value="' +
      (p.fontSize || 80) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value);this.previousElementSibling.textContent='Font Size: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Weight: ' +
      (p.fontWeight || 800) +
      '</label><input type="range" min="100" max="900" step="100" value="' +
      (p.fontWeight || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontWeight',+this.value);this.previousElementSibling.textContent='Font Weight: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Family</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontFamily',this.value)\"><option value=\"Lexend\"" +
      (p.fontFamily === "Lexend" ? " selected" : "") +
      '>Lexend</option><option value="Inter"' +
      (p.fontFamily === "Inter" ? " selected" : "") +
      ">Inter</option></select></div>";
    html +=
      '<div class="rp-row"><label>Letter Spacing: ' +
      (p.letterSpacing || 0) +
      'px</label><input type="range" min="-5" max="20" value="' +
      (p.letterSpacing || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacing',+this.value);this.previousElementSibling.textContent='Letter Spacing: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Text Align</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textAlign',this.value)\"><option value=\"left\"" +
      (p.textAlign === "left" ? " selected" : "") +
      '>Left</option><option value="center"' +
      (p.textAlign === "center" ? " selected" : "") +
      '>Center</option><option value="right"' +
      (p.textAlign === "right" ? " selected" : "") +
      ">Right</option></select></div>";
    html +=
      '<div class="rp-row"><label>Text Transform</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textTransform',this.value)\"><option value=\"none\"" +
      (p.textTransform === "none" ? " selected" : "") +
      '>None</option><option value="uppercase"' +
      (p.textTransform === "uppercase" ? " selected" : "") +
      ">UPPERCASE</option></select></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Wave Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Amplitude: ' +
      (p.amplitude || 20) +
      '</label><input type="range" min="0" max="50" value="' +
      (p.amplitude || 20) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','amplitude',+this.value);this.previousElementSibling.textContent='Amplitude: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Frequency: ' +
      (p.frequency || 0.1) +
      '</label><input type="range" min="0.01" max="0.5" step="0.01" value="' +
      (p.frequency || 0.1) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','frequency',+this.value);this.previousElementSibling.textContent='Frequency: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Speed: ' +
      (p.speed || 0.05) +
      '</label><input type="range" min="0.01" max="0.2" step="0.01" value="' +
      (p.speed || 0.05) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value);this.previousElementSibling.textContent='Speed: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Wave Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','waveDirection',this.value)\"><option value=\"up\"" +
      (p.waveDirection === "up" ? " selected" : "") +
      '>Up</option><option value="down"' +
      (p.waveDirection === "down" ? " selected" : "") +
      '>Down</option><option value="left"' +
      (p.waveDirection === "left" ? " selected" : "") +
      '>Left</option><option value="right"' +
      (p.waveDirection === "right" ? " selected" : "") +
      ">Right</option></select></div>";
    html +=
      '<div class="rp-row"><label>Phase Offset: ' +
      (p.phaseOffset || 0) +
      '</label><input type="range" min="0" max="6.28" step="0.1" value="' +
      (p.phaseOffset || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','phaseOffset',+this.value);this.previousElementSibling.textContent='Phase Offset: '+this.value'\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Colour & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text Colour</label><div class="rp-colour-row"><input type="color" value="' +
      (p.textColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'textColor\',this.value)"><input type="text" value="' +
      (p.textColor || "#cdfe00") +
      '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textColor',this.value)\"></div></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.dualColour ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','dualColour',this.checked)\"> Dual Colour</label></div>";
    if (p.dualColour) {
      html +=
        '<div class="rp-row"><label>Colour 2</label><input type="color" value="' +
        (p.dualColour2 || "#3b82f6") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','dualColour2',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.glowEffect ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','glowEffect',this.checked)\"> Glow Effect</label></div>";
    if (p.glowEffect) {
      html +=
        '<div class="rp-row"><label>Glow Colour</label><input type="color" value="' +
        (p.glowColor || "#cdfe00") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Glow Size: ' +
        (p.glowSize || 15) +
        'px</label><input type="range" min="5" max="50" value="' +
        (p.glowSize || 15) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowSize',+this.value);this.previousElementSibling.textContent='Glow Size: '+this.value+'px'\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.textShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','textShadow',this.checked)\"> Text Shadow</label></div>";
    if (p.textShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Colour</label><input type="color" value="' +
        (p.textShadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.textShadowBlur || 4) +
        '</label><input type="range" min="0" max="20" value="' +
        (p.textShadowBlur || 4) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      (p.bgType === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      (p.bgType === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      (p.bgType === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if (p.bgType === "solid") {
      html +=
        '<div class="rp-row"><label>Background Colour</label><div class="rp-colour-row"><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        '\',\'bg\',this.value)"><input type="text" value="' +
        (p.bg || "#0d0d1a") +
        '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div></div>";
    } else if (p.bgType === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a0d2e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        (p.bgGradientDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.bgGradientDir === "90deg" ? " selected" : "") +
        ">90°</option></select></div>";
    } else if (p.bgType === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImage || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImage',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 8) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width: ' +
      (p.borderWidth || 0) +
      'px</label><input type="range" min="0" max="8" value="' +
      (p.borderWidth || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value);this.previousElementSibling.textContent='Border Width: '+this.value+'px'\"></div>";
    if (p.borderWidth > 0) {
      html +=
        '<div class="rp-row"><label>Border Colour</label><input type="color" value="' +
        (p.borderColor || "#60a5fa") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Border Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderStyle',this.value)\"><option value=\"solid\"" +
        (p.borderStyle === "solid" ? " selected" : "") +
        '>Solid</option><option value="dashed"' +
        (p.borderStyle === "dashed" ? " selected" : "") +
        ">Dashed</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Padding V: ' +
      (p.paddingV || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingV || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value);this.previousElementSibling.textContent='Padding V: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H: ' +
      (p.paddingH || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingH || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value);this.previousElementSibling.textContent='Padding H: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity: ' +
      (p.opacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value);this.previousElementSibling.textContent='Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.boxShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','boxShadow',this.checked)\"> Box Shadow</label></div>";
    if (p.boxShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.shadowBlur || 10) +
        '</label><input type="range" min="0" max="40" value="' +
        (p.shadowBlur || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      (p.entranceAnim === "none" ? " selected" : "") +
      '>None</option><option value="fade"' +
      (p.entranceAnim === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide-up"' +
      (p.entranceAnim === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="zoom"' +
      (p.entranceAnim === "zoom" ? " selected" : "") +
      ">Zoom</option></select></div>";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      html +=
        '<div class="rp-row"><label>Duration: ' +
        (p.animDuration || 600) +
        'ms</label><input type="range" min="200" max="2000" step="100" value="' +
        (p.animDuration || 600) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDuration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      (p.hoverEffect === "none" ? " selected" : "") +
      '>None</option><option value="scale"' +
      (p.hoverEffect === "scale" ? " selected" : "") +
      '>Scale</option><option value="lift"' +
      (p.hoverEffect === "lift" ? " selected" : "") +
      ">Lift</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// 2. 3D Rotating Text
FB.widgets.register("rotatingText3d", {
  label: "3D Rotating Text",
  sublabel: "Perspective rotation",
  icon: "◈",
  iconBg: "#1a0d2e",
  iconColor: "#a78bfa",
  category: "veltro",
  subCategory: "typography",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    text: "ROTATE",
    fontSize: 72,
    fontWeight: 800,
    textColor: "#cdfe00",
    rotationSpeed: 0.02,
    perspective: 800,
    rotateX: true,
    rotateY: true,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a0d2e",
    bgImage: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#a78bfa",
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
    autoRotate: true,
    mouseDriven: false,
    depth: 200,
    fontFamily: "Lexend",
    letterSpacing: 0,
    textTransform: "none",
    glowEffect: false,
    glowColor: "#a78bfa",
    glowSize: 15,
    textShadow: false,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowBlur: 4,
    textAlign: "center",
    dualColour: false,
    dualColour2: "#3b82f6",
  },
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
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Text & 3D</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      (p.text || "ROTATE") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Height: ' +
      (p.height || 300) +
      'px</label><input type="range" min="100" max="600" value="' +
      (p.height || 300) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Size: ' +
      (p.fontSize || 72) +
      'px</label><input type="range" min="24" max="150" value="' +
      (p.fontSize || 72) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value);this.previousElementSibling.textContent='Font Size: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Weight: ' +
      (p.fontWeight || 800) +
      '</label><input type="range" min="100" max="900" step="100" value="' +
      (p.fontWeight || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontWeight',+this.value);this.previousElementSibling.textContent='Font Weight: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Family</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontFamily',this.value)\"><option value=\"Lexend\"" +
      (p.fontFamily === "Lexend" ? " selected" : "") +
      '>Lexend</option><option value="Inter"' +
      (p.fontFamily === "Inter" ? " selected" : "") +
      ">Inter</option></select></div>";
    html +=
      '<div class="rp-row"><label>Letter Spacing: ' +
      (p.letterSpacing || 0) +
      'px</label><input type="range" min="-5" max="20" value="' +
      (p.letterSpacing || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacing',+this.value);this.previousElementSibling.textContent='Letter Spacing: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Text Transform</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textTransform',this.value)\"><option value=\"none\"" +
      (p.textTransform === "none" ? " selected" : "") +
      '>None</option><option value="uppercase"' +
      (p.textTransform === "uppercase" ? " selected" : "") +
      ">UPPERCASE</option></select></div>";
    html +=
      '<div class="rp-row"><label>Text Align</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textAlign',this.value)\"><option value=\"left\"" +
      (p.textAlign === "left" ? " selected" : "") +
      '>Left</option><option value="center"' +
      (p.textAlign === "center" ? " selected" : "") +
      '>Center</option><option value="right"' +
      (p.textAlign === "right" ? " selected" : "") +
      ">Right</option></select></div>";
    html +=
      '<div class="rp-row"><label>Perspective: ' +
      (p.perspective || 800) +
      '</label><input type="range" min="200" max="2000" step="50" value="' +
      (p.perspective || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','perspective',+this.value);this.previousElementSibling.textContent='Perspective: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Depth (Z-axis): ' +
      (p.depth || 200) +
      '</label><input type="range" min="50" max="500" value="' +
      (p.depth || 200) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','depth',+this.value);this.previousElementSibling.textContent='Depth: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Rotation Speed: ' +
      (p.rotationSpeed || 0.02) +
      '</label><input type="range" min="0" max="0.1" step="0.005" value="' +
      (p.rotationSpeed || 0.02) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','rotationSpeed',+this.value);this.previousElementSibling.textContent='Rotation Speed: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.rotateX ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','rotateX',this.checked)\"> Rotate X</label></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.rotateY ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','rotateY',this.checked)\"> Rotate Y</label></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.autoRotate ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','autoRotate',this.checked)\"> Auto Rotate</label></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.mouseDriven ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','mouseDriven',this.checked)\"> Mouse-Driven</label></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Colour & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text Colour</label><div class="rp-colour-row"><input type="color" value="' +
      (p.textColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'textColor\',this.value)"><input type="text" value="' +
      (p.textColor || "#cdfe00") +
      '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textColor',this.value)\"></div></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.dualColour ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','dualColour',this.checked)\"> Dual Colour</label></div>";
    if (p.dualColour) {
      html +=
        '<div class="rp-row"><label>Colour 2</label><input type="color" value="' +
        (p.dualColour2 || "#3b82f6") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','dualColour2',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.glowEffect ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','glowEffect',this.checked)\"> Glow Effect</label></div>";
    if (p.glowEffect) {
      html +=
        '<div class="rp-row"><label>Glow Colour</label><input type="color" value="' +
        (p.glowColor || "#a78bfa") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Glow Size: ' +
        (p.glowSize || 15) +
        'px</label><input type="range" min="5" max="50" value="' +
        (p.glowSize || 15) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowSize',+this.value);this.previousElementSibling.textContent='Glow Size: '+this.value+'px'\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.textShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','textShadow',this.checked)\"> Text Shadow</label></div>";
    if (p.textShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Colour</label><input type="color" value="' +
        (p.textShadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.textShadowBlur || 4) +
        '</label><input type="range" min="0" max="20" value="' +
        (p.textShadowBlur || 4) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      (p.bgType === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      (p.bgType === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      (p.bgType === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if (p.bgType === "solid") {
      html +=
        '<div class="rp-row"><label>Background Colour</label><div class="rp-colour-row"><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        '\',\'bg\',this.value)"><input type="text" value="' +
        (p.bg || "#0d0d1a") +
        '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div></div>";
    } else if (p.bgType === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a0d2e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        (p.bgGradientDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.bgGradientDir === "90deg" ? " selected" : "") +
        ">90°</option></select></div>";
    } else if (p.bgType === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImage || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImage',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 8) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width: ' +
      (p.borderWidth || 0) +
      'px</label><input type="range" min="0" max="8" value="' +
      (p.borderWidth || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value);this.previousElementSibling.textContent='Border Width: '+this.value+'px'\"></div>";
    if (p.borderWidth > 0) {
      html +=
        '<div class="rp-row"><label>Border Colour</label><input type="color" value="' +
        (p.borderColor || "#a78bfa") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Border Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderStyle',this.value)\"><option value=\"solid\"" +
        (p.borderStyle === "solid" ? " selected" : "") +
        '>Solid</option><option value="dashed"' +
        (p.borderStyle === "dashed" ? " selected" : "") +
        ">Dashed</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Padding V: ' +
      (p.paddingV || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingV || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value);this.previousElementSibling.textContent='Padding V: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H: ' +
      (p.paddingH || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingH || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value);this.previousElementSibling.textContent='Padding H: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity: ' +
      (p.opacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value);this.previousElementSibling.textContent='Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.boxShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','boxShadow',this.checked)\"> Box Shadow</label></div>";
    if (p.boxShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.shadowBlur || 10) +
        '</label><input type="range" min="0" max="40" value="' +
        (p.shadowBlur || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      (p.entranceAnim === "none" ? " selected" : "") +
      '>None</option><option value="fade"' +
      (p.entranceAnim === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide-up"' +
      (p.entranceAnim === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="zoom"' +
      (p.entranceAnim === "zoom" ? " selected" : "") +
      ">Zoom</option></select></div>";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      html +=
        '<div class="rp-row"><label>Duration: ' +
        (p.animDuration || 600) +
        'ms</label><input type="range" min="200" max="2000" step="100" value="' +
        (p.animDuration || 600) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDuration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      (p.hoverEffect === "none" ? " selected" : "") +
      '>None</option><option value="scale"' +
      (p.hoverEffect === "scale" ? " selected" : "") +
      '>Scale</option><option value="lift"' +
      (p.hoverEffect === "lift" ? " selected" : "") +
      ">Lift</option></select></div>";
    html += "</div></div>";
    return html;
  },
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
    var words = (p.words || "Create,Design,Build,Launch").split(",");
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
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Text & Morph</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Words (comma-separated)</label><textarea rows="2" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','words',this.value)\">" +
      (p.words || "Create,Design,Build,Launch") +
      "</textarea></div>";
    html +=
      '<div class="rp-row"><label>Height: ' +
      (p.height || 300) +
      'px</label><input type="range" min="100" max="600" value="' +
      (p.height || 300) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Size: ' +
      (p.fontSize || 72) +
      'px</label><input type="range" min="24" max="150" value="' +
      (p.fontSize || 72) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value);this.previousElementSibling.textContent='Font Size: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Weight: ' +
      (p.fontWeight || 800) +
      '</label><input type="range" min="100" max="900" step="100" value="' +
      (p.fontWeight || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontWeight',+this.value);this.previousElementSibling.textContent='Font Weight: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Family</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontFamily',this.value)\"><option value=\"Lexend\"" +
      (p.fontFamily === "Lexend" ? " selected" : "") +
      '>Lexend</option><option value="Inter"' +
      (p.fontFamily === "Inter" ? " selected" : "") +
      ">Inter</option></select></div>";
    html +=
      '<div class="rp-row"><label>Letter Spacing: ' +
      (p.letterSpacing || 0) +
      'px</label><input type="range" min="-5" max="20" value="' +
      (p.letterSpacing || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacing',+this.value);this.previousElementSibling.textContent='Letter Spacing: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Text Transform</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textTransform',this.value)\"><option value=\"none\"" +
      (p.textTransform === "none" ? " selected" : "") +
      '>None</option><option value="uppercase"' +
      (p.textTransform === "uppercase" ? " selected" : "") +
      ">UPPERCASE</option></select></div>";
    html +=
      '<div class="rp-row"><label>Morph Speed: ' +
      (p.morphSpeed || 2000) +
      'ms</label><input type="range" min="500" max="5000" step="100" value="' +
      (p.morphSpeed || 2000) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','morphSpeed',+this.value);this.previousElementSibling.textContent='Morph Speed: '+this.value+'ms'\"></div>";
    html +=
      '<div class="rp-row"><label>Fade Speed: ' +
      (p.fadeSpeed || 500) +
      'ms</label><input type="range" min="100" max="2000" step="50" value="' +
      (p.fadeSpeed || 500) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fadeSpeed',+this.value);this.previousElementSibling.textContent='Fade Speed: '+this.value+'ms'\"></div>";
    html +=
      '<div class="rp-row"><label>Morph Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','morphDirection',this.value)\"><option value=\"forward\"" +
      (p.morphDirection === "forward" ? " selected" : "") +
      '>Forward</option><option value="reverse"' +
      (p.morphDirection === "reverse" ? " selected" : "") +
      '>Reverse</option><option value="random"' +
      (p.morphDirection === "random" ? " selected" : "") +
      ">Random</option></select></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.highlightCurrent ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','highlightCurrent',this.checked)\"> Highlight Current Word</label></div>";
    if (p.highlightCurrent) {
      html +=
        '<div class="rp-row"><label>Highlight Colour</label><input type="color" value="' +
        (p.highlightColor || "#cdfe00") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','highlightColor',this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Colour & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text Colour</label><div class="rp-colour-row"><input type="color" value="' +
      (p.textColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'textColor\',this.value)"><input type="text" value="' +
      (p.textColor || "#cdfe00") +
      '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textColor',this.value)\"></div></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.dualColour ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','dualColour',this.checked)\"> Dual Colour</label></div>";
    if (p.dualColour) {
      html +=
        '<div class="rp-row"><label>Colour 2</label><input type="color" value="' +
        (p.dualColour2 || "#3b82f6") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','dualColour2',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.glowEffect ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','glowEffect',this.checked)\"> Glow Effect</label></div>";
    if (p.glowEffect) {
      html +=
        '<div class="rp-row"><label>Glow Colour</label><input type="color" value="' +
        (p.glowColor || "#34d399") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Glow Size: ' +
        (p.glowSize || 15) +
        'px</label><input type="range" min="5" max="50" value="' +
        (p.glowSize || 15) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowSize',+this.value);this.previousElementSibling.textContent='Glow Size: '+this.value+'px'\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.textShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','textShadow',this.checked)\"> Text Shadow</label></div>";
    if (p.textShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Colour</label><input type="color" value="' +
        (p.textShadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.textShadowBlur || 4) +
        '</label><input type="range" min="0" max="20" value="' +
        (p.textShadowBlur || 4) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      (p.bgType === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      (p.bgType === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      (p.bgType === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if (p.bgType === "solid") {
      html +=
        '<div class="rp-row"><label>Background Colour</label><div class="rp-colour-row"><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        '\',\'bg\',this.value)"><input type="text" value="' +
        (p.bg || "#0d0d1a") +
        '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div></div>";
    } else if (p.bgType === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a0d2e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        (p.bgGradientDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.bgGradientDir === "90deg" ? " selected" : "") +
        ">90°</option></select></div>";
    } else if (p.bgType === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImage || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImage',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 8) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width: ' +
      (p.borderWidth || 0) +
      'px</label><input type="range" min="0" max="8" value="' +
      (p.borderWidth || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value);this.previousElementSibling.textContent='Border Width: '+this.value+'px'\"></div>";
    if (p.borderWidth > 0) {
      html +=
        '<div class="rp-row"><label>Border Colour</label><input type="color" value="' +
        (p.borderColor || "#34d399") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Border Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderStyle',this.value)\"><option value=\"solid\"" +
        (p.borderStyle === "solid" ? " selected" : "") +
        '>Solid</option><option value="dashed"' +
        (p.borderStyle === "dashed" ? " selected" : "") +
        ">Dashed</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Padding V: ' +
      (p.paddingV || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingV || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value);this.previousElementSibling.textContent='Padding V: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H: ' +
      (p.paddingH || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingH || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value);this.previousElementSibling.textContent='Padding H: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity: ' +
      (p.opacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value);this.previousElementSibling.textContent='Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.boxShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','boxShadow',this.checked)\"> Box Shadow</label></div>";
    if (p.boxShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.shadowBlur || 10) +
        '</label><input type="range" min="0" max="40" value="' +
        (p.shadowBlur || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      (p.entranceAnim === "none" ? " selected" : "") +
      '>None</option><option value="fade"' +
      (p.entranceAnim === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide-up"' +
      (p.entranceAnim === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="zoom"' +
      (p.entranceAnim === "zoom" ? " selected" : "") +
      ">Zoom</option></select></div>";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      html +=
        '<div class="rp-row"><label>Duration: ' +
        (p.animDuration || 600) +
        'ms</label><input type="range" min="200" max="2000" step="100" value="' +
        (p.animDuration || 600) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDuration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      (p.hoverEffect === "none" ? " selected" : "") +
      '>None</option><option value="scale"' +
      (p.hoverEffect === "scale" ? " selected" : "") +
      '>Scale</option><option value="lift"' +
      (p.hoverEffect === "lift" ? " selected" : "") +
      ">Lift</option></select></div>";
    html += "</div></div>";
    return html;
  },
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
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Text & Scramble</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      (p.text || "SCRAMBLE") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Height: ' +
      (p.height || 300) +
      'px</label><input type="range" min="100" max="600" value="' +
      (p.height || 300) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Size: ' +
      (p.fontSize || 72) +
      'px</label><input type="range" min="24" max="150" value="' +
      (p.fontSize || 72) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value);this.previousElementSibling.textContent='Font Size: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Weight: ' +
      (p.fontWeight || 800) +
      '</label><input type="range" min="100" max="900" step="100" value="' +
      (p.fontWeight || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontWeight',+this.value);this.previousElementSibling.textContent='Font Weight: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Family</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontFamily',this.value)\"><option value=\"monospace\"" +
      (p.fontFamily === "monospace" ? " selected" : "") +
      '>Monospace</option><option value="Inter"' +
      (p.fontFamily === "Inter" ? " selected" : "") +
      ">Inter</option></select></div>";
    html +=
      '<div class="rp-row"><label>Letter Spacing: ' +
      (p.letterSpacing || 4) +
      'px</label><input type="range" min="-5" max="20" value="' +
      (p.letterSpacing || 4) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacing',+this.value);this.previousElementSibling.textContent='Letter Spacing: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Text Align</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textAlign',this.value)\"><option value=\"left\"" +
      (p.textAlign === "left" ? " selected" : "") +
      '>Left</option><option value="center"' +
      (p.textAlign === "center" ? " selected" : "") +
      '>Center</option><option value="right"' +
      (p.textAlign === "right" ? " selected" : "") +
      ">Right</option></select></div>";
    html +=
      '<div class="rp-row"><label>Text Transform</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textTransform',this.value)\"><option value=\"none\"" +
      (p.textTransform === "none" ? " selected" : "") +
      '>None</option><option value="uppercase"' +
      (p.textTransform === "uppercase" ? " selected" : "") +
      ">UPPERCASE</option></select></div>";
    html +=
      '<div class="rp-row"><label>Scramble Speed: ' +
      (p.scrambleSpeed || 100) +
      'ms</label><input type="range" min="20" max="300" value="' +
      (p.scrambleSpeed || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','scrambleSpeed',+this.value);this.previousElementSibling.textContent='Scramble Speed: '+this.value+'ms'\"></div>";
    html +=
      '<div class="rp-row"><label>Reveal Speed: ' +
      (p.revealSpeed || 2000) +
      'ms</label><input type="range" min="500" max="5000" step="100" value="' +
      (p.revealSpeed || 2000) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','revealSpeed',+this.value);this.previousElementSibling.textContent='Reveal Speed: '+this.value+'ms'\"></div>";
    html +=
      '<div class="rp-row"><label>Reveal Trigger</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','revealTrigger',this.value)\"><option value=\"hover\"" +
      (p.revealTrigger === "hover" ? " selected" : "") +
      '>Hover</option><option value="click"' +
      (p.revealTrigger === "click" ? " selected" : "") +
      '>Click</option><option value="scroll"' +
      (p.revealTrigger === "scroll" ? " selected" : "") +
      ">Scroll</option></select></div>";
    html +=
      '<div class="rp-row"><label>Cipher Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','cipherStyle',this.value)\"><option value=\"random\"" +
      (p.cipherStyle === "random" ? " selected" : "") +
      '>Random</option><option value="matrix"' +
      (p.cipherStyle === "matrix" ? " selected" : "") +
      '>Matrix</option><option value="binary"' +
      (p.cipherStyle === "binary" ? " selected" : "") +
      ">Binary</option></select></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.autoScramble ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','autoScramble',this.checked)\"> Auto Re-scramble</label></div>";
    if (p.autoScramble) {
      html +=
        '<div class="rp-row"><label>Re-scramble Interval: ' +
        (p.autoScrambleInterval || 3000) +
        'ms</label><input type="range" min="1000" max="10000" step="500" value="' +
        (p.autoScrambleInterval || 3000) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','autoScrambleInterval',+this.value);this.previousElementSibling.textContent='Re-scramble Interval: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Charset</label><input type="text" value="' +
      (p.charset || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','charset',this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Colour & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text Colour</label><div class="rp-colour-row"><input type="color" value="' +
      (p.textColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'textColor\',this.value)"><input type="text" value="' +
      (p.textColor || "#cdfe00") +
      '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textColor',this.value)\"></div></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.glowEffect ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','glowEffect',this.checked)\"> Glow Effect</label></div>";
    if (p.glowEffect) {
      html +=
        '<div class="rp-row"><label>Glow Colour</label><input type="color" value="' +
        (p.glowColor || "#f472b6") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Glow Size: ' +
        (p.glowSize || 15) +
        'px</label><input type="range" min="5" max="50" value="' +
        (p.glowSize || 15) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowSize',+this.value);this.previousElementSibling.textContent='Glow Size: '+this.value+'px'\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.textShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','textShadow',this.checked)\"> Text Shadow</label></div>";
    if (p.textShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Colour</label><input type="color" value="' +
        (p.textShadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.textShadowBlur || 4) +
        '</label><input type="range" min="0" max="20" value="' +
        (p.textShadowBlur || 4) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      (p.bgType === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      (p.bgType === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      (p.bgType === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if (p.bgType === "solid") {
      html +=
        '<div class="rp-row"><label>Background Colour</label><div class="rp-colour-row"><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        '\',\'bg\',this.value)"><input type="text" value="' +
        (p.bg || "#0d0d1a") +
        '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div></div>";
    } else if (p.bgType === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a0d2e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        (p.bgGradientDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.bgGradientDir === "90deg" ? " selected" : "") +
        ">90°</option></select></div>";
    } else if (p.bgType === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImage || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImage',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 8) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width: ' +
      (p.borderWidth || 0) +
      'px</label><input type="range" min="0" max="8" value="' +
      (p.borderWidth || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value);this.previousElementSibling.textContent='Border Width: '+this.value+'px'\"></div>";
    if (p.borderWidth > 0) {
      html +=
        '<div class="rp-row"><label>Border Colour</label><input type="color" value="' +
        (p.borderColor || "#f472b6") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Border Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderStyle',this.value)\"><option value=\"solid\"" +
        (p.borderStyle === "solid" ? " selected" : "") +
        '>Solid</option><option value="dashed"' +
        (p.borderStyle === "dashed" ? " selected" : "") +
        ">Dashed</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Padding V: ' +
      (p.paddingV || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingV || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value);this.previousElementSibling.textContent='Padding V: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H: ' +
      (p.paddingH || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingH || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value);this.previousElementSibling.textContent='Padding H: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity: ' +
      (p.opacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value);this.previousElementSibling.textContent='Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.boxShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','boxShadow',this.checked)\"> Box Shadow</label></div>";
    if (p.boxShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.shadowBlur || 10) +
        '</label><input type="range" min="0" max="40" value="' +
        (p.shadowBlur || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      (p.entranceAnim === "none" ? " selected" : "") +
      '>None</option><option value="fade"' +
      (p.entranceAnim === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide-up"' +
      (p.entranceAnim === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="zoom"' +
      (p.entranceAnim === "zoom" ? " selected" : "") +
      ">Zoom</option></select></div>";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      html +=
        '<div class="rp-row"><label>Duration: ' +
        (p.animDuration || 600) +
        'ms</label><input type="range" min="200" max="2000" step="100" value="' +
        (p.animDuration || 600) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDuration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      (p.hoverEffect === "none" ? " selected" : "") +
      '>None</option><option value="scale"' +
      (p.hoverEffect === "scale" ? " selected" : "") +
      '>Scale</option><option value="lift"' +
      (p.hoverEffect === "lift" ? " selected" : "") +
      ">Lift</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

