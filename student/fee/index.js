/* ==========================================================
   University Management System (GLA University Mathura)
   student/fee/index.js  ->  FEE STATUS PAGE

   Shows the logged-in student's fee (total, paid, balance).
   "Pay My Fee" shows a DEMO QR code for the pending amount,
   or a message if the fee is already paid. No real payment happens.
   ========================================================== */

$(function () {

  //////// Page guard (only a logged-in student can see this page)

  const session = UMS.requireRole('student');
  if (!session) return;
  UMS.fillProfile(session);

  const fee = UMS.store.findRecord('fees', session.ref) || { total: 0, paid: 0 };
  const balance = fee.total - fee.paid;
  const isPaid = balance <= 0;


  //////// Stat cards (Total Fee / Fee Paid / Balance Due)

  const $values = $('.stat-row .stat-value');
  $values.eq(0).text(UMS.rs(fee.total));
  $values.eq(1).text(UMS.rs(fee.paid));
  $values.eq(2).text(UMS.rs(Math.max(balance, 0)));


  //////// Fee summary table

  $('tbody').html(
    '<tr><td>Total Fee</td><td>' + UMS.rs(fee.total) + '</td></tr>' +
    '<tr><td>Fee Paid</td><td>' + UMS.rs(fee.paid) + '</td></tr>' +
    '<tr><td>Balance Due</td><td>' + UMS.rs(Math.max(balance, 0)) + '</td></tr>' +
    '<tr><td>Status</td><td><span class="pill ' + (isPaid ? 'green' : 'orange') + '">' + (isPaid ? 'Paid' : 'Pending') + '</span></td></tr>');


  //////// Pay My Fee button

  $('#payBtn').on('click', function () {
    if (isPaid) {
      UMS.openInfo({
        title: 'Already paid',
        html: '<p>You have already paid your fee. Nothing is pending.</p>'
      });
      return;
    }

    UMS.openInfo({
      title: 'Pay My Fee',
      html: '<div class="pay-box">' +
              '<div class="pay-amount">' + UMS.rs(balance) + '</div>' +
              '<div class="pay-for">Pending fee of ' + UMS.esc(session.name) + ' (' + UMS.esc(session.ref) + ')</div>' +
              UMS.fakeQr(session.ref + '-' + balance) +
              '<p class="pay-note">Scan this QR code with any UPI app to pay.</p>' +
              '<p class="pay-demo">Demo QR code - no real payment will happen.</p>' +
            '</div>'
    });
  });

});
