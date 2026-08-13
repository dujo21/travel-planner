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

            CreateMap<Destination, DestinationDto>().MaxDepth(5);

            CreateMap<CreateDestinationDto, Destination>()
                .MaxDepth(5)
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => System.Guid.NewGuid()))
                .ForMember(dest => dest.TripId, opt => opt.Ignore());

            CreateMap<Activity, ActivityDto>()
                .MaxDepth(5)
                .ForMember(dest => dest.Status,
                           opt => opt.MapFrom(src => src.Status.ToString()));

            CreateMap<CreateActivityDto, Activity>()
                .MaxDepth(5)
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => System.Guid.NewGuid()))
                .ForMember(dest => dest.TripId, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore());

            CreateMap<ChecklistItem, ChecklistItemDto>().MaxDepth(5);
        }
    }
}