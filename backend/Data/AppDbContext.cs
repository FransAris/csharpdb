using Microsoft.EntityFrameworkCore;
using TaskManagementAPI.Models;

namespace TaskManagementAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<TaskModel> Tasks => Set<TaskModel>();
    public DbSet<UserPreferencesModel> UserPreferences => Set<UserPreferencesModel>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure TaskModel
        modelBuilder.Entity<TaskModel>()
            .HasKey(t => t.Id);

        modelBuilder.Entity<TaskModel>()
            .Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(200);

        modelBuilder.Entity<TaskModel>()
            .Property(t => t.Description)
            .HasMaxLength(1000);

        // Configure UserPreferencesModel
        modelBuilder.Entity<UserPreferencesModel>()
            .HasKey(u => u.Id);

        modelBuilder.Entity<UserPreferencesModel>()
            .Property(u => u.UserId)
            .IsRequired()
            .HasMaxLength(50);

        modelBuilder.Entity<UserPreferencesModel>()
            .Property(u => u.Theme)
            .HasMaxLength(20);

        modelBuilder.Entity<UserPreferencesModel>()
            .Property(u => u.Language)
            .HasMaxLength(10);
    }
}
