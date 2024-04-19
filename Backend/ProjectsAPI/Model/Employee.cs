namespace ProjectsAPI.Model
{
    public class Employee
    {
        public Guid? Id { get; set; } // Nullable Guid for the Id property

        public string Name { get; set; } = "kk";// Non-nullable string for the Name property

        public string Occupation { get; set; } = "kk";

        public string Email { get; set; } = "Email";

        public long Phone { get; set; }

        public string DateOfBirth { get; set; } = "date"; // Renamed 'date' property to 'DateOfBirth' for clarity

        public string Gender { get; set; } = "gender";

        public string Education { get; set; } = "education";

        public string Experience { get; set; } = "experience";

        public string image { get; set; }
    }
}
