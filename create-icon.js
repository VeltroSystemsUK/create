import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// SVG favicon from index.html
const svgIcon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CDFE00'>
  <rect width='8' height='8' x='2' y='2'/>
  <rect width='8' height='8' x='14' y='2'/>
  <rect width='8' height='8' x='2' y='14'/>
  <rect width='8' height='8' x='14' y='14'/>
</svg>`;

const assetsDir = path.join(process.cwd(), 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create PNG first
const pngPath = path.join(assetsDir, 'icon.png');
const icoPath = path.join(assetsDir, 'icon.ico');

sharp(Buffer.from(svgIcon))
  .resize(256, 256)
  .png()
  .toFile(pngPath)
  .then(info => {
    console.log('Created icon.png:', info);

    // Convert to ICO format for Windows
    return sharp(pngPath)
      .resize(256, 256)
      .toFile(icoPath.replace('.ico', '.png'));
  })
  .then(() => {
    console.log('Icon files created in assets/');
    console.log('- icon.png (256x256)');
    console.log('- Use this path in electron-main.cjs: path.join(appDir, "assets", "icon.png")');
  })
  .catch(err => {
    console.error('Error creating icon:', err);
    process.exit(1);
  });
