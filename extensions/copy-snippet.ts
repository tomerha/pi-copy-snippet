import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { copyToClipboard } from "@earendil-works/pi-coding-agent";
import { Key } from "@earendil-works/pi-tui";

const FENCE_RE = /```[^\n]*\n([\s\S]*?)```/g;

function getLastAssistantText(ctx: ExtensionContext): string | undefined {
	const branch = ctx.sessionManager.getBranch();
	for (let i = branch.length - 1; i >= 0; i--) {
		const entry = branch[i];
		if (entry.type !== "message" || entry.message.role !== "assistant") continue;
		return entry.message.content
			.filter((block) => block.type === "text")
			.map((block) => block.text)
			.join("\n");
	}
	return undefined;
}

function extractSoleSnippet(text: string): string {
	const matches = [...text.matchAll(FENCE_RE)];
	if (matches.length === 0) {
		throw new Error("No code snippet found in the last assistant message");
	}
	if (matches.length > 1) {
		throw new Error(`Last assistant message has ${matches.length} code snippets, expected exactly one`);
	}
	return matches[0][1].replace(/\n$/, "");
}

async function copySnippet(ctx: ExtensionContext): Promise<void> {
	const text = getLastAssistantText(ctx);
	if (text === undefined) {
		ctx.ui.notify("No assistant message found", "error");
		return;
	}
	try {
		const snippet = extractSoleSnippet(text);
		await copyToClipboard(snippet);
		ctx.ui.notify("Snippet copied to clipboard", "info");
	} catch (error) {
		ctx.ui.notify(error instanceof Error ? error.message : String(error), "error");
	}
}

export default function copySnippetExtension(pi: ExtensionAPI) {
	pi.registerCommand("copy-snippet", {
		description: "Copy the sole code snippet from the last assistant message to the clipboard",
		handler: async (_args, ctx) => {
			await copySnippet(ctx);
		},
	});

	pi.registerShortcut(Key.ctrlShift("x"), {
		description: "Copy the sole code snippet from the last assistant message to the clipboard",
		handler: async (ctx) => {
			await copySnippet(ctx);
		},
	});
}
