using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using TravelPlanner.Common.Exceptions;
using TravelPlanner.TripService.Dtos;
using TravelPlanner.TripService.Entities;
using TravelPlanner.TripService.Repositories;

namespace TravelPlanner.TripService.Services
{
    public class ActivityService : IActivityService
    {
        private readonly IActivityRepository _activityRepo;
        private readonly ITripRepository _tripRepo;
        private readonly IDestinationRepository _destinationRepo;
        private readonly IMapper _mapper;

        public ActivityService(
            IActivityRepository activityRepo,
            ITripRepository tripRepo,
            IDestinationRepository destinationRepo,
            IMapper mapper)
        {
            _activityRepo = activityRepo;
            _tripRepo = tripRepo;
            _destinationRepo = destinationRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ActivityDto>> GetByTripAsync(Guid tripId, Guid userId, bool isAdmin)
        {
            await EnsureTripAccess(tripId, userId, isAdmin);
            var activities = await _activityRepo.GetByTripAsync(tripId);
            return _mapper.Map<IEnumerable<ActivityDto>>(activities);
        }

        public async Task<ActivityDto> CreateAsync(Guid tripId, CreateActivityDto dto, Guid userId, bool isAdmin)
        {
            var trip = await EnsureTripAccess(tripId, userId, isAdmin);
            ValidateDateWithinTrip(dto.Date, trip);
            await EnsureWithinDestination(tripId, dto.Date);

            var activity = _mapper.Map<Activity>(dto);
            activity.TripId = tripId;
            activity.Status = ParseStatus(dto.Status);

            var created = await _activityRepo.AddAsync(activity);
            return _mapper.Map<ActivityDto>(created);
        }

        public async Task<ActivityDto> UpdateAsync(Guid tripId, Guid id, UpdateActivityDto dto, Guid userId, bool isAdmin)
        {
            var trip = await EnsureTripAccess(tripId, userId, isAdmin);

            var activity = await _activityRepo.GetByIdAsync(id);
            if (activity == null || activity.TripId != tripId)
            {
                throw new NotFoundException("Aktivnost nije pronađena.");
            }

            ValidateDateWithinTrip(dto.Date, trip);
            await EnsureWithinDestination(tripId, dto.Date);

            activity.Name = dto.Name.Trim();
            activity.DestinationId = dto.DestinationId;
            activity.Date = dto.Date;
            activity.Time = dto.Time;
            activity.Location = dto.Location?.Trim();
            activity.Latitude = dto.Latitude;
            activity.Longitude = dto.Longitude;
            activity.Description = dto.Description?.Trim();
            activity.EstimatedCost = dto.EstimatedCost;
            activity.Status = ParseStatus(dto.Status);

            await _activityRepo.UpdateAsync(activity);
            return _mapper.Map<ActivityDto>(activity);
        }

        public async Task<ActivityDto> UpdateStatusAsync(Guid tripId, Guid id, string status, Guid userId, bool isAdmin)
        {
            await EnsureTripAccess(tripId, userId, isAdmin);

            var activity = await _activityRepo.GetByIdAsync(id);
            if (activity == null || activity.TripId != tripId)
            {
                throw new NotFoundException("Aktivnost nije pronađena.");
            }

            activity.Status = ParseStatus(status);
            await _activityRepo.UpdateAsync(activity);
            return _mapper.Map<ActivityDto>(activity);
        }

        public async Task DeleteAsync(Guid tripId, Guid id, Guid userId, bool isAdmin)
        {
            await EnsureTripAccess(tripId, userId, isAdmin);

            var activity = await _activityRepo.GetByIdAsync(id);
            if (activity == null || activity.TripId != tripId)
            {
                throw new NotFoundException("Aktivnost nije pronađena.");
            }

            await _activityRepo.DeleteAsync(activity);
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

        private static void ValidateDateWithinTrip(DateTime date, Trip trip)
        {
            if (date < trip.StartDate || date > trip.EndDate)
            {
                throw new BadRequestException("Datum aktivnosti mora biti unutar trajanja putovanja.");
            }
        }

        private async Task EnsureWithinDestination(Guid tripId, DateTime date)
        {
            var destinations = await _destinationRepo.GetByTripAsync(tripId);

            if (!destinations.Any())
            {
                return;
            }

            bool withinAny = destinations.Any(d =>
                date >= d.ArrivalDate && date <= d.DepartureDate);

            if (!withinAny)
            {
                throw new BadRequestException(
                    "Datum aktivnosti mora biti unutar perioda neke destinacije ovog putovanja.");
            }
        }

        private static ActivityStatus ParseStatus(string status)
        {
            if (!Enum.TryParse<ActivityStatus>(status, out var parsed))
            {
                throw new BadRequestException("Status mora biti Planned, Booked, Completed ili Cancelled.");
            }
            return parsed;
        }
    }
}