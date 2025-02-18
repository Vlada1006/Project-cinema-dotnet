using Cinema_project_dotnet.BusinessLogic.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cinema_project_dotnet.BusinessLogic.Interfaces
{
    public interface IAuthService
    {
        Task<bool> RegisterUser(RegisterRequestDTO registerRequestDTO);
        Task<LoginResponseDTO?> LoginUser(string username, string password);
    }
}
