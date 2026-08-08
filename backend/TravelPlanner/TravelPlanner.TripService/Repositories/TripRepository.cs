using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TravelPlanner.TripService.Data;
using TravelPlanner.TripService.Entities;

namespace TravelPlanner.TripService.Repositories
{
    public class TripRepository : ITripRepository
    {
        private readonly TripsDbContext _context;

        public TripRepository(TripsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Trip>> GetAllByOwnerAsync(Guid ownerUserId)
        {
            return await _context.Trips
                .AsNoTracking()
                .Include(t => t.Destinations)
                .Include(t => t.Activities)
                .Where(t => t.OwnerUserId == ownerUserId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Trip>> GetAllAsync()
        {
            return await _context.Trips
                .AsNoTracking()
                .Include(t => t.Destinations)
                .Include(t => t.Activities)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<Trip?> GetByIdAsync(Guid id)
        {
            return await _context.Trips
                .Include(t => t.Destinations)
                .Include(t => t.Activities)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Trip> AddAsync(Trip trip)
        {
            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();
            return trip;
        }

        public async Task UpdateAsync(Trip trip)
        {
            _context.Trips.Update(trip);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Trip trip)
        {
            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.Trips.AnyAsync(t => t.Id == id);
        }
    }
}