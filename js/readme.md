# Shared JavaScript (js/)

## What is this folder?
The two files that **every page** uses. They are loaded before the page's own `.js` file.

| File | What it does |
| --- | --- |
| `storage.js` | The data. Saves and reads students, faculty, courses, fees, curriculum (subjects of every semester), teaching (who teaches what), hierarchy, attendance, marks and events in the browser (localStorage). Also creates the demo data. |
| `common.js` | Shared helpers: who is logged in, page guard (only the right role can open a page), popup form and info popup, small messages (toast), search helper, fake QR code, weekly timetable maker, and calculations (attendance %, grade, SGPA, CGPA, attendance calculator). |

## Start here (3 steps)
1. Copy this `js/` folder to the project root (next to `auth/`, `admin/`, `student/`).
2. Every HTML page already has the 4 script lines at its end. For a new page (for example the faculty portal) paste the same 4 lines before `</body>` and call `UMS.requireRole('faculty')` at the top of its script.
3. Open `auth/login.html` and log in with a demo login below.

## Demo logins
| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `admin123` |
| Student | `2401001` (Aditya Gupta) | `student123` |
| Faculty | `F001` | `faculty123` |

## How the pages work together
- Admin adds a student (or a student signs up) -> the student can log in at once and sees his/her own pages.
- Admin deletes a student -> login, fee, attendance and results are removed too.
- Admin marks a fee as paid -> the student's Fee Status page changes.
- Numbers on the dashboards are counted from the saved data, so they always match the other pages.
- Attendance %, grades, SGPA, CGPA and fee balance are **calculated every time**, never typed in.

## Good to know
- **Demo data version:** `storage.js` has a `SEED_VERSION` number. When the demo data changes (this update changed names, subjects and marks), the demo data is re-created once in each browser, which removes records added by hand before. To start fresh at any time, press **Reset demo data** on the Admin Dashboard.
- **Hierarchy refresh:** the VC / HOD / PC / Class Advisor list has its own `HIERARCHY_VERSION`, so changing it updates the hierarchy in every browser **without** removing other saved data.
- **Run it with VS Code "Live Server"** (or any local server). Opening the HTML files by double-click can make `localStorage` behave differently in some browsers.
- Comments like `//////// Search box` mark which code belongs to which part of the page.
- jQuery is loaded from the internet (CDN), the same way as Bootstrap Icons.

## Folder map
```
project-root/
|-- js/                 storage.js, common.js, readme.md
|-- auth/               login.html/.css/.js, signup.html/.css, auth.js, README.md
|-- admin/<page>/       index.html, index.css, index.js, readme.md   (dashboard, manage-students, manage-faculty, manage-courses, fee)
|-- faculty/            dashboard.html, attendance.html, results.html, faculty.css + their .js (faculty portal)
`-- student/<page>/     index.html, index.css, index.js, readme.md   (dashboard, attendance, result, courses, fee, timetable, hierarchy)
```
