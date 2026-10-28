// =============================================
// GLA UMS – Faculty Dashboard JavaScript (Enhanced)
// =============================================

document.addEventListener("DOMContentLoaded", function () {

  // ── SHARED UTILITY: Toast notification ───────────────────────────────────
  function showToast(message, type) {
    // type: "success" | "error" | "info" | "warning"
    var colors = { success: "#16a34a", error: "#dc2626", info: "#2563eb", warning: "#f59e0b" };
    var toast = document.createElement("div");
    toast.innerHTML = message;
    toast.style.cssText = [
      "position:fixed; bottom:28px; right:28px; z-index:9999;",
      "padding:13px 20px; border-radius:10px;",
      "font-size:.875rem; font-weight:600; color:#fff;",
      "background:" + (colors[type] || colors.info) + ";",
      "box-shadow:0 4px 20px rgba(0,0,0,.25); transition:opacity .4s;",
      "display:flex; align-items:center; gap:8px; max-width:320px;"
    ].join("");
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = "0";
      setTimeout(function () { toast.remove(); }, 400);
    }, 3500);
  }

  // ── 1. LIVE CLOCK (updates every second) ─────────────────────────────────
  var dateTags = document.querySelectorAll(".welcome-tag");
  var clockTag = null;
  dateTags.forEach(function (tag) {
    if (tag.querySelector(".bi-calendar3")) clockTag = tag;
  });

  function updateClock() {
    if (!clockTag) return;
    var now     = new Date();
    var days    = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var months  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var h       = now.getHours();
    var m       = String(now.getMinutes()).padStart(2, "0");
    var s       = String(now.getSeconds()).padStart(2, "0");
    var ampm    = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    clockTag.innerHTML = '<i class="bi bi-calendar3"></i> '
      + days[now.getDay()] + ", " + now.getDate() + " " + months[now.getMonth()] + " " + now.getFullYear()
      + " &nbsp;|&nbsp; " + h + ":" + m + ":" + s + " " + ampm;
  }
  updateClock();
  setInterval(updateClock, 1000);  // every second so seconds tick

  // ── 2. GREETING based on time ─────────────────────────────────────────────
  var greetingEl = document.querySelector(".greeting");
  if (greetingEl) {
    var hr = new Date().getHours();
    var g  = hr < 12 ? "Good Morning ☀" : hr < 17 ? "Good Afternoon 🌤" : "Good Evening 🌙";
    greetingEl.textContent = g + " • " + greetingEl.textContent;
  }

  // ── 3. SIDEBAR TOGGLE (mobile) ────────────────────────────────────────────
  var topbar  = document.querySelector(".topbar");
  var sidebar = document.querySelector(".sidebar");

  if (topbar && sidebar) {
    var hamburger = document.createElement("button");
    hamburger.innerHTML   = '<i class="bi bi-list"></i>';
    hamburger.className   = "btn btn-outline";
    hamburger.id          = "sidebarToggle";
    hamburger.title       = "Toggle sidebar";
    hamburger.style.cssText = "margin-right:12px; font-size:1.3rem; display:none;";
    topbar.insertBefore(hamburger, topbar.firstChild);

    var sStyle = document.createElement("style");
    sStyle.textContent = [
      ".sidebar-open { transform:translateX(0) !important; }",
      ".sidebar-overlay { position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:199;display:none; }",
      ".sidebar-overlay.active { display:block; }"
    ].join("\n");
    document.head.appendChild(sStyle);

    var overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);

    function checkSize() {
      hamburger.style.display = window.innerWidth <= 900 ? "inline-flex" : "none";
      if (window.innerWidth > 900) {
        sidebar.classList.remove("sidebar-open");
        overlay.classList.remove("active");
      }
    }
    checkSize();
    window.addEventListener("resize", checkSize);

    hamburger.addEventListener("click", function () {
      sidebar.classList.toggle("sidebar-open");
      overlay.classList.toggle("active");
    });
    overlay.addEventListener("click", function () {
      sidebar.classList.remove("sidebar-open");
      overlay.classList.remove("active");
    });
  }

  // ── 4. TOPBAR SEARCH — searches schedule AND course cards ─────────────────
  var topSearchInput = document.querySelector(".topbar-search input");
  var noResultsMsg   = null;

  if (topSearchInput) {
    topSearchInput.addEventListener("input", function () {
      var q = topSearchInput.value.toLowerCase().trim();

      // Search schedule
      var scheduleItems = document.querySelectorAll(".classes-list li");
      scheduleItems.forEach(function (item) {
        item.style.display = (q === "" || item.textContent.toLowerCase().includes(q)) ? "" : "none";
      });

      // Search course cards
      var courseCards = document.querySelectorAll(".course-card");
      courseCards.forEach(function (card) {
        card.style.display = (q === "" || card.textContent.toLowerCase().includes(q)) ? "" : "none";
      });

      // Show a "no results" message if nothing matches
      var schedulePanel = document.getElementById("schedule");
      if (schedulePanel) {
        var existing = schedulePanel.querySelector(".no-results-msg");
        var anyVisible = Array.from(scheduleItems).some(function (i) { return i.style.display !== "none"; });
        if (!anyVisible && q !== "") {
          if (!existing) {
            var msg = document.createElement("p");
            msg.className = "no-results-msg";
            msg.style.cssText = "text-align:center; color:#888; padding:16px; font-size:.875rem;";
            msg.textContent = "No schedule items match "" + q + """;
            schedulePanel.querySelector(".classes-list").after(msg);
          }
        } else if (existing) {
          existing.remove();
        }
      }
    });
  }

  // ── 5. PROFILE DROPDOWN with keyboard close (Escape) ─────────────────────
  var profileEl = document.querySelector(".topbar-profile");
  if (profileEl && topbar) {
    var profileMenu = document.createElement("div");
    profileMenu.style.cssText = [
      "position:absolute; top:62px; right:16px;",
      "background:var(--surface); border:1px solid var(--border);",
      "border-radius:10px; box-shadow:0 8px 24px rgba(0,0,0,.15);",
      "min-width:200px; padding:8px 0; display:none; z-index:999;"
    ].join("");

    var sessionRole = sessionStorage.getItem("ums_role") || "Faculty";
    var sessionUser = sessionStorage.getItem("ums_user") || "Mr. Yash Singh";

    profileMenu.innerHTML = [
      '<div style="padding:12px 16px; border-bottom:1px solid var(--border); margin-bottom:4px;">',
        '<div style="font-weight:700; font-size:.875rem;">' + sessionUser + '</div>',
        '<div style="font-size:.75rem; color:#888;">' + sessionRole.charAt(0).toUpperCase() + sessionRole.slice(1) + ' · GLA University</div>',
      '</div>',
      '<a href="#" class="pm-link"><i class="bi bi-person-circle"></i> My Profile</a>',
      '<a href="#" class="pm-link"><i class="bi bi-shield-lock"></i> Change Password</a>',
      '<a href="#" class="pm-link"><i class="bi bi-gear"></i> Preferences</a>',
      '<hr style="margin:4px 0; border-color:var(--border);">',
      '<a href="../auth/login.html" class="pm-link" style="color:#dc2626 !important;"><i class="bi bi-box-arrow-right"></i> Logout</a>'
    ].join("");

    var pmStyle = document.createElement("style");
    pmStyle.textContent = ".pm-link{display:flex;align-items:center;gap:9px;padding:9px 16px;color:var(--text);text-decoration:none;font-size:.875rem;transition:background .15s;} .pm-link:hover{background:var(--bg);}";
    document.head.appendChild(pmStyle);

    topbar.style.position = "relative";
    topbar.appendChild(profileMenu);
    profileEl.style.cursor = "pointer";

    profileEl.addEventListener("click", function (e) {
      e.stopPropagation();
      profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
    });
    document.addEventListener("click", function () { profileMenu.style.display = "none"; });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") profileMenu.style.display = "none";
    });
  }

  // ── 6. NOTIFICATION PANEL — badge clears + marks items as read ───────────
  var notifToggle = document.getElementById("notif-toggle");
  var notifBadge  = document.querySelector(".notif-badge");

  if (notifToggle && notifBadge) {
    notifToggle.addEventListener("change", function () {
      if (notifToggle.checked) {
        setTimeout(function () {
          notifBadge.textContent = "0";
          notifBadge.style.background = "#888";
          // Dim all unread notification items
          document.querySelectorAll(".notif-list li").forEach(function (li) {
            li.style.opacity = "0.65";
          });
        }, 600);
      }
    });
  }

  // ── 7. STAT CARDS — animated count-up on page load ───────────────────────
  function animateCount(el, target, suffix, duration) {
    var start     = 0;
    var step      = duration / 50;     // 50 animation frames
    var increment = target / 50;
    var isFloat   = target % 1 !== 0;

    var timer = setInterval(function () {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = isFloat ? start.toFixed(1) + suffix : Math.floor(start) + suffix;
    }, step);
  }

  var statValues = document.querySelectorAll(".stat-value");
  statValues.forEach(function (el) {
    var raw    = el.textContent.trim();
    var suffix = raw.includes("%") ? "%" : "";
    var num    = parseFloat(raw.replace("%", ""));
    if (!isNaN(num)) {
      el.textContent = "0" + suffix;
      animateCount(el, num, suffix, 1200);
    }
  });

  // ── 8. SCHEDULE STATUS — highlight the NEXT upcoming class dynamically ────
  // Based on current time, auto-mark which class is "Next Up"
  var scheduleItems = document.querySelectorAll(".classes-list li");
  var now           = new Date();
  var currentMins   = now.getHours() * 60 + now.getMinutes();

  scheduleItems.forEach(function (item) {
    var timeEl = item.querySelector(".class-time");
    if (!timeEl) return;

    // Parse "09:00 AM" from the first line of the time cell
    var timeText = timeEl.innerText.split("\n")[0].trim();   // e.g. "09:00 AM"
    var match    = timeText.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return;

    var h = parseInt(match[1]);
    var m = parseInt(match[2]);
    if (match[3].toUpperCase() === "PM" && h !== 12) h += 12;
    if (match[3].toUpperCase() === "AM" && h === 12) h = 0;
    var classMins = h * 60 + m;

    // If the class starts in the future but within the next 2 hours — highlight it
    var diff = classMins - currentMins;
    if (diff > 0 && diff <= 120) {
      var pill = item.querySelector(".pill");
      if (pill && !pill.classList.contains("green")) {
        pill.textContent = "In " + diff + " min";
      }
    }
  });

  // ── 9. COURSE CARDS — hover pop effect + click shows a quick stats modal ──
  var courseCards = document.querySelectorAll(".course-card");

  // Inject modal HTML once
  var modal = document.createElement("div");
  modal.id  = "courseModal";
  modal.style.cssText = [
    "display:none; position:fixed; inset:0; background:rgba(0,0,0,.45);",
    "z-index:9000; align-items:center; justify-content:center;"
  ].join("");
  modal.innerHTML = [
    '<div style="background:var(--surface);border-radius:16px;padding:28px 32px;',
    'max-width:400px;width:90%;box-shadow:0 12px 40px rgba(0,0,0,.3);position:relative;">',
    '<button id="closeModal" style="position:absolute;top:14px;right:16px;background:none;',
    'border:none;font-size:1.4rem;cursor:pointer;color:var(--text);">&times;</button>',
    '<div id="modalContent"></div></div>'
  ].join("");
  document.body.appendChild(modal);

  document.getElementById("closeModal").addEventListener("click", function () {
    modal.style.display = "none";
  });
  modal.addEventListener("click", function (e) {
    if (e.target === modal) modal.style.display = "none";
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") modal.style.display = "none";
  });

  courseCards.forEach(function (card) {
    // Hover lift
    card.style.transition = "transform .2s, box-shadow .2s";
    card.addEventListener("mouseenter", function () {
      card.style.transform  = "translateY(-4px)";
      card.style.boxShadow  = "0 8px 24px rgba(0,0,0,.12)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform  = "";
      card.style.boxShadow  = "";
    });

    // Click opens a quick-stats modal
    card.addEventListener("click", function (e) {
      if (e.target.tagName === "A") return;   // let nav links work normally

      var code     = card.querySelector(".course-code")   ? card.querySelector(".course-code").textContent.trim()   : "";
      var name     = card.querySelector(".course-name")   ? card.querySelector(".course-name").textContent.trim()   : "";
      var attd     = card.querySelector(".pill")          ? card.querySelector(".pill").textContent.trim()           : "";
      var students = card.querySelector(".course-meta span") ? card.querySelector(".course-meta span").textContent.trim() : "";
      var fillEl   = card.querySelector(".course-progress-fill");
      var progress = fillEl ? fillEl.style.width : "0%";

      document.getElementById("modalContent").innerHTML = [
        '<h3 style="margin:0 0 4px;">' + name + '</h3>',
        '<p style="color:#888;font-size:.85rem;margin:0 0 20px;">' + code + '</p>',
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;">',
          '<div style="text-align:center;background:var(--bg);padding:14px;border-radius:10px;">',
            '<div style="font-size:1.5rem;font-weight:800;color:var(--primary-light);">' + attd + '</div>',
            '<div style="font-size:.75rem;color:#888;margin-top:4px;">Attendance</div></div>',
          '<div style="text-align:center;background:var(--bg);padding:14px;border-radius:10px;">',
            '<div style="font-size:1.5rem;font-weight:800;color:var(--primary-light);">' + progress + '</div>',
            '<div style="font-size:.75rem;color:#888;margin-top:4px;">Syllabus Done</div></div>',
        '</div>',
        '<p style="color:#888;font-size:.875rem;">' + students + '</p>',
        '<div style="display:flex;gap:10px;margin-top:16px;">',
          '<a href="attendance.html" class="btn btn-outline" style="flex:1;text-align:center;">Attendance</a>',
          '<a href="results.html" class="btn" style="flex:1;text-align:center;">Results</a>',
        '</div>'
      ].join("");

      modal.style.display = "flex";
    });
  });

  // ── 10. DONUT CHART — animate on load ────────────────────────────────────
  var donut = document.querySelector(".donut");
  if (donut) {
    // Start from grey, animate to real values
    donut.style.background = "conic-gradient(#e5e7eb 0% 100%)";
    setTimeout(function () {
      donut.style.transition = "background 1s ease";
      donut.style.background = "conic-gradient(var(--green) 0% 76%, var(--orange) 76% 92%, #dc2626 92% 100%)";
    }, 400);
  }

  // ── 11. QUICK ACTION BUTTONS — ripple effect + toast feedback ────────────
  var quickBtns = document.querySelectorAll(".quick-action-btn");
  var rippleStyle = document.createElement("style");
  rippleStyle.textContent = [
    ".quick-action-btn{position:relative;overflow:hidden;}",
    ".ripple{position:absolute;border-radius:50%;background:rgba(255,255,255,.35);",
    "transform:scale(0);animation:ripple-anim .5s linear;pointer-events:none;}",
    "@keyframes ripple-anim{to{transform:scale(4);opacity:0;}}"
  ].join("");
  document.head.appendChild(rippleStyle);

  quickBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      // Ripple
      var circle = document.createElement("span");
      circle.className = "ripple";
      var size = Math.max(btn.offsetWidth, btn.offsetHeight);
      circle.style.width = circle.style.height = size + "px";
      var rect = btn.getBoundingClientRect();
      circle.style.left = (e.clientX - rect.left - size / 2) + "px";
      circle.style.top  = (e.clientY - rect.top  - size / 2) + "px";
      btn.appendChild(circle);
      setTimeout(function () { circle.remove(); }, 500);
    });
  });

  // ── 12. NOTICES / EVENTS — countdown to each event date ──────────────────
  var eventDates = document.querySelectorAll(".event-date");
  var eventInfos = document.querySelectorAll(".event-info");
  var eventMonths = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };

  eventDates.forEach(function (dateEl, i) {
    var dayEl = dateEl.querySelector(".day");
    var monEl = dateEl.querySelector(".mon");
    if (!dayEl || !monEl) return;

    var day   = parseInt(dayEl.textContent);
    var month = eventMonths[monEl.textContent.trim()];
    var year  = new Date().getFullYear();
    var eventDate = new Date(year, month, day);
    var today     = new Date(); today.setHours(0,0,0,0);
    var diff      = Math.round((eventDate - today) / (1000 * 60 * 60 * 24));

    var infoEl = eventInfos[i];
    if (infoEl && !infoEl.querySelector(".countdown")) {
      var countdown = document.createElement("span");
      countdown.className = "countdown";
      countdown.style.cssText = "font-size:.72rem; font-weight:700; margin-left:6px; padding:2px 7px; border-radius:20px;";
      if (diff < 0) {
        countdown.style.background = "#f3f4f6"; countdown.style.color = "#9ca3af";
        countdown.textContent = "Past";
      } else if (diff === 0) {
        countdown.style.background = "#fef3c7"; countdown.style.color = "#b45309";
        countdown.textContent = "Today!";
      } else if (diff <= 3) {
        countdown.style.background = "#fef3c7"; countdown.style.color = "#b45309";
        countdown.textContent = "In " + diff + "d";
      } else {
        countdown.style.background = "#dcfce7"; countdown.style.color = "#15803d";
        countdown.textContent = "In " + diff + "d";
      }
      var metaEl = infoEl.querySelector(".meta");
      if (metaEl) metaEl.appendChild(countdown);
    }
  });

  // ── 13. KEYBOARD SHORTCUT HELP (press ?) ─────────────────────────────────
  document.addEventListener("keydown", function (e) {
    if (e.key === "?" && !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)) {
      showToast("Shortcuts: <b>?</b> Help &nbsp;|&nbsp; <b>/</b> Search &nbsp;|&nbsp; <b>Esc</b> Close", "info");
    }
    if (e.key === "/" && !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      var si = document.querySelector(".topbar-search input");
      if (si) { si.focus(); }
    }
  });

});
