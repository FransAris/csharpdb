namespace TaskManagementAPI.Models;

public class UserPreferencesModel
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Theme { get; set; } = "light";
    public string Language { get; set; } = "en";
    public bool EmailNotifications { get; set; } = true;
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}
