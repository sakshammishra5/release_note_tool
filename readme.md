# ReleaseCheck

An all-in-one release checklist tool to track software release progress with a 10-step checklist.

**Live Demo:** [https://release-note-tool.vercel.app](https://release-note-tool.vercel.app)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL (Supabase) |
| Deployment | Vercel (Frontend) + Render (Backend) |

---

## How to Use

### 1. Create a New Release
- Click the **"+ New release"** button on the left sidebar.
- Enter a **Release Name / Version** (e.g., `v1.2.0`).
- Select a **Due Date**.
- Click **Create**. The new release will appear in the list.

### 2. View Release Details
- Click any release from the left sidebar list.
- The right panel will show:
  - Release name and due date
  - Current status badge (`planned` / `ongoing` / `done`)
  - A 10-step checklist
  - Additional notes section

### 3. Track Progress with Checklist
- Check or uncheck any item in the checklist.
- The status updates automatically:
  - **Planned** — 0 steps completed
  - **Ongoing** — 1 to 9 steps completed
  - **Done** — all 10 steps completed
- Your progress is saved instantly to the database.

### 4. Add Notes
- Type any additional information in the **"Additional Notes"** textarea.
- Click **"Save Notes"** to persist your notes.

### 5. Delete a Release
- Open the release you want to remove.
- Click the red **"Delete"** button in the top-right corner.
- Confirm the deletion.

---

## Project Structure

```
release_note_tool/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api/
│   │   │   └── api.js
│   │   └── components/
│   │       ├── Sidebar.jsx
│   │       ├── DetailPanel.jsx
│   │       └── NewReleaseModal.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Database Schema

```sql
CREATE TABLE releases (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date TIMESTAMP NOT NULL,
  additional_info TEXT,
  steps_completed INTEGER[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## API Endpoints

Base URL: `https://release-note-tool.onrender.com/api`

### 1. Get All Releases
```
GET /api/releases
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "Version 1.0.1",
    "date": "2026-07-26T10:00:00.000Z",
    "additional_info": "Hotfix for login bug",
    "steps_completed": [1, 2, 5],
    "created_at": "2026-07-26T08:00:00.000Z",
    "updated_at": "2026-07-26T09:00:00.000Z",
    "status": "ongoing"
  }
]
```

### 2. Create New Release
```
POST /api/releases
```
**Body:**
```json
{
  "name": "Version 1.0.2",
  "date": "2026-07-30T10:00:00",
  "additional_info": "Optional notes"
}
```
**Response:**
```json
{
  "id": 2,
  "name": "Version 1.0.2",
  "date": "2026-07-30T10:00:00.000Z",
  "additional_info": "Optional notes",
  "steps_completed": [],
  "created_at": "2026-07-26T08:00:00.000Z",
  "updated_at": "2026-07-26T08:00:00.000Z",
  "status": "planned"
}
```

### 3. Get Single Release
```
GET /api/releases/:id
```
**Response:**
```json
{
  "id": 1,
  "name": "Version 1.0.1",
  "date": "2026-07-26T10:00:00.000Z",
  "additional_info": "Hotfix for login bug",
  "steps_completed": [1, 2, 5],
  "created_at": "2026-07-26T08:00:00.000Z",
  "updated_at": "2026-07-26T09:00:00.000Z",
  "status": "ongoing"
}
```

### 4. Update Release Notes
```
PUT /api/releases/:id
```
**Body:**
```json
{
  "additional_info": "Updated release notes here"
}
```
**Response:**
```json
{
  "id": 1,
  "name": "Version 1.0.1",
  "date": "2026-07-26T10:00:00.000Z",
  "additional_info": "Updated release notes here",
  "steps_completed": [1, 2, 5],
  "created_at": "2026-07-26T08:00:00.000Z",
  "updated_at": "2026-07-26T10:30:00.000Z",
  "status": "ongoing"
}
```

### 5. Toggle Step Completion
```
PATCH /api/releases/:id/steps
```
**Body:**
```json
{
  "stepNumber": 3
}
```
- If step exists in `steps_completed`, it removes it (uncheck)
- If step does not exist, it adds it (check)

**Response:**
```json
{
  "id": 1,
  "name": "Version 1.0.1",
  "date": "2026-07-26T10:00:00.000Z",
  "additional_info": "Updated release notes here",
  "steps_completed": [1, 2, 3, 5],
  "created_at": "2026-07-26T08:00:00.000Z",
  "updated_at": "2026-07-26T10:35:00.000Z",
  "status": "ongoing"
}
```

### 6. Delete Release
```
DELETE /api/releases/:id
```
**Response:** `204 No Content`

---

## Release Checklist Steps

1. All relevant GitHub pull requests have been merged
2. Version number bumped in configuration files
3. Changelog updated with latest features/fixes
4. All unit and integration tests passing
5. Code review approved by at least one peer
6. Database migration scripts prepared and reviewed
7. Staging environment deployment successful
8. Smoke tests passed on staging environment
9. Deployment notification sent to stakeholders
10. Production deployment completed and verified

**Status Logic:**
- `planned` — 0 steps completed
- `ongoing` — 1 to 9 steps completed
- `done` — all 10 steps completed

---

## Local Setup

### Backend
```bash
cd backend
npm install
# Create .env file with DATABASE_URL
npm start
# Server runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
PORT=5000
```

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## Screenshots

*(Add screenshots of your app here)*

---

## Author

[Saksham Mishra](https://github.com/sakshammishra5)
