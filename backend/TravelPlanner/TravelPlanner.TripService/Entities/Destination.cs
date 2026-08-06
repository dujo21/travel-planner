using System.Diagnostics;

namespace TravelPlanner.TripService.Entities
{
    public class Destination
    {
        public Guid Id { get; set; }
        public Guid TripId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Location { get; set; }
        public DateTime ArrivalDate { get; set; }
        public DateTime DepartureDate { get; set; }
        public string? Description { get; set; }

        public Trip Trip { get; set; } = null!;
        public ICollection<Activity> Activities { get; set; } = new List<Activity>();
    }
}
