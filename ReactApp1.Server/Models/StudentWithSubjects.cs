namespace ReactApp1.Server.Models
{
    public class StudentWithSubjects
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public List<Subject> Subjects { get; set; } = new List<Subject>();
    }
} 