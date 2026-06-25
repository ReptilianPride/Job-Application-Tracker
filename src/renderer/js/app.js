function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(function(tab) { tab.classList.remove('active'); });
  document.querySelectorAll('.tab-content').forEach(function(content) { content.classList.remove('active'); });

  document.querySelector('.tab[data-tab="' + tabName + '"]').classList.add('active');
  document.getElementById('tab-' + tabName).classList.add('active');

  if (tabName === 'insert') {
    refreshData();
  } else if (tabName === 'list') {
    refreshData();
  } else if (tabName === 'dashboard') {
    refreshData();
  }
}

async function refreshData() {
  await loadJobsData();
  updateOverview();
  var searchTerm = document.getElementById('search-input') ? document.getElementById('search-input').value : '';
  var statusFilter = document.getElementById('status-filter') ? document.getElementById('status-filter').value : 'all';
  var dateFrom = document.getElementById('date-from') ? document.getElementById('date-from').value : '';
  var dateTo = document.getElementById('date-to') ? document.getElementById('date-to').value : '';
  renderJobs(searchTerm, statusFilter, dateFrom, dateTo);
  renderDashboard();
}

function setCurrentDate() {
  document.getElementById('dateApplied').value = getCurrentDateTimeStr();
}

async function handleFormSubmit(e) {
  e.preventDefault();

  var companyName = document.getElementById('companyName').value.trim();
  var jobTitle = document.getElementById('jobTitle').value.trim();

  if (!companyName || !jobTitle) {
    if (!companyName) {
      document.getElementById('companyName').parentElement.classList.add('error');
    }
    if (!jobTitle) {
      document.getElementById('jobTitle').parentElement.classList.add('error');
    }
    return;
  }

  var job = {
    id: generateId(),
    companyName: companyName,
    jobTitle: jobTitle,
    jobDescription: document.getElementById('jobDescription').value.trim(),
    notes: document.getElementById('notes').value.trim(),
    dateApplied: document.getElementById('dateApplied').value,
    status: document.getElementById('jobStatus').value
  };

  jobs.push(job);
  await saveJobsData();
  document.getElementById('job-form').reset();
  setCurrentDate();
  document.getElementById('jobStatus').value = DEFAULT_STATUS;
  updateOverview();
  renderDashboard();
  renderJobs();
}

function clearForm() {
  document.getElementById('job-form').reset();
  setCurrentDate();
  document.getElementById('jobStatus').value = DEFAULT_STATUS;
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      switchTab(tab.dataset.tab);
    });
  });

  document.getElementById('job-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('clear-btn').addEventListener('click', clearForm);

  document.getElementById('companyName').addEventListener('input', function() {
    this.parentElement.classList.remove('error');
  });

  document.getElementById('jobTitle').addEventListener('input', function() {
    this.parentElement.classList.remove('error');
  });

  setCurrentDate();
  renderFilters();
  loadJobsData().then(function() {
    updateOverview();
    renderJobs('', 'all', '', '');
    renderDashboard();
  });
});