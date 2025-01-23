using System;

namespace ReactApp1.Server.Models
{
    public class StudentSubject
    {
        public int StudentId { get; set; }
        public int SubjectId { get; set; }
        public DateTime DateEnrolled { get; set; }

        // Navigation properties (optional)
        public Student? Student { get; set; } // Make this nullable
        public Subject? Subject { get; set; } // Make this nullable
    }
}
