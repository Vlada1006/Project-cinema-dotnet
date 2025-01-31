using Cinema_project_dotnet.BusinessLogic.DTOs.FilmDTO;
using FluentValidation;

namespace Cinema_project_dotnet.BusinessLogic.Validators
{
    public class FilmValidator : AbstractValidator<FilmCreateUpdateDTO>
    {
        public FilmValidator() 
        {
            RuleFor(f => f.Title).NotEmpty().WithMessage("Title is required.");
            RuleFor(f => f.Description).NotEmpty().WithMessage("Description is required.");
            RuleFor(f => f.ReleaseDate).LessThanOrEqualTo(DateTime.Now).WithMessage("Release date must not be in the future.");
            RuleFor(f => f.Rating).InclusiveBetween(0, 10).WithMessage("Rating must be between 0 and 10.");
            RuleFor(f => f.Duration).GreaterThan(0).WithMessage("Duration must be greater than 0.");
            RuleFor(f => f.Language).NotEmpty().WithMessage("Language is required.");
            RuleFor(f => f.PosterUrl).NotEmpty().WithMessage("Poster URL is required.");
            RuleFor(f => f.TrailerUrl).NotEmpty().WithMessage("Trailer URL is required.");
            RuleFor(f => f.GenreIds).NotEmpty().WithMessage("At least one genre is required.");
            RuleFor(f => f.DirectorIds).NotEmpty().WithMessage("At least one director is required.");
        }
    }
}
