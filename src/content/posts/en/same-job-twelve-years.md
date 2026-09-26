---
title: "Same job, twelve years"
description: "I started as a test automation developer and now build AI agents for engineering teams. On paper that is four titles and three companies. In practice it has been one job the whole time: find where people and their systems rub against each other, and build the thing that removes the friction."
date: 2026-10-19
order: 11
rank: 11
tags: [career, tooling]
cover: /img/same-job/one-line.svg
---

The first thing I built at my first software job was not a test. It was a script that generated the test data, because writing it by hand took longer than running the tests. The second thing was a small tool that let other people run that script without asking me. I did not think of either as my job. My job was testing.

Twelve years later my title has changed four times and I spend most days on AI agents that plan work, write tests and open pull requests for engineering teams. It took me embarrassingly long to notice that I have been doing the same thing since the first week.

<figure>
<a href="/img/same-job/one-line.svg" target="_blank" rel="noopener"><img src="/img/same-job/one-line.svg" alt="A single timeline from 2014 to 2026 with four eras: automation frameworks, internal tooling and shared services, platform work with tool servers, and AI agents. Under all four runs one continuous line labelled: find the friction between people and their systems, and remove it."></a>
<figcaption>Four titles on top. One line underneath.</figcaption>
</figure>

## Four eras, one line

**Automation frameworks.** The friction was repetition: the same checks, run by hand, every release. The tool was a framework other testers could add to without understanding its internals. The thing I learned was that a framework nobody else commits to is just my script with a longer name.

**Internal tooling and shared services.** The friction moved: not running the tests, but getting the data, environments and permissions to run them at all. The tools were services with real APIs and small UIs, owned like products, with a roadmap. The thing I learned was that the hard part of an internal tool is never the code; it is getting a second team to depend on it.

**Platform work.** The friction moved again, to the seams between systems: test management, ticketing, CI, the services under test. The tool was a layer that spoke to all of them so that people did not have to, and later a tool server that let AI assistants speak to them too. The thing I learned was that a good interface outlives every system behind it.

**AI agents.** The friction now is the pace: development got faster than the people around it. The tool is an agent that does the first draft of the planning, the tests, the ticket, with a person deciding at every step. The thing I am learning is that everything from the previous three eras is still the job. The agent is only as good as the tools it can call and the rules it is given, and those are the same tools and rules I have been building all along.

## What changed, what did not

| | Era 1 | Era 2 | Era 3 | Era 4 |
|---|---|---|---|---|
| The friction | repetition | access | seams | pace |
| What I built | a framework | services | a layer, a tool server | agents |
| Who used it | my team | several teams | every team through one interface | anyone with the assistant open |
| The test of success | someone else committed | someone else depended on it | someone else integrated | someone else approved the draft and kept it |
| What did not change | the friction was between people and their systems | | | |

The last row is the whole post. Read it left to right and the columns blur.

## Why I bother writing this down

Because the titles are misleading in both directions. "Test automation developer" undersells what the work already was in year one. "AI enablement" oversells how new the work is in year twelve. If you are early in a career like this and worried that the ground keeps moving, it does, and it does not matter. The skill that compounds is not the framework, the service or the model. It is being able to look at a room of people and a pile of systems and see where they rub.

<div class="callout">
<p><strong>The rule:</strong> when your title changes, write down the friction you were removing before and the friction you are removing now. If the sentence is the same, you did not change jobs. You got better at the one you have.</p>
</div>
