using System;
using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.DTOs.RoomDTO;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Cinema_project_dotnet.BusinessLogic.Services;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace Cinema_project_dotnet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly IRoomService _roomService;
        private readonly IValidator<RoomCreatUpdateDTO> _validator;

        public RoomsController(IRoomService roomService, IValidator<RoomCreatUpdateDTO> validator)
        {
            _roomService = roomService;
            _validator = validator;
        }

        [HttpPost]
        public async Task<ActionResult> CreatRoom([FromBody] RoomCreatUpdateDTO roomDTO)
        {
            var validationResult = await _validator.ValidateAsync(roomDTO);
            if (!validationResult.IsValid) return BadRequest(validationResult);

            await _roomService.CreateRoomAsync(roomDTO);
            return Ok(new { message = "Room successfully created" });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateRoom(int id, [FromBody] RoomCreatUpdateDTO roomDTO)
        {
            var validationResult = await _validator.ValidateAsync(roomDTO);
            if (!validationResult.IsValid) return BadRequest(validationResult);

            await _roomService.UpdateRoomAsync(id, roomDTO);
            return Ok(new { message = $"Room with id {id} successfully updated" });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRoom(int id)
        {
            await _roomService.DeleteRoomAsync(id);
            return Ok(new { message = $"Room  with id {id} successfully deleted" });
        }
    }
}
