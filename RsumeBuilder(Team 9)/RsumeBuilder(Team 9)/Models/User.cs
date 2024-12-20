﻿using System.ComponentModel.DataAnnotations;

namespace RsumeBuilder_Team_9_.Models
{
    /// <summary>
    /// Model for User entity in database.
    /// </summary>
    public class User
    {
        // properties for various class variables.
        [Key]
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public ResumeInput? ResumeInput { get; set; }
        public SkillsLanguagesCertifications? Languages { get; set; }
        public ICollection<Degree>? Degrees { get; set; }
        public ICollection<Job>? Jobs { get; set; }
    }
}
