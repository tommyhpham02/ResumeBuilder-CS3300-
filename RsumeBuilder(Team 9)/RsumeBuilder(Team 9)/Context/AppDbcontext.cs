using Microsoft.EntityFrameworkCore;
using RsumeBuilder_Team_9_.Models;

namespace RsumeBuilder_Team_9_.Context
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
        {

        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
             modelBuilder.Entity<User>().ToTable("users");
        }
    }
}
