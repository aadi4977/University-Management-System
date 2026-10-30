/* ==========================================================
   GLA UMS -- Admin Dashboard (admin/dashboard/index.js)
   Plain JS, no libraries, no backend.

   1. Notification bell: close on outside click / Escape.
   2. Donut charts: the conic-gradient and centre total are
      BUILT from the legend numbers, so the legend is the only
      place you ever edit data.
   3. Stat cards (Total Students / Total Faculty) are synced
      from the chart totals so they can never disagree.
   ========================================================== */

(function () {
  'use strict';

  /* ---------- 1. Notification dropdown ---------- */

  var toggle = document.getElementById('notif-toggle');
  var wrap = document.querySelector('.notif-wrap');

  if (toggle && wrap) {
    document.addEventListener('click', function (e) {
      if (toggle.checked && !wrap.contains(e.target)) toggle.checked = false;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') toggle.checked = false;
    });
  }

  /* ---------- 2. Donut charts from legend data ---------- */

  // chart card heading  ->  stat card label to keep in sync
  var STAT_FOR_CHART = {
    'Student Distribution': 'Total Students',
    'Faculty Distribution': 'Total Faculty'
  };

  function fmt(n) {
    return n.toLocaleString('en-IN');
  }

  function setStat(label, value) {
    var labels = document.querySelectorAll('.stat-card .stat-label');
    for (var i = 0; i < labels.length; i++) {
      if (labels[i].textContent.trim() === label) {
        var val = labels[i].parentElement.querySelector('.stat-value');
        if (val) val.textContent = fmt(value);
      }
    }
  }

  document.querySelectorAll('.chart-card').forEach(function (card) {
    var items = Array.prototype.slice.call(card.querySelectorAll('.chart-legend li'));
    var donut = card.querySelector('.donut');
    if (!items.length || !donut) return;

    var values = items.map(function (li) {
      var el = li.querySelector('.legend-value');
      return Number(el ? el.textContent.replace(/[^\d.]/g, '') : 0) || 0;
    });
    var colors = items.map(function (li) {
      var sw = li.querySelector('.swatch');
      return sw ? getComputedStyle(sw).backgroundColor : '#cccccc';
    });

    var total = values.reduce(function (a, b) { return a + b; }, 0);
    if (total === 0) return;

    // build "color start% end%, ..." stops
    var acc = 0;
    var stops = values.map(function (v, i) {
      var start = (acc / total) * 100;
      acc += v;
      var end = (acc / total) * 100;
      return colors[i] + ' ' + start.toFixed(2) + '% ' + end.toFixed(2) + '%';
    });
    donut.style.background = 'conic-gradient(' + stops.join(', ') + ')';

    // centre number
    var centre = card.querySelector('.donut-hole .value');
    if (centre) centre.textContent = fmt(total);

    // tooltip with % share on each legend row
    items.forEach(function (li, i) {
      li.title = ((values[i] / total) * 100).toFixed(1) + '% of total';
    });

    // keep matching stat card in sync
    var heading = card.querySelector('h3');
    var statLabel = heading && STAT_FOR_CHART[heading.textContent.trim()];
    if (statLabel) setStat(statLabel, total);
  });
})();
