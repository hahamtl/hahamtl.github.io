---
title: "Good context in, good answer out"
description: "Across a year of building with LLMs, almost every wrong answer I investigated turned out to be a context problem, not a model problem. Five ways context goes wrong, one habit that catches most of them, and why 'the model hallucinated' is usually the wrong first sentence."
date: 2026-10-12
tags: [agents, engineering]
cover: /img/context-in/where-wrong-came-from.svg
---

When the chat panel I built in February gave a wrong suggestion, my first instinct was to blame the model. It had, after all, produced the wrong words. Over the following months I investigated dozens of wrong answers across three different systems, and I kept a rough tally. The model was the cause in almost none of them.

What was the cause, again and again, was what the model had been given to work with.

<figure>
<a href="/img/context-in/where-wrong-came-from.svg" target="_blank" rel="noopener"><img src="/img/context-in/where-wrong-came-from.svg" alt="A horizontal stacked bar of where investigated wrong answers came from: missing data, tangled data, layout the model misread, a tool that lied, a rule the model never saw, and a thin sliver at the end for the model itself."></a>
<figcaption>Where the wrong answers actually came from. The model is the sliver on the right.</figcaption>
</figure>

## Five ways context goes wrong

**It is missing.** The most common. A partner's configuration had not been loaded, so the model guessed at currencies. A document was silently cut to a tenth of its length by a size limit nobody remembered, so the review covered the introduction and invented the rest. In both cases the model did exactly what it should with what it had. It just had a fraction of it.

**It is tangled.** Two partners discussed in one conversation, and the model answered about one with facts from the other. Two work items mentioned in one thread, and it picked the wrong one. The information was all there. It was not separated.

**It is laid out in a way the model misreads.** A table of partner facts pasted as prose, so a value from one row was read as belonging to the next. Rules for the general case listed after a special case, so the special case was applied to everything. Same facts, wrong shape.

**A tool lied.** A search that returned zero results because it treated two words as "on the same line". A lookup that returned a stub instead of the record. The model believed its tool, as it should. The tool was the liar.

**A rule was never seen.** An instruction that lived in a file the runtime did not load that turn. The model cannot follow a rule it was never shown, and it will not tell you it did not see it.

Only after all five was there ever a case I would call the model's fault, and even then the fix was usually to give it a better example.

## The habit that catches most of them

Before touching the prompt, before blaming the model, look at the exact input the model received for the bad answer. Not what you intended to send. What it got.

This sounds obvious and almost nobody does it, because it is tedious: the assembled prompt is long, the tool results are buried, and the framework may not log it by default. Make it log. Then, for every wrong answer, open the log and ask five questions in order: is the fact here at all, is it separated from its neighbours, is it in a shape a reader would parse correctly, did the tool that produced it tell the truth, and was the rule that should have applied actually present?

<figure>
<a href="/img/context-in/five-questions.svg" target="_blank" rel="noopener"><img src="/img/context-in/five-questions.svg" alt="A checklist flow: wrong answer, then look at the exact input the model received, then five questions in order: present, separated, well-shaped, truthful tool, rule present. Only if all five pass do you look at the model."></a>
<figcaption>Five questions, in order, before the word "hallucination" is allowed.</figcaption>
</figure>

Nine times in ten the investigation ends at one of the five.

## Why this matters more than it sounds

Blaming the model leads to fixes that do not work: a stricter prompt, a bigger model, a plea to "be careful". Blaming the context leads to fixes that do: load the missing data, split the conversation, reshape the table, fix the tool, move the rule to where it is always read. The second list is engineering. The first is hope.

It also changes what you build. If the answer quality is a function of the input, then the parts of the system worth investing in are the parts that assemble the input: the retrieval, the tool contracts, the rules about what is always loaded. That is where the leverage is. The model is a commodity you rent.

<div class="callout">
<p><strong>The rule:</strong> for every wrong answer, look at the exact input first and ask the five questions. Say "the model hallucinated" only after all five come back clean, and expect to say it rarely.</p>
</div>
