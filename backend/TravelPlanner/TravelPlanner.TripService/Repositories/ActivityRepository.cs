using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TravelPlanner.TripService.Data;
using TravelPlanner.TripService.Entities;

namespace TravelPlanner.TripService.Repositories
{
    public class ActivityRepository : IActivityRepository
    {
        private readonly TripsDbContext _context;

        public ActivityRepository(TripsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Activity>> GetByTripAsync(Guid tripId)
        {
            return await _context.Activities
                .AsNoTracking()
                .Where(a => a.TripId == tripId)
                .OrderBy(a => a.Date)
                .ThenBy(a => a.Time)
                .ToListAsync();
        }

        public async Task<Activity?> GetByIdAsync(Guid id)
        {
            return await _context.Activities.FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Activity> AddAsync(Activity activity)
        {
            _context.Activities.Add(activity);
            await _context.SaveChangesAsync();
            return activity;
        }

        public async Task UpdateAsync(Activity activity)
        {
            _context.Activities.Update(activity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Activity activity)
        {
            _context.Activities.Remove(activity);
            await _context.SaveChangesAsync();
        }
    }
}