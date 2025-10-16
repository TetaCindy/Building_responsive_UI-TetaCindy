export function validateForm({ desc, amount, category, date }) {
  const errors = {};

  if (!desc || !/^\S(?:.*\S)?$/.test(desc)) {
    errors.desc = 'Description is required.';
  }

  if (desc && /\b(\w+)\s+\1\b/i.test(desc)) {
    errors.desc = 'Remove duplicate words.';
  }

  if (!amount || !/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(amount)) {
    errors.amount = 'Enter a valid amount (e.g., 12.50).';
  }

  if (!category) {
    errors.cat = 'Please select a category.';
  }

  if (!date || !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date)) {
    errors.date = 'Use YYYY-MM-DD format (e.g., 2025-10-16).';
  }

  return errors;
}