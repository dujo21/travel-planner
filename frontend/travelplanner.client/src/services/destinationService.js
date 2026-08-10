import { tripApi } from '../api/http';
import Destination from '../models/Destination';

const destinationService = {
  async getByTrip(tripId) {
    const response = await tripApi.get(`/api/trips/${tripId}/destinations`);
    return response.data.map((d) => new Destination(d));
  },

  async create(tripId, data) {
    const response = await tripApi.post(`/api/trips/${tripId}/destinations`, data);
    return new Destination(response.data);
  },

  async update(tripId, id, data) {
    const response = await tripApi.put(`/api/trips/${tripId}/destinations/${id}`, data);
    return new Destination(response.data);
  },

  async remove(tripId, id) {
    await tripApi.delete(`/api/trips/${tripId}/destinations/${id}`);
  },
};

export default destinationService;