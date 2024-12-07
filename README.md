# Task Management API Case study / project

This is my experimental project to learn how to build a C# backend with a React frontend. I wanted to try making something like a headless CMS to manage tasks, to get familiar with a job posting which is doing something along these lines (though probably far from the same). Up until now I found it to be a really cool approach, especially given that CMS's for large organisations with a lot of (sub)organisations can easily lead to a very bloaty experience (despite best efforts). 

## What's This All About?

It's basically a task manager where I'm testing out:
- GraphQL API with Hot Chocolate (picked this over REST because I wanted to learn GraphQL)
- Entity Framework Core with SQLite (just using SQLite because it's simple for testing)
- Some basic auth stuff (nothing fancy)
- WebSocket support (might do real-time updates later, we'll see)
- React with TypeScript for a type-safe frontend
- Kanban-style board with drag-and-drop
- Label system with custom colors

Claude helped me figure out some of the C# modules and architecture - pretty cool learning experience actually. Made me understand the current C# ecosystem better. Last time I used it it gave off a 'Microsoft's version of Ecplise/Java Object-oriented developent'-vibe, though that could be because of the course setup which was really old-school (like; XP-era stuff was in the assignments)

## Project Structure

### Backend (/backend)
- C# .NET Core application
- Uses Hot Chocolate for GraphQL (a REST API was considered but this was easier to set up)
- Entity Framework Core handles the database stuff
- SQLite database (keeps things simple, no setup needed)

### Frontend (/frontend)
- React + TypeScript 
- GraphQL client to talk to the backend
- Kanban board with drag-and-drop
- Label management system
- Task filtering and organization

## Getting Started

1. Start the backend:
   ```sh
   cd backend
   dotnet run
   ```

2. Start the frontend:
   ```sh
   cd frontend
   npm install
   npm run dev (or npm run build and then npm run start for the production lovers)
   ```

The backend runs on http://localhost:5001 (5000 is default but in case a someone working on a similar project is already on it, I changed it).
Frontend should pop up on http://localhost:5173. This is because of Vite, the build tool we're using for the frontend. Make sure to use node 18> (for React devs stuck on 17).

## Development Notes

- The GraphQL playground is at http://localhost:5001/graphql if you want to mess with the API directly
- Hot reload works on the frontend (node stuff). For the backend this could perhaps be realised with  ('dotnet watch run') but a manual restart with `dotnet run` is nice for stability as I kind of like debugging this way to familiarise myself more quickly with the ecosystem. This is a personal preference thing.
- Database just creates itself when you first run it

## Module Choices

NB: A bunch of these choices, especially on the back-end (e.g., Hot Chocolate and Entity), were suggested to me by AI tools, after promting them for my (short-term) needs. 
- Hot Chocolate: Picked this because it's the main C# GraphQL server and has good docs
- Entity Framework: It's just the standard ORM for C#, works fine
- SQLite: Super simple, no setup, good enough for testing
- React: Because that's what I know best for frontend
- react-beautiful-dnd: For the drag-and-drop Kanban board. It will be 'deprecated soon' but node libraries always tell you that.
- Apollo Client: For GraphQL

## Known Issues

- Auth is super basic right now
- CORS can be better
- WebSockets aren't really used yet
- Some TypeScript stuff could be better
- Drag-and-drop will probably need error handling (not extensively tested on mobile)

## Future Maybe-ToDos

If I have (had) time:
- Focus on adding some functionality akin to taxonomy specific to large organisations such as universities (example chosen at random).
- Try to add AI implementation to the project. Stuff like: fill in this task for me, give me a summary of this task, etc. In real life Azure would probably be used for this (if your organisation is tied up to that kind of thing), but I kinda like open source solutions and can run pretty good ollmama locally so it will probably be that.
- Features like assign to user, due date, etc. Which will require...
- Better auth 
- Real-time updates
- Nicer UI/UX
- Switch to a real database if needed (SQLite is a bit of a meme if we're talking about large-scale deployments).
- Add dark mode / thematic options
- Add task templates for common stuff
- Maybe add file attachments

## Contributing

It's just a test project, but if you want to mess with it, go ahead. Does anyone actually read this?

## License

If this gets me a job I'll licence off all my rights including the rights to this README and also my soul to whoever hires me.

## Q&A for experienced .NET and C# devs

Q: "Your Program.cs is doing way too much in one file..."
A: Yeah, it's a bit of a God class right now. Should split it into proper configuration classes. This is for now a result of time constraints, but it should be refactored.

Q: "Where's your proper configuration management?"
A: Connection strings are hardcoded and there's no appsettings.json for different environments. Would definitely need that for a real deployment.

Q: "Your error handling is... interesting..."
A: Yep, missing global exception handling and proper logging. Also probably shouldn't show detailed errors in production. Again, time constraints play a part here (this last comment can basically be added to all of the following answers).

Q: "That CORS setup is basic"
A: It's just for development.

Q: "Your GraphQL implementation needs work..."
A: Getting better. I need to look into DataLoader for N+1 queries and what that is and how it works.

Q: "Where's your repository pattern?"
A: Direct DbContext usage is quick but not great for testing or switching databases. Would need proper abstraction for production.

Q: "Your project structure is a bit flat..."
A: Backend could still use some love with better separation of concerns (API/Core/Infrastructure/etc). Rome wasn't built in a day. Neither was this. This was actually built in like two to three days (and nights), after I saw a job posting.

Q: "There are no tests?"
A: No unit tests, no integration tests. Of course this is a need for real development.

Q: "Your middleware ordering?"
A: Yeah, the pipeline could use some work. There's no limiting or (health) checks but for such a small project I skipped that.

Q: "Performance considerations?"
A: No caching strategy, no rate limiting, no compression. SQLite would cry in production. But that's beside the point. In actually deployed software this stuff is also not always that good, which it should be, but that's a different story.

Q: "Documentation a bit sparse"
A: We've added proper TypeScript types and better component organization. The GraphQL schema is pretty ok now, but I first want to improve my understanding of the 'ecosystem' before adding stuff (with AI) which might not even be correct.

TL;DR: It's a learning project that shows basic concepts but needs work for production. Good starting point though!

*Note: All these are valid points that would need addressing for a production system. But for learning modern .NET and GraphQL? It helped. :)*

## More Details

Check out the internal READMEs for more info:
- [Frontend Details](frontend/README.md) - React app stuff
- [Backend Details](backend/README.md) - .NET API stuff