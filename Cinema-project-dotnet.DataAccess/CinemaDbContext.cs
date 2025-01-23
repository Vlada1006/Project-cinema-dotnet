using Cinema_project_dotnet.BusinessLogic.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace Cinema_project_dotnet.DataAccess
{
    public class CinemaDbContext : IdentityDbContext<User>
    {
        public CinemaDbContext(DbContextOptions<CinemaDbContext> options) : base(options) 
        { 

        }
        
        public DbSet<Film> Films { get; set; }
        public DbSet<Genre> Genre { get; set; }
        public DbSet<Director> Directors { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Booking> Bookings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Film>()
                .HasMany(f => f.Genres) 
                .WithMany(g => g.Films)
                .UsingEntity<Dictionary<string, object>>(
                    "FilmGenre", 
                    j => j.HasOne<Genre>().WithMany().HasForeignKey("GenreId"), 
                    j => j.HasOne<Film>().WithMany().HasForeignKey("FilmId")
                );

            builder.Entity<Film>()
                .HasMany(f => f.Directors) 
                .WithMany(d => d.Films) 
                .UsingEntity<Dictionary<string, object>>(
                    "FilmDirector",
                    j => j.HasOne<Director>().WithMany().HasForeignKey("DirectorId"),
                    j => j.HasOne<Film>().WithMany().HasForeignKey("FilmId")
                );

            builder.Entity<Session>()
                .HasOne(s => s.Film)
                .WithMany(f => f.Sessions) 
                .HasForeignKey(s => s.FilmId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Session>()
                .HasOne(s => s.Room) 
                .WithMany(r => r.Sessions) 
                .HasForeignKey(s => s.RoomId) 
                .OnDelete(DeleteBehavior.Restrict); 

            builder.Entity<Session>()
                .HasMany(s => s.Bookings) 
                .WithOne(b => b.Session) 
                .HasForeignKey(b => b.SessionId) 
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Booking>()
                .HasOne(b => b.User) 
                .WithMany(u => u.Bookings) 
                .HasForeignKey(b => b.UserId) 
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Booking>()
                .HasOne(b => b.Seat) 
                .WithOne(s => s.Booking) 
                .HasForeignKey<Booking>(b => b.SeatId) 
                .OnDelete(DeleteBehavior.Restrict); 

            builder.Entity<Booking>()
                .HasOne(b => b.Transaction) 
                .WithOne(t => t.Booking) 
                .HasForeignKey<Booking>(b => b.TransactionId) 
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
