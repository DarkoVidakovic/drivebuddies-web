import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Optional ≤60-char SEO title override (else `${title} | DriveBuddies`). */
    seoTitle: z.string().optional(),
    /** Optional ≤160-char SEO meta description override (else description). */
    seoDescription: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    lang: z.enum(['de', 'en']).default('de'),
    draft: z.boolean().default(false),
    author: z.string().optional(),
  }),
});

export const collections = { blog };
