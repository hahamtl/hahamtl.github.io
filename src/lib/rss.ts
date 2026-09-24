import rss from '@astrojs/rss';
import { t, postUrl, splitId, type Lang } from '../i18n';
import { postsIn } from './posts';

export async function feed(lang: Lang, site: URL | undefined) {
  const posts = await postsIn(lang);
  return rss({
    title: t(lang, 'siteName'),
    description: t(lang, 'description'),
    site: site!,
    items: posts.map(p => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: postUrl(lang, splitId(p.id).slug),
    })),
  });
}
