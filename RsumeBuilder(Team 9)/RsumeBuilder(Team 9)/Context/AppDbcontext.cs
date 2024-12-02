using Microsoft.EntityFrameworkCore;
using RsumeBuilder_Team_9_.Models;

namespace RsumeBuilder_Team_9_.Context
{
    /// <summary>
    /// Gives access to database.
    /// </summary>
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
        {

        }

        // Variables for accessing certain tables in the database
        public DbSet<User> Users { get; set; }
        public DbSet<ResumeInput> ResumeInputs { get; set; }
        public DbSet<Degree> Degrees { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<SkillsLanguagesCertifications> SLC { get; set; }

        // Your added DbSet object here

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Creation and naming of tables
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<ResumeInput>().ToTable("ResumeInput");
            modelBuilder.Entity<Degree>().ToTable("Degree");
            modelBuilder.Entity<Job>().ToTable("Job");
            modelBuilder.Entity<SkillsLanguagesCertifications>().ToTable("SkillsLanguagesCertifications");
        }
    }
}
