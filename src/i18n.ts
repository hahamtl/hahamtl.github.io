export type Lang = 'en' | 'zh';
export const LANGS: Lang[] = ['en', 'zh'];
export const DEFAULT_LANG: Lang = 'en';

// URL prefix per language. English lives at the root, Chinese under /zh/.
export const prefix = (lang: Lang) => (lang === DEFAULT_LANG ? '' : `/${lang}`);

// Topic keys are stable English slugs used in frontmatter `tags`.
// Display names are per language. Add a topic here before using it in a post.
export const TOPICS: Record<string, Record<Lang, string>> = {
  agents:      { en: 'AI agents',   zh: 'AI 智能体' },
  tooling:     { en: 'tooling',     zh: '工具链' },
  automation:  { en: 'automation',  zh: '自动化' },
  architecture:{ en: 'architecture',zh: '架构' },
  engineering: { en: 'engineering', zh: '工程实践' },
  career:      { en: 'career',      zh: '职业' },
  meta:        { en: 'meta',        zh: '关于本站' },
};
export const topicName = (key: string, lang: Lang) => TOPICS[key]?.[lang] ?? key;

export const UI: Record<Lang, Record<string, string>> = {
  en: {
    siteName: 'Lin Zhu',
    tagline: 'staff engineer · tooling & AI enablement',
    description: 'Notes from an engineer on tooling, automation, AI agents in production, and whatever comes next.',
    nav_writing: 'Writing',
    nav_about: 'About',
    nav_rss: 'RSS',
    switch: '中文',
    writing_h1: 'Writing',
    writing_lede: 'Twelve years building the systems other engineers rely on: automation, internal tooling, and lately AI agents in production. Short posts, one idea each.',
    topics: 'Topics',
    all_topics: 'All',
    topic_h1: 'Topic',
    also_in: 'Also available in',
    other_lang_name: '中文',
    footer_left: 'opinions my own',
    footer_right: 'Markdown in git · built with Astro · hosted anywhere',
    read_in_other: '中文版',
    no_translation: '',
  },
  zh: {
    siteName: 'Lin Zhu',
    tagline: '工程师 · 工具链与 AI 赋能',
    description: '一个工程师的笔记：工具链、自动化、生产环境里的 AI 智能体，以及接下来会遇到的事。',
    nav_writing: '文章',
    nav_about: '关于',
    nav_rss: 'RSS',
    switch: 'English',
    writing_h1: '文章',
    writing_lede: '十二年来一直在做其他工程师依赖的系统：自动化、内部工具，最近是生产环境里的 AI 智能体。短文，一篇一个观点。',
    topics: '主题',
    all_topics: '全部',
    topic_h1: '主题',
    also_in: '本文另有',
    other_lang_name: 'English',
    footer_left: '仅代表个人观点',
    footer_right: 'Markdown 存在 git 里 · Astro 构建 · 随处可托管',
    read_in_other: 'English version',
    no_translation: '',
  },
};
export const t = (lang: Lang, key: string) => UI[lang][key] ?? UI.en[key] ?? key;

export const fmtDate = (d: Date, lang: Lang, long = false) =>
  lang === 'zh'
    ? d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: long ? 'long' : 'short', year: 'numeric', timeZone: 'UTC' });

// Post ids look like "en/three-shapes-of-an-agent". Split them.
export const splitId = (id: string) => {
  const [lang, ...rest] = id.split('/');
  return { lang: lang as Lang, slug: rest.join('/') };
};
export const postUrl = (lang: Lang, slug: string) => `${prefix(lang)}/posts/${slug}/`;
export const topicUrl = (lang: Lang, key: string) => `${prefix(lang)}/topics/${key}/`;
