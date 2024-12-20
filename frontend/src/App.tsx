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
import { BrowserRouter as Router, Routes, Route, useSearchParams } from "react-router-dom";
import { client } from "./config/apollo";
import { TaskBoard } from './features/tasks/TaskBoard';
import "./index.css";

// Wrapper component to handle URL parameters
const TaskBoardWrapper = () => {
  const [searchParams] = useSearchParams();
  const labelId = searchParams.get('labelId');
  return <TaskBoard labelId={labelId} />;
};

/**
 * App Component
 * 
 * Provides the main structure of the application including:
 * - GraphQL client context
 * - Routing configuration
 * - Responsive layout with Tailwind CSS
 */
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<TaskBoardWrapper />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
