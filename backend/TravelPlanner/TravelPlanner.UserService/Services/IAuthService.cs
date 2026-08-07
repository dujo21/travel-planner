using System.Threading.Tasks;
using TravelPlanner.UserService.Dtos;

namespace TravelPlanner.UserService.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
    }
}