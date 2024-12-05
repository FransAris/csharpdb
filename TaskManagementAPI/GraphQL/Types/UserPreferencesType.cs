using HotChocolate.Types;
using TaskManagementAPI.Models;

namespace TaskManagementAPI.GraphQL.Types;

public class UserPreferencesType : ObjectType<UserPreferencesModel>
{
    protected override void Configure(IObjectTypeDescriptor<UserPreferencesModel> descriptor)
    {
        descriptor.Description("Represents user preferences in the system");

        descriptor.Field(u => u.Id)
            .Description("The unique identifier of the user preferences");

        descriptor.Field(u => u.UserId)
            .Description("The unique identifier of the user");

        descriptor.Field(u => u.Theme)
            .Description("The user's preferred theme (light/dark)");

        descriptor.Field(u => u.Language)
            .Description("The user's preferred language");

        descriptor.Field(u => u.EmailNotifications)
            .Description("Whether the user has enabled email notifications");

        descriptor.Field(u => u.LastUpdated)
            .Description("The date and time when the preferences were last updated");
    }
}
