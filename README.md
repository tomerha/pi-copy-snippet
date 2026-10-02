# pi-copy-snippet

A [pi](https://github.com/earendil-works/pi) extension that copies the single
code snippet from the last assistant message to the system clipboard, without
copying the rest of the message.

## Install

```bash
pi install ./pi-copy-snippet
```

Or try it for one session:

```bash
pi -e ./pi-copy-snippet
```

## Usage

Press `ctrl+shift+x`, or run `/copy-snippet`, after the agent replies with a
message containing exactly one fenced code block (` ``` `). The block's
content, without the fences, is copied to the clipboard.

If the last assistant message has no code block, or more than one, the
extension shows an error instead of copying anything.
