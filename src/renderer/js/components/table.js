let editingCell = null;

function renderJobs(searchTerm, statusFilter, dateFrom, dateTo) {
  const tbody = document.getElementById('jobs-tbody');
  const emptyState = document.getElementById('empty-state');
  const tableFooter = document.getElementById('table-footer');
  
  const filtered = getFilteredJobs(searchTerm, statusFilter, dateFrom, dateTo);
  const sorted = getSortedJobs(filtered);

  if (sorted.length === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = 'block';
    tableFooter.style.display = 'none';
    if (searchTerm || statusFilter || dateFrom || dateTo) {
      emptyState.textContent = 'No matching jobs found.';
    } else {
      emptyState.textContent = 'No jobs found. Add your first job in the Insert tab.';
    }
    return;
  }

  emptyState.style.display = 'none';
  tableFooter.style.display = 'flex';
  tableFooter.textContent = 'Showing ' + sorted.length + ' of ' + jobs.length + ' entries';

  tbody.innerHTML = sorted.map(job => {
    const statusLabels = { awaiting: 'Awaiting', rejected: 'Rejected', accepted: 'Accepted' };
    return '<tr data-id="' + job.id + '" class="job-row">' +
      '<td class="editable col-company" data-field="companyName">' + escapeHtml(job.companyName) + '</td>' +
      '<td class="editable col-title" data-field="jobTitle">' + escapeHtml(job.jobTitle) + '</td>' +
      '<td class="date-cell col-date">' + escapeHtml(job.dateApplied) + '</td>' +
      '<td class="col-status status-cell" data-field="status" data-job-id="' + job.id + '">' +
        renderStatusDropdown(job) +
      '</td>' +
      '<td class="editable col-notes" data-field="notes">' + escapeHtml(job.notes || '') + '</td>' +
      '<td class="col-actions">' +
        '<div class="actions">' +
          '<button class="btn-icon btn-view" onclick="viewJD(\'' + job.id + '\')">View JD</button>' +
          '<button class="btn-icon btn-delete" onclick="deleteJob(\'' + job.id + '\')">Delete</button>' +
        '</div>' +
      '</td>' +
    '</tr>';
  }).join('');

  document.querySelectorAll('.table td.editable').forEach(cell => {
    cell.addEventListener('dblclick', handleCellDoubleClick);
  });

  document.querySelectorAll('.status-cell select').forEach(select => {
    select.addEventListener('change', handleStatusChange);
  });
}

function renderStatusDropdown(job) {
  var options = '';
  var statuses = [
    { value: 'awaiting', label: 'Awaiting' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'accepted', label: 'Accepted' }
  ];
  for (var i = 0; i < statuses.length; i++) {
    var s = statuses[i];
    var selected = s.value === job.status ? ' selected' : '';
    options += '<option value="' + s.value + '"' + selected + '>' + s.label + '</option>';
  }
  return '<select class="cell-select" data-job-id="' + job.id + '">' + options + '</select>';
}

async function handleStatusChange(e) {
  var select = e.target;
  var jobId = select.dataset.jobId;
  var newStatus = select.value;
  var job = jobs.find(function(j) { return j.id === jobId; });
  if (job) {
    job.status = newStatus;
    await saveJobsData();
    updateOverview();
    renderDashboard();
    var searchTerm = document.getElementById('search-input').value;
    var statusFilter = document.getElementById('status-filter').value;
    var dateFrom = document.getElementById('date-from').value;
    var dateTo = document.getElementById('date-to').value;
    renderJobs(searchTerm, statusFilter, dateFrom, dateTo);
  }
}

function handleCellDoubleClick(e) {
  if (editingCell) {
    finishEditing(true);
  }

  var cell = e.target;
  var row = cell.closest('tr');
  var jobId = row.dataset.id;
  var field = cell.dataset.field;
  var job = jobs.find(function(j) { return j.id === jobId; });

  if (!job || !field) return;

  var originalValue = job[field] || '';
  cell.innerHTML = '<input type="text" class="cell-input" value="' + escapeHtml(originalValue) + '" data-field="' + field + '" data-job-id="' + jobId + '">';
  var input = cell.querySelector('input');
  input.focus();
  input.select();

  editingCell = { cell: cell, jobId: jobId, field: field };

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      finishEditing(false);
    } else if (e.key === 'Escape') {
      finishEditing(true);
    }
  });

  input.addEventListener('blur', function() {
    finishEditing(false);
  });
}

async function finishEditing(cancel) {
  if (!editingCell) return;

  var cell = editingCell.cell;
  var jobId = editingCell.jobId;
  var field = editingCell.field;
  var input = cell.querySelector('input');

  if (!cancel && input) {
    var newValue = input.value.trim();
    var job = jobs.find(function(j) { return j.id === jobId; });
    if (job) {
      job[field] = newValue;
      await saveJobsData();
    }
  }

  editingCell = null;
  var searchTerm = document.getElementById('search-input').value;
  var statusFilter = document.getElementById('status-filter').value;
  var dateFrom = document.getElementById('date-from').value;
  var dateTo = document.getElementById('date-to').value;
  renderJobs(searchTerm, statusFilter, dateFrom, dateTo);
}

async function deleteJob(jobId) {
  if (!confirm('Are you sure you want to delete this job?')) return;
  jobs = jobs.filter(function(j) { return j.id !== jobId; });
  await saveJobsData();
  applyFilters();
  updateOverview();
  renderDashboard();
}