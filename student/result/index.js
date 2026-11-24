/* ==========================================================
   University Management System (GLA University Mathura)
   student/result/index.js  ->  MY RESULTS PAGE

   Shows the logged-in student's marks. Choose any semester from
   the 1st one up to the current one. Grade, SGPA and CGPA are
   calculated here from the marks (nothing is typed in by hand).

   Grade scale:  90+ A+ | 80+ A | 70+ B+ | 60+ B | 50+ C | 40+ D | below 40 F (Fail)
   ========================================================== */

$(function () {

  //////// Page guard (only a logged-in student can see this page)

  const session = UMS.requireRole('student');
  if (!session) return;
  UMS.fillProfile(session);

  const roll = session.ref;
  const me = UMS.store.findRecord('students', roll) || { semester: '1st' };
  const currentSem = UMS.semInfo(me.semester).number;
  const allMarks = UMS.store.getRecords('marks').filter(m => m.roll === roll);


  //////// Semester dropdown (1st semester ... current semester)

  const $select = $('#semSelect');
  for (let s = 1; s <= currentSem; s++) {
    $('<option></option>').val(s).text('Semester ' + UMS.semInfo(s + 'th').roman + (s === currentSem ? ' (Current)' : '')).appendTo($select);
  }
  $select.val(currentSem);


  //////// Stat cards + table for the chosen semester

  function render() {
    const sem = parseInt($select.val(), 10);
    const marks = allMarks.filter(m => m.sem === sem);
    const info = UMS.semInfo(sem + 'th');

    const $values = $('.stat-row .stat-value');
    $values.eq(0).text(info.roman);
    $values.eq(1).text(marks.length ? UMS.calc.semesterSgpa(roll, sem).sgpa.toFixed(2) : 'N/A');
    $values.eq(2).text(marks.length ? UMS.calc.cgpa(roll, sem).toFixed(2) : 'N/A');
    $('.stat-row .stat-label').eq(0).text('Semester \u00B7 ' + (sem === currentSem ? info.period : 'Completed'));
    $('.stat-row .stat-label').eq(2).text(sem === 1 ? 'CGPA \u00B7 Out of 10' : 'CGPA up to this semester');

    if (!marks.length) {
      $('tbody').html('<tr><td colspan="7" class="ums-empty">No results published yet.</td></tr>');
      return;
    }

    $('tbody').html(marks.map((m, i) => {
      const g = UMS.calc.grade(m.marks);
      return '<tr>' +
        '<td>' + (i + 1) + '</td>' +
        '<td>' + UMS.esc(m.code) + '</td>' +
        '<td>' + UMS.esc(m.subject) + '</td>' +
        '<td>' + m.credits + '</td>' +
        '<td>' + g.letter + '</td>' +
        '<td>' + m.marks + '</td>' +
        '<td><span class="pill ' + (g.pass ? 'green' : 'orange') + '">' + (g.pass ? 'Pass' : 'Fail') + '</span></td>' +
      '</tr>';
    }).join(''));
  }

  $select.on('change', render);
  render();

});
