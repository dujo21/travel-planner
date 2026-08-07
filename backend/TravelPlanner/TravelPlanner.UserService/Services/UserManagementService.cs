using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TravelPlanner.Common.Exceptions;
using TravelPlanner.UserService.Data;
using TravelPlanner.UserService.Dtos;
using TravelPlanner.UserService.Entities;

namespace TravelPlanner.UserService.Services
{
    public class UserManagementService : IUserManagementService
    {
        private readonly UsersDbContext _context;
        private readonly IMapper _mapper;

        public UserManagementService(UsersDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            var users = await _context.Users
                .AsNoTracking()
                .OrderBy(u => u.FullName)
                .ToListAsync();

            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<UserDto> GetByIdAsync(Guid id)
        {
            var user = await _context.Users.AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                throw new NotFoundException("Korisnik nije pronađen.");
            }

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> UpdateAsync(Guid id, UpdateUserDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                throw new NotFoundException("Korisnik nije pronađen.");
            }

            if (!Enum.TryParse<UserRole>(dto.Role, out var role))
            {
                throw new BadRequestException("Uloga mora biti User ili Admin.");
            }

            user.FullName = dto.FullName.Trim();
            user.Role = role;

            await _context.SaveChangesAsync();
            return _mapper.Map<UserDto>(user);
        }

        public async Task DeleteAsync(Guid id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                throw new NotFoundException("Korisnik nije pronađen.");
            }

            var adminCount = await _context.Users.CountAsync(u => u.Role == UserRole.Admin);
            if (user.Role == UserRole.Admin && adminCount <= 1)
            {
                throw new BadRequestException("Nije moguće obrisati poslednjeg administratora.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}