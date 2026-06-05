import { store, subscribe, DesignState } from "./store";
import { initHUD, hideHUD } from "./hud";
import { initMasking, maskImageWithShape, promptMask } from "./masking";
import { loadDynamicFont } from "./font";
import { DeltaHistoryManager } from "./history";
import { VirtualGrid } from "./virtualizer";
import { initDragDropPhysics } from "./dragdrop";
import { generateAIVector, ungroupVector } from "./ai";

// Ensure FB namespace exists globally
const FB = (window as any).FB || {};
(window as any).FB = FB;

// Define local structures matching legacy presets
const PRESETS: Record<string, { w: number; h: number }> = {
  hero: { w: 1920, h: 600 },
  og: { w: 1200, h: 630 },
  card: { w: 800, h: 600 },
  square: { w: 1080, h: 1080 },
  wide: { w: 1920, h: 1080 },
};

const SHAPES = [
  { type: "rect", label: "▬", title: "Rectangle" },
  { type: "rect-rounded", label: "▭", title: "Rounded Rect" },
  { type: "circle", label: "⬤", title: "Circle" },
  { type: "triangle", label: "▲", title: "Triangle" },
  { type: "star", label: "★", title: "Star" },
  { type: "line", label: "—", title: "Line" },
];

const TEXT_PRESETS = [
  { id: "heading", label: "Heading", fontSize: 64, fontWeight: 800, fill: "#ffffff" },
  { id: "subheading", label: "Subheading", fontSize: 36, fontWeight: 600, fill: "#cccccc" },
  { id: "body", label: "Body Text", fontSize: 18, fontWeight: 400, fill: "#767676" },
];

const ICONS = [
  { char: "☰", name: "menu", tags: ["nav"] },
  { char: "✕", name: "close", tags: ["x", "cancel"] },
  { char: "✓", name: "check", tags: ["tick", "done"] },
  { char: "⚙", name: "settings", tags: ["gear"] },
  { char: "★", name: "star", tags: ["favourite"] },
  { char: "✉", name: "email", tags: ["mail"] },
  { char: "→", name: "arrow-right", tags: ["next"] },
  { char: "←", name: "arrow-left", tags: ["back"] },
];

// Helper to escape HTML string
function escapeHtml(s: string) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

// Normalize color helper
function normalizeColorForInput(color: string): string {
  if (!color) return "#000000";
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    return "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  }
  if (/^#[0-9a-f]{8}$/i.test(color)) return color.substring(0, 7);
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10).toString(16).padStart(2, "0");
    const g = parseInt(rgbMatch[2], 10).toString(16).padStart(2, "0");
    const b = parseInt(rgbMatch[3], 10).toString(16).padStart(2, "0");
    return "#" + r + g + b;
  }
  return "#000000";
}

// Main class representing our Design Studio Engine
class DesignStudio {
  public canvas: fabric.Canvas | null = null;
  public history: DeltaHistoryManager | null = null;
  
  private shapesVirtualizer: VirtualGrid<any> | null = null;
  private textsVirtualizer: VirtualGrid<any> | null = null;
  private iconsVirtualizer: VirtualGrid<any> | null = null;
  private designsVirtualizer: VirtualGrid<any> | null = null;

  public init() {
    if (this.canvas) {
      this.canvas.renderAll();
      return;
    }

    // Suppress Fabric textBaseline warnings in development console
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (typeof args[0] === "string" && args[0].indexOf("textBaseline") !== -1) return;
      originalWarn.apply(console, args);
    };

    // Initialize fabric Canvas
    this.canvas = new fabric.Canvas("ds-canvas", {
      backgroundColor: "#ffffff",
      selection: true,
      preserveObjectStacking: true,
    });

    // Initialize sub-modules
    this.history = new DeltaHistoryManager(this.canvas);
    initHUD(this.canvas);
    initMasking(this.canvas);

    // Bind canvas events
    this.bindCanvasEvents();

    // Resize initial preset
    this.applyPreset("blank");

    // Init Sidebar UI Virtualization and Drag/Drop
    this.initSidebarUI();
    this.initDragDrop();

    // Hook up reactive store changes to the UI
    this.bindReactiveUI();

