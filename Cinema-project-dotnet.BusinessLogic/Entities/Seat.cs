namespace Cinema_project_dotnet.BusinessLogic.Entities
{
    public class Seat
    {
        public int Id { get; set; }

        public int Row {  get; set; }

        public int Number {  get; set; }

        public int RoomId { get; set; }

        public Room? Room { get; set; }

        public Booking? Booking { get; set; }

        public List<SessionSeat> SessionSeats { get; set; } = new List<SessionSeat>();
    }
}
