using Microsoft.Extensions.DependencyInjection;

namespace ReactApp1.Server
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            // No DbContext registration needed since using Dapper
            // Other service registrations...
        }
    }
} 