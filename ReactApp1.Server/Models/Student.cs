namespace ReactApp1.Server.Models
{
    public class Student
    {
        public int ID { get; set; }
        public string Firstname { get; set; } = string.Empty;
        public string Lastname { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
    }
}
