import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tripService from '../services/tripService';
import LoadingSpinner from '../components/LoadingSpinner';
import DestinationsTab from '../components/DestinationsTab';
import ActivitiesTab from '../components/ActivitiesTab';
import ExpensesTab from '../components/ExpensesTab';
import ChecklistPanel from '../components/ChecklistPanel';
import PlanOverview from '../components/PlanOverview';
import ShareDialog from '../components/ShareDialog';
import MapTab from '../components/MapTab';

export default function TripDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [shareOpen, setShareOpen] = useState(false);

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
          <button className="btn-secondary" onClick={() => setShareOpen(true)}>Podeli</button>
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
        <button className={activeTab === 'expenses' ? 'tab active' : 'tab'} onClick={() => setActiveTab('expenses')}>
          Troškovi
        </button>
        <button className={activeTab === 'checklist' ? 'tab active' : 'tab'} onClick={() => setActiveTab('checklist')}>
          Checklist
        </button>
        <button className={activeTab === 'overview-full' ? 'tab active' : 'tab'} onClick={() => setActiveTab('overview-full')}>
          Pregled plana
        </button>
        <button className={activeTab === 'map' ? 'tab active' : 'tab'} onClick={() => setActiveTab('map')}>
          Mapa
        </button>
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
        {activeTab === 'expenses' && <ExpensesTab tripId={id} plannedBudget={trip.plannedBudget} />}
        {activeTab === 'checklist' && <ChecklistPanel tripId={id} />}
        {activeTab === 'overview-full' && <PlanOverview trip={trip} />}
        {activeTab === 'map' && <MapTab tripId={id} />}
      </div>
      <ShareDialog tripId={id} open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}