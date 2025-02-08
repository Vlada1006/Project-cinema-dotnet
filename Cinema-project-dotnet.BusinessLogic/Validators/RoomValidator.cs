using Cinema_project_dotnet.BusinessLogic.DTOs;
using FluentValidation;

namespace Cinema_project_dotnet.BusinessLogic.Validators
{
    public class RoomValidator : AbstractValidator<RoomDTO>
    {
        public RoomValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Room name is required.")
                .Length(3, 100).WithMessage("Room name must be between 3 and 100 characters.");

            RuleFor(x => x.Type)
                .NotEmpty().WithMessage("Room type is required.")
                .Length(3, 50).WithMessage("Room type must be between 3 and 50 characters.");

            RuleFor(x => x.Rows)
                .GreaterThan(0).WithMessage("Rows must be greater than zero.");

            RuleFor(x => x.SeatsPerRow)
                .GreaterThan(0).WithMessage("Seats per row must be greater than zero.");

            RuleFor(x => x.TotalSeats)
                .GreaterThan(0).WithMessage("Total seats must be greater than zero.")
                .Must((x, totalSeats) => totalSeats == (x.Rows * x.SeatsPerRow))
                .WithMessage("Total seats do not match the rows and seats per row.");
        }
    }
}
