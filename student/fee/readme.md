# Fee Status (student/fee)

## What is this page?
The page where a student sees the fee status and can open the payment QR.

## What can you do here?
- See Total Fee, Fee Paid and Balance Due
- Press **Pay My Fee**: if some fee is pending, a popup shows the pending amount with a QR code
- If the fee is already paid, a popup says "Already paid"

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
- The QR code is only a picture for the demo - it cannot be scanned for a real payment.
- The numbers are the same ones the admin sees on the Fees page.
