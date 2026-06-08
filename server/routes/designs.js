import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const designsDir = path.resolve(__dirname, '../../designs');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function safeSlug(value, fallback = 'untitled') {
  const slug = String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return slug || fallback;
}

function designPath(slug) {
  const safe = safeSlug(slug);
  const target = path.join(designsDir, `${safe}.json`);
  if (!target.startsWith(designsDir + path.sep)) {
    throw new Error('Invalid design path');
  }
  return target;
}

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, data) {
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, filePath);
}

router.get('/', (req, res) => {
  ensureDir(designsDir);
  const designs = fs.readdirSync(designsDir)
    .filter((name) => name.endsWith('.json') && name !== 'my-project.json')
    .map((name) => {
      const filePath = path.join(designsDir, name);
      const data = readJson(filePath, {});
      return {
        slug: path.basename(name, '.json'),
        name: data.name || path.basename(name, '.json'),
        width: data.width || 800,
        height: data.height || 600,
        thumbnail: data.thumbnail || '',
      };
    })
    .sort((a, b) => String(a.name).localeCompare(String(b.name)));
  res.json(designs);
});

router.get('/:slug', (req, res) => {
  ensureDir(designsDir);
  const filePath = designPath(req.params.slug);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Design not found' });
  }
  res.json(readJson(filePath, {}));
});

router.post('/', (req, res) => {
  ensureDir(designsDir);
  const data = req.body || {};
  const baseSlug = safeSlug(data.slug || data.name);
  let slug = baseSlug;
  let counter = 1;

  while (fs.existsSync(designPath(slug))) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  writeJson(designPath(slug), { ...data, slug });
  res.json({ ok: true, slug });
});

export default router;
