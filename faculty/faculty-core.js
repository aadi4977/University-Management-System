// =============================================
// GLA UMS – Faculty Portal shared behaviour
// Loaded on every faculty page (before the page's own script).
// Provides: session guard, mobile drawer, profile menu, toasts,
// notification badge, and a tiny localStorage-backed store.
// =============================================

(function () {
  "use strict";

  // ── Session guard ─────────────────────────────────────────────────────────
  function readSession(key) {
    try { return sessionStorage.getItem(key) || localStorage.getItem(key); } catch (e) { return null; }
  }

  var role = readSession("ums_role");
  if (role !== "faculty") {
    // Not signed in as faculty -> back to login
    window.location.replace("../auth/login.html");
    return;
  }

  // ── Tiny store (localStorage with in-memory fallback) ─────────────────────
  var memory = {};
  var store = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem("ums_fac_" + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return key in memory ? memory[key] : fallback;
      }
    },
    set: function (key, value) {
      memory[key] = value;
      try { localStorage.setItem("ums_fac_" + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    }
  };

  // ── Toasts ────────────────────────────────────────────────────────────────
  var stack = null;
  function toast(message, type) {
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.setAttribute("aria-live", "polite");
      document.body.appendChild(stack);
    }
    var icons = { success: "check-circle-fill", error: "x-circle-fill", warning: "exclamation-triangle-fill", info: "info-circle-fill" };
    var t = document.createElement("div");
    t.className = "toast-item " + (type || "info");
    t.innerHTML = '<i class="bi bi-' + (icons[type] || icons.info) + '"></i><span>' + message + "</span>";
    stack.appendChild(t);
    setTimeout(function () {
      t.style.transition = "opacity .3s";
      t.style.opacity = "0";
      setTimeout(function () { t.remove(); }, 300);
    }, 3200);
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ── Profile (shared between topbar and profile page) ─────────────────────
  var defaultProfile = {
    name: "Mr. Yash Singh",
    email: "yash.singh@gla.ac.in",
    phone: "+91 98765 43210",
    designation: "Assistant Professor",
    department: "Computer Engineering & Applications",
    empId: "GLA-FAC-2041",
    cabin: "Academic Block 2, Cabin 304",
    qualification: "M.Tech (CSE)",
    joined: "July 2019",
    bio: "Teaches Full Stack Using Scripting Technologies (theory and lab) and Competitive Programming. Faculty supervisor for the B.Tech CSE 3rd-year mini project."
  };

  function getProfile() {
    var p = store.get("profile", {});
    var out = {};
    for (var k in defaultProfile) out[k] = p[k] !== undefined ? p[k] : defaultProfile[k];
    return out;
  }

  function initials(name) {
    return name.replace(/^(Mr|Mrs|Ms|Dr|Prof)\.?\s+/i, "").split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join("");
  }

  function applyProfileToShell() {
    var p = getProfile();
    document.querySelectorAll(".topbar-profile .avatar").forEach(function (a) { a.textContent = initials(p.name); });
    document.querySelectorAll(".topbar-profile .name").forEach(function (n) { n.textContent = p.name; });
  }

  // ── Shell wiring (after DOM is ready) ────────────────────────────────────
  function initShell() {
    var topbar = document.querySelector(".topbar");
    var sidebar = document.querySelector(".sidebar");

    // Mobile drawer
    if (topbar && sidebar) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "menu-btn";
      btn.setAttribute("aria-label", "Open navigation");
      btn.innerHTML = '<i class="bi bi-list"></i>';
      topbar.insertBefore(btn, topbar.firstChild);

      var spacer = document.createElement("div");
      spacer.className = "topbar-spacer";
      topbar.insertBefore(spacer, btn.nextSibling);

      var overlay = document.createElement("div");
      overlay.className = "sidebar-overlay";
      document.body.appendChild(overlay);

      var close = function () { sidebar.classList.remove("sidebar-open"); overlay.classList.remove("active"); };
      btn.addEventListener("click", function () {
        sidebar.classList.toggle("sidebar-open");
        overlay.classList.toggle("active");
      });
      overlay.addEventListener("click", close);
      sidebar.addEventListener("click", function (e) { if (e.target.closest("a")) close(); });
      window.addEventListener("resize", function () { if (window.innerWidth > 900) close(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    }

    // Profile dropdown
    var profileEl = document.querySelector(".topbar-profile");
    if (profileEl && topbar) {
      profileEl.setAttribute("role", "button");
      profileEl.setAttribute("tabindex", "0");
      profileEl.setAttribute("aria-haspopup", "true");

      var menu = document.createElement("div");
      menu.className = "profile-menu";
      menu.innerHTML =
        '<div class="pm-head"><strong></strong><span>GLA University, Mathura</span></div>' +
        '<a href="profile.html"><i class="bi bi-person-circle"></i> My Profile</a>' +
        '<a href="profile.html#security"><i class="bi bi-shield-lock"></i> Change Password</a>' +
        '<a href="profile.html#preferences"><i class="bi bi-gear"></i> Preferences</a>' +
        '<a href="#" class="danger" data-logout><i class="bi bi-box-arrow-right"></i> Logout</a>';
      topbar.appendChild(menu);

      var toggle = function (open) {
        menu.querySelector("strong").textContent = getProfile().name;
        menu.classList.toggle("open", open);
        profileEl.setAttribute("aria-expanded", open ? "true" : "false");
      };
      profileEl.addEventListener("click", function (e) { e.stopPropagation(); toggle(!menu.classList.contains("open")); });
      profileEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(!menu.classList.contains("open")); }
      });
      document.addEventListener("click", function (e) { if (!menu.contains(e.target)) toggle(false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });
    }

    // Logout (sidebar link + profile menu)
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      if (a.hasAttribute("data-logout") || /auth\/login\.html$/.test(a.getAttribute("href") || "")) {
        try {
          ["ums_role", "ums_user"].forEach(function (k) { sessionStorage.removeItem(k); localStorage.removeItem(k); });
        } catch (err) { /* ignore */ }
        if (a.hasAttribute("data-logout")) { e.preventDefault(); window.location.href = "../auth/login.html"; }
      }
    });

    // Notification bell: clear badge once opened (state remembered)
    var notifToggle = document.getElementById("notif-toggle");
    var badge = document.querySelector(".notif-badge");
    if (notifToggle && badge) {
      if (store.get("notifRead", false)) badge.style.display = "none";
      notifToggle.addEventListener("change", function () {
        if (notifToggle.checked) { store.set("notifRead", true); badge.style.display = "none"; }
      });
      document.addEventListener("click", function (e) {
        if (notifToggle.checked && !e.target.closest(".notif-wrap")) notifToggle.checked = false;
      });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") notifToggle.checked = false; });
    }

    applyProfileToShell();
  }

  // ── Modal helper for JS-driven modals (.modal-overlay.active) ────────────
  function openModal(el) {
    el.classList.add("active");
    var first = el.querySelector("input:not([readonly]), select, textarea, button");
    if (first) setTimeout(function () { first.focus(); }, 50);
  }
  function closeModal(el) { el.classList.remove("active"); }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") document.querySelectorAll(".modal-overlay.active").forEach(closeModal);
  });
  document.addEventListener("click", function (e) {
    if (e.target.classList && e.target.classList.contains("modal-overlay") && e.target.classList.contains("active")) closeModal(e.target);
    var c = e.target.closest("[data-close-modal]");
    if (c) { var o = c.closest(".modal-overlay"); if (o) closeModal(o); }
  });

  // ── Shared sample data used by courses / schedule / notices ──────────────
  var COURSES = [
    { code: "BCSE1251", name: "Full Stack Using Scripting Technologies", credits: 4, students: 60, section: "3B", room: "AB2-304", attendance: 84, type: "Theory", color: "blue",
      units: ["Unit 1 – Modern JavaScript (ES6+)", "Unit 2 – Node.js & Express", "Unit 3 – MongoDB & Mongoose", "Unit 4 – React Fundamentals", "Unit 5 – Deployment & Testing"], done: 4 },
    { code: "BCSE0281", name: "Full Stack Using Scripting Technologies Lab", credits: 2, students: 60, section: "3B (Lab 1)", room: "Computer Lab 7", attendance: 92, type: "Practical", color: "purple",
      units: ["Exp 1–2 – JavaScript & DOM", "Exp 3–4 – Node.js REST APIs", "Exp 5–6 – MongoDB CRUD", "Exp 7–8 – React Components & Hooks", "Exp 9–10 – Mini Project Deployment"], done: 4 },
    { code: "PCPH0002", name: "Competitive Programming", credits: 2, students: 64, section: "3C", room: "AB1-102", attendance: 79, type: "Theory", color: "green",
      units: ["Unit 1 – Complexity & STL / Collections", "Unit 2 – Sorting, Searching & Greedy", "Unit 3 – Dynamic Programming", "Unit 4 – Graph Algorithms", "Unit 5 – Number Theory & Contest Strategy"], done: 3 }
  ];

  window.UMS = {
    store: store,
    toast: toast,
    esc: esc,
    getProfile: getProfile,
    saveProfile: function (p) { store.set("profile", p); applyProfileToShell(); },
    initials: initials,
    openModal: openModal,
    closeModal: closeModal,
    courses: COURSES,
    download: function (filename, text, mime) {
      var blob = new Blob([text], { type: mime || "text/csv;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 500);
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initShell);
  else initShell();
})();
