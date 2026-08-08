using System;

namespace TravelPlanner.TripService.Dtos
{
    public class TripDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal PlannedBudget { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public int DestinationCount { get; set; }
        public int ActivityCount { get; set; }
    }
}