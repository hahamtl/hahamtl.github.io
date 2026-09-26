---
title: "A chatbot with no model in it"
description: "Someone needed an internal Q&A bot and everyone assumed that meant an LLM. The real need was a lookup: a few dozen questions with stable answers. We built it in a day with a static table, put an LLM version next to it for the demo, and the table won. Then the edit screen taught us a lesson about autoformatters."
date: 2026-07-05
order: 14
rank: 13
tags: [tooling, engineering]
cover: /img/no-model-bot/side-by-side.svg
---

The request was for a chatbot that could answer common internal questions in the team chat. This year, a request like that arrives pre-loaded with an answer: an LLM, some retrieval, a vector store, a prompt.

I asked to see the questions first. There were about thirty. They had stable answers, the kind that change twice a year when a policy changes. Nobody needed reasoning. They needed the right paragraph, fast, and a way for the person who owned the paragraph to fix it without filing a ticket.

## What we built in a day

A bot with four menus and about thirty-two canned answers, backed by a static table. No model call anywhere. Pick a menu, pick a question, get the answer. Total build time: one working day. Demoed the next morning.

For the demo I also built the LLM version, on purpose, and ran the two side by side on the same questions.

<figure>
<a href="/img/no-model-bot/side-by-side.svg" target="_blank" rel="noopener"><img src="/img/no-model-bot/side-by-side.svg" alt="Side by side demo. Left, the static bot: four menus, thirty-two answers, instant, never wrong, owner edits the text. Right, the LLM version: free-text questions, a second or two per answer, occasionally confident and wrong, edits mean re-tuning. The static one won for this need."></a>
<figcaption>Same questions, two bots. For thirty stable answers, the one without a model won.</figcaption>
</figure>

The static bot answered instantly, never invented anything, and could be corrected by the person who owned the answer. The LLM bot handled phrasing the menus could not, took a second or two, and once in the demo answered confidently and wrong. For this need, the table won, and the stakeholder could see why rather than take my word for it. That was the point of building both.

## The edit screen, and the autoformatter

Two weeks later the bot was live, with an edit flow so a non-engineer could update answers from inside the chat. That is where the interesting bug lived.

Answers contained links, written in the chat platform's own link syntax. Someone would copy an answer out of the chat to edit it, paste it back, and the link markup would be gone: the platform's editor had "helpfully" converted the syntax into a rendered link on paste, and what came back into the table was the rendered text, not the markup. Every edit cycle lost a little more structure.

The first fix was clever: hide invisible characters inside the syntax so the editor's autolinker would not recognise it. The editor recognised it anyway; autoformatters are better at this than you are.

The fix that worked was boring. Store the clean syntax. At display time, and only then, escape the characters the autolinker looks for. The editor never sees a trigger, so it never rewrites anything, and the stored text stays exactly as typed.

## Two lessons from a very small project

| | What we assumed | What was true |
|---|---|---|
| The bot | needs a model | needs a table and an owner |
| The demo | argue for the simpler design | show both, let the result argue |
| The autoformatter | can be outsmarted | can only be starved, at the boundary where it looks |
| Build time | weeks | one day, plus two weeks of polish |

<div class="callout">
<p><strong>The rule:</strong> before adding a model, ask whether the need is reasoning or lookup, and if you are not sure, build both for the demo. And never fight an autoformatter you cannot remove; escape at the boundary where it reads, and keep the stored text clean.</p>
</div>
