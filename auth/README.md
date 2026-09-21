# Feature: Auth (Login + Role-based Authentication)

The login page for the University Management System, styled to feel like
a GLA University portal, with role-based authentication.

## What it does
Shows a login form (role, username, password). On submit, the page
checks the entered details against a small set of sample users (5
faculty, 1 student, 1 admin) -- there is no real backend, this is a
static HTML/CSS project, so the check runs in a `<script>` block inside
`login.html` itself. On a correct match it redirects to the right
dashboard (`admin-dashboard.html`, `faculty-dashboard.html` or
`student-dashboard.html`) and shows an error message otherwise.

## Files included
- `login.html` -- page markup + the login/authentication script (inline)
- `login.css` -- styling
- `logo.png` -- GLA UMS logo, shown next to the page title
- `login-illustration.png` -- side illustration image
- `README.md`

## Usage / integration
1. Place all files in the project root, next to the dashboard pages.
2. Open `login.html` in a browser.
3. Log in with a valid username/password for the selected role (get the
   sample list from whoever set up this feature, or check the script
   inside `login.html`) to see the role-based redirect work.
4. Replace the sample users inside `login.html` with real student/faculty
   data later, or swap in a real backend when the project needs one.
