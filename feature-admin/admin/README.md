# Feature: Admin Portal (feature/admin)

The admin side of the University Management System. Sidebar admin-panel
layout, no backend -- everything on this branch is static HTML/CSS, plus
one small pure-CSS interaction for the notification bell. No JavaScript
anywhere in this branch.

Each page lives in its own self-contained folder under `admin/` -- its
own `index.html`, its own copy of the stylesheet as `index.css`, its own
`logo.png`, and its own `readme.md`. Nothing is fetched or included at
runtime; every page carries a full copy of its own sidebar and
notification dropdown, so any one of these folders still works correctly
opened on its own, straight from disk (no local server needed).

## Structure

    admin/
    ├── dashboard/          (Aadi)
    │   ├── index.html
    │   ├── index.css
    │   └── readme.md
    ├── manage-students/    (Aadi)
    │   ├── index.html
    │   ├── index.css
    │   └── readme.md
    ├── manage-faculty/     (Aadi)
    │   ├── index.html
    │   ├── index.css
    │   └── readme.md
    ├── manage-courses/     (Abhi)
    │   ├── index.html
    │   ├── index.css
    │   └── readme.md
    ├── fee/                (Abhi)
    │   ├── index.html
    │   ├── index.css
    │   └── readme.md
    └── navbar/             -- reference only, not a live page
        ├── index.html
        ├── index.css
        ├── logo.png
        └── readme.md

See each folder's own `readme.md` for what that page does.

## Why there's a `navbar/` folder that isn't a "page"

Plain HTML has no way to include one file inside another, and the
JavaScript-`fetch()` version of that was tried and dropped -- it only
worked when the site was served through a local server, which was more
friction than it was worth here. So the sidebar is duplicated on purpose,
same as before, and `admin/navbar/` exists purely as the clean copy to
copy it *from* when adding a new page -- open `navbar/index.html` to see
it on its own, nothing links to it and it links nowhere. Full explanation
in `navbar/readme.md`.

## Common to every admin page (dashboard / manage-students /
manage-faculty / manage-courses / fee)

- Sidebar: Dashboard / Students / Faculty / Courses / Fees, GLA UMS logo
  and name at the top, Logout pinned to the bottom (points to
  `../../auth/login.html`). Full inline copy on every page -- see
  `navbar/readme.md` for why it's not shared at runtime.
- Top bar: search box, the Admin profile chip, and a notification bell
  that opens a dropdown of 5 hardcoded sample notifications. Built with
  a hidden checkbox + a CSS `:checked ~` selector -- no JavaScript.
  Click the bell again, not click-outside, to close it (that one
  specifically needs JS, which this branch doesn't use).
- All numbers and table rows are hardcoded placeholders -- swap them for
  real data once there's a backend to pull from.
- Every icon (sidebar, top bar, stat cards) is a [Bootstrap
  Icons](https://icons.getbootstrap.com/) glyph, loaded via CDN
  (`<link>` in `<head>` of each `index.html`) -- needs an internet
  connection to render.

## Usage / integration

Drop this whole `admin/` folder into the project root, next to `auth/`,
`faculty/`, `student/` and the root `index.html`. Every page here works
opened directly from disk -- no build step, no local server required.

See `admin-merge-git-workflow.md` (in the project) for how to commit and
push this branch.
