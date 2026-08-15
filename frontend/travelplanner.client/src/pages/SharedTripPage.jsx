import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import publicShareService from '../services/publicShareService';
import Trip from '../models/Trip';
import { toInputDate } from '../utils/dateHelpers';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SharedTripPage() {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [accessType, setAccessType] = useState('VIEW');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  async function load() {
    try {
      const data = await publicShareService.getSharedTrip(token);
      setTrip(new Trip(data.trip));
      setAccessType(data.accessType);
    } catch {
      setError('Link za deljenje je nevažeći ili je istekao.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function startEdit() {
    setForm({
      name: trip.name,
      description: trip.description ?? '',
      startDate: toInputDate(trip.startDate),
      endDate: toInputDate(trip.endDate),
      plannedBudget: trip.plannedBudget,
      notes: trip.notes ?? '',
    });
    setEditing(true);
    setSaveError('');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaveError('');
    if (!form.name.trim()) {
      setSaveError('Naziv je obavezan.');
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setSaveError('Datum završetka ne može biti pre početka.');
      return;
    }

    setSaving(true);
    try {
      await publicShareService.updateSharedTrip(token, {
        name: form.name.trim(),
        description: form.description.trim() || null,
        startDate: form.startDate,
        endDate: form.endDate,
        plannedBudget: Number(form.plannedBudget) || 0,
        notes: form.notes.trim() || null,
      });
      setEditing(false);
      await load();
    } catch (err) {
      setSaveError(err.response?.data?.message ?? 'Čuvanje nije uspelo.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="container">
        <div className="shared-header"><h1>Planer za putovanje</h1></div>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="shared-header">
        <h1>Planer za putovanje</h1>
        <span className="share-access-badge">
          {accessType === 'EDIT' ? 'Pregled i izmena' : 'Samo pregled'}
        </span>
      </div>

      <div className="tab-content">
        {!editing ? (
          <>
            <div className="detail-header-row">
              <h2>{trip.name}</h2>
              {accessType === 'EDIT' && (
                <button onClick={startEdit}>Izmeni plan</button>
              )}
            </div>
            <div className="detail-grid" style={{ marginTop: '1rem' }}>
              <div><strong>Opis:</strong> {trip.description || '—'}</div>
              <div><strong>Period:</strong> {trip.periodLabel} ({trip.durationDays} dana)</div>
              <div><strong>Budžet:</strong> {trip.plannedBudget} €</div>
              <div><strong>Destinacije:</strong> {trip.destinationCount}</div>
              <div><strong>Aktivnosti:</strong> {trip.activityCount}</div>
              {trip.notes && <div><strong>Napomene:</strong> {trip.notes}</div>}
            </div>
          </>
        ) : (
          <form className="form-card" onSubmit={handleSave} style={{ boxShadow: 'none', padding: 0 }}>
            <h2>Izmena plana</h2>
            {saveError && <div className="alert alert-error">{saveError}</div>}

            <div className="form-group">
              <label>Naziv *</label>
              <input name="name" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Opis</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="2" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Datum početka *</label>
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Datum završetka *</label>
                <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Budžet (€)</label>
              <input type="number" name="plannedBudget" value={form.plannedBudget} onChange={handleChange} min="0" step="0.01" />
            </div>
            <div className="form-group">
              <label>Napomene</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows="3" />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Otkaži</button>
              <button type="submit" disabled={saving}>{saving ? 'Čuvanje...' : 'Sačuvaj'}</button>
            </div>
          </form>
        )}
      </div>

      <p className="shared-footer">
        Ovaj plan je podeljen sa vama. {accessType === 'VIEW'
          ? 'Imate pristup samo za pregled.'
          : 'Imate pristup za pregled i izmenu.'}
      </p>
    </div>
  );
}