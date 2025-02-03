using Cinema_project_dotnet.BusinessLogic.DTOs;
using FluentValidation;

namespace Cinema_project_dotnet.BusinessLogic.Validators
{
    public class DirectorValidator : AbstractValidator<DirectorDTO>
    {
        public DirectorValidator() 
        {
            RuleFor(genre => genre.Name)
                .NotEmpty().WithMessage("Назва не може бути порожньою");
        }
    }
}
