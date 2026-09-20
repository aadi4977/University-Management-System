# Feature: My Attendance (student/attendance)

Attendance page for the student portal. Sidebar student-panel layout,
same theme as the rest of `student/` and `admin/`.

## What it does

A breadcrumb (Dashboard > My Attendance), a page header with a semester
selector (native `<select>`, no JS -- only one hardcoded option for now),
four stat cards (Overall Attendance / Total Subjects / Subjects >= 75% /
Subjects < 75%), and a subject-wise attendance table with a search box
(the search box is a static input, not wired to anything, same pattern as
the admin table search boxes). A footnote explains how the percentage is
calculated.

All icons are [Bootstrap Icons](https://icons.getbootstrap.com/), loaded
via CDN in `<head>`.

## Files included

- `index.html`
- `index.css`
- `logo.png`

## Usage / integration

Sits at `student/attendance/` in the project. All numbers -- stat cards
and the table -- are hardcoded placeholders (same 6 subjects used on the
dashboard and the results page, for a consistent story across pages);
swap them for real data later. The sidebar/topbar markup is a
self-contained copy, same as `student/dashboard/`.
