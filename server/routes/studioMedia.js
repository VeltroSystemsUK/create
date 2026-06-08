import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mediaDir = path.resolve(__dirname, '../public/uploads');
const metaPath = path.join(mediaDir, 'studio-media-meta.json');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sanitizeFileName(name) {
  const baseName = path.basename(String(name || 'upload'));
  return baseName.replace(/[^a-zA-Z0-9._ -]/g, '-').replace(/^\.+/, '') || 'upload';
}

function readMeta() {
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch {
    return { files: {} };
  }
}

function writeMeta(meta) {
  const tmp = `${metaPath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(meta, null, 2));
  fs.renameSync(tmp, metaPath);
}

ensureDir(mediaDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, mediaDir),
  filename: (req, file, cb) => {
    const original = sanitizeFileName(file.originalname);
    const ext = path.extname(original);
    const name = path.basename(original, ext);
    cb(null, `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const allowedExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    if (allowedTypes.includes(file.mimetype) || allowedExt.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
  },
});

router.get('/', (req, res) => {
  ensureDir(mediaDir);
  const meta = readMeta();
  const files = Object.entries(meta.files || {}).map(([name, info]) => {
    const filePath = path.join(mediaDir, name);
    return {
      name,
      originalName: info.originalName || name,
      size: fs.existsSync(filePath) ? fs.statSync(filePath).size : 0,
      addedAt: info.addedAt || '',
    };
  });
  res.json(files);
});

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const meta = readMeta();
  meta.files = meta.files || {};
  meta.files[req.file.filename] = {
    originalName: req.file.originalname,
    addedAt: new Date().toISOString(),
  };
  writeMeta(meta);
  res.status(201).json({ name: req.file.filename, originalName: req.file.originalname });
});

router.delete('/:name', (req, res) => {
  const name = sanitizeFileName(req.params.name);
  const filePath = path.join(mediaDir, name);
  if (!filePath.startsWith(mediaDir + path.sep)) {
    return res.status(400).json({ error: 'Invalid media path' });
  }
  const meta = readMeta();
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  if (meta.files) delete meta.files[name];
  writeMeta(meta);
  res.json({ ok: true });
});

export default router;
