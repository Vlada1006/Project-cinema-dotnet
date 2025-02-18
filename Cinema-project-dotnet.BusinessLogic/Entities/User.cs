using Microsoft.AspNetCore.Identity;

namespace Cinema_project_dotnet.BusinessLogic.Entities
{
    public class User : IdentityUser
    {
        public List<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
