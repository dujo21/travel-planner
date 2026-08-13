using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanner.TripService.Entities;

namespace TravelPlanner.TripService.Repositories
{
    public interface IChecklistRepository
    {
        Task<IEnumerable<ChecklistItem>> GetByTripAsync(Guid tripId);
        Task<ChecklistItem?> GetByIdAsync(Guid id);
        Task<ChecklistItem> AddAsync(ChecklistItem item);
        Task UpdateAsync(ChecklistItem item);
        Task DeleteAsync(ChecklistItem item);
        Task<int> CountByTripAsync(Guid tripId);
    }
}