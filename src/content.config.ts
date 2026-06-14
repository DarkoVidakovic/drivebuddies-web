import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    lang: z.enum(['de', 'en']).default('de'),
    draft: z.boolean().default(false),
    author: z.string().optional(),
  }),
});

export const collections = { blog };
