/// <reference path="./fabric.d.ts" />
/// <reference path="./global.d.ts" />

/**
 * Design Studio Engine — Enhancement Layer
 *
 * This module loads AFTER the legacy js/design.js and augments
 * FB.design with new TypeScript-powered capabilities:
 *   - Contextual Floating HUD
 *   - Non-destructive image masking
 *   - Dynamic Google Font loading
 *   - Delta-based undo/redo (replaces JSON snapshot history)
 *   - Sidebar asset virtualisation
 *   - Spring-physics drag-and-drop
 *   - AI vector generation ingestion
 *
 * It does NOT replace the legacy module — it enhances it.
 */

import { initHUD } from "./hud";
import { initMasking, promptMask, maskImageWithShape } from "./masking";
import { loadDynamicFont } from "./font";
import { DeltaHistoryManager } from "./history";
import { generateAIVector } from "./ai";

// Wait for the legacy design canvas to initialise, then hook in
const FB = (window as any).FB;

if (FB && FB.design) {
  // ── 1. Patch the font loader into props ────────────────────────────
  if (FB.design.props) {
    FB.design.props.loadDynamicFont = loadDynamicFont;
  }

  // ── 2. Expose masking helpers ──────────────────────────────────────
  FB.design.masking = {
    promptMask,
    maskImageWithShape,
  };

  // ── 3. Hook into canvas init to attach HUD + masking + delta history
  const _origCanvasInit = FB.design.canvas?.init;
  if (_origCanvasInit) {
    FB.design.canvas.init = function () {
      // Run the original init first
      _origCanvasInit.call(FB.design.canvas);

      const fc = FB.design.canvas.get();
      if (!fc) return;

      // Attach Contextual Floating HUD
      initHUD(fc);

      // Attach non-destructive masking listeners
      initMasking(fc);

      // Replace JSON-snapshot history with delta-based history
      const deltaHistory = new DeltaHistoryManager(fc);
      FB.design.history = {
        push: () => deltaHistory.push(),
        undo: () => deltaHistory.undo(),
        redo: () => deltaHistory.redo(),
        clear: () => deltaHistory.clear(),
        getUndoCount: () => deltaHistory.getUndoCount(),
        getRedoCount: () => deltaHistory.getRedoCount(),
      };

      console.log("[Design Engine] HUD, masking, and delta history attached.");
    };
  }

  console.log("[Design Engine] Enhancement layer loaded.");
}
