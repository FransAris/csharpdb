/**
 * Task Management App - Main Application Component
 * 
 * This is the root component of the Task Management application.
 * It sets up:
 * - Apollo Client for GraphQL integration
 * - React Router for navigation
 * - Base layout and styling
 */

import { ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { client } from "./config/apollo";
import TaskList from "./components/TaskList";
import "./index.css";

/**
 * App Component
 * 
 * Provides the main structure of the application including:
 * - GraphQL client context
 * - Routing configuration
 * - Responsive layout with Tailwind CSS
 * 
 * TODO:
 * - Add authentication routes
 * - Implement protected routes
 * - Add user preferences page
 * - Implement dark mode toggle
 */
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        {/* Main container with responsive height and background */}
        <div className="min-h-screen bg-gray-100">
          {/* Content wrapper with responsive padding */}
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Route configuration */}
            <Routes>
              {/* Main task list route */}
              <Route path="/" element={<TaskList />} />
              {/* TODO: Add additional routes
                  - /login
                  - /register
                  - /preferences
                  - /tasks/:id
              */}
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
