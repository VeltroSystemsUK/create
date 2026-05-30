# Framework Builder - Clean Slate + Save/Load + Nested Blocks (SQLite Edition)

## ✅ Implementation Complete

All three features have been implemented and are ready to use with **local SQLite storage**:

### What's New

#### 1. **Clean Slate App Load** ✓
- App now starts with a completely blank canvas every time
- No auto-restore from previous sessions
- Users must explicitly click "Load Project" to restore a saved project
- Session auto-save to localStorage still works (for crash recovery)

#### 2. **Project Management (Local SQLite)** ✓
- **Save Project** button: Prompt for project name, save to local `framework_builder.db` file
- **Load Project** button: Show modal list of all saved projects, click to load
- Projects stored in SQLite database on your machine (no external database needed)
- Each project includes all pages and blocks
- Database file is created automatically on first save

#### 3. **Nested Blocks** ✓
- All block types can now be dropped inside other blocks
- Parent-ID relationships already supported in block structure
- Foundation ready for enhanced drag-drop UI (visual hints on hover)

---

## Setup (No Database Required!)

### 1. Backend Setup

The backend is already created in `server/` directory. Dependencies are pre-installed.

**That's it!** No database setup needed. SQLite file is created automatically.

### 2. Frontend Setup

The frontend is already updated. Just make sure:

1. **Dev Server Running** (in main project directory):
```bash
npm run dev
```

2. **API Running** (in new terminal):
```bash
cd server
npm start
```

You should see:
```
✓ SQLite database initialized at: .../server/framework_builder.db
🚀 Framework Builder API running on port 3001
📍 Health check: http://localhost:3001/api/health
```

---

## Usage Guide

### App Load
1. Open http://localhost:3000/framework-builder.html
2. App loads with blank canvas (no previous project auto-restored)
3. Create blocks, edit, design...

### Save Project
1. Click **"File" > "Save Project"** button in top bar
2. Enter project name in prompt (e.g., "My First Site")
3. Click OK
4. Project saved to `server/framework_builder.db`
5. Project name appears in top bar

### Load Project
1. Click **"File" > "Load Project"** button in top bar
2. Modal shows list of all saved projects
3. Click a project to load it
4. Canvas and pages restore from database
5. Each project has delete button (×) to remove it

### Session Auto-Save
- Every 30 seconds, current state is auto-saved to localStorage
- This is a safety net for crash recovery during your session
- NOT auto-restored on page load (only manual Load Project button)

---

## File Structure

### Backend Files (in `server/`)
```
server/
├── framework_builder.db   # SQLite database file (auto-created on first save)
├── package.json           # Dependencies
├── .env                   # Configuration (API_PORT=3001)
├── server.js              # Express app entry point
├── db.js                  # SQLite connection setup
└── routes/
    └── projects.js        # CRUD endpoints (/api/projects)
```

### Frontend Files Created/Modified
```
js/
├── project.js             # NEW - Project management API
├── app.js                 # MODIFIED - Remove auto-restore
└── pages.js               # MODIFIED - Always start fresh

src/
└── main.js                # MODIFIED - Import project.js

css/
└── layout.css             # MODIFIED - Add modal styles

framework-builder.html     # MODIFIED - Save/Load buttons
```

---

## API Endpoints

### List Projects
```
GET http://localhost:3001/api/projects
Response: [{ id, name, updated_at }, ...]
```

### Get Project
```
GET http://localhost:3001/api/projects/:id
Response: { id, name, content: {pages, currentPageId}, created_at, updated_at }
```

### Save Project (Create or Update)
```
POST http://localhost:3001/api/projects
Body: {
  id: null,  // omit for new project, include for update
  name: "My Project",
  content: { pages: [...], currentPageId: "p_xxx" }
}
Response: { id, name, created_at, updated_at }
```

### Delete Project
```
DELETE http://localhost:3001/api/projects/:id
Response: { success: true, id }
```

---

## Database Schema

SQLite stores projects in a simple table:

