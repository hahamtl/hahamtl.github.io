---
title: "Tooling nobody uses is debt"
description: "When we moved an agent to a new home, we listed every command, dashboard and helper around it and asked one question: who opened this in the last thirty days? Half the answer was nobody. What we dropped, what we kept, and the three tests I now run before building an internal tool."
date: 2026-09-26
tags: [tooling, engineering]
cover: /img/unused-tooling/inventory.svg
---

I have owned internal tooling for most of my career: test frameworks, shared services, the scripts everyone forgets exist until they break. Owning them teaches you one uncomfortable thing. A tool that nobody opens is not free. It is a debt with a quiet interest rate, and the bill comes due every time something around it moves.

This year the bill came due twice in one week.

## The inventory

We were moving a test-planning agent from the repository where it was born into a shared plugin that other teams would install. Around the agent itself, a small ecosystem had grown: nine commands, a progress dashboard, a feedback flow that scaffolded a report into the repository, a sandbox protocol for trying skills in isolation, a couple of helper scripts.

Porting all of it was the default plan. Then someone asked the only question that mattered: who opened each of these in the last thirty days?

<figure>
<a href="/img/unused-tooling/inventory.svg" target="_blank" rel="noopener"><img src="/img/unused-tooling/inventory.svg" alt="An inventory of the tooling around the agent at migration time. Each item shows who opened it in the last thirty days: users, the three builders, or nobody. Items opened only by builders or nobody are marked dropped; items opened by users are marked kept."></a>
<figcaption>The inventory at migration time. The right-hand column decided everything.</figcaption>
</figure>

The dashboard: the three of us building the agent. The feedback flow: the three of us. The sandbox protocol: one of us, twice. The commands that turned a ticket into a test plan: every user, every day. The help command: everyone, constantly, and it was slow.

## The wrong assumption

The assumption underneath "port everything" is that an existing tool costs nothing to keep. It cost nothing to build, after all; it was already built.

That is not how it works. Every surface you carry has to be ported, then tested in the new home, then documented for people who never saw the old one, then secured, then explained when it confuses someone, then kept compatible when the thing underneath it changes. A tool with no users pays all of that and returns nothing. It also doubles the size of every migration, because the migration surface is the whole surface, not the used part.

So we dropped them. The dashboard, the feedback flow, the sandbox protocol. The plugin shipped smaller than the repository it came from. In the weeks since, nobody has asked where any of it went.

## What we kept, and what we did to it

The help command survived, and became the most-used thing we shipped. It had been slow because it ran a script that checked the environment and, on some machines, tried to install things. The fix was to make it print a static map and do nothing else. Instant, boring, opened dozens of times a day. The most valuable tool in the set was the one that did the least.

The other survivor was the install itself. Earlier in the year, exposing an internal service to coding assistants had taught me that adoption stalls at the README. Colleagues ran three different clients with three config formats. The install became one command, and usage followed. When the plugin moved to a new marketplace this month, the switch was four lines, and I posted those four lines rather than a page of explanation.

## Three tests before building

I now refuse to start an internal tool until it passes three tests. None of them are about the tool.

**Name the person.** Not "the team", not "QA", not "developers". A person, who will open this next month, for a task they already do. If I cannot name one, I am building for myself, which is fine as long as I admit it and plan to delete it.

**One command, or it does not exist.** Anything with a setup page has a funnel, and most people fall out of funnels. If the install is not one line, the tool has not been shipped yet.

**Count from day one.** Every artifact the tool produces carries a mark saying it produced it, in a field nobody edits. That is not surveillance. It is the only way to answer "who opened this in the last thirty days?" without guessing. The February chat panel I wrote about earlier fails this test: it is still running, and I genuinely do not know whether anyone uses it. That is a debt I am carrying right now.

<figure>
<a href="/img/unused-tooling/three-tests.svg" target="_blank" rel="noopener"><img src="/img/unused-tooling/three-tests.svg" alt="A flow of three gates before building an internal tool: can you name one person who will open it next month; is the install one command; will every artifact carry a mark so usage can be counted. Passing all three leads to build. Failing any leads to do not build yet, or build for yourself and plan to delete."></a>
<figcaption>Three gates before the first commit. Failing one is information, not a verdict.</figcaption>
</figure>

## The other direction: the smallest thing

The same year, a stakeholder needed an internal Q&A bot. The reflex was an LLM with retrieval. The actual need was lookup: a few dozen questions with stable answers, and a way for a non-engineer to edit them.

We built it in a day with no model at all: a static table behind a chat interface, plus an edit screen. Then we built the LLM version next to it, on purpose, and demoed both side by side. The static one answered faster, never made anything up, and could be corrected by the person who owned the answers. It won. The point was not that LLMs are wrong for Q&A. The point was that the smallest tool that removes the friction is the one people keep opening, and you do not know which one that is until you put two in front of them.

## Side by side

| Surface | Opened in 30 days by | What we did |
|---|---|---|
| Ticket → plan commands | every user, daily | kept, unchanged |
| Help command | everyone, and slow | kept, made instant |
| Progress dashboard | the three builders | dropped |
| Feedback scaffolding flow | the three builders | dropped |
| Sandbox protocol | one builder, twice | dropped |
| Install | everyone, once | one command, then four lines at the move |
| February chat panel | unknown | still running; counting is the next task |

<div class="callout">
<p><strong>The rule:</strong> before building, name the person, make the install one line, and put a counter on the output. Before porting, ask who opened it in the last thirty days, and believe the answer.</p>
</div>
