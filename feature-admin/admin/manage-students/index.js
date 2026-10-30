/* ==========================================================
   GLA UMS -- Manage Students (admin/manage-students/index.js)
   Plain JS, no libraries, no backend.

   1. Notification bell: close on outside click / Escape.
   2. Live search: the topbar search box and the table search
      box filter the same table and stay in sync with each
      other. Matches against the whole row (name, roll no,
      course, email, contact, status...).
   3. "No students found" row when nothing matches.
   ========================================================== */

(function () {
  'use strict';

  /* ---------- 1. Notification dropdown ---------- */

  var toggle = document.getElementById('notif-toggle');
  var wrap = document.querySelector('.notif-wrap');

  if (toggle && wrap) {
    document.addEventListener('click', function (e) {
      if (toggle.checked && !wrap.contains(e.target)) toggle.checked = false;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') toggle.checked = false;
    });
  }

  /* ---------- 2. Live search ---------- */

  var tbody = document.querySelector('.table-card tbody');
  if (!tbody) return;

  var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
  var colCount = document.querySelectorAll('.table-card thead th').length;

  var inputs = [
    document.querySelector('.topbar-search input'),
    document.querySelector('.table-search input')
  ].filter(Boolean);

  // pre-compute searchable text once per row
  var haystack = rows.map(function (r) {
    return r.textContent.replace(/\s+/g, ' ').toLowerCase();
  });

  /* ---------- 3. Empty-state row ---------- */

  var emptyRow = document.createElement('tr');
  var emptyCell = document.createElement('td');
  emptyCell.colSpan = colCount;
  emptyCell.style.textAlign = 'center';
  emptyCell.style.color = '#6b7280';
  emptyCell.style.padding = '28px 16px';
  emptyCell.textContent = 'No students found';
  emptyRow.appendChild(emptyCell);
  emptyRow.hidden = true;
  tbody.appendChild(emptyRow);

  function applyFilter(query) {
    var q = query.trim().toLowerCase();
    var shown = 0;
    rows.forEach(function (row, i) {
      var match = q === '' || haystack[i].indexOf(q) !== -1;
      row.hidden = !match;
      if (match) shown++;
    });
    emptyRow.hidden = shown !== 0;
  }

  inputs.forEach(function (input) {
    input.addEventListener('input', function () {
      // keep the other search box showing the same text
      inputs.forEach(function (other) {
        if (other !== input) other.value = input.value;
      });
      applyFilter(input.value);
    });
  });
})();
