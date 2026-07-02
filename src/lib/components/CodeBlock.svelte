<script lang="ts">
	import { Copy, Check } from '@lucide/svelte';
	import { getHighlighter, LANG_MAP } from '$lib/shiki';

	let { code, lang = 'ts', inline = false, filename, route }: { code: string; lang?: string; inline?: boolean; filename?: string; route?: string } =
		$props();

	let copied = $state(false);
	let highlighted = $state('');

	$effect(() => {
		const shikiLang = LANG_MAP[lang] ?? lang;
		const trimmed = code.trim();
		getHighlighter().then((h) => {
			highlighted = h.codeToHtml(trimmed, { lang: shikiLang, theme: 'github-light' });
		});
	});

	function copyCode() {
		navigator.clipboard.writeText(code.trim());
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

{#if inline}
	<code class="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[0.8em] text-zinc-700">{code}</code>
{:else}
	<div class="overflow-hidden rounded-lg border border-zinc-200">
		<div class="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-3 py-2">
			<div class="flex items-center gap-2">
				<span class="rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[11px] text-zinc-500">{lang}</span>
				{#if filename}
					<span class="text-xs text-zinc-600">{filename}</span>
				{/if}
				{#if route}
					<span class="text-xs text-zinc-600">· {route}</span>
				{/if}
			</div>
			<button
				onclick={copyCode}
				class="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-700"
				aria-label="Copy code"
			>
				{#if copied}
					<Check size={12} />
					<span>Copied</span>
				{:else}
					<Copy size={12} />
					<span>Copy</span>
				{/if}
			</button>
		</div>
		<div class="bg-white">
			{#if highlighted}
				<div class="[&>pre]:m-0 [&>pre]:overflow-x-auto [&>pre]:p-4 [&>pre]:text-[13px] [&>pre]:leading-relaxed">
					{@html highlighted}
				</div>
			{:else}
				<pre
					class="m-0 overflow-x-auto bg-white p-4 font-mono text-[13px] leading-relaxed text-zinc-700"><code>{code.trim()}</code></pre>
			{/if}
		</div>
	</div>
{/if}
