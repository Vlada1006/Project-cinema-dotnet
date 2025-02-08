using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Entities;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cinema_project_dotnet.BusinessLogic.Services;
  public class AuthService : IAuthService
  {
    private readonly UserManager<User> _userManager;

    public AuthService(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task<bool> RegisterUser(RegisterRequestDTO registerRequestDTO)
    {
        var identityUser = new User
        {
            UserName = registerRequestDTO.Username,
            Email = registerRequestDTO.Username
        };

        var identityResult = await _userManager.CreateAsync(identityUser, registerRequestDTO.Password);

        if (identityResult.Succeeded)
        {
            if (registerRequestDTO.Roles != null && registerRequestDTO.Roles.Any())
            {
                identityResult = await _userManager.AddToRolesAsync(identityUser, registerRequestDTO.Roles);
            }
            return identityResult.Succeeded;
        }
        return false;
    }

    public async Task<bool> LoginUser(string username, string password)
    {
        var user = await _userManager.FindByEmailAsync(username);
        if (user != null)
        {
            var checkedPassword = await _userManager.CheckPasswordAsync(user, password);
            return checkedPassword;
        }

        return false;
    }
}

