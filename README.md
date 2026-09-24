# linzhu1989.github.io

Lin Zhu's writing — Markdown posts in `src/content/posts/`, built with Astro, deployed to GitHub Pages by the workflow in `.github/workflows/`.

- New post: add `src/content/posts/<slug>.md` with frontmatter `title · description · date · tags · (cover) · (draft)`, commit, push to `main`.
- Images: `public/img/<slug>/…`, referenced as `/img/<slug>/name.png`.
- Local preview: `npm install && npm run dev`.


## Structure (2026-09-23)

- `src/content/posts/<lang>/<slug>.md` — one post per language; the same slug in `en/` and `zh/` is one post in two languages. English is the default and lives at `/posts/<slug>/`, Chinese at `/zh/posts/<slug>/`.
- `src/i18n.ts` — UI strings, topic list and display names, date formats, URL helpers. Add a topic there before tagging a post with it.
- `src/components/Writing.astro` — the post list with topic chips, shared by the home pages and `/topics/<topic>/` (and `/zh/...`).
- `src/components/Post.astro` — post page; shows the language link when a translation exists.
- `public/img/<slug>/` — diagrams as SVG; `*.zh.svg` for the Chinese version when the drawing has text.
- Feeds: `/rss.xml` (en), `/zh/rss.xml` (zh).
