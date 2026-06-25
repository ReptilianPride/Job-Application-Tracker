var dashboardRendered = false;

function renderDashboard() {
  var container = document.getElementById('dashboard-content');
  if (!container) return;
  
  var total = jobs.length;
  var awaiting = jobs.filter(function(j) { return j.status === 'awaiting'; }).length;
  var rejected = jobs.filter(function(j) { return j.status === 'rejected'; }).length;
  var accepted = jobs.filter(function(j) { return j.status === 'accepted'; }).length;

  var last30 = getLast30Days();
  var last30Start = last30[0];
  var last30End = last30[last30.length - 1];
  var applied30 = jobs.filter(function(j) {
    var d = getDatePart(j.dateApplied);
    return d >= last30Start && d <= last30End;
  }).length;
  var rejected30 = jobs.filter(function(j) {
    var d = getDatePart(j.dateApplied);
    return j.status === 'rejected' && d >= last30Start && d <= last30End;
  }).length;

  container.innerHTML = '' +
    '<div class="dashboard-stats">' +
      '<div class="dashboard-stat"><span class="stat-label">Total Applications</span><span class="stat-value" id="dash-total">' + total + '</span></div>' +
      '<div class="dashboard-stat"><span class="stat-label">Applied (30d)</span><span class="stat-value" id="dash-applied30">' + applied30 + '</span></div>' +
      '<div class="dashboard-stat"><span class="stat-label">Rejected (30d)</span><span class="stat-value rejection" id="dash-rejected30">' + rejected30 + '</span></div>' +
      '<div class="dashboard-stat"><span class="stat-label">Awaiting</span><span class="stat-value waiting" id="dash-awaiting">' + awaiting + '</span></div>' +
      '<div class="dashboard-stat"><span class="stat-label">Rejected</span><span class="stat-value rejection" id="dash-rejected">' + rejected + '</span></div>' +
      '<div class="dashboard-stat"><span class="stat-label">Accepted</span><span class="stat-value accepted" id="dash-accepted">' + accepted + '</span></div>' +
    '</div>' +
    '<div class="charts-row">' +
      '<div class="chart-card"><h3>Applications by Day of Week</h3><canvas id="dow-chart" height="250"></canvas></div>' +
      '<div class="chart-card"><h3>Applications Per Day (Last 30 Days)</h3><canvas id="line-chart" height="250"></canvas></div>' +
    '</div>' +
    '<div class="charts-row">' +
      '<div class="chart-card" style="max-width: 500px; margin: 0 auto;"><h3>Status Distribution</h3><canvas id="donut-chart" height="250"></canvas></div>' +
    '</div>';

  drawDayOfWeekChart();
  drawLineChart();
  drawDonutChart();
  dashboardRendered = true;
}

function getLast30Days() {
  var days = [];
  var today = new Date();
  for (var i = 29; i >= 0; i--) {
    var d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(formatDateOnly(d));
  }
  return days;
}

function getDayAbbreviation(dateStr) {
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var d = new Date(dateStr + 'T00:00:00');
  return days[d.getDay()];
}

function getDayIndex(dateStr) {
  var d = new Date(dateStr);
  return d.getDay();
}

function drawDayOfWeekChart() {
  var canvas = document.getElementById('dow-chart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var rect = canvas.parentElement.getBoundingClientRect();
  var width = rect.width - 40;
  if (width < 100) width = 500;
  var dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = 280 * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = '280px';
  ctx.scale(dpr, dpr);

  var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var counts = [0, 0, 0, 0, 0, 0, 0];
  jobs.forEach(function(job) {
    var idx = getDayIndex(job.dateApplied);
    if (idx >= 0 && idx <= 6) counts[idx]++;
  });

  var chartWidth = width;
  var chartHeight = 250;
  var padding = { top: 20, right: 10, bottom: 50, left: 40 };
  var drawWidth = chartWidth - padding.left - padding.right;
  var drawHeight = chartHeight - padding.top - padding.bottom;
  var maxCount = Math.max(1, Math.max.apply(null, counts));
  var barWidth = Math.max(20, (drawWidth / 7) - 8);

  ctx.clearRect(0, 0, chartWidth, chartHeight);

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + drawHeight);
  ctx.lineTo(padding.left + drawWidth, padding.top + drawHeight);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  for (var i = 0; i < 7; i++) {
    var barHeight = (counts[i] / maxCount) * drawHeight;
    var x = padding.left + (i * (drawWidth / 7)) + ((drawWidth / 7) - barWidth) / 2;
    var y = padding.top + drawHeight - barHeight;
    if (barHeight > 0) {
      ctx.fillRect(x, y, barWidth, barHeight);
    }
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dayNames[i], padding.left + (i * (drawWidth / 7)) + (drawWidth / 7) / 2, chartHeight - 5);
    ctx.fillStyle = '#38bdf8';
  }

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px "Segoe UI", sans-serif';
  ctx.textAlign = 'right';
  var yLabelStep = Math.max(1, Math.ceil(maxCount / 4));
  for (var i = 0; i <= maxCount; i += yLabelStep) {
    var y = padding.top + drawHeight - (i / maxCount) * drawHeight;
    ctx.fillText(i.toString(), padding.left - 5, y + 3);
  }
}

