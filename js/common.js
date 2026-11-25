/* ==========================================================
   University Management System (GLA University Mathura)
   common.js  ->  SHARED HELPERS (used by auth, admin and student)

   Needs jQuery and storage.js to be loaded before this file.
   Contains: login session, page guard, small UI helpers
   (toast, popup form, search), and calculations (%, grade, CGPA).
   ========================================================== */

window.UMS = window.UMS || {};

(function ($) {

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


  //////// Project root + page links (works from any folder depth)

  // common.js lives in <root>/js/ so the root is everything before "js/common.js"
  const ROOT = document.currentScript.src.replace(/js\/common\.js.*$/, '');
  const LOGIN_PAGE = ROOT + 'auth/login.html';
  const HOME_PAGE = {
    admin: ROOT + 'admin/dashboard/index.html',
    student: ROOT + 'student/dashboard/index.html',
    faculty: ROOT + 'faculty/dashboard.html'
  };
  UMS.pages = { root: ROOT, login: LOGIN_PAGE, home: HOME_PAGE };
  UMS.goHome = role => { location.href = HOME_PAGE[role] || LOGIN_PAGE; };


  //////// Login session (kept in sessionStorage, cleared when the tab closes)

  UMS.getSession = function () {
    try { return JSON.parse(sessionStorage.getItem('ums_session')); } catch (e) { return null; }
  };

  UMS.login = function (user) {
    sessionStorage.setItem('ums_session', JSON.stringify({ username: user.username, role: user.role, name: user.name, ref: user.ref }));
  };

  UMS.logout = function () {
    sessionStorage.removeItem('ums_session');
  };

  // Page guard: call at the top of every protected page.
  // Not logged in -> login page. Wrong role -> that user's own dashboard.
  UMS.requireRole = function (role) {
    const s = UMS.getSession();
    if (!s) { location.replace(LOGIN_PAGE); return null; }

    // the account must still exist (admin may have deleted it) - also keeps the saved name up to date
    const account = UMS.store.findRecord('users', s.username);
    if (!account) { UMS.logout(); location.replace(LOGIN_PAGE); return null; }
    if (account.name !== s.name) { s.name = account.name; sessionStorage.setItem('ums_session', JSON.stringify(s)); }

    if (s.role !== role) { location.replace(HOME_PAGE[s.role] || LOGIN_PAGE); return null; }
    return s;
  };

  //////// Top bar profile (avatar letter, full name, roll no) - the little dropdown arrow is removed

  UMS.fillProfile = function (s) {
    const name = s.name || 'User';
    $('.topbar-profile .avatar').text(name.charAt(0).toUpperCase());
    $('.topbar-profile .name').text(name);
    if (s.role === 'student') $('.topbar-profile .sub').text('Roll No. ' + s.ref);
    $('.profile-chevron').remove();
  };

  //////// Logout button (sidebar footer) - clears the session, then the link opens login page

  $(document).on('click', '.sidebar-footer a', function () { UMS.logout(); });


  //////// Small text / number helpers

  UMS.esc = function (v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  };

  UMS.rs = n => 'Rs. ' + Number(n || 0).toLocaleString('en-IN');

  UMS.statusPill = status => '<span class="pill ' + (status === 'Active' ? 'green' : 'orange') + '">' + UMS.esc(status) + '</span>';

  UMS.todayText = function () {
    const d = new Date();
    return DAYS[d.getDay()] + ', ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  };

  UMS.eventDate = function (daysFromNow) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return { day: String(d.getDate()).padStart(2, '0'), mon: MONTHS[d.getMonth()] };
  };

  // HTML for the "Upcoming Events" list (same markup as the original page)
  UMS.eventsHtml = function (role, limit) {
    return UMS.store.getRecords('events')
      .filter(e => e.role === role)
      .sort((a, b) => a.days - b.days)
      .slice(0, limit || 999)
      .map(e => {
        const d = UMS.eventDate(e.days);
        return '<li><div class="event-date"><div class="day">' + d.day + '</div><div class="mon">' + d.mon + '</div></div>' +
               '<div class="event-info"><div class="title">' + UMS.esc(e.title) + '</div><div class="meta">' + UMS.esc(e.meta) + '</div></div></li>';
      }).join('');
  };


  //////// Search box helper (keeps two search boxes in sync, calls back with the text)

  UMS.bindSearch = function (selector, callback) {
    $(selector).on('input', function () {
      $(selector).not(this).val($(this).val());
      callback($(this).val().trim().toLowerCase());
    });
  };


  //////// Toast message (small message at the bottom of the screen)

  UMS.toast = function (message, type) {
    const $t = $('<div class="ums-toast" role="status"></div>').addClass(type || 'success').text(message).appendTo('body');
    setTimeout(() => $t.addClass('show'), 20);
    setTimeout(() => { $t.removeClass('show'); setTimeout(() => $t.remove(), 300); }, 2600);
  };


  //////// Popup form (used for Add / Edit in admin pages)
  //
  // UMS.openForm({
  //   title: 'Add Student',
  //   fields: [{ name, label, type, required, readonly, value, options, placeholder }],
  //   onSubmit: function (values) { return 'error text' }   // return nothing = success, popup closes
  // });

  UMS.openForm = function (opts) {
    $('.ums-overlay').remove();

    const $overlay = $('<div class="ums-overlay"></div>');
    const $box = $('<div class="ums-modal" role="dialog" aria-modal="true"></div>').appendTo($overlay);
    $('<h3></h3>').text(opts.title).appendTo($box);
    const $form = $('<form novalidate></form>').appendTo($box);
    const inputs = {};

    opts.fields.forEach(function (f) {
      const $row = $('<div class="ums-field"></div>').appendTo($form);
      $('<label></label>').text(f.label + (f.required ? ' *' : '')).appendTo($row);

      let $input;
      if (f.options) {
        $input = $('<select></select>');
        f.options.forEach(o => $('<option></option>').val(o).text(o).appendTo($input));
      } else {
        $input = $('<input autocomplete="off">').attr('type', f.type || 'text');
        if (f.placeholder) $input.attr('placeholder', f.placeholder);
      }
      $input.attr('name', f.name).val(f.value == null ? '' : f.value);
      if (f.readonly) $input.prop('disabled', true);
      inputs[f.name] = $input.appendTo($row);
    });

    const $error = $('<div class="ums-error" role="alert"></div>').appendTo($form);
    const $actions = $('<div class="ums-form-actions"></div>').appendTo($form);

    function close() {
      $(document).off('keydown.umsModal');
      $overlay.remove();
    }

    $('<button type="button" class="ums-btn">Cancel</button>').on('click', close).appendTo($actions);
    $('<button type="submit" class="ums-btn primary"></button>').text(opts.submitText || 'Save').appendTo($actions);

    $form.on('submit', function (e) {
      e.preventDefault();
      const values = {};
      opts.fields.forEach(f => {
        const v = inputs[f.name].val();
        values[f.name] = typeof v === 'string' ? v.trim() : v;
      });
      const missing = opts.fields.find(f => f.required && !values[f.name]);
      const error = missing ? missing.label + ' is required.' : opts.onSubmit(values);
      if (error) { $error.text(error); return; }
      close();
    });

    $overlay.on('mousedown', e => { if (e.target === $overlay[0]) close(); });
    $(document).on('keydown.umsModal', e => { if (e.key === 'Escape') close(); });

    $overlay.appendTo('body');
    $form.find('input:not(:disabled), select:not(:disabled)').first().trigger('focus');
  };


  //////// Info popup (read only): UMS.openInfo({ title, html })
  // Closes with the Close button, the Escape key, or a click outside.

  UMS.openInfo = function (opts) {
    $('.ums-overlay').remove();

    const $overlay = $('<div class="ums-overlay"></div>');
    const $box = $('<div class="ums-modal ums-modal-info" role="dialog" aria-modal="true"></div>').appendTo($overlay);
    $('<h3></h3>').text(opts.title).appendTo($box);
    $('<div class="ums-info"></div>').html(opts.html).appendTo($box);

    function close() {
      $(document).off('keydown.umsModal');
      $overlay.remove();
    }

    $('<div class="ums-form-actions"></div>').append($('<button type="button" class="ums-btn primary">Close</button>').on('click', close)).appendTo($box);
    $overlay.on('mousedown', e => { if (e.target === $overlay[0]) close(); });
    $(document).on('keydown.umsModal', e => { if (e.key === 'Escape') close(); });
    $overlay.appendTo('body');
    $box.find('.ums-btn').trigger('focus');
  };


  //////// Fake QR code (for the demo "Pay My Fee" popup - it is only a picture, nothing to scan)

  UMS.fakeQr = function (seedText) {
    const N = 29;
    let h = 2166136261;
    String(seedText).split('').forEach(ch => { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; });
    const rnd = () => { h = (Math.imul(h, 1664525) + 1013904223) >>> 0; return h / 4294967296; };

    // random dots
    const grid = [];
    for (let r = 0; r < N; r++) { grid.push([]); for (let c = 0; c < N; c++) grid[r].push(rnd() > 0.5); }

    // timing lines
    for (let k = 8; k < N - 8; k++) { grid[6][k] = k % 2 === 0; grid[k][6] = k % 2 === 0; }

    // three square "finder" marks in the corners (with a white gap around them)
    function finder(r0, c0) {
      for (let i = -1; i <= 7; i++) {
        for (let j = -1; j <= 7; j++) {
          const r = r0 + i, c = c0 + j;
          if (r < 0 || c < 0 || r >= N || c >= N) continue;
          const inside = i >= 0 && i <= 6 && j >= 0 && j <= 6;
          const ring = i === 0 || i === 6 || j === 0 || j === 6;
          const core = i >= 2 && i <= 4 && j >= 2 && j <= 4;
          grid[r][c] = inside && (ring || core);
        }
      }
    }
    finder(0, 0); finder(0, N - 7); finder(N - 7, 0);

    let path = '';
    grid.forEach((row, r) => row.forEach((on, c) => { if (on) path += 'M' + c + ' ' + r + 'h1v1h-1z'; }));
    return '<svg class="ums-qr" viewBox="-2 -2 ' + (N + 4) + ' ' + (N + 4) + '" role="img" aria-label="Demo QR code" shape-rendering="crispEdges">' +
           '<rect x="-2" y="-2" width="' + (N + 4) + '" height="' + (N + 4) + '" fill="#fff"/><path d="' + path + '" fill="#111827"/></svg>';
  };


  //////// Weekly timetable made from a student's subjects (same for the dashboard and the Timetable page)
  // Time slots of a day: 9-10, 10-11, 11-12, 12-1, (lunch 1-2), 2-3, 3-4, 4-5
  // Returns { 1: [classes of Monday], ... 5: [classes of Friday] }. Every class has: slot, start, end, title, room.
  // Days have different numbers of classes (empty slots are simply missing). Saturday and Sunday have no classes.

  UMS.TIMETABLE_SLOTS = [['9:00 AM', '10:00 AM'], ['10:00 AM', '11:00 AM'], ['11:00 AM', '12:00 PM'], ['12:00 PM', '1:00 PM'], ['2:00 PM', '3:00 PM'], ['3:00 PM', '4:00 PM'], ['4:00 PM', '5:00 PM']];

  const DAY_SLOTS = { 1: [0, 1, 2, 3, 6], 2: [0, 1, 2, 4, 5, 6], 3: [0, 1, 3, 4, 5], 4: [0, 1, 2, 5, 6], 5: [0, 2, 3, 4, 6] };
  const LAB_DAY = 2, LAB_SLOTS = [4, 5];   // the 2-hour lab is on Tuesday afternoon (2 to 4)
  const ROOMS = ['B-204', 'B-301', 'C-105', 'B-402'];
  const nameOf = sub => sub.name || sub.subject;
  const isLab = sub => /Lab$/i.test(nameOf(sub));

  UMS.timetableFor = function (subjects) {
    const week = {};
    if (!subjects.length) return week;

    const labs = subjects.filter(isLab);
    const theory = subjects.filter(sub => !isLab(sub));
    const pool = theory.length ? theory : subjects;
    let next = 0;   // theory subjects are used one after the other, so a subject never repeats on the same day

    for (let day = 1; day <= 5; day++) {
      week[day] = DAY_SLOTS[day].map(slot => {
        const sub = labs.length && day === LAB_DAY && LAB_SLOTS.indexOf(slot) !== -1 ? labs[0] : pool[next++ % pool.length];
        return {
          slot: slot, start: UMS.TIMETABLE_SLOTS[slot][0], end: UMS.TIMETABLE_SLOTS[slot][1],
          title: nameOf(sub), room: isLab(sub) ? 'Lab-2' : ROOMS[subjects.indexOf(sub) % ROOMS.length]
        };
      });
    }
    return week;
  };


  //////// Calculations (percentage, grade, SGPA, CGPA) - never stored, always worked out

  const GRADES = [[90, 'A+', 10], [80, 'A', 9], [70, 'B+', 8], [60, 'B', 7], [50, 'C', 6], [40, 'D', 5], [0, 'F', 0]];

  UMS.calc = {

    percent: (attended, total) => total ? (attended / total) * 100 : 0,

    // label + colours for an attendance percentage
    attendanceLabel: function (p) {
      if (p >= 90) return { text: 'Excellent', pill: 'green',  cls: 'att-good' };
      if (p >= 80) return { text: 'Good',      pill: 'green',  cls: 'att-good' };
      if (p >= 75) return { text: 'Good',      pill: 'green',  cls: 'att-ok' };
      return { text: 'Low', pill: 'orange', cls: 'att-low' };
    },

    grade: function (score) {
      const g = GRADES.find(x => score >= x[0]);
      return { letter: g[1], point: g[2], pass: g[2] > 0 };
    },

    // SGPA = sum(credits x grade point) / sum(credits)
    sgpa: function (marksList) {
      let points = 0, credits = 0;
      marksList.forEach(m => { points += UMS.calc.grade(m.marks).point * m.credits; credits += m.credits; });
      return { sgpa: credits ? points / credits : 0, credits: credits };
    },

    // SGPA of one semester of one student
    semesterSgpa: function (roll, sem) {
      return UMS.calc.sgpa(UMS.store.getRecords('marks').filter(m => m.roll === roll && m.sem === sem));
    },

    // CGPA = every semester from the 1st up to "uptoSem", weighted by credits
    cgpa: function (roll, uptoSem) {
      return UMS.calc.sgpa(UMS.store.getRecords('marks').filter(m => m.roll === roll && m.sem <= uptoSem)).sgpa;
    },

    // Attendance calculator: how many classes must be attended in a row to reach the target %?
    classesNeeded: function (attended, total, target) {
      if (attended / total * 100 >= target) return 0;
      if (target >= 100) return Infinity;
      return Math.ceil((target * total - 100 * attended) / (100 - target));
    },

    // ... and how many classes can still be missed without going below the target %?
    classesCanMiss: function (attended, total, target) {
      return Math.max(0, Math.floor(100 * attended / target - total));
    }
  };

  // "5th" -> { number: 5, roman: 'V', period: 'Jul 2026 - Dec 2026' }
  UMS.semInfo = function (semesterText) {
    const n = parseInt(semesterText, 10) || 1;
    const y = new Date().getFullYear();
    return {
      number: n,
      roman: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][n - 1] || String(n),
      period: n % 2 ? 'Jul ' + y + ' \u2013 Dec ' + y : 'Jan ' + y + ' \u2013 Jun ' + y
    };
  };


  //////// Styles for the things added by JS (buttons, popup, toast).
  // Added from here so the existing CSS files stay untouched. Uses the same colour variables.

  $('<style id="ums-js-styles"></style>').text(`
    .ums-btn { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border:1px solid var(--border,#e5e7eb); border-radius:8px; background:var(--white,#fff); color:var(--text,#1f2937); font:inherit; font-size:0.85rem; font-weight:600; cursor:pointer; }
    .ums-btn:hover { background:var(--bg,#f7f9fc); }
    .ums-btn.primary { background:var(--primary-light,#2563eb); border-color:var(--primary-light,#2563eb); color:#fff; }
    .ums-btn.primary:hover { opacity:0.9; }
    .ums-header-actions { display:flex; gap:10px; flex-wrap:wrap; }
    .ums-icon-btn { border:none; background:none; cursor:pointer; padding:5px 7px; border-radius:6px; color:var(--text-muted,#6b7280); font-size:1rem; }
    .ums-icon-btn:hover { background:var(--bg,#f7f9fc); color:var(--primary-light,#2563eb); }
    .ums-icon-btn.danger:hover { color:var(--red,#dc2626); }
    td.ums-actions { white-space:nowrap; }
    td.ums-empty { text-align:center; color:var(--text-muted,#6b7280); padding:28px 16px; }
    .att-low { color:var(--red,#dc2626); font-weight:700; }
    .ums-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.45); display:flex; align-items:center; justify-content:center; padding:16px; z-index:100; }
    .ums-modal { background:var(--white,#fff); border-radius:12px; width:100%; max-width:460px; max-height:90vh; overflow-y:auto; padding:22px 24px; box-shadow:0 20px 40px rgba(15,23,42,0.25); }
    .ums-modal h3 { font-size:1.1rem; font-weight:700; margin-bottom:16px; }
    .ums-field { margin-bottom:12px; }
    .ums-field label { display:block; font-size:0.78rem; font-weight:600; color:var(--text-muted,#6b7280); margin-bottom:4px; }
    .ums-field input, .ums-field select { width:100%; padding:9px 12px; border:1px solid var(--border,#e5e7eb); border-radius:8px; font:inherit; font-size:0.88rem; background:var(--white,#fff); color:var(--text,#1f2937); }
    .ums-field input:disabled, .ums-field select:disabled { background:var(--bg,#f7f9fc); color:var(--text-muted,#6b7280); }
    .ums-field input:focus, .ums-field select:focus { outline:2px solid var(--primary-light,#2563eb); outline-offset:-1px; }
    .ums-error { min-height:18px; font-size:0.8rem; color:var(--red,#dc2626); margin-bottom:8px; }
    .ums-modal-info { max-width:520px; }
    .ums-info { font-size:0.9rem; margin-bottom:16px; }
    .ums-form-actions { display:flex; justify-content:flex-end; gap:10px; }
    .ums-toast { position:fixed; left:50%; bottom:28px; transform:translate(-50%,20px); background:#1f2937; color:#fff; padding:10px 18px; border-radius:8px; font-size:0.85rem; opacity:0; transition:opacity 0.2s, transform 0.2s; z-index:200; max-width:90vw; }
    .ums-toast.error { background:var(--red,#dc2626); }
    .ums-toast.show { opacity:1; transform:translate(-50%,0); }
  `).appendTo('head');

})(jQuery);
