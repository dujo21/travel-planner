using System;

namespace TravelPlanner.TripService.Dtos
{
    public class ChecklistItemDto
    {
        public Guid Id { get; set; }
        public Guid TripId { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public int SortOrder { get; set; }
    }
}