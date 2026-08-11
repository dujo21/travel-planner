import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tripService from '../services/tripService';
import LoadingSpinner from '../components/LoadingSpinner';
import DestinationsTab from '../components/DestinationsTab';
import ActivitiesTab from '../components/ActivitiesTab';

export default function TripDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    (async () => {
      try {
        const data = await tripService.getById(id);
        setTrip(data);
      } catch {
        setError('Plan putovanja nije pronađen ili nemate pristup.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="container">
      <header className="page-header">
        <h1>{trip.name}</h1>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => navigate('/')}>← Nazad</button>
          <button onClick={() => navigate(`/trips/${id}/edit`)}>Izmeni</button>
        </div>
      </header>

      <div className="tabs">
        <button className={activeTab === 'overview' ? 'tab active' : 'tab'} onClick={() => setActiveTab('overview')}>
          Osnovno
        </button>
        <button className={activeTab === 'destinations' ? 'tab active' : 'tab'} onClick={() => setActiveTab('destinations')}>
          Destinacije
        </button>
        <button className={activeTab === 'activities' ? 'tab active' : 'tab'} onClick={() => setActiveTab('activities')}>
          Aktivnosti
        </button>
        <button className="tab" disabled>Troškovi</button>
        <button className="tab" disabled>Checklist</button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="detail-grid">
            <div><strong>Opis:</strong> {trip.description || '—'}</div>
            <div><strong>Period:</strong> {trip.periodLabel} ({trip.durationDays} dana)</div>
            <div><strong>Budžet:</strong> {trip.plannedBudget} €</div>
            <div><strong>Napomene:</strong> {trip.notes || '—'}</div>
          </div>
        )}
        {activeTab === 'destinations' && <DestinationsTab tripId={id} />}
        {activeTab === 'activities' && <ActivitiesTab tripId={id} />}
      </div>
    </div>
  );
}