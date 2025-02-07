using Cinema_project_dotnet.BusinessLogic.DTOs;
using FluentValidation;

namespace Cinema_project_dotnet.BusinessLogic.Validators
{
    public class SessionValidator : AbstractValidator<SessionDTO>
    {
        public SessionValidator()
        {
            RuleFor(x => x.StartTime)
                .NotEmpty().WithMessage("Start time is required.")
                .LessThan(x => x.EndTime).WithMessage("Start time must be before end time.");

            RuleFor(x => x.EndTime)
                .NotEmpty().WithMessage("End time is required.")
                .GreaterThan(x => x.StartTime).WithMessage("End time must be after start time.");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0.");

            RuleFor(x => x.FilmId)
                .NotEmpty().WithMessage("FilmId is required.");

            RuleFor(x => x.RoomId)
                .NotEmpty().WithMessage("RoomId is required.");
        }
    }
}
