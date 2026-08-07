using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TravelPlanner.Common.Authentication;
using TravelPlanner.Common.Exceptions;
using TravelPlanner.UserService.Data;
using TravelPlanner.UserService.Dtos;
using TravelPlanner.UserService.Entities;

namespace TravelPlanner.UserService.Services
{
    public class AuthService : IAuthService
    {
        private readonly UsersDbContext _context;
        private readonly IMapper _mapper;
        private readonly JwtSettings _jwtSettings;

        public AuthService(UsersDbContext context, IMapper mapper, JwtSettings jwtSettings)
        {
            _context = context;
            _mapper = mapper;
            _jwtSettings = jwtSettings;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var email = dto.Email.Trim().ToLowerInvariant();

            var exists = await _context.Users.AnyAsync(u => u.Email == email);
            if (exists)
            {
                throw new ConflictException("Korisnik sa datom email adresom već postoji.");
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                FullName = dto.FullName.Trim(),
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return BuildAuthResponse(user);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var email = dto.Email.Trim().ToLowerInvariant();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                throw new UnauthorizedException("Pogrešan email ili lozinka.");
            }

            return BuildAuthResponse(user);
        }

        private AuthResponseDto BuildAuthResponse(User user)
        {
            var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: credentials);

            return new AuthResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresAt = expiresAt,
                User = _mapper.Map<UserDto>(user)
            };
        }
    }
}