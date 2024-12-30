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

    public StudentController(IConfiguration configuration)
    {
        _configuration = configuration;
        _connectionString = _configuration.GetConnectionString("DefaultConnection") 
            ?? throw new ArgumentNullException(nameof(_connectionString));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        var students = await connection.QueryAsync<Student>("SELECT * FROM Students");
        return Ok(students);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetStudent(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        var student = await connection.QueryFirstOrDefaultAsync<Student>(
            "SELECT * FROM Students WHERE ID = @Id", new { Id = id });

        if (student == null)
        {
            return NotFound();
        }
        return Ok(student);
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

            using var connection = new NpgsqlConnection(_connectionString);
            var query = "INSERT INTO Students (Firstname, Lastname, BirthDate) VALUES (@Firstname, @Lastname, @BirthDate) RETURNING *";
            var addedStudent = await connection.QuerySingleAsync<Student>(query, student);

            return CreatedAtAction(nameof(GetStudent), new { id = addedStudent.ID }, addedStudent);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(int id, [FromBody] Student student)
    {
        if (student == null || student.ID != id)
        {
            return BadRequest("Student data is invalid.");
        }

        using var connection = new NpgsqlConnection(_connectionString);
        var query = "UPDATE Students SET Firstname = @Firstname, Lastname = @Lastname, BirthDate = @BirthDate WHERE ID = @Id";
        var affectedRows = await connection.ExecuteAsync(query, student);

        if (affectedRows == 0)
        {
            return NotFound();
        }

        return NoContent();
    }
}