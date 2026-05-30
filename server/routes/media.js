import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from '../db.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../public/uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${timestamp}-${randomStr}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'application/octet-stream' // Allow generic binary files
    ];
    const ext = file.originalname.split('.').pop().toLowerCase();
    const allowedExt = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov', 'mkv'];

    if (allowedTypes.includes(file.mimetype) || allowedExt.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Media route is working' });
});

// POST /api/cms/media/upload
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    console.log('Upload request received');
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filename = req.file.filename;
    const fileUrl = `http://localhost:3001/uploads/${filename}`;
    console.log('Processing file:', filename);

    // Save to database
    db.run(
      `INSERT INTO media (filename, original_name, file_type, file_size, file_path, url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        filename,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        req.file.path,
        fileUrl
      ],
      function(err) {
        if (err) {
          console.error('Database insert error:', err.message);
          // Clean up uploaded file if DB insert fails
          try {
            fs.unlinkSync(req.file.path);
          } catch (e) {
            console.error('File cleanup error:', e.message);
          }
          return res.status(500).json({ error: 'Database error', details: err.message });
        }

        console.log('File inserted with ID:', this.lastID);
        res.json({
          success: true,
          media: {
            id: this.lastID,
            filename,
            original_name: req.file.originalname,
            file_type: req.file.mimetype,
            file_size: req.file.size,
            url: fileUrl
          }
        });
      }
    );
  } catch (error) {
    console.error('Upload endpoint error:', error.message);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// GET /api/cms/media - List all media
router.get('/', (req, res) => {
  db.all('SELECT * FROM media ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json({ success: true, media: rows || [] });
  });
});

// DELETE /api/cms/media/:id
router.delete('/:id', (req, res) => {
  const mediaId = req.params.id;

  db.get('SELECT * FROM media WHERE id = ?', [mediaId], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Delete file from disk
    fs.unlink(row.file_path, (fsErr) => {
      if (fsErr) console.error('File deletion error:', fsErr);
    });

    // Delete from database
    db.run('DELETE FROM media WHERE id = ?', [mediaId], (dbErr) => {
      if (dbErr) {
        return res.status(500).json({ error: 'Database error', details: dbErr.message });
      }
      res.json({ success: true, message: 'Media deleted' });
    });
  });
});

export default router;
