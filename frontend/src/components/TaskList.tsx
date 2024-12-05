/**
 * TaskList Component
 * 
 * A component that displays and manages the list of tasks.
 * Features:
 * - Displays all tasks with their details
 * - Allows adding new tasks
 * - Supports marking tasks as complete/incomplete
 * - Real-time updates through GraphQL
 */

import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";

// GraphQL Queries and Mutations
const GET_TASKS = gql`
  query GetTasks {
    tasks {
      nodes {
        id
        title
        description
        isCompleted
        createdAt
        completedAt
      }
    }
  }
`;

const ADD_TASK = gql`
  mutation AddTask($title: String!, $description: String!) {
    addTask(title: $title, description: $description) {
      id
      title
      description
      isCompleted
      createdAt
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: Int!, $isCompleted: Boolean!) {
    updateTask(id: $id, isCompleted: $isCompleted) {
      id
      isCompleted
      completedAt
    }
  }
`;

/**
 * Main TaskList component
 * 
 * TODO:
 * - Add task deletion
 * - Add task editing
 * - Implement task filtering
 * - Add task categories
 * - Add task priority levels
 * - Implement task sorting
 * - Add pagination
 */
export default function TaskList() {
  // State for new task form
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // GraphQL hooks
  const { loading, error, data } = useQuery(GET_TASKS);
  const [addTask] = useMutation(ADD_TASK, {
    refetchQueries: [{ query: GET_TASKS }]
  });
  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }]
  });

  // Loading and error states
  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  /**
   * Handles the submission of a new task
   * @param e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      variables: { title: newTitle, description: newDescription }
    });

    // Reset form
    setNewTitle("");
    setNewDescription("");
  };

  /**
   * Toggles the completion status of a task
   * @param id - Task ID
   * @param currentStatus - Current completion status
   */
  const handleToggleComplete = (id: number, currentStatus: boolean) => {
    updateTask({
      variables: { id, isCompleted: !currentStatus }
    });
  };

  return (
    <div className="space-y-6">
      {/* New Task Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Task
        </button>
      </form>

      {/* Task List */}
      <div className="mt-8 space-y-4">
        {data.tasks.nodes.map((task: any) => (
          <div key={task.id} className="flex items-center justify-between bg-white p-6 rounded-lg shadow">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => handleToggleComplete(task.id, task.isCompleted)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <div className={`${task.isCompleted ? "line-through text-gray-500" : ""}`}>
                <h3 className="text-lg font-medium">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                  {task.completedAt && ` • Completed: ${new Date(task.completedAt).toLocaleDateString()}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
