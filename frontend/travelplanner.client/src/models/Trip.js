// Model plana putovanja na frontendu.
export default class Trip {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.name = data.name ?? '';
    this.description = data.description ?? '';
    this.startDate = data.startDate ? new Date(data.startDate) : null;
    this.endDate = data.endDate ? new Date(data.endDate) : null;
    this.plannedBudget = data.plannedBudget ?? 0;
    this.notes = data.notes ?? '';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
    this.destinationCount = data.destinationCount ?? 0;
    this.activityCount = data.activityCount ?? 0;
  }

  // Broj dana trajanja putovanja.
  get durationDays() {
    if (!this.startDate || !this.endDate) return 0;
    const diff = this.endDate - this.startDate;
    return Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
  }

  // Format perioda za prikaz, npr. "01.07.2026 - 10.07.2026"
  get periodLabel() {
    if (!this.startDate || !this.endDate) return '';
    return `${formatDate(this.startDate)} - ${formatDate(this.endDate)}`;
  }
}

function formatDate(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}