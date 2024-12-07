using HotChocolate.Types;
using TaskManagementAPI.Models;

namespace TaskManagementAPI.GraphQL.Types;

public class TaskStateType : EnumType<TaskState>
{
    protected override void Configure(IEnumTypeDescriptor<TaskState> descriptor)
    {
        descriptor.Name("TaskState");
        descriptor.Value(TaskState.TODO).Name("TODO");
        descriptor.Value(TaskState.IN_PROGRESS).Name("IN_PROGRESS");
        descriptor.Value(TaskState.DONE).Name("DONE");
    }
} 