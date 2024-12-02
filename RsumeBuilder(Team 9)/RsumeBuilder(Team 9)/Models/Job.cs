using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RsumeBuilder_Team_9_.Models
{
    /// <summary>
    /// Model for Job entity in database.
    /// </summary>
    public class Job
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public string CompanyName { get; set; }
        public string Position {  get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string JobResponsibilities { get; set; }
    }
}
