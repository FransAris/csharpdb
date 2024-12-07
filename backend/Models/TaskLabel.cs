namespace TaskManagementAPI.Models
{
    public class TaskLabel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Color { get; set; } = "#CCCCCC"; // Default color
        public DateTime CreatedAt { get; set; }
        
        // Navigation property
        public virtual ICollection<TaskModel> Tasks { get; set; } = new List<TaskModel>();
    }
} 