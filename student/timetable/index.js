/* ==========================================================
   University Management System (GLA University Mathura)
   student/timetable/index.js  ->  TIMETABLE PAGE

   Shows the weekly timetable (Monday to Friday, 9 AM to 5 PM) of the
   student's current semester as a grid: time on the left,
   days on top, a lunch break row, and today's column highlighted.
   ========================================================== */

$(function () {

  //////// Page guard (only a logged-in student can see this page)

  const session = UMS.requireRole('student');
  if (!session) return;
  UMS.fillProfile(session);

  const me = UMS.store.findRecord('students', session.ref) || { semester: '1st' };
  const sem = UMS.semInfo(me.semester);
  const subjects = UMS.store.getRecords('curriculum').filter(c => c.sem === sem.number);
  const week = UMS.timetableFor(subjects);
  const today = new Date().getDay();   // 0 = Sunday, 1 = Monday ... 6 = Saturday

  $('#ttHeading').text('Weekly Timetable \u2013 Semester ' + sem.roman);


  //////// Shorter subject names so they fit in the grid

  const SHORT = {
    'Full Stack Using Scripting Technologies Lab': 'FSST Lab',
    'Full Stack Using Scripting Technologies': 'Full Stack (Scripting)',
    'Application Build & Release Automation': 'Build & Release Automation',
    'Theory Of Automata & Formal Languages': 'Theory Of Automata'
  };


  //////// Today's column header (Monday ... Saturday)

  if (today >= 1 && today <= 5) $('thead th').eq(today).addClass('today-col');


  //////// Grid rows: one row per time slot, lunch break after 12-1

  const timeLabel = slot => slot[0].replace(/ ?[AP]M/, '') + ' \u2013 ' + slot[1].replace(/ ?[AP]M/, '');
  const todayClass = day => day === today ? ' today-col' : '';

  function cell(day, slotIndex) {
    const c = (week[day] || []).find(x => x.slot === slotIndex);
    if (!c) return '<td class="tt-empty' + todayClass(day) + '">\u2014</td>';
    return '<td class="' + todayClass(day).trim() + '"><div class="tt-subject">' + UMS.esc(SHORT[c.title] || c.title) + '</div>' +
           '<div class="tt-room"><i class="bi bi-geo-alt"></i>' + UMS.esc(c.room) + '</div></td>';
  }

  let html = '';
  UMS.TIMETABLE_SLOTS.forEach((slot, i) => {
    if (i === 4) html += '<tr class="tt-lunch"><td class="tt-time">1:00 \u2013 2:00</td><td colspan="5">Lunch Break</td></tr>';
    html += '<tr><td class="tt-time">' + timeLabel(slot) + '</td>' + [1, 2, 3, 4, 5].map(day => cell(day, i)).join('') + '</tr>';
  });

  $('#ttBody').html(subjects.length ? html : '<tr><td colspan="6" class="ums-empty">No timetable available yet.</td></tr>');

});
