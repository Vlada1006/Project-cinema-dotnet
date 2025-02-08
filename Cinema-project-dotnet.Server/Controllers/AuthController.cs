using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Cinema_project_dotnet.BusinessLogic.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Cinema_project_dotnet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // POST: /api/Auth/Register
        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO registerRequestDTO)
        {
            var result = await _authService.RegisterUser(registerRequestDTO);
            if (result)
            {
                return Ok("Ви зареєструвалися!");
            }
            return BadRequest("Щось пішло не так.. Спробуйте ще раз.");
        }

        // POST: /api/Auth/Login
        [HttpPost]
        [Route("Login")]

        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
        {
            var isAuthenticated = await _authService.LoginUser(loginRequestDTO.Username, loginRequestDTO.Password);

            if (isAuthenticated)
            {
                // Create token here (e.g., JWT token generation)
                return Ok();
            }

            return BadRequest("Неправильний логін або пароль");
        }
    }
    
}
