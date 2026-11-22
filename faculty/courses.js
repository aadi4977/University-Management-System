// GLA UMS – Faculty: My Courses
document.addEventListener("DOMContentLoaded", function () {
  var U = window.UMS, esc = U.esc;
  var grid = document.getElementById("courseGrid");
  var filter = "all", query = "";
  var active = null; // course currently open in modal

  function doneArr(c) {
    var saved = U.store.get("syll_" + c.code, null);
    if (saved && saved.length === c.units.length) return saved;
    return c.units.map(function (_, i) { return i < c.done; });
  }
  function pct(c) { var d = doneArr(c); return Math.round(d.filter(Boolean).length / d.length * 100); }
  function barColor(c) { return { orange: "var(--orange)", purple: "var(--purple)" }[c.color] || "var(--green)"; }
  function attPill(a) { return a >= 85 ? "green" : a >= 75 ? "blue" : "orange"; }

  function renderStats() {
    var total = U.courses.length;
    var credits = U.courses.reduce(function (s, c) { return s + c.credits; }, 0);
    var students = U.courses.reduce(function (s, c) { return s + c.students; }, 0);
    var avg = Math.round(U.courses.reduce(function (s, c) { return s + pct(c); }, 0) / total);
    document.getElementById("courseStats").innerHTML =
      stat("blue", "journal-bookmark-fill", total, "Assigned Courses") +
      stat("green", "mortarboard-fill", credits, "Total Credits") +
      stat("orange", "people-fill", students, "Student Enrolments") +
      stat("purple", "check2-square", avg + "%", "Avg. Syllabus Covered");
  }
  function stat(color, icon, val, label) {
    return '<div class="stat-card"><div class="stat-icon ' + color + '"><i class="bi bi-' + icon + '"></i></div><div><div class="stat-value">' + val + '</div><div class="stat-label">' + label + "</div></div></div>";
  }

  function render() {
    var list = U.courses.filter(function (c) {
      var okF = filter === "all" || c.type.indexOf(filter) === 0;
      var okQ = !query || (c.code + " " + c.name).toLowerCase().indexOf(query) > -1;
      return okF && okQ;
    });
    if (!list.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="bi bi-search"></i>No courses match your filter.</div>';
      return;
    }
    grid.innerHTML = list.map(function (c) {
      var p = pct(c);
      return '<div class="course-card">' +
        '<div><div class="course-card-top"><span class="course-code">' + c.code + " &bull; " + c.credits + ' Credits</span><span class="pill ' + attPill(c.attendance) + '">' + c.attendance + '% Attd.</span></div>' +
        '<div class="course-name">' + esc(c.name) + "</div>" +
        '<div class="course-meta"><span><i class="bi bi-people"></i> ' + c.students + ' Students</span><span><i class="bi bi-diagram-3"></i> Sec ' + esc(c.section) + "</span></div>" +
        '<div class="course-meta"><span><i class="bi bi-geo-alt"></i> ' + esc(c.room) + '</span><span class="pill blue" style="padding:1px 8px">' + c.type + "</span></div>" +
        '<div class="course-progress-bar"><div class="course-progress-fill" style="width:' + p + "%;background:" + barColor(c) + '"></div></div>' +
        '<div class="course-progress-label"><span>Syllabus Covered</span><strong>' + p + "%</strong></div></div>" +
        '<div style="display:flex;gap:8px;"><button class="btn btn-outline-primary btn-sm" style="flex:1" data-open="' + c.code + '"><i class="bi bi-list-check"></i> Syllabus</button>' +
        '<a class="btn btn-outline btn-sm" style="flex:1" href="attendance.html?course=' + c.code + '">Attendance</a></div></div>';
    }).join("");
  }

  function openCourse(code) {
    active = U.courses.filter(function (c) { return c.code === code; })[0];
    var d = doneArr(active);
    document.getElementById("cmTitle").textContent = active.code + " – " + active.name;
    document.getElementById("cmBody").innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">' +
      mini(active.students, "Students") + mini(active.attendance + "%", "Attendance") + mini('<span id="cmPct">' + pct(active) + "%</span>", "Syllabus") + "</div>" +
      '<p class="muted" style="margin-bottom:10px;font-size:.82rem;">Tick units as you complete them &mdash; progress is saved on this device.</p>' +
      '<ul class="unit-list">' + active.units.map(function (u, i) {
        return '<li class="' + (d[i] ? "done" : "") + '"><input type="checkbox" id="u' + i + '" data-i="' + i + '"' + (d[i] ? " checked" : "") + '><label for="u' + i + '">' + esc(u) + "</label></li>";
      }).join("") + "</ul>";
    document.getElementById("cmAttendance").href = "attendance.html?course=" + active.code;
    U.openModal(document.getElementById("courseModal"));
  }
  function mini(v, l) {
    return '<div style="text-align:center;background:var(--bg);padding:12px;border-radius:10px;"><div style="font-size:1.3rem;font-weight:700;color:var(--primary-light)">' + v + '</div><div class="muted" style="font-size:.74rem">' + l + "</div></div>";
  }

  document.getElementById("cmBody").addEventListener("change", function (e) {
    if (e.target.type !== "checkbox" || !active) return;
    var d = doneArr(active);
    d[+e.target.dataset.i] = e.target.checked;
    U.store.set("syll_" + active.code, d);
    e.target.closest("li").classList.toggle("done", e.target.checked);
    document.getElementById("cmPct").textContent = pct(active) + "%";
    render(); renderStats();
  });
  document.getElementById("courseModal").addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-close-modal")) U.toast("Syllabus progress saved", "success");
  });

  grid.addEventListener("click", function (e) {
    var b = e.target.closest("[data-open]");
    if (b) openCourse(b.dataset.open);
  });
  document.getElementById("courseTabs").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("active", x === b); });
    filter = b.dataset.filter; render();
  });
  document.getElementById("courseSearch").addEventListener("input", function () { query = this.value.toLowerCase().trim(); render(); });

  document.getElementById("exportCoursesBtn").addEventListener("click", function () {
    var rows = ["Code,Course,Credits,Type,Section,Students,Attendance %,Syllabus %"];
    U.courses.forEach(function (c) {
      rows.push([c.code, '"' + c.name + '"', c.credits, c.type, '"' + c.section + '"', c.students, c.attendance, pct(c)].join(","));
    });
    U.download("faculty-courses-summary.csv", rows.join("\n"));
    U.toast("Course summary downloaded", "success");
  });

  render(); renderStats();
});
