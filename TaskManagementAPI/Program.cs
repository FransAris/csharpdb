using TaskManagementAPI.Data;
using TaskManagementAPI.GraphQL;
using TaskManagementAPI.GraphQL.Types;
using Microsoft.EntityFrameworkCore;
using HotChocolate.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Configure CORS to allow any origin, header, and method
// This is suitable for development but should be restricted in production
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add authentication and authorization services
// These will be configured properly when we implement user authentication
builder.Services.AddAuthorization();
builder.Services.AddAuthentication();

// Configure DbContext with pooling for better performance
// Using SQLite for development; consider using PostgreSQL or SQL Server for production
builder.Services
    .AddPooledDbContextFactory<AppDbContext>(options =>
        options.UseSqlite("Data Source=tasks.db"));

// Configure GraphQL server with Hot Chocolate
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()              // Add query operations
    .AddMutationType<Mutation>()        // Add mutation operations
    .AddFiltering()                     // Enable filtering support
    .AddSorting()                       // Enable sorting support
    .AddProjections()                   // Enable projections for efficient queries
    .AddType<TaskType>()               // Register task type
    .AddType<UserPreferencesType>()    // Register user preferences type
    .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = true);  // Show detailed errors in development

var app = builder.Build();

// Enable developer exception page in development
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Configure the HTTP request pipeline
app.UseRouting();                // Enable routing
app.UseDefaultFiles();           // Serve default files
app.UseStaticFiles();           // Enable static file serving
app.UseWebSockets();            // Enable WebSocket support for subscriptions
app.UseCors();                  // Enable CORS
app.UseAuthentication();        // Enable authentication
app.UseAuthorization();         // Enable authorization

// Configure GraphQL endpoint with Banana UI
app.MapGraphQL()
    .WithOptions(new GraphQLServerOptions
    {
        Tool = { 
            Enable = true,                      // Enable GraphQL UI
            Title = "Task Management API",      // Set UI title
            GraphQLEndpoint = "/graphql"        // Set endpoint path
        },
        EnableGetRequests = true,              // Allow GET requests
        EnableSchemaRequests = true            // Enable introspection
    });

app.Run();
