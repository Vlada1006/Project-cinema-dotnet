namespace Cinema_project_dotnet.BusinessLogic.Entities
{
    public class SessionSeat
    {
        public int SessionId { get; set; }
        public Session Session { get; set; }  
        public int SeatId { get; set; }
        public Seat Seat { get; set; }  
        public bool IsAvailable { get; set; }
    }
}
