namespace Cinema_project_dotnet.BusinessLogic.Entities
{
    public class Session
    {
        public int Id { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public decimal Price { get; set; }

        public int FilmId { get; set; }

        public Film? Film { get; set; }

        public int RoomId { get; set; }

        public Room? Room { get; set; }

        public List<Booking> Bookings { get; set; } = new List<Booking>();

        public List<SessionSeat> SessionSeats { get; set; } = new List<SessionSeat>();
    }
}
