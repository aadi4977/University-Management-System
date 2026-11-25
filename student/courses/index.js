/* ==========================================================
   University Management System (GLA University Mathura)
   student/courses/index.js  ->  MY COURSES PAGE

   Lists the subjects of the student's current semester with
   credits, type (Theory / Lab) and the teacher of each subject.
   ========================================================== */

$(function () {

  //////// Page guard (only a logged-in student can see this page)

  const session = UMS.requireRole('student');
  if (!session) return;
  UMS.fillProfile(session);

  const me = UMS.store.findRecord('students', session.ref) || { semester: '1st' };
  const sem = UMS.semInfo(me.semester);
  const subjects = UMS.store.getRecords('curriculum').filter(c => c.sem === sem.number);
  const teaching = UMS.store.getRecords('teaching');
  const faculty = UMS.store.getRecords('faculty');

  $('#courseHeading').text('Semester ' + sem.roman + ' Subjects');


  //////// Stat cards (Total Subjects / Total Credits / Lab Courses)

  const isLab = c => /Lab$/i.test(c.name);
  const $values = $('.stat-row .stat-value');
  $values.eq(0).text(subjects.length);
  $values.eq(1).text(subjects.reduce((sum, c) => sum + c.credits, 0));
  $values.eq(2).text(subjects.filter(isLab).length);


  //////// Course table

  function teacherOf(code) {
    const t = teaching.find(x => x.code === code);
    const f = t && faculty.find(x => x.id === t.facultyId);
    return f ? f.name : '-';
  }

  if (!subjects.length) {
    $('tbody').html('<tr><td colspan="6" class="ums-empty">No courses found.</td></tr>');
    return;
  }

  $('tbody').html(subjects.map((c, i) =>
    '<tr>' +
      '<td>' + (i + 1) + '</td>' +
      '<td>' + UMS.esc(c.code) + '</td>' +
      '<td>' + UMS.esc(c.name) + '</td>' +
      '<td>' + c.credits + '</td>' +
      '<td><span class="pill ' + (isLab(c) ? 'orange' : 'green') + '">' + (isLab(c) ? 'Lab' : 'Theory') + '</span></td>' +
      '<td>' + UMS.esc(teacherOf(c.code)) + '</td>' +
    '</tr>').join(''));

});
