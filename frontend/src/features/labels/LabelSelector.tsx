import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { getLabelColor } from '../utils/labelColors';

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

interface Props {
  selectedLabel: string | null;
  onLabelChange: (labelId: string | null) => void;
}

export const LabelSelector: React.FC<Props> = ({ selectedLabel, onLabelChange }) => {
  const { data, loading, error } = useQuery(GET_LABELS);

  if (loading) return <div>Loading labels...</div>;
  if (error) return <div>Error loading labels: {error.message}</div>;
  
  const labels = data?.labels?.nodes || [];

  return (
    <div className="mb-4">
      <select 
        value={selectedLabel || ''} 
        onChange={(e) => onLabelChange(e.target.value || null)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="">All Tasks</option>
        {labels.map((label: Label) => (
          <option 
            key={label.id} 
            value={label.id}
            className={`${getLabelColor(label.id).text}`}
          >
            {label.name}
          </option>
        ))}
      </select>
    </div>
  );
}; 