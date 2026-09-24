---
title: "Three shapes of an agent"
description: "A year of building agents took me from a hand-written loop around the Bedrock API, to Bedrock AgentCore, to a Claude Code plugin that is mostly markdown. What each shape is good for, and the one thing that survived all three."
date: 2026-09-24
tags: [agents, architecture]
cover: /img/three-shapes/cover.svg
---

When I started building agents at work, the word meant one thing to me: call a model, read the answer, decide what to do next, call it again. Since then I have built the same kind of system three ways: a loop we wrote ourselves around the Bedrock API, then on Bedrock AgentCore, then as a Claude Code plugin. Each time the word "agent" meant something different, and each time the part I wrote got smaller.

This is the short version of what changed, and what I would keep.

<figure>
<a href="/img/three-shapes/cover.svg" target="_blank" rel="noopener"><img src="/img/three-shapes/cover.svg" alt="Three shapes: a hand-written loop around a model API, a managed runtime that owns the loop, and a folder of text files loaded into an assistant the person already uses."></a>
<figcaption>Green is what you write. It shrinks from left to right.</figcaption>
</figure>

## Shape one: a loop around the model API

The first system was a handful of assistants living in Slack, each handling one kind of task: reading documents, drafting plans, changing code. Under the hood every one of them was the same thing: a stateless call to a Claude model through the Bedrock API, wrapped in code we wrote ourselves.

Stateless is the important word. The model remembers nothing between calls, cannot run a tool, and stops whenever it stops. So the code around it had to supply everything else:

- a store for the conversation, so the next call knew what the last one said
- a parser that read the model's answer and decided which tool to run
- a queue and retries, because tools fail and models time out
- the "are we done yet" check that ends the loop

Six months in, most of the repository was this runtime. The tasks the assistants performed were a thin layer on top. It worked, and people used it every day, but every new capability had to pass through a runtime none of us had set out to build.

## Shape two: a managed runtime

The second version moved the loop out of our code and onto Bedrock AgentCore. The managed runtime took over the parts we had written by hand: sessions, memory, tool calls, identity, and long-running work that survives a restart. What we brought was instructions, tool definitions, and a few opinions about when to stop and ask a person.

The gain showed up in the diff first. The runtime folder shrank to almost nothing.

What surprised me was where the effort went instead. With no loop left to tune, the quality of the whole system came down to two things: how well the instructions were written, and how honest the tool contracts were. A tool that said "returns the issue" but sometimes returned a stub used to be a plumbing bug. Now it was a bug in the agent's judgement, because the agent believed it.

The cost was a boundary. When something went wrong we debugged through AWS abstractions, and the state lived in an AWS store. You accept that trade when the loop is the least interesting part of what you are building. For us it was.

## Shape three: a folder of text files

The third one I would not have predicted. An agent that helps engineers write tests, shipped as a Claude Code plugin, so it runs inside the coding assistant they already had open. No service behind it, no queue. A folder of markdown files with instructions, a list of MCP tools it may call, and a couple of scripts. The runtime is Claude Code on the person's laptop. The credentials are the person's own.

That changes what "deploy" means. A new version is a version bump in the plugin marketplace. Permissions are whatever the user already has, no more. And because a person is sitting right there, the agent can stop and ask before every write to a shared system, which for shared systems is exactly the behaviour you want.

It also changes what the agent cannot do. It does not run at night. It cannot pick up a ticket on its own. It is exactly as autonomous as a conversation, which is to say not at all.

<figure>
<a href="/img/three-shapes/one-turn.svg" target="_blank" rel="noopener"><img src="/img/three-shapes/one-turn.svg" alt="One turn through each shape. In shape one four of the seven boxes are your code. In shape two your part is a text file the runtime reads. In shape three your part is a folder the assistant reads, and the person approves each write."></a>
<figcaption>One turn through each shape. Green boxes are yours. Click to open full size.</figcaption>
</figure>

## Side by side

| | Loop around the API | Managed runtime | Plugin of text files |
|---|---|---|---|
| Example | Bedrock API + your code | Bedrock AgentCore | Claude Code plugin |
| Who runs the loop | your code | the runtime | the assistant on the laptop |
| Where state lives | your database | the runtime's store | the conversation |
| What you write | code | instructions + tool contracts | instructions + tool contracts + a few scripts |
| How you ship | deploy a service | update instructions | bump a version |
| Whose credentials | a service account | a service account or the runtime's identity | the person's own |
| Runs unattended | yes, if you build it | yes | no |
| A person can approve each step | only if you build it | if the runtime supports pausing | by default |
| Good for | one transformation, no state worth keeping | autonomous work in a shared channel | work where a person should decide every step |

## What I keep from all three

Line them up and one thing stands out. The part I wrote got smaller and more like prose each time: code, then configuration, then instructions. The instructions and the tool contracts outlived every loop, and they moved between Bedrock, AgentCore and Claude Code almost unchanged because we had kept them as plain text.

<div class="callout">
<p><strong>The rule I use now:</strong> write the agent as text first, choose the runtime last.</p>
<ul>
<li>Work that has to happen while nobody is watching, in a shared channel: the managed runtime.</li>
<li>Work where a person should decide every step: put the agent where that person already works.</li>
<li>A single transformation with no state worth remembering: the raw loop is enough.</li>
</ul>
</div>
