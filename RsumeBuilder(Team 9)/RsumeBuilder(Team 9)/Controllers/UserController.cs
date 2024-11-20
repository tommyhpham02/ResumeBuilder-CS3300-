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
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        public UserController(AppDbContext appDbContext){

            _authContext = appDbContext;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] AuthenticateRequest authRequest)
        {
            if (authRequest  == null)
                return BadRequest();
            var user = await _authContext.Users.FirstOrDefaultAsync(x => x.Username == authRequest.Username);
            if (user == null)
                return NotFound(new {Message = "User Not Found! Tommy Fix your Code" });
            if(!PasswordHash.VerifyPass(authRequest.Password, user.Password))
            {
                return BadRequest(new { Message = "Password is incorrect" });
            }

            return Ok(new
            {
                Message = "Login Success"
            });

        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User userObj)
        {
            if(userObj == null)
                return BadRequest();

            //Check username
            if(await CheckUserNameExist(userObj.Username))
                return BadRequest(new { Message = "Username Already Exist MADE BY TOMMY"});

            //Check Email
            if (await CheckEmailExist(userObj.Email))
                return BadRequest(new { Message = "Email Already Exist MADE BY TOMMY" });

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

        private Task<bool> CheckUserNameExist(string username)
            => _authContext.Users.AnyAsync(x => x.Username == username);

        private Task<bool> CheckEmailExist(string email)
           => _authContext.Users.AnyAsync(x => x.Email == email);

        private string CheckPasswordStrength(string password)
        {
            StringBuilder sb = new StringBuilder();
            if (password.Length < 8)
                sb.Append("Minimum Password length is 8"+Environment.NewLine);
            if (!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]") && Regex.IsMatch(password, "[0-9]")))
                sb.Append("Password Needs to be Alphanumeric" + Environment.NewLine);
            if (!Regex.IsMatch(password, @"[\W_]"))
                sb.Append("Password should contain special chars" + Environment.NewLine);

            return sb.ToString();
        }
    }
}
