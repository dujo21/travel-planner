using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanner.TripService.Entities;

namespace TravelPlanner.TripService.Repositories
{
    public interface IDestinationRepository
    {
        Task<IEnumerable<Destination>> GetByTripAsync(Guid tripId);
        Task<Destination?> GetByIdAsync(Guid id);
        Task<Destination> AddAsync(Destination destination);
        Task UpdateAsync(Destination destination);
        Task DeleteAsync(Destination destination);
    }
}