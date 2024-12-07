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
        descriptor.Field(t => t.Id).Type<NonNullType<IntType>>();
        descriptor.Field(t => t.Title).Type<NonNullType<StringType>>();
        descriptor.Field(t => t.Description).Type<StringType>();
        descriptor.Field(t => t.Status).Type<NonNullType<EnumType<TaskState>>>();
        descriptor.Field(t => t.IsCompleted).Type<NonNullType<BooleanType>>();
        descriptor.Field(t => t.CreatedAt).Type<NonNullType<DateTimeType>>();
        descriptor.Field(t => t.CompletedAt).Type<DateTimeType>();
        descriptor.Field(t => t.LastModified).Type<DateTimeType>();
        descriptor.Field(t => t.LabelId).Type<IntType>();
        descriptor.Field(t => t.Label).Type<TaskLabelType>()
            .ResolveWith<Resolvers>(r => r.GetLabel(default!));
    }

    private class Resolvers
    {
        public TaskLabel? GetLabel([Parent] TaskModel task)
        {
            return task.Label;
        }
    }
}
