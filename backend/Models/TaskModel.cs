using System;

namespace TaskManagementAPI.Models;

public enum TaskState
{
    TODO,
    IN_PROGRESS,
    DONE
}

public class TaskModel
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    public int? LabelId { get; set; }
    public virtual TaskLabel? Label { get; set; }
    public TaskState Status { get; set; } = TaskState.TODO;
    public DateTime? LastModified { get; set; }
}
