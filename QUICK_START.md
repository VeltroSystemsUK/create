# Quick Start - Veltro Create with SQLite

## 🚀 Get Running in 2 Minutes

### Prerequisites
- Node.js installed (you already have it for the frontend)
- That's it! No database setup needed.

### Step 1: Start Backend (SQLite)
```bash
cd server
npm start
```

Expected output:
```
✓ SQLite database initialized at: .../server/framework_builder.db
🚀 Veltro Create API running on port 3001
```

### Step 2: Start Frontend (in new terminal)
```bash
npm run dev
```

Expected output:
```
➜  Local:   http://localhost:3000/
```

### Step 3: Open App
```
http://localhost:3000/framework-builder.html
```

---

## ✅ You're Ready!

### Create & Save a Project
1. **Create**: Add blocks to canvas
2. **Save**: Click "File" > "Save Project" → Enter name → OK
3. **Load**: Click "File" > "Load Project" → Select project

### Session Auto-Save
- Works automatically every 30 seconds
- Safety net for crashes (not auto-restored on load)

---

## 📁 Where Is My Data?

All projects stored in: `server/framework_builder.db`

**Backup**: Just copy that file to another location  
**Reset**: Delete that file and restart (fresh start)

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot connect to API" | Check backend running on port 3001 |
| "Projects not saving" | Check `server/` has write permissions |
| "Cannot find api" | Verify `http://localhost:3001/api/health` works |

---

## 📖 Full Docs

See `SETUP_SQLITE_LOCAL.md` for detailed documentation.

---

## 🎯 Features

✅ Clean slate on app load (no auto-restore)  
✅ Save/Load projects to SQLite  
✅ Multiple projects  
✅ Delete projects  
✅ Session auto-save  
✅ Nested blocks foundation  

---

That's it! Enjoy building! 🎨
