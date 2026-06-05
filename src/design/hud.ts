import { store } from "./store";

let hudElement: HTMLDivElement | null = null;

export function initHUD(canvas: fabric.Canvas) {
  // Bind canvas selection and transformation events
  canvas.on("selection:created", (opt) => updateHUD(canvas, opt.target));
  canvas.on("selection:updated", (opt) => updateHUD(canvas, opt.target));
  canvas.on("selection:cleared", () => hideHUD());

  canvas.on("object:moving", (opt) => repositionHUD(canvas, opt.target));
  canvas.on("object:scaling", (opt) => repositionHUD(canvas, opt.target));
  canvas.on("object:rotating", (opt) => repositionHUD(canvas, opt.target));
}

export function hideHUD() {
  if (hudElement) {
    hudElement.style.display = "none";
  }
}

function updateHUD(canvas: fabric.Canvas, target?: fabric.Object) {
  if (!target) {
    hideHUD();
    return;
  }

  // Create HUD element if it doesn't exist
  if (!hudElement) {
    hudElement = document.createElement("div");
    hudElement.id = "ds-contextual-hud";
    hudElement.className = "ds-hud-toolbar";
    const wrap = document.getElementById("ds-canvas-wrap");
    if (wrap) {
      wrap.appendChild(hudElement);
    }
  }

  // Render the appropriate controls inside the HUD
  hudElement.innerHTML = getHUDMarkup(target);
  hudElement.style.display = "flex";

  // Bind event listeners to HUD controls
  bindHUDEvents(canvas, target);

  // Position it above the object
  repositionHUD(canvas, target);
}

function repositionHUD(canvas: fabric.Canvas, target?: fabric.Object) {
  if (!hudElement || !target || hudElement.style.display === "none") return;

  const canvasContainer = canvas.wrapperEl;
  if (!canvasContainer) return;

  const rect = target.getBoundingRect();
  const hudWidth = hudElement.offsetWidth || 340;
  const hudHeight = hudElement.offsetHeight || 42;

  // Calculate coordinates relative to #ds-canvas-wrap
  const left = canvasContainer.offsetLeft + rect.left + rect.width / 2 - hudWidth / 2;
  const top = canvasContainer.offsetTop + rect.top - hudHeight - 15;

  // Clamp within the wrapper boundaries so it doesn't float offscreen
  const wrap = document.getElementById("ds-canvas-wrap");
  const maxLeft = wrap ? wrap.clientWidth - hudWidth - 10 : window.innerWidth;
  const clampedLeft = Math.max(10, Math.min(maxLeft, left));

  hudElement.style.left = `${clampedLeft}px`;
  hudElement.style.top = `${top > 10 ? top : canvasContainer.offsetTop + rect.top + rect.height + 15}px`;
}

function getHUDMarkup(target: fabric.Object): string {
  const type = target.type;
  let controls = "";

  // Depth control and duplicate/delete are common to all
  const commonTail = `
    <div class="ds-hud-divider"></div>
    <button class="ds-hud-btn" data-action="dupe" title="Duplicate">⧉</button>
    <button class="ds-hud-btn ds-hud-danger" data-action="delete" title="Delete">🗑</button>
  `;

  if (type === "i-text") {
    const textObj = target as fabric.IText;
    const isBold = textObj.fontWeight === "bold" || (typeof textObj.fontWeight === "number" && textObj.fontWeight >= 700);
    const isItalic = textObj.fontStyle === "italic";
    const isUnderline = !!textObj.underline;
    const fill = typeof textObj.fill === "string" ? textObj.fill : "#000000";

    controls = `
      <select class="ds-hud-select" data-prop="fontFamily" title="Font family">
        <option value="Lexend" ${textObj.fontFamily === "Lexend" ? "selected" : ""}>Lexend</option>
        <option value="Inter" ${textObj.fontFamily === "Inter" ? "selected" : ""}>Inter</option>
        <option value="Roboto" ${textObj.fontFamily === "Roboto" ? "selected" : ""}>Roboto</option>
        <option value="Bebas Neue" ${textObj.fontFamily === "Bebas Neue" ? "selected" : ""}>Bebas Neue</option>
        <option value="Playfair Display" ${textObj.fontFamily === "Playfair Display" ? "selected" : ""}>Playfair</option>
      </select>
      <button class="ds-hud-btn" data-action="font-minus" title="Decrease font size">−</button>
      <span class="ds-hud-val-display">${textObj.fontSize || 32}</span>
      <button class="ds-hud-btn" data-action="font-plus" title="Increase font size">+</button>
      <div class="ds-hud-divider"></div>
      <button class="ds-hud-btn ${isBold ? "active" : ""}" data-action="bold" title="Bold"><b>B</b></button>
      <button class="ds-hud-btn ${isItalic ? "active" : ""}" data-action="italic" title="Italic"><i>I</i></button>
      <button class="ds-hud-btn ${isUnderline ? "active" : ""}" data-action="underline" title="Underline"><u>U</u></button>
      <input type="color" class="ds-hud-color" data-prop="fill" value="${normalizeHex(fill)}" title="Text color">
    `;
  } else if (type === "image") {
    const imgObj = target as fabric.Image;
    const opacity = Math.round((imgObj.opacity || 1) * 100);

    controls = `
      <span class="ds-hud-lbl">Opacity</span>
      <input type="range" min="10" max="100" class="ds-hud-slider" data-prop="opacity" value="${opacity}">
      <button class="ds-hud-btn" data-action="flipX" title="Flip Horizontal">⇄ H</button>
      <button class="ds-hud-btn" data-action="flipY" title="Flip Vertical">⇅ V</button>
      <button class="ds-hud-btn" data-action="mask" style="background:#7c3aed;color:#fff;font-weight:bold" title="Clip/Mask to Frame">☉ Mask</button>
    `;
  } else {
    // Normal Shape
    const fill = typeof target.fill === "string" ? target.fill : "#4a90e2";
    const opacity = Math.round((target.opacity || 1) * 100);

    controls = `
      <input type="color" class="ds-hud-color" data-prop="fill" value="${normalizeHex(fill)}" title="Fill Color">
      <span class="ds-hud-lbl">Opacity</span>
      <input type="range" min="10" max="100" class="ds-hud-slider" data-prop="opacity" value="${opacity}">
      <button class="ds-hud-btn" data-action="layer-up" title="Bring Forward">↑</button>
      <button class="ds-hud-btn" data-action="layer-down" title="Send Backward">↓</button>
    `;
  }

  return `<div class="ds-hud-content">${controls}${commonTail}</div>`;
}

