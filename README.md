# Task Management System

A modern, full-stack task management system built with .NET Core backend (GraphQL) and Vue.js frontend. Features a clean, responsive UI and real-time task management capabilities.

## 🚀 Technology Stack

### Backend
- **.NET Core 9.0** with Hot Chocolate GraphQL
- **SQLite** database
- **GraphQL API** with built-in Banana UI for testing

### Frontend
- **Vue.js 3** with TypeScript
- **Tailwind CSS** for styling
- **Apollo Client** for GraphQL integration
- **Vite** for development and building

## ✨ Features

- **Task Management**
  - Create, read, update, and delete tasks
  - Mark tasks as complete/incomplete
  - Task filtering and sorting
  - Pagination support

- **User Experience**
  - Clean, modern UI with Tailwind CSS
  - Responsive design for all devices
  - Real-time updates
  - User preferences system

- **Developer Experience**
  - GraphQL API with built-in playground
  - Type-safe frontend with TypeScript
  - Hot Module Replacement (HMR)
  - Comprehensive GraphQL queries and mutations

## 🛠 Getting Started

### Prerequisites

- Node.js 18+ (for frontend)
- .NET 9.0 SDK (for backend)
- An IDE (VS Code recommended)

### Installation & Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd TaskManagementApp
   ```

2. Start the Backend:
   ```bash
   cd backend
   dotnet restore
   dotnet run
   ```
   Backend will start on http://localhost:5001

3. Start the Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will start on http://localhost:5173

### GraphQL API

Access the GraphQL playground at http://localhost:5001/graphql

#### Example Queries

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

## 📁 Project Structure

```
TaskManagementApp/
├── backend/                 # .NET Core backend
│   ├── Data/               # Database context
│   ├── GraphQL/            # GraphQL types and resolvers
│   ├── Models/            # Domain models
│   └── Program.cs         # App configuration
│
├── frontend/               # Vue.js frontend
│   ├── src/
│   │   ├── components/    # Vue components
│   │   ├── config/       # Configuration files
│   │   └── assets/       # Static assets
│   └── public/           # Public assets
```

## 📝 TODO List

- [ ] Add authentication system
- [ ] Implement user roles and permissions
- [ ] Add task categories and tags
- [ ] Implement task due dates and reminders
- [ ] Add task priority levels
- [ ] Implement task sharing between users
- [ ] Add dark mode support
- [ ] Implement real-time notifications
- [ ] Add task attachments support
- [ ] Implement task comments system

## 🔧 Development Notes

- Backend runs on port 5001 by default
- Frontend runs on port 5173 with HMR enabled
- SQLite database is created automatically on first run
- GraphQL playground is enabled in development mode

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details 