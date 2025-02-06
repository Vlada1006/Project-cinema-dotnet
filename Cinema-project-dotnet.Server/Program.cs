using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Cinema_project_dotnet.BusinessLogic.Services;
using Cinema_project_dotnet.BusinessLogic.Validators;
using Cinema_project_dotnet.DataAccess;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using Cinema_project_dotnet.Server;
using Microsoft.AspNetCore.Identity;
using Cinema_project_dotnet.BusinessLogic.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

// Add services to the container.
builder.Services.AddControllers();

//Add repository
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// add AutoMapper with profile classes
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// add FluentValidator with validation classes
builder.Services.AddValidatorsFromAssemblyContaining<FilmValidator>();

// add custom service:
builder.Services.AddScoped<IFilmService, FilmService>();
builder.Services.AddScoped<IGenreService, GenreService>();
builder.Services.AddScoped<IDirectorService, DirectorService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<CinemaDbContext>(options =>
    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddIdentityCore<IdentityUser>()
    .AddRoles<IdentityRole>()
    .AddTokenProvider<DataProtectorTokenProvider<IdentityUser>>("Cinema-project-dotnet")
    .AddEntityFrameworkStores<CinemaDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequiredLength = 6;
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    });
    
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Add Exception Handler middleware
app.UseMiddleware<ExceptionMiddleware>();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
