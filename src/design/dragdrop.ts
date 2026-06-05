import { store } from "./store";

interface DragDropOptions {
  canvas: fabric.Canvas;
  tileSelector: string;
  // Callback when dropped on canvas
  onDrop: (assetData: any, x: number, y: number) => void;
}

export function initDragDropPhysics(options: DragDropOptions) {
  const { canvas, tileSelector, onDrop } = options;

  document.addEventListener("mousedown", (e) => {
    const tile = (e.target as HTMLElement).closest(tileSelector) as HTMLElement;
    if (!tile) return;

    // Read asset data stored as JSON or data-attrs
    const assetData = JSON.parse(tile.getAttribute("data-asset") || "{}");
    
    e.preventDefault();

    const rect = tile.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // Create proxy element
    const proxy = document.createElement("div");
    proxy.className = "ds-drag-proxy";
    proxy.innerHTML = tile.innerHTML;
    
    // Style proxy
    proxy.style.position = "fixed";
    proxy.style.width = `${rect.width}px`;
    proxy.style.height = `${rect.height}px`;
    proxy.style.left = "0px";
    proxy.style.top = "0px";
    proxy.style.pointerEvents = "none";
    proxy.style.zIndex = "99999";
    proxy.style.opacity = "0.75";
    proxy.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.4)";
    proxy.style.borderRadius = "8px";
    proxy.style.transformOrigin = "top left";
    document.body.appendChild(proxy);

    // Spring Physics Variables
    let currentX = rect.left;
    let currentY = rect.top;
    let targetX = e.clientX;
    let targetY = e.clientY;
    let vx = 0;
    let vy = 0;
    const k = 0.15; // stiffness
    const damping = 0.75; // friction

    let animationId: number;
    let isDragging = true;

    // Physics update loop
    const updatePhysics = () => {
      if (!isDragging) return;

      // Spring formula: F = -k * (x - target)
      const ax = -k * (currentX - (targetX - offsetX));
      const ay = -k * (currentY - (targetY - offsetY));

      vx = (vx + ax) * damping;
      vy = (vy + ay) * damping;

      currentX += vx;
      currentY += vy;

      proxy.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1.05)`;
      animationId = requestAnimationFrame(updatePhysics);
    };

    animationId = requestAnimationFrame(updatePhysics);

    // Move handler
    const onMouseMove = (moveEvent: MouseEvent) => {
      targetX = moveEvent.clientX;
      targetY = moveEvent.clientY;
    };

    // Release handler
    const onMouseUp = (upEvent: MouseEvent) => {
      isDragging = false;
      cancelAnimationFrame(animationId);
      
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      // Check if dropped inside canvas
      const canvasContainer = canvas.wrapperEl;
      const canvasRect = canvasContainer.getBoundingClientRect();
      const dropX = upEvent.clientX;
      const dropY = upEvent.clientY;

      if (
        dropX >= canvasRect.left &&
        dropX <= canvasRect.right &&
        dropY >= canvasRect.top &&
        dropY <= canvasRect.bottom
      ) {
        // Calculate coords within fabric
        const mouseX = dropX - canvasRect.left;
        const mouseY = dropY - canvasRect.top;
        const zoom = canvas.getZoom();
        const vpt = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
        const canvasX = (mouseX - vpt[4]) / zoom;
        const canvasY = (mouseY - vpt[5]) / zoom;

        // Animate proxy scaling down to nothing at drop point
        proxy.style.transition = "transform 0.2s cubic-bezier(0.1, 0.8, 0.2, 1), opacity 0.2s ease";
        proxy.style.transform = `translate3d(${dropX - offsetX}px, ${dropY - offsetY}px, 0) scale(0)`;
        proxy.style.opacity = "0";

        setTimeout(() => {
          proxy.remove();
          onDrop(assetData, canvasX, canvasY);
        }, 200);
      } else {
        // Animate snap back to original position
        let snapX = currentX;
        let snapY = currentY;
        let snapVx = vx;
        let snapVy = vy;
        
        const snapBack = () => {
          const ax = -0.2 * (snapX - rect.left);
          const ay = -0.2 * (snapY - rect.top);

          snapVx = (snapVx + ax) * 0.7;
          snapVy = (snapVy + ay) * 0.7;

          snapX += snapVx;
          snapY += snapVy;

          proxy.style.transform = `translate3d(${snapX}px, ${snapY}px, 0) scale(1)`;

          if (Math.abs(snapX - rect.left) < 1 && Math.abs(snapY - rect.top) < 1) {
            proxy.remove();
          } else {
            requestAnimationFrame(snapBack);
          }
        };
        requestAnimationFrame(snapBack);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  });
}
