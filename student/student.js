

(function () {
  'use strict';

  // Set to true once login is wired and you want unauthenticated
  // visitors bounced back to the login page.
  var REQUIRE_LOGIN = false;
  var SESSION_KEY = 'ums_session';

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch (e) { return null; }
  }

  var session = getSession();

  // ---- 1. Login guard ----
  if (REQUIRE_LOGIN && (!session || session.role !== 'student')) {
    window.location.href = '../../auth/login.html';
    return;
  }

  // ---- 2. Fill top-bar profile from the logged-in user ----
  if (session && session.name) {
    var nameEl = document.querySelector('.topbar-profile .name');
    var subEl = document.querySelector('.topbar-profile .sub');
    var avatarEl = document.querySelector('.topbar-profile .avatar');
    var first = session.name.trim().split(/\s+/)[0];
    if (nameEl) nameEl.textContent = first;
    if (subEl && session.userId) subEl.textContent = 'Roll No. ' + session.userId;
    if (avatarEl) avatarEl.textContent = first.charAt(0).toUpperCase();
  }

  // ---- 3. Logout: clear session, then let the link navigate ----
  document.querySelectorAll('a[href$="login.html"]').forEach(function (a) {
    a.addEventListener('click', function () {
      localStorage.removeItem(SESSION_KEY);
    });
  });

  // ---- 4. Table search (.search-mini / .table-search inputs) ----
  document.querySelectorAll('.search-mini input, .table-search input').forEach(function (input) {
    var scope = input.closest('.table-card') || document;
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      scope.querySelectorAll('tbody tr').forEach(function (row) {
        row.style.display = row.textContent.toLowerCase().indexOf(q) === -1 ? 'none' : '';
      });
    });
  });

  // ---- 5. Highlight today's column (timetable uses data-day="Mon".."Sat") ----
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var today = days[new Date().getDay()];
  document.querySelectorAll('[data-day="' + today + '"]').forEach(function (el) {
    el.classList.add('today');
  });
})();
