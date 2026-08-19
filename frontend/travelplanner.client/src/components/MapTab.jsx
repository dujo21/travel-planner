import { useEffect, useState } from 'react';
import activityService from '../services/activityService';
import ActivityMap from './ActivityMap';
import LoadingSpinner from './LoadingSpinner';

export default function MapTab({ tripId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setActivities(await activityService.getByTrip(tripId));
      } finally {
        setLoading(false);
      }
    })();
  }, [tripId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h3 style={{ marginBottom: '1rem', color: '#14304f' }}>Ruta putovanja na mapi</h3>
      <ActivityMap activities={activities} />
    </div>
  );
}