/*
 * Task Management API
 * 
 * This is the main entry point for the Task Management backend application.
 * It configures and sets up:
 * - GraphQL API with Hot Chocolate
 * - Entity Framework Core with SQLite
 * - CORS, Authentication, and Authorization
 * - WebSocket support for future real-time features
 */

using TaskManagementAPI.Data;
using TaskManagementAPI.GraphQL;
using TaskManagementAPI.GraphQL.Types;
using Microsoft.EntityFrameworkCore;
using HotChocolate.AspNetCore;
using Microsoft.AspNetCore.Cors;

var builder = WebApplication.CreateBuilder(args);

// === Security Configuration ===
// Configure CORS to allow any origin, header, and method
// TODO: In production, restrict this to specific origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevelopmentCors", builder =>
    {
        builder
            .WithOrigins("http://localhost:5173") // Specific Vite dev server
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders("Content-Range"); // Only if we need it for pagination
    });
});

// Add authentication and authorization services
// TODO: Implement proper authentication with JWT or similar
builder.Services.AddAuthorization();
builder.Services.AddAuthentication();

// === Database Configuration ===
// Configure DbContext with connection pooling for better performance
// Using SQLite for development
// TODO: Consider using PostgreSQL or SQL Server for production
builder.Services
    .AddPooledDbContextFactory<AppDbContext>(options =>
        options.UseSqlite("Data Source=tasks.db"));

// === GraphQL Configuration ===
// Set up GraphQL server with Hot Chocolate
// This configures:
// - Query and mutation types
// - Filtering, sorting, and projection capabilities
// - Custom type definitions
// - Development-friendly error details
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddFiltering()
    .AddSorting()
    .AddProjections()
    .AddType<TaskType>()
    .AddType<TaskLabelType>()
    .AddType<UserPreferencesType>()
    .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = true);

var app = builder.Build();

// === Environment-specific Configuration ===
// === Environment-specific Configuration ===
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();    // Detailed error pages in development
    app.UseCors("DevelopmentCors");  // Use our more specific policy
}

// === HTTP Pipeline Configuration ===
// Configure middleware in the correct order
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseWebSockets();
app.UseDefaultFiles();
app.UseStaticFiles();

// === GraphQL Endpoint Configuration ===
// Set up the GraphQL endpoint with Banana UI for testing
app.MapGraphQL();

// Start the application
app.Run();
