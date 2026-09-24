---
title: "The chatbot that became a tool server"
description: "In February I built a chat panel over an internal service, calling Bedrock directly. By March the same knowledge was an MCP server and the chat panel was optional. What survived the six weeks, and why it was never the chat."
date: 2026-08-30
tags: [agents, tooling]
cover: /img/chatbot-to-tools/before-after.svg
---

I own an internal service whose most-used page is a long form. People use it to create test data for demos, development and testing: pick a partner, then fill in a dozen fields that depend on what that partner supports. Products, currencies, languages, a handful of special cases. Nobody remembers all of it. I do not remember all of it, and I built the thing.

So the loop went: someone fills the form wrong, gets an error they cannot read, messages the team, the team looks it up and replies, they try again. Half a day gone on both sides, for one row of test data.

In February I added a chat panel beside the form. You pick a partner, then either ask for "just a random one" or describe what you need in a sentence, and the panel fills the form for you. Claude through the Bedrock API, a Spring Boot backend, a React frontend. First commit to third prototype: five weeks.

## What I thought I was building

A chatbot. The value, I assumed, was the conversation: a friendly layer that turns "I need a two-passenger booking with a connecting flight" into fourteen field values.

Two things I did early turned out to matter far more than the chat.

**The model does not decide facts.** From day one the split was: the model handles language, code handles truth. Which currencies does this partner support? Which products? Which fields become required when you pick a cruise? Those answers came from plain code reading the service and a cache, exposed to the model as a handful of functions it could ask for. No model inside those functions. The model's job was only to understand what the person meant and call the right one.

I did not have a name for this in February. I called them "tools" in the code because I did not know what else to call them.

**Knowledge lives in files, not in code.** Prompts, partner notes, field documentation, the special flows that skip the model entirely (a button click does not need an LLM): all YAML, loaded at startup, injected into the prompt with placeholders. The motive was hygiene. Keep the Java clean, let non-developers edit the wording. Nobody else ever edited it, but the shape stuck.

<figure>
<a href="/img/chatbot-to-tools/anatomy.svg" target="_blank" rel="noopener"><img src="/img/chatbot-to-tools/anatomy.svg" alt="Anatomy of the February chat panel: a thin chat UI on top; a stateless backend that rebuilds the prompt every turn from YAML knowledge files and calls Bedrock once; below it, plain-code tools that read the service for partner facts. The UI is the thinnest layer."></a>
<figcaption>What the chat panel was made of. The chat itself is the thinnest layer.</figcaption>
</figure>

One more accident worth admitting. I did not know, when I started, that the model keeps no memory between calls. I found out by watching it forget. The fix was to have the frontend hold the whole conversation and send it back every turn, and the backend rebuild the prompt from scratch each time. The docs later called this "stateless by design". It was stateless by discovery. It also turned out to be the right call: nothing to persist, nothing to lose on restart, every request testable on its own.

## What people did with it

They used it. The accuracy problems we hit were almost never the model. When a suggestion was wrong, the context was wrong: a partner's data missing, two partners tangled in one conversation, or facts laid out in the prompt in a way the model misread. Good context in, good answer out. That pattern held for everything I built afterwards.

## The pivot

In March, the ground moved. The company started rolling out coding assistants in the terminal. People who had been opening the web page were now living in a CLI with a model already in it. A chat panel inside a web form started to look like a second, worse chat.

The obvious question: why is the knowledge locked behind my UI? The tools were already plain functions. The partner facts, the field rules, the special flows were already text. All of it could be handed to any assistant that spoke a common protocol.

So the same service grew an MCP server. Two weeks to a proof of concept. The functions the chat panel had been calling became MCP tools. The YAML knowledge became tool descriptions and guides the assistant reads before acting. The chat panel stayed, untouched, as one more client.

<figure>
<a href="/img/chatbot-to-tools/before-after.svg" target="_blank" rel="noopener"><img src="/img/chatbot-to-tools/before-after.svg" alt="Before: one chat UI is the only way into the tools and knowledge. After: the same tools and knowledge sit behind an MCP server, and the chat UI, a terminal assistant and a desktop assistant are all clients of it."></a>
<figcaption>Same tools, same knowledge. In February one door. In March, any assistant that speaks MCP.</figcaption>
</figure>

The hard part was not the protocol. It was that colleagues ran three different clients, each with its own config format, and most of them were new to all of it. The install had to be one command, or adoption would stall at the README. It became one command.

Six months on, the server exposes several dozen tools, of which test-data creation is one domain. The agents I built afterwards, on very different runtimes, use it as their main way into the testing system. The chat panel still works. I have not checked how many people open it.

## What this taught me

| | The chat panel | The MCP server |
|---|---|---|
| Surface | one web page | any assistant that speaks the protocol |
| Who owns the conversation | my code | the assistant the person already uses |
| What I maintain | UI, prompt assembly, conversation state, the tools, the knowledge | the tools, the knowledge |
| Adding a capability | a new flow in the panel | a new tool, described in text |
| Time to build | five weeks | two weeks, on top of the first |

The row that matters is the third one. The chat panel required me to own five things. The server required two, and they were the two I had built first because they were the only parts that could be tested without a model.

<div class="callout">
<p><strong>The rule:</strong> when you build an AI feature, find the parts that would still be true with no model in the room: the facts, the rules, the actions. Build those as plain functions and plain text. The chat is a client. Clients come and go.</p>
</div>
