# Task Management API Case study / project

This is my experimental project to learn how to build a C# backend with a React frontend. I wanted to try making something like a headless CMS to manage tasks, to get familiar with a job posting which is doing something along these lines (though probably far from the same). Up until now I found it to be a reallu cool approach, especially given that CMS's for large ogranisations with a lot of (sub)organisations can easily lead to a very bloaty experience.
 
## What's This All About?

It's basically a task manager where I'm testing out:
- GraphQL API with Hot Chocolate (picked this over REST because I wanted to learn GraphQL)
- Entity Framework Core with SQLite (just using SQLite because it's simple for testing)
- Some basic auth stuff (nothing fancy)
- WebSocket support (might do real-time updates later, we'll see)

The AI assistant Claude helped me figure out some of the C# modules and architecture - pretty cool learning experience actually. Made me understand the C# ecosystem better.

## Project Structure

### Backend (/backend)
- C# .NET Core application
- Uses Hot Chocolate for GraphQL (way easier than writing a REST API)
- Entity Framework Core handles the database stuff
- SQLite database (keeps things simple, no setup needed)

### Frontend (/frontend)
- React + TypeScript 
- GraphQL client to talk to the backend
- Basic UI for managing tasks

## Getting Started

1. Start the backend:
cd backend
dotnet run

2. Start the frontend:
cd frontend
npm install
npm start

The backend runs on http://localhost:5001
Frontend should pop up on http://localhost:3000

## Development Notes

- The GraphQL playground is at http://localhost:5001/graphql if you want to mess with the API directly
- Hot reload works on both ends
- Database just creates itself when you first run it

## Module Choices

- Hot Chocolate: Picked this because it's the main C# GraphQL server and has good docs
- Entity Framework: It's just the standard ORM for C#, works fine
- SQLite: Super simple, no setup, good enough for testing
- React: Because that's what I know best for frontend

## Known Issues

- Auth is super basic right now
- Probably some CORS stuff that needs fixing
- WebSockets aren't really used yet

## Future Maybe-ToDos

If I feel like it:
- Better auth
- Real-time updates
- Actually make it look nice
- Switch to a real database if needed

## Contributing

It's just a test project, but if you want to mess with it, go ahead.

## License

Whatever, do what you want with it. 
