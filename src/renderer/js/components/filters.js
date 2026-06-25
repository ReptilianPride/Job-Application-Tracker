function renderFilters() {
  const searchContainer = document.querySelector('.search-container');
  searchContainer.innerHTML = '';
  
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'search-input';
  searchInput.id = 'search-input';
  searchInput.placeholder = 'Search by company name...';
  searchContainer.appendChild(searchInput);
  
  const statusSelect = document.createElement('select');
  statusSelect.className = 'filter-select';
  statusSelect.id = 'status-filter';
  const statuses = [
    { value: 'all', label: 'All' },
    { value: 'awaiting', label: 'Awaiting' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'accepted', label: 'Accepted' }
  ];
  statuses.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.value;
    opt.textContent = s.label;
    statusSelect.appendChild(opt);
  });
  searchContainer.appendChild(statusSelect);
  
  const fromLabel = document.createElement('span');
  fromLabel.className = 'filter-label';
  fromLabel.textContent = 'From:';
  searchContainer.appendChild(fromLabel);
  
  const dateFrom = document.createElement('input');
  dateFrom.type = 'date';
  dateFrom.className = 'filter-date';
  dateFrom.id = 'date-from';
  searchContainer.appendChild(dateFrom);
  
  const toLabel = document.createElement('span');
  toLabel.className = 'filter-label';
  toLabel.textContent = 'To:';
  searchContainer.appendChild(toLabel);
  
  const dateTo = document.createElement('input');
  dateTo.type = 'date';
  dateTo.className = 'filter-date';
  dateTo.id = 'date-to';
  searchContainer.appendChild(dateTo);
  
  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'btn-reset';
  resetBtn.textContent = 'Reset Filters';
  searchContainer.appendChild(resetBtn);

  searchInput.addEventListener('input', applyFilters);
  statusSelect.addEventListener('change', applyFilters);
  dateFrom.addEventListener('change', applyFilters);
  dateTo.addEventListener('change', applyFilters);
  resetBtn.addEventListener('click', resetFilters);
}

function resetFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('status-filter').value = 'all';
  document.getElementById('date-from').value = '';
  document.getElementById('date-to').value = '';
  renderJobs('', 'all', '', '');
}

function applyFilters() {
  const searchTerm = document.getElementById('search-input').value;
  const statusFilter = document.getElementById('status-filter').value;
  const dateFrom = document.getElementById('date-from').value;
  const dateTo = document.getElementById('date-to').value;
  renderJobs(searchTerm, statusFilter, dateFrom, dateTo);
}