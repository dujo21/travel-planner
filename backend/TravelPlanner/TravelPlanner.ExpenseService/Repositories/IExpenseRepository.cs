using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanner.ExpenseService.Entities;

namespace TravelPlanner.ExpenseService.Repositories
{
    public interface IExpenseRepository
    {
        Task<IEnumerable<Expense>> GetByTripAsync(Guid tripId);
        Task<Expense?> GetByIdAsync(Guid id);
        Task<Expense> AddAsync(Expense expense);
        Task UpdateAsync(Expense expense);
        Task DeleteAsync(Expense expense);
    }
}