using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RsumeBuilder_Team_9_.Models
{
    public class Job
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("ResumeInput")]
        public int ResumeInputId { get; set; }
        public string CompanyName { get; set; }
        public string Position {  get; set; }
        public string DatesWorked { get; set; }
        public string JobResponsibilities { get; set; }
    }
}
