import { tripApi } from '../api/http';
import Activity from '../models/Activity';

const activityService = {
  async getByTrip(tripId) {
    const response = await tripApi.get(`/api/trips/${tripId}/activities`);
    return response.data.map((a) => new Activity(a));
  },

  async create(tripId, data) {
    const response = await tripApi.post(`/api/trips/${tripId}/activities`, data);
    return new Activity(response.data);
  },

  async update(tripId, id, data) {
    const response = await tripApi.put(`/api/trips/${tripId}/activities/${id}`, data);
    return new Activity(response.data);
  },

  async updateStatus(tripId, id, status) {
    const response = await tripApi.patch(`/api/trips/${tripId}/activities/${id}/status`, { status });
    return new Activity(response.data);
  },

  async remove(tripId, id) {
    await tripApi.delete(`/api/trips/${tripId}/activities/${id}`);
  },
};

export default activityService;