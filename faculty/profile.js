// GLA UMS – Faculty: My Profile
document.addEventListener("DOMContentLoaded", function () {
  var U = window.UMS, esc = U.esc;
  var $ = function (id) { return document.getElementById(id); };

  // ── tabs (hash aware) ─────────────────────────────────────────────────────
  function showTab(name) {
    if (["overview", "security", "preferences"].indexOf(name) < 0) name = "overview";
    document.querySelectorAll("[data-panel]").forEach(function (p) { p.hidden = p.dataset.panel !== name; });
    document.querySelectorAll("#profileTabs button").forEach(function (b) { b.classList.toggle("active", b.dataset.tab === name); });
  }
  $("profileTabs").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    history.replaceState(null, "", "#" + b.dataset.tab); showTab(b.dataset.tab);
  });
  window.addEventListener("hashchange", function () { showTab(location.hash.slice(1)); });
  showTab(location.hash.slice(1));

  // ── overview ──────────────────────────────────────────────────────────────
  function renderProfile() {
    var p = U.getProfile();
    $("pAvatar").textContent = U.initials(p.name);
    $("pName").textContent = p.name;
    $("pRole").textContent = p.designation + " • " + p.department;
    $("pEmp").textContent = p.empId;
    var rows = [["Email", p.email], ["Phone", p.phone], ["Department", p.department], ["Cabin", p.cabin], ["Qualification", p.qualification], ["Joined", p.joined], ["About", p.bio]];
    $("pDetails").innerHTML = rows.map(function (r) { return "<dt>" + r[0] + "</dt><dd style=\"font-weight:" + (r[0] === "About" ? 500 : 600) + "\">" + esc(r[1]) + "</dd>"; }).join("");
  }
  renderProfile();

  var map = { efName: "name", efDesig: "designation", efEmail: "email", efPhone: "phone", efCabin: "cabin", efQual: "qualification", efBio: "bio", efEmp: "empId", efDept: "department" };
  $("editProfileBtn").addEventListener("click", function () {
    var p = U.getProfile();
    Object.keys(map).forEach(function (id) { $(id).value = p[map[id]]; $(id).closest(".field").classList.remove("invalid"); });
    document.querySelectorAll("#editForm .err").forEach(function (x) { x.textContent = ""; });
    U.openModal($("editModal"));
  });
  function setErr(input, msg) {
    var f = input.closest(".field"); f.classList.toggle("invalid", !!msg);
    var e = f.querySelector(".err"); if (e) e.textContent = msg || "";
    return !msg;
  }
  $("editForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    ok = setErr($("efName"), $("efName").value.trim().length < 3 ? "Enter your full name." : "") && ok;
    ok = setErr($("efDesig"), !$("efDesig").value.trim() ? "Required." : "") && ok;
    ok = setErr($("efEmail"), !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("efEmail").value.trim()) ? "Enter a valid email address." : "") && ok;
    ok = setErr($("efPhone"), !/^[+\d][\d\s-]{8,16}$/.test($("efPhone").value.trim()) ? "Enter a valid phone number." : "") && ok;
    if (!ok) return;
    var p = U.getProfile();
    Object.keys(map).forEach(function (id) { if (!$(id).readOnly) p[map[id]] = $(id).value.trim(); });
    U.saveProfile(p); renderProfile(); U.closeModal($("editModal")); U.toast("Profile updated", "success");
  });

  // ── security ──────────────────────────────────────────────────────────────
  function strength(v) {
    var s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
    if (/\d/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return s;
  }
  $("pwNew").addEventListener("input", function () {
    var s = strength(this.value), bar = $("pwBar");
    bar.style.width = (this.value ? Math.max(s, 1) * 25 : 0) + "%";
    bar.style.background = ["#dc2626", "#dc2626", "#f59e0b", "#16a34a", "#15803d"][s];
    $("pwHint").textContent = this.value ? ["Very weak", "Weak", "Fair", "Good", "Strong"][s] : "Minimum 8 characters with a number and a symbol.";
  });
  $("pwForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var saved = U.store.get("password", "faculty123");
    var ok = true;
    ok = setErr($("pwCur"), $("pwCur").value !== saved ? "Current password is incorrect." : "") && ok;
    var v = $("pwNew").value;
    ok = setErr($("pwNew"), v.length < 8 || !/\d/.test(v) || !/[^A-Za-z0-9]/.test(v) ? "Use 8+ characters with a number and a symbol." : (v === $("pwCur").value ? "New password must differ from current." : "")) && ok;
    ok = setErr($("pwCon"), $("pwCon").value !== v ? "Passwords do not match." : "") && ok;
    if (!ok) return;
    U.store.set("password", v);
    this.reset(); $("pwBar").style.width = "0"; $("pwHint").textContent = "Minimum 8 characters with a number and a symbol.";
    U.toast("Password updated successfully", "success");
  });
  $("signins").innerHTML = [["This device", "Just now", "green"], ["Chrome on Windows • Mathura, IN", "Yesterday, 09:12 AM", "blue"], ["Mobile browser • Agra, IN", "20 Nov, 06:45 PM", "blue"]]
    .map(function (r) { return '<li><div class="event-info"><div class="title">' + r[0] + '</div><div class="meta">' + r[1] + "</div></div></li>"; }).join("");

  // ── preferences ───────────────────────────────────────────────────────────
  var PREFS = [
    ["emailNotices", "Email me new circulars", "Receive Dean and Examination Cell notices by email", true],
    ["attendanceAlert", "Attendance shortfall alerts", "Alert when a student drops below 75%", true],
    ["classReminder", "Class reminders", "Remind me 15 minutes before each lecture", false],
    ["confirmSave", "Warn before leaving unsaved changes", "Applies to attendance and marks pages", true]
  ];
  var prefs = U.store.get("prefs", {});
  $("prefList").innerHTML = PREFS.map(function (p) {
    var on = prefs[p[0]] === undefined ? p[3] : prefs[p[0]];
    return '<div class="switch-row"><div>' + p[1] + "<small>" + p[2] + '</small></div><label class="switch"><input type="checkbox" data-k="' + p[0] + '"' + (on ? " checked" : "") + ' aria-label="' + p[1] + '"><i></i></label></div>';
  }).join("");
  $("prefList").addEventListener("change", function (e) {
    prefs[e.target.dataset.k] = e.target.checked; U.store.set("prefs", prefs);
    U.toast("Preference saved", "success");
  });
});