    // Save initial history
    this.history.push();
  }

  private bindCanvasEvents() {
    if (!this.canvas) return;

    // Selection changes update the active selected IDs in the reactive store
    const updateSelection = () => {
      const activeObjects = this.canvas?.getActiveObjects() || [];
      store.selectedIds = activeObjects.map((o: any) => o.id || "");
    };

    this.canvas.on("selection:created", updateSelection);
    this.canvas.on("selection:updated", updateSelection);
    this.canvas.on("selection:cleared", () => {
      store.selectedIds = [];
    });

    this.canvas.on("object:added", () => {
      store.layersCount = this.canvas?.getObjects().length || 0;
      this.history?.push();
    });

    this.canvas.on("object:removed", () => {
      store.layersCount = this.canvas?.getObjects().length || 0;
      this.history?.push();
    });

    this.canvas.on("object:modified", () => {
      this.history?.push();
      this.props.render();
    });

    // Zoom & Pan Wheel handler
    this.canvas.on("mouse:wheel", (opt) => {
      if (!this.canvas) return;
      const delta = opt.e.deltaY;
      let zoom = this.canvas.getZoom();
      zoom *= Math.pow(0.999, delta);
      zoom = Math.min(Math.max(zoom, 0.05), 5);
      this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      
      store.zoom = zoom;

      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    // Drag-panning on Spacebar
    let panning = false;
    let spaceDown = false;
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && FB.design._mode) spaceDown = true;
    });
    document.addEventListener("keyup", (e) => {
      if (e.code === "Space") spaceDown = false;
    });

    this.canvas.on("mouse:down", (opt) => {
      if (spaceDown || opt.e.button === 1) {
        panning = true;
        if (this.canvas) this.canvas.selection = false;
      }
    });

    this.canvas.on("mouse:move", (opt) => {
      if (panning && opt.e.buttons && this.canvas) {
        this.canvas.relativePan({ x: opt.e.movementX, y: opt.e.movementY });
      }
    });

    this.canvas.on("mouse:up", () => {
      panning = false;
      if (this.canvas) {
        this.canvas.selection = store.activeTool === "select";
      }
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (!FB.design._mode || !this.canvas) return;
      
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Delete selected
      if (e.key === "Delete" || e.key === "Backspace") {
        const active = this.canvas.getActiveObjects();
        if (active.length > 0) {
          active.forEach((o) => this.canvas?.remove(o));
          this.canvas.discardActiveObject();
          this.canvas.renderAll();
          this.history?.push();
        }
      }

      // Grouping keys
      if (e.ctrlKey && e.key === "g") {
        e.preventDefault();
        this.groupSelected();
      }
      if (e.ctrlKey && e.shiftKey && e.key === "G") {
        e.preventDefault();
        this.ungroupSelected();
      }

      // Undo/Redo keys
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        this.history?.undo();
      }
      if ((e.ctrlKey && e.key === "y") || (e.ctrlKey && e.shiftKey && e.key === "z")) {
        e.preventDefault();
        this.history?.redo();
      }
    });
  }

  private initSidebarUI() {
    // 1. Shapes virtualizer
    const shapesContainer = document.getElementById("ds-shapes-grid");
    if (shapesContainer) {
      this.shapesVirtualizer = new VirtualGrid({
        container: shapesContainer,
        items: SHAPES,
        itemsPerRow: 3,
        rowHeight: 48,
        renderRow: (rowItems) => {
          const row = document.createElement("div");
          row.style.display = "flex";
          row.style.gap = "4px";
          row.style.marginBottom = "4px";
          rowItems.forEach((item) => {
            const btn = document.createElement("button");
            btn.className = "ds-element-btn block-item";
            btn.title = item.title;
            btn.setAttribute("data-asset", JSON.stringify({ type: "shape", shapeType: item.type }));
            btn.innerHTML = `<span style="font-size:16px">${item.label}</span><span class="block-label" style="display:none">${item.title}</span>`;
            row.appendChild(btn);
          });
          return row;
        },
      });
    }

    // 2. Text presets virtualizer
    const textsContainer = document.getElementById("ds-texts-grid");
    if (textsContainer) {
      this.textsVirtualizer = new VirtualGrid({
        container: textsContainer,
        items: TEXT_PRESETS,
        itemsPerRow: 1,
        rowHeight: 38,
        renderRow: (rowItems) => {
          const row = document.createElement("div");
          rowItems.forEach((item) => {
            const btn = document.createElement("button");
            btn.className = "ds-text-preset-btn block-item";
            btn.style.width = "100%";
            btn.style.textAlign = "left";
            btn.style.padding = "6px 8px";
            btn.style.marginBottom = "4px";
            btn.setAttribute("data-asset", JSON.stringify({ type: "text", fontSize: item.fontSize, fontWeight: item.fontWeight, fill: item.fill, text: item.label }));
            btn.innerHTML = `<span style="font-size:13px; font-weight:${item.fontWeight}">${item.label}</span><span class="block-label" style="display:none">${item.label}</span>`;
            row.appendChild(btn);
          });
          return row;
        },
      });
    }

    // 3. Icons virtualizer
    const iconsContainer = document.getElementById("ds-icons-grid");
    if (iconsContainer) {
      this.renderIcons(iconsContainer);
    }
  }

  private renderIcons(container: HTMLElement) {
    const query = store.iconQuery.toLowerCase().trim();
    const filteredIcons = ICONS.filter((icon) => {
      if (!query) return true;
      return icon.name.includes(query) || icon.tags.some(t => t.includes(query));
    });

    if (this.iconsVirtualizer) {
      this.iconsVirtualizer.destroy();
    }

    this.iconsVirtualizer = new VirtualGrid({
      container,
      items: filteredIcons,
      itemsPerRow: 4,
      rowHeight: 40,
      renderRow: (rowItems) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.gap = "4px";
        row.style.marginBottom = "4px";
        rowItems.forEach((item) => {
          const btn = document.createElement("button");
          btn.className = "ds-icon-btn block-item";
          btn.title = item.name;
          btn.setAttribute("data-asset", JSON.stringify({ type: "icon", char: item.char, name: item.name }));
          btn.innerHTML = `<span style="font-size:16px">${item.char}</span><span class="block-label" style="display:none">${item.name}</span>`;
          row.appendChild(btn);
        });
        return row;
      },
    });
  }

  private initDragDrop() {
    if (!this.canvas) return;

    // Initialize physics drag and drop for sidebar assets
    initDragDropPhysics({
      canvas: this.canvas,
      tileSelector: ".ds-element-btn, .ds-text-preset-btn, .ds-icon-btn",
      onDrop: (assetData, x, y) => {
        if (!this.canvas) return;

        if (assetData.type === "shape") {
          this.insertShape(assetData.shapeType, x, y);
        } else if (assetData.type === "text") {
          const text = new fabric.IText(assetData.text, {
            left: x,
            top: y,
            fontSize: assetData.fontSize,
            fontWeight: assetData.fontWeight,
            fill: assetData.fill,
            fontFamily: "Lexend",
            originX: "center",
            originY: "center",
          });
          this.canvas.add(text);
          this.canvas.setActiveObject(text);
          this.canvas.renderAll();
          this.history?.push();
        } else if (assetData.type === "icon") {
          const iconText = new fabric.IText(assetData.char, {
            left: x,
            top: y,
            fontSize: 48,
            fill: "#CDFE00",
            fontFamily: "Lexend",
            originX: "center",
            originY: "center",
          });
          this.canvas.add(iconText);
          this.canvas.setActiveObject(iconText);
          this.canvas.renderAll();
          this.history?.push();
        }
      },
    });
  }

  private insertShape(shapeType: string, x: number, y: number) {
    if (!this.canvas) return;

    let shapeObj: fabric.Object;
    const defaults = {
      left: x,
      top: y,
      fill: "#CDFE00",
      originX: "center",
      originY: "center",
    };

    if (shapeType === "circle") {
      shapeObj = new fabric.Circle({ ...defaults, radius: 40 });
    } else if (shapeType === "triangle") {
      shapeObj = new fabric.Triangle({ ...defaults, width: 80, height: 80 });
    } else if (shapeType === "star") {
      // Star polygon shape
      shapeObj = new fabric.Polygon(
        [
          { x: 0, y: -40 },
          { x: 10, y: -10 },
          { x: 40, y: -10 },
          { x: 15, y: 10 },
          { x: 25, y: 40 },
          { x: 0, y: 20 },
          { x: -25, y: 40 },
          { x: -15, y: 10 },
          { x: -40, y: -10 },
          { x: -10, y: -10 },
        ],
        defaults
      );
    } else if (shapeType === "line") {
      shapeObj = new fabric.Line([x - 40, y, x + 40, y], {
        left: x,
        top: y,
        stroke: "#CDFE00",
        strokeWidth: 4,
        originX: "center",
        originY: "center",
      });
    } else {
      // Default: Rectangle
      shapeObj = new fabric.Rect({
        ...defaults,
        width: 80,
        height: 80,
        rx: shapeType === "rect-rounded" ? 12 : 0,
        ry: shapeType === "rect-rounded" ? 12 : 0,
      });
    }

    this.canvas.add(shapeObj);
    this.canvas.setActiveObject(shapeObj);
    this.canvas.renderAll();
    this.history?.push();
  }

  private bindReactiveUI() {
    subscribe((state, key, value) => {
      // Handle zoom changes
      if (key === "zoom" && this.canvas) {
        this.canvas.setZoom(value);
        const label = document.getElementById("ds-zoom-label");
        if (label) label.textContent = `${Math.round(value * 100)}%`;
        this.canvas.renderAll();
      }

      // Handle selection changes
      if (key === "selectedIds") {
        this.props.render();
        this.align.renderPanel();
        
        // Render layers
        if (window.FB && window.FB.panels && window.FB.panels.renderLayers) {
          window.FB.panels.renderLayers();
        }
      }

      // Icon Query updates search virtual list
      if (key === "iconQuery") {
        const container = document.getElementById("ds-icons-grid");
        if (container) {
          this.renderIcons(container);
        }
      }
    });
  }

  public applyPreset(key: string) {
    if (!this.canvas) return;

    if (key === "custom") {
      const w = parseInt(prompt("Width in px:", "800") || "800", 10) || 800;
      const h = parseInt(prompt("Height in px:", "600") || "600", 10) || 600;
      this.resizeTo(w, h);
      return;
    }

    const p = PRESETS[key] || { w: 1200, h: 630 };
    this.resizeTo(p.w, p.h);
    const select = document.getElementById("ds-preset-select") as HTMLSelectElement;
    if (select) select.value = key;
  }

  private resizeTo(w: number, h: number) {
    if (!this.canvas) return;

    const wrap = document.getElementById("ds-canvas-wrap");
    const maxW = Math.max((wrap?.clientWidth || 800) - 40, 200);
    const maxH = Math.max((wrap?.clientHeight || 600) - 40, 200);
    let scale = Math.min(1, maxW / w, maxH / h);
    scale = Math.max(scale, 0.05);

    this.canvas.setWidth(w);
    this.canvas.setHeight(h);
    this.canvas.setZoom(scale);

    if (this.canvas.wrapperEl) {
      this.canvas.wrapperEl.style.width = `${Math.round(w * scale)}px`;
      this.canvas.wrapperEl.style.height = `${Math.round(h * scale)}px`;
    }

    const sizeLabel = document.getElementById("ds-size-label");
    if (sizeLabel) sizeLabel.textContent = `${w} × ${h}`;
    
    const zoomLabel = document.getElementById("ds-zoom-label");
    if (zoomLabel) zoomLabel.textContent = `${Math.round(scale * 100)}%`;

    store.width = w;
    store.height = h;
    store.zoom = scale;

    this.canvas.renderAll();
  }

  public resize() {
    if (this.canvas) {
      this.resizeTo(store.width, store.height);
    }
  }

  // Group / Ungroup
  public groupSelected() {
    if (!this.canvas) return;
    const active = this.canvas.getActiveObject();
    if (!active || active.type !== "activeSelection") return;

    const activeSel = active as fabric.ActiveSelection;
    activeSel.toGroup();
    this.canvas.renderAll();
    this.history?.push();
  }

  public ungroupSelected() {
    if (!this.canvas) return;
    const active = this.canvas.getActiveObject();
    if (!active) return;

    if (active.type === "group") {
      const grp = active as fabric.Group;
      if (grp.name === "AI Generative Vector Group") {
        ungroupVector(this.canvas, grp);
      } else {
        grp.toActiveSelection();
        this.canvas.renderAll();
        this.history?.push();
      }
    }
  }

  // Legacy compatibility helpers mapping
  public _loadAssets() {
    fetch("/api/designs")
      .then((r) => r.json())
      .then((list) => {
        const el = document.getElementById("ds-assets-designs");
        if (!el) return;

        if (this.designsVirtualizer) {
          this.designsVirtualizer.destroy();
        }

        this.designsVirtualizer = new VirtualGrid({
          container: el,
          items: list,
          itemsPerRow: 2,
          rowHeight: 80,
          renderRow: (rowItems) => {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.gap = "6px";
            row.style.marginBottom = "6px";
            rowItems.forEach((d) => {
              const div = document.createElement("div");
              div.className = "ds-builder-thumb";
              div.setAttribute("title", d.name);
              div.onclick = () => this.library.loadDesign(d.slug);
              div.innerHTML = `
                ${d.thumbnail ? `<img src="${escapeHtml(d.thumbnail)}" alt="${escapeHtml(d.name)}">` : '<div style="height:60px;background:#1a1a2a"></div>'}
                <div class="ds-builder-thumb-label">${escapeHtml(d.name)}</div>
              `;
              row.appendChild(div);
            });
            return row;
          },
        });
      })
      .catch((err) => console.error(err));
  }

  // Sub-modules compatibility APIs
  public props = {
    render: () => {
      const el = document.getElementById("ds-props");
      if (!el || !this.canvas) return;

      const obj = this.canvas.getActiveObject();
      if (!obj) {
        // Render Canvas property panel
        const bg = typeof this.canvas.backgroundColor === "string" ? this.canvas.backgroundColor : "#ffffff";
        const bgNormalized = normalizeColorForInput(bg);

        el.innerHTML = `
          <div class="ds-prop-group">
            <div class="ds-prop-label">Canvas Background</div>
            <div class="ds-prop-row">
              <input id="ds-bg-color" type="color" class="ds-color-swatch" value="${bgNormalized}">
              <input id="ds-bg-hex" class="ds-input" style="flex:1" value="${escapeHtml(bg)}">
            </div>
          </div>
        `;

        // Bind events
        const bgCol = el.querySelector("#ds-bg-color") as HTMLInputElement;
        const bgHex = el.querySelector("#ds-bg-hex") as HTMLInputElement;

        const updateBg = (colorVal: string) => {
          this.canvas?.setBackgroundColor(colorVal, () => {
            this.canvas?.renderAll();
            this.history?.push();
          });
        };

        bgCol?.addEventListener("input", (e) => {
          const val = (e.target as HTMLInputElement).value;
          if (bgHex) bgHex.value = val;
          updateBg(val);
        });

        bgHex?.addEventListener("change", (e) => {
          const val = (e.target as HTMLInputElement).value;
          updateBg(val);
        });
        return;
      }

      // Render object action bar
      const isGroup = obj.type === "group";
      const isAI = isGroup && (obj as any).name === "AI Generative Vector Group";
      let markup = `
        <div class="ds-action-bar" style="margin-bottom: 12px; display:flex; gap:6px;">
          <button id="ds-dupe-btn" class="ds-action-btn" title="Duplicate">⧉ Dupe</button>
          <button id="ds-del-btn" class="ds-action-btn ds-action-danger" title="Delete">🗑 Del</button>
          ${isAI ? `<button id="ds-ungroup-btn" class="ds-action-btn" style="background:#7c3aed;color:#fff" title="Ungroup SVG paths">⊟ Ungroup SVG</button>` : ""}
          ${isGroup && !isAI ? `<button id="ds-ungroup-btn" class="ds-action-btn" title="Ungroup">⊟ Ungroup</button>` : ""}
          {!isGroup && !isAI ? '<button id="ds-group-btn" class="ds-action-btn" title="Group">⊞ Group</button>' : ""}
        </div>
      `;

      // Render details based on selection type
      if (obj.type === "i-text") {
        const textObj = obj as fabric.IText;
        const fillNormalized = normalizeColorForInput(typeof textObj.fill === "string" ? textObj.fill : "#000000");

        markup += `
          <div class="ds-prop-group">
            <div class="ds-prop-label">Text Options</div>
            <div class="ds-prop-row">
              <label style="flex:1">Font size
                <input id="ds-text-size" type="number" class="ds-input" value="${textObj.fontSize || 32}">
              </label>
              <label style="width: 50px">Color
                <input id="ds-text-color" type="color" class="ds-color-swatch" value="${fillNormalized}">
              </label>
            </div>
            <div class="ds-prop-row" style="margin-top:8px">
              <label style="flex:1">Font Family
                <select id="ds-text-font" class="ds-select">
                  <option value="Lexend" ${textObj.fontFamily === "Lexend" ? "selected" : ""}>Lexend</option>
                  <option value="Inter" ${textObj.fontFamily === "Inter" ? "selected" : ""}>Inter</option>
                  <option value="Roboto" ${textObj.fontFamily === "Roboto" ? "selected" : ""}>Roboto</option>
                  <option value="Playfair Display" ${textObj.fontFamily === "Playfair Display" ? "selected" : ""}>Playfair</option>
                  <option value="Bebas Neue" ${textObj.fontFamily === "Bebas Neue" ? "selected" : ""}>Bebas Neue</option>
                </select>
              </label>
            </div>
          </div>
        `;
      } else if (obj.type === "image") {
        const imgObj = obj as fabric.Image;
        markup += `
          <div class="ds-prop-group">
            <div class="ds-prop-label">Image Options</div>
            <div class="ds-prop-row">
              <label style="flex:1">Opacity
                <input id="ds-img-opacity" type="range" min="10" max="100" class="ds-slider" value="${Math.round((imgObj.opacity || 1) * 100)}">
              </label>
            </div>
            <button id="ds-mask-btn" class="ds-btn" style="width:100%;margin-top:8px;background:#7c3aed;color:#fff">☉ Mask to Shape</button>
          </div>
        `;
      } else {
        const fillNormalized = normalizeColorForInput(typeof obj.fill === "string" ? obj.fill : "#CDFE00");
        markup += `
          <div class="ds-prop-group">
            <div class="ds-prop-label">Shape Options</div>
            <div class="ds-prop-row">
              <label style="flex:1">Fill Color
                <input id="ds-shape-color" type="color" class="ds-color-swatch" value="${fillNormalized}">
              </label>
              <label style="flex:1">Opacity
                <input id="ds-shape-opacity" type="range" min="10" max="100" class="ds-slider" value="${Math.round((obj.opacity || 1) * 100)}">
              </label>
            </div>
          </div>
        `;
      }

      el.innerHTML = markup;

      // Event bindings for properties panel controls
      el.querySelector("#ds-dupe-btn")?.addEventListener("click", () => {
        this.props.duplicate();
      });

      el.querySelector("#ds-del-btn")?.addEventListener("click", () => {
        this.props.deleteSelected();
      });

      el.querySelector("#ds-ungroup-btn")?.addEventListener("click", () => {
        this.ungroupSelected();
      });

      el.querySelector("#ds-group-btn")?.addEventListener("click", () => {
        this.groupSelected();
      });

      // Text properties event listeners
      const textFont = el.querySelector("#ds-text-font") as HTMLSelectElement;
      textFont?.addEventListener("change", () => {
        const val = textFont.value;
        loadDynamicFont(val).then(() => {
          obj.set("fontFamily", val);
          this.canvas?.renderAll();
          this.history?.push();
        });
      });

      const textSize = el.querySelector("#ds-text-size") as HTMLInputElement;
      textSize?.addEventListener("change", () => {
        obj.set("fontSize", parseInt(textSize.value, 10) || 12);
        this.canvas?.renderAll();
        this.history?.push();
      });

      const textColor = el.querySelector("#ds-text-color") as HTMLInputElement;
      textColor?.addEventListener("change", () => {
        obj.set("fill", textColor.value);
        this.canvas?.renderAll();
        this.history?.push();
      });

      // Image property listeners
      const imgOpacity = el.querySelector("#ds-img-opacity") as HTMLInputElement;
      imgOpacity?.addEventListener("input", () => {
        obj.set("opacity", parseInt(imgOpacity.value, 10) / 100);
        this.canvas?.renderAll();
      });
      imgOpacity?.addEventListener("change", () => {
        this.history?.push();
      });

      el.querySelector("#ds-mask-btn")?.addEventListener("click", () => {
        promptMask(obj);
      });

      // Shape property listeners
      const shapeColor = el.querySelector("#ds-shape-color") as HTMLInputElement;
      shapeColor?.addEventListener("change", () => {
        obj.set("fill", shapeColor.value);
        this.canvas?.renderAll();
        this.history?.push();
      });

      const shapeOpacity = el.querySelector("#ds-shape-opacity") as HTMLInputElement;
      shapeOpacity?.addEventListener("input", () => {
        obj.set("opacity", parseInt(shapeOpacity.value, 10) / 100);
        this.canvas?.renderAll();
      });
      shapeOpacity?.addEventListener("change", () => {
        this.history?.push();
      });
    },
    loadDynamicFont,
    setCanvasBg: (val: string) => {
      this.canvas?.setBackgroundColor(val, () => {
        this.canvas?.renderAll();
        this.history?.push();
      });
    },
    setProp: (key: string, val: any) => {
      if (!this.canvas) return;
      const active = this.canvas.getActiveObject();
      if (!active) return;
      active.set(key as any, val);
      active.setCoords();
      this.canvas.renderAll();
      this.history?.push();
      this.props.render();
    },
    toggleBold: () => {
      if (!this.canvas) return;
      const active = this.canvas.getActiveObject();
      if (!active || active.type !== "i-text") return;
      const isBold = active.get("fontWeight") === "bold" || active.get("fontWeight") === 700;
      active.set("fontWeight", isBold ? 400 : "bold");
      this.canvas.renderAll();
      this.history?.push();
      this.props.render();
    },
    toggleShadow: () => {
      if (!this.canvas) return;
      const active = this.canvas.getActiveObject();
      if (!active) return;
      if (active.shadow) {
        active.shadow = null as any;
      } else {
        active.shadow = new fabric.Shadow({
          color: "rgba(0,0,0,0.3)",
          blur: 10,
          offsetX: 4,
          offsetY: 4
        });
      }
      this.canvas.renderAll();
      this.history?.push();
      this.props.render();
    },
    setShadow: (key: string, val: any) => {
      if (!this.canvas) return;
      const active = this.canvas.getActiveObject();
      if (!active) return;
      if (!active.shadow) {
        active.shadow = new fabric.Shadow({
          color: "rgba(0,0,0,0.3)",
          blur: 10,
          offsetX: 4,
          offsetY: 4
        });
      }
      (active.shadow as any)[key] = val;
      this.canvas.renderAll();
      this.history?.push();
      this.props.render();
    },
    flip: (dir: "X" | "Y") => {
      if (!this.canvas) return;
      const active = this.canvas.getActiveObject();
      if (!active) return;
      const key = `flip${dir}` as "flipX" | "flipY";
      active.set(key, !active.get(key));
      this.canvas.renderAll();
      this.history?.push();
      this.props.render();
    },
    duplicate: () => {
      if (!this.canvas) return;
      const active = this.canvas.getActiveObject();
      if (!active) return;
      active.clone((cloned: fabric.Object) => {
        cloned.set({
          left: (active.left || 0) + 20,
          top: (active.top || 0) + 20,
        });
        this.canvas?.add(cloned);
        this.canvas?.setActiveObject(cloned);
        this.canvas?.renderAll();
        this.history?.push();
      });
    },
    deleteSelected: () => {
      if (!this.canvas) return;
      const active = this.canvas.getActiveObjects();
      if (active.length > 0) {
        active.forEach((o) => this.canvas?.remove(o));
        this.canvas.discardActiveObject();
        this.canvas.renderAll();
        this.history?.push();
      }
    }
  };

  public align = {
    renderPanel: () => {
      const el = document.getElementById("ds-tab-align");
      if (!el) return;
      el.innerHTML = `
        <div style="padding:12px; display:flex; flex-direction:column; gap:8px;">
          <div class="ds-prop-label">Alignment</div>
          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
            <button class="ds-btn" onclick="FB.design.align.run('left')">Align Left</button>
            <button class="ds-btn" onclick="FB.design.align.run('centerH')">Center Horiz</button>
            <button class="ds-btn" onclick="FB.design.align.run('right')">Align Right</button>
            <button class="ds-btn" onclick="FB.design.align.run('top')">Align Top</button>
            <button class="ds-btn" onclick="FB.design.align.run('centerV')">Center Vert</button>
            <button class="ds-btn" onclick="FB.design.align.run('bottom')">Align Bottom</button>
          </div>
          <div class="ds-prop-label" style="margin-top:12px">Layers depth</div>
          <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
            <button class="ds-btn" onclick="FB.design.align.run('bringForward')">Forward</button>
            <button class="ds-btn" onclick="FB.design.align.run('sendBack')">Backward</button>
          </div>
        </div>
      `;
    },
    run: (action: string) => {
      if (!this.canvas) return;
      const objs = this.canvas.getActiveObjects();
      if (!objs.length) return;
      
      const cW = this.canvas.getWidth();
      const cH = this.canvas.getHeight();

      objs.forEach((obj) => {
        const w = obj.getScaledWidth();
        const h = obj.getScaledHeight();
        if (action === "left") obj.set("left", 0);
        if (action === "centerH") obj.set("left", cW / 2 - w / 2);
        if (action === "right") obj.set("left", cW - w);
        if (action === "top") obj.set("top", 0);
        if (action === "centerV") obj.set("top", cH / 2 - h / 2);
        if (action === "bottom") obj.set("top", cH - h);
        if (action === "bringForward") this.canvas?.bringForward(obj);
        if (action === "sendBack") this.canvas?.sendBackwards(obj);
        
        obj.setCoords();
      });

      this.canvas.renderAll();
      this.history?.push();
    },
  };

  public tools = {
    active: () => store.activeTool,
    setTool: (toolId: string) => {
      store.activeTool = toolId;
      if (!this.canvas) return;
      this.canvas.isDrawingMode = false;
      this.canvas.selection = toolId === "select";
      this.canvas.defaultCursor = toolId === "select" ? "default" : "crosshair";

      // If text tool is chosen, let clicking canvas place text
      if (toolId === "text") {
        const handleTextClick = (opt: any) => {
          if (!this.canvas || store.activeTool !== "text") return;
          
          // Clean up click listener
          this.canvas.off("mouse:down", handleTextClick);

          const pointer = this.canvas.getPointer(opt.e);
          const text = new fabric.IText("Your Text", {
            left: pointer.x,
            top: pointer.y,
            fontSize: 32,
            fontFamily: "Lexend",
            fill: "#ffffff",
          });

          this.canvas.add(text);
          this.canvas.setActiveObject(text);
          this.canvas.renderAll();
          this.history?.push();

          // Set back to selection mode
          this.tools.setTool("select");
        };

        this.canvas.on("mouse:down", handleTextClick);
      }

      if (toolId === "image") {
        this.triggerImageUpload();
      }

      // Update elements tab panel toolbar styles
      document.querySelectorAll(".ds-tool-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.getAttribute("data-tool") === toolId);
      });
    },
    bindMouseDraw: () => {},
  };

  private triggerImageUpload() {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "image/*";
    inp.onchange = () => {
      const file = inp.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        fabric.Image.fromURL(ev.target?.result as string, (img) => {
          if (!this.canvas) return;
          const maxW = this.canvas.getWidth() * 0.5;
          if ((img.width || 0) > maxW) img.scaleToWidth(maxW);
          
          img.set({
            left: this.canvas.getWidth() / 2 - img.getScaledWidth() / 2,
            top: this.canvas.getHeight() / 2 - img.getScaledHeight() / 2,
            name: "Uploaded Image",
          });

          this.canvas.add(img);
          this.canvas.setActiveObject(img);
          this.canvas.renderAll();
          this.history?.push();
          this.tools.setTool("select");
        });
      };
      reader.readAsDataURL(file);
    };
    inp.click();
  }

  // Design saving and loading CRUD integration
  public library = {
    save: () => {
      if (!this.canvas) return;
      const name = prompt("Design Name:", store.currentName) || "Untitled Design";
      
      const staticCanvas = new fabric.StaticCanvas(null, {
        width: this.canvas.getWidth(),
        height: this.canvas.getHeight(),
      });

      // Copy objects
      const dataJson = this.canvas.toJSON(["id", "name", "clipPath", "absolutePositioned", "subTargetCheck", "src"]);
      
      staticCanvas.loadFromJSON(dataJson, () => {
        const dataUrl = staticCanvas.toDataURL({ format: "png", multiplier: 0.5 });
        staticCanvas.dispose();

        fetch("/api/designs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            width: this.canvas?.getWidth(),
            height: this.canvas?.getHeight(),
            thumbnail: dataUrl,
            fabric: dataJson,
          }),
        })
          .then((r) => r.json())
          .then((res) => {
            if (res.ok) {
              store.currentName = name;
              if (window.FB && window.FB.util && window.FB.util.showToast) {
                window.FB.util.showToast("Saved design successfully!");
              }
              this._loadAssets();
            } else {
              alert("Error saving design: " + res.error);
            }
          })
          .catch((err) => {
            console.error("Save design error", err);
            alert("Failed to save design. Backend server issue.");
          });
      });
    },

    loadDesign: (slug: string) => {
      if (!this.canvas) return;
      
      if (window.FB && window.FB.util && window.FB.util.showToast) {
        window.FB.util.showToast("Loading design...");
      }

      fetch(`/api/designs/${slug}`)
        .then((r) => r.json())
        .then((data) => {
          if (!this.canvas) return;

          this.history?.clear();
          
          this.canvas.loadFromJSON(data.fabric, () => {
            this.canvas?.renderAll();
            
            store.currentName = data.name;
            this.applyPreset(data.preset || "custom");
            this.resizeTo(data.width || 800, data.height || 600);

            // Re-bind objects IDs just in case
            this.canvas?.forEachObject((obj) => {
              if (!obj.get("id")) {
                obj.set("id", `obj_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`);
              }
            });

            this.history?.clear();
            this.history?.push();

            if (window.FB && window.FB.util && window.FB.util.showToast) {
              window.FB.util.showToast(`Loaded: ${data.name}`);
            }
          });
        })
        .catch((err) => {
          console.error("Load design error", err);
          alert("Error loading design from server.");
        });
    },
  };

  // AI tools
  public ai = {
    initEvents: () => {
      const generateBtn = document.getElementById("ds-ai-generate");
      const promptInput = document.getElementById("ds-ai-prompt") as HTMLInputElement;
      const statusText = document.getElementById("ds-ai-status");

      if (generateBtn && promptInput && statusText) {
        generateBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const prompt = promptInput.value.trim();
          if (!prompt) return;
          if (this.canvas) {
            generateAIVector(this.canvas, prompt, statusText);
          }
        });
      }
    },
  };

  // Elements panel rendering (renders categories and search input)
  public elements = {
    render: () => {
      // Binds search event to element input
      const searchInput = document.getElementById("ds-element-search") as HTMLInputElement;
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          store.iconQuery = (e.target as HTMLInputElement).value;
        });
      }
    },
    _renderToolRow: () => {},
  };

  // Properties wrappers mapping to fit window.FB
  public normalizeColorForInput = normalizeColorForInput;
  public _esc = escapeHtml;
  public _mode = false;
  
  public get() {
    return this.canvas;
  }
}

// Instantiate engine instance and assign it to FB.design
const studio = new DesignStudio();
FB.design = studio;
export default studio;
export { store, subscribe };
