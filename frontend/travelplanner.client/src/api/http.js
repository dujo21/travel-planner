import axios from 'axios';

// Fabrika koja pravi axios instancu za dati bazni URL.
// Svaki mikroservis ima svoj URL, ali istu logiku za token i greske.
function createApiClient(baseURL) {
  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  // Request interceptor: uz svaki zahtev dodaje JWT ako postoji.
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: na 401 odjavljuje korisnika i vodi na login.
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
}

export const userApi = createApiClient(import.meta.env.VITE_USER_API_URL);
export const tripApi = createApiClient(import.meta.env.VITE_TRIP_API_URL);
export const expenseApi = createApiClient(import.meta.env.VITE_EXPENSE_API_URL);