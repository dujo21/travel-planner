using System.ComponentModel.DataAnnotations;

namespace TravelPlanner.TripService.Dtos
{
    public class CreateShareDto
    {
        [Required(ErrorMessage = "Tip pristupa je obavezan.")]
        [RegularExpression("^(VIEW|EDIT)$", ErrorMessage = "Tip pristupa mora biti VIEW ili EDIT.")]
        public string AccessType { get; set; } = "VIEW";

        public int? ExpiryDays { get; set; }
    }
}