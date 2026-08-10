import { tripApi } from '../api/http';
import Trip from '../models/Trip';

// Jedino mesto odakle se gadja TripService.
const tripService = {
  async getAll() {
    const response = await tripApi.get('/api/trips');
    return response.data.map((t) => new Trip(t));
  },

  async getById(id) {
    const response = await tripApi.get(`/api/trips/${id}`);
    return new Trip(response.data);
  },

  async create(tripData) {
    const response = await tripApi.post('/api/trips', tripData);
    return new Trip(response.data);
  },

  async update(id, tripData) {
    const response = await tripApi.put(`/api/trips/${id}`, tripData);
    return new Trip(response.data);
  },

  async remove(id) {
    await tripApi.delete(`/api/trips/${id}`);
  },
};

export default tripService;