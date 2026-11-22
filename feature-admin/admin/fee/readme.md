# Fee Records (admin/fee)

## What is this page?
The page where the admin tracks the fee of every student.

## What can you do here?
- See Total Fee, Paid, Balance and status (Paid / Pending) for every student
- Balance and status are worked out automatically: Balance = Total Fee - Paid
- Search by roll no or name
- Update the Total Fee or the Paid amount of a student (paid cannot be more than total)
- The cards at the top (Collected / Pending / Students with Dues) update by themselves

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
- When the admin marks a fee as paid, the student sees it on the Fee Status page at once (the Pay My Fee button then says "already paid").
- Fee records are created automatically when a student is added (default total fee: Rs. 1,20,000).
- The top search bar was removed. The search box above the table is the one that works.
- The notification bell still shows sample messages (not connected to anything).
