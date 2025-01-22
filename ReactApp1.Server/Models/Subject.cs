namespace ReactApp1.Server.Models
{
    public class Subject
    {
        public int ID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // Foreign key to associate with Student (nullable)
        public int? StudentID { get; set; } // Make this nullable
        public Student? Student { get; set; } // Navigation property (optional)
    }
} 