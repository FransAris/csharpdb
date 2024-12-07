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
import { getLabelColor } from '../utils/labelColors';

// GraphQL Queries and Mutations
const GET_FILTERED_TASKS = gql`
  query GetFilteredTasks($labelId: Int) {
    tasks(where: { labelId: { eq: $labelId } }) {
      nodes {
        id
        title
        description
        isCompleted
        createdAt
        completedAt
        labelId
        label {
          id
          name
          description
        }
      }
    }
  }
`;

const GET_ALL_TASKS = gql`
  query GetAllTasks {
    tasks {
      nodes {
        id
        title
        description
        isCompleted
        createdAt
        completedAt
        labelId
        label {
          id
          name
          description
        }
      }
    }
  }
`;

const ADD_TASK = gql`
  mutation AddTask($title: String!, $description: String!, $labelId: Int) {
    addTask(title: $title, description: $description, labelId: $labelId) {
      id
      title
      description
      isCompleted
      createdAt
      label {
        id
        name
        description
      }
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: Int!, $isCompleted: Boolean!) {
    updateTask(id: $id, isCompleted: $isCompleted) {
      id
      title
      description
      isCompleted
      createdAt
      completedAt
      labelId
      label {
        id
        name
        description
      }
    }
  }
`;

const GET_LABELS = gql`
  query GetLabels {
    labels {
      nodes {
        id
        name
        description
      }
    }
  }
`;

interface Label {
  id: string;
  name: string;
  description?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
  label?: Label;
  labelId?: string;
}

interface TaskListProps {
  labelId: string | null;
}

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
export default function TaskList({ labelId }: TaskListProps) {
  // State for new task form
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<number | null>(null);

  // GraphQL hooks
  const { loading: loadingFiltered, error: errorFiltered, data: filteredData } = useQuery(GET_FILTERED_TASKS, {
    variables: { labelId: labelId ? parseInt(labelId) : null },
    skip: !labelId
  });
  const { loading: loadingAll, error: errorAll, data: allData } = useQuery(GET_ALL_TASKS, {
    skip: !!labelId
  });
  const [addTask] = useMutation(ADD_TASK, {
    refetchQueries: [
      { 
        query: GET_FILTERED_TASKS,
        variables: { labelId: labelId ? parseInt(labelId) : null }
      },
      {
        query: GET_ALL_TASKS
      }
    ]
  });
  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [
      { 
        query: GET_FILTERED_TASKS,
        variables: { labelId: labelId ? parseInt(labelId) : null }
      },
      {
        query: GET_ALL_TASKS
      }
    ]
  });

  // Add labels query
  const { data: labelsData } = useQuery(GET_LABELS);

  // Loading and error states
  if (loadingFiltered || loadingAll) return <div className="text-center">Loading...</div>;
  if (errorFiltered || errorAll) return <div className="text-red-600">Error: {errorFiltered?.message || errorAll?.message}</div>;

  /**
   * Handles the submission of a new task
   * @param e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      variables: { 
        title: newTitle, 
        description: newDescription, 
        labelId: selectedLabel
      }
    });

    // Reset form
    setNewTitle("");
    setNewDescription("");
    setSelectedLabel(null);
  };

  /**
   * Toggles the completion status of a task
   * @param id - Task ID
   * @param currentStatus - Current completion status
   */
  const handleToggleComplete = (taskId: string, currentStatus: boolean) => {
    updateTask({
      variables: { 
        id: parseInt(taskId), 
        isCompleted: !currentStatus 
      }
    }).catch(error => {
      console.error('Error updating task:', error);
    });
  };

  const tasks = labelId ? filteredData?.tasks?.nodes : allData?.tasks?.nodes;

  // After loading checks
  console.log('Task data:', {
    filtered: filteredData?.tasks?.nodes,
    all: allData?.tasks?.nodes,
    currentTasks: tasks,
    labelId
  });

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
        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700">
            Label
          </label>
          <select
            id="label"
            value={selectedLabel || ''}
            onChange={(e) => setSelectedLabel(e.target.value ? parseInt(e.target.value) : null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">No Label</option>
            {labelsData?.labels?.nodes?.map((label: any) => (
              <option key={label.id} value={label.id} className={`${getLabelColor(label.id).text}`}>
                {label.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          Add Task
        </button>
      </form>

      {/* Task List */}
      <div className="mt-8 space-y-4">
        {tasks?.map((task: Task) => (
          <div key={task.id} className="flex items-center justify-between bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4 w-full">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => handleToggleComplete(task.id, task.isCompleted)}
                className="mt-1.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-lg font-medium ${task.isCompleted ? "line-through text-gray-500" : "text-gray-900"}`}>
                    {task.title}
                  </h3>
                  {task.label && (
                    console.log('Label data for task:', {
                      taskId: task.id,
                      label: task.label,
                      color: getLabelColor(task.label.id)
                    }),
                    <span 
                      className={`
                        inline-flex items-center px-3 py-1 
                        rounded-full text-sm font-medium 
                        ${getLabelColor(task.label.id).bg} 
                        ${getLabelColor(task.label.id).text} 
                        border ${getLabelColor(task.label.id).border} 
                        shadow-sm transition-colors
                      `}
                    >
                      <span 
                        className={`
                          flex-shrink-0 w-2.5 h-2.5 
                          rounded-full ${getLabelColor(task.label.id).dot} 
                          mr-2
                        `}
                      />
                      {task.label.name}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${task.isCompleted ? "line-through text-gray-400" : "text-gray-600"}`}>
                  {task.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                  {task.completedAt && (
                    <>
                      <span>•</span>
                      <span>Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
