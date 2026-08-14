import { useEffect, useState } from 'react';
import destinationService from '../services/destinationService';
import activityService from '../services/activityService';
import expenseService from '../services/expenseService';
import checklistService from '../services/checklistService';
import { EXPENSE_CATEGORIES } from '../models/Expense';
import { ACTIVITY_STATUSES } from '../models/Activity';
import { exportPlanToPdf } from '../utils/pdfExport';
import LoadingSpinner from './LoadingSpinner';

export default function PlanOverview({ trip }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [destinations, activities, expenses, summary, checklist] = await Promise.all([
          destinationService.getByTrip(trip.id),
          activityService.getByTrip(trip.id),
          expenseService.getByTrip(trip.id),
          expenseService.getSummary(trip.id),
          checklistService.getByTrip(trip.id),
        ]);
        setData({ destinations, activities, expenses, summary, checklist });
      } finally {
        setLoading(false);
      }
    })();
  }, [trip.id]);

  async function handleExport() {
    setExporting(true);
    try {
      await exportPlanToPdf('plan-overview', `plan-${trip.name}.pdf`);
    } catch {
      alert('Izvoz u PDF nije uspeo.');
    } finally {
      setExporting(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  const { destinations, activities, summary, checklist } = data;
  const spent = summary?.totalAmount ?? 0;
  const remaining = trip.plannedBudget - spent;
  const doneCount = checklist.filter((c) => c.isCompleted).length;

  // Aktivnosti grupisane po danu
  const byDay = activities.reduce((acc, a) => {
    const key = a.dateLabel;
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  return (
    <div>
      <div className="overview-toolbar">
        <button onClick={handleExport} disabled={exporting}>
          {exporting ? 'Izvoz...' : '📄 Preuzmi PDF'}
        </button>
      </div>

      <div id="plan-overview" className="plan-overview">
        <section className="overview-section">
          <h3>{trip.name}</h3>
          <p className="overview-muted">{trip.description || 'Bez opisa'}</p>
          <div className="overview-grid">
            <div><strong>Period:</strong> {trip.periodLabel} ({trip.durationDays} dana)</div>
            <div><strong>Budžet:</strong> {trip.plannedBudget.toFixed(2)} €</div>
            <div><strong>Potrošeno:</strong> {spent.toFixed(2)} €</div>
            <div>
              <strong>{remaining >= 0 ? 'Preostalo:' : 'Prekoračeno:'}</strong>{' '}
              <span style={{ color: remaining >= 0 ? '#0e7c86' : '#b3261e' }}>
                {Math.abs(remaining).toFixed(2)} €
              </span>
            </div>
          </div>
          {trip.notes && (
            <div className="overview-notes">
              <strong>Bilješke:</strong> {trip.notes}
            </div>
          )}
        </section>

        <section className="overview-section">
          <h4>Destinacije ({destinations.length})</h4>
          {destinations.length === 0 ? (
            <p className="overview-muted">Nema destinacija.</p>
          ) : (
            <ul className="overview-list">
              {destinations.map((d) => (
                <li key={d.id}>
                  <strong>{d.name}</strong>
                  {d.location && ` · ${d.location}`} — {d.periodLabel}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="overview-section">
          <h4>Aktivnosti po danima ({activities.length})</h4>
          {activities.length === 0 ? (
            <p className="overview-muted">Nema aktivnosti.</p>
          ) : (
            Object.entries(byDay).map(([day, acts]) => (
              <div key={day} className="overview-day">
                <div className="overview-day-header">{day}</div>
                {acts.map((a) => {
                  const status = ACTIVITY_STATUSES.find((s) => s.value === a.status);
                  return (
                    <div key={a.id} className="overview-activity">
                      {a.timeLabel && <span className="overview-time">{a.timeLabel}</span>}
                      <span>{a.name}</span>
                      <span className="overview-status" style={{ color: status?.color }}>
                        ({status?.label})
                      </span>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </section>

        <section className="overview-section">
          <h4>Troškovi po kategorijama</h4>
          {summary && Object.keys(summary.byCategory).length > 0 ? (
            <ul className="overview-list">
              {Object.entries(summary.byCategory).map(([cat, amount]) => {
                const info = EXPENSE_CATEGORIES.find((c) => c.value === cat);
                return (
                  <li key={cat}>{info?.label ?? cat}: {amount.toFixed(2)} €</li>
                );
              })}
            </ul>
          ) : (
            <p className="overview-muted">Nema troškova.</p>
          )}
        </section>

        <section className="overview-section">
          <h4>Checklist ({doneCount} od {checklist.length} završeno)</h4>
          {checklist.length === 0 ? (
            <p className="overview-muted">Nema stavki.</p>
          ) : (
            <ul className="overview-list">
              {checklist.map((c) => (
                <li key={c.id} style={{ textDecoration: c.isCompleted ? 'line-through' : 'none' }}>
                  {c.isCompleted ? '✓ ' : '○ '}{c.title}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}