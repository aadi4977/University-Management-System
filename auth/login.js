/* ==========================================================
   University Management System (GLA University Mathura)
   auth/login.js  ->  LOGIN PAGE

   What it does: checks username + password against the saved
   users, remembers who logged in, and opens the right dashboard
   (admin / student / faculty).

   Needs on the page: a <form>, one username/email text box and
   one password box. A role picker (tabs with data-role, dropdown
   or radio buttons) is optional - if present, the chosen role
   must match the account.
   ========================================================== */

$(function () {

  //////// Form fields

  const $form = $('form').first();
  const $scope = $form.length ? $form : $(document);   // no <form> tag? search the whole page
  const $username = $scope.find('input').not('[type="password"],[type="checkbox"],[type="radio"],[type="submit"],[type="button"],[type="hidden"]').first();
  const $password = $scope.find('input[type="password"]').first();

  // Chosen role: active tab (data-role), or a <select> dropdown, or radio buttons
  function chosenRole() {
    let text = $('select').first().val() || $('select option:selected').first().text();
    if (!text) text = $('input[type="radio"]:checked').val();
    if (!text) text = $('[data-role].active, [data-role].selected').first().attr('data-role');
    text = (text || '').toLowerCase();
    return ['admin', 'student', 'faculty'].find(r => text.indexOf(r) !== -1) || '';
  }


  //////// Role tabs (Admin / Faculty / Student)

  $('.role-tab').on('click', function () {
    $('.role-tab').removeClass('active');
    $(this).addClass('active');
    $('#loginError').text('');
    $username.trigger('focus');
  });


  //////// Show / hide password button (eye icon)

  $('.toggle-pass').on('click', function () {
    const hidden = $password.attr('type') === 'password';
    $password.attr('type', hidden ? 'text' : 'password');
    $(this).find('i').toggleClass('bi-eye', !hidden).toggleClass('bi-eye-slash', hidden);
  });


  //////// Quick demo login buttons (they only fill the form, then you press Login)

  $('.demo-chip').on('click', function () {
    $('.role-tab[data-role="' + $(this).attr('data-fill-role') + '"]').trigger('click');
    $username.val($(this).attr('data-user'));
    $password.val($(this).attr('data-pass'));
    $('#loginError').text('');
  });


  //////// Error message (uses the red text under the button; falls back to a toast)

  function showError(message) {
    if ($('#loginError').length) $('#loginError').text(message);
    else UMS.toast(message, 'error');
  }

  $username.add($password).on('input', function () { $('#loginError').text(''); });


  //////// Login button (form submit)

  // save the login and open the dashboard
  function finish(user) {
    $('#loginError').text('');
    UMS.login(user);
    UMS.toast('Welcome, ' + user.name + '!');
    setTimeout(() => UMS.goHome(user.role), 600);
  }

  function tryLogin(e) {
    if (e) e.preventDefault();

    const id = $.trim($username.val()).toLowerCase();
    const pw = $password.val();
    if (!id || !pw) return showError('Please enter your username and password.');

    // username can be admin / roll no / faculty id, or the email address
    const user = UMS.store.getRecords('users').find(u =>
      (u.username.toLowerCase() === id || u.email.toLowerCase() === id) && u.password === pw);
    if (!user) return showError('Wrong username or password.');

    const picked = chosenRole();
    if (picked && picked !== user.role) return showError('This is not a ' + picked + ' account.');

    // The faculty portal is built by another team member. If its page is not there yet, say so
    // instead of opening a "Cannot GET" error page.
    if (user.role === 'faculty') {
      $.ajax({ url: UMS.pages.home.faculty, type: 'HEAD' })
        .done(() => finish(user))
        .fail(xhr => xhr.status === 404 ? showError('The Faculty portal is not ready yet. Please try again later.') : finish(user));
      return;
    }

    finish(user);
  }

  if ($form.length) {
    $form.on('submit', tryLogin);
  } else {
    // fallback: no <form> tag on the page -> first button does the login
    $username.add($password).on('keydown', e => { if (e.key === 'Enter') tryLogin(e); });
    $('button').first().on('click', tryLogin);
  }


  //////// "Forgot password" link (only if the page has one)

  $('a').filter(function () { return /forgot/i.test($(this).text()); }).on('click', function (e) {
    e.preventDefault();
    UMS.toast('Please contact the admin office to reset your password.');
  });

});
