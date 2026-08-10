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
    [Route("api/trips/{tripId:guid}/destinations")]
    [Authorize]
    public class DestinationsController : ControllerBase
    {
        private readonly IDestinationService _service;

        public DestinationsController(IDestinationService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DestinationDto>>> GetAll(Guid tripId)
        {
            var result = await _service.GetByTripAsync(tripId, GetUserId(), IsAdmin());
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<DestinationDto>> Create(Guid tripId, [FromBody] CreateDestinationDto dto)
        {
            var created = await _service.CreateAsync(tripId, dto, GetUserId(), IsAdmin());
            return CreatedAtAction(nameof(GetAll), new { tripId }, created);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<DestinationDto>> Update(Guid tripId, Guid id, [FromBody] UpdateDestinationDto dto)
        {
            var updated = await _service.UpdateAsync(tripId, id, dto, GetUserId(), IsAdmin());
            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid tripId, Guid id)
        {
            await _service.DeleteAsync(tripId, id, GetUserId(), IsAdmin());
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

        private bool IsAdmin() => User.IsInRole("Admin");
    }
}