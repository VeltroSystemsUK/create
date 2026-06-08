# Design Decisions — Veltro Create

Key decisions from archived brainstorm sessions:

## CMS Architecture (session 27834)
- **Decision**: Extend server.py — single codebase, one port
- **Storage**: File-based JSON (cms-schema.json, cms-content.json)
- **Auth**: Session-based, salted SHA256 password hash
- **Editing**: Both inline + admin dashboard
- **Schema**: Auto-detect editable fields per block type
- **Implemented**: server.py (all endpoints)

## Help System (session 20619)
- **Decision**: Tour + Help Centre combined
- **Icons**: Single colour (#CDFE00/#555) — V3
- **Tour**: 8-step guided walkthrough with driver.js
- **Placement**: ? button in toolbar
- **Implemented**: In builder HTML (dist/framework-builder.html)

## Improvement Plan (session 27377)
- **Analysis**: 8 real agency sites audited
- **15 new blocks planned**: Video Hero, Split Hero, etc.
- **8 blocks built**: nav, hero, marquee, work, services, stats, testimonials, cta, footer

## Veltro Engine (session 29016)
- 70+ visual effects catalogued
- Subset implemented in builder

## Archived sessions
- 10525, 17240, 21753, 21977, 22702 — incremental revisions
- See .designs/archive/ for full context
