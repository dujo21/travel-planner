import { useEffect, useState } from 'react';
import destinationService from '../services/destinationService';
import DestinationForm from './DestinationForm';
import ConfirmDialog from './ConfirmDialog';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

export default function DestinationsTab({ tripId }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      setDestinations(await destinationService.getByTrip(tripId));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  async function handleCreate(data) {
    await destinationService.create(tripId, data);
    setShowForm(false);
    await load();
  }

  async function handleUpdate(data) {
    await destinationService.update(tripId, editing.id, data);
    setEditing(null);
    await load();
  }

  async function handleDelete() {
    await destinationService.remove(tripId, confirmId);
    setConfirmId(null);
    await load();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="tab-toolbar">
        <h3>Destinacije</h3>
        {!showForm && !editing && (
          <button onClick={() => setShowForm(true)}>+ Dodaj destinaciju</button>
        )}
      </div>

      {showForm && (
        <DestinationForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {destinations.length === 0 && !showForm && (
        <EmptyState message="Još nema destinacija za ovo putovanje." />
      )}

      <div className="item-list">
        {destinations.map((d) =>
          editing?.id === d.id ? (
            <DestinationForm
              key={d.id}
              initial={d}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <div key={d.id} className="item-card">
              <div className="item-main">
                <strong>{d.name}</strong>
                {d.location && <span className="item-sub"> · {d.location}</span>}
                <div className="item-meta">
                  {d.periodLabel} · {d.nights} noćenja
                </div>
                {d.description && <p className="item-desc">{d.description}</p>}
              </div>
              <div className="item-actions">
                <button className="btn-small" onClick={() => setEditing(d)}>Izmeni</button>
                <button className="btn-small btn-danger" onClick={() => setConfirmId(d.id)}>Obriši</button>
              </div>
            </div>
          )
        )}
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        title="Brisanje destinacije"
        message="Da li si siguran da želiš da obrišeš ovu destinaciju?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}