import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
export async function GET(context) {
  const posts = (await getCollection('posts', p => !p.data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: 'Lin Zhu',
    description: 'Notes from a staff QA on testing, tooling and AI enablement.',
    site: context.site,
    items: posts.map(p => ({ title: p.data.title, description: p.data.description, pubDate: p.data.date, link: `/posts/${p.id}/` })),
  });
}
