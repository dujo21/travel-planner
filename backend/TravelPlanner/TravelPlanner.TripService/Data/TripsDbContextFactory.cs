using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace TravelPlanner.TripService.Data
{
    public class TripsDbContextFactory : IDesignTimeDbContextFactory<TripsDbContext>
    {
        public TripsDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<TripsDbContext>();
            optionsBuilder.UseSqlServer(
                "Server=localhost\\SQLEXPRESS;Database=TravelPlanner_Trips;" +
                "Trusted_Connection=True;TrustServerCertificate=True;");

            return new TripsDbContext(optionsBuilder.Options);
        }
    }
}
