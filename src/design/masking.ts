import { store } from "./store";

export function initMasking(canvas: fabric.Canvas) {
  // Double-click to edit the image inside the mask group (double-click triggers edit mask mode)
  canvas.on("mouse:dblclick", (opt) => {
    const target = opt.target;
    if (target && target.type === "group" && (target as any).clipPath) {
      const group = target as fabric.Group;
      // Enter "edit mask" mode
      const innerImage = group.getObjects().find(o => o.type === "image");
      if (innerImage) {
        group.subTargetCheck = true;
        canvas.setActiveObject(innerImage);
        canvas.renderAll();
        
        // Show indicator toast
        if (window.FB && window.FB.util && window.FB.util.showToast) {
          window.FB.util.showToast("Editing image inside frame. Double-click canvas to exit.");
        }
      }
    }
  });

  // Double-click background to exit edit mask mode
  canvas.on("mouse:down", (opt) => {
    // If we click the background or a non-group item, exit mask edit mode for any groups
    if (!opt.target) {
      exitAllMaskEdits(canvas);
    }
  });
}

function exitAllMaskEdits(canvas: fabric.Canvas) {
  let changed = false;
  canvas.forEachObject((obj) => {
    if (obj.type === "group" && (obj as any).subTargetCheck) {
      (obj as any).subTargetCheck = false;
      changed = true;
    }
  });
  if (changed) {
    canvas.renderAll();
  }
}

export function promptMask(image: fabric.Object) {
  if (image.type !== "image") return;
  
  // Prompt user to select a shape on the canvas to act as the frame mask
  if (window.FB && window.FB.util && window.FB.util.showToast) {
    window.FB.util.showToast("Click on any shape or vector to use as a mask frame.");
  }

  const canvas = image.canvas!;
  if (!canvas) return;

  // Temporarily change cursor to pointer and listen for click
  const origCursor = canvas.defaultCursor;
  canvas.defaultCursor = "crosshair";

  const handleSelection = (opt: any) => {
    const selectedShape = opt.target;
    
    // Clean up listeners
    canvas.off("mouse:down", handleSelection);
    canvas.defaultCursor = origCursor;

    if (!selectedShape) {
      if (window.FB && window.FB.util && window.FB.util.showToast) {
        window.FB.util.showToast("Masking cancelled.");
      }
      return;
    }

    if (selectedShape === image) {
      if (window.FB && window.FB.util && window.FB.util.showToast) {
        window.FB.util.showToast("Cannot mask an image using itself!");
      }
      return;
    }

    // Perform masking
    maskImageWithShape(canvas, image as fabric.Image, selectedShape);
  };

  // Wait for the next mouse down click on canvas to select the frame
  setTimeout(() => {
    canvas.on("mouse:down", handleSelection);
  }, 50);
}

export function maskImageWithShape(canvas: fabric.Canvas, image: fabric.Image, maskShape: fabric.Object) {
  const left = maskShape.left || 0;
  const top = maskShape.top || 0;
  const width = maskShape.width || 100;
  const height = maskShape.height || 100;
  const scaleX = maskShape.scaleX || 1;
  const scaleY = maskShape.scaleY || 1;

  // Let's copy properties of the mask shape so it acts as the clip path
  maskShape.clone((clonedMask: fabric.Object) => {
    clonedMask.set({
      left: left,
      top: top,
      originX: "left",
      originY: "top",
      absolutePositioned: true, // Locks the clipPath in absolute canvas coordinates
    });

    // Make the image fit nicely inside the mask bounds
    const imgWidth = image.width || 200;
    const imgHeight = image.height || 200;
    const destWidth = width * scaleX;
    const destHeight = height * scaleY;
    const scaleFactor = Math.max(destWidth / imgWidth, destHeight / imgHeight);

    image.set({
      left: left + destWidth / 2,
      top: top + destHeight / 2,
      scaleX: scaleFactor,
      scaleY: scaleFactor,
      originX: "center",
      originY: "center",
    });

    // Group the image (clonedMask will clip the group)
    const group = new fabric.Group([image], {
      left: left,
      top: top,
      width: destWidth,
      height: destHeight,
      clipPath: clonedMask,
      subTargetCheck: false,
      hasControls: true,
      hasBorders: true,
      name: "Masked Frame",
    } as any);

    // Remove old items
    canvas.remove(maskShape);
    canvas.remove(image);

    // Add new group
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();

    if (window.FB && window.FB.design && window.FB.design.history) {
      window.FB.design.history.push();
    }

    if (window.FB && window.FB.util && window.FB.util.showToast) {
      window.FB.util.showToast("Image masked successfully!");
    }
  });
}
