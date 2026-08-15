import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TripsListPage from './pages/TripsListPage';
import TripFormPage from './pages/TripFormPage';
import TripDetailsPage from './pages/TripDetailsPage';
import './App.css';
import SharedTripPage from './pages/SharedTripPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/shared/:token" element={<SharedTripPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TripProvider>
                  <TripsListPage />
                </TripProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/new"
            element={
              <ProtectedRoute>
                <TripProvider>
                  <TripFormPage />
                </TripProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/:id"
            element={
              <ProtectedRoute>
                <TripDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/:id/edit"
            element={
              <ProtectedRoute>
                <TripProvider>
                  <TripFormPage />
                </TripProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}