import { feed } from '../../lib/rss';
export const GET = (context) => feed('zh', context.site);
