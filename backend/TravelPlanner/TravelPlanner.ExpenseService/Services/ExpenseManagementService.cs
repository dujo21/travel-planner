using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using TravelPlanner.Common.Exceptions;
using TravelPlanner.ExpenseService.Dtos;
using TravelPlanner.ExpenseService.Entities;
using TravelPlanner.ExpenseService.Repositories;

namespace TravelPlanner.ExpenseService.Services
{
    public class ExpenseManagementService : IExpenseManagementService
    {
        private readonly IExpenseRepository _repository;
        private readonly IMapper _mapper;

        public ExpenseManagementService(IExpenseRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ExpenseDto>> GetByTripAsync(Guid tripId)
        {
            var expenses = await _repository.GetByTripAsync(tripId);
            return _mapper.Map<IEnumerable<ExpenseDto>>(expenses);
        }

        public async Task<ExpenseSummaryDto> GetSummaryAsync(Guid tripId)
        {
            var expenses = (await _repository.GetByTripAsync(tripId)).ToList();

            var summary = new ExpenseSummaryDto
            {
                TotalAmount = expenses.Sum(e => e.Amount),
                ExpenseCount = expenses.Count,
                ByCategory = expenses
                    .GroupBy(e => e.Category.ToString())
                    .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount))
            };

            return summary;
        }

        public async Task<ExpenseDto> CreateAsync(CreateExpenseDto dto, Guid userId)
        {
            var expense = _mapper.Map<Expense>(dto);
            expense.UserId = userId;
            expense.Category = ParseCategory(dto.Category);

            var created = await _repository.AddAsync(expense);
            return _mapper.Map<ExpenseDto>(created);
        }

        public async Task<ExpenseDto> UpdateAsync(Guid id, UpdateExpenseDto dto)
        {
            var expense = await _repository.GetByIdAsync(id);
            if (expense == null)
            {
                throw new NotFoundException("Trošak nije pronađen.");
            }

            expense.Name = dto.Name.Trim();
            expense.Category = ParseCategory(dto.Category);
            expense.Amount = dto.Amount;
            expense.Date = dto.Date;
            expense.Description = dto.Description?.Trim();

            await _repository.UpdateAsync(expense);
            return _mapper.Map<ExpenseDto>(expense);
        }

        public async Task DeleteAsync(Guid id)
        {
            var expense = await _repository.GetByIdAsync(id);
            if (expense == null)
            {
                throw new NotFoundException("Trošak nije pronađen.");
            }

            await _repository.DeleteAsync(expense);
        }

        public async Task DeleteAllForTripAsync(Guid tripId)
        {
            var expenses = await _repository.GetByTripAsync(tripId);
            foreach (var expense in expenses)
            {
                await _repository.DeleteAsync(expense);
            }
        }

        private static ExpenseCategory ParseCategory(string category)
        {
            if (!Enum.TryParse<ExpenseCategory>(category, out var parsed))
            {
                throw new BadRequestException(
                    "Kategorija mora biti Transport, Accommodation, Food, Tickets, Shopping ili Other.");
            }
            return parsed;
        }
    }
}