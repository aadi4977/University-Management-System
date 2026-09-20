# Feature: Manage Faculty (admin/manage-faculty)

Admin screen listing faculty records, sidebar admin-panel layout.

## What it does

Three stat cards (Total / On Leave / Departments) + a search box + a
table of hardcoded faculty records (S.No, Faculty ID, Name, Department,
Subjects Assigned, Contact, Email, Status). Contact is now a phone
number, separate from Email; Status is an Active/On Leave pill matching
the "On Leave" stat card. No avatar/initial icons before names, and no
Action column -- kept plain on purpose. Notification bell opens a
dropdown of 5 hardcoded sample notifications -- pure HTML/CSS, no
JavaScript (click the bell again to close; no click-outside-to-close).
Icons are Bootstrap Icons via CDN.

## Files included

- `index.html`
- `index.css`
- `logo.png`

## Usage / integration

Sits at `admin/manage-faculty/` in the project. Table rows are
hardcoded sample data -- swap them for real records later.
