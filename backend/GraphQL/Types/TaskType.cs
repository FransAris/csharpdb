using HotChocolate.Types;
using TaskManagementAPI.Models;

namespace TaskManagementAPI.GraphQL.Types;

public class TaskType : ObjectType<TaskModel>
{
    protected override void Configure(IObjectTypeDescriptor<TaskModel> descriptor)
    {
        descriptor.Description("Represents a task in the system");

        descriptor.Field(t => t.Id)
            .Description("The unique identifier of the task");

        descriptor.Field(t => t.Title)
            .Description("The title of the task");

        descriptor.Field(t => t.Description)
            .Description("The detailed description of the task");

        descriptor.Field(t => t.IsCompleted)
            .Description("Indicates whether the task is completed");

        descriptor.Field(t => t.CreatedAt)
            .Description("The date and time when the task was created");

        descriptor.Field(t => t.CompletedAt)
            .Description("The date and time when the task was completed");
    }
}
