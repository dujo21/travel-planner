using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using TravelPlanner.Common.Exceptions;
using TravelPlanner.TripService.Dtos;
using TravelPlanner.TripService.Entities;
using TravelPlanner.TripService.Repositories;
using TravelPlanner.TripService.Services;

namespace TravelPlanner.TripService.Services
{
    public class TripManagementService : ITripManagementService
    {
        private readonly ITripRepository _repository;
        private readonly IMapper _mapper;
        private readonly IExpenseClient _expenseClient;
        private readonly ISharingClient _sharingClient;

        public TripManagementService(
            ITripRepository repository,
            IMapper mapper,
            IExpenseClient expenseClient,
            ISharingClient sharingClient)
        {
            _repository = repository;
            _mapper = mapper;
            _expenseClient = expenseClient;
            _sharingClient = sharingClient;
        }

        public async Task<IEnumerable<TripDto>> GetTripsAsync(Guid userId, bool isAdmin)
        {
            var trips = isAdmin
                ? await _repository.GetAllAsync()
                : await _repository.GetAllByOwnerAsync(userId);

            return _mapper.Map<IEnumerable<TripDto>>(trips);
        }

        public async Task<TripDto> GetTripByIdAsync(Guid id, Guid userId, bool isAdmin)
        {
            var trip = await _repository.GetByIdAsync(id);

            if (trip == null)
            {
                throw new NotFoundException("Plan putovanja nije pronađen.");
            }

            EnsureOwnership(trip, userId, isAdmin);
            return _mapper.Map<TripDto>(trip);
        }

        public async Task<TripDto> CreateTripAsync(CreateTripDto dto, Guid userId)
        {
            ValidateDates(dto.StartDate, dto.EndDate);

            var trip = _mapper.Map<Trip>(dto);
            trip.OwnerUserId = userId;

            var created = await _repository.AddAsync(trip);
            return _mapper.Map<TripDto>(created);
        }

        public async Task<TripDto> UpdateTripAsync(Guid id, UpdateTripDto dto, Guid userId, bool isAdmin)
        {
            var trip = await _repository.GetByIdAsync(id);

            if (trip == null)
            {
                throw new NotFoundException("Plan putovanja nije pronađen.");
            }

            EnsureOwnership(trip, userId, isAdmin);
            ValidateDates(dto.StartDate, dto.EndDate);

            trip.Name = dto.Name.Trim();
            trip.Description = dto.Description?.Trim();
            trip.StartDate = dto.StartDate;
            trip.EndDate = dto.EndDate;
            trip.PlannedBudget = dto.PlannedBudget;
            trip.Notes = dto.Notes?.Trim();

            await _repository.UpdateAsync(trip);
            return _mapper.Map<TripDto>(trip);
        }

        public async Task DeleteTripAsync(Guid id, Guid userId, bool isAdmin, string authToken)
        {
            var trip = await _repository.GetByIdAsync(id);
            if (trip == null)
            {
                throw new NotFoundException("Plan putovanja nije pronađen.");
            }

            EnsureOwnership(trip, userId, isAdmin);

            // 1. Obrisi troskove u ExpenseService-u (druga baza, HTTP poziv).
            await _expenseClient.DeleteAllForTripAsync(id, authToken);

            // 2. Opozovi sve share tokene ovog plana (stateful servis, remoting).
            var shares = await _sharingClient.GetSharesForTripAsync(id);
            foreach (var share in shares)
            {
                await _sharingClient.RevokeShareAsync(share.Token);
            }

            // 3. Obrisi plan - EF kaskadno brise destinacije, aktivnosti, checklist.
            await _repository.DeleteAsync(trip);
        }

        private static void EnsureOwnership(Trip trip, Guid userId, bool isAdmin)
        {
            if (!isAdmin && trip.OwnerUserId != userId)
            {
                throw new ForbiddenException("Nemate pravo pristupa ovom planu putovanja.");
            }
        }

        private static void ValidateDates(DateTime start, DateTime end)
        {
            if (end < start)
            {
                throw new BadRequestException("Datum završetka ne može biti pre datuma početka.");
            }
        }
    }
}