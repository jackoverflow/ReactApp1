using Npgsql;
using Dapper;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Configure CORS to allow requests from any origin
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Initialize the database
Initialize(app.Configuration.GetConnectionString("DefaultConnection") ?? 
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found."));

app.UseDefaultFiles();
app.UseStaticFiles();

// Use CORS
app.UseCors("AllowAllOrigins");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

void Initialize(string connectionString)
{
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new ArgumentNullException(nameof(connectionString), "Connection string cannot be null or empty.");
    }

    using var connection = new NpgsqlConnection(connectionString);
    
    // Check if the tables exist and drop them
    var tableExists = connection.QueryFirstOrDefault<bool>(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'students')");
    
    if (tableExists)
    {
        // Drop the existing tables
        connection.Execute("DROP TABLE IF EXISTS public.StudentSubject CASCADE;");
        connection.Execute("DROP TABLE IF EXISTS public.Subjects CASCADE;");
        connection.Execute("DROP TABLE IF EXISTS public.Students CASCADE;");
    }

    // Read and execute the SQL script to create tables
    var script = File.ReadAllText("Database/InitialSchema.sql");
    connection.Execute(script);
    Console.WriteLine("Database initialized successfully.");
}
