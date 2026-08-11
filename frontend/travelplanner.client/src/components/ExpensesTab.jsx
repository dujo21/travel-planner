import { useEffect, useState } from 'react';
import expenseService from '../services/expenseService';
import { EXPENSE_CATEGORIES } from '../models/Expense';
import ExpenseForm from './ExpenseForm';
import BudgetSummary from './BudgetSummary';
import ConfirmDialog from './ConfirmDialog';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

export default function ExpensesTab({ tripId, plannedBudget }) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [filter, setFilter] = useState('all');

  async function load() {
    setLoading(true);
    try {
      const [list, sum] = await Promise.all([
        expenseService.getByTrip(tripId),
        expenseService.getSummary(tripId),
      ]);
      setExpenses(list);
      setSummary(sum);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  async function handleCreate(data) {
    await expenseService.create(tripId, data);
    setShowForm(false);
    await load();
  }

  async function handleUpdate(data) {
    await expenseService.update(tripId, editing.id, data);
    setEditing(null);
    await load();
  }

  async function handleDelete() {
    await expenseService.remove(tripId, confirmId);
    setConfirmId(null);
    await load();
  }

  if (loading) return <LoadingSpinner />;

  const filtered = filter === 'all'
    ? expenses
    : expenses.filter((e) => e.category === filter);

  return (
    <div>
      <div className="tab-toolbar">
        <h3>Troškovi</h3>
        {!showForm && !editing && (
          <button onClick={() => setShowForm(true)}>+ Dodaj trošak</button>
        )}
      </div>

      {summary && <BudgetSummary summary={summary} plannedBudget={plannedBudget} />}

      {showForm && (
        <ExpenseForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {expenses.length > 0 && (
        <div className="filter-row">
          <label>Filter: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Sve kategorije</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      )}

      {expenses.length === 0 && !showForm && (
        <EmptyState message="Još nema troškova za ovo putovanje." />
      )}

      <div className="item-list">
        {filtered.map((e) =>
          editing?.id === e.id ? (
            <ExpenseForm
              key={e.id}
              initial={e}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <div key={e.id} className="item-card">
              <div className="item-main">
                <div className="activity-head">
                  <span className="category-badge" style={{ backgroundColor: e.categoryInfo.color }}>
                    {e.categoryInfo.label}
                  </span>
                  <strong>{e.name}</strong>
                </div>
                <div className="item-meta">{e.dateLabel}</div>
                {e.description && <p className="item-desc">{e.description}</p>}
              </div>
              <div className="item-right">
                <span className="expense-amount">{e.amount.toFixed(2)} €</span>
                <div className="item-actions">
                  <button className="btn-small" onClick={() => setEditing(e)}>Izmeni</button>
                  <button className="btn-small btn-danger" onClick={() => setConfirmId(e.id)}>Obriši</button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        title="Brisanje troška"
        message="Da li si siguran da želiš da obrišeš ovaj trošak?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}