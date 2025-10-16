import { loadRecords, saveRecords } from './storage.js';
import { records, addRecord, updateRecord, deleteRecord, getStats, formatAmount } from './state.js';
import { renderRecords, renderStats } from './ui.js';
import { validateForm } from './validators.js';
import { performSearch } from './search.js';

let editingId = null;

const form = document.getElementById('record-form');
const searchInput = document.getElementById('search-input');
const caseSensitive = document.getElementById('case-sensitive');
const cancelEditBtn = document.getElementById('cancel-edit');

document.addEventListener('DOMContentLoaded', () => {
  loadRecords();
  renderStats();
  renderRecords(records);
  setupEventListeners();
  loadSettings();
});

function setupEventListeners() {
  form.addEventListener('submit', handleFormSubmit);
  cancelEditBtn.addEventListener('click', cancelEdit);
  searchInput.addEventListener('input', () => performSearch(records, searchInput.value, caseSensitive.checked));
  caseSensitive.addEventListener('change', () => performSearch(records, searchInput.value, caseSensitive.checked));

  // Currency settings
  document.getElementById('base-currency').addEventListener('change', saveSettings);
  document.getElementById('rate-eur').addEventListener('change', saveSettings);
  document.getElementById('rate-gbp').addEventListener('change', saveSettings);

  // Tab navigation
  document.querySelectorAll('.nav-tab').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active-section'));
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active-section');
    });
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  const desc = document.getElementById('description').value.trim();
  const amount = document.getElementById('amount').value.trim();
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value.trim();
  const type = document.querySelector('input[name="type"]:checked').value;

  const errors = validateForm({ desc, amount, category, date });
  displayErrors(errors);

  if (Object.values(errors).every(err => !err)) {
    const record = {
      id: editingId || `rec_${Date.now()}`,
      description: desc,
      amount: parseFloat(amount),
      type,
      category,
      date,
      createdAt: editingId ? records.find(r => r.id === editingId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      updateRecord(editingId, record);
    } else {
      addRecord(record);
    }

    saveRecords();
    renderStats();
    renderRecords(records);
    form.reset();
    editingId = null;
    cancelEditBtn.style.display = 'none';
  }
}

function displayErrors(errors) {
  document.getElementById('desc-error').textContent = errors.desc || '';
  document.getElementById('amount-error').textContent = errors.amount || '';
  document.getElementById('cat-error').textContent = errors.cat || '';
  document.getElementById('date-error').textContent = errors.date || '';
}

function cancelEdit() {
  editingId = null;
  form.reset();
  cancelEditBtn.style.display = 'none';
}

function saveSettings() {
  const settings = {
    baseCurrency: document.getElementById('base-currency').value,
    eurRate: document.getElementById('rate-eur').value,
    gbpRate: document.getElementById('rate-gbp').value
  };
  localStorage.setItem('finance-settings', JSON.stringify(settings));
  renderStats();
  renderRecords(records);
}

function loadSettings() {
  const saved = localStorage.getItem('finance-settings');
  if (saved) {
    const s = JSON.parse(saved);
    document.getElementById('base-currency').value = s.baseCurrency || 'USD';
    document.getElementById('rate-eur').value = s.eurRate || '0.93';
    document.getElementById('rate-gbp').value = s.gbpRate || '0.79';
  }
}