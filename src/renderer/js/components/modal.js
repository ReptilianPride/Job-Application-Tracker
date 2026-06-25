function viewJD(jobId) {
  const job = jobs.find(j => j.id === jobId);
  if (!job) return;
  document.getElementById('modal-header').textContent = job.companyName + ' - ' + job.jobTitle;
  document.getElementById('modal-body').textContent = job.jobDescription || 'No job description available.';
  document.getElementById('modal-overlay').classList.add('show');
}

function closeModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('modal-overlay').classList.remove('show');
}