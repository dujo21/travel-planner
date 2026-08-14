import { tripApi } from '../api/http';

const checklistService = {
  async getByTrip(tripId) {
    const response = await tripApi.get(`/api/trips/${tripId}/checklist-items`);
    return response.data;
  },

  async create(tripId, title) {
    const response = await tripApi.post(`/api/trips/${tripId}/checklist-items`, { title });
    return response.data;
  },

  async toggle(tripId, id) {
    const response = await tripApi.patch(`/api/trips/${tripId}/checklist-items/${id}/toggle`);
    return response.data;
  },

  async remove(tripId, id) {
    await tripApi.delete(`/api/trips/${tripId}/checklist-items/${id}`);
  },
};

export default checklistService;