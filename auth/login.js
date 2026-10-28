// =============================================
// GLA UMS – Login Page JavaScript (Enhanced)
// =============================================

document.addEventListener("DOMContentLoaded", function () {

  var form          = document.getElementById("loginForm");
  var roleSelect    = document.getElementById("role");
  var usernameInput = document.getElementById("username");
  var passwordInput = document.getElementById("password");
  var errorMsg      = document.getElementById("loginError");
  var loginBtn      = form.querySelector("button[type='submit']");

  // ── Demo credentials ──────────────────────────────────────────────────────
  var demoAccounts = {
    faculty: { username: "faculty", password: "faculty123", redirect: "../faculty/dashboard.html" },
    admin:   { username: "admin",   password: "admin123",   redirect: null },
    student: { username: "student", password: "student123", redirect: null }
  };

  // ── 1. FAILED ATTEMPTS LOCKOUT ────────────────────────────────────────────
  // After 3 wrong tries, lock the form for 30 seconds
  var failCount   = 0;
  var lockoutTimer = null;

  function lockForm(seconds) {
    loginBtn.disabled = true;
    var remaining = seconds;

    function tick() {
      loginBtn.textContent = "Try again in " + remaining + "s";
      remaining--;
      if (remaining < 0) {
        clearInterval(lockoutTimer);
        loginBtn.textContent = "Login";
        loginBtn.disabled = false;
        failCount = 0;
        errorMsg.textContent = "";
      }
    }
    tick();
    lockoutTimer = setInterval(tick, 1000);
  }

  // ── 2. SHOW / HIDE PASSWORD TOGGLE ────────────────────────────────────────
  var toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.innerHTML = '<i class="bi bi-eye"></i>';
  toggleBtn.title = "Show / hide password";
  toggleBtn.style.cssText = [
    "position:absolute; right:12px; top:50%; transform:translateY(-50%);",
    "background:none; border:none; cursor:pointer; font-size:1.1rem;",
    "color:#888; padding:0;"
  ].join("");

  var pwWrap = document.createElement("div");
  pwWrap.style.cssText = "position:relative;";
  passwordInput.parentNode.insertBefore(pwWrap, passwordInput);
  pwWrap.appendChild(passwordInput);
  pwWrap.appendChild(toggleBtn);

  toggleBtn.addEventListener("click", function () {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleBtn.innerHTML = '<i class="bi bi-eye-slash"></i>';
    } else {
      passwordInput.type = "password";
      toggleBtn.innerHTML = '<i class="bi bi-eye"></i>';
    }
  });

  // ── 3. DEMO CREDENTIALS HINT (auto-fills on click) ────────────────────────
  var hintEl = document.createElement("p");
  hintEl.style.cssText = "font-size:0.78rem; color:#888; margin-top:12px; text-align:center; cursor:pointer;";
  updateHint();
  form.appendChild(hintEl);

  function updateHint() {
    var chosen = roleSelect.value;
    var creds  = demoAccounts[chosen];
    hintEl.innerHTML = "Demo → <u>" + creds.username + " / " + creds.password + "</u> (click to fill)";
  }

  // Clicking the hint auto-fills the fields
  hintEl.addEventListener("click", function () {
    var creds = demoAccounts[roleSelect.value];
    usernameInput.value = creds.username;
    passwordInput.value = creds.password;
    errorMsg.textContent = "";
    usernameInput.dispatchEvent(new Event("input"));
  });

  roleSelect.addEventListener("change", function () {
    updateHint();
    errorMsg.textContent = "";
  });

  // ── 4. REAL-TIME FIELD VALIDATION (green tick / red border) ──────────────
  function validateField(input) {
    if (input.value.trim().length >= 3) {
      input.style.border = "2px solid #16a34a";
    } else if (input.value.trim().length > 0) {
      input.style.border = "2px solid #dc2626";
    } else {
      input.style.border = "";
    }
  }

  usernameInput.addEventListener("input", function () {
    validateField(usernameInput);
    errorMsg.textContent = "";
  });
  passwordInput.addEventListener("input", function () {
    validateField(passwordInput);
    errorMsg.textContent = "";
  });

  // ── 5. CAPS LOCK WARNING ──────────────────────────────────────────────────
  var capsWarn = document.createElement("small");
  capsWarn.style.cssText = "color:#f59e0b; font-size:.75rem; display:none;";
  capsWarn.textContent   = "⚠ Caps Lock is ON";
  pwWrap.appendChild(capsWarn);

  passwordInput.addEventListener("keyup", function (e) {
    capsWarn.style.display = e.getModifierState("CapsLock") ? "block" : "none";
  });

  // ── 6. LOADING SPINNER on submit ──────────────────────────────────────────
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (loginBtn.disabled) return;     // still locked out

    var enteredUsername = usernameInput.value.trim();
    var enteredPassword = passwordInput.value.trim();
    var selectedRole    = roleSelect.value;

    // Empty check
    errorMsg.style.color = "#dc2626";
    if (!enteredUsername || !enteredPassword) {
      errorMsg.textContent = "Please fill in both fields.";
      return;
    }

    // Show spinner
    loginBtn.innerHTML   = '<i class="bi bi-arrow-repeat spin"></i> Signing in…';
    loginBtn.disabled    = true;
    errorMsg.textContent = "";

    // Add spin animation if not already present
    if (!document.getElementById("spin-style")) {
      var s = document.createElement("style");
      s.id  = "spin-style";
      s.textContent = "@keyframes spin{to{transform:rotate(360deg)}} .spin{display:inline-block;animation:spin .8s linear infinite;}";
      document.head.appendChild(s);
    }

    setTimeout(function () {
      var correct = demoAccounts[selectedRole];

      if (enteredUsername === correct.username && enteredPassword === correct.password) {
        // SUCCESS
        loginBtn.innerHTML   = '<i class="bi bi-check-circle-fill"></i> Success!';
        loginBtn.style.background = "#16a34a";
        errorMsg.style.color = "#16a34a";
        errorMsg.textContent = "Welcome! Redirecting to your portal…";

        // Remember the role in sessionStorage
        sessionStorage.setItem("ums_role", selectedRole);
        sessionStorage.setItem("ums_user", enteredUsername);

        setTimeout(function () {
          if (correct.redirect) {
            window.location.href = correct.redirect;
          } else {
            loginBtn.style.background = "";
            loginBtn.innerHTML = "Login";
            loginBtn.disabled  = false;
            errorMsg.style.color = "#f59e0b";
            errorMsg.textContent = "The " + selectedRole + " portal is under construction.";
          }
        }, 1000);

      } else {
        // FAIL
        failCount++;
        loginBtn.innerHTML = "Login";
        loginBtn.disabled  = false;
        errorMsg.textContent = "Incorrect credentials. Attempt " + failCount + " of 3.";

        // Shake animation on the password field
        passwordInput.style.animation = "shake .4s";
        if (!document.getElementById("shake-style")) {
          var s2 = document.createElement("style");
          s2.id  = "shake-style";
          s2.textContent = "@keyframes shake{0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)}}";
          document.head.appendChild(s2);
        }
        setTimeout(function () { passwordInput.style.animation = ""; }, 400);
        passwordInput.style.border = "2px solid #dc2626";
        passwordInput.value = "";
        passwordInput.focus();

        if (failCount >= 3) {
          errorMsg.textContent = "Too many failed attempts. Locked for 30 seconds.";
          lockForm(30);
        }
      }
    }, 900);  // simulate network delay
  });

  // ── 7. KEYBOARD SHORTCUT: Enter key focuses username if empty ────────────
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && document.activeElement === document.body) {
      usernameInput.focus();
    }
  });

  // Auto-focus username on load
  usernameInput.focus();
});
