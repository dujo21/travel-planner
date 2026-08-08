using AutoMapper;
using TravelPlanner.TripService.Dtos;
using TravelPlanner.TripService.Entities;

namespace TravelPlanner.TripService.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Trip, TripDto>()
                .MaxDepth(10)
                .ForMember(dest => dest.DestinationCount,
                           opt => opt.MapFrom(src => src.Destinations.Count))
                .ForMember(dest => dest.ActivityCount,
                           opt => opt.MapFrom(src => src.Activities.Count));

            CreateMap<CreateTripDto, Trip>()
                .MaxDepth(10)
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => System.Guid.NewGuid()))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => System.DateTime.UtcNow))
                .ForMember(dest => dest.OwnerUserId, opt => opt.Ignore());

            CreateMap<UpdateTripDto, Trip>()
                .MaxDepth(10)
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.OwnerUserId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
        }
    }
}