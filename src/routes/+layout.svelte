<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { untrack } from 'svelte';
	import { initLocale } from 'svelte-locale';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: { locale: import('svelte-locale').Locale }; children: Snippet } = $props();

	untrack(() => initLocale(data.locale));
	$effect(() => { initLocale(data.locale); });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
