# Feature: Manage Courses (admin/manage-courses)

Admin screen listing course records, sidebar admin-panel layout.

## What it does

Three stat cards (Total Courses / Programs / Enrolled Students) + a
search box + a table of hardcoded course records (S.No, Course Code,
Course Name, Department, Program, Semester, Credits). No Action column
-- not needed for a static page with no backend. Notification bell opens
a dropdown of 5 hardcoded sample notifications -- pure HTML/CSS, no
JavaScript (click the bell again to close; no click-outside-to-close).
Icons are Bootstrap Icons via CDN.

## Files included

- `index.html`
- `index.css`
- `logo.png`

## Usage / integration

Sits at `admin/manage-courses/` in the project. Table rows are
hardcoded sample data -- swap them for real records later.
