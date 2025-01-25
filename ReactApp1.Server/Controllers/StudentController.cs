using Dapper;
using Npgsql;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Models;
using ClosedXML.Excel;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

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
        var query = "UPDATE public.Students SET FirstName = @FirstName, LastName = @LastName, DateOfBirth = @DateOfBirth WHERE ID = @Id";
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
        
        var studentsQuery = "SELECT * FROM public.Students";
        var students = await connection.QueryAsync<Student>(studentsQuery);

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Students and Subjects");
        
        // Add headers (removed Student ID)
        worksheet.Cell(1, 1).Value = "First Name";
        worksheet.Cell(1, 2).Value = "Last Name";
        worksheet.Cell(1, 3).Value = "Date of Birth";
        worksheet.Cell(1, 4).Value = "Enrolled Subjects";

        // Apply bold style to header row
        for (int i = 1; i <= 4; i++)
        {
            worksheet.Cell(1, i).Style.Font.Bold = true;
        }

        int row = 2;
        foreach (var student in students)
        {
            var subjectsQuery = @"SELECT s.* FROM public.Subjects s
                                  INNER JOIN public.StudentSubject ss ON s.Id = ss.SubjectId
                                  WHERE ss.StudentId = @StudentId";
            var subjects = await connection.QueryAsync<Subject>(subjectsQuery, new { StudentId = student.Id });

            worksheet.Cell(row, 1).Value = student.FirstName;
            worksheet.Cell(row, 2).Value = student.LastName;
            worksheet.Cell(row, 3).Value = student.DateOfBirth.ToString("yyyy-MM-dd");
            worksheet.Cell(row, 4).Value = string.Join(", ", subjects.Select(s => s.ShortName));
            row++;
        }

        // Adjust column widths to fit the content
        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        var content = stream.ToArray();
        return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Students.xlsx");
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

    [HttpGet("subjects")]
    public async Task<ActionResult<IEnumerable<Subject>>> GetSubjects(
        string searchTerm = "", 
        int pageNumber = 1, 
        int pageSize = 10)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        
        var query = @"SELECT * FROM public.Subjects 
                     WHERE (ShortName ILIKE @SearchPattern OR Description ILIKE @SearchPattern)
                     ORDER BY ShortName ASC
                     OFFSET @Offset LIMIT @Limit";

        var parameters = new DynamicParameters();
        parameters.Add("SearchPattern", $"%{searchTerm}%");
        parameters.Add("Offset", (pageNumber - 1) * pageSize);
        parameters.Add("Limit", pageSize);

        var subjects = await connection.QueryAsync<Subject>(query, parameters);

        return Ok(subjects);
    }

    [HttpGet("subjects/count")]
    public async Task<ActionResult<int>> GetSubjectsCount()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        var count = await connection.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM public.Subjects");
        return Ok(count);
    }

    [HttpDelete("subject/{id}")]
    public async Task<IActionResult> DeleteSubject(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        var affectedRows = await connection.ExecuteAsync(
            "DELETE FROM public.Subjects WHERE Id = @Id", 
            new { Id = id });

        if (affectedRows == 0)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPost("enrol")]
    public async Task<IActionResult> EnrolStudent([FromBody] EnrollmentRequest enrollmentRequest)
    {
        if (enrollmentRequest == null || enrollmentRequest.SubjectIds == null || !enrollmentRequest.SubjectIds.Any())
        {
            return BadRequest("Invalid enrollment data.");
        }

        using var connection = new NpgsqlConnection(_connectionString);
        
        try
        {
            await connection.OpenAsync(); // Ensure the connection is open
            var transaction = await connection.BeginTransactionAsync();

            foreach (var subjectId in enrollmentRequest.SubjectIds)
            {
                var query = "INSERT INTO public.StudentSubject (StudentId, SubjectId) VALUES (@StudentId, @SubjectId)";
                await connection.ExecuteAsync(query, new { StudentId = enrollmentRequest.StudentId, SubjectId = subjectId }, transaction);
            }

            await transaction.CommitAsync();
            return CreatedAtAction(nameof(GetStudent), new { id = enrollmentRequest.StudentId }, null);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("{id}/subjects")]
    public async Task<ActionResult<StudentWithSubjects>> GetStudentWithSubjects(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        
        var studentQuery = "SELECT * FROM public.Students WHERE ID = @Id";
        var student = await connection.QueryFirstOrDefaultAsync<Student>(studentQuery, new { Id = id });

        if (student == null)
        {
            return NotFound();
        }

        var subjectsQuery = @"SELECT s.* FROM public.Subjects s
                              INNER JOIN public.StudentSubject ss ON s.Id = ss.SubjectId
                              WHERE ss.StudentId = @StudentId";
        var subjects = await connection.QueryAsync<Subject>(subjectsQuery, new { StudentId = id });

        return Ok(new StudentWithSubjects
        {
            FirstName = student.FirstName,
            LastName = student.LastName,
            Subjects = subjects.ToList()
        });
    }

    [HttpPut("subject/{id}")]
    public async Task<IActionResult> UpdateSubject(int id, [FromBody] Subject subject)
    {
        if (subject == null || subject.Id != id)
        {
            return BadRequest("Subject data is invalid.");
        }

        using var connection = new NpgsqlConnection(_connectionString);
        var query = "UPDATE public.Subjects SET ShortName = @ShortName, Description = @Description WHERE ID = @Id";
        var affectedRows = await connection.ExecuteAsync(query, subject);

        if (affectedRows == 0)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPut("{studentId}/subjects")]
    public async Task<IActionResult> UpdateStudentSubjects(int studentId, [FromBody] List<int> subjectIds)
    {
        if (subjectIds == null || !subjectIds.Any())
        {
            return BadRequest("No subjects provided.");
        }

        using var connection = new NpgsqlConnection(_connectionString);
        
        try
        {
            await connection.OpenAsync(); // Ensure the connection is open
            var transaction = await connection.BeginTransactionAsync();

            // First, remove all existing subjects for the student
            var deleteQuery = "DELETE FROM public.StudentSubject WHERE StudentId = @StudentId";
            await connection.ExecuteAsync(deleteQuery, new { StudentId = studentId }, transaction);

            // Then, add the new subjects
            foreach (var subjectId in subjectIds)
            {
                var insertQuery = "INSERT INTO public.StudentSubject (StudentId, SubjectId) VALUES (@StudentId, @SubjectId)";
                await connection.ExecuteAsync(insertQuery, new { StudentId = studentId, SubjectId = subjectId }, transaction);
            }

            await transaction.CommitAsync();
            return NoContent(); // Return 204 No Content on successful update
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("students-with-subjects")]
    public async Task<ActionResult<IEnumerable<StudentWithSubjects>>> GetStudentsWithSubjects()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        
        var studentsQuery = "SELECT * FROM public.Students";
        var students = await connection.QueryAsync<Student>(studentsQuery);

        var studentsWithSubjects = new List<StudentWithSubjects>();

        foreach (var student in students)
        {
            var subjectsQuery = @"SELECT s.* FROM public.Subjects s
                                  INNER JOIN public.StudentSubject ss ON s.Id = ss.SubjectId
                                  WHERE ss.StudentId = @StudentId";
            var subjects = await connection.QueryAsync<Subject>(subjectsQuery, new { StudentId = student.Id });

            studentsWithSubjects.Add(new StudentWithSubjects
            {
                FirstName = student.FirstName,
                LastName = student.LastName,
                Subjects = subjects.ToList()
            });
        }

        return Ok(studentsWithSubjects);
    }

    // Create a class to represent the enrollment request
    public class EnrollmentRequest
    {
        public int StudentId { get; set; }
        public List<int> SubjectIds { get; set; } = new List<int>();
    }
}