---
title: "Three redesigns in five days"
description: "A thread mentioned two work items and the agent silently picked one. The clever fix was rejected. The safe fix jammed threads for good. What shipped was the original behaviour plus one sentence. A short story about when disclosure beats prevention."
date: 2026-08-23
order: 13
rank: 11
tags: [agents, engineering]
cover: /img/thread-lock/three-attempts.svg
---

A chat thread mentioned two work items. Someone asked the agent to do something about "the ticket". The agent picked the first one it had seen in the thread and carried on. Nobody noticed until the wrong item had a comment on it.

The original rule was simple: the first work item mentioned in a thread is the thread's work item, for the rest of the thread. Call it the lock. The lock had done its job for months. It failed here because a second item showed up and the rule had no opinion about that.

## Attempt one: be smarter

The obvious fix was to let the model choose. Look at both items, read the message, pick the one the person most likely meant. It would have worked most of the time.

The product owner rejected it before it was built, and I think they were right. Making the agent good at guessing which of two items you mean is a feature. It invites people to be vague, and it moves a decision that belongs to the person into the model. Safe or not, it was not a feature we wanted.

## Attempt two: be strict

Second fix: if a thread ever mentions more than one work item, block, and ask which one. No guessing, no feature. Shipped it.

It failed in a way I did not predict. Conversation history in a thread never resets. Once a second item had been mentioned, even in passing, even weeks earlier, the thread was permanently ambiguous. Every later request hit the block and asked the same question. People stopped using those threads. A safety mechanism that can trigger but never un-trigger over the life of a conversation is worse than the bug it replaced, because the bug was occasional and the block was forever.

<figure>
<a href="/img/thread-lock/three-attempts.svg" target="_blank" rel="noopener"><img src="/img/thread-lock/three-attempts.svg" alt="Three attempts in five days. One: let the model pick, rejected as an unwanted feature. Two: block and ask, jammed threads permanently because history never resets. Three: keep the original first-mention lock and say it out loud every time. Shipped."></a>
<figcaption>Five days, three designs. The one that shipped changed no logic at all.</figcaption>
</figure>

## Attempt three: say it out loud

Third fix, the one that shipped: keep the original lock exactly as it was, first mention wins. Add one thing. Every time the agent acts on a thread's work item, it states which item it is acting on, in the first line of its reply.

"Working on ABC-123 · Fix the export timeout."

That is the whole change. The guess is still a guess. But it is a visible guess, and a wrong one gets corrected in the next message instead of discovered a day later on the wrong ticket. Nobody has hit the two-item case since without seeing it immediately.

## What I took from it

| | Smarter | Stricter | Louder |
|---|---|---|---|
| Logic change | large | medium | none |
| Wrong pick | rarer, still silent | impossible, but everything blocks | same rate, visible at once |
| Side effect | invites vagueness | jams threads forever | one extra line per reply |
| Fate | rejected | rolled back | shipped |

I had assumed the fix for a wrong guess was either a better guess or no guess. There is a third option: the same guess, said out loud. In a live conversation, where a person reads every reply, that is often the cheapest and the safest.

<div class="callout">
<p><strong>The rule:</strong> before making an agent smarter or stricter about an ambiguous choice, try making it state the choice. And never ship a block that a conversation cannot get out of.</p>
</div>
