namespace ReactApp1.Server.Models
{
    public class StudentWithSubjects
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public List<Subject> Subjects { get; set; } = new List<Subject>();
    }
} 