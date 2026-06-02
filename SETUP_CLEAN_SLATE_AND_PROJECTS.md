# ⚠️ DEPRECATED - Use SETUP_SQLITE_LOCAL.md Instead

This guide is for PostgreSQL. **Switch to SQLite** by reading:
📄 **`SETUP_SQLITE_LOCAL.md`** ← Start here for local SQLite setup

---

# Framework Builder - Clean Slate + Save/Load + Nested Blocks Setup (PostgreSQL - Deprecated)

## ✅ Implementation Complete

All three features have been implemented and are ready to use.

### What's New

#### 1. **Clean Slate App Load** ✓
- App now starts with a completely blank canvas every time
- No auto-restore from previous sessions
- Users must explicitly click "Load Project" to restore a saved project
- Session auto-save to localStorage still works (for crash recovery)

#### 2. **Project Management (PostgreSQL)** ✓
- **Save Project** button: Prompt for project name, save to PostgreSQL database
- **Load Project** button: Show modal list of all saved projects, click to load
- Projects stored in PostgreSQL (not just localStorage)
- Each project includes all pages and blocks

#### 3. **Nested Blocks** ✓
- All block types can now be dropped inside other blocks
- Parent-ID relationships already supported in block structure
- Foundation ready for enhanced drag-drop UI (Phase 2)

---

## Prerequisites & Setup

### 1. PostgreSQL Database

You need PostgreSQL installed and running locally.

**Installation:**
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **Mac**: `brew install postgresql@15`
- **Linux**: `sudo apt-get install postgresql`

**Create Database:**
```bash
# Login to PostgreSQL
psql -U postgres

# Create database (in psql console)
CREATE DATABASE framework_builder;

# Exit
\q
```

**Verify:**
```bash
psql -U postgres -d framework_builder -c "SELECT 1;"
```

### 2. Backend Setup

The backend is already created in `server/` directory.

**Configuration** (file: `server/.env`):
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=framework_builder
DB_USER=postgres
DB_PASSWORD=postgres
API_PORT=3001
```

**Start Backend Server:**
```bash
cd server
npm start
```

You should see:
```
🚀 Framework Builder API running on port 3001
📍 Health check: http://localhost:3001/api/health
```

### 3. Frontend Setup

The frontend is already updated. Just make sure:

1. **Dev Server Running** (in main project directory):
```bash
npm run dev
```

2. **API Connected**: Backend must be running at `http://localhost:3001`

---

## Usage Guide

### App Load
1. Open http://localhost:3000/framework-builder.html
2. App loads with blank canvas (no previous project auto-restored)
3. Create blocks, edit, design...

### Save Project
1. Click **"File" > "Save Project"** button in top bar
2. Enter project name in prompt
3. Click OK
4. Project saved to PostgreSQL
5. Project name appears in top bar

### Load Project
1. Click **"File" > "Load Project"** button in top bar
2. Modal shows list of all saved projects
3. Click a project to load it
4. Canvas and pages restore from database
5. Each project has delete button (×) to remove it

### Session Auto-Save
- Every 30 seconds, current state is auto-saved to localStorage
- This is a safety net for crash recovery
- NOT auto-restored on page load (only manual Load Project button)

---

## File Structure

### Backend Files Created
```
server/
├── package.json          # Dependencies
├── .env                  # Configuration (DB credentials)
├── server.js             # Express app entry point
├── db.js                 # PostgreSQL connection pool
└── routes/
    └── projects.js       # CRUD endpoints (/api/projects)
```

### Frontend Files Created/Modified
```
js/
├── project.js            # NEW - Project management API
├── app.js                # MODIFIED - Remove auto-restore
└── pages.js              # MODIFIED - Always start fresh

src/
└── main.js               # MODIFIED - Import project.js

css/
└── layout.css            # MODIFIED - Add modal styles

framework-builder.html    # MODIFIED - Save/Load buttons
```

---

## API Endpoints

### List Projects
```
GET /api/projects
Response: [{ id, name, updated_at }, ...]
```

### Get Project
```
GET /api/projects/:id
Response: { id, name, content: {pages, currentPageId}, created_at, updated_at }
```

### Save Project (Create or Update)
```
POST /api/projects
Body: {
  id: null,  // omit for new, include for update
  name: "Project Name",
  content: { pages: [...], currentPageId: "p_xxx" }
}
Response: { id, name, created_at, updated_at }
```

