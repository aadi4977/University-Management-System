# Manage Faculty (admin/manage-faculty)

## What is this page?
The page where the admin sees and manages all faculty members.

## What can you do here?
- See all faculty in a table (the "On Leave" status stays on one line)
- Search by name, ID, department, subject or email
- Add a new faculty member - this also creates their login (password `faculty123`)
- Edit a faculty member (the Faculty ID cannot be changed)
- Delete a faculty member - their login is removed too
- The cards at the top (Total / On Leave / Departments) update by themselves

## What is used?
- **HTML + CSS** - the design of the page
- **JavaScript** (`index.js`) - makes the page work
- **jQuery** - makes the JavaScript shorter and easier
- **localStorage** - saves the data inside your browser (no server needed)
- **Bootstrap Icons** - the small icons

## Files
- `index.html` and `index.css` - the page and its design
- `index.js` - the working part of this page
- `logo.png` - the GLA UMS logo

## How the JavaScript is connected
These 4 lines are already at the end of `index.html`, just before `</body>`:

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
<script src="../../js/storage.js"></script>
<script src="../../js/common.js"></script>
<script src="index.js"></script>
```

## Good to know
- Demo login for this page: `admin` / `admin123`
- All data is demo data. It is created automatically the first time you open the site.
- Comments like `//////// Search box` in `index.js` show which code belongs to which part of the page.
- The subjects written here are the ones students see on their Faculty & Hierarchy page.
- The top search bar was removed. The search box above the table is the one that works.
- The notification bell still shows sample messages (not connected to anything).
