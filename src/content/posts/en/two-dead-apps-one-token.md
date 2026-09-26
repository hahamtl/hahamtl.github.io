---
title: "Two dead apps, one token"
description: "Two unrelated chat apps died the same morning with the same symptom: typed messages ignored, buttons still working. Every restart made it worse. The cause was nine ghost connections on one shared token, and the fix was to stop restarting."
date: 2026-07-26
order: 15
rank: 15
tags: [engineering]
cover: /img/ghost-connections/restarts.svg
---

On a Friday morning two chat apps stopped answering. Not the same app, not the same codebase, not the same team. Same symptom in both: type a message and nothing happens, click a button and it works.

Two things breaking at once with the same symptom looks like a shared cause. We spent the first hours on that theory: a platform incident, a shared quota, a rate limit hit by both. None of it held. The apps had independent identities and independent quotas. The timing was a coincidence, and it cost us an afternoon.

## Why restarting made it worse

The apps used the chat platform's persistent connection mode: instead of the platform calling a public URL, the app opens a long-lived socket and events arrive over it. One token, one connection.

Our instinct during an incident is to restart. We restarted. Each restart killed the process but did not close the socket cleanly, so the platform kept the old connection registered for a while. The new process opened another. After an afternoon of "let's try once more" we had about nine connections registered against one token, and the platform was delivering each event to one of them at random. Most of them were dead. Roughly nine in ten typed messages went to a ghost.

Buttons kept working because button clicks travel a different route, through a plain HTTP callback, not the socket. That was the clue we should have read first: outbound fine, buttons fine, typed input dead means the connection layer, not permissions, not the model, not the code that handles messages.

<figure>
<a href="/img/ghost-connections/restarts.svg" target="_blank" rel="noopener"><img src="/img/ghost-connections/restarts.svg" alt="A timeline of one afternoon. Each restart adds a dead connection registered against the same token: one, two, up to nine. Events are delivered to a random connection, so the share reaching the live one falls from all to about one in ten. Below: the fix, graceful shutdown that closes the socket and timeout detection, after which one restart leaves one connection."></a>
<figcaption>Every restart left one more ghost. The live process got a smaller share of events each time.</figcaption>
</figure>

## The fix was mostly to stop

Three changes, none of them heroic. Upgrade the client library to a version that detects a silent, timed-out connection instead of holding it open. Add a graceful shutdown so a stopping process closes its socket before it exits. Then leave the apps alone and let the ghost connections expire on their own. By the next morning both apps were fine.

## What I keep from it

| The instinct | What it did | What to do instead |
|---|---|---|
| Two failures at once share a cause | cost an afternoon | check identities and quotas before chasing a shared cause |
| Restart to clear it | added a ghost each time | check how many connections the token has first |
| Typed input dead means the message handler is broken | looked in the wrong layer | outbound OK plus buttons OK plus input dead equals connection layer |
| One token, many processes | random delivery | one live connection per shared token, ever |

The last row became a team rule with a name. Two developers running the app locally against the same token get the same random delivery, and one of them spends an hour wondering why the bot ignores them.

<div class="callout">
<p><strong>The rule:</strong> one live connection per shared token. When input dies but output and buttons work, look at the connection layer before anything else. And before you restart during an incident, ask what a restart leaves behind.</p>
</div>
