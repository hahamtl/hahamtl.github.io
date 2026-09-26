import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts live in src/content/posts/<lang>/<slug>.md
// The same <slug> in two language folders is one post in two languages.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),   // topic keys from src/i18n.ts TOPICS
    order: z.number().optional(),            // series number, shared with the Zhihu / Xiaohongshu exports
    rank: z.number().optional(),             // editorial quality rank, 1 = strongest; drives the default home order
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});
export const collections = { posts };