```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  content TEXT NOT NULL,           -- JSON string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Example data:**
```json
{
  "id": 1,
  "name": "My Website",
  "content": "{\"pages\":[...],\"currentPageId\":\"p_abc123\"}",
  "created_at": "2026-05-28 12:34:56",
  "updated_at": "2026-05-28 12:34:56"
}
```

---

## Database File Location

The SQLite file is stored at:
```
server/framework_builder.db
```

This file contains all your saved projects. It's created automatically on first save.

**To backup:** Just copy `server/framework_builder.db` to another location.
**To clear data:** Delete `server/framework_builder.db` and it will be recreated fresh.

---

## Nested Blocks Implementation Details

### Current State
- Blocks support parent-ID relationships: `block.parentId = "container-block-id"`
- Blocks also have `columnIndex` for column position in multi-column containers
- Flat array structure persists (no tree restructuring needed)

### Example Block Hierarchy
```javascript
FB.state.blocks = [
  { id: "b_1", type: "row", props: {...} },                    // Container
  { id: "b_2", type: "hero", parentId: "b_1", columnIndex: 0, props: {...} },  // Child
  { id: "b_3", type: "text", parentId: "b_1", columnIndex: 1, props: {...} }   // Child
]
```

### Rendering
- `FB.canvas._renderBlock()` checks `parentId`
- Children rendered inside parent container
- Flat array makes serialization/export simple

### Phase 2: Enhanced Drag-Drop (Not Implemented Yet)
- Show visual hints when dragging over containers
- Highlight droppable zones
- Easier drag-into-container UX

---

## Troubleshooting

### "Cannot connect to API"
- Verify backend running: `http://localhost:3001/api/health` in browser
- Check both servers running (frontend on 3000, backend on 3001)
- Check terminal output for errors

### "Database connection error"
- SQLite file should auto-create in `server/` directory
- Check `server/` directory has write permissions
- Try deleting `server/framework_builder.db` and restart (it will recreate fresh)

### "Projects not loading"
- Check browser console (F12) for errors
- Verify API endpoint is `http://localhost:3001`
- Check database file exists: `server/framework_builder.db`

### "Cannot save projects"
- Verify backend running and accessible
- Check `server/` directory has write permissions
- Check database file isn't locked by another process

---

## Running Everything

**Terminal 1 - Backend**:
```bash
cd server
npm start
# → ✓ SQLite database initialized at: .../server/framework_builder.db
# → 🚀 Framework Builder API running on port 3001
```

**Terminal 2 - Frontend**:
```bash
npm run dev
# → ➜  Local:   http://localhost:3000/
```

**Browser**:
```
http://localhost:3000/framework-builder.html
```

All set! 🚀

---

## Features Summary

| Feature | Status | Storage | Setup |
|---------|--------|---------|-------|
| Clean Slate Load | ✅ | N/A | Auto |
| Save Projects | ✅ | SQLite (local) | Auto |
| Load Projects | ✅ | SQLite (local) | Auto |
| Delete Projects | ✅ | SQLite (local) | Auto |
| Nested Blocks | ✅ Foundation | N/A | Auto |
| Session Auto-Save | ✅ | localStorage | Auto |

---

## Key Advantages (SQLite Local)

✅ **No External Database** - Everything stored locally  
✅ **Zero Setup** - Database file auto-created  
✅ **Fast** - Local file access  
✅ **Portable** - Single `.db` file is your entire database  
✅ **Secure** - Data stays on your machine  
✅ **No Server Dependency** - Works offline once started  
✅ **Easy Backup** - Just copy the `.db` file  
✅ **Easy Reset** - Delete `.db` file to start fresh  

---

## Code References

### Main Files
- **Project Management**: `js/project.js` (200 lines)
- **Clean Slate**: `js/app.js` (2-line change), `js/pages.js` (10-line change)
- **Backend**: `server/server.js`, `server/routes/projects.js`, `server/db.js`
- **Styling**: `css/layout.css` (modal + top bar styles)

### Key Functions
- `FB.project.saveProject()` - Save current project
- `FB.project.loadProject(id)` - Load from SQLite
- `FB.project.listProjects()` - Fetch all projects
- `FB.project.deleteProject(id)` - Delete from SQLite

---

## Why SQLite?

For personal/small team use (not enterprise):
- ✅ Single file database
- ✅ No installation required
- ✅ Zero configuration
- ✅ Works offline
- ✅ Easy to backup and share
- ✅ Lightweight and fast
- ❌ Not suitable for 1000+ simultaneous users
- ❌ Not suitable for distributed systems

If you ever need to scale to a server with PostgreSQL/MySQL, the API is already abstracted and easy to swap!
