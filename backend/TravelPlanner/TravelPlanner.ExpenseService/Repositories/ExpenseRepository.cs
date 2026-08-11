using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TravelPlanner.ExpenseService.Data;
using TravelPlanner.ExpenseService.Entities;

namespace TravelPlanner.ExpenseService.Repositories
{
    public class ExpenseRepository : IExpenseRepository
    {
        private readonly ExpensesDbContext _context;

        public ExpenseRepository(ExpensesDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Expense>> GetByTripAsync(Guid tripId)
        {
            return await _context.Expenses
                .AsNoTracking()
                .Where(e => e.TripId == tripId)
                .OrderByDescending(e => e.Date)
                .ToListAsync();
        }

        public async Task<Expense?> GetByIdAsync(Guid id)
        {
            return await _context.Expenses.FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Expense> AddAsync(Expense expense)
        {
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return expense;
        }

        public async Task UpdateAsync(Expense expense)
        {
            _context.Expenses.Update(expense);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Expense expense)
        {
            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
        }
    }
}