---
title: "What the agent actually reads"
description: "A ticket came out with an empty description because the tool said the field was optional and the rule that said otherwise was in a file the agent never opened. Four things I now treat as safety design when giving an agent a tool: its words, its silences, its name, and its lock."
date: 2026-09-10
order: 5
rank: 7
tags: [agents, tooling]
cover: /img/agent-tools/who-wins.svg
---

An agent created a ticket with an empty description. The rule was clear, in the instructions: a description is mandatory, here is what goes in it. The ticketing platform had not dropped the field. The agent had never sent it.

The tool definition for "create ticket" listed the description as optional. The instruction that said otherwise lived in a file the agent loads only for certain kinds of work, and this was not one of them. Two texts disagreed. The agent went with the one in front of it.

We fixed it by rewriting one sentence in the tool's own description. Not by adding another rule somewhere else.

## Wiring is not the job

When you give an agent a tool, the tempting view is that the work is plumbing: name it, give it a schema, route the call, done. Every bug in this post came from treating a tool that way. The tool definition is not plumbing. It is the only text about that tool the agent is guaranteed to read.

<figure>
<a href="/img/agent-tools/who-wins.svg" target="_blank" rel="noopener"><img src="/img/agent-tools/who-wins.svg" alt="Left: a stack of instruction files, some loaded and some not, one of them holding the rule 'description is mandatory'. Right: the tool definition the agent always sees, saying 'description: optional'. The agent reads the tool definition. The unloaded rule loses."></a>
<figcaption>The agent reads the tool's own words every time. It reads your instruction files only when they are loaded. When they disagree, the tool wins.</figcaption>
</figure>

## Its words

A tool description is a contract the model signs on your behalf. It answers, in the model's head, four questions: when should I use this, when should I not, what must I send, what will I get back. Anything you want the agent to do with the tool, every time, belongs in that text, because that text is the one it cannot skip.

The "optional" bug was one instance. The pattern is general. If your instructions say "always include the owner" and the tool schema does not mark owner as required, the schema is telling the agent something different, and it will believe the schema on the day your instruction file did not load.

So the rule now: the tool's own words state what is required and when to call it. Instruction files add judgement. They never carry the only copy of a hard rule.

## Its silences

Tools lie by omission more than by error.

A search tool returned zero results for a concept a domain expert insisted existed. The first theory was hallucination. The second was context leaking from another thread. The truth was that the tool treated a two-word query as "both words on the same line", and had quietly hidden an entire subsystem. No error, no warning. Zero hits.

Another tool said it returned the issue. Most of the time it did. Sometimes it returned a stub with the key and nothing else, and the agent reasoned from the stub as if it were the issue.

Two rules came out of this. An empty result from your own tool is not proof of absence; in a conversation the agent should say what it searched for, and unattended it should treat empty as an error. And after any write, read the record back and compare field by field, because a write tool that reports success is making a claim, not stating a fact.

## Its name

Names sound like the trivial part. They are where the agent's instructions and its reality can drift apart without anyone noticing.

Our tools reach shared systems through a gateway that normalises names: the upstream platform exposes something like `get_issue_Jira_`, and the agent sees `jira_get_issue`. Sensible. It also means an instruction written against the upstream name refers to a tool that, from the agent's seat, does not exist. The agent then picks the nearest-sounding one, or explains that it cannot do the task, or does something adjacent. All three happened.

Rule: audit tool names against the surface the agent actually sees, never against the upstream documentation. Verb plus noun, from the agent's point of view, and one name per tool across every instruction that mentions it.

## Its lock

A security review found two internal tool gateways with no inbound authentication at all. Anyone who could reach the address could call any tool behind it, with the gateway's own credentials. Nothing had gone wrong yet. That is not the same as safe.

The fix was straightforward once seen: authenticate at the gateway, once. Tools behind it inherit the caller's identity; nothing else needs its own login. It also forced a second question that had been skipped: how far can one bad call reach? Read tools can be broad. Write tools should be narrow, one action each, and the dangerous ones (delete, send, pay) should ask or write a draft rather than act.

<figure>
<a href="/img/agent-tools/gateway.svg" target="_blank" rel="noopener"><img src="/img/agent-tools/gateway.svg" alt="Agents on the left call a gateway in the middle. The gateway authenticates the caller once and normalises tool names. Behind it, upstream systems: a ticketing tool, a wiki, a code host, an internal service. Read tools are drawn wide, write tools narrow, with a draft-or-ask marker on the dangerous ones."></a>
<figcaption>One lock at the gateway. Names normalised there too. Read tools wide, write tools narrow.</figcaption>
</figure>

## A tool definition, reviewed like code

| What to check | The question | Where the bug shows up |
|---|---|---|
| Name | verb + noun, from the agent's seat, identical in every instruction | agent calls a tool that does not exist, or the nearest one |
| When to use, when not | is it in the description itself | agent picks the wrong tool for the job |
| Required fields | does "required" in the schema match the real rule | fields silently empty |
| Empty result | does the description say what "nothing found" means | confident answers from nothing |
| Write verification | is there a read-back after every write | a success message with a wrong record behind it |
| Authentication | is the caller identified at one boundary | anyone on the network is the agent |
| Blast radius | read wide, write narrow, dangerous actions draft or ask | one bad call, one large mess |

None of these rows are about the model. They are about the text and the boundary you put in front of it.

<div class="callout">
<p><strong>The rule:</strong> review a tool definition the way you review code that runs in production. Its description is the contract the agent signs, its silences are its failure modes, its name is how instructions find it, and its lock is the only one there is.</p>
</div>
