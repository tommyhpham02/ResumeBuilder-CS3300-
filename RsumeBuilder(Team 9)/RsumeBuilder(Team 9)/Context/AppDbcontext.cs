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
        public DbSet<ResumeInput> ResumeInputs { get; set; }
        public DbSet<Degree> Degrees { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<SkillsLanguagesCertifications> SLC { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<ResumeInput>().ToTable("ResumeInput");
            modelBuilder.Entity<Degree>().ToTable("Degree");
            modelBuilder.Entity<Job>().ToTable("Job");
            modelBuilder.Entity<SkillsLanguagesCertifications>().ToTable("SkillsLanguagesCertifications");
        }
    }
}
