using System.ComponentModel.DataAnnotations;

namespace TravelPlanner.TripService.Dtos
{
    public class CreateChecklistItemDto
    {
        [Required(ErrorMessage = "Naslov stavke je obavezan.")]
        [StringLength(200, MinimumLength = 1)]
        public string Title { get; set; } = string.Empty;
    }
}