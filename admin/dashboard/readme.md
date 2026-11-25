# Admin Dashboard (admin/dashboard)

## What is this page?
The first page the admin sees after login. It gives a quick summary of the whole university.

## What can you do here?
- See total students, faculty, courses and the fee collected (numbers come from the real saved data)
- See two donut charts: students by department and faculty by department
- See the list of upcoming events
- Press **Reset demo data** to bring back the starting demo data (useful before a presentation)

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
- The numbers match the Students, Faculty, Courses and Fees pages, so when you add or delete something there, this page changes too.
- The notification bell still shows sample messages (not connected to anything).
