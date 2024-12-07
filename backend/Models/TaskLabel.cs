namespace TaskManagementAPI.Models
{
    public class TaskLabel
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public ICollection<TaskModel> Tasks { get; set; } = new List<TaskModel>();
    }
} 