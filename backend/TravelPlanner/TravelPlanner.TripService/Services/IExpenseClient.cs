using System;
using System.Threading.Tasks;

namespace TravelPlanner.TripService.Services
{
    public interface IExpenseClient
    {
        Task DeleteAllForTripAsync(Guid tripId, string authToken);
    }
}