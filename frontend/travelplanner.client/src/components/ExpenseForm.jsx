import { useState } from 'react';
import { EXPENSE_CATEGORIES } from '../models/Expense';
import { toInputDate } from '../utils/dateHelpers';

export default function ExpenseForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    category: initial?.category ?? 'Transport',
    amount: initial?.amount ?? '',
    date: toInputDate(initial?.date),
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
    if (!form.date) e.date = 'Datum je obavezan.';
    if (form.amount === '' || Number(form.amount) <= 0) {
      e.amount = 'Iznos mora biti veći od nule.';
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
      category: form.category,
      amount: Number(form.amount),
      date: form.date,
      description: form.description.trim() || null,
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
          <label>Kategorija</label>
          <select name="category" value={form.category} onChange={handleChange}>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Iznos (€) *</label>
          <input type="number" name="amount" value={form.amount} onChange={handleChange} min="0" step="0.01" />
          {errors.amount && <span className="field-error">{errors.amount}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Datum *</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} />
        {errors.date && <span className="field-error">{errors.date}</span>}
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