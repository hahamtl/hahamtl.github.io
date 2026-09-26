---
title: "Reuse before invent"
description: "The second agent shipped in nine weeks because it owned almost none of its own plumbing. Six times we chose to be a tenant of something that already existed instead of building a peer. What that bought, what it cost, and when to build anyway."
date: 2026-09-16
order: 7
rank: 9
tags: [engineering, agents]
cover: /img/reuse/peer-vs-tenant.svg
---

At the kickoff of the second agent I wrote down what it would need. A way to reach the ticketing system, the wiki and the code host. A place for its instructions to live. A way to release it to people. A way to open pull requests. Access to the team's test-management tool and its coverage data. Somewhere for generated tests to land.

Six items. Every one already had an owner somewhere in the company. The question was whether to build our own version of each, cleanly scoped to the new product, or to move in with the existing one and follow its rules.

We moved in, six times. The agent shipped in nine weeks. I do not think it would have shipped in twenty the other way.

## The peer looks cleaner on the whiteboard

The tempting architecture for a new product is a peer: its own integration layer, its own repo, its own release pipeline, drawn as a tidy column next to the existing ones. Every box is under your control. Nothing you do can break anyone else.

Every box is also a system you now run. It needs credentials, monitoring, someone to answer when it breaks, a migration when the thing under it moves. And the second column duplicates the first, so every improvement to one has to be made twice or not at all.

<figure>
<a href="/img/reuse/peer-vs-tenant.svg" target="_blank" rel="noopener"><img src="/img/reuse/peer-vs-tenant.svg" alt="Left: a new product drawn as a peer, with its own column of six boxes duplicating the existing gateway, skills repo, release pipeline, PR tooling, test-tool integration and automation repos. Right: the same product as a tenant, a thin box of instructions plugged into the six existing systems. What the tenant owns is a folder of text."></a>
<figcaption>A peer owns six systems. A tenant owns a folder of text and plugs into six that already run.</figcaption>
</figure>

## Six times a tenant

| The agent needed | Instead of building | We became a tenant of | What we actually wrote |
|---|---|---|---|
| reach ticketing, wiki, code | its own connectors | the integration gateway the first agent already used, exposed over MCP | tool names in instructions, nothing else |
| a home for instructions | its own repo | the shared skills repo, same folder as every other agent's skills | markdown files |
| a way to release | its own pipeline | an existing plugin and its marketplace, as one more command group | a version bump and a changelog entry |
| open a pull request | a PR step | the plugin's existing PR-creation skill, delegated wholesale | zero lines |
| test cases and coverage | a store of its own | the team's test-management tool and the service that fronts it | instructions for which tool to call when |
| a home for generated tests | a new repo | the two automation repos the team already maintained | tests that follow those repos' conventions |

The fourth row is my favourite. Creating a pull request from an agent sounds small and is not: branch naming, remote detection, reviewer lookup, secret scanning, the manual fallback when the API refuses. The plugin already had a skill that did all of it. We told our agent to call it. That was the whole implementation.

The second row had a bonus. Because the skills lived in the shared repo, a second agent product on a different runtime could read the same files. We proved it with a planted canary: one sentence added to a skill, visible in both products the next day. Reuse was not a slide. It was a diff.

## What being a tenant costs

Tenants follow house rules, and the rules are not yours.

A skill change was two merge requests: one in the shared repo, one to sync the copy into the plugin, then a release. Our scripts had to run on the oldest Python the host promised, which was older than the one on my laptop, and we found that out on release night. Names had to follow the host's conventions. Release cadence was the host's. When the marketplace moved to a new home this month, we moved with it and told our users to reinstall.

None of that is a complaint. It is the rent. The alternative is owning all six systems, and every one of those costs is small next to running a gateway.

## What it bought

Nine weeks from the first ticket to a release other teams could install. A team of two. Almost no infrastructure of our own to be paged for.

And one thing I did not expect: because everything we owned was text, the agent moved between homes almost untouched. When the plugin changed marketplaces, the instructions did not change. The users got four lines to run. Owning less turned out to be the same thing as being portable.

## When to invent anyway

Reuse is a default, not a law. Three situations have made me build instead.

The owner says no, or cannot say yes fast enough. A dependency you cannot change on your timeline is a dependency you will route around eventually; better to decide that on purpose.

Your usage would hurt the host. A nightly job hammering a gateway sized for interactive use is not reuse, it is a denial of service with good intentions.

The abstraction fights you three times. We had one bug appear three times in two months, each time looking unrelated, before someone named it: a fallback path in a shared component that was quietly the wrong shape for our case. The fix was to fix the fallback once, upstream, not to add a fourth special case downstream. Sometimes that fix is not possible, and then you build your own. But count to three first.

<div class="callout">
<p><strong>The rule:</strong> for every box on the new product's diagram, ask who already runs one. Move in, follow the house rules, and write only the text that makes it yours. Build a peer only when the owner says no, your load would hurt them, or the abstraction has fought you three times.</p>
</div>
