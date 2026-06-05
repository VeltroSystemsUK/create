import { store } from "./store";

export function generateAIVector(canvas: fabric.Canvas, prompt: string, statusElement: HTMLElement) {
  statusElement.textContent = "AI is thinking...";

  fetch("/api/ai-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.error) {
        statusElement.textContent = `Error: ${data.error}`;
        return;
      }

      if (data.svg) {
        statusElement.textContent = "Parsing vector paths...";
        
        // Use Fabric.js native SVG parser
        fabric.loadSVGFromString(data.svg, (results, options) => {
          if (!results || results.length === 0) {
            statusElement.textContent = "Failed to parse SVG. Trying fallback...";
            loadFallbackRaster(canvas, data.url, statusElement);
            return;
          }

          // Group elements
          const obj = fabric.util.groupSVGElements(results, options);
          
          // Position at center of current viewport
          const center = canvas.getVpCenter();
          obj.set({
            left: center.x,
            top: center.y,
            originX: "center",
            originY: "center",
            name: "AI Generative Vector Group",
          });

          // Scale down if it exceeds viewport size
          const maxDim = Math.max(obj.width || 400, obj.height || 400);
          const limit = Math.min(canvas.getWidth(), canvas.getHeight()) * 0.5;
          if (maxDim > limit) {
            obj.scale(limit / maxDim);
          }

          canvas.add(obj);
          canvas.setActiveObject(obj);
          canvas.renderAll();

          // Push delta to history
          if (window.FB && window.FB.design && window.FB.design.history) {
            window.FB.design.history.push();
          }

          statusElement.textContent = "Vector placed! Try double-clicking to edit paths.";
          setTimeout(() => {
            statusElement.textContent = "";
          }, 3000);
        });
      } else if (data.url) {
        loadFallbackRaster(canvas, data.url, statusElement);
      } else {
        statusElement.textContent = "Invalid API response.";
      }
    })
    .catch((err) => {
      console.error(err);
      statusElement.textContent = "Network error generating image.";
    });
}

function loadFallbackRaster(canvas: fabric.Canvas, url: string, statusElement: HTMLElement) {
  statusElement.textContent = "Placing image...";
  fabric.Image.fromURL(
    url,
    (img) => {
      const center = canvas.getVpCenter();
      img.set({
        left: center.x,
        top: center.y,
        originX: "center",
        originY: "center",
      });
      const maxDim = Math.max(img.width || 400, img.height || 400);
      const limit = Math.min(canvas.getWidth(), canvas.getHeight()) * 0.5;
      if (maxDim > limit) {
        img.scale(limit / maxDim);
      }
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();

      if (window.FB && window.FB.design && window.FB.design.history) {
        window.FB.design.history.push();
      }

      statusElement.textContent = "Placed image.";
      setTimeout(() => {
        statusElement.textContent = "";
      }, 3000);
    },
    { crossOrigin: "anonymous" }
  );
}

export function ungroupVector(canvas: fabric.Canvas, group: fabric.Group) {
  if (group.type !== "group") return;

  // Convert group to active selection, ungrouping individual paths
  const activeSel = group.toActiveSelection();
  canvas.setActiveObject(activeSel);
  canvas.renderAll();

  if (window.FB && window.FB.design && window.FB.design.history) {
    window.FB.design.history.push();
  }

  if (window.FB && window.FB.util && window.FB.util.showToast) {
    window.FB.util.showToast("Ungrouped vector elements.");
  }
}
