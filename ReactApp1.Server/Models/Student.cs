using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Models
{
    public class Student
    {
        public int Id { get; set; }

        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public DateTime DateOfBirth { get; set; }

        public List<StudentSubject> Subjects { get; set; } = new List<StudentSubject>();
    }
}
