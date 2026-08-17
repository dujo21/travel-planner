import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';

export default function AdminPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: '', role: 'User' });
  const [confirmId, setConfirmId] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      setUsers(await userService.getAll());
    } catch {
      setError('Greška pri učitavanju korisnika.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(user) {
    setEditing(user.id);
    setEditForm({ fullName: user.fullName, role: user.role });
  }

  async function saveEdit(id) {
    try {
      await userService.update(id, editForm);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Izmena nije uspela.');
    }
  }

  async function handleDelete() {
    try {
        await userService.remove(confirmId);
        setConfirmId(null);
        await load();
    } catch (err) {
        setError(err.response?.data?.message ?? 'Brisanje nije uspelo.');
        setConfirmId(null);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <header className="page-header">
        <h1>Administracija korisnika</h1>
        <button className="btn-secondary" onClick={() => navigate('/')}>← Nazad</button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Ime i prezime</th>
            <th>Email</th>
            <th>Uloga</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                {editing === u.id ? (
                  <input
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  />
                ) : (
                  u.fullName
                )}
              </td>
              <td>{u.email}</td>
              <td>
                {editing === u.id ? (
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                ) : (
                  <span className={u.isAdmin ? 'role-badge admin' : 'role-badge'}>
                    {u.role}
                  </span>
                )}
              </td>
              <td>
                <div className="admin-actions">
                  {editing === u.id ? (
                    <>
                      <button className="btn-small" onClick={() => saveEdit(u.id)}>Sačuvaj</button>
                      <button className="btn-small btn-secondary" onClick={() => setEditing(null)}>Otkaži</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-small" onClick={() => startEdit(u)}>Izmeni</button>
                      {u.id !== currentUser?.id && (
                        <button className="btn-small btn-danger" onClick={() => setConfirmId(u.id)}>
                          Obriši
                        </button>
                      )}
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        open={confirmId !== null}
        title="Brisanje korisnika"
        message="Da li si siguran? Ovo će obrisati korisnika i sve njegove planove."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}