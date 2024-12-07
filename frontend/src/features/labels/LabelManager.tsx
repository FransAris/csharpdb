import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { GET_LABELS } from './labelQueries';

/**
 * LabelManager - handles creating new labels for tasks
 * 
 * Pretty straightforward form that lets you:
 * - Add a label name
 * - Add an optional description
 * - Pick a color (using the browser's color picker)
 * 
 * When you create a label, it automatically shows up in the task filters
 * because we're refetching the labels query after creation.
 */
export const LabelManager: React.FC = () => {
  // Basic form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');  // Nice blue default

  // GraphQL mutation for creating labels
  const [addLabel] = useMutation(gql`
    mutation AddLabel($name: String!, $description: String, $color: String!) {
      addLabel(name: $name, description: $description, color: $color) {
        id
        name
        description
        color
      }
    }
  `, {
    // Refresh the labels list after adding a new one
    refetchQueries: [{ query: GET_LABELS }]
  });

  // Handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;  // Don't create empty labels!

    try {
      await addLabel({
        variables: {
          name,
          description: description || undefined,  // GraphQL doesn't like empty strings
          color
        }
      });

      // Clear the form on success
      setName('');
      setDescription('');
      setColor('#3B82F6');
    } catch (error) {
      console.error('Error creating label:', error);
      alert('Failed to create label. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      {/* Label name input - required */}
      <div>
        <label htmlFor="labelName" className="block text-sm font-medium text-gray-700">
          Label Name
        </label>
        <input
          type="text"
          id="labelName"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Description input - optional */}
      <div>
        <label htmlFor="labelDescription" className="block text-sm font-medium text-gray-700">
          Description (optional)
        </label>
        <input
          type="text"
          id="labelDescription"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Color picker - uses the browser's native picker */}
      <div>
        <label htmlFor="labelColor" className="block text-sm font-medium text-gray-700">
          Color
        </label>
        <input
          type="color"
          id="labelColor"
          className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
      >
        Add Label
      </button>
    </form>
  );
}; 