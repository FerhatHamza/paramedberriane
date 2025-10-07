# paramedberriane - Starter project

This is a starter static + Worker project for the attendance system.

## Structure
- `index.html` - login page (Arabic)
- `dashboard.html` - responsable dashboard (Arabic)
- `admin.html` - admin dashboard (Arabic)
- `assets/logo.png` - provided logo
- `students_cleaned.json` - cleaned student data used by frontend stubs
- `worker.js` - Cloudflare Worker stub (replace with real logic)
- `schema.sql` - D1 schema for tables

## Quick steps
1. Upload this repo to GitHub.
2. Create a Pages project on Cloudflare and connect to the repo (`paramedberriane`).
3. Create a Worker and copy `worker.js` content, then bind your D1 database.
4. Use `schema.sql` or the generated `/mnt/data/import_students.sql` to fill `students` table.
