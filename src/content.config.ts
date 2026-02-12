import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const aiStories = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./content/ai-stories",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()),
    author: z.array(z.string()),
    created: z.coerce.date(),
    icon: z.string().optional().default("📝"),
    codeFiles: z.array(z.string()).optional(),
    tileImage: z.string().optional(),
  }),
});

export const collections = { aiStories };
