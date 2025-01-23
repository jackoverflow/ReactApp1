using Dapper;
using Npgsql;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Models;
using ClosedXML.Excel;
using System.Collections.Generic;
using System.Threading.Tasks;

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
    public async Task<ActionResult<IEnumerable<Student>>> GetStudents(int pageNumber = 1, int pageSize = 10)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        
        var students = await connection.QueryAsync<Student>(
            "SELECT * FROM public.Students ORDER BY Lastname ASC OFFSET @Offset LIMIT @Limit",
            new { Offset = (pageNumber - 1) * pageSize, Limit = pageSize });

        return Ok(students);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetStudent(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        var student = await connection.QueryFirstOrDefaultAsync<Student>(
            "SELECT * FROM public.Students WHERE ID = @Id", new { Id = id });

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
            var query = "INSERT INTO public.Students (FirstName, LastName, DateOfBirth) VALUES (@FirstName, @LastName, @DateOfBirth) RETURNING *";
            var addedStudent = await connection.QuerySingleAsync<Student>(query, student);

            return CreatedAtAction(nameof(GetStudent), new { id = addedStudent.Id }, addedStudent);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(int id, [FromBody] Student student)
    {
        if (student == null || student.Id != id)
        {
            return BadRequest("Student data is invalid.");
        }

        using var connection = new NpgsqlConnection(_connectionString);
        var query = "UPDATE public.Students SET Firstname = @Firstname, Lastname = @Lastname, BirthDate = @BirthDate WHERE ID = @Id";
        var affectedRows = await connection.ExecuteAsync(query, student);

        if (affectedRows == 0)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        var affectedRows = await connection.ExecuteAsync("DELETE FROM public.Students WHERE ID = @Id", new { Id = id });

        if (affectedRows == 0)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpGet("generate-excel")]
    public async Task<IActionResult> GenerateExcel()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        var students = await connection.QueryAsync<Student>("SELECT * FROM public.Students ORDER BY Lastname ASC");

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Students");

        // Add headers and style them
        var headers = new[] { "Firstname", "Lastname", "BirthDate" };
        for (int i = 0; i < headers.Length; i++)
        {
            var cell = worksheet.Cell(1, i + 1);
            cell.Value = headers[i];
            cell.Style.Font.Bold = true;
        }

        // Add student data
        var row = 2;
        foreach (var student in students)
        {
            worksheet.Cell(row, 1).Value = student.FirstName;
            worksheet.Cell(row, 2).Value = student.LastName;
            worksheet.Cell(row, 3).Value = student.DateOfBirth.ToString("MMM-dd-yyyy");
            row++;
        }

        // Auto-fit columns
        worksheet.Columns().AdjustToContents();

        // Add 5 characters width to all columns except ID
        for (int i = 2; i <= 4; i++)
        {
            var column = worksheet.Column(i);
            column.Width = column.Width + 5;
        }

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        stream.Position = 0;

        return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Students.xlsx");
    }

    [HttpGet("count")]
    public async Task<ActionResult<int>> GetStudentCount()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        var count = await connection.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM public.Students");
        return Ok(count);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Student>>> SearchStudent(
        string searchTerm = "", 
        int pageNumber = 1, 
        int pageSize = 10)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        
        var query = @"SELECT * FROM public.Students 
                     WHERE (FirstName ILIKE @SearchPattern OR LastName ILIKE @SearchPattern)
                     ORDER BY LastName ASC
                     OFFSET @Offset LIMIT @Limit";

        var parameters = new DynamicParameters();
        parameters.Add("SearchPattern", $"%{searchTerm}%");
        parameters.Add("Offset", (pageNumber - 1) * pageSize);
        parameters.Add("Limit", pageSize);

        var students = await connection.QueryAsync<Student>(query, parameters);

        return Ok(students);
    }

    [HttpPost("subject")]
    public async Task<IActionResult> AddSubject([FromBody] Subject subject)
    {
        if (subject == null)
        {
            return BadRequest("Subject data is null.");
        }

        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            var query = "INSERT INTO public.Subjects (ShortName, Description) VALUES (@ShortName, @Description) RETURNING *";
            var addedSubject = await connection.QuerySingleAsync<Subject>(query, subject);

            return CreatedAtAction(nameof(GetSubjectById), new { id = addedSubject.Id }, addedSubject);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("subject/{id}")]
    public async Task<ActionResult<Subject>> GetSubjectById(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        var subject = await connection.QueryFirstOrDefaultAsync<Subject>(
            "SELECT * FROM public.Subjects WHERE ID = @Id", new { Id = id });

        if (subject == null)
        {
            return NotFound();
        }
        return subject;
    }
}