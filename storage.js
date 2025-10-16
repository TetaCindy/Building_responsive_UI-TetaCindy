import { records } from './state.js';

export function loadRecords() {
  const saved = localStorage.getItem('finance-records');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        records.length = 0;
        records.push(...parsed);
      }
    } catch (e) {
      console.error('Failed to load records:', e);
    }
  }
}

export function saveRecords() {
  localStorage.setItem('finance-records', JSON.stringify(records));
}