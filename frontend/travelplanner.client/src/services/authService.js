import { userApi } from '../api/http';
import User from '../models/User';

// Jedino mesto odakle se gadja UserService. Komponente zovu ove funkcije,
// nikad axios direktno.
const authService = {
  async login(email, password) {
    const response = await userApi.post('/api/auth/login', { email, password });
    return {
      token: response.data.token,
      expiresAt: response.data.expiresAt,
      user: new User(response.data.user),
    };
  },

  async register(fullName, email, password) {
    const response = await userApi.post('/api/auth/register', {
      fullName,
      email,
      password,
    });
    return {
      token: response.data.token,
      expiresAt: response.data.expiresAt,
      user: new User(response.data.user),
    };
  },

  async getCurrentUser() {
    const response = await userApi.get('/api/users/me');
    return new User(response.data);
  },
};

export default authService;