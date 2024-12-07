import React, { useEffect, useState } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';

/**
 * This is a wrapper around react-beautiful-dnd's Droppable component
 * that makes it work nicely with React 18's Strict Mode.
 * 
 * Why? Because React 18's strict mode double-renders components on mount
 * to catch bugs, but react-beautiful-dnd doesn't like that. This fixes it.
 * 
 * Found this solution on GitHub - pretty neat trick actually!
 */
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  // We need this enabled state because of the double-render thing
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Small delay to let React do its thing
    const animation = requestAnimationFrame(() => setEnabled(true));

    // Cleanup when component unmounts
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  // Don't render anything until we're ready
  if (!enabled) {
    return null;
  }

  // Just passing through to the real Droppable
  return <Droppable {...props}>{children}</Droppable>;
}; 