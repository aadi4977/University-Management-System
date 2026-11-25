// GLA UMS – Faculty: Weekly Schedule
document.addEventListener("DOMContentLoaded", function () {
  var U = window.UMS, esc = U.esc;
  var DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var SLOTS = [
    { id: "09", label: "09:00 – 10:00", start: 540, end: 600 },
    { id: "11", label: "11:00 – 12:00", start: 660, end: 720 },
    { id: "13", label: "01:00 – 02:00", start: 780, end: 840 },
    { id: "15", label: "03:30 – 05:00", start: 930, end: 1020 }
  ];
  // base timetable: day index -> slot id -> course code
  var BASE = {
    0: { "11": "BCSE1251", "13": "PCPH0002" },
    1: { "09": "BCSE1251", "15": "BCSE0281" },
    2: { "09": "PCPH0002" },
    3: { "11": "BCSE1251" },
    4: { "15": "BCSE0281" }
  };
  var extras = U.store.get("extraClasses", []); // {day, slot, code, room}
  var query = "";

  function course(code) { return U.courses.filter(function (c) { return c.code === code; })[0]; }
  function entries() {
    var out = [];
    DAYS.forEach(function (_, d) {
      Object.keys(BASE[d] || {}).forEach(function (s) { out.push({ day: d, slot: s, code: BASE[d][s], room: course(BASE[d][s]).room, extra: false }); });
    });
    extras.forEach(function (x, i) { out.push({ day: x.day, slot: x.slot, code: x.code, room: x.room, extra: true, idx: i }); });
    return out;
  }
  function slotLabel(id) { return SLOTS.filter(function (s) { return s.id === id; })[0].label; }

  var now = new Date();
  var todayIdx = (now.getDay() + 6) % 7; // Mon=0 .. Sun=6
  var mins = now.getHours() * 60 + now.getMinutes();
  document.getElementById("todayLabel").textContent = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" });

  function render() {
    var list = entries();
    var by = {};
    list.forEach(function (e) { by[e.day + "_" + e.slot] = (by[e.day + "_" + e.slot] || []).concat(e); });
    var html = '<div></div>' + DAYS.map(function (d, i) { return '<div class="tt-head' + (i === todayIdx ? " today" : "") + '">' + d.slice(0, 3) + (i === todayIdx ? " &bull; Today" : "") + "</div>"; }).join("");
    SLOTS.forEach(function (s) {
      html += '<div class="tt-time">' + s.label.replace(" – ", "<br>") + "</div>";
      DAYS.forEach(function (_, d) {
        var items = (by[d + "_" + s.id] || []).filter(function (e) {
          var c = course(e.code);
          return !query || (e.code + " " + c.name + " " + e.room).toLowerCase().indexOf(query) > -1;
        });
        if (!items.length) { html += '<div class="tt-cell"></div>'; return; }
        html += "<div>" + items.map(function (e) {
          var c = course(e.code);
          var isNow = d === todayIdx && mins >= s.start && mins < s.end;
          return '<button class="tt-slot ' + c.color + (isNow ? " now" : "") + '" data-day="' + d + '" data-slot="' + s.id + '" data-code="' + e.code + '" data-extra="' + (e.extra ? e.idx : "") + '">' +
            "<strong>" + e.code + (e.extra ? ' <i class="bi bi-star-fill" style="color:var(--gold)" title="Extra class"></i>' : "") + "</strong><span>" + esc(c.name.length > 24 ? c.name.slice(0, 22) + "…" : c.name) + "</span><span><i class=\"bi bi-geo-alt\"></i> " + esc(e.room) + "</span></button>";
        }).join("") + "</div>";
      });
    });
    document.getElementById("ttGrid").innerHTML = html;

    var weekly = list.length;
    var todayN = list.filter(function (e) { return e.day === todayIdx; }).length;
    var hrs = list.reduce(function (s, e) { return s + (e.slot === "15" ? 1.5 : 1); }, 0);
    document.getElementById("schedStats").innerHTML =
      st("blue", "calendar-week", weekly, "Classes / Week") + st("green", "clock", hrs, "Teaching Hours / Week") +
      st("orange", "calendar-event", todayIdx === 6 ? "None" : todayN, "Classes Today") + st("purple", "star", extras.length, "Extra Classes Added");
  }
  function st(c, i, v, l) { return '<div class="stat-card"><div class="stat-icon ' + c + '"><i class="bi bi-' + i + '"></i></div><div><div class="stat-value">' + v + '</div><div class="stat-label">' + l + "</div></div></div>"; }

  // slot details
  document.getElementById("ttGrid").addEventListener("click", function (e) {
    var b = e.target.closest(".tt-slot"); if (!b) return;
    var c = course(b.dataset.code), isExtra = b.dataset.extra !== "";
    document.getElementById("smTitle").textContent = c.code + " – " + c.name;
    document.getElementById("smBody").innerHTML =
      '<dl class="kv"><dt>Day</dt><dd>' + DAYS[b.dataset.day] + "</dd><dt>Time</dt><dd>" + slotLabel(b.dataset.slot) + "</dd><dt>Venue</dt><dd>" + esc(isExtra ? extras[b.dataset.extra].room : c.room) + "</dd><dt>Section</dt><dd>" + esc(c.section) + "</dd><dt>Type</dt><dd>" + c.type + "</dd><dt>Students</dt><dd>" + c.students + "</dd>" + (isExtra ? '<dt>Note</dt><dd><span class="pill orange">Extra / makeup class</span></dd>' : "") + "</dl>";
    document.getElementById("smFooter").innerHTML =
      (isExtra ? '<button class="btn btn-outline" id="rmExtra" style="color:#b91c1c"><i class="bi bi-trash"></i> Remove</button>' : "") +
      '<a class="btn btn-outline-primary" href="attendance.html?course=' + c.code + '"><i class="bi bi-calendar-check"></i> Mark Attendance</a><button class="btn btn-primary" data-close-modal>Close</button>';
    if (isExtra) document.getElementById("rmExtra").onclick = function () {
      extras.splice(+b.dataset.extra, 1); U.store.set("extraClasses", extras);
      U.closeModal(document.getElementById("slotModal")); render(); U.toast("Extra class removed", "info");
    };
    U.openModal(document.getElementById("slotModal"));
  });

  // add extra class
  var fC = document.getElementById("afCourse"), fD = document.getElementById("afDay"), fS = document.getElementById("afSlot"), fR = document.getElementById("afRoom"), fE = document.getElementById("afErr");
  fC.innerHTML = U.courses.map(function (c) { return '<option value="' + c.code + '">' + c.code + " – " + esc(c.name) + "</option>"; }).join("");
  fD.innerHTML = DAYS.map(function (d, i) { return '<option value="' + i + '">' + d + "</option>"; }).join("");
  fS.innerHTML = SLOTS.map(function (s) { return '<option value="' + s.id + '">' + s.label + "</option>"; }).join("");
  document.getElementById("addClassBtn").addEventListener("click", function () {
    fE.textContent = ""; fR.value = course(fC.value).room; U.openModal(document.getElementById("addModal"));
  });
  fC.addEventListener("change", function () { fR.value = course(fC.value).room; });
  document.getElementById("addForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var d = +fD.value, s = fS.value;
    if (!fR.value.trim()) { fE.textContent = "Please enter a room or venue."; return; }
    if (entries().some(function (x) { return x.day === d && x.slot === s; })) { fE.textContent = "You already have a class in that slot. Pick a free slot."; return; }
    extras.push({ day: d, slot: s, code: fC.value, room: fR.value.trim() });
    U.store.set("extraClasses", extras);
    U.closeModal(document.getElementById("addModal")); render();
    U.toast("Extra class added on " + DAYS[d] + ", " + slotLabel(s), "success");
  });

  document.getElementById("schedSearch").addEventListener("input", function () { query = this.value.toLowerCase().trim(); render(); });
  document.getElementById("printBtn").addEventListener("click", function () { window.print(); });

  // calendar export (.ics, weekly recurrence)
  document.getElementById("exportIcsBtn").addEventListener("click", function () {
    var byday = ["MO", "TU", "WE", "TH", "FR", "SA"];
    var monday = new Date(); monday.setDate(monday.getDate() - todayIdx);
    function pad(n) { return String(n).padStart(2, "0"); }
    var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//GLA UMS//Faculty Schedule//EN"];
    entries().forEach(function (e, i) {
      var s = SLOTS.filter(function (x) { return x.id === e.slot; })[0];
      var dt = new Date(monday); dt.setDate(monday.getDate() + e.day);
      var ymd = dt.getFullYear() + pad(dt.getMonth() + 1) + pad(dt.getDate());
      function hm(m) { return pad(Math.floor(m / 60)) + pad(m % 60) + "00"; }
      lines.push("BEGIN:VEVENT", "UID:ums-" + i + "@gla.ac.in", "DTSTART:" + ymd + "T" + hm(s.start), "DTEND:" + ymd + "T" + hm(s.end),
        e.extra ? "RRULE:FREQ=DAILY;COUNT=1" : "RRULE:FREQ=WEEKLY;BYDAY=" + byday[e.day],
        "SUMMARY:" + e.code + " " + course(e.code).name, "LOCATION:" + e.room, "END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    U.download("faculty-schedule.ics", lines.join("\r\n"), "text/calendar");
    U.toast("Calendar file downloaded", "success");
  });

  render();
});
