import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  DragDropContext,
  Draggable,
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided
} from 'react-beautiful-dnd';

import { StrictModeDroppable } from '../../components/common/StrictModeDroppable';
import { LabelManager } from '../labels/LabelManager';
import { hexToRgba } from '../../utils/colorUtils';
import {
  GET_TASKS,
  UPDATE_TASK_STATUS,
  ADD_TASK,
  DELETE_TASK,
  UPDATE_TASK_DETAILS
} from './taskQueries';
import { GET_LABELS } from '../labels/labelQueries';
import {
  Task,
  TaskState,
  Column,
  TaskBoardProps,
  Label,
  TasksData
} from '../../types';

/**
 * The main TaskBoard component - this is where the magic happens!
 * 
 * Features:
 * - Drag and drop tasks between columns (using react-beautiful-dnd)
 * - Create, edit, and delete tasks
 * - Filter tasks by labels
 * - Manage labels with custom colors
 * - Track task modifications
 * 
 * Note: The component might look big but it's because it handles all the task 
 * management stuff. Could probably split some of this out later if it grows more.
 */
export const TaskBoard: React.FC<TaskBoardProps> = ({ labelId }) => {
  const [isAddingTask, setIsAddingTask] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedLabelId, setSelectedLabelId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLabelId, setEditLabelId] = useState<number | null>(null);

  const { data, loading, error } = useQuery(GET_TASKS);

  console.log('TaskBoard data:', { data, loading, error, labelId });

  const { data: labelsData, loading: labelsLoading } = useQuery<{ labels: { nodes: Label[] } }>(GET_LABELS);
  
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS, {
    refetchQueries: [{ query: GET_TASKS }]
  });
  const [updateTaskDetails] = useMutation(UPDATE_TASK_DETAILS);
  const [addTask] = useMutation(ADD_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    
    try {
      await updateTaskStatus({
        variables: {
          id: parseInt(draggableId),
          status: destination.droppableId
        }
      });
    } catch (error: any) {
      console.error('Error updating task:', error);
      alert('Failed to move task. Please try again.');
    }
  };

  const handleEditTask = async (taskId: number) => {
    const task = data?.tasks.nodes.find((t: Task) => t.id === taskId);
    if (!task) return;

    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditLabelId(task.labelId || null);
    setEditingTask(taskId);
  };

  const handleSaveEdit = async () => {
    if (!editingTask) return;

    try {
      await updateTaskDetails({
        variables: {
          id: editingTask,
          title: editTitle,
          description: editDescription,
          labelId: editLabelId
        }
      });
      setEditingTask(null);
    } catch (error: any) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  // Show loading/error states - keeping it simple!
  if (loading) return <div className="text-center py-4">Loading tasks...</div>;
  if (error) return <div className="text-center py-4 text-red-600">Error loading tasks: {error.message}</div>;
  if (!data) return <div className="text-center py-4">No tasks found</div>;

  // Filter tasks if a label is selected
  const filteredTasks = data.tasks.nodes.filter((task: Task) => 
    !labelId || task.labelId === parseInt(labelId)
  );

  // Set up our columns for the Kanban board
  const columns: Record<string, Column> = {
    'TODO': {
      title: 'To Do',
      tasks: filteredTasks.filter((t: Task) => t.status === 'TODO')
    },
    'IN_PROGRESS': {
      title: 'In Progress',
      tasks: filteredTasks.filter((t: Task) => t.status === 'IN_PROGRESS')
    },
    'DONE': {
      title: 'Done',
      tasks: filteredTasks.filter((t: Task) => t.status === 'DONE')
    }
  };

  // Handles creating a new task - makes the API call and clears the form
  const handleAddTask = async (status: string) => {
    if (!newTaskTitle.trim()) return;

    try {
      const variables = {
        title: newTaskTitle,
        description: newTaskDescription || "",
        labelId: selectedLabelId,
        status
      };

      await addTask({
        variables
      });

      // Reset form after successful add
      setNewTaskTitle('');
      setNewTaskDescription('');
      setSelectedLabelId(null);
      setIsAddingTask(null);
    } catch (error: any) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  // Delete with a confirmation - just to be safe!
  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask({
          variables: { id: taskId }
        });
      } catch (error: any) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with task management tools */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Task Board</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side: Label management and filtering */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Label Management</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Label</label>
                <select
                  value={labelId || ''}
                  onChange={(e) => window.location.href = e.target.value ? `/?labelId=${e.target.value}` : '/'}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Tasks</option>
                  {labelsData?.labels.nodes.map((label: Label) => (
                    <option key={label.id} value={label.id}>
                      {label.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Label creation form */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Create New Label</label>
                <LabelManager />
              </div>
            </div>
          </div>

          {/* Right side: Task stats and quick actions */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Task Statistics</h2>
            <div className="grid grid-cols-3 gap-4">
              {/* Quick stats for each column */}
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {data?.tasks.nodes.filter((t: Task) => t.status === 'TODO').length || 0}
                </div>
                <div className="text-sm text-gray-600">To Do</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {data?.tasks.nodes.filter((t: Task) => t.status === 'IN_PROGRESS').length || 0}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {data?.tasks.nodes.filter((t: Task) => t.status === 'DONE').length || 0}
                </div>
                <div className="text-sm text-gray-600">Done</div>
              </div>
            </div>
            {/* Quick add task button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsAddingTask('TODO')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                New Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* The Kanban board - where the drag-and-drop happens */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="bg-white rounded-lg shadow">
              {/* Column header with task count */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">{column.title}</h2>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    {column.tasks.length}
                  </span>
                </div>
              </div>

              {/* Droppable area for tasks */}
              <div className="p-4">
                <StrictModeDroppable droppableId={columnId}>
                  {(provided: DroppableProvided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3 min-h-[200px]"
                    >
                      {/* Each task card */}
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                        >
                          {(dragProvided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              style={{
                                ...dragProvided.draggableProps.style,
                                userSelect: 'none'
                              }}
                              className={`bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow group cursor-move ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' : ''
                              }`}
                            >
                              {editingTask === task.id ? (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                  />
                                  <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                  />
                                  <select
                                    value={editLabelId?.toString() || ''}
                                    onChange={(e) => setEditLabelId(e.target.value ? parseInt(e.target.value) : null)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                  >
                                    <option value="">No Label</option>
                                    {labelsData?.labels.nodes.map((label) => (
                                      <option key={label.id} value={label.id}>
                                        {label.name}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => setEditingTask(null)}
                                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={handleSaveEdit}
                                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium select-none">{task.title}</h3>
                                    <p className="text-sm text-gray-600 select-none">{task.description}</p>
                                    {task.label && (
                                      <span 
                                        className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium mt-2 select-none"
                                        style={{
                                          backgroundColor: hexToRgba(task.label.color, 0.1),
                                          color: task.label.color,
                                          border: `1px solid ${task.label.color}`
                                        }}
                                      >
                                        <span 
                                          className="w-2 h-2 mr-1.5 rounded-full"
                                          style={{ backgroundColor: task.label.color }}
                                        />
                                        {task.label.name}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleEditTask(task.id)}
                                      className="opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 transition-opacity"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              )}
                              {task.lastModified && (
                                <div className="text-xs text-gray-400 mt-2 select-none">
                                  Last modified: {new Date(task.lastModified).toLocaleString()}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </StrictModeDroppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Add Task Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Task</h3>
              <button
                onClick={() => setIsAddingTask(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter task description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Label</label>
                <select
                  value={selectedLabelId?.toString() || ''}
                  onChange={(e) => setSelectedLabelId(e.target.value ? parseInt(e.target.value) : null)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">No Label</option>
                  {labelsData?.labels.nodes.map((label) => (
                    <option key={label.id} value={label.id}>
                      {label.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsAddingTask(null)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddTask(isAddingTask)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 