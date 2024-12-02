using System.ComponentModel.DataAnnotations;

namespace RsumeBuilder_Team_9_.Models
{
    /// <summary>
    /// Model for authenticating User
    /// </summary>
    public class AuthenticateRequest
    {
        // properties for various class variables.
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
