namespace TravelPlanner.TripService.Entities
{
    public class ChecklistItem
    {
        public Guid Id { get; set; }
        public Guid TripId { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public int SortOrder { get; set; }

        public Trip Trip { get; set; } = null!;
    }
}
