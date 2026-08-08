using System;
using System.ComponentModel.DataAnnotations;

namespace TravelPlanner.TripService.Dtos
{
    public class UpdateTripDto
    {
        [Required(ErrorMessage = "Naziv putovanja je obavezan.")]
        [StringLength(150, MinimumLength = 2, ErrorMessage = "Naziv mora imati između 2 i 150 karaktera.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Datum početka je obavezan.")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "Datum završetka je obavezan.")]
        public DateTime EndDate { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Budžet ne može biti negativan.")]
        public decimal PlannedBudget { get; set; }

        [StringLength(2000)]
        public string? Notes { get; set; }
    }
}