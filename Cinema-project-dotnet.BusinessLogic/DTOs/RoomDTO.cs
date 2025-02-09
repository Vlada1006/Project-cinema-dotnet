namespace Cinema_project_dotnet.BusinessLogic.DTOs
{
    public class RoomDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int TotalSeats { get; set; }
        public int Rows { get; set; }
        public int SeatsPerRow { get; set; }
    }
}
