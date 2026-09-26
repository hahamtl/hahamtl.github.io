---
title: "One hundred percent, on purpose"
description: "On a Java service with a few thousand tests, every merge has to bring new-code coverage to 100% and add zero static-analysis findings. It sounds like a rule from a textbook. It is the reason we can let an AI assistant write code there. One pull request went from 37.7% to 100% with twelve tests aimed at the branches nobody looks at."
date: 2026-08-16
order: 16
rank: 8
tags: [testing, engineering]
cover: /img/hundred-percent/loop.svg
---

The service is old by our standards: Java, a few thousand tests, a static-analysis gate on every pull request. The gate's technical threshold is modest. The bar we actually hold is not: every change brings the coverage of the lines it touched to 100%, and adds no new findings. Not "high". Not "improved". All of it, every time.

I used to think this kind of rule was for teams that had run out of real problems. This year I changed my mind, because of who started writing the code.

## Why the number matters now

When a person writes a change, a reviewer can ask them what they were thinking. When an AI assistant writes it, there is no one to ask. The code looks fine. It usually is fine. The only thing that tells you whether the branch you did not think about is handled is a test that walks through it.

A 100% bar on new code turns "did the assistant handle the error path?" from a judgement call into a line in a report. Either the error path has a test or the gate is red. The number is not about quality in the abstract. It is the cheapest available substitute for asking the author a question.

## One pull request

A small change: a hardcoded string became a constant, a branch was tightened. First scan: new-code coverage 37.7%, one new finding. The finding was trivial. The coverage was the interesting part. The change had touched eight branches, and the existing tests, all few thousand of them, walked through three.

The missing five were the usual suspects. An error path when a downstream call fails. A null branch when an optional field is absent. A default value when a parameter is not provided. Two boundary conditions. Nobody had written tests for them because nobody had ever thought about them; they were the branches you write without noticing.

Twelve small tests later, each one aimed at exactly one of those branches, the report read 100%, zero findings, and the gate went green. About an hour of work. Every one of those twelve tests exercises a path that had been in production for years untested.

<figure>
<a href="/img/hundred-percent/loop.svg" target="_blank" rel="noopener"><img src="/img/hundred-percent/loop.svg" alt="The loop: run the tests locally with coverage, read the report for the changed methods, write a test for each uncovered branch, push, wait for the scan, poll the gate until it is green. Below, one pull request's coverage bar going from 37.7 percent with five uncovered branches to 100 percent after twelve targeted tests."></a>
<figcaption>The loop, and one pull request travelling through it. The branches on the right are the ones nobody had thought about.</figcaption>
</figure>

## The loop

The rule only works if checking it is cheap, so the loop is fixed and boring. Run the suite locally with coverage. Open the report for the methods you changed and list every line with zero hits. Write one test per uncovered branch, named for the branch. Push. Wait for the scan. Poll the gate once a minute until it says green. Only then ask for review.

Waiting for the pipeline to tell you what the local report already knew is the one step people skip, and it is the step that turns the rule into a habit rather than a fight with the gate.

## What it costs and what it buys

| | Before the bar | With the bar |
|---|---|---|
| Reviewer's question about error paths | asked, sometimes | answered by the report |
| Untested branches in new code | normal | zero, by construction |
| Time per change | less | plus roughly an hour for the tests |
| Confidence in code written by an assistant | "looks fine" | every touched branch has a test with its name on it |
| Old untested paths | stay untested | get tests the moment anyone touches them |

The last row is the quiet win. A 100% bar on new code slowly backfills an old service, one touched method at a time, without anyone scheduling a "coverage project".

<div class="callout">
<p><strong>The rule:</strong> on shared code that assistants write into, hold new-code coverage at 100% and new findings at zero, and make the loop for checking it boring enough to run every time. The number is not perfectionism. It is how you ask a question of an author who is not there.</p>
</div>