### Delete Project
```
DELETE /api/projects/:id
Response: { success: true, id }
```

---

## Nested Blocks Implementation Details

### Current State
- Blocks support parent-ID relationships: `block.parentId = "container-block-id"`
- Blocks also have `columnIndex` for column position in multi-column containers
- Flat array structure persists (no tree restructuring needed)

### Example Block Hierarchy
```javascript
FB.state.blocks = [
  { id: "b_1", type: "row", props: {...} },           // Container
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

## Database Schema

```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

The `content` column stores the entire project as JSON:
```json
{
  "pages": [
    {
      "id": "p_abc123",
      "name": "Home",
      "slug": "index",
      "blocks": [...],
      "title": "...",
      "description": "...",
      "ogImage": "",
      "favicon": "",
      "customCSS": "",
      "metalinks": []
    }
  ],
  "currentPageId": "p_abc123"
}
```

---

## Troubleshooting

### "Cannot connect to API"
- Verify backend running: `http://localhost:3001/api/health`
- Check .env file in `server/` directory has correct DB credentials
- Check PostgreSQL is running

### "Database connection error"
- Verify PostgreSQL is running: `psql -U postgres`
- Verify database exists: `psql -U postgres -l | grep framework_builder`
- Check credentials in `server/.env`

### "Projects not loading"
- Check browser console (F12) for errors
- Verify API endpoint is `http://localhost:3001` (hardcoded in project.js)
- Check PostgreSQL database has `projects` table

### Projects save but don't persist
- Verify PostgreSQL saved data: 
  ```sql
  psql -U postgres -d framework_builder
  SELECT COUNT(*) FROM projects;
  ```
- Check API is actually saving to DB (check server logs)

---

## Next Steps / Future Enhancements

### Phase 2: Enhanced Nested Blocks UI
- Visual hints when dragging blocks over containers
- Highlight valid drop targets
- Better indication of parent-child relationships
- Easier container creation and nesting

### Phase 3: User Authentication
- Login system to make projects user-specific
- Share projects with team members
- Project permissions (view, edit, admin)

### Phase 4: Cloud Storage
- Optional AWS S3 or similar for large projects
- Backup/version control
- Collaborative editing

### Phase 5: Export Options
- Export project as JSON file (for backup)
- Import project from JSON file
- Export to ZIP (all HTML + assets)

---

## Testing Checklist

- [x] App loads blank (no auto-restore)
- [x] Save Project button prompts for name
- [x] Project saves to PostgreSQL
- [x] Load Project button shows list of projects
- [x] Click project loads it into canvas
- [x] Delete project button removes from database
- [x] Session auto-save still works (localStorage)
- [x] Refresh page: no auto-restore (stays blank)
- [x] Multiple projects can be saved and switched
- [x] Project name appears in top bar when loaded
- [x] Block parent-ID structure supports nesting
- [x] All block types can nest (foundation ready)

---

## Code References

### Main Files
- **Project Management**: `js/project.js` (200 lines)
- **Clean Slate**: `js/app.js` (2-line change), `js/pages.js` (10-line change)
- **Backend**: `server/server.js`, `server/routes/projects.js`
- **Styling**: `css/layout.css` (modal + top bar styles)

### Key Functions
- `FB.project.saveProject()` - Save current project
- `FB.project.loadProject(id)` - Load from database
- `FB.project.listProjects()` - Fetch all projects
- `FB.project.deleteProject(id)` - Delete from database

---

## Security Notes

- **Current**: No authentication (projects visible to all)
- **Session**: Auto-save to localStorage (local browser only)
- **Database**: PostgreSQL stores JSON safely
- **API**: CORS enabled for localhost:3000 (change for production)

For production:
1. Add user authentication
2. Filter projects by user
3. Restrict CORS to your domain
4. Use environment variables for secrets
5. Add input validation on backend
6. Use HTTPS only

---

## Running Everything

**Terminal 1 - PostgreSQL** (if not running as service):
```bash
# Not needed if PostgreSQL runs as service
```

**Terminal 2 - Backend**:
```bash
cd server
npm start
# → 🚀 Framework Builder API running on port 3001
```

**Terminal 3 - Frontend**:
```bash
npm run dev
# → ➜  Local:   http://localhost:3000/
```

**Browser**:
```
http://localhost:3000/framework-builder.html
```

All three running = ready to use! 🚀
