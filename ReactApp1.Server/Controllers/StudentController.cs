using Dapper;
using Npgsql;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Models;

namespace ReactApp1.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly string? _connectionString;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        var students = await connection.QueryAsync<Student>("SELECT * FROM Students");
        return Ok(students);
    }

    [HttpPost]
    public async Task<ActionResult<Student>> AddStudent([FromBody] Student student)
    {
        try
        {
            if (student == null)
            {
                return BadRequest("Student data is null.");
            }

            Console.WriteLine($"Received student data: Firstname={student.Firstname}, Lastname={student.Lastname}, BirthDate={student.BirthDate}");

            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            var insertQuery = @"
                INSERT INTO Students (Firstname, Lastname, BirthDate) 
                VALUES (@Firstname, @Lastname, @BirthDate) 
                RETURNING ID;";

            var parameters = new
            {
                student.Firstname,
                student.Lastname,
                student.BirthDate
            };

            var id = await connection.ExecuteScalarAsync<int>(insertQuery, parameters);
            student.ID = id;

            Console.WriteLine($"Student added with ID: {student.ID}");

            return CreatedAtAction(nameof(GetStudents), new { id = student.ID }, student);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error adding student: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    public StudentController(IConfiguration configuration)
    {
        _configuration = configuration;
        _connectionString = _configuration.GetConnectionString("DefaultConnection") 
            ?? throw new ArgumentNullException(nameof(_connectionString));
    }
}