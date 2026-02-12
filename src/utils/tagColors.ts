/**
 * Tag colors for frequent tags (3+ occurrences)
 */
const tagColors = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
];

/**
 * Grey color for infrequent tags (1-2 occurrences)
 */
const greyTagColor = "bg-gray-200 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300";

/**
 * Get a deterministic color class for a tag based on its name and frequency.
 * Tags with count <= 2 are grey, others get a consistent color based on tag name.
 */
export function getTagColor(tag: string, count?: number): string {
  if (count !== undefined && count <= 2) {
    return greyTagColor;
  }

  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  return tagColors[Math.abs(hash) % tagColors.length];
}
