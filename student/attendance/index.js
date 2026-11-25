/* ==========================================================
   University Management System (GLA University Mathura)
   student/attendance/index.js  ->  MY ATTENDANCE PAGE

   Shows the logged-in student's attendance subject by subject.
   Percentages are calculated here: (attended / total) x 100.
   Also has an Attendance Calculator.
   ========================================================== */

$(function () {

  //////// Page guard (only a logged-in student can see this page)

  const session = UMS.requireRole('student');
  if (!session) return;
  UMS.fillProfile(session);

  const roll = session.ref;
  const attendance = UMS.store.getRecords('attendance').filter(a => a.roll === roll);

  let query = '';


  //////// Stat cards (Overall % / Total Subjects / Subjects >= 75% / Subjects < 75%)

  const withPercent = attendance.map(a => Object.assign({}, a, { percent: UMS.calc.percent(a.attended, a.total) }));
  const totalClasses = attendance.reduce((sum, a) => sum + a.total, 0);
  const attendedClasses = attendance.reduce((sum, a) => sum + a.attended, 0);

  const $values = $('.stat-row .stat-value');
  $values.eq(0).text(totalClasses ? Math.round(UMS.calc.percent(attendedClasses, totalClasses)) + '%' : 'N/A');
  $values.eq(1).text(attendance.length);
  $values.eq(2).text(withPercent.filter(a => a.percent >= 75).length);
  $values.eq(3).text(withPercent.filter(a => a.percent < 75).length);


  //////// Attendance table

  function renderTable() {
    const rows = withPercent.filter(a => a.subject.toLowerCase().includes(query));

    if (!rows.length) {
      $('tbody').html('<tr><td colspan="6" class="ums-empty">' + (attendance.length ? 'No subject found.' : 'No attendance records yet.') + '</td></tr>');
      return;
    }

    $('tbody').html(rows.map((a, i) => {
      const label = UMS.calc.attendanceLabel(a.percent);
      return '<tr>' +
        '<td>' + (i + 1) + '</td>' +
        '<td>' + UMS.esc(a.subject) + '</td>' +
        '<td>' + a.total + '</td>' +
        '<td>' + a.attended + '</td>' +
        '<td class="' + label.cls + '">' + a.percent.toFixed(2) + '%</td>' +
        '<td><span class="pill ' + label.pill + '">' + label.text + '</span></td>' +
      '</tr>';
    }).join(''));
  }


  //////// Search box (above the table)

  UMS.bindSearch('.search-mini input', function (text) {
    query = text;
    renderTable();
  });


  //////// Attendance Calculator (subject + target % + classes to attend / miss)

  const $subject = $('#calcSubject');
  withPercent.forEach((a, i) => $('<option></option>').val(i).text(a.subject).appendTo($subject));

  function box(label, value) {
    return '<div class="calc-box"><div class="label">' + label + '</div><div class="value">' + value + '</div></div>';
  }

  function calculate() {
    const $result = $('#calcResult');
    const sub = withPercent[$subject.val()];
    if (!sub) { $result.html('<div class="calc-message">No subjects to calculate yet.</div>'); return; }

    const target = Number($('#calcTarget').val());
    const attend = Math.max(0, parseInt($('#calcAttend').val(), 10) || 0);
    const miss = Math.max(0, parseInt($('#calcMiss').val(), 10) || 0);
    if (!(target >= 1 && target <= 100)) { $result.html('<div class="calc-message warn">Target must be between 1 and 100.</div>'); return; }

    const afterAttended = sub.attended + attend;
    const afterTotal = sub.total + attend + miss;
    const after = UMS.calc.percent(afterAttended, afterTotal);

    // advice based on today's numbers
    let advice, kind;
    if (sub.percent >= target) {
      const canMiss = UMS.calc.classesCanMiss(sub.attended, sub.total, target);
      advice = 'You are above ' + target + '%. You can miss up to <b>' + canMiss + '</b> more class' + (canMiss === 1 ? '' : 'es') + ' and still stay at ' + target + '% or more.';
      kind = 'good';
    } else {
      const need = UMS.calc.classesNeeded(sub.attended, sub.total, target);
      advice = need === Infinity
        ? 'You cannot reach 100% any more, because a class was already missed.'
        : 'You are below ' + target + '%. Attend the next <b>' + need + '</b> class' + (need === 1 ? '' : 'es') + ' in a row to reach ' + target + '%.';
      kind = 'warn';
    }

    $result.html(
      box('Attendance now', sub.percent.toFixed(2) + '% (' + sub.attended + '/' + sub.total + ')') +
      box('After these classes', after.toFixed(2) + '% (' + afterAttended + '/' + afterTotal + ')') +
      '<div class="calc-message ' + kind + '">' + advice + '</div>');
  }

  $subject.add('#calcTarget, #calcAttend, #calcMiss').on('input change', calculate);


  renderTable();
  calculate();
});
