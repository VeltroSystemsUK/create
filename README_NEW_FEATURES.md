# Veltro Create - New Features

## 🎉 Three New Features Implemented

### 1️⃣ Clean Slate App Load

**Before**: App opened to last project (auto-restore)  
**After**: App opens with blank canvas every time

```
User opens app
    ↓
App shows blank canvas
    ↓
User clicks "Load Project"
    ↓
Selects saved project from list
    ↓
Project loaded and ready to edit
```

**Benefits**:
- No accidentally overwriting someone else's work
- Fresh start for each session
- User has full control of what they load

---

### 2️⃣ Project Management (Save/Load to SQLite)

**Before**: Only localStorage (one project at a time)  
**After**: Multiple projects saved to local SQLite database

```
┌─────────────────────────────────────────────────────┐
│                   Veltro Create                 │
│ File Menu:                                          │
│  • Save Project → Enter name → Saved to database   │
│  • Load Project → List modal → Select → Restore    │
│  • Delete → Confirm → Removed from database        │
└─────────────────────────────────────────────────────┘
                            ↓
                ┌───────────────────────┐
                │  framework_builder.db │
                │  (SQLite on disk)     │
                │  • Project 1          │
                │  • Project 2          │
                │  • Project 3          │
                └───────────────────────┘
```

**UI in Action**:

1. **Save Project**
   - Click "File" → "Save Project"
   - Prompt: "Project name?"
   - Enter: "My Website"
   - Click OK → ✓ Saved

2. **Load Project**
   - Click "File" → "Load Project"
   - Modal shows all projects:
     - My Website (5/28/2026)
     - Client Site (5/27/2026)
     - Test Project (5/26/2026)
   - Click a project → ✓ Loaded

**Benefits**:
- Multiple projects without confusion
- All projects stored locally
- No cloud needed, no account required
- Easy backup (just copy `.db` file)

---

### 3️⃣ Nested Blocks (Foundation Ready)

**Before**: Blocks only at page root level  
**After**: Blocks can be placed inside other blocks

```
Container Block
├─ Hero Block (column 1)
├─ Text Block (column 1)
├─ Image Block (column 2)
└─ CTA Block (column 2)
```

**Example Use Cases**:
- Row block contains 2 hero blocks side-by-side
- Grid container holds multiple cards
- Section nests content blocks
- Any block type can contain any other block type

**Foundation Status**:
- ✅ Parent-ID relationships work
- ✅ All block types can nest
- ⏳ Visual hints on drag-drop (Phase 2)
- ⏳ Droppable zone highlighting (Phase 2)

---

## 🚀 How to Use

### Start Everything

**Terminal 1** (Backend with SQLite):
```bash
cd server
npm start
```
Output: `✓ SQLite database initialized`  
Output: `🚀 Veltro Create API running on port 3001`

**Terminal 2** (Frontend):
```bash
npm run dev
```
Output: `➜ Local:   http://localhost:3000/`

**Browser**:
```
http://localhost:3000/framework-builder.html
```

### Workflow

1. **Create**: Add blocks to blank canvas
2. **Save**: "File" → "Save Project" → "My Project" → OK
3. **Edit**: Make more changes
4. **Save Again**: "File" → "Save Project" (updates existing)
5. **Create New**: Make new blank page, save as "Project 2"
6. **Switch**: "File" → "Load Project" → Select "My Project"
7. **Delete**: Load Project → Click × → Confirm

---

## 📁 Where Is Everything?

### Code
```
js/project.js              ← New project management
js/app.js                  ← Modified (clean slate)
js/pages.js                ← Modified (blank start)
server/                    ← Backend with SQLite
```

### Data
```
server/framework_builder.db ← Your projects (auto-created)
```

### Docs
```
QUICK_START.md             ← Get running in 2 min
SETUP_SQLITE_LOCAL.md      ← Full documentation
IMPLEMENTATION_SUMMARY.md  ← Technical details
```

---

## 💾 Save Your Projects

**Projects are stored in**: `server/framework_builder.db`

**Backup your projects**:
```bash
cp server/framework_builder.db server/framework_builder.backup.db
```

**Move projects to another machine**:
1. Copy `framework_builder.db` to the other machine's `server/` folder
2. Start backend and frontend
3. Your projects are there!

**Start fresh** (delete all projects):
```bash
rm server/framework_builder.db
```
Then restart backend (creates new empty database).

