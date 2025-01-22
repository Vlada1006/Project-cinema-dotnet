using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Cinema_project_dotnet.BusinessLogic.Entities
{
    public class User : IdentityUser<int>, IBaseEntity
    {
        public int Id { get; }

        public List<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
