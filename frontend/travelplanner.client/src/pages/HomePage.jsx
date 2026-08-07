import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { currentUser, logout, isAdmin } = useAuth();

  return (
    <div className="page-center">
      <h1>Planer za putovanje</h1>
      <p>Dobrodošao, {currentUser?.fullName}!</p>
      <p>Uloga: {isAdmin ? 'Administrator' : 'Korisnik'}</p>
      <button onClick={logout}>Odjavi se</button>
    </div>
  );
}