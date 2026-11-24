# My Attendance (student/attendance)

## What is this page?
The page where a student checks attendance subject by subject, and plans how many classes to attend.

## What can you do here?
- See overall attendance, total subjects, subjects with 75% or more, and subjects below 75%
- See total classes, attended classes, percentage and status for every subject
- Search a subject by name
- Use the **Attendance Calculator**: pick a subject and a target %, enter how many next classes you will attend or miss, and it shows the new percentage plus how many classes you can still miss (or must attend) to reach the target

## What is used?
- **HTML + CSS** - the design of the page
- **JavaScript** (`index.js`) - makes the page work
- **jQuery** - makes the JavaScript shorter and easier
- **localStorage** - saves the data inside your browser (no server needed)
- **Formula:** Attendance % = (Attended Classes / Total Classes) x 100. Status: 90%+ Excellent, 75%+ Good, below 75% Low
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
- The semester dropdown moved to the My Results page.
- A student added newly by the admin or by Sign Up starts in the 1st semester with no attendance yet.
