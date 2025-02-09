namespace Cinema_project_dotnet.BusinessLogic.DTOs
{
    public class SeatDTO
    {
        public int Id { get; set; }
        public int Row { get; set; }
        public int Number { get; set; }
        public bool IsAvailable { get; set; }  
        public int RoomId { get; set; }
    }
}
