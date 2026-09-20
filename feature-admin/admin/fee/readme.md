# Feature: Fee Records (admin/fee)

Admin screen for fee records, sidebar admin-panel layout.

## What it does

Three plain stat cards (Total Fee Collected / Pending Amount / Students
with Dues -- no percentage badges or progress bars) + a search box + a
table of hardcoded fee records (S.No, Roll No, Name, Total Fee, Paid,
Balance, Status). "Students with Dues" counts rows where Status is
Pending. Notification bell opens a dropdown of 5 hardcoded sample
notifications -- pure HTML/CSS, no JavaScript (click the bell again to
close; no click-outside-to-close). Icons are Bootstrap Icons via CDN.

## Files included

- `index.html`
- `index.css`
- `logo.png`

## Usage / integration

Sits at `admin/fee/` in the project. Table rows are hardcoded sample
data -- swap them for real records later.
