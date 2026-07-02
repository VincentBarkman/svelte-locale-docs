<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Table, TableBody, TableRow, TableCell } from '$lib/components/ui/table';

	type Locale = 'en' | 'sv' | 'ar';
	const RTL = new Set(['ar']);

	const messages: Record<Locale, Record<string, string>> = {
		en: {
			'common.save': 'Save',
			'auth.welcome': 'Welcome, {name}!',
			'nav.home': 'Home',
			'nav.settings': 'Settings',
		},
		sv: {
			'common.save': 'Spara',
			'auth.welcome': 'Välkommen, {name}!',
			'nav.home': 'Hem',
			'nav.settings': 'Inställningar',
		},
		ar: {
			'common.save': 'حفظ',
			'auth.welcome': 'مرحباً، {name}!',
			'nav.home': 'الرئيسية',
			'nav.settings': 'الإعدادات',
		},
	};

	const keys = ['common.save', 'auth.welcome', 'nav.home', 'nav.settings'] as const;

	let locale = $state<Locale>('en');
	let name = $state('John');

	function t(key: string, values?: Record<string, string>): string {
		let msg = messages[locale][key] ?? key;
		if (values) for (const [k, v] of Object.entries(values)) msg = msg.replace(`{${k}}`, v);
		return msg;
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
		<div class="ml-auto flex items-center gap-2">
			<Label for="name-input" class="text-muted-foreground text-sm">name =</Label>
			<Input id="name-input" bind:value={name} class="w-28" />
		</div>
	</div>

	<div class="overflow-hidden rounded-lg border border-zinc-200">
		<Table>
			<TableBody>
				{#each keys as key (key)}
					<TableRow>
						<TableCell class="text-xs text-zinc-600 font-mono py-2">
							t('{key}'{key.includes('{') ? `, { name }` : ''})
						</TableCell>
						<TableCell class="text-right font-medium text-zinc-800 py-2" dir={RTL.has(locale) ? 'rtl' : 'ltr'}>
							{t(key, key === 'auth.welcome' ? { name } : undefined)}
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
