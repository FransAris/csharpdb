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
        string status = "TODO",
        int? labelId = null)
    {
        using var context = contextFactory.CreateDbContext();
        
        try
        {
            var taskStatus = Enum.Parse<TaskState>(status, ignoreCase: true);

            var task = new TaskModel
            {
                Title = title,
                Description = description,
                CreatedAt = DateTime.UtcNow,
                Status = taskStatus,
                LabelId = labelId,
                LastModified = DateTime.UtcNow
            };

            context.Tasks.Add(task);
            await context.SaveChangesAsync();

            if (task.LabelId.HasValue)
            {
                await context.Entry(task)
                    .Reference(t => t.Label)
                    .LoadAsync();
            }

            return await context.Tasks
                .Include(t => t.Label)
                .FirstAsync(t => t.Id == task.Id);
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Failed to create task: {ex.Message}", ex);
        }
    }

    public async Task<TaskModel?> UpdateTask(
        [Service] IDbContextFactory<AppDbContext> contextFactory,
        int id,
        string status)
    {
        using var context = contextFactory.CreateDbContext();
        var task = await context.Tasks
            .Include(t => t.Label)
            .FirstOrDefaultAsync(t => t.Id == id);
            
        if (task == null) throw new GraphQLException("Task not found");

        var taskStatus = Enum.Parse<TaskState>(status, ignoreCase: true);
        task.Status = taskStatus;
        task.LastModified = DateTime.UtcNow;
        
        await context.SaveChangesAsync();

        // Ensure label is loaded
        if (task.LabelId.HasValue && task.Label == null)
        {
            await context.Entry(task)
                .Reference(t => t.Label)
                .LoadAsync();
        }

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
        string? description = null,
        string? color = null)
    {
        using var context = contextFactory.CreateDbContext();
        var label = new TaskLabel
        {
            Name = name,
            Description = description,
            Color = color ?? "#CCCCCC",
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

    public async Task<TaskModel> UpdateTaskDetails(
        [Service] IDbContextFactory<AppDbContext> contextFactory,
        int id,
        string? title,
        string? description,
        TaskState? status,
        int? labelId)
    {
        using var context = contextFactory.CreateDbContext();
        var task = await context.Tasks
            .Include(t => t.Label)
            .FirstOrDefaultAsync(t => t.Id == id);
            
        if (task == null) throw new Exception("Task not found");

        if (title != null) task.Title = title;
        if (description != null) task.Description = description;
        if (status.HasValue) task.Status = status.Value;
        if (labelId.HasValue) task.LabelId = labelId.Value;
        
        task.LastModified = DateTime.UtcNow;
        
        await context.SaveChangesAsync();
        return task;
    }

    public async Task<TaskModel> UpdateTaskStatus(
        [Service] IDbContextFactory<AppDbContext> contextFactory,
        int id,
        string status)
    {
        using var context = contextFactory.CreateDbContext();
        var task = await context.Tasks
            .Include(t => t.Label)
            .FirstOrDefaultAsync(t => t.Id == id);
            
        if (task == null) throw new GraphQLException("Task not found");

        try
        {
            var taskStatus = Enum.Parse<TaskState>(status, ignoreCase: true);
            task.Status = taskStatus;
            task.LastModified = DateTime.UtcNow;
            
            await context.SaveChangesAsync();
            return task;
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Failed to update task status: {ex.Message}", ex);
        }
    }
}
