/* ==========================================================
   GLA UMS - Student dashboard script (student/dashboard/dashboard.js)
   Dashboard-only bits: time-based greeting, today's date.
   Everything else (profile, logout, search) is in ../student.js
   ========================================================== */

(function () {
  'use strict';

  var now = new Date();
  var hour = now.getHours();

  // Greeting
  var greeting = hour < 12 ? 'Good Morning,' : hour < 17 ? 'Good Afternoon,' : 'Good Evening,';
  var greetEl = document.querySelector('.welcome-text .greeting');
  if (greetEl) greetEl.textContent = greeting;

  // Name in the banner (keeps the wave emoji <span> intact)
  try {
    var session = JSON.parse(localStorage.getItem('ums_session'));
    var h1 = document.querySelector('.welcome-text h1');
    if (session && session.name && h1 && h1.firstChild) {
      h1.firstChild.textContent = session.name.trim().split(/\s+/)[0] + ' ';
    }
  } catch (e) { /* no session - leave placeholder name */ }

  // "Today's Classes" date label, e.g. "Wed, 28 Oct 2026"
  var dateEl = document.querySelector('.panel-date');
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('en-GB', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
  }
})();
