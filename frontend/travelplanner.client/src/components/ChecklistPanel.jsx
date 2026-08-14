import { useEffect, useState } from 'react';
import checklistService from '../services/checklistService';
import LoadingSpinner from './LoadingSpinner';

// Tipične stavke za jednim klikom.
const TYPICAL_ITEMS = [
  'Pasoš / lična karta',
  'Avionske / autobuske karte',
  'Rezervacija smeštaja',
  'Putno osiguranje',
  'Punjač za telefon',
  'Garderoba po vremenskoj prognozi',
];

export default function ChecklistPanel({ tripId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setItems(await checklistService.getByTrip(tripId));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      await checklistService.create(tripId, newTitle.trim());
      setNewTitle('');
      await load();
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(id) {
    await checklistService.toggle(tripId, id);
    await load();
  }

  async function handleDelete(id) {
    await checklistService.remove(tripId, id);
    await load();
  }

  async function addTypical() {
    // Dodaj samo one kojih još nema.
    const existing = items.map((i) => i.title);
    for (const title of TYPICAL_ITEMS) {
      if (!existing.includes(title)) {
        await checklistService.create(tripId, title);
      }
    }
    await load();
  }

  if (loading) return <LoadingSpinner />;

  const completed = items.filter((i) => i.isCompleted).length;
  const total = items.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <div className="tab-toolbar">
        <h3>Checklist / Šta poneti</h3>
        {items.length === 0 && (
          <button className="btn-secondary" onClick={addTypical}>
            Dodaj tipične stavke
          </button>
        )}
      </div>

      {total > 0 && (
        <div className="checklist-progress">
          <div className="progress-text">
            {completed} od {total} završeno ({percent}%)
          </div>
          <div className="budget-bar">
            <div className="budget-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}

      <form className="checklist-add" onSubmit={handleAdd}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Nova stavka..."
        />
        <button type="submit" disabled={adding}>Dodaj</button>
      </form>

      {total === 0 && (
        <p className="empty-hint">Nema stavki. Dodaj svoju ili ubaci tipične jednim klikom.</p>
      )}

      <div className="checklist-items">
        {items.map((item) => (
          <div key={item.id} className={item.isCompleted ? 'checklist-item done' : 'checklist-item'}>
            <label>
              <input
                type="checkbox"
                checked={item.isCompleted}
                onChange={() => handleToggle(item.id)}
              />
              <span>{item.title}</span>
            </label>
            <button className="btn-small btn-danger" onClick={() => handleDelete(item.id)}>
              Obriši
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}