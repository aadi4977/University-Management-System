# My Results (student/result)

## What is this page?
The page where a student checks marks, grades, SGPA and CGPA of any semester.

## What can you do here?
- Choose a semester from the dropdown (1st semester up to the current one)
- See the semester, its SGPA, and the CGPA up to that semester
- See code, credits, grade, marks and Pass / Fail for every subject

## What is used?
- **HTML + CSS** - the design of the page
- **JavaScript** (`index.js`) - makes the page work
- **jQuery** - makes the JavaScript shorter and easier
- **localStorage** - saves the data inside your browser (no server needed)
- **Grade scale:** 90+ = A+, 80+ = A, 70+ = B+, 60+ = B, 50+ = C, 40+ = D, below 40 = F (Fail)
- **SGPA** = sum of (credits x grade point) / total credits. **CGPA** = same, but for every semester up to the chosen one
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
- A student added newly by the admin or by Sign Up starts in the 1st semester with no attendance yet.
