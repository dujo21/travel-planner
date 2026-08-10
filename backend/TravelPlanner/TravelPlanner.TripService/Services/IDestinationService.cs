using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanner.TripService.Dtos;

namespace TravelPlanner.TripService.Services
{
    public interface IDestinationService
    {
        Task<IEnumerable<DestinationDto>> GetByTripAsync(Guid tripId, Guid userId, bool isAdmin);
        Task<DestinationDto> CreateAsync(Guid tripId, CreateDestinationDto dto, Guid userId, bool isAdmin);
        Task<DestinationDto> UpdateAsync(Guid tripId, Guid id, UpdateDestinationDto dto, Guid userId, bool isAdmin);
        Task DeleteAsync(Guid tripId, Guid id, Guid userId, bool isAdmin);
    }
}