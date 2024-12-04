using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RsumeBuilder_Team_9_.Context;
using RsumeBuilder_Team_9_.Helpers;
using RsumeBuilder_Team_9_.Models;
using System.Text;
using System.Text.RegularExpressions;


namespace RsumeBuilder_Team_9_.Controllers
{
    /// <summary>
    /// Controller for User entities in database 
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        public UserController(AppDbContext appDbContext) {

            _authContext = appDbContext;
        }

        /// <summary>
        /// Authenticates if a User is located in the database.
        /// </summary>
        /// <param name="authRequest"></param>
        /// <returns></returns>
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] AuthenticateRequest authRequest)
        {
            if (authRequest == null)
                return BadRequest("Incorrect Data Given.");
            var user = await _authContext.Users.FirstOrDefaultAsync(x => x.Username == authRequest.Username);
            if (user == null)
                return NotFound(new { Message = "User Not found"});
            if (!PasswordHash.VerifyPass(authRequest.Password, user.Password))
            {
                return BadRequest(new { Message = "Password is incorrect" });
            }


            return Ok(new
            {
                Message = "Login Success"
            });

        }

        /// <summary>
        /// Creates temp user
        /// </summary>
        /// <returns>Temp User's Id</returns>
        [HttpGet("createTempUser")]
        public async Task<IActionResult> CreateTempUser() 
        {
            User user = new User();
            user.FirstName = "";
            user.LastName = "";
            user.Email = "";
            user.Username = "";
            user.Password = "";
            await _authContext.Users.AddAsync(user);
            await _authContext.SaveChangesAsync();

            if (_authContext.Users.Entry(user) == null)
                return BadRequest("User was unable to be created");

            return Ok(user.Id);
        }

        /// <summary>
        /// Gets Id associated to User
        /// </summary>
        /// <param name="username"></param>
        /// <returns>User's Id</returns>
        [HttpGet("userId/{username}")]
        public IActionResult GetUserIdFromUsername(string username) 
        {
            var user = _authContext.Users.SingleOrDefault(x => x.Username == username);

            if (user == null)
                return BadRequest($"{username} is not a user");

            return Ok(user.Id.ToString());
        }

        /// <summary>
        /// Removes all User info from database.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="option"></param>
        /// <returns>Error or Confirmation message</returns>
        [HttpDelete("deleteAllInputs/{id}/{option}")]
        public async Task<IActionResult> DeleteAllUserInputs(int id, bool option)
        {
            string log = "";
            if (_authContext.Users.SingleOrDefault(x => x.Id == id) == null)
                return BadRequest("No User found.");

            var user = await _authContext.Users.SingleOrDefaultAsync(x => x.Id == id);

            if (option)
            {
                _authContext.Users.Remove(user);
                log += "User has been removed \n";
            }

            log += "Entities that were never found: \n";
            var personalInfo = await _authContext.ResumeInputs.SingleOrDefaultAsync(x => x.UserId == id);
            var skills = await _authContext.SLC.SingleOrDefaultAsync(x => x.UserId == id);

            if (personalInfo != null)
                _authContext.ResumeInputs.Remove(personalInfo);
            else
                log += "Personal Info \n";

            if (skills != null)
                _authContext.SLC.Remove(skills);
            else
                log += "Skills, Languages, and Cetifications \n";

            if (_authContext.Degrees.Where(x => x.UserId == id).ToList().Count > 0)
                _authContext.RemoveRange(_authContext.Degrees.Where(x => x.UserId == id));
            else
                log += "Degrees \n";

            if (_authContext.Jobs.Where(x => x.UserId == id).ToList().Count > 0)
                _authContext.RemoveRange(_authContext.Jobs.Where(x => x.UserId == id));
            else
                log += "Jobs \n";

            await _authContext.SaveChangesAsync();

            return Ok(new
            {
                Message = log
            });
        }

        /// <summary>
        /// Registers a User into the database.
        /// </summary>
        /// <param name="userObj"></param>
        /// <returns></returns>
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User userObj)
        {
            if(userObj == null)
                return BadRequest("Incorrect Data Given.");

            //Check username
            if(await CheckUserNameExist(userObj.Username))
                return BadRequest(new { Message = "Username Already Exist"});

            //Check Email
            if (await CheckEmailExist(userObj.Email))
                return BadRequest(new { Message = "Email Already Exist" });

            //Check Pass
            var pass = CheckPasswordStrength(userObj.Password);
            if (!string.IsNullOrEmpty(pass))
                return BadRequest(new { Message = pass.ToString()});

            //Hash Password
            userObj.Password = PasswordHash.HashPassword(userObj.Password);
            await _authContext.Users.AddAsync(userObj); //Add to database
            await _authContext.SaveChangesAsync(); //Save to database
            return Ok(new
            {
                Message = "User has been Registered"
            });
        }

        /// <summary>
        /// For checking if username already exisits in User table.
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        private Task<bool> CheckUserNameExist(string username)
            => _authContext.Users.AnyAsync(x => x.Username == username);

        /// <summary>
        /// For checking if Email already exists in User table.
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        private Task<bool> CheckEmailExist(string email)
           => _authContext.Users.AnyAsync(x => x.Email == email);

        /// <summary>
        /// Makes sure the user creates a strong and correct password.
        /// </summary>
        /// <param name="password"></param>
        /// <returns>A strong password</returns>
        private string CheckPasswordStrength(string password)
        {
            StringBuilder sb = new StringBuilder();
            if (password.Length < 8)
                sb.Append("Minimum Password length is 8"+Environment.NewLine);
            if (!Regex.IsMatch(password, "[a-z]"))
                sb.Append("Password Needs to have a lowercase letter" + Environment.NewLine);
            if (!Regex.IsMatch(password, "[A-Z]"))
                sb.Append("Password Needs to have a uppercase letter" + Environment.NewLine);
            if (!Regex.IsMatch(password, "[0-9]"))
                sb.Append("Password Needs to contain a number" + Environment.NewLine);
            if (!Regex.IsMatch(password, @"[\W_]"))
                sb.Append("Password should contain special chars" + Environment.NewLine);

            return sb.ToString();
         }
    }
}
