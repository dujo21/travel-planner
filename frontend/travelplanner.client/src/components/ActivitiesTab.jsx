import { useEffect, useState } from 'react';
import activityService from '../services/activityService';
import { ACTIVITY_STATUSES } from '../models/Activity';
import ActivityForm from './ActivityForm';
import ActivityCalendar from './ActivityCalendar';
import ConfirmDialog from './ConfirmDialog';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

export default function ActivitiesTab({ tripId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'calendar'
  const [prefillDate, setPrefillDate] = useState(null);

  async function load() {
    setLoading(true);
    try {
      setActivities(await activityService.getByTrip(tripId));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  async function handleCreate(data) {
    await activityService.create(tripId, data);
    setShowForm(false);
    setPrefillDate(null);
    await load();
  }

  async function handleUpdate(data) {
    await activityService.update(tripId, editing.id, data);
    setEditing(null);
    await load();
  }

  async function handleStatusChange(activity, newStatus) {
    await activityService.updateStatus(tripId, activity.id, newStatus);
    await load();
  }

  async function handleDelete() {
    await activityService.remove(tripId, confirmId);
    setConfirmId(null);
    await load();
  }

  // Klik na prazan dan u kalendaru otvara formu sa popunjenim datumom.
  function handleSlotSelect(date) {
    setPrefillDate(date);
    setShowForm(true);
  }

  if (loading) return <LoadingSpinner />;

  // Grupisanje po danu (dateKey)
  const grouped = activities.reduce((acc, a) => {
    const key = a.dateKey;
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});
  const sortedDays = Object.keys(grouped).sort();

  return (
    <div>
      <div className="tab-toolbar">
        <h3>Aktivnosti po danima</h3>
        <div className="toolbar-right">
          <div className="view-switch">
            <button
              className={view === 'list' ? 'switch-btn active' : 'switch-btn'}
              onClick={() => setView('list')}
            >
              Lista
            </button>
            <button
              className={view === 'calendar' ? 'switch-btn active' : 'switch-btn'}
              onClick={() => setView('calendar')}
            >
              Kalendar
            </button>
          </div>
          {!showForm && !editing && (
            <button onClick={() => setShowForm(true)}>+ Dodaj aktivnost</button>
          )}
        </div>
      </div>

      {showForm && (
        <ActivityForm
          initialDate={prefillDate}
          onSubmit={handleCreate}
          onCancel={() => { setShowForm(false); setPrefillDate(null); }}
        />
      )}

      {activities.length === 0 && !showForm && (
        <EmptyState message="Još nema aktivnosti za ovo putovanje." />
      )}

      {view === 'calendar' && activities.length > 0 && (
        <ActivityCalendar
          activities={activities}
          defaultDate={activities[0]?.date ?? new Date()}
          onSelectActivity={(a) => { setEditing(a); setView('list'); }}
          onSelectSlot={handleSlotSelect}
        />
      )}

      {view === 'list' &&
        sortedDays.map((day) => {
          const first = grouped[day][0];
          return (
            <div key={day} className="day-group">
              <div className="day-header">{first.dateLabel}</div>

              {grouped[day].map((a) =>
                editing?.id === a.id ? (
                  <ActivityForm
                    key={a.id}
                    initial={a}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditing(null)}
                  />
                ) : (
                  <div key={a.id} className="activity-card">
                    <div className="activity-main">
                      <div className="activity-head">
                        {a.timeLabel && <span className="activity-time">{a.timeLabel}</span>}
                        <strong>{a.name}</strong>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: a.statusInfo.color }}
                        >
                          {a.statusInfo.label}
                        </span>
                      </div>
                      {a.location && <div className="activity-loc">📍 {a.location}</div>}
                      {a.description && <p className="item-desc">{a.description}</p>}
                      {a.estimatedCost > 0 && <div className="activity-cost">{a.estimatedCost} €</div>}
                    </div>
                    <div className="activity-actions">
                      <select
                        value={a.status}
                        onChange={(e) => handleStatusChange(a, e.target.value)}
                        className="status-select"
                      >
                        {ACTIVITY_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                      <button className="btn-small" onClick={() => setEditing(a)}>Izmeni</button>
                      <button className="btn-small btn-danger" onClick={() => setConfirmId(a.id)}>Obriši</button>
                    </div>
                  </div>
                )
              )}
            </div>
          );
        })}

      <ConfirmDialog
        open={confirmId !== null}
        title="Brisanje aktivnosti"
        message="Da li si siguran da želiš da obrišeš ovu aktivnost?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}