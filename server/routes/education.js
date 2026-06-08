import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import db from '../db.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const booksDir = path.join(__dirname, '../../library/education/books');

// Ensure books directory exists
if (!fs.existsSync(booksDir)) {
  fs.mkdirSync(booksDir, { recursive: true });
}

// Temp upload directory — files moved to correct book folder after body is parsed
const tempDir = path.join(booksDir, '.tmp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Configure multer for book uploads (stage to temp, relocate in handler)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + sanitizeFileName(file.originalname))
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExt = ['.pdf', '.md', '.txt', '.epub'];
    const allowedTypes = [
      'application/pdf',
      'text/markdown',
      'text/plain',
      'application/epub+zip',
      'application/octet-stream'
    ];
    if (allowedExt.includes(ext) || allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type "${ext}" not allowed. Accepted: PDF, EPUB, Markdown, TXT`), false);
    }
  }
});

// ── Helpers ──

function sanitizeFileName(name) {
  const baseName = path.basename(String(name || 'upload'));
  return baseName.replace(/[^a-zA-Z0-9._ -]/g, '-').replace(/^\.+/, '') || 'upload';
}

function sanitizeSlug(value, fallback = 'course') {
  const slug = String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return slug || fallback;
}

function pathInside(parentDir, childPath) {
  const relative = path.relative(parentDir, childPath);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

async function extractText(filePath, mimetype) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf' || mimetype === 'application/pdf') {
    try {
      const pdfParse = (await import('pdf-parse')).default;
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (err) {
      throw new Error(`PDF parsing failed: ${err.message}`);
    }
  }

  if (ext === '.md' || ext === '.txt' || mimetype === 'text/plain' || mimetype === 'text/markdown') {
    return fs.readFileSync(filePath, 'utf-8');
  }

  if (ext === '.epub' || mimetype === 'application/epub+zip') {
    return `EPUB parsing: file is available at ${filePath}. EPUB format requires server-side extraction.`;
  }

  throw new Error(`Unsupported file type: ${ext}`);
}

function truncateForAI(text, maxChars = 50000) {
  if (text.length <= maxChars) return text;
  // Take first and last portions to capture intro + conclusion
  const half = Math.floor(maxChars / 2);
  return text.slice(0, half) + '\n\n[...content truncated for AI processing...]\n\n' + text.slice(-half);
}

async function callClaude(prompt, apiKey) {
  const client = new Anthropic({
    apiKey,
    timeout: 60000 // 60 second timeout
  });

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 8192,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const textContent = response.content.find(block => block.type === 'text');
    if (!textContent) {
      throw new Error('No text content in response');
    }
    return textContent.text;
  } catch (error) {
    console.error('Claude API error:', error.message);
    throw error;
  }
}

function extractJSON(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

// ── Routes ──

// POST /api/education/upload
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const originalName = sanitizeFileName(req.file.originalname);
    const bookName = req.body.bookName || originalName.replace(/\.[^.]+$/, '');
    const safeName = sanitizeSlug(bookName, 'book');
    const bookDir = path.join(booksDir, safeName);
    if (!fs.existsSync(bookDir)) fs.mkdirSync(bookDir, { recursive: true });

    const destPath = path.join(bookDir, originalName);
    fs.renameSync(req.file.path, destPath);
    req.file.path = destPath;

    const relativePath = path.join('library/education/books', safeName, originalName);

    db.run(
      `INSERT INTO education_books (book_name, safe_name, original_name, file_type, file_size, file_path)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [bookName, safeName, originalName, req.file.mimetype, req.file.size, req.file.path],
      function (err) {
        if (err) {
          try { fs.unlinkSync(req.file.path); } catch (_) {}
          return res.status(500).json({ error: 'Database error', details: err.message });
        }

        res.json({
          success: true,
          book: {
            id: this.lastID,
            bookName,
            safeName,
            originalName,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            path: relativePath
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// GET /api/education/books
router.get('/books', (req, res) => {
  db.all('SELECT * FROM education_books ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json({ success: true, books: rows || [] });
  });
});

// POST /api/education/parse/:bookId
router.post('/parse/:bookId', async (req, res) => {
  db.get('SELECT * FROM education_books WHERE id = ?', [req.params.bookId], async (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: 'Book not found' });
    }

    try {
      const text = await extractText(row.file_path, row.file_type);
      const wordCount = text.split(/\s+/).filter(Boolean).length;

      // Store extracted text for later use
      db.run(
        `UPDATE education_books SET extracted_text = ?, word_count = ? WHERE id = ?`,
        [text.slice(0, 200000), wordCount, row.id],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ error: 'Database error', details: updateErr.message });
          }

          res.json({
            success: true,
            bookId: row.id,
            wordCount,
            preview: text.slice(0, 500),
            fullTextLength: text.length
          });
        });
    } catch (error) {
      res.status(500).json({ error: 'Parse error', details: error.message });
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
//  TWO-STEP TRANSFORMATION PIPELINE
//  Step 1: Knowledge Graph Extraction (extricate raw facts)
//  Step 2: Re-Synthesis Layer (generate original course from facts only)
//  Hard constraints: verbatim ban, no structural mimicry, synthetic cases
// ═══════════════════════════════════════════════════════════════════

const STEP1_EXTRACTION_PROMPT = `You are a knowledge extraction engine. Your ONLY job is to convert dense text into a structured knowledge graph of raw facts. You do NOT write lesson content.

Extract from the provided text ONLY the following into a JSON knowledge graph:

1. KEY CONCEPTS: Core ideas, definitions, principles. Strip all narrative, examples, and commentary — keep ONLY the factual kernel.
2. METHODOLOGIES: Any step-by-step processes, formulas, or frameworks described. Capture the logic, NOT the author's phrasing.
3. METRICS & DATA POINTS: Any statistics, benchmarks, or quantifiable claims mentioned.
4. TAXONOMY: How concepts relate to each other — parent/child relationships, prerequisites, dependencies.

CRITICAL RULES:
- NEVER copy more than 3 consecutive words from the source text.
- NEVER reproduce the author's examples, anecdotes, or case studies.
- NEVER replicate proprietary frameworks using their branded names. Use universal terminology.
- If the text does not explicitly state a fact, DO NOT extrapolate — omit it.
- Output ONLY valid JSON, no markdown fences.`;

const STEP2_SYNTHESIS_PROMPT = `You are an elite business education architect. You transform raw knowledge graphs into high-engagement, subscription-grade online courses. Your tone is authoritative, sharp, and action-oriented — like a McKinsey consultant training high-performers, not a textbook editor.

You will receive a JSON knowledge graph extracted from source material. The original text has been DELETED. You must build a COMPLETELY ORIGINAL course from these raw facts alone.

Every module MUST follow the FOUR-TIER ARCHITECTURE (15-minute micro-learning blocks):

TIER 1 — THE HOOK (2 min): Contextualize relevance.
- "soWhat" metric: One striking data point or real-world consequence
- "premise": Three-sentence summary of the exact operational problem this module solves

TIER 2 — THE ANCHOR (5 min): Core structured lesson.
- Maximum 3 core concepts per module
- "analogy": An original, real-world metaphor translating abstract theory into concrete reality
- "inPractice": A synthetic business scenario showing the concept executed correctly vs. incorrectly

TIER 3 — THE ARENA (5 min): Interactive application.
- "scenario": A branching narrative decision point (e.g., "You are the [role]. [Situation]. Do you: A) ... B) ... C) ...")
- "impactTwist": After each option, reveal the immediate cascade consequence of that decision

TIER 4 — THE PROOF (3 min): Micro-verification.
- 3 conceptual application questions (NOT rote memorization)
- "microCredential": A skill token the learner earns (format: "+X [Skill Name]")

HARD CONSTRAINTS:
- NEVER use more than 3 consecutive words identical to any source text.
- NEVER replicate the author's chapter structure, subheadings, or organization.
- NEVER reuse any real-world examples, anecdotes, or case studies from the source.
- EVERY business scenario, analogy, and case study MUST be 100% synthetic and original.
- If a knowledge graph entry is ambiguous, flag it — do not fabricate details.
- The 80/20 Rule: Identify the 20% of content delivering 80% of practical utility. Discard academic filler.
- No Jargon Without Definitions: If introducing industry terms, generate an inline definition.
- Maintain a conversational yet authoritative tone throughout.

OUTPUT FORMAT — valid JSON only, no markdown:

{
  "title": "Course Title (original, not copied from source)",
  "slug": "course-slug",
  "description": "Compelling 2-3 sentence description in your own words",
  "level": "beginner|intermediate|advanced",
  "duration": "estimated total hours",
  "learningObjectives": ["objective 1", "objective 2", "..."],
  "targetAudience": "Who this is for",
  "prerequisites": "What learners need beforehand",
  "modules": [
    {
      "title": "Module 1: Descriptive Title",
      "description": "What this module covers (original wording)",
      "estimatedTime": "15 min",
      "hook": {
        "soWhat": "One striking metric or real-world consequence",
        "premise": "Three-sentence operational problem summary"
      },
      "anchor": {
        "concepts": [
          { "name": "Concept Name", "definition": "Clear, original definition", "keyInsight": "The one thing learners must remember" }
        ],
        "analogy": "Original real-world metaphor",
        "inPractice": { "doneRight": "Synthetic example of correct execution", "doneWrong": "Synthetic example of incorrect execution" }
      },
      "arena": {
        "scenario": {
          "role": "Job title or persona",
          "situation": "The decision point narrative",
          "options": [
            { "label": "A", "text": "Option text", "isCorrect": true,
              "impactTwist": "What happens immediately after this choice" },
            { "label": "B", "text": "Option text", "isCorrect": false,
              "impactTwist": "What happens immediately after this choice" },
            { "label": "C", "text": "Option text", "isCorrect": false,
              "impactTwist": "What happens immediately after this choice" }
          ]
        }
      },
      "proof": {
        "questions": [
          { "question": "Conceptual application question",
            "options": ["A", "B", "C"],
            "correctIndex": 0,
            "explanation": "Why this is correct" }
        ],
        "microCredential": "+X [Skill Name]"
      }
    }
  ]
}

Generate 4-6 modules. Each module is a self-contained 15-minute micro-learning unit.`;

// ── Two-Step Pipeline Runner ──

async function runTwoStepPipeline(text, bookName, apiKey) {
  const truncated = truncateForAI(text);

  // Step 1: Knowledge Graph Extraction
  const step1Response = await callClaude(
    STEP1_EXTRACTION_PROMPT + '\n\n---\n\nSOURCE TEXT:\n' + truncated + '\n\n---\n\nOutput ONLY the JSON knowledge graph.',
    apiKey
  );
  const knowledgeGraph = extractJSON(step1Response);
  if (!knowledgeGraph) {
    throw new Error('Step 1 failed: Could not extract knowledge graph from source. Response: ' + step1Response.slice(0, 500));
  }

  // Step 2: Re-Synthesis from knowledge graph ONLY (original text is wiped from context)
  const step2Response = await callClaude(
    STEP2_SYNTHESIS_PROMPT + '\n\n---\n\nKNOWLEDGE GRAPH (the original text is DELETED — use ONLY these facts):\n' +
    JSON.stringify(knowledgeGraph, null, 2) +
    '\n\n---\n\nBook title was: "' + bookName + '". Generate the complete Four-Tier Architecture course from these facts.',
    apiKey
  );
  const courseData = extractJSON(step2Response);
  if (!courseData) {
    throw new Error('Step 2 failed: Could not parse course JSON. Response: ' + step2Response.slice(0, 500));
  }

  return { course: courseData, knowledgeGraph };
}

// POST /api/education/generate
router.post('/generate', async (req, res) => {
  const { bookId, apiKey } = req.body;
  if (!apiKey) {
    return res.status(400).json({ error: 'Anthropic API key required' });
  }

  console.log(`[Education] Starting course generation for bookId: ${bookId}`);

  db.get('SELECT * FROM education_books WHERE id = ?', [bookId], async (err, row) => {
    if (err || !row) {
      console.error('[Education] Book not found:', err);
      return res.status(404).json({ error: 'Book not found' });
    }

    try {
      console.log(`[Education] Extracting text from book: ${row.book_name}`);
      let text = row.extracted_text;
      if (!text) {
        text = await extractText(row.file_path, row.file_type);
        db.run('UPDATE education_books SET extracted_text = ? WHERE id = ?', [text.slice(0, 200000), row.id]);
      }

      console.log(`[Education] Running two-step pipeline with ${text.length} chars`);
      const { course, knowledgeGraph } = await runTwoStepPipeline(text, row.book_name, apiKey);

      const courseSlug = sanitizeSlug(course.slug, row.safe_name || 'course');
      const coursesDir = path.join(__dirname, '../../library/education/courses');
      if (!fs.existsSync(coursesDir)) fs.mkdirSync(coursesDir, { recursive: true });

      const coursePath = path.join(coursesDir, `${courseSlug}.json`);
      if (!pathInside(coursesDir, coursePath)) {
        throw new Error('Invalid course slug');
      }

      fs.writeFileSync(coursePath, JSON.stringify(course, null, 2));
      console.log(`[Education] Course saved to: ${coursePath}`);

      const modulesCount = course.modules?.length || 0;
      const totalProofQuestions = course.modules?.reduce((s, m) => s + (m.proof?.questions?.length || 0), 0) || 0;

      db.run(
        'UPDATE education_books SET course_generated = 1, course_slug = ?, course_json = ? WHERE id = ?',
        [courseSlug, JSON.stringify(course), row.id],
        (updateErr) => {
          if (updateErr) {
            console.error('[Education] Database update error:', updateErr);
            return res.status(500).json({ error: 'Database error', details: updateErr.message });
          }

          console.log(`[Education] Course generation complete for: ${courseSlug}`);
          res.json({
            success: true,
            course,
            knowledgeGraph,
            savedTo: `library/education/courses/${courseSlug}.json`,
            stats: { modulesCount, proofQuestions: totalProofQuestions }
          });
        });
    } catch (error) {
      console.error('[Education] Generation error:', error.message, error.stack);
      res.status(500).json({ error: 'Generation error', details: error.message });
    }
  });
});

// DELETE /api/education/books/:bookId
router.delete('/books/:bookId', (req, res) => {
  db.get('SELECT * FROM education_books WHERE id = ?', [req.params.bookId], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Delete the book directory
    const bookDir = path.dirname(row.file_path);
    fs.rm(bookDir, { recursive: true, force: true }, (rmErr) => {
      if (rmErr) console.error('File deletion error:', rmErr);
    });

    db.run('DELETE FROM education_books WHERE id = ?', [req.params.bookId], (dbErr) => {
      if (dbErr) {
        return res.status(500).json({ error: 'Database error', details: dbErr.message });
      }
      res.json({ success: true, message: 'Book deleted' });
    });
  });
});

export default router;
