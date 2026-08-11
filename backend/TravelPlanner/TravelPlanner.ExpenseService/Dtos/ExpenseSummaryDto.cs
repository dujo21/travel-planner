using System.Collections.Generic;

namespace TravelPlanner.ExpenseService.Dtos
{
    public class ExpenseSummaryDto
    {
        public decimal TotalAmount { get; set; }
        public Dictionary<string, decimal> ByCategory { get; set; } = new();
        public int ExpenseCount { get; set; }
    }
}