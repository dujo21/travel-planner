using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using TravelPlanner.Common.Exceptions;
using TravelPlanner.TripService.Dtos;
using TravelPlanner.TripService.Entities;
using TravelPlanner.TripService.Repositories;

namespace TravelPlanner.TripService.Services
{
    public class ChecklistService : IChecklistService
    {
        private readonly IChecklistRepository _checklistRepo;
        private readonly ITripRepository _tripRepo;
        private readonly IMapper _mapper;

        public ChecklistService(
            IChecklistRepository checklistRepo,
            ITripRepository tripRepo,
            IMapper mapper)
        {
            _checklistRepo = checklistRepo;
            _tripRepo = tripRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ChecklistItemDto>> GetByTripAsync(Guid tripId, Guid userId, bool isAdmin)
        {
            await EnsureTripAccess(tripId, userId, isAdmin);
            var items = await _checklistRepo.GetByTripAsync(tripId);
            return _mapper.Map<IEnumerable<ChecklistItemDto>>(items);
        }

        public async Task<ChecklistItemDto> CreateAsync(Guid tripId, CreateChecklistItemDto dto, Guid userId, bool isAdmin)
        {
            await EnsureTripAccess(tripId, userId, isAdmin);

            var count = await _checklistRepo.CountByTripAsync(tripId);
            var item = new ChecklistItem
            {
                Id = Guid.NewGuid(),
                TripId = tripId,
                Title = dto.Title.Trim(),
                IsCompleted = false,
                SortOrder = count
            };

            var created = await _checklistRepo.AddAsync(item);
            return _mapper.Map<ChecklistItemDto>(created);
        }

        public async Task<ChecklistItemDto> ToggleAsync(Guid tripId, Guid id, Guid userId, bool isAdmin)
        {
            await EnsureTripAccess(tripId, userId, isAdmin);

            var item = await _checklistRepo.GetByIdAsync(id);
            if (item == null || item.TripId != tripId)
            {
                throw new NotFoundException("Stavka nije pronađena.");
            }

            item.IsCompleted = !item.IsCompleted;
            await _checklistRepo.UpdateAsync(item);
            return _mapper.Map<ChecklistItemDto>(item);
        }

        public async Task DeleteAsync(Guid tripId, Guid id, Guid userId, bool isAdmin)
        {
            await EnsureTripAccess(tripId, userId, isAdmin);

            var item = await _checklistRepo.GetByIdAsync(id);
            if (item == null || item.TripId != tripId)
            {
                throw new NotFoundException("Stavka nije pronađena.");
            }

            await _checklistRepo.DeleteAsync(item);
        }

        private async Task<Trip> EnsureTripAccess(Guid tripId, Guid userId, bool isAdmin)
        {
            var trip = await _tripRepo.GetByIdAsync(tripId);
            if (trip == null)
            {
                throw new NotFoundException("Plan putovanja nije pronađen.");
            }
            if (!isAdmin && trip.OwnerUserId != userId)
            {
                throw new ForbiddenException("Nemate pravo pristupa ovom planu putovanja.");
            }
            return trip;
        }
    }
}