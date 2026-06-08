/**
 * Global type declarations for the Veltro Create runtime.
 *
 * window.FB is created by the legacy JS modules loaded before our
 * TypeScript design engine. These declarations let TS modules safely
 * reference FB.design, FB.util, FB.panels, etc.
 */

interface FBDesign {
  _mode: boolean;
  canvas: {
    get: () => fabric.Canvas | null;
    init: () => void;
    resize: () => void;
    group: () => void;
    ungroup: () => void;
    [key: string]: any;
  };
  history: {
    push: () => void;
    undo: () => void;
    redo: () => void;
    clear: () => void;
    [key: string]: any;
  };
  props: {
    render: () => void;
    loadDynamicFont: (family: string) => Promise<void>;
    setCanvasBg: (val: string) => void;
    setProp: (key: string, val: any) => void;
    toggleBold: () => void;
    toggleShadow: () => void;
    setShadow: (key: string, val: any) => void;
    flip: (dir: "X" | "Y") => void;
    duplicate: () => void;
    deleteSelected: () => void;
    [key: string]: any;
  };
  tools: {
    active: () => string;
    setTool: (id: string) => void;
    bindMouseDraw: () => void;
    [key: string]: any;
  };
  elements: {
    render: () => void;
    _renderToolRow: () => void;
    [key: string]: any;
  };
  align: {
    renderPanel: () => void;
    run: (action: string) => void;
    [key: string]: any;
  };
  layers: {
    render: () => void;
    [key: string]: any;
  };
  library: {
    save: () => void;
    loadDesign: (slug: string) => void;
    [key: string]: any;
  };
  masking: {
    promptMask: (target: fabric.Object) => void;
    maskImageWithShape: (canvas: fabric.Canvas, image: fabric.Image, mask: fabric.Object) => void;
    [key: string]: any;
  };
  normalizeColorForInput: (color: string) => string;
  _esc: (s: string) => string;
  _loadAssets: () => void;
  renderExportTab: () => void;
  switchLeftTab: (tab: string) => void;
  switchRightTab: (tab: string) => void;
  [key: string]: any;
}

interface FBUtil {
  showToast: (msg: string) => void;
  [key: string]: any;
}

interface FBPanels {
  setMode: (mode: string) => void;
  updateUndoRedo: () => void;
  renderLayers: () => void;
  [key: string]: any;
}

interface FBGlobal {
  design: FBDesign;
  util: FBUtil;
  panels: FBPanels;
  [key: string]: any;
}

declare interface Window {
  FB: FBGlobal;
}
