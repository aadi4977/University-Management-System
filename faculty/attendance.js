// =============================================
// GLA UMS – Attendance Page JavaScript (Enhanced)
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

  // ── SHARED: get all rows (visible only when withFilter=true) ─────────────
  function getAllRows(visibleOnly) {
    var rows = document.querySelectorAll("#attendanceTableBody tr");
    if (!visibleOnly) return Array.from(rows);
    return Array.from(rows).filter(function (r) { return r.style.display !== "none"; });
  }

  // ── 1. LIVE COUNTER UPDATE ────────────────────────────────────────────────
  function updateCounts() {
    var rows    = getAllRows(true);
    var total   = rows.length;
    var present = 0, absent = 0, late = 0;

    rows.forEach(function (row) {
      var checked = row.querySelector("input[type='radio']:checked");
      if (!checked) return;
      if (checked.value === "P") present++;
      else if (checked.value === "A") absent++;
      else if (checked.value === "L" || checked.value === "M") late++;
    });

    document.getElementById("totalCount").textContent   = total;
    document.getElementById("presentCount").textContent = present;
    document.getElementById("absentCount").textContent  = absent;
    document.getElementById("lateCount").textContent    = late;

    var rate = total > 0 ? ((present + late) / total * 100).toFixed(1) : "0.0";
    document.getElementById("ratePercent").textContent = rate + "%";

    // Colour the rate pill based on value
    var rateEl = document.getElementById("ratePercent");
    if (rateEl) {
      var rateNum = parseFloat(rate);
      rateEl.style.color = rateNum >= 75 ? "#16a34a" : rateNum >= 65 ? "#f59e0b" : "#dc2626";
    }

    // Update page title with live count
    document.title = "Attendance (" + present + "/" + total + " Present) – GLA UMS";
  }

  updateCounts();

  // Listen on all radios
  document.querySelectorAll("#attendanceTableBody input[type='radio']").forEach(function (r) {
    r.addEventListener("change", function () {
      updateCounts();
      highlightChangedRow(r.closest("tr"));
    });
  });

  // Flash row green briefly when a radio changes
  function highlightChangedRow(row) {
    if (!row) return;
    row.style.transition  = "background .2s";
    row.style.background  = "rgba(22,163,74,.08)";
    setTimeout(function () { row.style.background = ""; }, 600);
  }

  // ── 2. MARK ALL PRESENT ───────────────────────────────────────────────────
  document.getElementById("markAllPresentBtn") &&
  document.getElementById("markAllPresentBtn").addEventListener("click", function () {
    getAllRows(true).forEach(function (row) {
      var r = row.querySelector("input[value='P']");
      if (r) r.checked = true;
    });
    updateCounts();
    showToast("✓ All visible students marked <b>Present</b>", "success");
  });

  // ── 3. MARK ALL ABSENT ────────────────────────────────────────────────────
  document.getElementById("markAllAbsentBtn") &&
  document.getElementById("markAllAbsentBtn").addEventListener("click", function () {
    getAllRows(true).forEach(function (row) {
      var r = row.querySelector("input[value='A']");
      if (r) r.checked = true;
    });
    updateCounts();
    showToast("All visible students marked <b>Absent</b>", "warning");
  });

  // ── 4. UNDO last bulk action ──────────────────────────────────────────────
  // Store the state before a bulk action so we can undo it
  var undoSnapshot = null;

  function captureSnapshot() {
    var snapshot = [];
    getAllRows(false).forEach(function (row) {
      var checked = row.querySelector("input[type='radio']:checked");
      snapshot.push({ row: row, value: checked ? checked.value : null });
    });
    return snapshot;
  }

  // Wrap bulk buttons with snapshot
  var presentBtn = document.getElementById("markAllPresentBtn");
  var absentBtn  = document.getElementById("markAllAbsentBtn");
  if (presentBtn) {
    presentBtn.addEventListener("click", function () { undoSnapshot = captureSnapshot(); }, true);
  }
  if (absentBtn) {
    absentBtn.addEventListener("click", function () { undoSnapshot = captureSnapshot(); }, true);
  }

  // Add an Undo button next to the existing toolbar buttons
  var toolbarRow = document.querySelector(".table-controls-row") ||
                   document.querySelector(".table-controls")     ||
                   (presentBtn && presentBtn.parentElement);

  if (toolbarRow && presentBtn) {
    var undoBtn = document.createElement("button");
    undoBtn.className = "btn btn-outline btn-sm";
    undoBtn.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i> Undo';
    undoBtn.style.marginLeft = "6px";
    undoBtn.title = "Undo last bulk mark";
    presentBtn.parentElement.appendChild(undoBtn);

    undoBtn.addEventListener("click", function () {
      if (!undoSnapshot) { showToast("Nothing to undo", "info"); return; }
      undoSnapshot.forEach(function (item) {
        if (item.value) {
          var r = item.row.querySelector("input[value='" + item.value + "']");
          if (r) r.checked = true;
        }
      });
      undoSnapshot = null;
      updateCounts();
      showToast("↩ Undo applied", "info");
    });
  }

  // ── 5. DEFAULTERS FILTER (toggle) ─────────────────────────────────────────
  var filterDefaultersBtn  = document.getElementById("filterDefaultersBtn");
  var showingDefaulters    = false;

  if (filterDefaultersBtn) {
    filterDefaultersBtn.addEventListener("click", function () {
      showingDefaulters = !showingDefaulters;

      getAllRows(false).forEach(function (row) {
        var cumVal = parseFloat(row.getAttribute("data-cum") || "100");
        row.style.display = showingDefaulters ? (cumVal < 75 ? "" : "none") : "";
      });

      filterDefaultersBtn.innerHTML = showingDefaulters
        ? '<i class="bi bi-x-circle"></i> Show All'
        : '<i class="bi bi-exclamation-triangle text-warning"></i> &lt; 75% Only';

      var count = getAllRows(true).length;
      if (showingDefaulters) {
        showToast("Showing <b>" + count + "</b> student(s) below 75% attendance", "warning");
      }
      updateCounts();
    });
  }

  // ── 6. TABLE SORT by clicking column headers ──────────────────────────────
  var thead = document.querySelector("#attendanceTable thead tr");
  if (thead) {
    var sortAsc = {};   // tracks sort direction per column index

    thead.querySelectorAll("th").forEach(function (th, colIndex) {
      th.style.cursor = "pointer";
      th.title = "Click to sort";

      th.addEventListener("click", function () {
        sortAsc[colIndex] = !sortAsc[colIndex];

        // Update arrow indicators
        thead.querySelectorAll("th").forEach(function (t) {
          t.textContent = t.textContent.replace(/ ▲| ▼/g, "");
        });
        th.textContent += sortAsc[colIndex] ? " ▲" : " ▼";

        var tbody = document.getElementById("attendanceTableBody");
        var rows  = Array.from(tbody.querySelectorAll("tr"));

        rows.sort(function (a, b) {
          var aCell = a.querySelectorAll("td")[colIndex];
          var bCell = b.querySelectorAll("td")[colIndex];
          if (!aCell || !bCell) return 0;

          var aText = aCell.textContent.trim();
          var bText = bCell.textContent.trim();
          var aNum  = parseFloat(aText);
          var bNum  = parseFloat(bText);

          var cmp = (!isNaN(aNum) && !isNaN(bNum))
            ? aNum - bNum
            : aText.localeCompare(bText);

          return sortAsc[colIndex] ? cmp : -cmp;
        });

        rows.forEach(function (row) { tbody.appendChild(row); });
      });
    });
  }

  // ── 7. LIVE SEARCH (table filter + topbar search) ─────────────────────────
  var currentSearch = "";

  function applySearch(query) {
    currentSearch = query.toLowerCase().trim();
    getAllRows(false).forEach(function (row) {
      var text = (row.getAttribute("data-name") || "") + " " +
                 (row.getAttribute("data-roll") || "") + " " +
                 row.textContent;
      var matches = currentSearch === "" || text.toLowerCase().includes(currentSearch);
      // Respect defaulters filter too
      var cumVal  = parseFloat(row.getAttribute("data-cum") || "100");
      var passesDefaulterFilter = !showingDefaulters || cumVal < 75;
      row.style.display = (matches && passesDefaulterFilter) ? "" : "none";
    });
    updateCounts();
  }

  var tableFilter = document.getElementById("tableFilterInput");
  if (tableFilter) {
    tableFilter.addEventListener("input", function () { applySearch(tableFilter.value); });
  }
  var topSearch = document.getElementById("topSearch");
  if (topSearch) {
    topSearch.addEventListener("input", function () { applySearch(topSearch.value); });
  }

  // ── 8. AUTO-REMARK on Absent / Medical ────────────────────────────────────
  document.querySelectorAll("#attendanceTableBody input[type='radio']").forEach(function (radio) {
    radio.addEventListener("change", function () {
      var row     = radio.closest("tr");
      var remarkInput = row ? row.querySelector(".remarks-input") : null;
      if (!remarkInput || remarkInput.value.trim() !== "") return;   // don't overwrite manual remarks

      if (radio.value === "A") remarkInput.value = "Uninformed Absence";
      if (radio.value === "M") remarkInput.value = "Medical Leave";
      if (radio.value === "L") remarkInput.value = "Arrived Late";
    });
  });

  // ── 9. SAVE with unsaved-changes warning ─────────────────────────────────
  var hasUnsaved = false;
  document.querySelectorAll("#attendanceTableBody input").forEach(function (inp) {
    inp.addEventListener("change", function () { hasUnsaved = true; });
    inp.addEventListener("input",  function () { hasUnsaved = true; });
  });

  window.addEventListener("beforeunload", function (e) {
    if (hasUnsaved) { e.preventDefault(); e.returnValue = ""; }
  });

  var saveTopBtn = document.getElementById("saveTopBtn");
  if (saveTopBtn) {
    saveTopBtn.addEventListener("click", function () {
      saveTopBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Saving…';
      saveTopBtn.disabled  = true;
      if (!document.getElementById("spin-style")) {
        var s = document.createElement("style");
        s.id  = "spin-style";
        s.textContent = "@keyframes spin{to{transform:rotate(360deg)}} .spin{display:inline-block;animation:spin .8s linear infinite;}";
        document.head.appendChild(s);
      }

      setTimeout(function () {
        hasUnsaved = false;
        saveTopBtn.innerHTML = '<i class="bi bi-check2-all"></i> Save Attendance';
        saveTopBtn.disabled  = false;

        var total   = getAllRows(true).length;
        var present = parseInt(document.getElementById("presentCount").textContent);
        showToast("✓ Attendance saved — " + present + "/" + total + " Present", "success");
      }, 1200);
    });
  }

  // ── 10. EXPORT CSV ────────────────────────────────────────────────────────
  var exportCsvBtn = document.getElementById("exportCsvBtn");
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", function () {
      var rows = getAllRows(false);
      var lines = ["Roll No,Student Name,Cumulative Attendance,Today Status,Remarks"];

      rows.forEach(function (row) {
        var name    = row.getAttribute("data-name") || "";
        var roll    = row.getAttribute("data-roll") || "";
        var cum     = row.getAttribute("data-cum")  || "";
        var checked = row.querySelector("input[type='radio']:checked");
        var status  = checked ? checked.value : "?";
        var remark  = row.querySelector(".remarks-input") ? row.querySelector(".remarks-input").value : "";
        lines.push('"' + roll + '","' + name + '",' + cum + '%,"' + status + '","' + remark + '"');
      });

      var dateVal = document.getElementById("dateSelect") ? document.getElementById("dateSelect").value : "today";
      var blob    = new Blob([lines.join("\n")], { type: "text/csv" });
      var url     = URL.createObjectURL(blob);
      var link    = document.createElement("a");
      link.href   = url;
      link.download = "attendance_" + dateVal + ".csv";
      link.click();
      URL.revokeObjectURL(url);
      showToast('<i class="bi bi-file-earmark-spreadsheet"></i> CSV downloaded', "success");
    });
  }

  // ── 11. PRINT button ──────────────────────────────────────────────────────
  var printBtn = document.querySelector(".btn.btn-outline:first-of-type");
  if (printBtn && printBtn.textContent.trim().includes("Print")) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }

  // ── 12. LOAD FILTER BUTTON ────────────────────────────────────────────────
  var loadFilterBtn = document.getElementById("loadFilterBtn");
  if (loadFilterBtn) {
    loadFilterBtn.addEventListener("click", function () {
      loadFilterBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Loading…';
      loadFilterBtn.disabled  = true;
      setTimeout(function () {
        loadFilterBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> Load / Filter';
        loadFilterBtn.disabled  = false;
        showToast("Roster refreshed!", "success");
      }, 800);
    });
  }

  // ── 13. KEYBOARD SHORTCUTS ────────────────────────────────────────────────
  document.addEventListener("keydown", function (e) {
    if (["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)) return;
    if (e.key === "p" || e.key === "P") {
      document.getElementById("markAllPresentBtn") && document.getElementById("markAllPresentBtn").click();
    }
    if (e.key === "a" || e.key === "A") {
      document.getElementById("markAllAbsentBtn") && document.getElementById("markAllAbsentBtn").click();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      saveTopBtn && saveTopBtn.click();
    }
    if (e.key === "/") {
      e.preventDefault();
      var tf = document.getElementById("tableFilterInput");
      if (tf) tf.focus();
    }
    if (e.key === "?") {
      showToast("<b>P</b> All Present &nbsp; <b>A</b> All Absent &nbsp; <b>Ctrl+S</b> Save &nbsp; <b>/</b> Search", "info");
    }
  });

});
