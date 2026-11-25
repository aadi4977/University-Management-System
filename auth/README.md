# Auth (Login + Sign Up)

## What is this page?
The first pages of the website. `login.html` is where admin, faculty and students log in and are sent to their own dashboard. `signup.html` is where a new student or faculty member creates an account.

## What can you do here?
**Login (`login.html`)**
- Pick who you are with the **Admin / Faculty / Student** tabs, then type username (or email) and password
- Show / hide the password with the eye button
- **Quick demo login** buttons fill the form for you (handy for a presentation - delete the `demo-box` block in `login.html` to remove them)
- Admin goes to the Admin Dashboard, student to the Student Dashboard, faculty to the Faculty Dashboard
- Wrong password, empty fields or the wrong tab show a red message under the button
- There is a link to the Sign Up page

**Sign Up (`signup.html`)**
- Create a student or faculty account (name, role, roll no / ID, email, password)
- Password strength bar (very weak to strong), and the Roll No / ID hint changes with the role
- Checks: all fields filled, valid name and email, password at least 6 characters, both passwords match, roll no / ID and email not used before
- "Show passwords" checkbox works
- The new person appears on the admin's Students / Faculty page and can log in at once
- Admin accounts cannot be created here (the university office creates them)

## What is used?
- **HTML + CSS** - the design (soft blue and gold glow background, floating illustration, entrance animation)
- **JavaScript** - `login.js` for login, `auth.js` for sign up
- **jQuery** - makes the JavaScript shorter and easier
- **localStorage** - the saved user accounts, **sessionStorage** - who is logged in (until the tab is closed)
- **Bootstrap Icons** - the small icons

## Files
- `login.html`, `login.css`, `login.js`
- `signup.html`, `signup.css`, `auth.js`
- `logo.png`, `login-illustration.png`

## How the JavaScript is connected
`login.html` ends with these 4 lines, and `signup.html` has the same lines before its `auth.js` line:

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
<script src="../js/storage.js"></script>
<script src="../js/common.js"></script>
<script src="login.js"></script>
```

## Demo logins
| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` (or `admin@gla.ac.in`) | `admin123` |
| Student | roll no, e.g. `2401001` (or the student's email) | `student123` |
| Faculty | faculty ID, e.g. `F001` (or the faculty's email) | `faculty123` |

## Good to know
- **Faculty login** opens `faculty/dashboard/index.html`. If that page is not in the project yet, the login page shows "The Faculty portal is not ready yet" instead of a "Cannot GET" error. As soon as the page is added, the same login works.
- Passwords are saved as plain text because this is a demo project. A real system would never do that.
- Run the project with VS Code "Live Server" for the most reliable results.
