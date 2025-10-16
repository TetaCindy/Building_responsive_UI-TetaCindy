export const records = [];

export function addRecord(record) {
  records.push(record);
}

export function updateRecord(id, updated) {
  const index = records.findIndex(r => r.id === id);
  if (index !== -1) records[index] = updated;
}

export function deleteRecord(id) {
  const index = records.findIndex(r => r.id === id);
  if (index !== -1) records.splice(index, 1);
}

function getCurrencySettings() {
  const saved = localStorage.getItem('finance-settings');
  if (saved) {
    const s = JSON.parse(saved);
    return {
      base: s.baseCurrency || 'USD',
      eur: parseFloat(s.eurRate) || 0.93,
      gbp: parseFloat(s.gbpRate) || 0.79
    };
  }
  return { base: 'USD', eur: 0.93, gbp: 0.79 };
}

// All records are stored in USD internally
// This converts to base currency for display
function convertToBase(usdAmount) {
  const { base, eur, gbp } = getCurrencySettings();
  if (base === 'USD') return usdAmount;
  if (base === 'EUR') return usdAmount * eur;
  if (base === 'GBP') return usdAmount * gbp;
  return usdAmount;
}

export function formatAmount(amount) {
  const { base } = getCurrencySettings();
  const symbol = base === 'USD' ? '$' : base === 'EUR' ? '€' : '£';
  return `${symbol}${convertToBase(amount).toFixed(2)}`;
}

export function getStats() {
  let totalIncome = 0;
  let totalExpense = 0;

  records.forEach(r => {
    if (r.type === 'income') {
      totalIncome += r.amount;
    } else {
      totalExpense += r.amount;
    }
  });

  const net = totalIncome - totalExpense;
  
  return {
    income: convertToBase(totalIncome),
    expense: convertToBase(totalExpense),
    balance: convertToBase(net),
    count: records.length
  };
}