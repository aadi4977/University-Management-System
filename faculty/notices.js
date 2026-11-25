// GLA UMS – Faculty: Notices & Circulars
document.addEventListener("DOMContentLoaded", function () {
  var U = window.UMS, esc = U.esc;
  var SEED = [
    { id: "n1", cat: "Examination", icon: "file-earmark-text-fill", tone: "blue", title: "Mid-Term marks upload window open", by: "Examination Cell", date: "2026-09-25", body: "Faculty must upload Mid-Term marks for all assigned courses through the Results page. The portal closes on 5 October 2026 at 5:00 PM; late entries need written approval from the Controller of Examinations." },
    { id: "n2", cat: "Academic", icon: "exclamation-triangle-fill", tone: "orange", title: "Attendance shortfall list generation", by: "Dean Academics", date: "2026-09-28", body: "Shortfall lists (below 75%) will be generated on 28 September. Faculty are requested to finalise attendance for all lectures held up to 27 September and counsel students in the shortfall category." },
    { id: "n3", cat: "Administrative", icon: "people-fill", tone: "green", title: "Department faculty review meeting", by: "Head of Department, CEA", date: "2026-10-02", body: "Review meeting in Conference Room A at 3:30 PM. Agenda: syllabus progress, lab readiness, mini-project evaluation schedule and industrial visit planning." },
    { id: "n4", cat: "Examination", icon: "clipboard-check", tone: "blue", title: "Invigilation duty roster published", by: "Examination Cell", date: "2026-10-06", body: "Invigilation duties for the Mid-Term examination have been published. Check your allotted hall and slot and request swaps at least 48 hours in advance." },
    { id: "n5", cat: "Academic", icon: "journal-richtext", tone: "green", title: "Submit course files for NAAC audit", by: "IQAC", date: "2026-10-10", body: "Upload course plans, lesson records, assignment sets and sample answer sheets for the current semester to the departmental repository before 20 October." },
    { id: "n6", cat: "Administrative", icon: "calendar-x", tone: "red", title: "University holiday: Diwali break", by: "Registrar Office", date: "2026-11-08", body: "The university will remain closed from 8 to 11 November 2026 on account of Diwali. Classes resume on Thursday, 12 November. Please plan makeup classes accordingly." }
  ];
  var read = U.store.get("noticesRead", {});
  var mine = U.store.get("myNotices", []);
  var cat = "all", query = "";
  var listEl = document.getElementById("noticeList");

  function all() {
    var posts = mine.map(function (m) { return Object.assign({ icon: "megaphone-fill", tone: "blue", mine: true }, m); });
    return posts.concat(SEED).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  }
  function fmt(d) { return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  function isUnread(n) { return !n.mine && !read[n.id]; }

  function render() {
    var items = all().filter(function (n) {
      var okC = cat === "all" || (cat === "My Posts" ? n.mine : n.cat === cat);
      var okQ = !query || (n.title + " " + n.body + " " + n.by).toLowerCase().indexOf(query) > -1;
      return okC && okQ;
    });
    var unread = all().filter(isUnread).length;
    document.getElementById("cntAll").textContent = unread ? "(" + unread + " new)" : "";
    if (!items.length) {
      listEl.innerHTML = '<div class="empty-state"><i class="bi bi-inbox"></i>' + (cat === "My Posts" ? "You haven't posted any notices yet." : "No notices match your filter.") + "</div>";
      return;
    }
    listEl.innerHTML = items.map(function (n) {
      return '<article class="notice-item' + (isUnread(n) ? " unread" : "") + '" data-id="' + n.id + '">' +
        '<div class="ico ' + n.tone + '"><i class="bi bi-' + n.icon + '"></i></div>' +
        '<div style="min-width:0"><h4>' + esc(n.title) + (isUnread(n) ? ' <span class="pill blue" style="padding:1px 8px;font-size:.68rem">New</span>' : "") + "</h4>" +
        '<div class="by">' + esc(n.by) + " &bull; " + fmt(n.date) + " &bull; " + esc(n.cat) + "</div><p>" + esc(n.body) + "</p></div>" +
        '<div class="actions">' + (isUnread(n) ? '<button class="icon-btn" data-act="read" title="Mark as read" aria-label="Mark as read"><i class="bi bi-check2"></i></button>' : "") +
        (n.mine ? '<button class="icon-btn" data-act="del" title="Delete" aria-label="Delete notice"><i class="bi bi-trash"></i></button>' : "") + "</div></article>";
    }).join("");
  }

  listEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]"); if (!b) return;
    var id = b.closest(".notice-item").dataset.id;
    if (b.dataset.act === "read") { read[id] = true; U.store.set("noticesRead", read); render(); }
    if (b.dataset.act === "del" && confirm("Delete this notice? Students will no longer see it.")) {
      mine = mine.filter(function (m) { return m.id !== id; }); U.store.set("myNotices", mine); render(); U.toast("Notice deleted", "info");
    }
  });
  document.getElementById("markAllBtn").addEventListener("click", function () {
    all().forEach(function (n) { read[n.id] = true; }); U.store.set("noticesRead", read); render(); U.toast("All notices marked as read", "success");
  });
  document.getElementById("noticeTabs").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("active", x === b); });
    cat = b.dataset.cat; render();
  });
  document.getElementById("noticeSearch").addEventListener("input", function () { query = this.value.toLowerCase().trim(); render(); });

  // compose
  var fC = document.getElementById("nfCourse"), fCat = document.getElementById("nfCat"), fT = document.getElementById("nfTitle"), fB = document.getElementById("nfBody");
  fC.innerHTML = U.courses.map(function (c) { return '<option value="' + c.code + '">' + c.code + " – " + esc(c.name) + "</option>"; }).join("");
  fB.addEventListener("input", function () { document.getElementById("nfCount").textContent = fB.value.length; });
  document.getElementById("newNoticeBtn").addEventListener("click", function () {
    document.getElementById("noticeForm").reset(); document.getElementById("nfCount").textContent = "0";
    ["nfTitleErr", "nfBodyErr"].forEach(function (i) { document.getElementById(i).textContent = ""; });
    U.openModal(document.getElementById("noticeModal"));
  });
  document.getElementById("noticeForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    var te = document.getElementById("nfTitleErr"), be = document.getElementById("nfBodyErr");
    te.textContent = fT.value.trim().length < 5 ? (ok = false, "Title must be at least 5 characters.") : "";
    be.textContent = fB.value.trim().length < 10 ? (ok = false, "Message must be at least 10 characters.") : "";
    if (!ok) return;
    var d = new Date(), iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    mine.push({ id: "m" + Date.now(), cat: fCat.value, title: fT.value.trim(), body: fB.value.trim(), date: iso, by: "You • " + fC.value + " students" });
    U.store.set("myNotices", mine);
    U.closeModal(document.getElementById("noticeModal"));
    render(); U.toast("Notice published to " + fC.value + " students", "success");
  });

  render();
});
