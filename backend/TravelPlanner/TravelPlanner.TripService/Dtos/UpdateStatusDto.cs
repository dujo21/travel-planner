using System.ComponentModel.DataAnnotations;

namespace TravelPlanner.TripService.Dtos
{
    public class UpdateStatusDto
    {
        [Required(ErrorMessage = "Status je obavezan.")]
        public string Status { get; set; } = string.Empty;
    }
}