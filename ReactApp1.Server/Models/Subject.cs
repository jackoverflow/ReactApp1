namespace ReactApp1.Server.Models
{
    public class Subject
    {
        public int ID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // Foreign key to associate with Student
        public int StudentID { get; set; }
        public Student Student { get; set; } // Navigation property
    }
} 