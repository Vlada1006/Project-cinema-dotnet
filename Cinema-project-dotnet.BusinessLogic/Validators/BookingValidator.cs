using Cinema_project_dotnet.BusinessLogic.DTOs;
using FluentValidation;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Cinema_project_dotnet.BusinessLogic.Validators
{
    public class BookingValidator : AbstractValidator<BookingDTO>
    {
        public BookingValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty()
                .WithMessage("UserId cannot be empty.");

            RuleFor(x => x.SessionId)
                .NotEmpty()
                .WithMessage("SessionId cannot be empty.");

            RuleFor(x => x.SeatId)
                .NotEmpty()
                .WithMessage("SeatId cannot be empty.");

            RuleFor(x => x.TransactionId)
                .NotEmpty()
                .WithMessage("TransactionId cannot be empty.");

            RuleFor(x => x.BookingTime)
                .NotEmpty()
                .WithMessage("BookingTime cannot be empty.");
        }
    }
}
