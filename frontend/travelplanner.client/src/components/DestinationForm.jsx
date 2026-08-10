import { useState } from 'react';

function toInputDate(date) {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
}

export default function DestinationForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    location: initial?.location ?? '',
    arrivalDate: toInputDate(initial?.arrivalDate),
    departureDate: toInputDate(initial?.departureDate),
    description: initial?.description ?? '',
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
    if (!form.arrivalDate) e.arrivalDate = 'Datum dolaska je obavezan.';
    if (!form.departureDate) e.departureDate = 'Datum odlaska je obavezan.';
    if (form.arrivalDate && form.departureDate && new Date(form.departureDate) < new Date(form.arrivalDate)) {
      e.departureDate = 'Datum odlaska ne može biti pre dolaska.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        location: form.location.trim() || null,
        arrivalDate: form.arrivalDate,
        departureDate: form.departureDate,
        description: form.description.trim() || null,
      });
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

      <div className="form-group">
        <label>Lokacija</label>
        <input name="location" value={form.location} onChange={handleChange} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Dolazak *</label>
          <input type="date" name="arrivalDate" value={form.arrivalDate} onChange={handleChange} />
          {errors.arrivalDate && <span className="field-error">{errors.arrivalDate}</span>}
        </div>
        <div className="form-group">
          <label>Odlazak *</label>
          <input type="date" name="departureDate" value={form.departureDate} onChange={handleChange} />
          {errors.departureDate && <span className="field-error">{errors.departureDate}</span>}
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