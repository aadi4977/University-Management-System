# Faculty & Hierarchy (student/hierarchy)

## What is this page?
The page that shows who is who in the student's department, as an org chart from top to bottom.

## What can you do here?
- See the chain: **Vice Chancellor (VC) -> Head of Department (HOD) -> Program Coordinator (PC) -> Year Coordinator -> Class Advisor**
- See **My Faculty**: the teachers of this semester's subjects, with the subject name
- See **Other Faculty in the Department** who do not teach you this semester
- Every card has a name bar, role, photo and an **(i)** button that opens the details (phone, email, department)
- Faculty who are on leave are marked

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
- **Photos:** a simple avatar is shown for now. To show a real photo, make a folder `student/hierarchy/photos/` and add a picture named after the ID: `VC.jpg`, `HOD.jpg`, `PC.jpg`, `CA.jpg` (class advisor) or the faculty ID like `F001.jpg`.
- The VC, HOD, PC and Class Advisor names are saved in the `hierarchy` data in `js/storage.js` (change the names there). Phone numbers of VC / HOD / PC / Class Advisor are not added, so their (i) popup says "Not added yet".
