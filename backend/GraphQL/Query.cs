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
    [UseFiltering]
    public IQueryable<TaskModel> GetTasks(
        [Service] IDbContextFactory<AppDbContext> contextFactory,
        int? labelId = null)
    {
        var context = contextFactory.CreateDbContext();
        var query = context.Tasks
            .Include(t => t.Label)
            .OrderByDescending(t => t.CreatedAt)
            .AsNoTracking();

        if (labelId.HasValue)
        {
            query = query.Where(t => t.LabelId == labelId);
        }

        return query;
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

    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<TaskLabel> GetLabels(
        [Service] IDbContextFactory<AppDbContext> contextFactory)
    {
        var context = contextFactory.CreateDbContext();
        return context.TaskLabels.OrderBy(l => l.Name);
    }
}
