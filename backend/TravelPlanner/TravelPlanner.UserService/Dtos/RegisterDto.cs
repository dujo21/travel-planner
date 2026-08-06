using System.ComponentModel.DataAnnotations;

namespace TravelPlanner.UserService.Dtos
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Ime i prezime je obavezno.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Ime i prezime mora imati između 2 i 100 karaktera.")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email je obavezan.")]
        [EmailAddress(ErrorMessage = "Email nije u ispravnom formatu.")]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Lozinka je obavezna.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Lozinka mora imati najmanje 6 karaktera.")]
        public string Password { get; set; } = string.Empty;
    }
}