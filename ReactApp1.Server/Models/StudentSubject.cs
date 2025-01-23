using System;

namespace ReactApp1.Server.Models
{
    public class StudentSubject
    {
        public int StudentId { get; set; }
        public int SubjectId { get; set; }
        public DateTime DateEnrolled { get; set; }

        // Navigation properties (optional)
        public Student Student { get; set; } // Navigation property to Student
        public Subject Subject { get; set; } // Navigation property to Subject
    }
}
