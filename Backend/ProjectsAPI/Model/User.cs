namespace ProjectsAPI.Model
{
    public class User
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Email { get; set; }
        public string? Token { get; set; }
        public string? Role { get; set; }
      
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        public string? JobPosition { get; set; }
        public string? Im { get; set; }


    }
}

       
 