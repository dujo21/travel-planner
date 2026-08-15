import axios from 'axios';

// Poseban axios BEZ interceptora - javna stranica nema prijavljenog korisnika.
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_TRIP_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

const publicShareService = {
  async getSharedTrip(token) {
    const response = await publicApi.get(`/api/shared/${token}`);
    return response.data;
  },

  async updateSharedTrip(token, data) {
    const response = await publicApi.put(`/api/shared/${token}`, data);
    return response.data;
  },
};

export default publicShareService;