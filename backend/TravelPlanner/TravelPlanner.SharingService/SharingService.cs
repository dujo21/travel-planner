using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Data;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using TravelPlanner.Contracts;

namespace TravelPlanner.SharingService
{
    /// <summary>
    /// Stateful servis koji cuva share tokene u Reliable Dictionary-ju.
    /// Poziva se preko Service Remoting-a iz TripService-a.
    /// </summary>
    internal sealed class SharingService : StatefulService, ISharingService
    {
        private const string DictionaryName = "shareTokens";

        public SharingService(StatefulServiceContext context)
            : base(context)
        { }

        /// <summary>
        /// Registruje remoting listener - preko njega TripService poziva metode ovog servisa.
        /// </summary>
        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
        {
            return new[]
            {
                new ServiceReplicaListener(context =>
                    new Microsoft.ServiceFabric.Services.Remoting.V2.FabricTransport.Runtime.FabricTransportServiceRemotingListener(context, this))
            };
        }

        public async Task<ShareToken> CreateShareAsync(Guid tripId, Guid ownerUserId, string accessType, int? expiryDays)
        {
            var normalizedAccess = accessType?.ToUpperInvariant() == "EDIT" ? "EDIT" : "VIEW";

            var share = new ShareToken
            {
                Token = Guid.NewGuid(),
                TripId = tripId,
                OwnerUserId = ownerUserId,
                AccessType = normalizedAccess,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = expiryDays.HasValue ? DateTime.UtcNow.AddDays(expiryDays.Value) : (DateTime?)null,
                IsRevoked = false
            };

            var dict = await this.StateManager
                .GetOrAddAsync<IReliableDictionary<Guid, ShareToken>>(DictionaryName);

            using (var tx = this.StateManager.CreateTransaction())
            {
                await dict.AddAsync(tx, share.Token, share);
                await tx.CommitAsync();
            }

            return share;
        }

        public async Task<ShareToken?> ValidateTokenAsync(Guid token)
        {
            var dict = await this.StateManager
                .GetOrAddAsync<IReliableDictionary<Guid, ShareToken>>(DictionaryName);

            using (var tx = this.StateManager.CreateTransaction())
            {
                var result = await dict.TryGetValueAsync(tx, token);

                if (!result.HasValue)
                {
                    return null;
                }

                var share = result.Value;

                // Nevalidan ako je opozvan ili istekao.
                if (share.IsRevoked)
                {
                    return null;
                }
                if (share.ExpiresAt.HasValue && share.ExpiresAt.Value < DateTime.UtcNow)
                {
                    return null;
                }

                return share;
            }
        }

        public async Task<List<ShareToken>> GetSharesForTripAsync(Guid tripId)
        {
            var dict = await this.StateManager
                .GetOrAddAsync<IReliableDictionary<Guid, ShareToken>>(DictionaryName);

            var results = new List<ShareToken>();

            using (var tx = this.StateManager.CreateTransaction())
            {
                var enumerable = await dict.CreateEnumerableAsync(tx);
                var enumerator = enumerable.GetAsyncEnumerator();

                while (await enumerator.MoveNextAsync(CancellationToken.None))
                {
                    var share = enumerator.Current.Value;
                    if (share.TripId == tripId)
                    {
                        results.Add(share);
                    }
                }
            }

            return results.OrderByDescending(s => s.CreatedAt).ToList();
        }

        public async Task<bool> RevokeShareAsync(Guid token)
        {
            var dict = await this.StateManager
                .GetOrAddAsync<IReliableDictionary<Guid, ShareToken>>(DictionaryName);

            using (var tx = this.StateManager.CreateTransaction())
            {
                var result = await dict.TryGetValueAsync(tx, token);
                if (!result.HasValue)
                {
                    await tx.CommitAsync();
                    return false;
                }

                var share = result.Value;
                share.IsRevoked = true;

                await dict.SetAsync(tx, token, share);
                await tx.CommitAsync();
                return true;
            }
        }
    }
}