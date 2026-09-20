# Feature: Manage Students (admin/manage-students)

Admin screen listing student records, sidebar admin-panel layout.

## What it does

Three stat cards (Total / Active / On Leave) + a search box + a table of
hardcoded student records (S.No, Roll No, Name, Course, Semester,
Contact, Email, Status). No Action column -- kept out on purpose since
there is no backend to act on yet. Notification bell opens a dropdown of
5 hardcoded sample notifications -- pure HTML/CSS, no JavaScript (click
the bell again to close; no click-outside-to-close). Icons are Bootstrap
Icons via CDN.

## Files included

- `index.html`
- `index.css`
- `logo.png`

## Usage / integration

Sits at `admin/manage-students/` in the project. Table rows are
hardcoded sample data -- swap them for real records later.
