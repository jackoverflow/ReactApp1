using System.Threading.Tasks;
using ReactApp1.Server.Models;

namespace ReactApp1.Server.Services
{
    public interface IUserService
    {
        Task<User> ValidateUser(string username, string password);
        Task<User> GetUserByUsername(string username);
        Task CreateUser(User user);
        string GenerateToken(User user);
    }
} 