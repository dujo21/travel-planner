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
    public class DestinationService : IDestinationService
    {
        private readonly IDestinationRepository _destinationRepo;
        private readonly ITripRepository _tripRepo;
        private readonly IMapper _mapper;

        public DestinationService(
            IDestinationRepository destinationRepo,
            ITripRepository tripRepo,
            IMapper mapper)
        {
            _destinationRepo = destinationRepo;
            _tripRepo = tripRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DestinationDto>> GetByTripAsync(Guid tripId, Guid userId, bool isAdmin)
        {
            await EnsureTripAccess(tripId, userId, isAdmin);
            var destinations = await _destinationRepo.GetByTripAsync(tripId);
            return _mapper.Map<IEnumerable<DestinationDto>>(destinations);
        }

        public async Task<DestinationDto> CreateAsync(Guid tripId, CreateDestinationDto dto, Guid userId, bool isAdmin)
        {
            var trip = await EnsureTripAccess(tripId, userId, isAdmin);
            ValidateDatesWithinTrip(dto.ArrivalDate, dto.DepartureDate, trip);

            var destination = _mapper.Map<Destination>(dto);
            destination.TripId = tripId;

            var created = await _destinationRepo.AddAsync(destination);
            return _mapper.Map<DestinationDto>(created);
        }

        public async Task<DestinationDto> UpdateAsync(Guid tripId, Guid id, UpdateDestinationDto dto, Guid userId, bool isAdmin)
        {
            var trip = await EnsureTripAccess(tripId, userId, isAdmin);

            var destination = await _destinationRepo.GetByIdAsync(id);
            if (destination == null || destination.TripId != tripId)
            {
                throw new NotFoundException("Destinacija nije pronađena.");
            }

            ValidateDatesWithinTrip(dto.ArrivalDate, dto.DepartureDate, trip);

            destination.Name = dto.Name.Trim();
            destination.Location = dto.Location?.Trim();
            destination.ArrivalDate = dto.ArrivalDate;
            destination.DepartureDate = dto.DepartureDate;
            destination.Description = dto.Description?.Trim();

            await _destinationRepo.UpdateAsync(destination);
            return _mapper.Map<DestinationDto>(destination);
        }

        public async Task DeleteAsync(Guid tripId, Guid id, Guid userId, bool isAdmin)
        {
            await EnsureTripAccess(tripId, userId, isAdmin);

            var destination = await _destinationRepo.GetByIdAsync(id);
            if (destination == null || destination.TripId != tripId)
            {
                throw new NotFoundException("Destinacija nije pronađena.");
            }

            await _destinationRepo.DeleteAsync(destination);
        }

        // Proverava da plan postoji i da korisnik sme da mu pristupi.
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

        private static void ValidateDatesWithinTrip(DateTime arrival, DateTime departure, Trip trip)
        {
            if (departure < arrival)
            {
                throw new BadRequestException("Datum odlaska ne može biti pre datuma dolaska.");
            }
            if (arrival < trip.StartDate || departure > trip.EndDate)
            {
                throw new BadRequestException("Datumi destinacije moraju biti unutar trajanja putovanja.");
            }
        }
    }
}