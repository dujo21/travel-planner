using System;

namespace TravelPlanner.TripService.Dtos
{
    public class ActivityDto
    {
        public Guid Id { get; set; }
        public Guid TripId { get; set; }
        public Guid? DestinationId { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public TimeSpan? Time { get; set; }
        public string? Location { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? Description { get; set; }
        public decimal EstimatedCost { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}