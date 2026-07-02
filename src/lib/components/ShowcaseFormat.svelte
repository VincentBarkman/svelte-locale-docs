<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Table, TableBody, TableRow, TableCell } from '$lib/components/ui/table';

	type Locale = 'en' | 'sv' | 'ar';
	const RTL = new Set(['ar']);

	const locales = [
		{ code: 'en' as const, label: 'English' },
		{ code: 'sv' as const, label: 'Svenska' },
		{ code: 'ar' as const, label: 'العربية' },
	];

	let locale = $state<Locale>('en');

	const now = new Date();
	const price = 12499.99;
	const bigNum = 1234567.89;

	function formatCurrency(value: number, currency: string) {
		return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
	}
	function formatNumber(value: number) {
		return new Intl.NumberFormat(locale).format(value);
	}
	function formatDate(value: Date) {
		return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(value);
	}
	function formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit) {
		return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(value, unit);
	}

	const rows = $derived([
		{ fn: `formatCurrency(${price}, 'SEK')`, result: formatCurrency(price, 'SEK') },
		{ fn: `formatCurrency(${price}, 'USD')`, result: formatCurrency(price, 'USD') },
		{ fn: `formatCurrency(${price}, 'EUR')`, result: formatCurrency(price, 'EUR') },
		{ fn: `formatNumber(${bigNum})`, result: formatNumber(bigNum) },
		{ fn: `formatDate(new Date())`, result: formatDate(now) },
		{ fn: `formatRelativeTime(-3, 'day')`, result: formatRelativeTime(-3, 'day') },
		{ fn: `formatRelativeTime(2, 'hour')`, result: formatRelativeTime(2, 'hour') },
	]);
</script>

<div class="space-y-4">
	<div class="flex flex-wrap gap-2">
		{#each locales as l (l.code)}
			<Button
				variant={locale === l.code ? 'default' : 'outline'}
				size="sm"
				onclick={() => (locale = l.code)}
			>
				{l.label}
			</Button>
		{/each}
	</div>

	<div class="overflow-hidden rounded-lg border border-zinc-200">
		<Table>
			<TableBody>
				{#each rows as row (row.fn)}
					<TableRow>
						<TableCell class="text-xs text-zinc-400 font-mono py-2">{row.fn}</TableCell>
						<TableCell class="text-right font-medium tabular-nums text-zinc-800 py-2" dir={RTL.has(locale) ? 'rtl' : 'ltr'}>{row.result}</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
