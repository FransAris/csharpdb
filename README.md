# Task Management System

A modern task management system built with .NET Core and GraphQL, featuring user preferences and push notifications support.

## Technology Stack

- **Backend**: .NET Core 9.0 with Hot Chocolate GraphQL
- **Database**: SQLite
- **API**: GraphQL with built-in Banana UI
- **Future Frontend**: React with Apollo Client (coming soon)
- **Future CMS**: Strapi (planned)

## Features

- GraphQL API with mutations and queries
- Task management (create, read, update, delete)
- User preferences system
- Built-in GraphQL playground (Banana UI)
- Pagination, filtering, and sorting support
- Proper timestamp handling for task creation and completion

## Getting Started

### Prerequisites

- .NET 9.0 SDK
- An IDE (Visual Studio Code, Visual Studio, or Rider)

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd csharpbackend
   ```

2. Navigate to the API project:
   ```bash
   cd TaskManagementAPI
   ```

3. Restore dependencies:
   ```bash
   dotnet restore
   ```

4. Run the application:
   ```bash
   dotnet run
   ```

The API will start on `http://localhost:5001` by default.

### GraphQL Endpoint

The GraphQL endpoint and UI are available at:
- GraphQL Playground (Banana UI): http://localhost:5001/graphql
- GraphQL API Endpoint: http://localhost:5001/graphql

### Example Queries

1. Create a task:
```graphql
mutation CreateTask {
  addTask(
    title: "Test Task"
    description: "Task description"
  ) {
    id
    title
    description
    isCompleted
    createdAt
  }
}
```

2. Query tasks:
```graphql
query GetAllTasks {
  tasks {
    nodes {
      id
      title
      description
      isCompleted
      createdAt
      completedAt
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
```

## Project Structure

- `TaskManagementAPI/`: Main API project
  - `Data/`: Database context and configurations
  - `GraphQL/`: GraphQL types, queries, and mutations
  - `Models/`: Domain models
  - `Program.cs`: Application configuration and startup

## Development Notes

- The application uses port 5001 by default, but this can be configured in `Properties/launchSettings.json`
- SQLite database is created automatically on first run
- GraphQL UI is enabled in development mode

## Future Enhancements

- React frontend integration
- Strapi CMS integration
- Push notification system
- Enhanced user preferences
- Authentication and authorization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 