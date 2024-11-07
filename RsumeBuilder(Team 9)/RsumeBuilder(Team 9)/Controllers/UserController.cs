using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RsumeBuilder_Team_9_.Context;
using RsumeBuilder_Team_9_.Models;

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
            var user = await _authContext.Users.FirstOrDefaultAsync(x => x.Username == authRequest.Username && x.Password == authRequest.Password);
            if (user == null)
                return NotFound(new {Message = "User Not Found! Tommy Fix your Code" });

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

            await _authContext.Users.AddAsync(userObj); //Add to database
            await _authContext.SaveChangesAsync(); //Save to database
            return Ok(new
            {
                Message = "User has been Registered"
            });
        }
    }
}
