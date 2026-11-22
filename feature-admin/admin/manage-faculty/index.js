/* ==========================================================
   University Management System (GLA University Mathura)
   admin/manage-faculty/index.js  ->  FACULTY PAGE

   Shows all faculty members. Admin can search, add, edit and
   delete them. Adding a faculty member also creates their login.
   ========================================================== */

$(function () {

  //////// Page guard (only a logged-in admin can see this page)

  const session = UMS.requireRole('admin');
  if (!session) return;
  UMS.fillProfile(session);

  const DEPARTMENTS = ['Computer Science & Engineering', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering', 'Management', 'Computer Applications'];
  const STATUS = ['Active', 'On Leave'];

  let query = '';


  //////// Table header: extra "Action" column + "Add Faculty" button

  $('thead tr').append('<th>Action</th>');

  const $addBtn = $('<button type="button" class="ums-btn primary" id="addBtn"><i class="bi bi-plus-lg"></i>Add Faculty</button>');
  $('.page-header').append($('<div class="ums-header-actions"></div>').append($addBtn));


  //////// Stat cards (Total Faculty / On Leave / Departments)

  function renderStats(list) {
    const $values = $('.stat-row .stat-value');
    $values.eq(0).text(list.length);
    $values.eq(1).text(list.filter(f => f.status === 'On Leave').length);
    $values.eq(2).text(new Set(list.map(f => f.dept)).size);
  }


  //////// Table rows

  function renderTable() {
    const all = UMS.store.getRecords('faculty');
    renderStats(all);

    const rows = all.filter(f => [f.id, f.name, f.dept, f.subjects, f.email].join(' ').toLowerCase().includes(query));

    if (!rows.length) {
      $('tbody').html('<tr><td colspan="9" class="ums-empty">No faculty found.</td></tr>');
      return;
    }

    $('tbody').html(rows.map((f, i) =>
      '<tr>' +
        '<td>' + (i + 1) + '</td>' +
        '<td>' + UMS.esc(f.id) + '</td>' +
        '<td>' + UMS.esc(f.name) + '</td>' +
        '<td>' + UMS.esc(f.dept) + '</td>' +
        '<td>' + UMS.esc(f.subjects) + '</td>' +
        '<td>' + UMS.esc(f.contact) + '</td>' +
        '<td>' + UMS.esc(f.email) + '</td>' +
        '<td>' + UMS.statusPill(f.status) + '</td>' +
        '<td class="ums-actions">' +
          '<button class="ums-icon-btn js-edit" data-id="' + UMS.esc(f.id) + '" title="Edit"><i class="bi bi-pencil-square"></i></button>' +
          '<button class="ums-icon-btn danger js-delete" data-id="' + UMS.esc(f.id) + '" title="Delete"><i class="bi bi-trash3"></i></button>' +
        '</td>' +
      '</tr>').join(''));
  }


  //////// Search box (top bar + above the table)

  UMS.bindSearch('.table-search input', function (text) {
    query = text;
    renderTable();
  });


  //////// Form fields + validation (used by both Add and Edit)

  function facultyFields(f, isEdit) {
    return [
      { name: 'id',       label: 'Faculty ID', required: true, readonly: isEdit, value: f.id, placeholder: 'e.g. F006' },
      { name: 'name',     label: 'Full Name',  required: true, value: f.name, placeholder: 'e.g. Dr. Anil Kumar' },
      { name: 'dept',     label: 'Department', options: DEPARTMENTS, value: f.dept },
      { name: 'subjects', label: 'Subject(s) Assigned', required: true, value: f.subjects, placeholder: 'e.g. Data Structures, DBMS' },
      { name: 'contact',  label: 'Contact (10 digits)', required: true, value: f.contact },
      { name: 'email',    label: 'Email', required: true, type: 'email', value: f.email },
      { name: 'status',   label: 'Status', options: STATUS, value: f.status }
    ];
  }

  function validate(v, isEdit) {
    if (!/^[A-Za-z0-9]{3,15}$/.test(v.id)) return 'Faculty ID must be 3-15 letters or digits.';
    if (!isEdit && UMS.store.findRecord('faculty', v.id)) return 'This Faculty ID already exists.';
    if (!/^[A-Za-z][A-Za-z .'-]{2,}$/.test(v.name)) return 'Please enter a valid name.';
    if (!/^\d{10}$/.test(v.contact)) return 'Contact must be exactly 10 digits.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return 'Please enter a valid email.';
    const clash = UMS.store.getRecords('users').some(u => u.email.toLowerCase() === v.email.toLowerCase() && u.username !== v.id);
    if (clash) return 'This email is already used by another account.';
    return '';
  }


  //////// Add Faculty button

  $addBtn.on('click', function () {
    UMS.openForm({
      title: 'Add Faculty',
      fields: facultyFields({ dept: DEPARTMENTS[0], status: 'Active' }, false),
      onSubmit: function (v) {
        const error = validate(v, false);
        if (error) return error;
        UMS.store.addFaculty(v);
        UMS.toast('Faculty added. Login password: faculty123');
        renderTable();
      }
    });
  });


  //////// Edit button (pencil icon in each row)

  $('tbody').on('click', '.js-edit', function () {
    const id = $(this).attr('data-id');
    const faculty = UMS.store.findRecord('faculty', id);
    UMS.openForm({
      title: 'Edit Faculty',
      fields: facultyFields(faculty, true),
      onSubmit: function (v) {
        const error = validate(v, true);
        if (error) return error;
        UMS.store.updateFaculty(id, { name: v.name, dept: v.dept, subjects: v.subjects, contact: v.contact, email: v.email, status: v.status });
        UMS.toast('Faculty updated');
        renderTable();
      }
    });
  });


  //////// Delete button (bin icon in each row)

  $('tbody').on('click', '.js-delete', function () {
    const id = $(this).attr('data-id');
    const faculty = UMS.store.findRecord('faculty', id);
    if (!window.confirm('Delete ' + faculty.name + '?\nTheir login will be removed too.')) return;
    UMS.store.removeFaculty(id);
    UMS.toast('Faculty deleted');
    renderTable();
  });


  renderTable();
});
