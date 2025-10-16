import { records, getStats, formatAmount } from './state.js';

export function renderRecords(data) {
  const container = document.getElementById('records-container');
  if (data.length === 0) {
    container.innerHTML = '<p>No records yet.</p>';
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th><button onclick="sortRecords('date')">Date</button></th>
          <th><button onclick="sortRecords('description')">Description</button></th>
          <th>Type</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach(r => {
    const typeBadge = r.type === 'income' 
      ? '<span class="income-badge">+ Income</span>' 
      : '<span class="expense-badge">- Expense</span>';
    
    html += `
      <tr>
        <td data-label="Date">${r.date}</td>
        <td data-label="Description">${escapeHtml(r.description)}</td>
        <td data-label="Type">${typeBadge}</td>
        <td data-label="Amount">${formatAmount(r.amount)}</td>
        <td data-label="Category">${escapeHtml(r.category)}</td>
        <td data-label="Actions">
          <button onclick="editRecord('${r.id}')">Edit</button>
          <button onclick="confirmDelete('${r.id}')">Delete</button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

export function renderStats() {
  const stats = getStats();
  const balanceClass = stats.balance >= 0 ? 'positive' : 'negative';
  
  document.getElementById('stats-live').innerHTML = `
    <p><strong>Total Records:</strong> ${stats.count}</p>
    <p><strong>Total Income:</strong> ${formatAmount(stats.income)}</p>
    <p><strong>Total Expenses:</strong> ${formatAmount(stats.expense)}</p>
    <p><strong>Net Balance:</strong> <span class="${balanceClass}">${formatAmount(stats.balance)}</span></p>
  `;
}

// Global functions for inline onclick
window.sortRecords = (field) => {
  if (field === 'amount') {
    records.sort((a, b) => b.amount - a.amount);
  } else if (field === 'date') {
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    records.sort((a, b) => a[field]?.localeCompare(b[field]) || 0);
  }
  renderRecords(records);
};

window.editRecord = (id) => {
  const record = records.find(r => r.id === id);
  if (!record) return;
  document.getElementById('description').value = record.description;
  document.getElementById('amount').value = record.amount;
  document.getElementById('category').value = record.category;
  document.getElementById('date').value = record.date;
  document.querySelector(`input[name="type"][value="${record.type}"]`).checked = true;
  window.editingId = id;
  document.getElementById('cancel-edit').style.display = 'inline-block';
};

window.confirmDelete = (id) => {
  if (confirm('Delete this record?')) {
    deleteRecord(id);
    saveRecords();
    renderStats();
    renderRecords(records);
  }
};

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '<',
    '>': '>',
    '"': '&quot;',
    "'": '&#039;'
  }[m]));
}

// Add badge styles
const style = document.createElement('style');
style.textContent = `
  .income-badge {
    background: #4caf50;
    color: white;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 0.8em;
  }
  .expense-badge {
    background: #f44336;
    color: white;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 0.8em;
  }
  .positive { color: #4caf50; font-weight: bold; }
  .negative { color: #f44336; font-weight: bold; }
`;
document.head.appendChild(style);

// Save function for delete
function saveRecords() {
  localStorage.setItem('finance-records', JSON.stringify(records));
}
window.saveRecords = saveRecords;