/* ==========================================================
   University Management System (GLA University Mathura)
   admin/dashboard/index.js  ->  ADMIN DASHBOARD

   Fills the stat cards, the two donut charts and the events
   list from the saved data, so numbers always match the other
   admin pages.
   ========================================================== */

$(function () {

  //////// Page guard (only a logged-in admin can see this page)

  const session = UMS.requireRole('admin');
  if (!session) return;
  UMS.fillProfile(session);

  const students = UMS.store.getRecords('students');
  const faculty = UMS.store.getRecords('faculty');
  const courses = UMS.store.getRecords('courses');
  const fees = UMS.store.getRecords('fees');


  //////// Stat cards (Total Students / Total Faculty / Total Courses / Fee Collected)

  const $values = $('.stat-row .stat-value');
  $values.eq(0).text(students.length);
  $values.eq(1).text(faculty.length);
  $values.eq(2).text(courses.length);
  $values.eq(3).text(UMS.rs(fees.reduce((sum, f) => sum + f.paid, 0)));


  //////// Donut charts (Student Distribution / Faculty Distribution)

  // legend name, swatch class (from the CSS), colour used in the ring
  const GROUPS = [
    { name: 'CSE',                swatch: 'blue',   color: 'var(--primary-light)' },
    { name: 'ECE',                swatch: 'green',  color: 'var(--green)' },
    { name: 'Mech & Civil',       swatch: 'orange', color: 'var(--orange)' },
    { name: 'Management',         swatch: 'purple', color: 'var(--purple)' },
    { name: 'Comp. Applications', swatch: 'teal',   color: 'var(--teal)' }
  ];

  // decide the group from a course name ("B.Tech CSE") or a department name
  function groupOf(text) {
    if (/CSE|Computer Science/i.test(text)) return 'CSE';
    if (/ECE|Electronics/i.test(text)) return 'ECE';
    if (/\bME\b|\bCE\b|Mechanical|Civil/i.test(text)) return 'Mech & Civil';
    if (/BBA|MBA|Management/i.test(text)) return 'Management';
    return 'Comp. Applications';
  }

  function drawDonut($card, labels) {
    const counts = GROUPS.map(g => labels.filter(l => groupOf(l) === g.name).length);
    const total = labels.length;

    // ring colours: one slice per group
    let start = 0, slices = [];
    GROUPS.forEach((g, i) => {
      const end = start + (total ? (counts[i] / total) * 100 : 0);
      slices.push(g.color + ' ' + start.toFixed(2) + '% ' + end.toFixed(2) + '%');
      start = end;
    });
    $card.find('.donut').css('background', total ? 'conic-gradient(' + slices.join(', ') + ')' : 'var(--border)');
    $card.find('.donut-hole .value').text(total);

    // legend on the right
    $card.find('.chart-legend').html(GROUPS.map((g, i) =>
      '<li><span class="legend-name"><span class="swatch ' + g.swatch + '"></span>' + UMS.esc(g.name) + '</span>' +
      '<span class="legend-value">' + counts[i] + '</span></li>').join(''));
  }

  drawDonut($('.chart-card').eq(0), students.map(s => s.course));
  drawDonut($('.chart-card').eq(1), faculty.map(f => f.dept));


  //////// Upcoming events list

  $('.event-list').html(UMS.eventsHtml('admin'));


  //////// Reset demo data button (handy before a presentation)

  const $reset = $('<button type="button" class="ums-btn" id="resetBtn"><i class="bi bi-arrow-counterclockwise"></i>Reset demo data</button>');
  $('.page-header').append($('<div class="ums-header-actions"></div>').append($reset));

  $reset.on('click', function () {
    if (!window.confirm('Reset all students, faculty, courses and fees back to the demo data?')) return;
    UMS.store.resetAll();
    location.reload();
  });

});
