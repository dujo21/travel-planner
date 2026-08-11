export const EXPENSE_CATEGORIES = [
  { value: 'Transport', label: 'Prevoz', color: '#2563eb' },
  { value: 'Accommodation', label: 'Smeštaj', color: '#7c3aed' },
  { value: 'Food', label: 'Hrana', color: '#16a34a' },
  { value: 'Tickets', label: 'Ulaznice', color: '#d97706' },
  { value: 'Shopping', label: 'Kupovina', color: '#db2777' },
  { value: 'Other', label: 'Ostalo', color: '#6b7280' },
];

export default class Expense {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.tripId = data.tripId ?? null;
    this.userId = data.userId ?? null;
    this.name = data.name ?? '';
    this.category = data.category ?? 'Other';
    this.amount = data.amount ?? 0;
    this.date = data.date ? new Date(data.date) : null;
    this.description = data.description ?? '';
  }

  get dateLabel() {
    if (!this.date) return '';
    const d = String(this.date.getDate()).padStart(2, '0');
    const m = String(this.date.getMonth() + 1).padStart(2, '0');
    return `${d}.${m}.${this.date.getFullYear()}`;
  }

  get categoryInfo() {
    return EXPENSE_CATEGORIES.find((c) => c.value === this.category) ?? EXPENSE_CATEGORIES[5];
  }
}