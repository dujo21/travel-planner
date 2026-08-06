using AutoMapper;
using TravelPlanner.UserService.Dtos;
using TravelPlanner.UserService.Entities;
using System;

namespace TravelPlanner.UserService.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>()
                .MaxDepth(10)
                .ForMember(dest => dest.Role,
                           opt => opt.MapFrom(src => src.Role.ToString()));

            CreateMap<RegisterDto, User>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.Role, opt => opt.MapFrom(_ => UserRole.User))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));
        }
    }
}