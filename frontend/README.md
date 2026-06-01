# FreshKeeper — Frontend (React)

A React frontend for the FreshKeeper food inventory and recipe management app.

---

## Setup & Running

### Prerequisites
- Node.js installed
- Backend server from Assignment 2 running on **http://localhost:3000**

### Install dependencies
```bash
npm install
```

### Start the app
```bash
npm start
```

The app opens at **http://localhost:3001** (React uses 3001 automatically if 3000 is taken by the backend).

### API Base URL
All API calls go to: `http://localhost:3000`

---

## How to use

1. Make sure the **backend is running** (`npm start` in the freshkeeper backend folder)
2. Start the frontend (`npm start` in this folder)
3. Open http://localhost:3001
4. Log in with any email/password (min 6 chars) and choose a role

---

## Roles

| Role | What they can do |
|------|-----------------|
| admin | Full access — manage users, items, recipes |
| employee | Add/edit items and recipes, cannot delete |
| consumer | View items, update quantities, suggest recipes |

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Sign in with email + password |
| Dashboard | `/dashboard` | Overview of pantry and expiring items |
| Pantry | `/items` | Full inventory — cards or table view |
| Recipes | `/recipes` | Browse recipes, AI ingredient matcher |
| Users | `/users` | Admin only — manage all users |
| Settings | `/settings` | Profile, preferences, notifications |

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.js / Navbar.css
│   ├── Footer.js / Footer.css
│   ├── Layout.js / Layout.css
│   ├── ItemCard.js / ItemCard.css     ← reusable card (used 3+ times)
│   └── DataTable.js / DataTable.css  ← reusable table
├── pages/
│   ├── Login.js / Login.css
│   ├── Dashboard.js / Dashboard.css
│   ├── Items.js / Items.css
│   ├── Recipes.js / Recipes.css
│   ├── Users.js / Users.css
│   └── Settings.js / Settings.css
├── services/
│   └── api.js   ← all backend communication
├── App.js       ← routing
└── index.js
```
