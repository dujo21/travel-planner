using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanner.TripService.Dtos;

namespace TravelPlanner.TripService.Services
{
    public interface IActivityService
    {
        Task<IEnumerable<ActivityDto>> GetByTripAsync(Guid tripId, Guid userId, bool isAdmin);
        Task<ActivityDto> CreateAsync(Guid tripId, CreateActivityDto dto, Guid userId, bool isAdmin);
        Task<ActivityDto> UpdateAsync(Guid tripId, Guid id, UpdateActivityDto dto, Guid userId, bool isAdmin);
        Task<ActivityDto> UpdateStatusAsync(Guid tripId, Guid id, string status, Guid userId, bool isAdmin);
        Task DeleteAsync(Guid tripId, Guid id, Guid userId, bool isAdmin);
    }
}