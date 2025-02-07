namespace Cinema_project_dotnet.BusinessLogic.DTOs
{
    public class BookingDTO
    {
        public int Id { get; set; }

        public string UserId { get; set; }

        public int SessionId { get; set; }

        public int SeatId { get; set; }

        public int TransactionId { get; set; }

        public DateTime BookingTime { get; set; }
    }
}
