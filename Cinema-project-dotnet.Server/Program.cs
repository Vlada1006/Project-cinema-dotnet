using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Cinema_project_dotnet.BusinessLogic.Services;
using Cinema_project_dotnet.DataAccess;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

// Add services to the container.
builder.Services.AddControllers();

//Add repository
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// add AutoMapper with profile classes
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// add custom service:
builder.Services.AddScoped<IFilmService, FilmService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<CinemaDbContext>(options =>
    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
