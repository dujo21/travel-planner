using AutoMapper;
using TravelPlanner.ExpenseService.Dtos;
using TravelPlanner.ExpenseService.Entities;

namespace TravelPlanner.ExpenseService.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Expense, ExpenseDto>()
                .MaxDepth(5)
                .ForMember(dest => dest.Category,
                           opt => opt.MapFrom(src => src.Category.ToString()));

            CreateMap<CreateExpenseDto, Expense>()
                .MaxDepth(5)
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => System.Guid.NewGuid()))
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => System.DateTime.UtcNow));
        }
    }
}