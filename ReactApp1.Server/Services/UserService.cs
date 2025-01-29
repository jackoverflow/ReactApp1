using System.Data;
using System.Threading.Tasks;
using Dapper;
using ReactApp1.Server.Models;

public class UserService : IUserService
{
    private readonly IDbConnection _dbConnection; // Dapper requires an IDbConnection

    public UserService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<User> ValidateUser(string username, string password)
    {
        // Query to get the user by username
        var query = "SELECT * FROM Users WHERE Username = @Username";
        var user = await _dbConnection.QuerySingleOrDefaultAsync<User>(query, new { Username = username });

        // Check if user exists and verify password
        if (user == null || !VerifyPassword(password, user.PasswordHash))
        {
            return null; // Invalid credentials
        }
        return user; // Valid user
    }

    private bool VerifyPassword(string password, string passwordHash)
    {
        // Implement your password verification logic here (e.g., using BCrypt)
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }

    public string GenerateToken(User user)
    {
        // Implement your token generation logic here (e.g., using JWT)
        // Example token generation logic can be added here
    }

    public async Task<User> GetUserByUsername(string username)
    {
        var query = "SELECT * FROM Users WHERE Username = @Username";
        return await _dbConnection.QuerySingleOrDefaultAsync<User>(query, new { Username = username });
    }

    public async Task CreateUser(User user)
    {
        var query = "INSERT INTO Users (Username, PasswordHash) VALUES (@Username, @PasswordHash)";
        await _dbConnection.ExecuteAsync(query, new { Username = user.Username, PasswordHash = user.PasswordHash });
    }
} 