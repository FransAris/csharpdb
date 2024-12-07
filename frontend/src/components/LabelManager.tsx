import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const ADD_LABEL = gql`
  mutation AddLabel($name: String!, $description: String) {
    addLabel(name: $name, description: $description) {
      id
      name
      description
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

export const LabelManager: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [addLabel] = useMutation(ADD_LABEL, {
    onCompleted: () => {
      setName('');
      setDescription('');
    },
    refetchQueries: [{ query: GET_LABELS }]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addLabel({
      variables: { name, description }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div>
        <label htmlFor="labelName" className="block text-sm font-medium text-gray-700">
          New Label
        </label>
        <input
          type="text"
          id="labelName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter label name"
        />
      </div>
      <div>
        <label htmlFor="labelDescription" className="block text-sm font-medium text-gray-700">
          Description (optional)
        </label>
        <input
          type="text"
          id="labelDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter label description"
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