---
title: "Three shapes of an agent"
description: "A year of building agents took me from a loop around a chat API, to a managed runtime, to a folder of text files. What each shape is good for, and the one thing I would keep from all three."
date: 2026-09-24
tags: [agents, architecture]
cover: /img/three-shapes/cover.svg
---

When I started building agents at work, the word meant one thing to me: call a model, read the answer, decide what to do next, call it again. Since then I have built the same kind of system three different ways, and the word has meant something different each time. This is the short version of what changed, and what I would keep.

![Three shapes: a hand-written loop around an API, a managed runtime that owns the loop, and a folder of text files loaded into an assistant the person already uses.](/img/three-shapes/cover.svg)

## Shape one: a loop around an API

The first system was a set of assistants living in a chat tool. One read a requirements document and pointed out gaps. One drafted a technical plan. One opened pull requests. Under the hood every one of them was the same thing: a stateless call to a model, wrapped in code we wrote ourselves.

Stateless is the important word. The model remembers nothing between calls, so we stored the conversation. It cannot run tools, so we parsed its output and ran them. It stops when it stops, so we wrote the retries, the timeouts, and the "are we done yet" checks. Six months in, most of the repository was not about the tasks the assistants performed. It was a small runtime: a state store, a tool router, a queue, a place to put logs.

It worked. People used it every day. But every new capability had to pass through that home-grown runtime, and the runtime was the part none of us had set out to build.

## Shape two: a managed runtime

The second version moved the loop out of our code. A managed harness took over the parts we had written by hand: sessions, memory, tool calls, identity, long-running work that survives a restart. What we brought was instructions, tool definitions, and a few opinions about when to stop and ask a person.

The gain showed up in the diff first. The runtime folder shrank to almost nothing. What surprised me was where the effort went instead. With no loop left to tune, the quality of the whole system came down to two things: how well the instructions were written, and how honest the tool contracts were. A tool that said "returns the issue" but sometimes returned a stub used to be a plumbing bug. Now it was a bug in the agent's judgement, because the agent believed it.

The cost was a boundary. When something went wrong we debugged through someone else's abstractions, and the state lived in someone else's store. You accept that trade when the loop is not the interesting part of what you are building. For us it was not.

## Shape three: a folder of text files

The third one I would not have predicted. An agent that helps engineers plan and write tests, shipped not as a service but as a plugin to the coding assistant they already had open. No server, no queue. A folder of markdown files with instructions, a list of tools it may call, and a couple of scripts. The runtime is the assistant on the person's laptop. The credentials are the person's own.

That changes what "deploy" means. A new version is a version bump. Permissions are whatever the user already has, no more. And because a person is sitting right there, the agent can stop and ask before every write to a shared system, which for shared systems is exactly the behaviour you want.

It also changes what the agent cannot do. It does not run at night. It cannot pick up a ticket on its own. It is exactly as autonomous as a conversation, which is to say not at all.

## What I keep from all three

Line them up and one thing stands out. The part I wrote got smaller and more like prose each time: code, then configuration, then instructions. The durable asset was never the loop. It was the instructions and the tool contracts, and those moved between shapes almost unchanged because we had kept them as plain text.

So my rule now is to write the agent as text first and choose the runtime last. If the work has to happen while nobody is watching, in a shared channel, take the managed runtime. If a person should decide every step, put the agent where that person already works. Keep the raw loop for a single transformation with no state worth remembering.

None of this is a verdict on a product. The shapes will keep changing. The text is what you carry from one to the next.
