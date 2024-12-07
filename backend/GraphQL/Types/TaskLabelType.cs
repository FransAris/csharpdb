using HotChocolate.Types;
using TaskManagementAPI.Models;

namespace TaskManagementAPI.GraphQL.Types
{
    public class TaskLabelType : ObjectType<TaskLabel>
    {
        protected override void Configure(IObjectTypeDescriptor<TaskLabel> descriptor)
        {
            descriptor.Field(t => t.Id).Type<NonNullType<IntType>>();
            descriptor.Field(t => t.Name).Type<NonNullType<StringType>>();
            descriptor.Field(t => t.Description).Type<StringType>();
            descriptor.Field(t => t.Color).Type<NonNullType<StringType>>();
            descriptor.Field(t => t.CreatedAt).Type<NonNullType<DateTimeType>>();
            descriptor.Field(t => t.Tasks).Type<ListType<TaskType>>();
        }
    }
} 