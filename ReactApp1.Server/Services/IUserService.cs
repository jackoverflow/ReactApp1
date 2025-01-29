using System.Threading.Tasks;
using ReactApp1.Server.Models;

public interface IUserService
{
    Task<User> ValidateUser(string username, string password);
    Task<User> GetUserByUsername(string username);
    Task CreateUser(User user);
    string GenerateToken(User user);
} 