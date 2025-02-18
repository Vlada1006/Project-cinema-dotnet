using Cinema_project_dotnet.BusinessLogic.DTOs;
using FluentValidation;

namespace Cinema_project_dotnet.BusinessLogic.Validators
{
    public class GenreValidator : AbstractValidator<GenreDTO>
    {
        public GenreValidator()
        {
            RuleFor(genre => genre.Name)
                .NotEmpty().WithMessage("Назва не може бути порожньою");
        }
    }
}