---

## ✨ Key Features

| Feature | Status | How to Use |
|---------|--------|-----------|
| **Clean Slate Load** | ✅ Ready | App loads blank automatically |
| **Save Project** | ✅ Ready | File menu → Save Project |
| **Load Project** | ✅ Ready | File menu → Load Project |
| **Delete Project** | ✅ Ready | Load Project → Click × |
| **Project List** | ✅ Ready | Load Project shows all projects |
| **Session Auto-Save** | ✅ Ready | Automatic every 30 seconds |
| **Nested Blocks** | ✅ Foundation | All block types support parent-ID |
| **Visual Drop Hints** | 📋 Phase 2 | Coming soon |

---

## 🔍 Technical Overview

### Frontend Architecture
```
User opens app
    ↓
js/app.js → FB.init()
    ↓
js/pages.js → Creates blank page
    ↓
js/project.js → Manages save/load
    ↓
Canvas renders blocks
    ↓
Every 30s → localStorage auto-save
```

### Backend Architecture
```
Express Server (port 3001)
    ↓
Routes: /api/projects
    ↓
SQLite Database
    ↓
SQLite File: framework_builder.db
```

### Data Flow: Save
```
User clicks "Save Project"
    ↓
Prompt for project name
    ↓
FB.project.saveProject(name)
    ↓
POST /api/projects
    ↓
SQLite: INSERT/UPDATE project
    ↓
Database saved
    ↓
Toast: "✓ Project saved"
```

### Data Flow: Load
```
User clicks "Load Project"
    ↓
Modal shows all projects
    ↓
GET /api/projects
    ↓
SQLite: SELECT * FROM projects
    ↓
Modal displays list
    ↓
User clicks project
    ↓
GET /api/projects/:id
    ↓
Canvas and pages restored
    ↓
Toast: "✓ Project loaded"
```

---

## 📊 Project Data Structure

What gets saved:

```json
{
  "pages": [
    {
      "id": "p_abc123",
      "name": "Home",
      "slug": "index",
      "blocks": [
        {
          "id": "b_1",
          "type": "hero",
          "props": { ... },
          "parentId": null,
          "columnIndex": 0
        }
      ],
      "title": "Home | My Site",
      "description": "Welcome to my site",
      "ogImage": "https://...",
      "favicon": "https://...",
      "customCSS": "/* custom styles */",
      "metalinks": [
        { "rel": "canonical", "href": "https://..." }
      ]
    }
  ],
  "currentPageId": "p_abc123"
}
```

Everything you see on canvas → Saved to database!

---

## 🎯 What's Next?

### Phase 2: Enhanced Nested UI
- Visual hints when dragging blocks over containers
- Highlight valid drop zones
- Better parent-child visualization

### Phase 3: User Features
- Project templates
- Project duplicating
- Favorites/star system
- Project search

### Phase 4: Scaling
- User accounts (if needed)
- Team collaboration
- Version history
- Real-time editing

---

## ❓ FAQ

**Q: Where are my projects stored?**  
A: In `server/framework_builder.db` on your machine.

**Q: Can I use this offline?**  
A: Yes! Everything is local. Just don't close the servers.

**Q: How do I back up my projects?**  
A: Copy `server/framework_builder.db` to a safe location.

**Q: Can I share projects between machines?**  
A: Yes! Copy the `.db` file to another machine's `server/` folder.

**Q: What if the database gets corrupted?**  
A: Delete `server/framework_builder.db` and restart. All projects lost, but DB fresh.

**Q: Does nested blocks work yet?**  
A: Foundation is ready! Drag-drop UI hints coming in Phase 2.

**Q: Can I have enterprise/cloud features?**  
A: The backend is designed to scale to PostgreSQL/MySQL if needed in the future.

---

## 📚 Documentation

1. **`QUICK_START.md`** ← Start here! (2-minute setup)
2. **`SETUP_SQLITE_LOCAL.md`** ← Full technical guide
3. **`IMPLEMENTATION_SUMMARY.md`** ← What was implemented
4. **`PAGE_METADATA_SYSTEM.md`** ← SEO per-page system

---

## 🎉 You're All Set!

Everything is ready to use. Just run:
```bash
# Terminal 1
cd server && npm start

# Terminal 2
npm run dev

# Browser
http://localhost:3000/framework-builder.html
```

Enjoy building with Veltro Create! 🚀
