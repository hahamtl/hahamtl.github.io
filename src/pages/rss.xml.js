import { feed } from '../lib/rss';
export const GET = (context) => feed('en', context.site);
