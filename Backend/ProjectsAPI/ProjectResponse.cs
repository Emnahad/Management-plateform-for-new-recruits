using ProjectsAPI.Model;

namespace ProjectsAPI
{
    public class ProjectResponse
    {
        
        public List<Project> Projects { get; set; } = new List<Project>();
        public int Pages { get; set; }
        public int CurrentPage { get; set; }
    }
}

