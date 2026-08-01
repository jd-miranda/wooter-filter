using Amazon.Lambda.Core;
using Amazon.Lambda.RuntimeSupport;
using Amazon.Lambda.Serialization.SystemTextJson;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Model;
using Server.Services;
using Server.Services.Extensions;
using Server.Services.Interfaces;

var services = new ServiceCollection();

// TODO: Secrets Manager

var builder = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddUserSecrets<Program>()
    .AddEnvironmentVariables();

if (Environment.GetEnvironmentVariable("AWS_LAMBDA_RUNTIME_API")?.Contains("localhost") is true or null)
{
    builder.AddInMemoryCollection(new Dictionary<string, string?>
    {
        ["ConnectionStrings:DefaultConnection"] = "Server=(localdb)\\MSSQLLocalDB;Database=ComputerComparator;Trusted_Connection=True;"
    });
}

var configuration = builder.Build();

services.AddDbContext<WootComputersSourceContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

services.AddScoped<WootService>();
services.AddScoped<IWootClient, WootClient>();
services.AddHttpClient<WootClient>();

services.AddSingleton<IConfiguration>(configuration);

var serviceProvider = services.BuildServiceProvider();

var handler = async (string s, ILambdaContext context) =>
{
    using var scope = serviceProvider.CreateScope();

    var service = scope.ServiceProvider.GetRequiredService<WootService>();

    try
    {
        // Setup and Intermediate operations.
        await service
            .WithWootComputersFeedAsync()
            .BuildWootOffersFromFeedAsync();

        // Terminal operations.
        await service.AddNewOffersAsync();
        await service.UpdateSoldOutStatusAsync();
    }
    catch (Exception)
    {
        // TODO
    }

    return s.ToUpper();
};

var serializer = new DefaultLambdaJsonSerializer();

// Build the Lambda runtime client passing in the handler to call for each
// event and the JSON serializer to use for translating Lambda JSON documents
// to .NET types.
await LambdaBootstrapBuilder.Create(handler, serializer).Build().RunAsync();
