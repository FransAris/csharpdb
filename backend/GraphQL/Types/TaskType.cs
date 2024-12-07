using HotChocolate.Types;
using TaskManagementAPI.Models;
using TaskManagementAPI.Data;
using Microsoft.EntityFrameworkCore;
using HotChocolate;

namespace TaskManagementAPI.GraphQL.Types;

public class TaskType : ObjectType<TaskModel>
{
    protected override void Configure(IObjectTypeDescriptor<TaskModel> descriptor)
    {
        descriptor.Field(t => t.Id).Type<NonNullType<IdType>>();
        descriptor.Field(t => t.Title).Type<NonNullType<StringType>>();
        descriptor.Field(t => t.Description).Type<StringType>();
        descriptor.Field(t => t.IsCompleted).Type<NonNullType<BooleanType>>();
        descriptor.Field(t => t.CreatedAt).Type<NonNullType<DateTimeType>>();
        descriptor.Field(t => t.CompletedAt).Type<DateTimeType>();
        descriptor.Field(t => t.LabelId).Type<IntType>();
        descriptor.Field(t => t.Label)
            .ResolveWith<Resolvers>(r => r.GetLabel(default!, default!));
    }

    private class Resolvers
    {
        public TaskLabel? GetLabel([Parent] TaskModel task, [Service] IDbContextFactory<AppDbContext> contextFactory)
        {
            using var context = contextFactory.CreateDbContext();
            return context.TaskLabels.FirstOrDefault(l => l.Id == task.LabelId);
        }
    }
}
