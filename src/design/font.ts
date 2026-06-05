const loadedFonts = new Set<string>();

export function loadDynamicFont(fontFamily: string): Promise<void> {
  if (loadedFonts.has(fontFamily)) {
    return Promise.resolve();
  }

  // Check if browser already has this font active
  try {
    if (document.fonts && document.fonts.check(`1em "${fontFamily}"`)) {
      loadedFonts.add(fontFamily);
      return Promise.resolve();
    }
  } catch (e) {
    // Ignore and proceed with stylesheet load
  }

  return new Promise((resolve, reject) => {
    const fontApiName = fontFamily.replace(/\s+/g, "+");
    const linkId = `google-font-${fontFamily.toLowerCase().replace(/\s+/g, "-")}`;
    
    // Check if stylesheet link already exists in DOM
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${fontApiName}:wght@400;700&display=swap`;
      document.head.appendChild(link);
    }

    // Wait for FontFaceSet loading state or fallback timeout
    if (document.fonts && document.fonts.load) {
      document.fonts
        .load(`1em "${fontFamily}"`)
        .then(() => {
          loadedFonts.add(fontFamily);
          resolve();
        })
        .catch((err) => {
          console.warn(`[Font Engine] Font Face load failed: ${fontFamily}`, err);
          // Resolve anyway so the application doesn't freeze
          resolve();
        });
    } else {
      // Fallback for older browsers
      setTimeout(() => {
        loadedFonts.add(fontFamily);
        resolve();
      }, 800);
    }
  });
}
