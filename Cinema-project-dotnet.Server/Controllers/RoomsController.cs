using System;
using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Cinema_project_dotnet.BusinessLogic.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cinema_project_dotnet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly IRoomService _roomService;
        private readonly IValidator<RoomDTO> _validator;

        public RoomsController(IRoomService roomService, IValidator<RoomDTO> validator)
        {
            _roomService = roomService;
            _validator = validator;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<List<RoomDTO>>> GetRooms()
        {
            var rooms = await _roomService.GetAllRoomsAsync();
            return Ok(new { message = "Successfully retrieved all rooms", data = rooms });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<RoomDTO>> GetRoom(int id)
        {
            var room = await _roomService.GetRoomByIdAsync(id);
            return Ok(new { message = $"Successfully retrieved room with id {id}", data = room });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreatRoom([FromBody] RoomDTO roomDTO)
        {
            var validationResult = await _validator.ValidateAsync(roomDTO);
            if (!validationResult.IsValid) return BadRequest(validationResult);

            await _roomService.CreateRoomAsync(roomDTO);
            return Ok(new { message = "Room successfully created" });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateRoom(int id, [FromBody] RoomDTO roomDTO)
        {
            var validationResult = await _validator.ValidateAsync(roomDTO);
            if (!validationResult.IsValid) return BadRequest(validationResult);

            await _roomService.UpdateRoomAsync(id, roomDTO);
            return Ok(new { message = $"Room with id {id} successfully updated" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteRoom(int id)
        {
            await _roomService.DeleteRoomAsync(id);
            return Ok(new { message = $"Room  with id {id} successfully deleted" });
        }
    }
}
