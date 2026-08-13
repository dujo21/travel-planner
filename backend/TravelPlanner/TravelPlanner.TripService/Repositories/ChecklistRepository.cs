using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TravelPlanner.TripService.Data;
using TravelPlanner.TripService.Entities;

namespace TravelPlanner.TripService.Repositories
{
    public class ChecklistRepository : IChecklistRepository
    {
        private readonly TripsDbContext _context;

        public ChecklistRepository(TripsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ChecklistItem>> GetByTripAsync(Guid tripId)
        {
            return await _context.ChecklistItems
                .AsNoTracking()
                .Where(c => c.TripId == tripId)
                .OrderBy(c => c.SortOrder)
                .ToListAsync();
        }

        public async Task<ChecklistItem?> GetByIdAsync(Guid id)
        {
            return await _context.ChecklistItems.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<ChecklistItem> AddAsync(ChecklistItem item)
        {
            _context.ChecklistItems.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task UpdateAsync(ChecklistItem item)
        {
            _context.ChecklistItems.Update(item);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(ChecklistItem item)
        {
            _context.ChecklistItems.Remove(item);
            await _context.SaveChangesAsync();
        }

        public async Task<int> CountByTripAsync(Guid tripId)
        {
            return await _context.ChecklistItems.CountAsync(c => c.TripId == tripId);
        }
    }
}