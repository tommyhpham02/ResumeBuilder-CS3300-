using Microsoft.AspNetCore.Mvc;
using RsumeBuilder_Team_9_.Context;
using RsumeBuilder_Team_9_.Models;

namespace RsumeBuilder_Team_9_.Controllers
{
    /// <summary>
    /// Controller for entities in PersonalInfo table in database
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class PersonalInformationController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        public PersonalInformationController(AppDbContext appDbContext)
        {

            _authContext = appDbContext;
        }

        /// <summary>
        /// Submits a user's personal info to the database.
        /// </summary>
        /// <param name="personalObj"></param>
        /// <param name="id"></param>
        /// <returns>Error or Confirmation message</returns>
        [HttpPost("submit/{id}")]
        public async Task<IActionResult> SubmitPersonalInfo([FromBody] ResumeInput personalObj, int id)
        {
            if (personalObj == null)
                return BadRequest();
            if (_authContext.Users.SingleOrDefault(x => x.Id == id) == null)
                return BadRequest("No User found.");

            personalObj.UserId = id;

            await _authContext.ResumeInputs.AddAsync(personalObj);
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                Message = "Input values updated"
            });
        }

        /// <summary>
        /// Edits a User's personal info from the database.
        /// </summary>
        /// <param name="inputObj"></param>
        /// <param name="id"></param>
        /// <returns>Error or Confirmation message</returns>
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditPersonalInfo([FromBody] ResumeInput inputObj, int id)
        {
            var input = _authContext.ResumeInputs.SingleOrDefault(x => x.UserId == id);

            if (inputObj == null)
                return BadRequest("Incorrect Data given.");
            else if (input == null)
                return BadRequest("No User found.");

            inputObj.Id = input.Id;
            inputObj.UserId = input.UserId;

            _authContext.Entry(input).CurrentValues.SetValues(inputObj);
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                Message = "Input values updated"
            });
        }

        /// <summary>
        /// Retrieves a User's personal Info from the database.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>The User's personal information data</returns>
        [HttpGet("get/{id}")]
        public async Task<IActionResult> getPersonalInfo(int id)
        {
            if (_authContext.Users.SingleOrDefault(x => x.Id == id) == null)
                return BadRequest("No User found.");

            var personalInfo = _authContext.ResumeInputs.SingleOrDefault(x => x.UserId == id);

            if (personalInfo == null)
                return BadRequest("User has no input");

            return Ok(personalInfo);
        }

        /// <summary>
        /// Deletes a User's personal Info from the database.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Error or Confirmation message</returns>
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> deletePersonalInfo(int id)
        {
            if (_authContext.Users.SingleOrDefault(x => x.Id == id) == null)
                return BadRequest("No User found.");

            var slcToRemove = _authContext.ResumeInputs.SingleOrDefault(x => x.Id == id);

            if (slcToRemove == null)
                return NotFound();

            _authContext.ResumeInputs.Remove(slcToRemove);
            await _authContext.SaveChangesAsync();

            return Ok(new { Message = "PersonalInfo successfully removed." });
        }
    }
}