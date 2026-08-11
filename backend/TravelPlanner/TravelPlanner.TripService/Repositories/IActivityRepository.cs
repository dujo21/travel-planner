using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanner.TripService.Entities;

namespace TravelPlanner.TripService.Repositories
{
    public interface IActivityRepository
    {
        Task<IEnumerable<Activity>> GetByTripAsync(Guid tripId);
        Task<Activity?> GetByIdAsync(Guid id);
        Task<Activity> AddAsync(Activity activity);
        Task UpdateAsync(Activity activity);
        Task DeleteAsync(Activity activity);
    }
}