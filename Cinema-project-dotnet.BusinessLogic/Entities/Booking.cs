namespace Cinema_project_dotnet.BusinessLogic.Entities
{
    public class Booking
    {
        public int Id { get; set; }

        public string? UserId { get; set; }

        public User? User { get; set; }

        public int SessionId { get; set; }

        public Session? Session { get; set; }

        public int SeatId { get; set; }

        public Seat? Seat { get; set; }

        public int TransactionId { get; set; }

        public Transaction? Transaction { get; set; }

        public DateTime BookingTime { get; set; }
    }
}
