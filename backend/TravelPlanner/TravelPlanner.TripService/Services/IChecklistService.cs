using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanner.TripService.Dtos;

namespace TravelPlanner.TripService.Services
{
    public interface IChecklistService
    {
        Task<IEnumerable<ChecklistItemDto>> GetByTripAsync(Guid tripId, Guid userId, bool isAdmin);
        Task<ChecklistItemDto> CreateAsync(Guid tripId, CreateChecklistItemDto dto, Guid userId, bool isAdmin);
        Task<ChecklistItemDto> ToggleAsync(Guid tripId, Guid id, Guid userId, bool isAdmin);
        Task DeleteAsync(Guid tripId, Guid id, Guid userId, bool isAdmin);
    }
}