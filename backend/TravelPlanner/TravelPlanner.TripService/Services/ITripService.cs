using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanner.TripService.Dtos;

namespace TravelPlanner.TripService.Services
{
    public interface ITripManagementService
    {
        Task<IEnumerable<TripDto>> GetTripsAsync(Guid userId, bool isAdmin);
        Task<TripDto> GetTripByIdAsync(Guid id, Guid userId, bool isAdmin);
        Task<TripDto> CreateTripAsync(CreateTripDto dto, Guid userId);
        Task<TripDto> UpdateTripAsync(Guid id, UpdateTripDto dto, Guid userId, bool isAdmin);
        Task DeleteTripAsync(Guid id, Guid userId, bool isAdmin);
    }
}