# Feature: Student Dashboard (student/dashboard)

Landing screen after student login. Sidebar student-panel layout, matching
the admin portal's theme and structure exactly (same `:root` color
variables, fonts, card/table styles -- see `claude/theme-and-fonts.md` in
the project).

## What it does

A welcome banner greeting the student by name with a motivational quote,
three stat cards (Attendance / CGPA / Fees Due), a compact "Attendance By
Subject" table, a "Today's Classes" list, and an "Upcoming Events / Exams"
list. The notification bell opens a dropdown of 5 hardcoded sample
notifications -- pure HTML/CSS (a hidden checkbox + a `:checked ~`
selector), no JavaScript. Click the bell again to close it; there's no
click-outside-to-close, since that specifically needs JS.

All icons (sidebar, top bar, stat cards) are [Bootstrap
Icons](https://icons.getbootstrap.com/), loaded via CDN in `<head>` --
needs an internet connection to render, same as any icon-font CDN.

## Files included

- `index.html`
- `index.css`
- `logo.png`

## Usage / integration

Sits at `student/dashboard/` in the project (branch `feature/student`,
same convention as `feature/auth` -> `auth/` and `feature/admin` ->
`admin/`). All numbers -- stat cards, attendance %, classes, events -- are
hardcoded placeholders; swap them for real data later. The sidebar markup
here is a self-contained copy, same pattern as every admin page -- copy
it into any new student page and just fix the `href`s and the `active`
class.

## Not built yet

The sidebar lists My Courses, Fee Status and Timetable so the full
navigation is visible, but those pages don't exist yet -- their links are
`href="#"` placeholders. Only Dashboard, My Attendance and My Results are
live in this drop.
