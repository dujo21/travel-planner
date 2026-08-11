export const ACTIVITY_STATUSES = [
  { value: 'Planned', label: 'Planirano', color: '#2563eb' },
  { value: 'Booked', label: 'Rezervisano', color: '#d97706' },
  { value: 'Completed', label: 'Završeno', color: '#16a34a' },
  { value: 'Cancelled', label: 'Otkazano', color: '#6b7280' },
];

export default class Activity {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.tripId = data.tripId ?? null;
    this.destinationId = data.destinationId ?? null;
    this.name = data.name ?? '';
    this.date = data.date ? new Date(data.date) : null;
    this.time = data.time ?? null;
    this.location = data.location ?? '';
    this.latitude = data.latitude ?? null;
    this.longitude = data.longitude ?? null;
    this.description = data.description ?? '';
    this.estimatedCost = data.estimatedCost ?? 0;
    this.status = data.status ?? 'Planned';
  }

  // "2026-08-03" - kljuc za grupisanje po danima
  get dateKey() {
    if (!this.date) return '';
    const y = this.date.getFullYear();
    const m = String(this.date.getMonth() + 1).padStart(2, '0');
    const d = String(this.date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  get dateLabel() {
    if (!this.date) return '';
    const d = String(this.date.getDate()).padStart(2, '0');
    const m = String(this.date.getMonth() + 1).padStart(2, '0');
    return `${d}.${m}.${this.date.getFullYear()}`;
  }

  // "10:00:00" -> "10:00"
  get timeLabel() {
    if (!this.time) return '';
    return this.time.slice(0, 5);
  }

  get statusInfo() {
    return ACTIVITY_STATUSES.find((s) => s.value === this.status) ?? ACTIVITY_STATUSES[0];
  }
}