using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanner.ExpenseService.Dtos;

namespace TravelPlanner.ExpenseService.Services
{
    public interface IExpenseManagementService
    {
        Task<IEnumerable<ExpenseDto>> GetByTripAsync(Guid tripId);
        Task<ExpenseSummaryDto> GetSummaryAsync(Guid tripId);
        Task<ExpenseDto> CreateAsync(CreateExpenseDto dto, Guid userId);
        Task<ExpenseDto> UpdateAsync(Guid id, UpdateExpenseDto dto);
        Task DeleteAsync(Guid id);
    }
}