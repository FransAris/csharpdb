export const LABEL_COLORS = [
  { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-600" },
  { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-600" },
  { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-600" },
  { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-600" },
  { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-600" },
  { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", dot: "bg-pink-600" },
];

export const getLabelColor = (labelId: string) => {
  const index = parseInt(labelId) % LABEL_COLORS.length;
  return LABEL_COLORS[index];
}; 