using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using TaskManagementAPI.Data;
using TaskManagementAPI.Models;

namespace TaskManagementAPI.GraphQL;

public class Query
{
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<TaskModel> GetTasks([Service] IDbContextFactory<AppDbContext> contextFactory)
    {
        var context = contextFactory.CreateDbContext();
        return context.Tasks.OrderByDescending(t => t.CreatedAt);
    }

    public async Task<TaskModel?> GetTaskById(
        [Service] IDbContextFactory<AppDbContext> contextFactory,
        int id)
    {
        using var context = contextFactory.CreateDbContext();
        return await context.Tasks.FindAsync(id);
    }

    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<UserPreferencesModel> GetUserPreferences(
        [Service] IDbContextFactory<AppDbContext> contextFactory)
    {
        var context = contextFactory.CreateDbContext();
        return context.UserPreferences.OrderBy(u => u.UserId);
    }

    public async Task<UserPreferencesModel?> GetUserPreferencesByUserId(
        [Service] IDbContextFactory<AppDbContext> contextFactory,
        string userId)
    {
        using var context = contextFactory.CreateDbContext();
        return await context.UserPreferences.FirstOrDefaultAsync(u => u.UserId == userId);
    }
}
