namespace ReactApp1.Server.Models
{
    public class Student
    {
        public int ID { get; set; }
        public string Firstname { get; set; } = string.Empty;
        public string Lastname { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }

        // Navigation property for related subjects (can be empty)
        public ICollection<Subject> Subjects { get; set; } = new List<Subject>();
    }
}
