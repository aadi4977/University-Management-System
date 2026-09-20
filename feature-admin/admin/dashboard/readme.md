# Feature: Dashboard (admin/dashboard)

Landing screen after admin login. Sidebar admin-panel layout.

## What it does

Four stat cards (Total Students / Total Faculty / Total Courses / Fee
Collected), a Student Distribution and a Faculty Distribution donut chart
(plain CSS `conic-gradient`, no chart library), and an Upcoming Events
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

Sits at `admin/dashboard/` in the project. All numbers -- stat cards,
chart values, event entries -- are hardcoded placeholders; swap them for
real data later. Chart totals match the stat cards (342 students, 28
faculty). The sidebar markup here is a self-contained copy, same as
every other admin page -- see `admin/navbar/readme.md` for where that
copy originates from.
