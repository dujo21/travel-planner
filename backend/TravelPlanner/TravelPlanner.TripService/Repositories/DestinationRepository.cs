using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TravelPlanner.TripService.Data;
using TravelPlanner.TripService.Entities;

namespace TravelPlanner.TripService.Repositories
{
    public class DestinationRepository : IDestinationRepository
    {
        private readonly TripsDbContext _context;

        public DestinationRepository(TripsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Destination>> GetByTripAsync(Guid tripId)
        {
            return await _context.Destinations
                .AsNoTracking()
                .Where(d => d.TripId == tripId)
                .OrderBy(d => d.ArrivalDate)
                .ToListAsync();
        }

        public async Task<Destination?> GetByIdAsync(Guid id)
        {
            return await _context.Destinations.FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<Destination> AddAsync(Destination destination)
        {
            _context.Destinations.Add(destination);
            await _context.SaveChangesAsync();
            return destination;
        }

        public async Task UpdateAsync(Destination destination)
        {
            _context.Destinations.Update(destination);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Destination destination)
        {
            _context.Destinations.Remove(destination);
            await _context.SaveChangesAsync();
        }
    }
}