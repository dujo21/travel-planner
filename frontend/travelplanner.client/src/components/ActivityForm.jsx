import { useState } from 'react';
import { ACTIVITY_STATUSES } from '../models/Activity';

function toInputDate(date) {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
}

export default function ActivityForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    date: toInputDate(initial?.date),
    time: initial?.time ? initial.time.slice(0, 5) : '',
    location: initial?.location ?? '',
    latitude: initial?.latitude ?? '',
    longitude: initial?.longitude ?? '',
    description: initial?.description ?? '',
    estimatedCost: initial?.estimatedCost ?? '',
    status: initial?.status ?? 'Planned',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Naziv je obavezan.';
    if (!form.date) e.date = 'Datum je obavezan.';
    if (form.estimatedCost !== '' && Number(form.estimatedCost) < 0) {
      e.estimatedCost = 'Trošak ne može biti negativan.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      date: form.date,
      time: form.time ? `${form.time}:00` : null,
      location: form.location.trim() || null,
      latitude: form.latitude !== '' ? Number(form.latitude) : null,
      longitude: form.longitude !== '' ? Number(form.longitude) : null,
      description: form.description.trim() || null,
      estimatedCost: Number(form.estimatedCost) || 0,
      status: form.status,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setServerError(err.response?.data?.message ?? 'Čuvanje nije uspelo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      {serverError && <div className="alert alert-error">{serverError}</div>}

      <div className="form-group">
        <label>Naziv *</label>
        <input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Datum *</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>
        <div className="form-group">
          <label>Vreme</label>
          <input type="time" name="time" value={form.time} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label>Lokacija</label>
        <input name="location" value={form.location} onChange={handleChange} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Latitude</label>
          <input type="number" name="latitude" value={form.latitude} onChange={handleChange} step="any" placeholder="npr. 41.8902" />
        </div>
        <div className="form-group">
          <label>Longitude</label>
          <input type="number" name="longitude" value={form.longitude} onChange={handleChange} step="any" placeholder="npr. 12.4922" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Procenjeni trošak (€)</label>
          <input type="number" name="estimatedCost" value={form.estimatedCost} onChange={handleChange} min="0" step="0.01" />
          {errors.estimatedCost && <span className="field-error">{errors.estimatedCost}</span>}
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            {ACTIVITY_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Opis</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows="2" />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Otkaži</button>
        <button type="submit" disabled={submitting}>{submitting ? 'Čuvanje...' : 'Sačuvaj'}</button>
      </div>
    </form>
  );
}