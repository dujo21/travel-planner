using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlanner.Common.Exceptions;
using TravelPlanner.TripService.Dtos;
using TravelPlanner.TripService.Services;

namespace TravelPlanner.TripService.Controllers
{
    [ApiController]
    [Route("api/trips")]
    [Authorize]
    public class TripsController : ControllerBase
    {
        private readonly ITripManagementService _tripService;

        public TripsController(ITripManagementService tripService)
        {
            _tripService = tripService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TripDto>>> GetAll()
        {
            var trips = await _tripService.GetTripsAsync(GetUserId(), IsAdmin());
            return Ok(trips);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TripDto>> GetById(Guid id)
        {
            var trip = await _tripService.GetTripByIdAsync(id, GetUserId(), IsAdmin());
            return Ok(trip);
        }

        [HttpPost]
        public async Task<ActionResult<TripDto>> Create([FromBody] CreateTripDto dto)
        {
            var trip = await _tripService.CreateTripAsync(dto, GetUserId());
            return CreatedAtAction(nameof(GetById), new { id = trip.Id }, trip);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<TripDto>> Update(Guid id, [FromBody] UpdateTripDto dto)
        {
            var trip = await _tripService.UpdateTripAsync(id, dto, GetUserId(), IsAdmin());
            return Ok(trip);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            await _tripService.DeleteTripAsync(id, GetUserId(), IsAdmin(), token);
            return NoContent();
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

        private bool IsAdmin()
        {
            return User.IsInRole("Admin");
        }
    }
}