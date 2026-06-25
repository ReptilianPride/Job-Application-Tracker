const DEFAULT_STATUS = 'awaiting';

let jobs = [];

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

function formatDateOnly(date) {
  const d = new Date(date);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

function formatDateTime(date) {
  const d = new Date(date);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
    ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function getTodayStr() {
  return formatDateOnly(new Date());
}

function getCurrentDateTimeStr() {
  return formatDateTime(new Date());
}

function getDatePart(datetimeStr) {
  return datetimeStr ? datetimeStr.slice(0, 10) : '';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

function migrateJob(job) {
  if (!job.status) {
    if (job.notes === 'R') {
      job.status = 'rejected';
      job.notes = '';
    } else {
      job.status = DEFAULT_STATUS;
    }
  }
  if (job.dateApplied && job.dateApplied.indexOf(' ') === -1) {
    job.dateApplied = job.dateApplied + ' 09:00';
  }
  return job;
}

async function loadJobsData() {
  const data = await window.api.loadJobs();
  jobs = (data.jobs || []).map(migrateJob);
}

async function saveJobsData() {
  await window.api.saveJobs({ jobs });
}

function getFilteredJobs(searchTerm, statusFilter, dateFrom, dateTo) {
  return jobs.filter(job => {
    if (searchTerm && !job.companyName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter && statusFilter !== 'all' && job.status !== statusFilter) {
      return false;
    }
    const jobDate = getDatePart(job.dateApplied);
    if (dateFrom && jobDate < dateFrom) {
      return false;
    }
    if (dateTo && jobDate > dateTo) {
      return false;
    }
    return true;
  });
}

function getSortedJobs(jobsList) {
  return [...jobsList].sort((a, b) => b.dateApplied.localeCompare(a.dateApplied));
}