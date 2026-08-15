using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlanner.Common.Exceptions;
using TravelPlanner.Contracts;
using TravelPlanner.TripService.Dtos;
using TravelPlanner.TripService.Repositories;
using TravelPlanner.TripService.Services;

namespace TravelPlanner.TripService.Controllers
{
    [ApiController]
    [Route("api/trips/{tripId:guid}/shares")]
    [Authorize]
    public class SharesController : ControllerBase
    {
        private readonly ISharingClient _sharingClient;
        private readonly ITripRepository _tripRepo;

        public SharesController(ISharingClient sharingClient, ITripRepository tripRepo)
        {
            _sharingClient = sharingClient;
            _tripRepo = tripRepo;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShareToken>>> GetAll(Guid tripId)
        {
            await EnsureOwnership(tripId);
            var shares = await _sharingClient.GetSharesForTripAsync(tripId);
            return Ok(shares.Where(s => !s.IsRevoked));
        }

        [HttpPost]
        public async Task<ActionResult<ShareToken>> Create(Guid tripId, [FromBody] CreateShareDto dto)
        {
            await EnsureOwnership(tripId);
            var share = await _sharingClient.CreateShareAsync(
                tripId, GetUserId(), dto.AccessType, dto.ExpiryDays);
            return Ok(share);
        }

        [HttpDelete("{token:guid}")]
        public async Task<IActionResult> Revoke(Guid tripId, Guid token)
        {
            await EnsureOwnership(tripId);
            var success = await _sharingClient.RevokeShareAsync(token);
            if (!success)
            {
                throw new NotFoundException("Share token nije pronađen.");
            }
            return NoContent();
        }

        // Samo vlasnik plana (ili admin) sme da upravlja deljenjem.
        private async Task EnsureOwnership(Guid tripId)
        {
            var trip = await _tripRepo.GetByIdAsync(tripId);
            if (trip == null)
            {
                throw new NotFoundException("Plan putovanja nije pronađen.");
            }
            if (!IsAdmin() && trip.OwnerUserId != GetUserId())
            {
                throw new ForbiddenException("Nemate pravo da delite ovaj plan.");
            }
        }

        private Guid GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(claim, out var userId))
            {
                throw new UnauthorizedException("Neispravan token.");
            }
            return userId;
        }

        private bool IsAdmin() => User.IsInRole("Admin");
    }
}