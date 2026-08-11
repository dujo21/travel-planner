using System;
using System.ComponentModel.DataAnnotations;

namespace TravelPlanner.ExpenseService.Dtos
{
    public class CreateExpenseDto
    {
        [Required(ErrorMessage = "Plan putovanja je obavezan.")]
        public Guid TripId { get; set; }

        [Required(ErrorMessage = "Naziv troška je obavezan.")]
        [StringLength(150, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Kategorija je obavezna.")]
        public string Category { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "Iznos mora biti veći od nule.")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Datum je obavezan.")]
        public DateTime Date { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }
    }
}