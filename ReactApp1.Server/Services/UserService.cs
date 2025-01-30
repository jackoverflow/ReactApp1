using System.Data;
using System.Threading.Tasks;
using Dapper;
using ReactApp1.Server.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace ReactApp1.Server.Services
{
    public class UserService : IUserService
    {
        private readonly IDbConnection _dbConnection; // Dapper requires an IDbConnection
        private readonly IConfiguration _configuration;  // Add this

        public UserService(IDbConnection dbConnection, IConfiguration configuration)  // Add configuration parameter
        {
            _dbConnection = dbConnection;
            _configuration = configuration;
        }

        public async Task<User?> ValidateUser(string username, string password)
        {
            // Update the query to specify the public schema
            var query = "SELECT * FROM public.Users WHERE Username = @Username"; 
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
            var secretKey = _configuration["JwtSettings:SecretKey"] ?? 
                throw new InvalidOperationException("JWT SecretKey is not configured");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: new[] { new Claim(ClaimTypes.Name, user.Username) },
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<User?> GetUserByUsername(string username)
        {
            var query = "SELECT * FROM public.Users WHERE Username = @Username";
            return await _dbConnection.QuerySingleOrDefaultAsync<User>(query, new { Username = username });
        }

        public async Task CreateUser(User user)
        {
            var query = "INSERT INTO public.Users (Username, PasswordHash) VALUES (@Username, @PasswordHash)";
            await _dbConnection.ExecuteAsync(query, new { Username = user.Username, PasswordHash = user.PasswordHash });
        }
    }
} 