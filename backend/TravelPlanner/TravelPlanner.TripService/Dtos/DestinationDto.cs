using System;

namespace TravelPlanner.TripService.Dtos
{
    public class DestinationDto
    {
        public Guid Id { get; set; }
        public Guid TripId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Location { get; set; }
        public DateTime ArrivalDate { get; set; }
        public DateTime DepartureDate { get; set; }
        public string? Description { get; set; }
    }
}