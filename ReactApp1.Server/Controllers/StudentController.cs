using Dapper;
using Npgsql;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Models;
using ClosedXML.Excel;

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
        var students = await connection.QueryAsync<Student>("SELECT * FROM public.Students");
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
            var query = "INSERT INTO public.Students (Firstname, Lastname, BirthDate) VALUES (@Firstname, @Lastname, @BirthDate) RETURNING *";
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
        var students = await connection.QueryAsync<Student>("SELECT * FROM public.Students");

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Students");

        // Add headers and style them
        var headers = new[] { "ID", "Firstname", "Lastname", "BirthDate" };
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
            worksheet.Cell(row, 1).Value = student.ID;
            worksheet.Cell(row, 2).Value = student.Firstname;
            worksheet.Cell(row, 3).Value = student.Lastname;
            worksheet.Cell(row, 4).Value = student.BirthDate.ToString("yyyy-MM-dd");
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
}