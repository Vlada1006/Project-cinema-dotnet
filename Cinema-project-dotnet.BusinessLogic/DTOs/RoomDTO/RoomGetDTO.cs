namespace Cinema_project_dotnet.BusinessLogic.DTOs.RoomDTO
{
    public class RoomGetDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int TotalSeats { get; set; }
        public string Type { get; set; } = string.Empty;
        public int Rows { get; set; }
        public int SeatsPerRow { get; set; }
        public List<SeatDTO> Seats { get; set; } = new List<SeatDTO>();
    }
}
