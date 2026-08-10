using System;
using System.ComponentModel.DataAnnotations;

namespace TravelPlanner.TripService.Dtos
{
    public class CreateDestinationDto
    {
        [Required(ErrorMessage = "Naziv destinacije je obavezan.")]
        [StringLength(150, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [StringLength(250)]
        public string? Location { get; set; }

        [Required(ErrorMessage = "Datum dolaska je obavezan.")]
        public DateTime ArrivalDate { get; set; }

        [Required(ErrorMessage = "Datum odlaska je obavezan.")]
        public DateTime DepartureDate { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }
    }
}