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
        public DbSet<FilmGenre> FilmGenres { get; set; }
        public DbSet<FilmDirector> FilmDirectors { get; set; }
        public DbSet<SessionSeat> SessionSeats { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<SessionSeat>()
                .HasKey(fg => new { fg.SessionId, fg.SeatId });

            builder.Entity<SessionSeat>()
                .HasOne(ss => ss.Session)
                .WithMany(s => s.SessionSeats)
                .HasForeignKey(ss => ss.SessionId);

            builder.Entity<SessionSeat>()
                .HasOne(ss => ss.Seat)
                .WithMany(s => s.SessionSeats)
                .HasForeignKey(ss => ss.SeatId);

            builder.Entity<SessionSeat>()
                .Property(ss => ss.IsAvailable)
                .IsRequired();

            builder.Entity<FilmGenre>()
                .HasKey(fg => new { fg.FilmId, fg.GenreId });

            builder.Entity<FilmGenre>()
                .HasOne(fg => fg.Film)
                .WithMany(f => f.FilmGenres)
                .HasForeignKey(fg => fg.FilmId);

            builder.Entity<FilmGenre>()
                .HasOne(fg => fg.Genre)
                .WithMany(g => g.FilmGenres)
                .HasForeignKey(fg => fg.GenreId);

            builder.Entity<FilmDirector>()
                .HasKey(fg => new { fg.FilmId, fg.DirectorId });

            builder.Entity<FilmDirector>()
                .HasOne(fg => fg.Film)
                .WithMany(f => f.FilmDirectors)
                .HasForeignKey(fg => fg.FilmId);

            builder.Entity<FilmDirector>()
                .HasOne(fg => fg.Director)
                .WithMany(g => g.FilmDirectors)
                .HasForeignKey(fg => fg.DirectorId);

            builder.Entity<Session>()
                .HasOne(s => s.Film)
                .WithMany(f => f.Sessions) 
                .HasForeignKey(s => s.FilmId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Session>()
                .HasOne(s => s.Room) 
                .WithMany(r => r.Sessions) 
                .HasForeignKey(s => s.RoomId) 
                .OnDelete(DeleteBehavior.Cascade); 

            builder.Entity<Session>()
                .HasMany(s => s.Bookings) 
                .WithOne(b => b.Session) 
                .HasForeignKey(b => b.SessionId) 
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Booking>()
                .HasOne(b => b.User) 
                .WithMany(u => u.Bookings) 
                .HasForeignKey(b => b.UserId) 
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Booking>()
                .HasOne(b => b.Seat) 
                .WithOne(s => s.Booking) 
                .HasForeignKey<Booking>(b => b.SeatId) 
                .OnDelete(DeleteBehavior.Cascade); 

            builder.Entity<Booking>()
                .HasOne(b => b.Transaction) 
                .WithOne(t => t.Booking) 
                .HasForeignKey<Booking>(b => b.TransactionId) 
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
