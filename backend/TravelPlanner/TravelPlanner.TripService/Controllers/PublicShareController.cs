using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlanner.Common.Exceptions;
using TravelPlanner.TripService.Services;

namespace TravelPlanner.TripService.Controllers
{
    [ApiController]
    [Route("api/shared")]
    [AllowAnonymous]
    public class PublicShareController : ControllerBase
    {
        private readonly ISharingClient _sharingClient;
        private readonly ITripManagementService _tripService;

        public PublicShareController(ISharingClient sharingClient, ITripManagementService tripService)
        {
            _sharingClient = sharingClient;
            _tripService = tripService;
        }

        // Vraca plan + nivo pristupa na osnovu share tokena. Bez prijave.
        [HttpGet("{token:guid}")]
        public async Task<IActionResult> GetSharedTrip(Guid token)
        {
            var share = await _sharingClient.ValidateTokenAsync(token);
            if (share == null)
            {
                throw new NotFoundException("Link za deljenje je nevažeći ili je istekao.");
            }

            var trip = await _tripService.GetTripByIdAsync(
                share.TripId, share.OwnerUserId, isAdmin: true);

            return Ok(new
            {
                trip,
                accessType = share.AccessType
            });
        }
    }
}