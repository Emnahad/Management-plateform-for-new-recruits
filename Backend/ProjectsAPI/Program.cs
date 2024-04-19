using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProjectsAPI.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ProjDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("ProjectConnectionString")));

builder.Services.AddCors(option =>
{
    option.AddPolicy("MyPolicy", builder =>
    {
        builder.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});
// Configure authentication services for the application.
builder.Services.AddAuthentication(x =>
{
    // Specify the default authentication scheme for both authentication and challenge.
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
// Add JWT bearer authentication.
.AddJwtBearer(x =>
{
    // Disable HTTPS metadata requirement. Useful for development purposes.
    x.RequireHttpsMetadata = false;
    // Save the received token in the HttpContext for further use.
    x.SaveToken = true;
    // Configure token validation parameters.
    x.TokenValidationParameters = new TokenValidationParameters
    {
        // Validate the issuer signing key.
        ValidateIssuerSigningKey = true,
        // Set the issuer signing key (symmetric key from a secret).
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("veryverysceret.....")),
        // Disable audience validation (not validating who the recipient should be).
        ValidateAudience = false,
        // Disable issuer validation (not validating the token issuer).
        ValidateIssuer = false
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("MyPolicy");

app.UseAuthentication();



app.UseAuthorization();

app.MapControllers();

app.Run();
