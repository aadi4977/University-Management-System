# University Management System (UMS) — Front End

A role-based front-end for a university management system, built with **HTML5, CSS3, and vanilla JavaScript**. It brings student records, faculty details, course listings, attendance, marks, and fee status into three role-based dashboards — Administrator, Faculty, and Student — with no backend or database.

Built as a mini project for **B.Tech CSE, GLA University, Mathura** (Department of Computer Engineering Applications).

---

## Demo credentials

| Role          | Username    | Password      |
|---------------|-------------|---------------|
| Administrator | `admin`     | `admin123`    |
| Faculty       | `ysingh`    | `faculty123`  |
| Student       | `aadi`      | `student123`  |

---

## Features

**Administrator**
- Add, edit, and delete student, faculty, course, and fee records
- Real-time search, filter, and sort on every table
- Dashboard summary (enrolled students, faculty count, active courses, total dues)

**Faculty**
- Mark date-wise attendance for an assigned subject
- Enter internal and external marks with live total/grade calculation

**Student**
- View profile, subject-wise attendance percentage, marks and grades, and fee status
- Print-ready fee receipt and result sheet

---

## Tech stack

- **HTML5** — semantic structure for every screen
- **CSS3** — Flexbox, Grid, custom properties, media queries (no CSS framework)
- **JavaScript (ES6+)** — DOM rendering, validation, CRUD, search/filter/sort, calculations
- **Web Storage API (`localStorage`)** — client-side persistence; no server or database

---

## Folder structure

```
ums-frontend/
├── index.html          # Login (role-based)
├── admin.html           # Administrator dashboard
├── faculty.html          # Faculty dashboard
├── student.html          # Student dashboard
├── css/
│   ├── style.css        # Design system + all component styles
│   └── print.css        # Print stylesheet for receipts/result sheets
└── js/
    ├── data.js          # Seed data + localStorage-backed CRUD helpers
    ├── utils.js         # Icons, calculations, validation, table/modal/toast helpers
    ├── auth.js          # Client-side login simulation and role guard
    ├── admin.js         # Administrator dashboard logic
    ├── faculty.js        # Faculty dashboard logic
    └── student.js        # Student dashboard logic
```

---

## Getting started

No build step, no dependencies, no installation.

1. Download/unzip the project folder.
2. Open `index.html` in any modern browser (double-click works, or use a local server like VS Code's Live Server).
3. Sign in with one of the demo credentials above.

Data is seeded automatically into `localStorage` on first load, so edits made as Administrator are immediately visible on the Student/Faculty side, and persist across page reloads.

> To reset all data back to the seed values, clear the site's local storage from your browser's dev tools (Application → Local Storage) and reload.

---

## Design notes

The interface follows a "university registrar / academic ledger" identity rather than a generic dashboard template: navy and brass-gold palette, serif headings paired with a clean sans-serif for data-heavy screens, and ledger-style tables (horizontal rules only, sentence-case headers). All icons are hand-drawn inline SVG — no external icon library or font dependency, so the project runs fully offline.

---

## Scope

This submission covers the **front-end only**, per project scope. All data is either seeded sample data or handled client-side via `localStorage` to demonstrate interactivity — there is no real backend, API, or database. Back-end integration is a possible future extension beyond this mini project.

---

## Team

| Name                    | Roll No.     |
|-------------------------|--------------|
| Aadi Gupta               | 2415000001   |
| Abhimanyu Sharma          | 2415000028   |
| Abhishek Vishwakarma       | 2415000064   |
| Aditya Gupta              | 2415000089   |

**Supervisor:** Yash Singh Sir