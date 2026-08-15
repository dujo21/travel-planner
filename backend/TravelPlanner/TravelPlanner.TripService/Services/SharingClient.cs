using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.V2.FabricTransport.Client;
using TravelPlanner.Contracts;

namespace TravelPlanner.TripService.Services
{
    // Omotac oko remoting poziva ka stateful SharingService-u.
    public class SharingClient : ISharingClient
    {
        private static readonly Uri SharingServiceUri =
            new Uri("fabric:/TravelPlanner.ServiceFabric/TravelPlanner.SharingService");

        // Eksplicitno V2 remoting klijent - da se poklopi sa V2 listenerom na servisu.
        private static readonly FabricTransportServiceRemotingClientFactory ClientFactory =
            new FabricTransportServiceRemotingClientFactory();

        private ISharingService CreateProxy()
        {
            var proxyFactory = new Microsoft.ServiceFabric.Services.Remoting.Client.ServiceProxyFactory(
                (callbackClient) => ClientFactory);

            return proxyFactory.CreateServiceProxy<ISharingService>(
                SharingServiceUri,
                new ServicePartitionKey(0L));
        }

        public Task<ShareToken> CreateShareAsync(Guid tripId, Guid ownerUserId, string accessType, int? expiryDays)
            => CreateProxy().CreateShareAsync(tripId, ownerUserId, accessType, expiryDays);

        public Task<ShareToken?> ValidateTokenAsync(Guid token)
            => CreateProxy().ValidateTokenAsync(token);

        public Task<List<ShareToken>> GetSharesForTripAsync(Guid tripId)
            => CreateProxy().GetSharesForTripAsync(tripId);

        public Task<bool> RevokeShareAsync(Guid token)
            => CreateProxy().RevokeShareAsync(token);
    }
}