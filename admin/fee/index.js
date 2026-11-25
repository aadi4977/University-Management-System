/* ==========================================================
   University Management System (GLA University Mathura)
   admin/fee/index.js  ->  FEES PAGE

   Shows the fee record of every student. Balance and status
   (Paid / Pending) are worked out from Total Fee and Paid.
   Admin can search and update the amounts of a student.
   ========================================================== */

$(function () {

  //////// Page guard (only a logged-in admin can see this page)

  const session = UMS.requireRole('admin');
  if (!session) return;
  UMS.fillProfile(session);

  let query = '';


  //////// Table header: extra "Action" column

  $('thead tr').append('<th>Action</th>');


  //////// Stat cards (Total Fee Collected / Pending Amount / Students with Dues)

  function renderStats(list) {
    const $values = $('.stat-row .stat-value');
    $values.eq(0).text(UMS.rs(list.reduce((sum, f) => sum + f.paid, 0)));
    $values.eq(1).text(UMS.rs(list.reduce((sum, f) => sum + (f.total - f.paid), 0)));
    $values.eq(2).text(list.filter(f => f.total - f.paid > 0).length);
  }


  //////// Table rows

  function renderTable() {
    const all = UMS.store.getRecords('fees');
    renderStats(all);

    const rows = all.filter(f => [f.roll, f.name].join(' ').toLowerCase().includes(query));

    if (!rows.length) {
      $('tbody').html('<tr><td colspan="8" class="ums-empty">No fee records found.</td></tr>');
      return;
    }

    $('tbody').html(rows.map((f, i) => {
      const balance = f.total - f.paid;
      return '<tr>' +
        '<td>' + (i + 1) + '</td>' +
        '<td>' + UMS.esc(f.roll) + '</td>' +
        '<td>' + UMS.esc(f.name) + '</td>' +
        '<td>' + UMS.rs(f.total) + '</td>' +
        '<td>' + UMS.rs(f.paid) + '</td>' +
        '<td>' + UMS.rs(balance) + '</td>' +
        '<td><span class="pill ' + (balance > 0 ? 'orange' : 'green') + '">' + (balance > 0 ? 'Pending' : 'Paid') + '</span></td>' +
        '<td class="ums-actions">' +
          '<button class="ums-icon-btn js-edit" data-id="' + UMS.esc(f.roll) + '" title="Update fee"><i class="bi bi-pencil-square"></i></button>' +
        '</td>' +
      '</tr>';
    }).join(''));
  }


  //////// Search box (top bar + above the table)

  UMS.bindSearch('.table-search input', function (text) {
    query = text;
    renderTable();
  });


  //////// Update button (pencil icon in each row)

  $('tbody').on('click', '.js-edit', function () {
    const roll = $(this).attr('data-id');
    const fee = UMS.store.findRecord('fees', roll);

    UMS.openForm({
      title: 'Update Fee',
      fields: [
        { name: 'roll',  label: 'Roll No', readonly: true, value: fee.roll },
        { name: 'name',  label: 'Name',    readonly: true, value: fee.name },
        { name: 'total', label: 'Total Fee (Rs.)', required: true, type: 'number', value: fee.total },
        { name: 'paid',  label: 'Paid So Far (Rs.)', required: true, type: 'number', value: fee.paid }
      ],
      onSubmit: function (v) {
        const total = Number(v.total), paid = Number(v.paid);
        if (!Number.isFinite(total) || !Number.isFinite(paid) || total < 0 || paid < 0) return 'Amounts must be numbers (0 or more).';
        if (paid > total) return 'Paid amount cannot be more than the total fee.';
        UMS.store.updateRecord('fees', roll, { total: Math.round(total), paid: Math.round(paid) });
        UMS.toast('Fee record updated');
        renderTable();
      }
    });
  });


  renderTable();
});
