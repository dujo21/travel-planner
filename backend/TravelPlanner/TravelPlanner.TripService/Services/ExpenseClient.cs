using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace TravelPlanner.TripService.Services
{
    // Poziva ExpenseService preko HTTP-a da obrise troskove plana.
    // Deo distribuirane kaskade pri brisanju plana.
    public class ExpenseClient : IExpenseClient
    {
        private readonly HttpClient _httpClient;

        public ExpenseClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task DeleteAllForTripAsync(Guid tripId, string authToken)
        {
            var request = new HttpRequestMessage(
                HttpMethod.Delete,
                $"/api/trips/{tripId}/expenses/all");

            // Prosledjujemo isti JWT - ExpenseService rute su zasticene.
            if (!string.IsNullOrEmpty(authToken))
            {
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
            }

            var response = await _httpClient.SendAsync(request);

            // Ako ExpenseService nije dostupan ili vrati gresku, ne rusimo
            // brisanje plana - troskovi mogu ostati i biti ociscena kasnije.
            // Ali logujemo (u realnom sistemu). Za sada: ignorisi neuspeh.
            if (!response.IsSuccessStatusCode)
            {
                // svesno tiho - brisanje plana ima prioritet
            }
        }
    }
}