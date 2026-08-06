using System;
using System.Linq;
using TravelPlanner.UserService.Entities;

namespace TravelPlanner.UserService.Data
{
    public static class DbSeeder
    {
        public static void Seed(UsersDbContext context)
        {
            if (context.Users.Any())
            {
                return;
            }

            var admin = new User
            {
                Id = Guid.NewGuid(),
                FullName = "Administrator",
                Email = "admin@travelplanner.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Role = UserRole.Admin,
                CreatedAt = DateTime.UtcNow
            };

            var testUser = new User
            {
                Id = Guid.NewGuid(),
                FullName = "Test Korisnik",
                Email = "korisnik@travelplanner.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Korisnik123!"),
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow
            };

            context.Users.AddRange(admin, testUser);
            context.SaveChanges();
        }
    }
}