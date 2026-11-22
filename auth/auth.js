/* ==========================================================
   University Management System (GLA University Mathura)
   auth/auth.js  ->  SIGN UP PAGE (signup.html)

   What it does: checks the sign up form and creates a new
   student or faculty account. The new person can log in at
   once, and the admin sees them on the Students / Faculty page.
   ========================================================== */

$(function () {

  const $msg = $('#form-msg');

  //////// Message box (red = error, green = success)

  function show(type, text) {
    $msg.removeClass('error success').addClass(type).text(text).prop('hidden', false);
  }


  //////// "Show passwords" checkbox

  $('#show-pass').on('change', function () {
    $('#password, #confirm').attr('type', this.checked ? 'text' : 'password');
  });


  //////// Password strength bar (weak -> strong)

  $('#password').on('input', function () {
    const p = $(this).val();
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (p && score < 1) score = 1;   // anything typed is at least "very weak"
    if (!p) score = 0;
    $('#strength-bar').attr('data-level', score);
    $('#strength-text').text(p ? ['', 'Very weak', 'Weak', 'Okay', 'Good', 'Strong'][score] || 'Very weak' : '');
  });


  //////// Roll No / ID hint changes with the chosen role

  $('#role').on('change', function () {
    const hints = { student: 'e.g. 2401001', faculty: 'e.g. F001', admin: 'Admin accounts are created by the office' };
    $('#userid').attr('placeholder', hints[$(this).val()]);
  });


  //////// Sign Up button (form submit)

  $('#signup-form').on('submit', function (e) {
    e.preventDefault();

    const v = {
      name: $.trim($('#name').val()),
      role: $('#role').val(),
      id: $.trim($('#userid').val()),
      email: $.trim($('#email').val()),
      password: $('#password').val(),
      confirm: $('#confirm').val()
    };

    // ---- checks (first problem found is shown)
    if (!v.name || !v.id || !v.email || !v.password || !v.confirm) return show('error', 'Please fill in all the fields.');
    if (!/^[A-Za-z][A-Za-z .'-]{2,}$/.test(v.name)) return show('error', 'Please enter a valid full name.');
    if (v.role === 'admin') return show('error', 'Admin accounts are created by the university office. Please choose Student or Faculty.');
    if (!/^[A-Za-z0-9]{3,15}$/.test(v.id) || (v.role === 'student' && v.id.length < 5)) return show('error', 'Roll No / ID must be 5-15 letters or digits (faculty: 3-15).');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return show('error', 'Please enter a valid email.');
    if (v.password.length < 6) return show('error', 'Password must be at least 6 characters.');
    if (v.password !== v.confirm) return show('error', 'Passwords do not match.');

    const users = UMS.store.getRecords('users');
    if (users.some(u => u.username.toLowerCase() === v.id.toLowerCase())) return show('error', 'This Roll No / ID is already registered.');
    if (users.some(u => u.email.toLowerCase() === v.email.toLowerCase())) return show('error', 'This email is already registered.');

    // ---- create the account (student/faculty record + login), then set the chosen password
    if (v.role === 'student') {
      UMS.store.addStudent({ roll: v.id, name: v.name, course: 'B.Tech CSE', semester: '1st', contact: '', email: v.email, status: 'Active' });
    } else {
      UMS.store.addFaculty({ id: v.id, name: v.name, dept: 'Computer Science & Engineering', subjects: '', contact: '', email: v.email, status: 'Active' });
    }
    UMS.store.updateRecord('users', v.id, { password: v.password });

    show('success', 'Account created! Taking you to the login page...');
    this.reset();
    setTimeout(() => { location.href = 'login.html'; }, 1300);
  });

});
