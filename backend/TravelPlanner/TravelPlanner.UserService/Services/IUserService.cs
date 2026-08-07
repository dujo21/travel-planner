using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanner.UserService.Dtos;

namespace TravelPlanner.UserService.Services
{
    public interface IUserManagementService
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto> GetByIdAsync(Guid id);
        Task<UserDto> UpdateAsync(Guid id, UpdateUserDto dto);
        Task DeleteAsync(Guid id);
    }
}