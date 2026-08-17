import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';

export default function TripsListPage() {
  const { trips, loading, error, loadTrips, deleteTrip } = useTrips();
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  async function handleDelete() {
    try {
      await deleteTrip(confirmId);
    } catch {
      // greška se ignoriše na nivou UI-ja, lista ostaje nepromenjena
    } finally {
      setConfirmId(null);
    }
  }

  return (
    <div className="container">
      <header className="page-header">
        <div>
          <h1>Moja putovanja</h1>
          <span className="subtitle">Prijavljen: {currentUser?.fullName}</span>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/trips/new')}>+ Novo putovanje</button>
          {isAdmin && (
            <button className="btn-secondary" onClick={() => navigate('/admin')}>Administracija</button>
          )}
          <button className="btn-secondary" onClick={logout}>Odjava</button>
        </div>
      </header>

      {loading && <LoadingSpinner />}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && trips.length === 0 && (
        <EmptyState
          message="Još nemaš nijedno putovanje. Kreiraj svoje prvo!"
          actionLabel="+ Novo putovanje"
          onAction={() => navigate('/trips/new')}
        />
      )}

      <div className="trip-grid">
        {trips.map((trip) => (
          <div key={trip.id} className="trip-card" onClick={() => navigate(`/trips/${trip.id}`)}>
            <h3>{trip.name}</h3>
            {trip.description && <p className="trip-desc">{trip.description}</p>}
            <div className="trip-meta">
              <span>📅 {trip.periodLabel}</span>
              <span>⏱ {trip.durationDays} dana</span>
            </div>
            <div className="trip-meta">
              <span>📍 {trip.destinationCount} destinacija</span>
              <span>🎯 {trip.activityCount} aktivnosti</span>
            </div>
            <div className="trip-budget">Budžet: {trip.plannedBudget} €</div>
            <div className="trip-card-actions" onClick={(e) => e.stopPropagation()}>
              <button className="btn-small" onClick={() => navigate(`/trips/${trip.id}/edit`)}>
                Izmeni
              </button>
              <button className="btn-small btn-danger" onClick={() => setConfirmId(trip.id)}>
                Obriši
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        title="Brisanje putovanja"
        message="Da li si siguran? Ovo će obrisati i sve destinacije, aktivnosti i troškove ovog putovanja."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}