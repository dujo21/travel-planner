using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace TravelPlanner.ExpenseService.Data
{
    public class ExpensesDbContextFactory : IDesignTimeDbContextFactory<ExpensesDbContext>
    {
        public ExpensesDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ExpensesDbContext>();
            optionsBuilder.UseSqlServer(
                "Server=localhost\\SQLEXPRESS;Database=TravelPlanner_Expenses;" +
                "Trusted_Connection=True;TrustServerCertificate=True;");

            return new ExpensesDbContext(optionsBuilder.Options);
        }
    }
}