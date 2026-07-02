<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';
	import { Table, TableBody, TableRow, TableCell } from '$lib/components/ui/table';

	type Locale = 'en' | 'sv' | 'ar';
	const RTL = new Set(['ar']);
	type PluralEntry = { one: string; other: string; zero?: string; two?: string; few?: string; many?: string };

	const plurals: Record<Locale, Record<string, PluralEntry>> = {
		en: {
			'tickets.count': { one: '{count} ticket', other: '{count} tickets' },
			'items.cart': { one: '{count} item in your cart', other: '{count} items in your cart' },
		},
		sv: {
			'tickets.count': { one: '{count} ärende', other: '{count} ärenden' },
			'items.cart': { one: '{count} artikel i din varukorg', other: '{count} artiklar i din varukorg' },
		},
		ar: {
			'tickets.count': { zero: 'لا تذاكر', one: 'تذكرة واحدة', two: 'تذكرتان', few: '{count} تذاكر', many: '{count} تذكرة', other: '{count} تذكرة' },
			'items.cart': { zero: 'لا عناصر', one: 'عنصر واحد في سلتك', two: 'عنصران في سلتك', few: '{count} عناصر في سلتك', many: '{count} عنصر في سلتك', other: '{count} عنصر في سلتك' },
		},
	};

	const keys = ['tickets.count', 'items.cart'] as const;

	let locale = $state<Locale>('en');
	let sliderValue = $state([1]);
	let count = $derived(sliderValue[0]);

	function plural(key: string, n: number): string {
		const rules = new Intl.PluralRules(locale);
		const cat = rules.select(n) as keyof PluralEntry;
		const entry = plurals[locale][key];
		const template = entry[cat] ?? entry.other;
		return template.replace('{count}', String(n));
	}

	const locales = [
		{ code: 'en' as const, label: 'English' },
		{ code: 'sv' as const, label: 'Svenska' },
		{ code: 'ar' as const, label: 'العربية' },
	];
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-2">
		{#each locales as l (l.code)}
			<Button
				variant={locale === l.code ? 'default' : 'outline'}
				size="sm"
				onclick={() => (locale = l.code)}
			>
				{l.label}
			</Button>
		{/each}
		<div class="ml-auto flex items-center gap-3">
			<Label class="text-muted-foreground text-sm">count = <strong class="text-foreground">{count}</strong></Label>
			<Slider type="multiple" bind:value={sliderValue} min={0} max={20} step={1} class="w-28" aria-label="Count" />
		</div>
	</div>

	<div class="overflow-hidden rounded-lg border border-zinc-200">
		<Table>
			<TableBody>
				{#each keys as key (key)}
					<TableRow>
						<TableCell class="text-xs text-zinc-400 font-mono py-2">plural('{key}', {count})</TableCell>
						<TableCell class="text-right font-medium text-zinc-800 py-2" dir={RTL.has(locale) ? 'rtl' : 'ltr'}>{plural(key, count)}</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
