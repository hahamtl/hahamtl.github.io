---
title: "Three weeks away, a new backend"
description: "I came back from leave to the same chat surface and a completely different system under it: about twenty architectural changes, none with my name on them. Reading the change log was not catching up. What I did instead, and the bug that only showed up because I did."
date: 2026-09-28
order: 8
rank: 11
tags: [career, engineering]
cover: /img/back-from-leave/before-after.svg
---

Three weeks of parental leave. The kind where you do not open the laptop, because the laptop is not the point.

On the first morning back, the product looked the same. Same chat surface, same assistants, same names. Underneath, roughly twenty merged changes had replaced the whole backend. The in-process loop I had written about was gone; the agents now ran on a managed runtime, each one a declarative config plus a persona file. Instructions had moved out of the app repo into a shared repo that was now their only home. A shared tools server sat between every agent and every integration. And a new loading model meant an instruction file's body was read only on demand.

All of it was good work, done by a teammate, with reasons. None of the reasons were in my head.

## The wrong way to catch up

My first instinct was the obvious one: read the change log, skim the merged requests, get to the tickets by lunch. I have done that after every holiday of my career and it has always worked.

It works when the changes are additive. It does not work when the model has changed. A commit message tells you what moved. It does not tell you what the author now assumes, and the assumptions are what you will trip over.

<figure>
<a href="/img/back-from-leave/before-after.svg" target="_blank" rel="noopener"><img src="/img/back-from-leave/before-after.svg" alt="Left column, before leave: an in-process API loop, instructions copied inside the app repo, each agent wiring its own integrations, whole instruction files always injected. Right column, after: a managed runtime with config plus persona per agent, a shared instructions repo as the only home, one shared tools server, instruction bodies loaded on demand. Every row changed."></a>
<figcaption>Same product on top. Every layer under it replaced while I was away.</figcaption>
</figure>

## What I did instead

I gave the whole first day to it and touched no ticket.

For each change, four questions, written down: what is it, why was it done, what did it replace, and what would break if I still believed the old thing. The last question is the one that pays. The first three are in the merge requests. The fourth is not anywhere.

Then I reproduced the local development setup from nothing. Not "it runs on my machine because it ran before"; from a clean checkout, following only what the repo said, until an agent answered me locally. Every place the instructions were wrong or missing was a place where my mental model was about to be wrong too.

By the end of the day I had a picture I could draw on a whiteboard. That is the test. If you cannot draw it, you have not caught up, however many commits you have read.

## The bug that only showed up because I did this

The new loading model was the fourth question paying off.

Under the old runtime, an instruction file was injected whole, every time. People wrote accordingly: a short description at the top, then the real rules further down, sometimes far down. Under the new runtime, the description was always loaded and the body only when the model decided it needed it. Every rule that lived in a body was now optional, silently, with no error and no warning. The files had not changed. What was guaranteed to be read had.

<figure>
<a href="/img/back-from-leave/guaranteed.svg" target="_blank" rel="noopener"><img src="/img/back-from-leave/guaranteed.svg" alt="Two loading models. Old: the whole instruction file is injected every turn, so a hard rule near the bottom is always read. New: only the short description is always loaded; the body is fetched on demand, so the same hard rule is now merely available and often never read. The fix moves load-bearing rules into the always-loaded layer and makes the description a decisive router."></a>
<figcaption>Guaranteed versus available. The files did not change. The contract about what gets read did.</figcaption>
</figure>

I would not have seen it from the change log. The change log said "progressive disclosure for skill bodies", which is accurate and sounds like an optimisation. It was only because I had spent the morning asking what would break if I still believed the old thing that the question "which rules are now optional?" occurred to me at all.

The fix was mechanical once named: promote the load-bearing rules into the layer that is always injected, and turn each description into a decisive router that tells the model when the body matters. A week later a teammate and I proved the shared repo actually worked across two agent products with a planted canary sentence. It was visible in both the next day.

## Reading versus rebuilding

| | Reading the change log | Rebuilding the model |
|---|---|---|
| Time | an hour | a day |
| You learn | what moved | what is now assumed |
| Good for | additive changes | structural ones |
| Blind spot | everything that did not change but means something different now | almost nothing, if you can draw it after |
| Test | you finish the list | you can explain each decision to someone else |

## What I would tell myself

Three weeks is long enough for a system to change shape. When it has, the first day back is not lost time; it is the cheapest day you will spend all quarter, because every hour of it saves a wrong assumption you would otherwise carry for months.

<div class="callout">
<p><strong>The rule:</strong> after a structural rewrite lands while you are away, budget a full session to rebuild the model yourself: four questions per change, reproduce the setup from nothing, draw it. And whenever the loading mechanism under a text changes, check what is guaranteed to be read, not what is merely available.</p>
</div>
