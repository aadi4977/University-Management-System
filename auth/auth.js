/* ==========================================================
   GLA UMS - Auth script (auth/auth.js)
   Handles BOTH signup.html and login.html. Basic on purpose.

   !! DEMO ONLY !!  Users + passwords live in localStorage in
   plain text. Fine for a static college demo, NOT real auth.
   Swap the two marked functions for fetch() calls once a
   backend exists.

   Form contract (ids the HTML must have):
     signup.html : #signup-form  #name  #userid  #email  #role
                   #password  #confirm  #form-msg   (+ optional #show-pass)
     login.html  : #login-form   #identifier (or #email)  #password
                   #form-msg     (+ optional #role, #show-pass)
   ========================================================== */

(function () {
  'use strict';

  var USERS_KEY = 'ums_users';
  var SESSION_KEY = 'ums_session';

  var HOME = {
    student: '../student/dashboard/index.html',
    admin: '../admin/dashboard/index.html'
    // faculty: no portal built yet
  };

  function $(id) { return document.getElementById(id); }

  // ---------- storage ----------
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveUsers(list) { localStorage.setItem(USERS_KEY, JSON.stringify(list)); }

  // Seed two demo accounts so login works before anyone signs up.
  if (getUsers().length === 0) {
    saveUsers([
      { name: 'Aadi', userId: '21BCE1234', email: 'student@gla.ac.in', role: 'student', password: 'student123' },
      { name: 'Admin', userId: 'ADMIN01', email: 'admin@gla.ac.in', role: 'admin', password: 'admin123' }
    ]);
  }

  // ---------- ui helpers ----------
  function showMsg(text, type) {
    var el = $('form-msg');
    if (!el) { alert(text); return; }
    el.textContent = text;
    el.className = 'form-msg ' + (type || 'error');
    el.hidden = false;
  }

  function wireShowPassword() {
    var box = $('show-pass');
    if (!box) return;
    box.addEventListener('change', function () {
      ['password', 'confirm'].forEach(function (id) {
        if ($(id)) $(id).type = box.checked ? 'text' : 'password';
      });
    });
  }

  // ---------- SIGNUP ----------
  // >>> replace with fetch('/api/signup') later
  function createUser(user) {
    var users = getUsers();
    var email = user.email.toLowerCase();
    var uid = user.userId.toLowerCase();
    for (var i = 0; i < users.length; i++) {
      if (users[i].email.toLowerCase() === email) return { ok: false, error: 'This email is already registered.' };
      if (users[i].userId.toLowerCase() === uid) return { ok: false, error: 'This Roll No / ID is already registered.' };
    }
    users.push(user);
    saveUsers(users);
    return { ok: true };
  }

  var signupForm = $('signup-form');
  if (signupForm) {
    wireShowPassword();
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = $('name').value.trim();
      var userId = $('userid').value.trim();
      var email = $('email').value.trim();
      var role = $('role').value;
      var password = $('password').value;
      var confirm = $('confirm').value;

      if (!name || !userId || !email || !role || !password || !confirm) return showMsg('Please fill in all fields.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showMsg('Enter a valid email address.');
      if (password.length < 6) return showMsg('Password must be at least 6 characters.');
      if (password !== confirm) return showMsg('Passwords do not match.');

      var result = createUser({ name: name, userId: userId, email: email, role: role, password: password });
      if (!result.ok) return showMsg(result.error);

      showMsg('Account created! Redirecting to login...', 'success');
      setTimeout(function () { window.location.href = 'login.html'; }, 1200);
    });
  }

  // ---------- LOGIN ----------
  // >>> replace with fetch('/api/login') later
  function authenticate(identifier, password, role) {
    var id = identifier.toLowerCase();
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      var u = users[i];
      var idMatch = u.email.toLowerCase() === id || u.userId.toLowerCase() === id;
      if (idMatch && u.password === password && (!role || u.role === role)) return u;
    }
    return null;
  }

  var loginForm = $('login-form');
  if (loginForm) {
    wireShowPassword();
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var idInput = $('identifier') || $('email');
      var identifier = idInput ? idInput.value.trim() : '';
      var password = $('password').value;
      var role = $('role') ? $('role').value : '';

      if (!identifier || !password) return showMsg('Enter your email / ID and password.');

      var user = authenticate(identifier, password, role);
      if (!user) return showMsg('Invalid credentials. Check your details and role.');

      // never store the password in the session
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        name: user.name, userId: user.userId, email: user.email, role: user.role
      }));

      if (!HOME[user.role]) return showMsg('Login ok, but the ' + user.role + ' portal is not built yet.', 'success');
      window.location.href = HOME[user.role];
    });
  }
})();
