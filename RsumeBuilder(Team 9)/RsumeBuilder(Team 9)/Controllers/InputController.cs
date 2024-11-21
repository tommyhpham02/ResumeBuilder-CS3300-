using Microsoft.AspNetCore.Mvc;
using RsumeBuilder_Team_9_.Context;
using RsumeBuilder_Team_9_.Models;

namespace RsumeBuilder_Team_9_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InputController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        public InputController(AppDbContext appDbContext)
        {

            _authContext = appDbContext;
        }

        [HttpPut("submit/{id}")]
        public async Task<IActionResult> RegisterUser([FromBody] ResumeInput inputObj, string id)
        {
            var input = _authContext.ResumeInputs.SingleOrDefault(x => x.UserId.ToString() == id);

            if (inputObj == null)
                return BadRequest();
            else if (input == null)
                return BadRequest();

            inputObj.Id = input.Id;
            inputObj.UserId = input.UserId;

            _authContext.Entry(input).CurrentValues.SetValues(inputObj);
            await _authContext.SaveChangesAsync(); 
            return Ok(new
            {
                Message = "Input values updated"
            });
        }
    }
}

