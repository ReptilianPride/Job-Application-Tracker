function updateOverview() {
  const totalCount = jobs.length;
  const rejectionCount = jobs.filter(job => job.status === 'rejected').length;
  const acceptedCount = jobs.filter(job => job.status === 'accepted').length;
  const waitingCount = jobs.filter(job => job.status === 'awaiting').length;
  const todayCount = jobs.filter(job => getDatePart(job.dateApplied) === getTodayStr()).length;

  document.getElementById('total-count').textContent = totalCount;
  document.getElementById('rejection-count').textContent = rejectionCount;
  document.getElementById('waiting-count').textContent = waitingCount;
  document.getElementById('today-count').textContent = todayCount;
  document.getElementById('accepted-count').textContent = acceptedCount;

  const overviewContainer = document.querySelector('.overview-table-container');
  const prevScroll = overviewContainer ? overviewContainer.scrollTop : 0;

  const overviewTbody = document.getElementById('overview-tbody');
  const waitingJobs = getSortedJobs(jobs.filter(job => job.status !== 'rejected'));
  overviewTbody.innerHTML = waitingJobs.map(job => '<tr>' +
    '<td>' + escapeHtml(job.companyName) + '</td>' +
    '<td>' + escapeHtml(job.jobTitle) + '</td>' +
    '<td>' + escapeHtml(getDatePart(job.dateApplied)) + '</td>' +
  '</tr>').join('');

  if (overviewContainer) {
    overviewContainer.scrollTop = prevScroll;
  }
}