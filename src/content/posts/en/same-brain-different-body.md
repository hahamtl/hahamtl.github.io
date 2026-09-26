---
title: "Same brain, different body"
description: "A skill that works in a live chat will misbehave in a scheduled job, and the other way round. The instructions can be shared. The rules around them cannot. What broke when I assumed otherwise."
date: 2026-09-06
order: 4
rank: 10
tags: [agents, architecture]
cover: /img/two-bodies/two-bodies.svg
---

Two requests for the same thing arrived a week apart.

One came from an engineer at a terminal: "plan the tests for this ticket." They wanted to see the plan, argue with it, and approve it. The other came from a manager in a chat thread at six in the evening: "have the tests planned by morning." Nobody would be watching.

Same skill. Same instructions, same tool calls, same output format. I assumed the only difference was the trigger. That assumption cost about two months of small, confusing bugs before I saw the pattern.

## Three things change with the body

The brain is the skill: a markdown file that says what to read, what to decide, what to produce. It moves between runtimes almost unchanged, and I have written about that before. The body is everything around it, and three things about the body change completely between a live conversation and an unattended run.

**Who is watching.** In a terminal, a person reads every line as it appears. In a scheduled job, nobody reads anything until the morning, if then.

**When it may ask.** In a conversation, a question is cheap. In a job at three in the morning, a question is a dead run.

**What "done" means.** At the terminal, done is when the person says so. Unattended, done has to be a state the system can verify without anyone there.

<figure>
<a href="/img/two-bodies/two-bodies.svg" target="_blank" rel="noopener"><img src="/img/two-bodies/two-bodies.svg" alt="One skill file in the middle. To the left, the interactive body: a person at a terminal, questions batched into one round, a gate before every write, the person decides when it is done. To the right, the autonomous body: a scheduler, a fresh session every run, no questions, drafts instead of gates, loud failure, done is a verifiable state."></a>
<figcaption>One brain, two bodies. The rules around the skill are written per body.</figcaption>
</figure>

## What broke on the interactive side

Every bug here came from the agent treating a live conversation like a batch job.

**It dripped questions.** A review agent asked one follow-up, waited, asked another, waited, asked a third. Each question was reasonable on its own. Together they were the worst version of the conversation. The rule now is blunt: collect every remaining question into one round, and never restate one that was answered.

**It lied about status.** Someone reported a coding agent stuck for an hour and a half. The work had finished in ninety-four seconds. The final message was too long for the chat platform, failed silently, and left a "still running…" placeholder on screen. Elsewhere, a bot displayed "nothing has started yet, please approve" for a job that had been running for four minutes, so the person approved again and paid for the job twice. In a conversation, the status message is the product. If it can disagree with reality, it will, at the worst moment.

**It guessed in silence.** A thread mentioned two work items. The agent picked one and said nothing. The first fix, a smarter pick, was rejected outright. The second, block and ask, jammed threads, because a conversation never resets and one old mention could lock it forever. The fix that held was the least clever: keep the simple rule, but say the choice out loud every time. In a live surface, disclosure beats prevention more often than you would expect.

## What broke on the autonomous side

Here the bugs came from the opposite mistake: treating an unattended run like a conversation.

**It never started a new conversation.** A nightly agent kept reporting "this is the fourth time this has failed for the same reason." We cleared its memory. It said it again the next night. The cause was one identifier passed to the runtime that never changed between runs. The agent was not remembering anything. It had been in the same conversation for a week. In a chat, a long conversation is the feature. In a job, every run must start clean, and the identity that persists must be a separate, deliberate key.

<figure>
<a href="/img/two-bodies/nightly.svg" target="_blank" rel="noopener"><img src="/img/two-bodies/nightly.svg" alt="Top row: five nightly runs all sharing one session identifier, so each run continues the previous conversation and the agent reports the same failure as recurring. Bottom row: the same five runs with a rotated session identifier and a separate durable identity key, each run starting fresh."></a>
<figcaption>Five nights, one session. The agent was not remembering. It had never been allowed to forget.</figcaption>
</figure>

**It waited for someone who was not there.** Gates that ask "go?" are the right design when a person is present. Unattended, the same gate is a run that hangs until morning. The autonomous body cannot ask, so it needs a different safety net: write drafts, never promote, and let the person review in the morning. That is the previous post in one sentence.

**It failed quietly.** A tool returned zero results and the agent answered from general knowledge, confidently and wrong. In a conversation, someone would have said "that is not what I asked." At night, the wrong answer went into a report. Unattended agents need fail-loud defaults: an empty result is an error, a missing input stops the run, and the failure is posted where a person will see it first thing.

## Side by side

| | Interactive body | Autonomous body |
|---|---|---|
| Who watches | a person, live | nobody until later |
| Questions | allowed, batched into one round | not allowed; missing input stops the run |
| Safety net | a gate before every write | drafts, never promoted by the agent |
| Session | one long conversation is the point | fresh every run; durable identity is a separate key |
| Status | must never disagree with reality; say every choice out loud | post the result and every failure where people will look |
| Empty tool result | ask or say so | treat as an error |
| Done | when the person says so | a state the system can verify |
| Runtime that fits | the assistant on the person's laptop | a managed runtime or a scheduler |

## Which body first

Given a new skill, I pick the body with one question: should a person decide every step of this? If yes, build the interactive body and put the skill where that person already works. If the value is that it runs while nobody is there, build the autonomous body and accept that it cannot ask.

Then write the operating rules for that body. Not copied from the other one. The brain is shared. The body is not.

<div class="callout">
<p><strong>The rule:</strong> a skill is portable; its operating rules are not. Before moving a skill to a new surface, rewrite the rules about asking, status, sessions and failure for that surface, and test the run with nobody watching.</p>
</div>
