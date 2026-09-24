---
title: "Draft until a human says so"
description: "The cheapest way to let an agent write into shared systems is not a permission wall and not a stricter prompt. It is a status field: everything the agent creates exists, but nothing counts until a person promotes it."
date: 2026-08-09
tags: [agents, engineering]
cover: /img/draft-until/two-worlds.svg
---

An agent that reviews requirements documents once went looking for the document it was asked to review, matched too loosely, picked up an unrelated stale draft, and renamed it to match the one it should have found. The fix was one line in a search filter. The document sat quietly wrong for days, because nothing in the system distinguished a name an agent had written from a name a person had written.

That is the whole problem in one incident. The agent did not do anything it was not allowed to do. What it wrote simply became true the moment it was written.

## Two bad answers

When an agent needs to write into a system other people rely on, the first instinct is one of two things.

Take the access away. The agent proposes, a person copies and pastes. Safe, and the agent is now a slow autocomplete. Every gain in speed leaks out through the copy step.

Or keep the access and make the prompt stricter. Add rules, add examples, add "never do X". This helps at the margin and fails at the tail, and the tail is the only part anyone remembers.

Both answers share an assumption: that the moment of writing is the moment of truth. Everything I have built this year that worked came from breaking that assumption.

## Two worlds

Every shared system has two layers that usually collapse into one.

There is the layer where things **exist**: rows, files, pages, tickets, messages. And there is the layer where things **count**: the report reads them, the pipeline runs them, the team acts on them, the channel shows them to two hundred people.

The rule I use now is to keep those layers apart for anything an agent produces. The agent may make things exist. Only a person may make them count. In practice that is a status field on the artifact and a default filter in every consumer: draft records do not appear in the report, draft pull requests do not trigger reviews, draft messages stay in a private channel.

<figure>
<a href="/img/draft-until/two-worlds.svg" target="_blank" rel="noopener"><img src="/img/draft-until/two-worlds.svg" alt="An agent writes an artifact into the 'exists' world with a draft mark. Consumers such as reports, pipelines and channels read only from the 'counts' world. A person moves the artifact across by promoting it."></a>
<figcaption>Existing and counting are different worlds. The agent writes into the first. Only a person moves things into the second.</figcaption>
</figure>

## The same shape everywhere

Once you look for it, the shape is already there in most systems, half-used.

| Artifact | The draft state | What "promote" means | Who filters drafts out |
|---|---|---|---|
| Code change | draft pull request, no reviewers assigned; a red one titled DO NOT MERGE | a reviewer marks it ready | the review queue, the merge bot |
| Ticket | agent text goes in its own field, never over the human-written description | a person folds it into the description or ignores it | anyone reading the ticket sees who wrote what |
| Document | suggestions, not edits | the owner accepts | the published version |
| Data record | created with an "unreviewed" status and an owner field set to the agent | a person sets the status and takes ownership | every report already excludes that status by default |
| Message | posted to a private channel or thread | a person reposts to the team channel | the audience |

None of these needed new infrastructure. Each needed one decision: which field means "draft", and a promise that the agent never touches the two fields that flip it.

## The rule I had to loosen

The clearest case was an agent that creates test cases in a shared test-management tool. That tool feeds the team's coverage numbers. A wrong record there is not a typo, it is a lie in a chart that people make decisions from.

The first rule was blunt: the agent may add cases to existing groups but may never create a new group. Safe. And in the first week with real users, dead end after dead end: "no matching group found, ask a person." The very situations where help was most useful were the ones the rule forbade.

We reversed it. The agent may create the group. But it creates it with the status the reports already ignore, and with itself named as owner. It never sets the status to ready and never changes the owner. Both flips are human actions, and both are one click. The safety net moved from "cannot do it" to "cannot count until someone looks". Nothing about the coverage numbers changed. Everything about how useful the agent was did.

<figure>
<a href="/img/draft-until/one-write.svg" target="_blank" rel="noopener"><img src="/img/draft-until/one-write.svg" alt="One write, step by step: the agent shows the full list of what it will create and waits for go; it writes; it reads every field back and compares; each record carries an origin tag and the draft status; the reports skip it; a person reviews and promotes; only then it counts."></a>
<figcaption>One write, end to end. Amber steps are a person's. Nothing reaches the report until the last one.</figcaption>
</figure>

## Three things that go with it

Draft-by-default only holds if a few smaller habits hold with it.

**Show the list before writing.** Every record the agent is about to create, in one screen, and one word to proceed. One word to create nothing. A person cannot review two hundred drafts after the fact; they can review a list of twelve before.

**Read it back.** After every write, fetch the record and compare field by field with what was intended. Tools lie, sometimes in small ways, and a draft that is silently different from what was approved is worse than no draft.

**Tag the origin.** Every artifact the agent makes carries a mark saying so, in a field nobody edits. Months later, when someone asks "where did this come from", the answer is in the record, not in someone's memory.

## The cost

Drafts need owners. A system full of unreviewed agent output is a new kind of clutter, and clutter that looks like real work is worse than an empty folder. So the promise cuts both ways: the agent never promotes, and a person always either promotes or deletes. A draft older than a sprint with no owner gets cleaned up.

<div class="callout">
<p><strong>The rule:</strong> before an agent writes anywhere shared, answer two questions. What is the draft state of this artifact, and who promotes it? If either has no answer, the agent does not write there yet.</p>
</div>
