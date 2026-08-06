using System.ComponentModel.DataAnnotations;

namespace TravelPlanner.UserService.Dtos
{
    public class UpdateUserDto
    {
        [Required(ErrorMessage = "Ime i prezime je obavezno.")]
        [StringLength(100, MinimumLength = 2)]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Uloga je obavezna.")]
        [RegularExpression("^(User|Admin)$", ErrorMessage = "Uloga mora biti User ili Admin.")]
        public string Role { get; set; } = string.Empty;
    }
}