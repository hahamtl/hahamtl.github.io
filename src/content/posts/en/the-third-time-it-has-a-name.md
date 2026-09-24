---
title: "The third time, it has a name"
description: "Three incidents over two months, each fixed on its own, each looking unrelated: a dropped reply, a made-up defence of a stale document, invented code references. On the third one someone said the shape out loud. It was one bug, in the fallback, the whole time."
date: 2026-10-05
tags: [engineering, agents]
cover: /img/third-time/timeline.svg
---

The first incident was small. A reply in a chat thread was dropped: the agent read the message, decided it was nothing it knew how to handle, and said nothing. We added the missing case to the router. Fixed.

The second looked different. A review agent was asked to reconsider a document it had reviewed the week before. Instead of re-reading, it defended its earlier opinion with confident, specific reasoning about content that was no longer in the document. We added a rule: on re-review, fetch the document again. Fixed.

The third looked different again. An engineering agent answered a code question with file paths and function names that did not exist, twice, with the same wrong names both times. We had a code-search tool for exactly this. The agent had not called it. We were about to add another rule when someone said: this is the same bug as the other two.

## The shape

Every request that reached the agent went through a router. The router had a table of known cases, each pointing at the capability built for it: this kind of message goes to the thread handler, that kind to the document reviewer, code questions to the code-search tool. Anything the table did not recognise fell through to a generic fallback that answered from the model's general knowledge.

<figure>
<a href="/img/third-time/timeline.svg" target="_blank" rel="noopener"><img src="/img/third-time/timeline.svg" alt="Three incidents on a timeline over two months, each with its own local fix: a dropped thread reply, a defended stale document, fabricated code references. Below them a single bar labelled the real cause: requests outside the router's table landed in a generic fallback that skipped the capability built for them."></a>
<figcaption>Three fixes, two months apart. One cause, visible only once the three were placed side by side.</figcaption>
</figure>

The dropped reply: the message did not match a case, fell through, and the fallback had nothing to say. The defended document: the re-review request did not match the review case exactly, fell through, and the fallback answered from what the model remembered. The invented code: the question was phrased in a way the table did not expect, fell through, and the fallback wrote plausible code from nothing.

Three symptoms. One path. Each of our fixes had added a row to the table so that one more phrasing would not fall through. None had touched the place all three fell into.

## Why it took three

Each incident arrived with its own story. A dropped reply looks like a threading bug. A defended document looks like a memory problem. Invented code looks like hallucination. The people who fixed them were different, the tickets were different, and each fix was correct for its case. Nothing in the process asked "what else has looked like this?"

The signal that finally connected them was boring: the third fix would have been the same kind of fix as the first two. A new row in the same table. That is the moment to stop and ask what the table is for.

## What we changed

Not the table. The fallback.

The fallback now does three things it did not do before. It says which capability it thinks the request was closest to, and asks, instead of answering from general knowledge. If the request touches code, documents or a thread, it routes through the relevant tool anyway, because a tool answering "nothing found" is better than a model answering from nothing. And every fallback hit is logged with the request shape, so the next unrecognised phrasing is a row in a report, not an incident.

<figure>
<a href="/img/third-time/router.svg" target="_blank" rel="noopener"><img src="/img/third-time/router.svg" alt="Before: a router table with known cases pointing at capabilities, and an unrecognised request dropping into a generic fallback that answers from general knowledge. After: the same table, but the fallback asks which capability was meant, routes through the relevant tool anyway, and logs the request shape."></a>
<figcaption>The table did not change. What happens when a request misses the table did.</figcaption>
</figure>

## The rule of three

I have started to treat the third occurrence of a shape as a different kind of event from the first two. One incident is a bug. Two might be coincidence. Three of the same shape, each "unrelated", is a pattern that already has a root, and the root is almost always in the place the special cases were protecting you from looking at: the default path, the fallback, the else branch.

| | Fixing the case | Fixing the fallback |
|---|---|---|
| Effort | small, local | medium, touches a shared path |
| Fixes | this phrasing | every phrasing not yet seen |
| Next incident | certain, with a new story | a log line |
| Feels like | progress | admitting the first two fixes were partial |

The last row is why it takes three. Nobody wants to reopen two closed tickets. Do it anyway.

<div class="callout">
<p><strong>The rule:</strong> when a fix would be the third row of the same kind in the same table, stop adding rows. Name the shape, find where the misses land, and fix that path once.</p>
</div>
