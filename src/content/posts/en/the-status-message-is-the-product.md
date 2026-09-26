---
title: "The status message is the product"
description: "One job finished in 94 seconds and showed 'still running' for an hour and a half. Another said 'nothing has started, please approve' four minutes after it had started, so the user approved again and paid twice. Neither was a bug in the work. Both were bugs in the sentence about the work."
date: 2026-09-02
order: 12
rank: 6
tags: [engineering, agents]
cover: /img/status-message/two-paths.svg
---

A user reported that the coding assistant had been stuck for an hour and a half. The screen said "still running…" with a spinner. We opened the logs. The job had finished in 94 seconds. The final message, the one that replaces the spinner, had been too long for the chat platform. It was rejected, quietly, and nothing else ever updated the screen. The work was perfect. The sentence about the work was missing.

A month later, a different user launched an expensive job twice, seven minutes apart. We assumed a double click. We read the transcript. Four minutes after the first launch, the bot had displayed "nothing has started yet, please approve." The user did exactly what the bot told them. Two code paths had two different ideas about whether the job was running. One of them wrote the status message.

## What the user actually sees

When a system does something slow on someone's behalf, the person does not see the work. They see a sentence about the work. For as long as the job runs, that sentence is the whole product. If it says running, the job is running. If it says not started, they will start it.

This sounds obvious. In practice the status message is usually the last thing written, by whoever is closest to the code that emits it, from whatever variable is handy. It is treated as a label on the work rather than as a promise to the person.

<figure>
<a href="/img/status-message/two-paths.svg" target="_blank" rel="noopener"><img src="/img/status-message/two-paths.svg" alt="Before: the run and the status message read from two different places, so the run can be four minutes in while the message says not started. After: one function is the only source of the state, and both the job and the message read from it."></a>
<figcaption>Two code paths, two opinions about the truth. The person only ever saw one of them.</figcaption>
</figure>

## The two failure shapes

**The message never arrives.** The job's last act is to post the summary. If that post fails, for any reason, the placeholder stays. The fix is not "make the message shorter", though we did. The fix is that the final update must never depend on the summary succeeding. Post a short, guaranteed line first. Attach the long summary separately, and if it fails, the screen already says done.

**The message comes from somewhere else.** The gate said "nothing has started" because the code that renders the gate looked at a different record than the code that launches the job. Both were right about their own record. The fix was one shared function that answers "what is the state of this run?" and a rule: the gate, the status line and the launcher all call it. Nobody reads the state from anywhere else.

## The habit

Whenever an investigation starts with "why did the user do something strange", read what the system told the user first. In both cases here, the user behaved correctly. They believed the screen.

| | Treat status as a label | Treat status as a promise |
|---|---|---|
| Where it is read from | whatever is handy | one function, the same the job uses |
| When it is written | at the end, if the end goes well | first, short, guaranteed; detail later |
| When it is wrong | occasionally, silently | it cannot disagree with the job by construction |
| Who pays | the user, twice | nobody |

<div class="callout">
<p><strong>The rule:</strong> for anything slow, the status line and the job read their state from the same function, and the final update is a short line that cannot fail. If a person did something confusing, find out what the screen told them before you look at anything else.</p>
</div>
