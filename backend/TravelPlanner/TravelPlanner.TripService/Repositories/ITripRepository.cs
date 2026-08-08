using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanner.TripService.Entities;

namespace TravelPlanner.TripService.Repositories
{
    public interface ITripRepository
    {
        Task<IEnumerable<Trip>> GetAllByOwnerAsync(Guid ownerUserId);
        Task<IEnumerable<Trip>> GetAllAsync();
        Task<Trip?> GetByIdAsync(Guid id);
        Task<Trip> AddAsync(Trip trip);
        Task UpdateAsync(Trip trip);
        Task DeleteAsync(Trip trip);
        Task<bool> ExistsAsync(Guid id);
    }
}