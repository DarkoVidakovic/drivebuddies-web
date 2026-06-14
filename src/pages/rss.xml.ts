import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => data.lang === 'de' && !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'DriveBuddies Blog – Fahrschule Tipps & Wissen',
    description: 'Praxistipps und Wissen rund um Theorie, Praxis und Fahrprüfung von der Fahrschule DriveBuddies Zürich.',
    site: context.site ?? 'https://drivebuddies.ch',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
      author: post.data.author,
    })),
    customData: `<language>de-CH</language>`,
  });
}
