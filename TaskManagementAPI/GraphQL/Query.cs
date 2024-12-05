using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using TaskManagementAPI.Data;
using TaskManagementAPI.Models;

namespace TaskManagementAPI.GraphQL;

public class Query
{
    [UseDbContext(typeof(AppDbContext))]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<TaskModel> GetTasks([Service(ServiceKind.Pooled)] AppDbContext context)
        => context.Tasks.OrderByDescending(t => t.CreatedAt);

    [UseDbContext(typeof(AppDbContext))]
    public async Task<TaskModel?> GetTaskById([Service(ServiceKind.Pooled)] AppDbContext context, int id)
        => await context.Tasks.FindAsync(id);

    [UseDbContext(typeof(AppDbContext))]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<UserPreferencesModel> GetUserPreferences([Service(ServiceKind.Pooled)] AppDbContext context)
        => context.UserPreferences.OrderBy(u => u.UserId);

    [UseDbContext(typeof(AppDbContext))]
    public async Task<UserPreferencesModel?> GetUserPreferencesByUserId(
        [Service(ServiceKind.Pooled)] AppDbContext context,
        string userId)
        => await context.UserPreferences.FirstOrDefaultAsync(u => u.UserId == userId);
}
