/* ==========================================================
   University Management System (GLA University Mathura)
   admin/manage-students/index.js  ->  STUDENTS PAGE

   Shows all students in the table. Admin can search, add,
   edit and delete students. Adding a student also creates
   their login and fee record automatically.
   ========================================================== */

$(function () {

  //////// Page guard (only a logged-in admin can see this page)

  const session = UMS.requireRole('admin');
  if (!session) return;
  UMS.fillProfile(session);

  const COURSES = ['B.Tech CSE', 'B.Tech CSE (AI & DS)', 'B.Tech ECE', 'B.Tech ME', 'B.Tech CE', 'BBA', 'MBA', 'BCA'];
  const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
  const STATUS = ['Active', 'On Leave'];

  let query = '';


  //////// Table header: extra "Action" column + "Add Student" button

  $('thead tr').append('<th>Action</th>');

  const $addBtn = $('<button type="button" class="ums-btn primary" id="addBtn"><i class="bi bi-plus-lg"></i>Add Student</button>');
  $('.page-header').append($('<div class="ums-header-actions"></div>').append($addBtn));


  //////// Stat cards (Total / Active / On Leave)

  function renderStats(list) {
    const $values = $('.stat-row .stat-value');
    $values.eq(0).text(list.length);
    $values.eq(1).text(list.filter(s => s.status === 'Active').length);
    $values.eq(2).text(list.filter(s => s.status === 'On Leave').length);
  }


  //////// Table rows

  function renderTable() {
    const all = UMS.store.getRecords('students');
    renderStats(all);

    const rows = all.filter(s => [s.roll, s.name, s.course, s.email].join(' ').toLowerCase().includes(query));

    if (!rows.length) {
      $('tbody').html('<tr><td colspan="9" class="ums-empty">No students found.</td></tr>');
      return;
    }

    $('tbody').html(rows.map((s, i) =>
      '<tr>' +
        '<td>' + (i + 1) + '</td>' +
        '<td>' + UMS.esc(s.roll) + '</td>' +
        '<td>' + UMS.esc(s.name) + '</td>' +
        '<td>' + UMS.esc(s.course) + '</td>' +
        '<td>' + UMS.esc(s.semester) + '</td>' +
        '<td>' + UMS.esc(s.contact) + '</td>' +
        '<td>' + UMS.esc(s.email) + '</td>' +
        '<td>' + UMS.statusPill(s.status) + '</td>' +
        '<td class="ums-actions">' +
          '<button class="ums-icon-btn js-edit" data-id="' + UMS.esc(s.roll) + '" title="Edit"><i class="bi bi-pencil-square"></i></button>' +
          '<button class="ums-icon-btn danger js-delete" data-id="' + UMS.esc(s.roll) + '" title="Delete"><i class="bi bi-trash3"></i></button>' +
        '</td>' +
      '</tr>').join(''));
  }


  //////// Search box (top bar + above the table)

  UMS.bindSearch('.table-search input', function (text) {
    query = text;
    renderTable();
  });


  //////// Form fields + validation (used by both Add and Edit)

  function studentFields(s, isEdit) {
    return [
      { name: 'roll',     label: 'Roll No',  required: true, readonly: isEdit, value: s.roll, placeholder: 'e.g. 2401009' },
      { name: 'name',     label: 'Full Name', required: true, value: s.name },
      { name: 'course',   label: 'Course',   options: COURSES,   value: s.course },
      { name: 'semester', label: 'Semester', options: SEMESTERS, value: s.semester },
      { name: 'contact',  label: 'Contact (10 digits)', required: true, value: s.contact },
      { name: 'email',    label: 'Email',    required: true, type: 'email', value: s.email },
      { name: 'status',   label: 'Status',   options: STATUS,    value: s.status }
    ];
  }

  function validate(v, isEdit) {
    if (!/^[A-Za-z0-9]{5,15}$/.test(v.roll)) return 'Roll No must be 5-15 letters or digits.';
    if (!isEdit && UMS.store.findRecord('students', v.roll)) return 'This Roll No already exists.';
    if (!/^[A-Za-z][A-Za-z .'-]{2,}$/.test(v.name)) return 'Please enter a valid name.';
    if (!/^\d{10}$/.test(v.contact)) return 'Contact must be exactly 10 digits.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return 'Please enter a valid email.';
    // email is also used to log in, so it must be unique across all accounts
    const clash = UMS.store.getRecords('users').some(u => u.email.toLowerCase() === v.email.toLowerCase() && u.username !== v.roll);
    if (clash) return 'This email is already used by another account.';
    return '';
  }


  //////// Add Student button

  $addBtn.on('click', function () {
    UMS.openForm({
      title: 'Add Student',
      fields: studentFields({ course: COURSES[0], semester: SEMESTERS[0], status: 'Active' }, false),
      onSubmit: function (v) {
        const error = validate(v, false);
        if (error) return error;
        UMS.store.addStudent(v);
        UMS.toast('Student added. Login password: student123');
        renderTable();
      }
    });
  });


  //////// Edit button (pencil icon in each row)

  $('tbody').on('click', '.js-edit', function () {
    const roll = $(this).attr('data-id');   // attr, not .data() - jQuery would turn "2401001" into a number
    const student = UMS.store.findRecord('students', roll);
    UMS.openForm({
      title: 'Edit Student',
      fields: studentFields(student, true),
      onSubmit: function (v) {
        const error = validate(v, true);
        if (error) return error;
        UMS.store.updateStudent(roll, { name: v.name, course: v.course, semester: v.semester, contact: v.contact, email: v.email, status: v.status });
        UMS.toast('Student updated');
        renderTable();
      }
    });
  });


  //////// Delete button (bin icon in each row)

  $('tbody').on('click', '.js-delete', function () {
    const roll = $(this).attr('data-id');
    const student = UMS.store.findRecord('students', roll);
    if (!window.confirm('Delete ' + student.name + '?\nTheir login, fee, attendance and result records will be removed too.')) return;
    UMS.store.removeStudent(roll);
    UMS.toast('Student deleted');
    renderTable();
  });


  renderTable();
});
