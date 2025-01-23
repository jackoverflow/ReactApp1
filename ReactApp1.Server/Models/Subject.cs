using System;
using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Models
{
    public class Subject
    {
        public int Id { get; set; }

        [Required]
        public string ShortName { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        // Parameterless constructor for ORM/serialization
        public Subject() { }

        // Constructor with required short name
        public Subject(string shortname)
        {
            ShortName = shortname ?? throw new ArgumentNullException(nameof(shortname));
        }

        // Optional constructor with description
        public Subject(string shortname, string description)
        {
            ShortName = shortname ?? throw new ArgumentNullException(nameof(shortname));
            Description = description; // Optional, can be null
        }

        // Foreign key to associate with Student (nullable)
        public int? StudentID { get; set; } // Make this nullable
        public Student? Student { get; set; } // Navigation property (optional)
    }
} 