using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectsAPI.Data;
using ProjectsAPI.Model;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using ProjectsAPI.helpers;
using System.Text.RegularExpressions;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using System.Net;

namespace ProjectsAPI.Controllers
{
    //https://localhost:portnumber/api/projects
    [Route("api/[controller]")]
    [ApiController]
    public class ProjController : ControllerBase
    {
        private readonly ProjDbContext _ProjDbContext;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IConfiguration _configuration;
        public ProjController(ProjDbContext ProjDbContext, IWebHostEnvironment webHostEnvironment, IConfiguration configuration)
        {
            _ProjDbContext = ProjDbContext;
            _webHostEnvironment = webHostEnvironment; // Assign the injected webHostEnvironment to the local variable

            _configuration = configuration;
        }

        [HttpGet("project")]
        public async Task<IActionResult> GetAllProjects()
        {
            var projects = await _ProjDbContext.Projects.ToListAsync();
            return Ok(projects);
        }
        //Get single Project (get project by ID)
        //Get: https://localhost:portnumber/api/projects/{id}
        [HttpGet("{id:Guid}")]
        public IActionResult GetById(Guid id)
        {
            var project = _ProjDbContext.Projects.Find(id);
            if (project == null)
            {
                return NotFound();
            }
            return Ok(project);
        }
        [HttpGet("{page}")]
        public async Task<ActionResult<List<Project>>> GetProjects(int page)
        {
            if (_ProjDbContext.Projects == null)
                return NotFound();

            var pageResults = 6f; // Adjust this value as needed
            var pageCount = Math.Ceiling(_ProjDbContext.Projects.Count() / pageResults);

            var projects = await _ProjDbContext.Projects
                .Skip((page - 1) * (int)pageResults)
                .Take((int)pageResults)
                .ToListAsync();

            var response = new ProjectResponse // Assuming you have a ProjectResponse class defined
            {
                Projects = projects,
                CurrentPage = page,
                Pages = (int)pageCount
            };

            return Ok(response);
        }

        [HttpDelete("project/{id}")]
        
        public async Task<IActionResult> DeleteProject([FromRoute] Guid id)
        {
            var project = await _ProjDbContext.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }
            // Delete associated document file if it exists
            if (!string.IsNullOrEmpty(project.DocumentFileName))
            {
                var documentFilePath = Path.Combine(_webHostEnvironment.WebRootPath, "Documents", project.DocumentFileName);
                if (System.IO.File.Exists(documentFilePath))
                {
                    System.IO.File.Delete(documentFilePath);
                }
            }
            _ProjDbContext.Projects.Remove(project);
            await _ProjDbContext.SaveChangesAsync();
            return Ok(project);

        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(Guid id, [FromForm] Project model)
        {
            // Check if the provided ID is valid
            if (id == Guid.Empty)
            {
                return BadRequest("Invalid project ID");
            }

            // Find the existing project by ID
            var existingProject = await _ProjDbContext.Projects.FindAsync(id);
            if (existingProject == null)
            {
                return NotFound("Project not found");
            }

            // Update the existing project with the new data from the model
            existingProject.Title = model.Title;
            existingProject.Description = model.Description;
            existingProject.full_Description = model.full_Description;
            existingProject.StartDate = model.StartDate;
            existingProject.EndDate = model.EndDate;
            existingProject.VideoUrl = model.VideoUrl;

            // If the model contains an image, update the image as well
            if (model.Image != null)
            {
                existingProject.Image = model.Image;
            }

            // Save the changes to the database
            await _ProjDbContext.SaveChangesAsync();

            // Return a successful response with the updated project data
            return Ok(existingProject);
        }


