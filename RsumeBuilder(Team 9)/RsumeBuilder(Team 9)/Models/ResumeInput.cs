using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RsumeBuilder_Team_9_.Models
{
    /// <summary>
    /// Model for ResumeInput entity in database.
    /// </summary>
    public class ResumeInput
    {
        // properties for various class variables.
        [Key]
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Website { get; set; }
        public string? Summary { get; set; }
    }
}
