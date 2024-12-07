using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using TaskManagementAPI.Data;
using TaskManagementAPI.Models;

namespace TaskManagementAPI.GraphQL;

public class Mutation
{
    public async Task<TaskModel> AddTask(
        [Service] IDbContextFactory<AppDbContext> contextFactory,
        string title,
        string description,
        int? labelId = null)
    {
        using var context = contextFactory.CreateDbContext();
        var task = new TaskModel
        {
            Title = title,
            Description = description,
            CreatedAt = DateTime.UtcNow,
            LabelId = labelId
        };

        context.Tasks.Add(task);
        await context.SaveChangesAsync();

        return task;
    }

    public async Task<TaskModel?> UpdateTask(
        [Service] IDbContextFactory<AppDbContext> contextFactory,
        int id,
        bool isCompleted)
    {
        using var context = contextFactory.CreateDbContext();
        var task = await context.Tasks
            .Include(t => t.Label)  // Include the label relationship
            .FirstOrDefaultAsync(t => t.Id == id);
        
        if (task == null) return null;

        task.IsCompleted = isCompleted;
        if (isCompleted)
            task.CompletedAt = DateTime.UtcNow;
        else
            task.CompletedAt = null;

        await context.SaveChangesAsync();
        return task;
    }

    public async Task<bool> DeleteTask(
        [Service] IDbContextFactory<AppDbContext> contextFactory,
        int id)
    {
        using var context = contextFactory.CreateDbContext();
        var task = await context.Tasks.FindAsync(id);
        if (task == null) return false;

        context.Tasks.Remove(task);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<UserPreferencesModel> AddOrUpdateUserPreferences(
        [Service] IDbContextFactory<AppDbContext> contextFactory,
        string userId,
        string? theme = null,
        string? language = null,
        bool? emailNotifications = null)
    {
        using var context = contextFactory.CreateDbContext();
        var preferences = await context.UserPreferences
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (preferences == null)
        {
            preferences = new UserPreferencesModel
            {
                UserId = userId,
                Theme = theme ?? "light",
                Language = language ?? "en",
                EmailNotifications = emailNotifications ?? true,
                LastUpdated = DateTime.UtcNow
            };
            context.UserPreferences.Add(preferences);
        }
        else
        {
            if (theme != null)
                preferences.Theme = theme;
            if (language != null)
                preferences.Language = language;
            if (emailNotifications.HasValue)
                preferences.EmailNotifications = emailNotifications.Value;
            
            preferences.LastUpdated = DateTime.UtcNow;
        }

        await context.SaveChangesAsync();
        return preferences;
    }

    public async Task<TaskLabel> AddLabel(
        [Service] IDbContextFactory<AppDbContext> contextFactory,
        string name,
        string? description = null)
    {
        using var context = contextFactory.CreateDbContext();
        var label = new TaskLabel
        {
            Name = name,
            Description = description,
            CreatedAt = DateTime.UtcNow
        };

        context.TaskLabels.Add(label);
        await context.SaveChangesAsync();
        return label;
    }

    public async Task<TaskModel> SetTaskLabel(
        [Service] IDbContextFactory<AppDbContext> contextFactory,
        int taskId,
        int? labelId)
    {
        using var context = contextFactory.CreateDbContext();
        var task = await context.Tasks.FindAsync(taskId);
        if (task == null) throw new GraphQLException("Task not found");

        task.LabelId = labelId;
        await context.SaveChangesAsync();
        return task;
    }

    public async Task<bool> ClearAllData(
        [Service] IDbContextFactory<AppDbContext> contextFactory)
    {
        using var context = contextFactory.CreateDbContext();
        context.Tasks.RemoveRange(context.Tasks);
        context.TaskLabels.RemoveRange(context.TaskLabels);
        await context.SaveChangesAsync();
        return true;
    }
}
