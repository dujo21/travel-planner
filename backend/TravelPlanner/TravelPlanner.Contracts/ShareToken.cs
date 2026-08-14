using System;
using System.Runtime.Serialization;

namespace TravelPlanner.Contracts
{
    [DataContract]
    public class ShareToken
    {
        [DataMember]
        public Guid Token { get; set; }

        [DataMember]
        public Guid TripId { get; set; }

        [DataMember]
        public Guid OwnerUserId { get; set; }

        [DataMember]
        public string AccessType { get; set; } = "VIEW"; // "VIEW" ili "EDIT"

        [DataMember]
        public DateTime CreatedAt { get; set; }

        [DataMember]
        public DateTime? ExpiresAt { get; set; }

        [DataMember]
        public bool IsRevoked { get; set; }
    }
}