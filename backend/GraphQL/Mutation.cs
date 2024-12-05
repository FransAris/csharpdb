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
        string description)
    {
        using var context = contextFactory.CreateDbContext();
        var task = new TaskModel
        {
            Title = title,
            Description = description,
            CreatedAt = DateTime.UtcNow
        };

        context.Tasks.Add(task);
        await context.SaveChangesAsync();

        return task;
    }

    public async Task<TaskModel?> UpdateTask(
        [Service] IDbContextFactory<AppDbContext> contextFactory,
        int id,
        string? title = null,
        string? description = null,
        bool? isCompleted = null)
    {
        using var context = contextFactory.CreateDbContext();
        var task = await context.Tasks.FindAsync(id);
        if (task == null) return null;

        if (title != null)
            task.Title = title;

        if (description != null)
            task.Description = description;

        if (isCompleted.HasValue)
        {
            task.IsCompleted = isCompleted.Value;
            if (isCompleted.Value)
                task.CompletedAt = DateTime.UtcNow;
            else
                task.CompletedAt = null;
        }

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
}
