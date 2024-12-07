# Task Management Backend

.NET backend for our task app. Pretty standard stuff - GraphQL API with Hot Chocolate, EF Core, and SQLite because no need for complex DB setup for a personal (local!) project.

## Stack

- .NET 7
- Hot Chocolate (GraphQL)
- Entity Framework Core
- SQLite

## Features (amazing)

- GraphQL API
- Basic CRUD for tasks and labels
- Real-time updates (well, as real-time as polling gets)
- Task state management (todo/in-progress/done)
- Label system that actually works

## Quick Start

Just run:
```bash
dotnet run
```

That's it. EF Core will create the DB and everything.

## Project Structure

```
backend/
├── GraphQL/       # Schema, resolvers, etc
├── Models/        # EF Core models
├── Data/          # DB context
└── Program.cs     # The usual
```

## Dev Notes

- GraphQL playground at http://localhost:5001/graphql
- SQLite DB is created as tasks.db
- CORS is wide open because local dev
- No auth because personal project

## Future Ideas

- Proper PostgreSQL when needed
- Real WebSocket subscriptions
- Auth if it is ever deployed in public (which it won't be)
- Better error handling (and logging)