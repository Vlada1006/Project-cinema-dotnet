namespace Cinema_project_dotnet.BusinessLogic.DTOs
{
    public class SessionDTO
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal Price { get; set; }
        public int FilmId { get; set; }
        public int RoomId { get; set; }
    }
}
