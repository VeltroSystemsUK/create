const fs = require('fs');
const path = require('path');

// Create assets directory
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create a simple PNG icon (256x256) with the favicon design
// This is a minimal PNG with neon green squares on dark background
// Format: minimal valid PNG structure with green squares

const iconPath = path.join(assetsDir, 'icon.png');

// Create a simple 256x256 PNG with neon green (#CDFE00) grid pattern
// PNG header + minimal IHDR chunk for 256x256
const width = 256;
const height = 256;
const pixelData = Buffer.alloc(width * height * 4); // RGBA

// Fill with dark background (0,0,0,255)
for (let i = 0; i < pixelData.length; i += 4) {
  pixelData[i] = 0;      // R
  pixelData[i + 1] = 0;  // G
  pixelData[i + 2] = 0;  // B
  pixelData[i + 3] = 255; // A
}

// Draw neon green squares (#CDFE00 = rgb(205, 254, 0))
// Top-left square
for (let y = 32; y < 96; y++) {
  for (let x = 32; x < 96; x++) {
    const idx = (y * width + x) * 4;
    pixelData[idx] = 205;     // R
    pixelData[idx + 1] = 254;  // G
    pixelData[idx + 2] = 0;    // B
    pixelData[idx + 3] = 255;  // A
  }
}

// Top-right square
for (let y = 32; y < 96; y++) {
  for (let x = 160; x < 224; x++) {
    const idx = (y * width + x) * 4;
    pixelData[idx] = 205;
    pixelData[idx + 1] = 254;
    pixelData[idx + 2] = 0;
    pixelData[idx + 3] = 255;
  }
}

// Bottom-left square
for (let y = 160; y < 224; y++) {
  for (let x = 32; x < 96; x++) {
    const idx = (y * width + x) * 4;
    pixelData[idx] = 205;
    pixelData[idx + 1] = 254;
    pixelData[idx + 2] = 0;
    pixelData[idx + 3] = 255;
  }
}

// Bottom-right square
for (let y = 160; y < 224; y++) {
  for (let x = 160; x < 224; x++) {
    const idx = (y * width + x) * 4;
    pixelData[idx] = 205;
    pixelData[idx + 1] = 254;
    pixelData[idx + 2] = 0;
    pixelData[idx + 3] = 255;
  }
}

// Create PNG using pngjs if available, otherwise create a simple BMP
try {
  const PNG = require('pngjs').PNG;
  const png = new PNG({ width, height });

  for (let i = 0; i < pixelData.length; i++) {
    png.data[i] = pixelData[i];
  }

  png.pack().pipe(fs.createWriteStream(iconPath))
    .on('finish', () => {
      console.log('✓ Icon created at:', iconPath);
      console.log('✓ Update electron-main.cjs to use: path.join(appDir, "assets", "icon.png")');
    });
} catch (e) {
  // Fallback: create a simple PPM or use a placeholder
  console.log('Creating placeholder icon...');
  // For now, just log the path - user can add their own icon
  console.log('Please add a 256x256 PNG icon at:', iconPath);
  console.log('Or download the favicon and save it as icon.png in assets/');
}
