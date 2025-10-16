import { renderRecords } from './ui.js';

export function performSearch(records, query, caseSensitive) {
  if (!query.trim()) {
    renderRecords(records);
    return;
  }

  try {
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(`(${query})`, flags);

    const filtered = records.filter(r => 
      regex.test(r.description) ||
      regex.test(r.category) ||
      regex.test(r.amount.toString()) ||
      regex.test(r.date)
    );

    const highlighted = filtered.map(r => ({
      ...r,
      description: r.description.replace(regex, '<mark>$1</mark>'),
      category: r.category.replace(regex, '<mark>$1</mark>')
    }));

    renderHighlighted(highlighted);
  } catch (e) {
    console.warn('Invalid search:', e);
    renderRecords([]);
  }
}

function renderHighlighted(data) {
  const container = document.getElementById('records-container');
  if (data.length === 0) {
    container.innerHTML = '<p>No matches found.</p>';
    return;
  }

  let html = `<table><thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Amount</th><th>Category</th><th>Actions</th></tr></thead><tbody>`;
  data.forEach(r => {
    const typeBadge = r.type === 'income' 
      ? '<span class="income-badge">+ Income</span>' 
      : '<span class="expense-badge">- Expense</span>';
    
    html += `
      <tr>
        <td>${r.date}</td>
        <td>${r.description}</td>
        <td>${typeBadge}</td>
        <td>${r.amount.toFixed(2)}</td>
        <td>${r.category}</td>
        <td>
          <button onclick="editRecord('${r.id}')">Edit</button>
          <button onclick="confirmDelete('${r.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}