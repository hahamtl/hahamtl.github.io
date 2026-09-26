export type Lang = 'en' | 'zh';
export const LANGS: Lang[] = ['en', 'zh'];
export const DEFAULT_LANG: Lang = 'en';

// URL prefix per language. English lives at the root, Chinese under /zh/.
export const prefix = (lang: Lang) => (lang === DEFAULT_LANG ? '' : `/${lang}`);

// Topic keys are stable English slugs used in frontmatter `tags`.
// Display names are per language. Add a topic here before using it in a post.
export const TOPICS: Record<string, Record<Lang, string>> = {
  agents:      { en: 'AI agents',   zh: 'AI Agent' },
  tooling:     { en: 'tooling',     zh: '工具链' },
  automation:  { en: 'automation',  zh: '自动化' },
  architecture:{ en: 'architecture',zh: '架构' },
  engineering: { en: 'engineering', zh: '工程实践' },
  career:      { en: 'career',      zh: '职业' },
  testing:     { en: 'testing',     zh: '测试' },
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
    switch: '中文版',
    writing_h1: 'Writing',
    writing_lede: 'Notes for people who build tools for engineers: automation, internal tooling, AI agents. One idea per post.',
    sort_rank: 'Recommended',
    sort_date: 'Newest first',
    prev_post: 'Previous',
    next_post: 'Next',
    series_hint: 'Sorted by how much I would recommend each post; switch to newest first if you prefer.',
    topics: 'Topics',
    all_topics: 'All',
    topic_h1: 'Topic',
    also_in: '',
    other_lang_name: '中文版',
    footer_left: 'opinions my own',
    footer_right: 'Markdown in git · built with Astro · hosted anywhere',
    read_in_other: '本文有中文版，点这里阅读 →',
    no_translation: '',
  },
  zh: {
    siteName: 'Lin Zhu',
    tagline: '工程师 · 工具链 · AI 赋能',
    description: '一个工程师的笔记：工具链、自动化、生产环境里的 AI Agent，以及接下来会碰到的事。',
    nav_writing: '文章',
    nav_about: '关于',
    nav_rss: 'RSS',
    switch: '英文原文',
    writing_h1: '文章',
    writing_lede: '写给给工程师做工具的人：自动化、内部工具、AI Agent。一篇只讲一件事。',
    sort_rank: '推荐顺序',
    sort_date: '最新在前',
    prev_post: '上一篇',
    next_post: '下一篇',
    series_hint: '默认按我推荐的程度排，也可以切成最新在前。',
    topics: '主题',
    all_topics: '全部',
    topic_h1: '主题',
    also_in: '',
    other_lang_name: '英文原文',
    footer_left: '仅代表个人观点',
    footer_right: '内容是 git 里的 Markdown · Astro 构建 · 可托管在任何地方',
    read_in_other: '本文有英文原文，点这里阅读 →',
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
