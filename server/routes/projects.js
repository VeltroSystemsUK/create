import express from 'express';
import db from '../db.js';

const router = express.Router();

// List all projects
router.get('/', (req, res) => {
  db.all(
    'SELECT id, name, updated_at FROM projects ORDER BY updated_at DESC',
    (err, projects) => {
      if (err) {
        console.error('Error listing projects:', err);
        return res.status(500).json({ error: 'Failed to list projects' });
      }
      res.json(projects || []);
    }
  );
});

// Get single project
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM projects WHERE id = ?', [id], (err, project) => {
    if (err) {
      console.error('Error fetching project:', err);
      return res.status(500).json({ error: 'Failed to fetch project' });
    }
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({
      ...project,
      content: JSON.parse(project.content),
    });
  });
});

// Create or update project
router.post('/', (req, res) => {
  const { id, name, content } = req.body;

  if (!name || !content) {
    return res.status(400).json({ error: 'Missing name or content' });
  }

  const contentJson = JSON.stringify(content);

  if (id) {
    // Update existing
    db.run(
      'UPDATE projects SET name = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, contentJson, id],
      function (err) {
        if (err) {
          console.error('Error updating project:', err);
          return res.status(500).json({ error: 'Failed to update project' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Project not found' });
        }
        db.get('SELECT * FROM projects WHERE id = ?', [id], (err, project) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to fetch updated project' });
          }
          res.json(project);
        });
      }
    );
  } else {
    // Create new
    db.run(
      'INSERT INTO projects (name, content) VALUES (?, ?)',
      [name, contentJson],
      function (err) {
        if (err) {
          console.error('Error creating project:', err);
          return res.status(500).json({ error: 'Failed to create project' });
        }
        db.get('SELECT * FROM projects WHERE id = ?', [this.lastID], (err, project) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to fetch new project' });
          }
          res.json(project);
        });
      }
    );
  }
});

// Delete project
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM projects WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error deleting project:', err);
      return res.status(500).json({ error: 'Failed to delete project' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true, id });
  });
});

export default router;
