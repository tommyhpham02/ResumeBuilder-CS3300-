using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RsumeBuilder_Team_9_.Models
{
    public class Language
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("ResumeInput")]
        public int ResumeInputId { get; set; }
        public string LanguageName { get; set; }
        public string LanguageProficiency { get; set; }
    }
}
