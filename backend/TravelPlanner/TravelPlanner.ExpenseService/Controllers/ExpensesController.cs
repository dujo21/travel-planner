using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlanner.Common.Exceptions;
using TravelPlanner.ExpenseService.Dtos;
using TravelPlanner.ExpenseService.Services;

namespace TravelPlanner.ExpenseService.Controllers
{
    [ApiController]
    [Route("api/trips/{tripId:guid}/expenses")]
    [Authorize]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseManagementService _service;

        public ExpensesController(IExpenseManagementService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetAll(Guid tripId)
        {
            var result = await _service.GetByTripAsync(tripId);
            return Ok(result);
        }

        [HttpGet("summary")]
        public async Task<ActionResult<ExpenseSummaryDto>> GetSummary(Guid tripId)
        {
            var result = await _service.GetSummaryAsync(tripId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ExpenseDto>> Create(Guid tripId, [FromBody] CreateExpenseDto dto)
        {
            dto.TripId = tripId;
            var created = await _service.CreateAsync(dto, GetUserId());
            return CreatedAtAction(nameof(GetAll), new { tripId }, created);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ExpenseDto>> Update(Guid tripId, Guid id, [FromBody] UpdateExpenseDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid tripId, Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

        [HttpDelete("~/api/trips/{tripId:guid}/expenses/all")]
        public async Task<IActionResult> DeleteAllForTrip(Guid tripId)
        {
            await _service.DeleteAllForTripAsync(tripId);
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
    }
}