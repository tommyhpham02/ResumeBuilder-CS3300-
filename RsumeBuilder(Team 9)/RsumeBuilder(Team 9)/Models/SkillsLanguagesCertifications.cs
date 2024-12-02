using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RsumeBuilder_Team_9_.Models
{
    /// <summary>
    /// Model for SkillsLanguagesCertifications entity in database
    /// </summary>
    public class SkillsLanguagesCertifications
    {
        // properties for various class variables.
        [Key]
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public string LanguageName { get; set; }
        public string CertificationName { get; set; }
        public string Skills { get; set; }
        public string Projects { get; set; }


    }
}
