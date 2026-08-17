import { userApi } from '../api/http';
import User from '../models/User';

const userService = {
  async getAll() {
    const response = await userApi.get('/api/users');
    return response.data.map((u) => new User(u));
  },

  async update(id, data) {
    const response = await userApi.put(`/api/users/${id}`, data);
    return new User(response.data);
  },

  async remove(id) {
    await userApi.delete(`/api/users/${id}`);
  },
};

export default userService;