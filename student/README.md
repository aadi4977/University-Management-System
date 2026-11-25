# Feature: Student Portal (feature/student-portal)

The student side of the University Management System. Sidebar
student-panel layout, no backend -- everything on this branch is static
HTML/CSS, plus one small pure-CSS interaction for the notification bell.
No JavaScript anywhere in this branch -- same rule as `admin/`.

Each page lives in its own self-contained folder under `student/` -- its
own `index.html`, its own copy of the stylesheet as `index.css`, its own
`logo.png`, and its own `readme.md`. Nothing is fetched or included at
runtime; every page carries a full copy of its own sidebar and
notification dropdown, so any one of these folders still works correctly
opened on its own, straight from disk (no local server needed).

## Structure

    student/
    ├── dashboard/
    │   ├── index.html
    │   ├── index.css
    │   ├── logo.png
    │   └── readme.md
    ├── attendance/
    │   ├── index.html
    │   ├── index.css
    │   ├── logo.png
    │   └── readme.md
    └── result/
        ├── index.html
        ├── index.css
        ├── logo.png
        └── readme.md

See each folder's own `readme.md` for what that page does.

## Only 3 screens built so far

This drop covers **Dashboard, My Attendance and My Results** only, as
scoped for now. The sidebar on every page still lists My Courses, Fee
Status and Timetable so the navigation looks complete, but those three
are `href="#"` placeholders -- no folder exists for them yet. Add them
the same way these three were built: copy an existing folder, rename it,
fix the `href`s across all pages, and drop the `active` class onto the
new page's own nav link.

## Common to every student page (dashboard / attendance / result)

- Sidebar: Dashboard / My Attendance / My Results / My Courses / Fee
  Status / Timetable, GLA UMS logo and name at the top, Logout pinned to
  the bottom (points to `../../auth/login.html`). Full inline copy on
  every page, same reasoning as `admin/navbar/readme.md` -- plain HTML
  can't include one file inside another without a local server.
- Top bar: search box, the student profile chip (name + roll number),
  and a notification bell that opens a dropdown of 5 hardcoded sample
  notifications. Built with a hidden checkbox + a CSS `:checked ~`
  selector -- no JavaScript. Click the bell again, not click-outside, to
  close it.
- All numbers, table rows, and the profile identity are hardcoded
  placeholders -- swap them for real data once there's a backend to pull
  from.
- Every icon (sidebar, top bar, stat cards) is a [Bootstrap
  Icons](https://icons.getbootstrap.com/) glyph, loaded via CDN
  (`<link>` in `<head>` of each `index.html`) -- needs an internet
  connection to render.

## Theme

Uses the exact same `:root` color variables, font stack, card shapes and
component classes as `admin/` -- see `claude/theme-and-fonts.md` in the
project for the full palette/typography reference. Nothing was
reinvented; `stat-card`, `table-card`, `pill`, `event-list`, `avatar`,
`notif-*` etc. are byte-for-byte the same classes as the admin pages, so
a future shared stylesheet (or a rebrand) only needs one edit location.

New classes added on top of the admin set, specific to the student
portal's own content: `breadcrumb`, `page-select` (semester dropdown),
`welcome-banner` (dashboard greeting, plain white card -- no gradient,
same flat look as every other admin card), `dashboard-grid` /
`panel-card` / `mini-table` (dashboard's 3-column layout), `classes-list`
(Today's Classes), `search-mini` (small in-card search box), and
`att-good` / `att-ok` (attendance percentage colors, reusing the exact
`--green` / `--primary-light` tokens). Every stat card across all three
pages uses only admin's original four `stat-icon` colors (blue / green /
orange / purple) -- no new tint was invented, so the palette matches
admin pixel-for-pixel.

## Usage / integration

Drop this whole `student/` folder into the project root, next to
`admin/`, `auth/` and the root `index.html`. Every page here works opened
directly from disk -- no build step, no local server required.

Branch naming follows the team's convention from
`git_github_4_member_project_collaboration_guide.docx`: this folder ships
on `feature/student-portal` (or `feature/student`) and gets PR'd into
`dev`, same as `feature/auth` -> `auth/` and `feature/admin` -> `admin/`.
