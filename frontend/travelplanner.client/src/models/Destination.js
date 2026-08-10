export default class Destination {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.tripId = data.tripId ?? null;
    this.name = data.name ?? '';
    this.location = data.location ?? '';
    this.arrivalDate = data.arrivalDate ? new Date(data.arrivalDate) : null;
    this.departureDate = data.departureDate ? new Date(data.departureDate) : null;
    this.description = data.description ?? '';
  }

  get nights() {
    if (!this.arrivalDate || !this.departureDate) return 0;
    const diff = this.departureDate - this.arrivalDate;
    return Math.round(diff / (1000 * 60 * 60 * 24));
  }

  get periodLabel() {
    if (!this.arrivalDate || !this.departureDate) return '';
    return `${fmt(this.arrivalDate)} - ${fmt(this.departureDate)}`;
  }
}

function fmt(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}.${m}.${date.getFullYear()}`;
}