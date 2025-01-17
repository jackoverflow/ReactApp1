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
Initialize(app.Configuration.GetConnectionString("DefaultConnection"));

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
    using var connection = new NpgsqlConnection(connectionString);
    
    // Check if the table exists
    var tableExists = connection.QueryFirstOrDefault<bool>(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'students')");
    
    if (!tableExists)
    {
        var script = File.ReadAllText("Database/InitialSchema.sql");
        script = script.Replace("CREATE TABLE ", "CREATE TABLE public.");
        connection.Execute(script);
        Console.WriteLine("Database initialized successfully.");
    }
    else
    {
        Console.WriteLine("Tables already exist. Skipping initialization.");
    }
}
