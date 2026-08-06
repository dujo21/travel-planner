using Microsoft.EntityFrameworkCore;
using TravelPlanner.ExpenseService.Entities;

namespace TravelPlanner.ExpenseService.Data
{
    public class ExpensesDbContext : DbContext
    {
        public ExpensesDbContext(DbContextOptions<ExpensesDbContext> options) : base(options) { }

        public DbSet<Expense> Expenses => Set<Expense>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Expense>(e =>
            {
                e.HasKey(x => x.Id);

                e.Property(x => x.Name).IsRequired().HasMaxLength(150);
                e.Property(x => x.Description).HasMaxLength(1000);
                e.Property(x => x.Amount).HasColumnType("decimal(18,2)");
                e.Property(x => x.Category).HasConversion<int>();

                e.HasIndex(x => x.TripId);
                e.HasIndex(x => new { x.TripId, x.Category });
            });
        }
    }
}