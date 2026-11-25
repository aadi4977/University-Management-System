# Timetable (student/timetable)

## What is this page?
The page that shows the student's weekly class schedule as a grid.

## What can you do here?
- See the week at a glance: time on the left (9 AM to 5 PM), Monday to Friday on top (no Saturday)
- Every box shows the subject and the room; empty slots show a dash
- A **Lunch Break** row sits between 12-1 and 2-3
- Today's column is highlighted automatically
- The Tuesday lab takes two slots (2 to 4 PM)

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
- Demo login for this page: roll no `2401001` (Aditya Gupta) / `student123` - or any other student roll no from the Students page
- All data is demo data. It is created automatically the first time you open the site.
- Comments like `//////// Search box` in `index.js` show which code belongs to which part of the page.
- The timetable is made from the subjects of the student's semester, and a subject never repeats on the same day. The dashboard's "Today's Classes" shows the same classes for today (Saturday and Sunday: no classes).
