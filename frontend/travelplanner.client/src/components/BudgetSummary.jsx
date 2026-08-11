import { EXPENSE_CATEGORIES } from '../models/Expense';

export default function BudgetSummary({ summary, plannedBudget }) {
  const total = summary?.totalAmount ?? 0;
  const budget = plannedBudget ?? 0;
  const remaining = budget - total;
  const percent = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
  const overBudget = total > budget && budget > 0;

  return (
    <div className="budget-summary">
      <div className="budget-numbers">
        <div>
          <span className="budget-label">Potrošeno</span>
          <span className="budget-value">{total.toFixed(2)} €</span>
        </div>
        <div>
          <span className="budget-label">Budžet</span>
          <span className="budget-value">{budget.toFixed(2)} €</span>
        </div>
        <div>
          <span className="budget-label">{remaining >= 0 ? 'Preostalo' : 'Prekoračeno'}</span>
          <span className={remaining >= 0 ? 'budget-value' : 'budget-value over'}>
            {Math.abs(remaining).toFixed(2)} €
          </span>
        </div>
      </div>

      <div className="budget-bar">
        <div
          className={overBudget ? 'budget-fill over' : 'budget-fill'}
          style={{ width: `${percent}%` }}
        />
      </div>

      {overBudget && (
        <div className="alert alert-error">
          Prekoračili ste budžet za {(total - budget).toFixed(2)} €!
        </div>
      )}

      {summary?.byCategory && Object.keys(summary.byCategory).length > 0 && (
        <div className="category-breakdown">
          <h4>Po kategorijama</h4>
          {Object.entries(summary.byCategory).map(([cat, amount]) => {
            const info = EXPENSE_CATEGORIES.find((c) => c.value === cat);
            return (
              <div key={cat} className="category-row">
                <span className="category-dot" style={{ backgroundColor: info?.color ?? '#6b7280' }} />
                <span className="category-name">{info?.label ?? cat}</span>
                <span className="category-amount">{amount.toFixed(2)} €</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}