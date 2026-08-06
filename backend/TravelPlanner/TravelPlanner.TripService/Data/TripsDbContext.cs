using Microsoft.EntityFrameworkCore;
using TravelPlanner.TripService.Entities;

namespace TravelPlanner.TripService.Data
{
    public class TripsDbContext : DbContext
    {
        public TripsDbContext(DbContextOptions<TripsDbContext> options) : base(options) { }

        public DbSet<Trip> Trips => Set<Trip>();
        public DbSet<Destination> Destinations => Set<Destination>();
        public DbSet<Activity> Activities => Set<Activity>();
        public DbSet<ChecklistItem> ChecklistItems => Set<ChecklistItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Trip>(e =>
            {
                e.HasKey(t => t.Id);
                e.Property(t => t.Name).IsRequired().HasMaxLength(150);
                e.Property(t => t.Description).HasMaxLength(1000);
                e.Property(t => t.Notes).HasMaxLength(2000);
                e.Property(t => t.PlannedBudget).HasColumnType("decimal(18,2)");
                e.HasIndex(t => t.OwnerUserId);
            });

            modelBuilder.Entity<Destination>(e =>
            {
                e.HasKey(d => d.Id);
                e.Property(d => d.Name).IsRequired().HasMaxLength(150);
                e.Property(d => d.Location).HasMaxLength(250);
                e.Property(d => d.Description).HasMaxLength(1000);

                e.HasOne(d => d.Trip)
                 .WithMany(t => t.Destinations)
                 .HasForeignKey(d => d.TripId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Activity>(e =>
            {
                e.HasKey(a => a.Id);
                e.Property(a => a.Name).IsRequired().HasMaxLength(150);
                e.Property(a => a.Location).HasMaxLength(250);
                e.Property(a => a.Description).HasMaxLength(1000);
                e.Property(a => a.EstimatedCost).HasColumnType("decimal(18,2)");
                e.Property(a => a.Status).HasConversion<int>();

                e.HasOne(a => a.Trip)
                 .WithMany(t => t.Activities)
                 .HasForeignKey(a => a.TripId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(a => a.Destination)
                 .WithMany(d => d.Activities)
                 .HasForeignKey(a => a.DestinationId)
                 .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<ChecklistItem>(e =>
            {
                e.HasKey(c => c.Id);
                e.Property(c => c.Title).IsRequired().HasMaxLength(200);

                e.HasOne(c => c.Trip)
                 .WithMany(t => t.ChecklistItems)
                 .HasForeignKey(c => c.TripId)
                 .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
