using TaskManagementAPI.Data;
using TaskManagementAPI.GraphQL;
using TaskManagementAPI.GraphQL.Types;
using Microsoft.EntityFrameworkCore;
using HotChocolate.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddAuthorization();
builder.Services.AddAuthentication();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=tasks.db"));

builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddFiltering()
    .AddSorting()
    .AddProjections()
    .AddType<TaskType>()
    .AddType<UserPreferencesType>()
    .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = true);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting();
app.UseStaticFiles();
app.UseWebSockets();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapGraphQL()
    .WithOptions(new GraphQLServerOptions
    {
        Tool = { Enable = true },
        EnableGetRequests = true
    });

app.Run();
