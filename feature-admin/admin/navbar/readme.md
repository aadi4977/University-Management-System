# Reference: Navbar (admin/navbar)

Not a live page. Nothing links to this folder, and this folder doesn't
link anywhere. It exists purely so the sidebar markup has one place to
live and be copied from, instead of everyone re-typing it from memory or
copying it out of whichever page they have open.

## Why it's not "shared" the normal way

Plain HTML has no include mechanism, and the alternative -- fetching it
in with JavaScript at runtime -- was tried and rolled back: it needed the
site running through a local server to work at all (fetch() can't load a
local file from a plain double-clicked page), which was more friction
than it was worth for a static project like this. So instead of one file
every page *depends on* at runtime, this is one file every page *starts
from* at write-time -- each admin page still carries its own full copy of
the `<aside class="sidebar">` markup (see any `admin/<page>/index.html`),
kept in sync by hand. This folder is just the clean copy to copy from.

## What's in here

- `index.html` -- open it in a browser and you'll see exactly what the
  sidebar looks like, on its own. Every link is `#` on purpose.
- `index.css` -- same shared stylesheet as every other admin page (the
  `.sidebar` / `.side-nav` / `.sidebar-footer` rules), so what you copy
  here matches what you paste elsewhere exactly.
- `logo.png` -- same GLA UMS logo the sidebar uses.

## Adding a new admin page

1. Copy the `<aside class="sidebar">...</aside>` block from here (or
   from any existing `admin/<page>/index.html` -- they're identical) into
   your new page's `<div class="app-shell">`.
2. Update the `href`s to point at your new page's siblings, and move the
   `class="active"` to your new page's own nav item.
3. Point Logout at `../../auth/login.html` (same as every other admin
   page).