function drawLineChart() {
  var canvas = document.getElementById('line-chart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var rect = canvas.parentElement.getBoundingClientRect();
  var width = rect.width - 40;
  if (width < 100) width = 500;
  var dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = 280 * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = '280px';
  ctx.scale(dpr, dpr);

  var days = getLast30Days();
  var counts = days.map(function(day) {
    return jobs.filter(function(j) { return getDatePart(j.dateApplied) === day; }).length;
  });

  var chartWidth = width;
  var chartHeight = 250;
  var padding = { top: 20, right: 10, bottom: 50, left: 40 };
  var drawWidth = chartWidth - padding.left - padding.right;
  var drawHeight = chartHeight - padding.top - padding.bottom;
  var maxCount = Math.max(1, Math.max.apply(null, counts));

  ctx.clearRect(0, 0, chartWidth, chartHeight);

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + drawHeight);
  ctx.lineTo(padding.left + drawWidth, padding.top + drawHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  var first = true;
  for (var i = 0; i < days.length; i++) {
    var x = padding.left + (i / (days.length - 1)) * drawWidth;
    var y = padding.top + drawHeight - (counts[i] / maxCount) * drawHeight;
    if (first) {
      ctx.moveTo(x, y);
      first = false;
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  for (var i = 0; i < days.length; i++) {
    var x = padding.left + (i / (days.length - 1)) * drawWidth;
    var y = padding.top + drawHeight - (counts[i] / maxCount) * drawHeight;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  var labelStep = Math.max(1, Math.floor(days.length / 10));
  for (var i = 0; i < days.length; i += labelStep) {
    var x = padding.left + (i / (days.length - 1)) * drawWidth;
    var label = getDayAbbreviation(days[i]) + ' ' + new Date(days[i] + 'T00:00:00').getDate();
    ctx.fillText(label, x, chartHeight - 5);
  }

  ctx.textAlign = 'right';
  ctx.font = '10px "Segoe UI", sans-serif';
  var yLabelStep = Math.max(1, Math.ceil(maxCount / 4));
  for (var i = 0; i <= maxCount; i += yLabelStep) {
    var y = padding.top + drawHeight - (i / maxCount) * drawHeight;
    ctx.fillText(i.toString(), padding.left - 5, y + 3);
  }
}

function drawDonutChart() {
  var canvas = document.getElementById('donut-chart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var rect = canvas.parentElement.getBoundingClientRect();
  var width = rect.width - 40;
  if (width < 100) width = 400;
  var dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = 280 * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = '280px';
  ctx.scale(dpr, dpr);

  var awaiting = jobs.filter(function(j) { return j.status === 'awaiting'; }).length;
  var rejected = jobs.filter(function(j) { return j.status === 'rejected'; }).length;
  var accepted = jobs.filter(function(j) { return j.status === 'accepted'; }).length;
  var total = awaiting + rejected + accepted;
  if (total === 0) total = 1;

  var data = [
    { label: 'Awaiting', value: awaiting, color: '#fef08a' },
    { label: 'Rejected', value: rejected, color: '#fca5a5' },
    { label: 'Accepted', value: accepted, color: '#4ade80' }
  ];

  var cx = width / 2;
  var cy = 140;
  var outerRadius = 100;
  var innerRadius = 60;

  ctx.clearRect(0, 0, width, 280);

  var startAngle = -Math.PI / 2;
  for (var i = 0; i < data.length; i++) {
    var sliceAngle = (data[i].value / total) * 2 * Math.PI;
    if (data[i].value === 0) continue;
    
    ctx.beginPath();
    ctx.moveTo(cx + innerRadius * Math.cos(startAngle), cy + innerRadius * Math.sin(startAngle));
    ctx.arc(cx, cy, outerRadius, startAngle, startAngle + sliceAngle);
    ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = data[i].color;
    ctx.fill();

    startAngle += sliceAngle;
  }

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(cx, cy, innerRadius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 16px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(total.toString(), cx, cy + 5);

  var legendY = 15;
  ctx.font = '12px "Segoe UI", sans-serif';
  ctx.textAlign = 'left';
  for (var i = 0; i < data.length; i++) {
    ctx.fillStyle = data[i].color;
    ctx.fillRect(width - 160, legendY + 3, 10, 10);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(data[i].label + ': ' + data[i].value, width - 145, legendY + 13);
    legendY += 22;
  }
}