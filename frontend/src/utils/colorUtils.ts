/**
 * Converts a hex color code to an rgba color with specified opacity
 * @param hex - The hex color code (e.g., "#ff0000")
 * @param opacity - The opacity value between 0 and 1
 * @returns The rgba color string
 */
export const hexToRgba = (hex: string, opacity: number): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0, 0, 0, ${opacity})`;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}; 