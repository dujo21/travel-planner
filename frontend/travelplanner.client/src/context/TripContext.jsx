import { createContext, useContext, useState, useCallback } from 'react';
import tripService from '../services/tripService';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTrips = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await tripService.getAll();
      setTrips(data);
    } catch {
      setError('Greška pri učitavanju planova putovanja.');
    } finally {
      setLoading(false);
    }
  }, []);

  async function createTrip(tripData) {
    const created = await tripService.create(tripData);
    setTrips((prev) => [created, ...prev]);
    return created;
  }

  async function updateTrip(id, tripData) {
    const updated = await tripService.update(id, tripData);
    setTrips((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }

  async function deleteTrip(id) {
    await tripService.remove(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  }

  const value = {
    trips,
    loading,
    error,
    loadTrips,
    createTrip,
    updateTrip,
    deleteTrip,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips mora biti korišćen unutar TripProvider-a.');
  }
  return context;
}