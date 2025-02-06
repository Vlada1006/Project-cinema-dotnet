namespace Cinema_project_dotnet.BusinessLogic.DTOs.RoomDTO
{
    public class RoomCreatUpdateDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int TotalSeats { get; set; }
        public int Rows { get; set; }
        public int SeatsPerRow { get; set; }
    }
}
