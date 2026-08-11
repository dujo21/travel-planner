using System;
using System.ComponentModel.DataAnnotations;

namespace TravelPlanner.TripService.Dtos
{
    public class UpdateActivityDto
    {
        [Required(ErrorMessage = "Naziv aktivnosti je obavezan.")]
        [StringLength(150, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        public Guid? DestinationId { get; set; }

        [Required(ErrorMessage = "Datum je obavezan.")]
        public DateTime Date { get; set; }

        public TimeSpan? Time { get; set; }

        [StringLength(250)]
        public string? Location { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Procenjeni trošak ne može biti negativan.")]
        public decimal EstimatedCost { get; set; }

        [Required(ErrorMessage = "Status je obavezan.")]
        public string Status { get; set; } = "Planned";
    }
}