function normalizeHex(color: string): string {
  if (color.startsWith("#") && color.length === 7) return color;
  if (color.startsWith("#") && color.length === 4) {
    return "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  }
  // fallback for rgb or transparent
  return "#4a90e2";
}

function bindHUDEvents(canvas: fabric.Canvas, target: fabric.Object) {
  if (!hudElement) return;

  const pushHistory = () => {
    if (window.FB && window.FB.design && window.FB.design.history) {
      window.FB.design.history.push();
    }
  };

  // 1. Value properties (inputs, select, color pickers)
  const select = hudElement.querySelector("select[data-prop]");
  if (select) {
    select.addEventListener("change", (e) => {
      const val = (e.target as HTMLSelectElement).value;
      const prop = select.getAttribute("data-prop")!;
      
      // If font family changes, load it dynamically
      if (prop === "fontFamily" && window.FB && window.FB.design && window.FB.design.props && window.FB.design.props.loadDynamicFont) {
        window.FB.design.props.loadDynamicFont(val).then(() => {
          target.set(prop, val);
          canvas.renderAll();
          pushHistory();
        });
      } else {
        target.set(prop, val);
        canvas.renderAll();
        pushHistory();
      }
    });
  }

  const colorInput = hudElement.querySelector("input[type='color'][data-prop]");
  if (colorInput) {
    colorInput.addEventListener("input", (e) => {
      const val = (e.target as HTMLInputElement).value;
      const prop = colorInput.getAttribute("data-prop")!;
      target.set(prop, val);
      canvas.renderAll();
    });
    colorInput.addEventListener("change", () => {
      pushHistory();
      // Render properties sidebar
      if (window.FB && window.FB.design && window.FB.design.props) {
        window.FB.design.props.render();
      }
    });
  }

  const slider = hudElement.querySelector("input[type='range'][data-prop]");
  if (slider) {
    slider.addEventListener("input", (e) => {
      const val = parseInt((e.target as HTMLInputElement).value) / 100;
      const prop = slider.getAttribute("data-prop")!;
      target.set(prop, val);
      canvas.renderAll();
    });
    slider.addEventListener("change", () => {
      pushHistory();
    });
  }

  // 2. Action buttons
  hudElement.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest("button");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    if (!action) return;

    if (action === "delete") {
      canvas.remove(target);
      canvas.discardActiveObject();
      canvas.renderAll();
      pushHistory();
    } else if (action === "dupe") {
      target.clone((cloned: fabric.Object) => {
        cloned.set({
          left: (target.left || 0) + 20,
          top: (target.top || 0) + 20,
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.renderAll();
        pushHistory();
      });
    } else if (action === "bold") {
      const isBold = target.get("fontWeight") === "bold" || target.get("fontWeight") === 700;
      target.set("fontWeight", isBold ? 400 : "bold");
      btn.classList.toggle("active", !isBold);
      canvas.renderAll();
      pushHistory();
    } else if (action === "italic") {
      const isItalic = target.get("fontStyle") === "italic";
      target.set("fontStyle", isItalic ? "normal" : "italic");
      btn.classList.toggle("active", !isItalic);
      canvas.renderAll();
      pushHistory();
    } else if (action === "underline") {
      const isUnderline = !target.get("underline");
      target.set("underline", isUnderline);
      btn.classList.toggle("active", isUnderline);
      canvas.renderAll();
      pushHistory();
    } else if (action === "font-plus") {
      const curSize = target.get("fontSize") || 32;
      target.set("fontSize", curSize + 4);
      const display = hudElement?.querySelector(".ds-hud-val-display");
      if (display) display.textContent = String(curSize + 4);
      canvas.renderAll();
      pushHistory();
    } else if (action === "font-minus") {
      const curSize = target.get("fontSize") || 32;
      const newSize = Math.max(8, curSize - 4);
      target.set("fontSize", newSize);
      const display = hudElement?.querySelector(".ds-hud-val-display");
      if (display) display.textContent = String(newSize);
      canvas.renderAll();
      pushHistory();
    } else if (action === "flipX") {
      target.set("flipX", !target.get("flipX"));
      canvas.renderAll();
      pushHistory();
    } else if (action === "flipY") {
      target.set("flipY", !target.get("flipY"));
      canvas.renderAll();
      pushHistory();
    } else if (action === "layer-up") {
      canvas.bringForward(target);
      canvas.renderAll();
    } else if (action === "layer-down") {
      canvas.sendBackwards(target);
      canvas.renderAll();
    } else if (action === "mask") {
      // Trigger masking helper
      if (window.FB && window.FB.design && window.FB.design.masking) {
        window.FB.design.masking.promptMask(target);
      }
    }

    // Refresh properties panel
    if (window.FB && window.FB.design && window.FB.design.props) {
      window.FB.design.props.render();
    }
  });
}
