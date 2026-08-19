import axios from 'axios';

// Nominatim (OpenStreetMap) - besplatno pretvaranje naziva lokacije u koordinate.
// Poseban axios jer je eksterni servis, ne nas backend.
const geocodingService = {
  async search(query) {
    if (!query || query.trim().length < 3) return [];

    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 5,
        'accept-language': 'sr',
      },
    });

    return response.data.map((r) => ({
      displayName: r.display_name,
      latitude: parseFloat(r.lat),
      longitude: parseFloat(r.lon),
    }));
  },
};

export default geocodingService;