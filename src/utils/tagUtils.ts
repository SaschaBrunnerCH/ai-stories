import { getCollection } from "astro:content";

export { getTagColor } from "./tagColors";

/**
 * Get all unique tags from the ai-stories collection
 */
export async function getAllTags(): Promise<string[]> {
  const entries = await getCollection("aiStories");
  const tagSet = new Set<string>();

  entries.forEach((entry) => {
    entry.data.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

/**
 * Get all entries that have a specific tag
 */
export async function getEntriesByTag(tag: string) {
  const entries = await getCollection("aiStories");
  return entries.filter((entry) => entry.data.tags.includes(tag));
}

/**
 * Get count of entries for each tag
 */
export async function getTagCounts(): Promise<Map<string, number>> {
  const entries = await getCollection("aiStories");
  const tagCounts = new Map<string, number>();

  entries.forEach((entry) => {
    entry.data.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return tagCounts;
}

