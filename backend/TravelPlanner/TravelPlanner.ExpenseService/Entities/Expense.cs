using System;

namespace TravelPlanner.ExpenseService.Entities
{
    public class Expense
    {
        public Guid Id { get; set; }
        public Guid TripId { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public ExpenseCategory Category { get; set; } = ExpenseCategory.Other;
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}