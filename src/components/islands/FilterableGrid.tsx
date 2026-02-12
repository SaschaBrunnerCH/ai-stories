import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { buildUrl } from "../../utils/url";
import { getTagColor } from "../../utils/tagColors";

interface CardData {
  title: string;
  slug: string;
  tags: string[];
  icon: string;
  created: string;
  author: string[];
  description?: string;
  tileImage?: string;
}

interface Props {
  items: CardData[];
  allTags: string[];
  tagCounts: Record<string, number>;
  variant?: "playful" | "technical";
  basePath?: string;
  defaultTileImage?: string;
}

// Grey background for all sticky notes
const stickyNoteColor = "bg-gray-100 dark:bg-surface-elevated";

const rotationStyles = [
  { transform: "rotate(-2deg)" },
  { transform: "rotate(1deg)" },
  { transform: "rotate(-1deg)" },
  { transform: "rotate(2deg)" },
  { transform: "rotate(-0.5deg)" },
  { transform: "rotate(1.5deg)" },
];

export default function FilterableGrid({
  items,
  allTags,
  tagCounts,
  variant = "playful",
  basePath = "",
  defaultTileImage,
}: Props) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTagFilter, setShowTagFilter] = useState(true);

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["title", "tags", "description"],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [items]
  );

  // Filter items based on selected tags and search query
  const filteredItems = useMemo(() => {
    let result = items;

    // Apply tag filter (items must have at least one selected tag)
    if (selectedTags.length > 0) {
      result = result.filter((item) =>
        selectedTags.some((tag) => item.tags.includes(tag))
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery);
      const searchSlugs = new Set(searchResults.map((r) => r.item.slug));
      result = result.filter((item) => searchSlugs.has(item.slug));
    }

    return result;
  }, [items, selectedTags, searchQuery, fuse]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const resolveHref = (slug: string) => {
    const normalizedBase = basePath.endsWith("/")
      ? basePath.slice(0, -1)
      : basePath;
    const href = normalizedBase ? `${normalizedBase}/${slug}` : `/${slug}`;
    return buildUrl(href);
  };

  const resolveAssetSrc = (filenameOrPath: string) => {
    if (filenameOrPath.startsWith("/")) {
      return buildUrl(filenameOrPath);
    }
    const normalizedBase = basePath.endsWith("/")
      ? basePath.slice(0, -1)
      : basePath;
    const src = normalizedBase
      ? `${normalizedBase}/${filenameOrPath}`
      : `/${filenameOrPath}`;
    return buildUrl(src);
  };

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search AI stories..."
            aria-label="Search AI stories"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input w-full px-4 py-3 pl-10 border border-gray-300 dark:border-surface-border rounded-lg bg-white dark:bg-surface-elevated text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowTagFilter(!showTagFilter)}
            aria-expanded={showTagFilter}
            className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2 flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showTagFilter ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Filter by tag
          </button>
          {showTagFilter && [...allTags].sort((a, b) => (tagCounts[b] || 0) - (tagCounts[a] || 0)).map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 text-sm rounded-full font-medium transition-all ${
                selectedTags.includes(tag)
                  ? "bg-blue-600 text-white"
                  : `${getTagColor(tag, tagCounts[tag] || 0)} hover:brightness-95`
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Clear Filters */}
        {(selectedTags.length > 0 || searchQuery) && (
          <div>
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm rounded-full font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredItems.length} of {items.length} items
        </p>
      </div>

      {/* Cards Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item, index) => (
            <a
              key={item.slug}
              href={resolveHref(item.slug)}
              className={
                variant === "technical"
                  ? "block h-full rounded-lg border border-gray-200 dark:border-surface-border bg-white dark:bg-surface-elevated p-4 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                  : `sticky-note card-shadow block p-5 rounded-sm cursor-pointer h-full ${stickyNoteColor}`
              }
              style={variant === "technical" ? undefined : rotationStyles[index % rotationStyles.length]}
            >
              {variant === "technical" && (item.tileImage || defaultTileImage) && (
                <div className="mb-3 overflow-hidden rounded-md border border-gray-200 dark:border-surface-border bg-gray-50 dark:bg-surface-overlay">
                  <img
                    src={resolveAssetSrc(item.tileImage || defaultTileImage!)}
                    alt={item.title}
                    className="w-full h-32 object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="flex items-start gap-2.5 mb-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
                </svg>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 text-lg leading-tight">
                  {item.title}
                </h3>
              </div>

              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {item.description}
                </p>
              )}

              <div className="flex flex-wrap gap-1.5 mt-auto mb-3">
                {[...item.tags].sort((a, b) => (tagCounts[b] || 0) - (tagCounts[a] || 0)).slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTagColor(tag, tagCounts[tag] || 0)}`}
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="text-xs bg-gray-200 dark:bg-surface-overlay text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full font-medium">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <span>{item.author.join(", ")}</span>
                <span>•</span>
                <time>{formatDate(item.created)}</time>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No items found matching your filters.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
