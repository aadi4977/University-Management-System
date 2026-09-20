# Feature: My Results (student/result)

Results page for the student portal. Sidebar student-panel layout, same
theme as the rest of `student/` and `admin/`.

## What it does

A breadcrumb (Dashboard > My Results), a page header, three stat cards
(current Semester / SGPA / CGPA), and a subject-wise result table
(Subject Code, Subject Name, Credits, Grade, Marks, Result pill).

All icons are [Bootstrap Icons](https://icons.getbootstrap.com/), loaded
via CDN in `<head>`.

## Files included

- `index.html`
- `index.css`
- `logo.png`

## Usage / integration

Sits at `student/result/` in the project. All numbers -- stat cards and
the table -- are hardcoded placeholders (same 6 subjects used on the
dashboard and the attendance page); swap them for real data once there's
a backend to pull from. The sidebar/topbar markup is a self-contained
copy, same as `student/dashboard/`.
