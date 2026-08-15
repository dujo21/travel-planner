using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanner.Contracts;

namespace TravelPlanner.TripService.Services
{
    public interface ISharingClient
    {
        Task<ShareToken> CreateShareAsync(Guid tripId, Guid ownerUserId, string accessType, int? expiryDays);
        Task<ShareToken?> ValidateTokenAsync(Guid token);
        Task<List<ShareToken>> GetSharesForTripAsync(Guid tripId);
        Task<bool> RevokeShareAsync(Guid token);
    }
}