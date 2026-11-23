// =============================================
// GLA UMS – Results / Gradebook Page JavaScript (Enhanced)
// =============================================

document.addEventListener("DOMContentLoaded", function () {

  // ── SHARED: Toast ─────────────────────────────────────────────────────────
  function showToast(message, type) {
    var colors = { success:"#16a34a", error:"#dc2626", info:"#2563eb", warning:"#f59e0b" };
    var toast  = document.createElement("div");
    toast.innerHTML = message;
    toast.style.cssText = [
      "position:fixed;bottom:28px;right:28px;z-index:9999;",
      "padding:13px 20px;border-radius:10px;font-size:.875rem;font-weight:600;color:#fff;",
      "background:" + (colors[type] || colors.info) + ";",
      "box-shadow:0 4px 20px rgba(0,0,0,.25);transition:opacity .4s;",
      "display:flex;align-items:center;gap:8px;max-width:340px;"
    ].join("");
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = "0";
      setTimeout(function () { toast.remove(); }, 400);
    }, 3500);
  }

  // ── 1. GRADE + TOTAL CALCULATION ──────────────────────────────────────────
  // Reads the actual columns from the HTML: written (col4), internal (col5),
  // total (col6, .total-score), percent (col7, .percent-val),
  // grade badge (col8, .grade-badge), status badge (col9, .status-badge)

  var GRADE_SCALE = [
    { min: 90, grade: "O",  pill: "green"  },
    { min: 80, grade: "A+", pill: "green"  },
    { min: 70, grade: "A",  pill: "blue"   },
    { min: 60, grade: "B+", pill: "blue"   },
    { min: 50, grade: "B",  pill: "purple" },
    { min: 40, grade: "C",  pill: "orange" },
    { min:  0, grade: "F",  pill: "red"    }
  ];

  function getGradeInfo(pct) {
    for (var i = 0; i < GRADE_SCALE.length; i++) {
      if (pct >= GRADE_SCALE[i].min) return GRADE_SCALE[i];
    }
    return GRADE_SCALE[GRADE_SCALE.length - 1];
  }

  function refreshAllRows() {
    var rows   = document.querySelectorAll("#gradesTableBody tr");
    var totals = [];

    rows.forEach(function (row) {
      var writtenInput  = row.querySelector(".written-input");
      var internalInput = row.querySelector(".internal-input");
      if (!writtenInput || !internalInput) return;

      var written  = parseFloat(writtenInput.value)  || 0;
      var internal = parseFloat(internalInput.value) || 0;
      var total    = written + internal;
      var maxTotal = (parseFloat(writtenInput.max) || 30) + (parseFloat(internalInput.max) || 20);
      var pct      = (total / maxTotal) * 100;
      var info     = getGradeInfo(pct);

      // Update total cell
      var totalCell = row.querySelector(".total-score");
      if (totalCell) totalCell.textContent = total.toFixed(1);

      // Update percent cell
      var pctCell = row.querySelector(".percent-val");
      if (pctCell) pctCell.textContent = pct.toFixed(1) + "%";

      // Update grade badge
      var gradeBadge = row.querySelector(".grade-badge");
      if (gradeBadge) {
        gradeBadge.textContent = info.grade;
        gradeBadge.className   = "pill " + info.pill + " grade-badge";
      }

      // Update pass/fail badge
      var statusBadge = row.querySelector(".status-badge");
      if (statusBadge) {
        var passed = info.grade !== "F";
        statusBadge.textContent = passed ? "Pass" : "Fail";
        statusBadge.className   = "pill " + (passed ? "green" : "red") + " status-badge";
      }

      totals.push({ total: total, pct: pct, grade: info.grade });
    });

    updateSummaryStats(totals);
    updateGradeDistributionBar(totals);
    return totals;
  }

  // ── 2. SUMMARY STAT CARDS (live) ──────────────────────────────────────────
  function updateSummaryStats(totals) {
    if (totals.length === 0) return;
    var sum     = totals.reduce(function (a, b) { return a + b.total; }, 0);
    var avg     = sum / totals.length;
    var highest = Math.max.apply(null, totals.map(function (t) { return t.total; }));
    var lowest  = Math.min.apply(null, totals.map(function (t) { return t.total; }));
    var passed  = totals.filter(function (t) { return t.grade !== "F"; }).length;
    var passRate = Math.round((passed / totals.length) * 100);

    var el = function (id) { return document.getElementById(id); };
    if (el("classAvgStat"))     el("classAvgStat").textContent     = avg.toFixed(1) + " / 50";
    if (el("highestScoreStat")) el("highestScoreStat").textContent = highest.toFixed(1) + " / 50";
    if (el("lowestScoreStat"))  el("lowestScoreStat").textContent  = lowest.toFixed(1)  + " / 50";
    if (el("passRateStat"))     el("passRateStat").textContent     = passRate + "%";
  }

  // ── 3. GRADE DISTRIBUTION BAR (injected below the stats) ─────────────────
  var distBarInjected = false;

  function updateGradeDistributionBar(totals) {
    var statRow = document.querySelector(".stat-row") || document.querySelector(".results-stat-row");
    if (!statRow) return;

    var container = document.getElementById("gradeDistBar");
    if (!container) {
      container = document.createElement("div");
      container.id = "gradeDistBar";
      container.style.cssText = [
        "background:var(--surface);border-radius:12px;padding:16px 20px;",
        "margin-top:16px;border:1px solid var(--border);"
      ].join("");
      statRow.insertAdjacentElement("afterend", container);
    }

    // Count each grade
    var counts = {};
    GRADE_SCALE.forEach(function (g) { counts[g.grade] = 0; });
    totals.forEach(function (t) { counts[t.grade] = (counts[t.grade] || 0) + 1; });

    var colorMap = { O:"#16a34a", "A+":"#22c55e", A:"#2563eb", "B+":"#7c3aed", B:"#a855f7", C:"#f59e0b", F:"#dc2626" };
    var total    = totals.length || 1;

    var bars = GRADE_SCALE.map(function (g) {
      var count = counts[g.grade] || 0;
      var pct   = (count / total * 100).toFixed(0);
      return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">' +
        '<span style="font-weight:700;font-size:.8rem;width:22px;color:' + colorMap[g.grade] + ';">' + g.grade + '</span>' +
        '<div style="flex:1;background:#f3f4f6;border-radius:20px;height:10px;overflow:hidden;">' +
          '<div style="width:' + pct + '%;height:100%;background:' + colorMap[g.grade] + ';border-radius:20px;transition:width .6s;"></div>' +
        '</div>' +
        '<span style="font-size:.75rem;color:#888;width:36px;">' + count + ' (' + pct + '%)</span>' +
      '</div>';
    }).join("");

    container.innerHTML = '<div style="font-weight:700;font-size:.875rem;margin-bottom:10px;">Grade Distribution</div>' + bars;
  }

  // ── 4. INPUT VALIDATION + live feedback ───────────────────────────────────
  document.querySelectorAll(".written-input, .internal-input").forEach(function (input) {
    input.addEventListener("input", function () {
      var max = parseFloat(input.getAttribute("max")) || 100;
      var val = parseFloat(input.value);

      // Clamp
      if (val > max) { input.value = max; val = max; }
      if (val < 0)   { input.value = 0;   val = 0; }

      // Border feedback
      input.style.borderColor = (isNaN(val) || input.value === "") ? "#dc2626" : "#16a34a";
      input.style.outline     = "none";

      refreshAllRows();
      hasUnsaved = true;
    });

    // Tab between inputs easily
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        var allInputs = Array.from(document.querySelectorAll(".marks-input"));
        var idx = allInputs.indexOf(input);
        if (allInputs[idx + 1]) allInputs[idx + 1].focus();
      }
    });
  });

  // Run once on load
  refreshAllRows();

  // ── 5. TABLE SORTING by column header click ────────────────────────────────
  var sortState = {};   // { colIndex: true/false } = ascending/descending
  var thead = document.querySelector("#gradesTable thead tr");
  if (thead) {
    thead.querySelectorAll("th").forEach(function (th, idx) {
      th.style.cursor = "pointer";
      th.title        = "Click to sort";

      th.addEventListener("click", function () {
        sortState[idx] = !sortState[idx];
        thead.querySelectorAll("th").forEach(function (t) {
          t.textContent = t.textContent.replace(/ ▲| ▼/g, "");
        });
        th.textContent += sortState[idx] ? " ▲" : " ▼";

        var tbody = document.getElementById("gradesTableBody");
        var rows  = Array.from(tbody.querySelectorAll("tr"));

        rows.sort(function (a, b) {
          var aCell = a.querySelectorAll("td")[idx];
          var bCell = b.querySelectorAll("td")[idx];
          if (!aCell || !bCell) return 0;

          var aText = aCell.textContent.trim().replace("%","");
          var bText = bCell.textContent.trim().replace("%","");
          var aNum  = parseFloat(aText);
          var bNum  = parseFloat(bText);
          var cmp   = (!isNaN(aNum) && !isNaN(bNum)) ? aNum - bNum : aText.localeCompare(bText);
          return sortState[idx] ? cmp : -cmp;
        });

        rows.forEach(function (row) { tbody.appendChild(row); });
      });
    });
  }

  // ── 6. SEARCH / FILTER ────────────────────────────────────────────────────
  function applySearch(query) {
    query = query.toLowerCase().trim();
    document.querySelectorAll("#gradesTableBody tr").forEach(function (row) {
      var text = (row.getAttribute("data-name") || "") + " " +
                 (row.getAttribute("data-roll") || "") + " " +
                 row.textContent;
      row.style.display = (query === "" || text.toLowerCase().includes(query)) ? "" : "none";
    });
  }

  var gradeFilter = document.getElementById("gradeTableFilter");
  if (gradeFilter) gradeFilter.addEventListener("input", function () { applySearch(gradeFilter.value); });

  var topSearch = document.getElementById("topSearch");
  if (topSearch) topSearch.addEventListener("input", function () { applySearch(topSearch.value); });

  // ── 7. FILTER: show only Fail students ────────────────────────────────────
  // Add a "Show Failures" button near the table controls
  var gradeFilterWrap = gradeFilter ? gradeFilter.parentElement : null;
  if (gradeFilterWrap) {
    var failFilterBtn   = document.createElement("button");
    failFilterBtn.className = "btn btn-outline btn-sm";
    failFilterBtn.innerHTML = '<i class="bi bi-x-circle text-danger"></i> Show Failures';
    failFilterBtn.style.marginLeft = "8px";
    var showingFails = false;

    failFilterBtn.addEventListener("click", function () {
      showingFails = !showingFails;
      document.querySelectorAll("#gradesTableBody tr").forEach(function (row) {
        var badge = row.querySelector(".status-badge");
        if (!badge) return;
        row.style.display = showingFails ? (badge.textContent === "Fail" ? "" : "none") : "";
      });
      failFilterBtn.innerHTML = showingFails
        ? '<i class="bi bi-x-circle"></i> Show All'
        : '<i class="bi bi-x-circle text-danger"></i> Show Failures';

      if (showingFails) {
        var failCount = Array.from(document.querySelectorAll("#gradesTableBody tr"))
          .filter(function (r) { return r.style.display !== "none"; }).length;
        showToast(failCount > 0
          ? "⚠ <b>" + failCount + "</b> student(s) with grade F"
          : "✓ No failures — great class!", failCount > 0 ? "warning" : "success");
      }
    });

    gradeFilterWrap.appendChild(failFilterBtn);
  }

  // ── 8. UNSAVED CHANGES WARNING ────────────────────────────────────────────
  var hasUnsaved = false;
  window.addEventListener("beforeunload", function (e) {
    if (hasUnsaved) { e.preventDefault(); e.returnValue = ""; }
  });

  // ── 9. SAVE MARKS ─────────────────────────────────────────────────────────
  var saveBtn = document.getElementById("saveGradesTopBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      saveBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Saving…';
      saveBtn.disabled  = true;

      if (!document.getElementById("spin-style")) {
        var s = document.createElement("style");
        s.id  = "spin-style";
        s.textContent = "@keyframes spin{to{transform:rotate(360deg)}} .spin{display:inline-block;animation:spin .8s linear infinite;}";
        document.head.appendChild(s);
      }

      setTimeout(function () {
        hasUnsaved = false;
        saveBtn.innerHTML = '<i class="bi bi-cloud-arrow-up"></i> Save Marks';
        saveBtn.disabled  = false;
        var rows = document.querySelectorAll("#gradesTableBody tr");
        showToast("✓ Marks saved for <b>" + rows.length + "</b> students", "success");
      }, 1200);
    });
  }

  // ── 10. EXPORT CSV ────────────────────────────────────────────────────────
  var exportBtn = document.getElementById("exportGradebookBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      var rows  = document.querySelectorAll("#gradesTableBody tr");
      var lines = ["Roll No,Student Name,Written (/30),Internal (/20),Total (/50),Percentage,Grade,Status,Remarks"];

      rows.forEach(function (row) {
        var name     = row.getAttribute("data-name") || "";
        var roll     = row.getAttribute("data-roll") || "";
        var written  = row.querySelector(".written-input")  ? row.querySelector(".written-input").value  : "";
        var internal = row.querySelector(".internal-input") ? row.querySelector(".internal-input").value : "";
        var total    = row.querySelector(".total-score")  ? row.querySelector(".total-score").textContent.trim()  : "";
        var pct      = row.querySelector(".percent-val")  ? row.querySelector(".percent-val").textContent.trim()  : "";
        var grade    = row.querySelector(".grade-badge")  ? row.querySelector(".grade-badge").textContent.trim()  : "";
        var status   = row.querySelector(".status-badge") ? row.querySelector(".status-badge").textContent.trim() : "";
        var remark   = row.querySelector(".remarks-input") ? row.querySelector(".remarks-input").value : "";
        lines.push('"' + roll + '","' + name + '",' + written + ',' + internal + ',' + total + ',' + pct + ',' + grade + ',' + status + ',"' + remark + '"');
      });

      var blob = new Blob([lines.join("\n")], { type: "text/csv" });
      var url  = URL.createObjectURL(blob);
      var a    = document.createElement("a"); a.href = url;
      a.download = "gradebook_" + new Date().toISOString().slice(0,10) + ".csv";
      a.click(); URL.revokeObjectURL(url);
      showToast("📊 Gradebook exported as CSV", "success");
    });
  }

  // ── 11. STUDENT DETAIL MODAL (click a student row) ───────────────────────
  var modal = document.createElement("div");
  modal.style.cssText = "display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9000;align-items:center;justify-content:center;";
  modal.innerHTML = [
    '<div style="background:var(--surface);border-radius:16px;padding:28px 32px;max-width:420px;',
    'width:92%;box-shadow:0 12px 40px rgba(0,0,0,.3);position:relative;">',
    '<button id="closeGradeModal" style="position:absolute;top:14px;right:16px;background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text);">&times;</button>',
    '<div id="gradeModalContent"></div></div>'
  ].join("");
  document.body.appendChild(modal);

  document.getElementById("closeGradeModal").addEventListener("click", function () { modal.style.display = "none"; });
  modal.addEventListener("click", function (e) { if (e.target === modal) modal.style.display = "none"; });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") modal.style.display = "none"; });

  document.querySelectorAll("#gradesTableBody tr").forEach(function (row) {
    row.style.cursor = "pointer";
    row.title = "Click for student detail";

    row.addEventListener("click", function (e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;

      var name     = row.getAttribute("data-name") || "";
      var roll     = row.getAttribute("data-roll") || "";
      var written  = row.querySelector(".written-input")  ? parseFloat(row.querySelector(".written-input").value)  || 0 : 0;
      var internal = row.querySelector(".internal-input") ? parseFloat(row.querySelector(".internal-input").value) || 0 : 0;
      var maxW     = row.querySelector(".written-input")  ? parseFloat(row.querySelector(".written-input").getAttribute("max"))  || 30 : 30;
      var maxI     = row.querySelector(".internal-input") ? parseFloat(row.querySelector(".internal-input").getAttribute("max")) || 20 : 20;
      var total    = written + internal;
      var pct      = (total / (maxW + maxI) * 100).toFixed(1);
      var info     = getGradeInfo(parseFloat(pct));
      var remark   = row.querySelector(".remarks-input") ? row.querySelector(".remarks-input").value : "";

      // Circular score ring using SVG
      var circumference = 2 * Math.PI * 36;   // radius 36
      var dash          = (parseFloat(pct) / 100) * circumference;

      document.getElementById("gradeModalContent").innerHTML = [
        '<h3 style="margin:0 0 2px;">' + name + '</h3>',
        '<p style="color:#888;margin:0 0 20px;font-size:.8rem;">Roll No: ' + roll + '</p>',

        // Score ring
        '<div style="display:flex;align-items:center;gap:24px;margin-bottom:20px;">',
          '<svg width="90" height="90" viewBox="0 0 90 90">',
            '<circle cx="45" cy="45" r="36" fill="none" stroke="#f3f4f6" stroke-width="8"/>',
            '<circle cx="45" cy="45" r="36" fill="none" stroke="#2563eb" stroke-width="8"',
            '  stroke-dasharray="' + dash + ' ' + circumference + '"',
            '  stroke-dashoffset="' + (circumference / 4) + '"',
            '  stroke-linecap="round" transform="rotate(-90 45 45)"/>',
            '<text x="45" y="49" text-anchor="middle" font-size="14" font-weight="800" fill="var(--text)">' + pct + '%</text>',
          '</svg>',
          '<div>',
            '<div style="font-size:2rem;font-weight:900;color:var(--primary-light);">' + info.grade + '</div>',
            '<div style="font-size:.8rem;color:#888;">' + (info.grade === "F" ? "Not Passed" : "Passed") + '</div>',
          '</div>',
        '</div>',

        // Breakdown
        '<table style="width:100%;font-size:.875rem;border-collapse:collapse;">',
          '<tr><td style="padding:7px 0;color:#888;">Written (' + maxW + ')</td>',
          '<td style="text-align:right;font-weight:700;">' + written.toFixed(1) + '</td></tr>',
          '<tr><td style="padding:7px 0;color:#888;border-top:1px solid var(--border);">Internal (' + maxI + ')</td>',
          '<td style="text-align:right;font-weight:700;border-top:1px solid var(--border);">' + internal.toFixed(1) + '</td></tr>',
          '<tr><td style="padding:7px 0;font-weight:700;border-top:1px solid var(--border);">Total (' + (maxW + maxI) + ')</td>',
          '<td style="text-align:right;font-weight:700;border-top:1px solid var(--border);">' + total.toFixed(1) + '</td></tr>',
        '</table>',

        remark ? '<p style="margin-top:14px;font-size:.8rem;color:#888;font-style:italic;">📝 ' + remark + '</p>' : ""
      ].join("");

      modal.style.display = "flex";
    });
  });

  // ── 12. APPLY FILTER BUTTON ───────────────────────────────────────────────
  var applyBtn = document.getElementById("applyResultFilterBtn");
  if (applyBtn) {
    applyBtn.addEventListener("click", function () {
      applyBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Loading…';
      applyBtn.disabled  = true;
      setTimeout(function () {
        applyBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> Apply';
        applyBtn.disabled  = false;
        refreshAllRows();
        showToast("Gradebook refreshed!", "success");
      }, 800);
    });
  }

  // ── 13. KEYBOARD SHORTCUTS ────────────────────────────────────────────────
  document.addEventListener("keydown", function (e) {
    if (["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)) return;
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault(); saveBtn && saveBtn.click();
    }
    if (e.key === "/") {
      e.preventDefault();
      var gf = document.getElementById("gradeTableFilter");
      if (gf) gf.focus();
    }
    if (e.key === "?") {
      showToast("<b>Ctrl+S</b> Save &nbsp; <b>/</b> Search &nbsp; <b>Enter</b> Next cell &nbsp; <b>Click row</b> Student detail", "info");
    }
  });

});
