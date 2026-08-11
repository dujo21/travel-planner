import { expenseApi } from '../api/http';
import Expense from '../models/Expense';

const expenseService = {
  async getByTrip(tripId) {
    const response = await expenseApi.get(`/api/trips/${tripId}/expenses`);
    return response.data.map((e) => new Expense(e));
  },

  async getSummary(tripId) {
    const response = await expenseApi.get(`/api/trips/${tripId}/expenses/summary`);
    return response.data;
  },

  async create(tripId, data) {
    const response = await expenseApi.post(`/api/trips/${tripId}/expenses`, data);
    return new Expense(response.data);
  },

  async update(tripId, id, data) {
    const response = await expenseApi.put(`/api/trips/${tripId}/expenses/${id}`, data);
    return new Expense(response.data);
  },

  async remove(tripId, id) {
    await expenseApi.delete(`/api/trips/${tripId}/expenses/${id}`);
  },
};

export default expenseService;