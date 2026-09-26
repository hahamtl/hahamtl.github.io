import { getCollection } from 'astro:content';
import { splitId, type Lang } from '../i18n';

export async function postsIn(lang: Lang) {
  const all = await getCollection('posts', p => !p.data.draft && splitId(p.id).lang === lang);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

// Does this slug exist in the other language? Returns that language or null.
export async function translationOf(slug: string, lang: Lang): Promise<Lang | null> {
  const other: Lang = lang === 'en' ? 'zh' : 'en';
  const hits = await getCollection('posts', p => !p.data.draft && p.id === `${other}/${slug}`);
  return hits.length ? other : null;
}

export function topicsUsed(posts: { data: { tags: string[] } }[]) {
  const seen = new Map<string, number>();
  for (const p of posts) for (const tg of p.data.tags) seen.set(tg, (seen.get(tg) ?? 0) + 1);
  return [...seen.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k);
}

export function byRank(posts: any[]) {
  return [...posts].sort((a, b) => (a.data.rank ?? 999) - (b.data.rank ?? 999) || b.data.date.valueOf() - a.data.date.valueOf());
}
export function byOrder(posts: any[]) {
  return [...posts].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
}
