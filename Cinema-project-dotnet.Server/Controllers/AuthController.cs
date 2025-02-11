using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Entities;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Cinema_project_dotnet.BusinessLogic.Services;
using Cinema_project_dotnet.DataAccess;
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
        private readonly ITokenRepository _tokenRepository;
        private readonly UserManager<User> _userManager;

        public AuthController(IAuthService authService, ITokenRepository tokenRepository, UserManager<User> userManager)
        {
            _authService = authService;
            _tokenRepository = tokenRepository;
            _userManager = userManager;
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

        //public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
        //{
        //    var user = await _userManager.FindByEmailAsync(loginRequestDTO.Username);

        //    if (user != null)
        //    {
        //        var checkedPassword = await _userManager.CheckPasswordAsync(user, loginRequestDTO.Password);

        //        if (checkedPassword)
        //        {
        //            var roles = await _userManager.GetRolesAsync(user);
        //            if(roles != null)
        //            {
        //                var jwtToken = _tokenRepository.CreateJWTToken(user, roles.ToList());

        //                var response = new LoginResponseDTO
        //                {
        //                    JwtToken = jwtToken
        //                };
        //                return Ok(response);
        //            }                    
        //        }                
        //    }
        //    return BadRequest("Неправильний логін або пароль");
        //}

        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
        {
            var response = await _authService.LoginUser(loginRequestDTO.Username, loginRequestDTO.Password);

            if (response == null)
            {
                return BadRequest("Неправильний логін або пароль");
            }

            return Ok(response);
        }
    }
}