        [HttpPost("{proj}")]
        public async Task<IActionResult> CreateProject([FromForm] Project model)
        {
            if (model == null)
            {
                return BadRequest("Invalid request data");
            }
            { }


            // Create a new Project instance and set its properties
            var project = new Project
            {
                Id = Guid.NewGuid(),
                Title = model.Title,
                Description = model.Description,
                full_Description = model.full_Description,
                StartDate = model.StartDate,
                EndDate = model.EndDate,
                VideoUrl = model.VideoUrl,
                Image = model.Image,
                DocumentFileName = model.DocumentFileName
            };

            // Save the project to the database
            _ProjDbContext.Projects.Add(project);
            await _ProjDbContext.SaveChangesAsync();

            // Return a successful response with the created project data
            return Ok(project);
        }
        [HttpPost("upload/{projectId:Guid}")]
        public async Task<IActionResult> UploadDocument(Guid projectId, IFormFile document)
        {
            if (document == null || document.Length == 0)
            {
                return BadRequest("Please select a valid document file.");
            }

            var project = await _ProjDbContext.Projects.FindAsync(projectId);
            if (project == null)
            {
                return NotFound("Project not found.");
            }

            // Generate a unique file name for the document
            var documentFileName = $"{Guid.NewGuid()}{Path.GetExtension(document.FileName)}";

            // Save the document to a local path
            var documentFilePath = Path.Combine(_webHostEnvironment.WebRootPath, "Documents", documentFileName);
            using (var stream = new FileStream(documentFilePath, FileMode.Create))
            {
                await document.CopyToAsync(stream);
            }

            // Update the project's DocumentFileName property with the generated file name
            project.DocumentFileName = documentFileName;
            await _ProjDbContext.SaveChangesAsync();

            return Ok("Document uploaded successfully.");
        }
        [HttpGet("download/{projectId:Guid}")]
        public IActionResult DownloadDocument(Guid projectId)
        {
            var project = _ProjDbContext.Projects.Find(projectId);
            if (project == null || string.IsNullOrEmpty(project.DocumentFileName))
            {
                return NotFound("Document not found for this project.");
            }

            var documentFilePath = Path.Combine(_webHostEnvironment.WebRootPath, "Documents", project.DocumentFileName);
            if (!System.IO.File.Exists(documentFilePath))
            {
                return NotFound("Document file not found on the server.");
            }

            // Provide the document as a downloadable file
            return PhysicalFile(documentFilePath, "application/octet-stream", project.DocumentFileName);
        }
        [HttpGet("search")]
        public async Task<ActionResult<List<Project>>> SearchProjects(string searchTerm)
        {
            var projects = await _ProjDbContext.Projects
                .Where(p => p.Title.Contains(searchTerm))
                .ToListAsync();

            return Ok(projects);
        }
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userobj)
        {
            if (userobj == null)
                return BadRequest();

            // Find the user by the provided username and password
            var user = await _ProjDbContext.Users
                .FirstOrDefaultAsync(x => x.Username == userobj.Username);

            if (user == null)
                return NotFound(new { Message = "User Not Found!" });

            if (!PasswordHasher.VerifyPassword(userobj.Password, user.Password))
            {
                return BadRequest(new { Message = "Password is Incorrect" });
            }
            user.Token = CreateJwt(user);
            return Ok(new
            {
                Token = user.Token,
                Message = "Login Success!"
            });
        }
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User userObj)
        {
            if (userObj == null)
                return BadRequest();

            // Check if the email or username already exist
            if (await CheckEmailExistAsync(userObj.Email))
                return BadRequest(new { Message = "Email Already Exists" });

            if (await CheckUsernameExistAsync(userObj.Username))
                return BadRequest(new { Message = "Username Already Exists" });
            //Check strength of the password
            var passMessage = CheckPasswordStrength(userObj.Password);
            if (!string.IsNullOrEmpty(passMessage))
                return BadRequest(new { Message = passMessage.ToString() });

            // Hash the user's password before saving to the database
            userObj.Password = PasswordHasher.HashPassword(userObj.Password);
            userObj.Role = "User";
            userObj.Token = "";

            // Check if the user has been registered before
            var existingUser = await _ProjDbContext.Users.FirstOrDefaultAsync(
                x => x.Username == userObj.Username || x.Email == userObj.Email);

            if (existingUser != null)
            {
                // User already exists, return a success response
                return Ok(new
                {
                    Message = "User already registered."
                });
            }

            // Save the user to the database
            _ProjDbContext.Users.Add(userObj);
            await _ProjDbContext.SaveChangesAsync();

            // Return a successful response
            return Ok(new
            {
                Message = "User registered successfully."
            });
        }


        // Private helper methods for checking email and username existence
        private async Task<bool> CheckEmailExistAsync(string email)
        {
            return await _ProjDbContext.Users.AnyAsync(x => x.Email == email);
        }

        private async Task<bool> CheckUsernameExistAsync(string username)
        {
            return await _ProjDbContext.Users.AnyAsync(x => x.Username == username);
        }
        private static string CheckPasswordStrength(string pass)
        {
            StringBuilder sb = new StringBuilder();
            if (pass.Length < 9)
                sb.Append("Minimum password length should be 8" + Environment.NewLine);
            if (!(Regex.IsMatch(pass, "[a-z]") && Regex.IsMatch(pass, "[A-Z]") && Regex.IsMatch(pass, "[0-9]")))
                sb.Append("Password should be AlphaNumeric" + Environment.NewLine);
            if (!Regex.IsMatch(pass, "[<,>,@,!,#,$,%,^,&,*,(,),_,+,\\[,\\],{,},?,:,;,|,',\\,.,/,~,`,-,=]"))
                sb.Append("Password should contain special charcter" + Environment.NewLine);
            return sb.ToString();
        }
        private string CreateJwt(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("veryverysceret.....");
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Name,$"{user.Username}"),
                new Claim(ClaimTypes.NameIdentifier,$"{user.Id}"),
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.UtcNow.AddMinutes(5),
                SigningCredentials = credentials
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }


        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _ProjDbContext.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("users/{id:int}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _ProjDbContext.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(user);
        }

        [HttpDelete("users/{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _ProjDbContext.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            _ProjDbContext.Users.Remove(user);
            await _ProjDbContext.SaveChangesAsync();

            return Ok("User deleted successfully.");
        }
        [HttpPut("users/{id:int}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
        {
            if (updatedUser == null)
            {
                return BadRequest("Invalid user data");
            }

            // Check if the provided ID is valid
            if (id <= 0)
            {
                return BadRequest("Invalid user ID");
            }

            // Find the existing user by ID
            var existingUser = await _ProjDbContext.Users.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound("User not found");
            }

            // Update the existing user with the new data from the model
            existingUser.FullName = updatedUser.FullName;
            existingUser.Username = updatedUser.Username;
            existingUser.Email = updatedUser.Email;
            existingUser.Role = updatedUser.Role;
            existingUser.JobPosition = updatedUser.JobPosition;
            existingUser.Im = updatedUser.Im;

            // Save the changes to the database
            await _ProjDbContext.SaveChangesAsync();

            // Return a successful response with the updated user data
            return Ok(existingUser);
        }
        [HttpPost("contact")]
        public async Task<IActionResult> ContactForm([FromBody] ContactMessage contactMessage)
        {
            if (contactMessage == null)
            {
                return BadRequest("Invalid request data");
            }

            try
            {
                using (var client = new SmtpClient("smtp.gmail.com"))
                {


                    client.Port = 587; // Use port 587 for TLS encryption
                    client.EnableSsl = true; // This line is not needed for port 587

                    // Use the "UseDefaultCredentials" property only if you're not specifying NetworkCredentials
                    client.UseDefaultCredentials = false;

                    // Use NetworkCredential to provide your Gmail credentials
                    var credentials = new NetworkCredential("haddaremna30@gmail.com", "uitjjjpefuwhvjdh");
                    client.Credentials = credentials;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("haddaremna30@gmail.com", "Your Application"),
                        Subject = "New Contact Form Submission",
                        Body = $"Username: {contactMessage.Username}\nEmail: {contactMessage.Email}\nMessage: {contactMessage.Message}",
                        IsBodyHtml = false
                    };

                    mailMessage.To.Add("haddaremna30@gmail.com");

                    await client.SendMailAsync(mailMessage);
                }

                return Ok("Contact message sent successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }




        [HttpGet("employees")]

        public async Task<IActionResult> GetAllEmployees()

        {

            var employees = await _ProjDbContext.Employees.ToListAsync();

            return Ok(employees);

        }



        [HttpGet("Searchh")]

        public async Task<IActionResult> SearchEmployeesByName(string name)

        {

            var employeesQuery = _ProjDbContext.Employees.AsQueryable();



            if (!string.IsNullOrEmpty(name))

            {

                employeesQuery = employeesQuery.Where(e => e.Name.Contains(name));

            }



            var employees = await employeesQuery.ToListAsync();

            return Ok(employees);

        }



       


        [HttpPost]

        public async Task<IActionResult> AddEmployee([FromBody] Employee employeeRequest)

        {

            employeeRequest.Id = Guid.NewGuid();

            await _ProjDbContext.Employees.AddAsync(employeeRequest);

            await _ProjDbContext.SaveChangesAsync();

            return Ok(employeeRequest);

        }



        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteEmployee(Guid id)

        {

            var employee = await _ProjDbContext.Employees.FindAsync(id);

            if (employee == null)

            {

                return NotFound(); // Ou toute autre réponse appropriée si l'employé n'est pas trouvé

            }



            _ProjDbContext.Employees.Remove(employee);

            await _ProjDbContext.SaveChangesAsync();

            return Ok(employee);

        }

        [HttpPut("updateimage/{id}")]

        public async Task<IActionResult> Update2Employee(Guid id, [FromBody] Employee updatedEmployee)

        {

            var existingEmployee = await _ProjDbContext.Employees.FindAsync(id);



            if (existingEmployee == null)

            {

                return NotFound(); // Employee with the specified ID not found

            }



            // Update the properties of the existing employee with the values from the updatedEmployee

            existingEmployee.image = updatedEmployee.image;

            // Update other properties as needed

            _ProjDbContext.Employees.Update(existingEmployee);

            await _ProjDbContext.SaveChangesAsync();



            return Ok(existingEmployee);

        }


    }
}







