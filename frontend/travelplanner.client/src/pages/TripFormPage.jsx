import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import tripService from '../services/tripService';
import LoadingSpinner from '../components/LoadingSpinner';

function toInputDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export default function TripFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { createTrip, updateTrip } = useTrips();

  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    plannedBudget: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const trip = await tripService.getById(id);
        setForm({
          name: trip.name,
          description: trip.description ?? '',
          startDate: toInputDate(trip.startDate),
          endDate: toInputDate(trip.endDate),
          plannedBudget: trip.plannedBudget,
          notes: trip.notes ?? '',
        });
      } catch {
        setServerError('Nije moguće učitati plan putovanja.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Naziv je obavezan.';
    else if (form.name.trim().length < 2) e.name = 'Naziv mora imati najmanje 2 karaktera.';
    if (!form.startDate) e.startDate = 'Datum početka je obavezan.';
    if (!form.endDate) e.endDate = 'Datum završetka je obavezan.';
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      e.endDate = 'Datum završetka ne može biti pre datuma početka.';
    }
    if (form.plannedBudget !== '' && Number(form.plannedBudget) < 0) {
      e.plannedBudget = 'Budžet ne može biti negativan.';
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
      description: form.description.trim() || null,
      startDate: form.startDate,
      endDate: form.endDate,
      plannedBudget: Number(form.plannedBudget) || 0,
      notes: form.notes.trim() || null,
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateTrip(id, payload);
      } else {
        await createTrip(payload);
      }
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Čuvanje nije uspelo. Pokušajte ponovo.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>{isEdit ? 'Izmeni putovanje' : 'Novo putovanje'}</h2>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <div className="form-group">
          <label>Naziv putovanja *</label>
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Opis</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows="2" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Datum početka *</label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
            {errors.startDate && <span className="field-error">{errors.startDate}</span>}
          </div>
          <div className="form-group">
            <label>Datum završetka *</label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
            {errors.endDate && <span className="field-error">{errors.endDate}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Planirani budžet (€)</label>
          <input type="number" name="plannedBudget" value={form.plannedBudget} onChange={handleChange} min="0" step="0.01" />
          {errors.plannedBudget && <span className="field-error">{errors.plannedBudget}</span>}
        </div>

        <div className="form-group">
          <label>Napomene</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows="3" />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
            Otkaži
          </button>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Čuvanje...' : isEdit ? 'Sačuvaj izmene' : 'Kreiraj'}
          </button>
        </div>
      </form>
    </div>
  );
}