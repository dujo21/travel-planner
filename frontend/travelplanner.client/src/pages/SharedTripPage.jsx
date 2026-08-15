import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import publicShareService from '../services/publicShareService';
import Trip from '../models/Trip';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SharedTripPage() {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [accessType, setAccessType] = useState('VIEW');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await publicShareService.getSharedTrip(token);
        setTrip(new Trip(data.trip));
        setAccessType(data.accessType);
      } catch {
        setError('Link za deljenje je nevažeći ili je istekao.');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="container">
        <div className="shared-header">
          <h1>Planer za putovanje</h1>
        </div>
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
        <h2>{trip.name}</h2>
        <div className="detail-grid" style={{ marginTop: '1rem' }}>
          <div><strong>Opis:</strong> {trip.description || '—'}</div>
          <div><strong>Period:</strong> {trip.periodLabel} ({trip.durationDays} dana)</div>
          <div><strong>Budžet:</strong> {trip.plannedBudget} €</div>
          <div><strong>Destinacije:</strong> {trip.destinationCount}</div>
          <div><strong>Aktivnosti:</strong> {trip.activityCount}</div>
          {trip.notes && <div><strong>Napomene:</strong> {trip.notes}</div>}
        </div>
      </div>

      <p className="shared-footer">
        Ovaj plan je podeljen sa vama. {accessType === 'VIEW'
          ? 'Imate pristup samo za pregled.'
          : 'Imate pristup za pregled i izmenu.'}
      </p>
    </div>
  );
}