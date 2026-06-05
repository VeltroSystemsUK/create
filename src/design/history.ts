interface CanvasSnapshot {
  objects: Record<string, any>;
  canvas: {
    backgroundColor: string;
    width: number;
    height: number;
  };
}

interface DeltaPatch {
  added: any[];
  removed: string[];
  updated: Record<string, any>;
  canvas: any;
}

interface HistoryEntry {
  undoPatch: DeltaPatch;
  redoPatch: DeltaPatch;
}

export class DeltaHistoryManager {
  private canvas: fabric.Canvas;
  private undoStack: HistoryEntry[] = [];
  private redoStack: HistoryEntry[] = [];
  private lastSnapshot: CanvasSnapshot | null = null;
  private isApplying = false;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this.saveInitialState();
  }

  private saveInitialState() {
    this.lastSnapshot = this.takeSnapshot();
  }

  private takeSnapshot(): CanvasSnapshot {
    const snapObjects: Record<string, any> = {};
    
    this.canvas.forEachObject((obj) => {
      // Ensure every object has an ID
      if (!obj.get("id")) {
        obj.set("id", `obj_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`);
      }
      
      const id = obj.get("id");
      snapObjects[id] = obj.toObject([
        "id",
        "name",
        "clipPath",
        "absolutePositioned",
        "subTargetCheck",
        "src",
        "rx",
        "ry",
      ]);
    });

    const bg = this.canvas.backgroundColor;
    const bgStr = typeof bg === "string" ? bg : "#ffffff";

    return {
      objects: snapObjects,
      canvas: {
        backgroundColor: bgStr,
        width: this.canvas.getWidth(),
        height: this.canvas.getHeight(),
      },
    };
  }

  public push() {
    if (this.isApplying || !this.lastSnapshot) return;

    const currentSnapshot = this.takeSnapshot();
    const redoPatch = this.computeDelta(this.lastSnapshot, currentSnapshot);
    const undoPatch = this.computeDelta(currentSnapshot, this.lastSnapshot);

    // If nothing changed, do not push
    const hasChanges =
      redoPatch.added.length > 0 ||
      redoPatch.removed.length > 0 ||
      Object.keys(redoPatch.updated).length > 0 ||
      redoPatch.canvas !== null;

    if (hasChanges) {
      this.undoStack.push({ undoPatch, redoPatch });
      this.redoStack = []; // Clear redo stack on new action
      this.lastSnapshot = currentSnapshot;

      // Update global UI panels count if present
      if (window.FB && window.FB.panels && window.FB.panels.updateUndoRedo) {
        window.FB.panels.updateUndoRedo();
      }
    }
  }

  public undo() {
    if (this.undoStack.length === 0 || this.isApplying) return;
    
    const entry = this.undoStack.pop()!;
    this.isApplying = true;

    this.applyPatch(entry.undoPatch, () => {
      this.redoStack.push(entry);
      this.lastSnapshot = this.takeSnapshot();
      this.isApplying = false;
      this.canvas.renderAll();

      if (window.FB && window.FB.panels && window.FB.panels.updateUndoRedo) {
        window.FB.panels.updateUndoRedo();
      }
    });
  }

  public redo() {
    if (this.redoStack.length === 0 || this.isApplying) return;

    const entry = this.redoStack.pop()!;
    this.isApplying = true;

    this.applyPatch(entry.redoPatch, () => {
      this.undoStack.push(entry);
      this.lastSnapshot = this.takeSnapshot();
      this.isApplying = false;
      this.canvas.renderAll();

      if (window.FB && window.FB.panels && window.FB.panels.updateUndoRedo) {
        window.FB.panels.updateUndoRedo();
      }
    });
  }

  private computeDelta(snapA: CanvasSnapshot, snapB: CanvasSnapshot): DeltaPatch {
    const added: any[] = [];
    const removed: string[] = [];
    const updated: Record<string, any> = {};

    // 1. Added and Updated
    for (const id in snapB.objects) {
      const objB = snapB.objects[id];
      const objA = snapA.objects[id];

      if (!objA) {
        added.push(objB);
      } else {
        const diff: Record<string, any> = {};
        let changed = false;
        
        for (const key in objB) {
          if (JSON.stringify(objB[key]) !== JSON.stringify(objA[key])) {
            diff[key] = objB[key];
            changed = true;
          }
        }
        
        if (changed) {
          updated[id] = diff;
        }
      }
    }

    // 2. Removed
    for (const id in snapA.objects) {
      if (!snapB.objects[id]) {
        removed.push(id);
      }
    }

    // 3. Canvas Diff
    let canvasDiff: any = null;
    let canvasChanged = false;
    
    for (const key in snapB.canvas) {
      const valB = snapB.canvas[key as keyof typeof snapB.canvas];
      const valA = snapA.canvas[key as keyof typeof snapA.canvas];
      if (valB !== valA) {
        if (!canvasDiff) canvasDiff = {};
        canvasDiff[key] = valB;
        canvasChanged = true;
      }
    }

    return { added, removed, updated, canvas: canvasDiff };
  }

  private applyPatch(patch: DeltaPatch, callback: () => void) {
    const canvas = this.canvas;

    // 1. Remove objects
    patch.removed.forEach((id) => {
      const obj = this.findObjectById(id);
      if (obj) canvas.remove(obj);
    });

    // 2. Update existing objects in-place
    for (const id in patch.updated) {
      const obj = this.findObjectById(id);
      if (obj) {
        obj.set(patch.updated[id]);
        obj.setCoords();
      }
    }

    // 3. Update Canvas dimensions and properties
    if (patch.canvas) {
      if (patch.canvas.backgroundColor !== undefined) {
        canvas.setBackgroundColor(patch.canvas.backgroundColor, () => {});
      }
      if (patch.canvas.width !== undefined) {
        canvas.setWidth(patch.canvas.width);
      }
      if (patch.canvas.height !== undefined) {
        canvas.setHeight(patch.canvas.height);
      }
      // Re-center if workspace is resized
      if (window.FB && window.FB.design && window.FB.design.canvas && window.FB.design.canvas.resize) {
        window.FB.design.canvas.resize();
      }
    }

    // 4. Re-add objects
    if (patch.added.length > 0) {
      // Deserialize objects using Fabric's parser
      fabric.util.enlivenObjects(patch.added, (enlived: fabric.Object[]) => {
        enlived.forEach((obj) => {
          canvas.add(obj);
        });
        callback();
      }, "fabric");
    } else {
      callback();
    }
  }

  private findObjectById(id: string): fabric.Object | null {
    let found: fabric.Object | null = null;
    this.canvas.forEachObject((obj) => {
      if (obj.get("id") === id) {
        found = obj;
      }
    });
    return found;
  }

  public getUndoCount(): number {
    return this.undoStack.length;
  }

  public getRedoCount(): number {
    return this.redoStack.length;
  }

  public clear() {
    this.undoStack = [];
    this.redoStack = [];
    this.saveInitialState();
  }
}
