import { tripApi } from '../api/http';

const shareService = {
  async getByTrip(tripId) {
    const response = await tripApi.get(`/api/trips/${tripId}/shares`);
    return response.data;
  },

  async create(tripId, accessType, expiryDays) {
    const response = await tripApi.post(`/api/trips/${tripId}/shares`, {
      accessType,
      expiryDays: expiryDays ?? null,
    });
    return response.data;
  },

  async revoke(tripId, token) {
    await tripApi.delete(`/api/trips/${tripId}/shares/${token}`);
  },
};

export default shareService;