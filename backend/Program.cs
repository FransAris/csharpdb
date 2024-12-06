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

var builder = WebApplication.CreateBuilder(args);

// === Security Configuration ===
// === Security Configuration ===
// Configure CORS to allow any origin, header, and method
// TODO: In production, restrict this to specific origins
// TODO: In production, restrict this to specific origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

// Add authentication and authorization services
// TODO: Implement proper authentication with JWT or similar
// TODO: Implement proper authentication with JWT or similar
builder.Services.AddAuthorization();
builder.Services.AddAuthentication();

// === Database Configuration ===
// Configure DbContext with connection pooling for better performance
// Using SQLite for development
// TODO: Consider using PostgreSQL or SQL Server for production
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
// === GraphQL Configuration ===
// Set up GraphQL server with Hot Chocolate
// This configures:
// - Query and mutation types
// - Filtering, sorting, and projection capabilities
// - Custom type definitions
// - Development-friendly error details
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()              // Base queries
    .AddMutationType<Mutation>()        // Data modifications
    .AddFiltering()                     // Enable field-level filtering
    .AddSorting()                       // Enable result sorting
    .AddProjections()                   // Optimize query selections
    .AddType<TaskType>()               // Task entity schema
    .AddType<UserPreferencesType>()    // User preferences schema
    .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = true);  // Development-only

var app = builder.Build();

// === Environment-specific Configuration ===
// === Environment-specific Configuration ===
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();    // Detailed error pages in development
    app.UseDeveloperExceptionPage();    // Detailed error pages in development
}

// === HTTP Pipeline Configuration ===
// Configure middleware in the correct order
app.UseRouting();                // Enable endpoint routing
app.UseDefaultFiles();           // Serve index.html by default
app.UseStaticFiles();           // Enable serving static files
app.UseWebSockets();            // Enable WebSocket support for future real-time features
app.UseCors("AllowAll");
app.UseAuthentication();        // Handle authentication
app.UseAuthorization();         // Handle authorization

// === GraphQL Endpoint Configuration ===
// Set up the GraphQL endpoint with Banana UI for testing
// === GraphQL Endpoint Configuration ===
// Set up the GraphQL endpoint with Banana UI for testing
app.MapGraphQL()
    .WithOptions(new GraphQLServerOptions
    {
        Tool = { 
            Enable = true,                      // Enable GraphQL playground
            Title = "Task Management API",      // UI title
            GraphQLEndpoint = "/graphql"        // API endpoint path
        },
        EnableGetRequests = true,              // Support GET requests for queries
        EnableSchemaRequests = true            // Enable schema introspection
    });

// Start the application
app.Run();
