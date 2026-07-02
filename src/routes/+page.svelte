<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ShowcaseT from '$lib/components/ShowcaseT.svelte';
	import ShowcasePlural from '$lib/components/ShowcasePlural.svelte';
	import ShowcaseFormat from '$lib/components/ShowcaseFormat.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '$lib/components/ui/table';
	import { Globe } from '@lucide/svelte';

	const installCode = `npm install svelte-locale`;

	const viteCode = `import { sveltekit } from '@sveltejs/kit/vite';
import { richI18n } from 'svelte-locale/vite';
import { i18nConfig } from '$lib/i18n/config';

export default {
  plugins: [
    richI18n({ locales: i18nConfig.locales }),
    sveltekit()
  ]
};`;

	const appHtmlCode = `<html lang="%lang%" dir="%dir%">`;

	const appDtsCode = `import type { Locale } from 'svelte-locale';

declare global {
  namespace App {
    interface Locals {
      locale: Locale;
    }
  }
}
export {};`;

	const hooksCode = `import type { Handle } from '@sveltejs/kit';
import { handleI18n } from 'svelte-locale/server';

export const handle: Handle = handleI18n();`;

	const layoutServerCode = `export const load = ({ locals }) => ({ locale: locals.locale });`;

	const layoutSvelteCode = `<script lang="ts">
  import { initLocale } from 'svelte-locale';
  let { data, children } = $props();
  $effect(() => { initLocale(data.locale); });
<\/script>
{@render children()}`;

	const configCode = `export const i18nConfig = {
  locales: ['en', 'sv'] as const,
  defaultLocale: 'en',
  fallbackLocale: 'en',
  cookieName: 'locale',
  routing: {
    strategy: 'prefix-non-default', // 'prefix' | 'prefix-non-default' | 'none'
    prefixDefaultLocale: false
  },
  detection: ['url', 'cookie', 'accept-language', 'default'],
  rtl: ['ar', 'he', 'fa', 'ur']
} as const;`;

	const messagesCode = `export const messages = {
  en: { 'common.save': 'Save', 'auth.welcome': 'Welcome, {name}' },
  sv: { 'common.save': 'Spara', 'auth.welcome': 'Välkommen, {name}' }
} as const;`;

	const pluralsCode = `export const plurals = {
  en: { 'tickets.count': { one: '{count} ticket', other: '{count} tickets' } },
  sv: { 'tickets.count': { one: '{count} ärende', other: '{count} ärenden' } }
} as const;`;

	const functionsCode = `export const functions = {
  en: {
    'billing.status': ({ status }) => status === 'paid' ? 'Paid' : 'Pending'
  },
  sv: {
    'billing.status': ({ status }) => status === 'paid' ? 'Betald' : 'Väntar'
  }
};`;


	const routingRows = [
		{ strategy: 'prefix', en: '✓', sv: '✓', bare: 'redirects to /en/settings' },
		{ strategy: 'prefix-non-default', en: 'redirects to /settings', sv: '✓', bare: '✓ (en)' },
		{ strategy: 'none', en: '—', sv: '—', bare: '✓' },
	];

	const coreApi = [
		{ name: 't(key, values?)', desc: 'String translation' },
		{ name: 'tForLocale(locale, key, values?)', desc: 'Server-side string translation' },
		{ name: 'plural(key, count, values?)', desc: 'Plural translation via Intl.PluralRules' },
		{ name: 'pluralForLocale(locale, key, count, values?)', desc: 'Server-side plural' },
		{ name: 'fn(key, ...args)', desc: 'Function-based translation' },
		{ name: 'fnForLocale(locale, key, ...args)', desc: 'Server-side function translation' },
		{ name: 'getLocale()', desc: 'Returns the current locale' },
		{ name: 'setLocale(locale, { navigate? })', desc: 'Change locale, optionally navigating' },
		{ name: 'initLocale(locale)', desc: 'Initialize from server in root layout' },
		{ name: 'formatNumber(value, options?)', desc: 'Locale-aware number formatting' },
		{ name: 'formatCurrency(value, currency?, options?)', desc: 'Locale-aware currency formatting' },
		{ name: 'formatDate(value, options?)', desc: 'Locale-aware date formatting' },
		{ name: 'formatRelativeTime(value, unit, options?)', desc: 'Relative time formatting' },
		{ name: 'withLocale(path, locale?)', desc: 'Prepend locale prefix to path' },
		{ name: 'switchLocaleInPath(path, locale)', desc: 'Swap locale prefix in path' },
		{ name: 'getLocaleFromPath(pathname)', desc: 'Extract locale from a URL path' },
	];

	const serverApi = [
		{ name: 'detectLocale(event)', desc: 'Detect locale from incoming request' },
		{ name: 'handleI18n()', desc: 'SvelteKit Handle hook for locale routing' },
	];

	const svelteApi = [
		{ name: '<I18n key fallback?>', desc: 'Renders only the active locale block' },
		{ name: '<LocaleLink href locale?>', desc: 'Locale-prefixed anchor element' },
		{ name: '<LocaleSwitcher />', desc: 'Accessible language switcher buttons' },
	];

	const viteApi = [
		{ name: 'richI18n({ locales? })', desc: 'Vite plugin for <I18n> compile-time transform' },
	];

	const tExampleCode = `t('common.save')              // → "Save"
t('auth.welcome', { name: 'John' }) // → "Welcome, John!"`;

	const pluralExampleCode = `plural('tickets.count', 1)  // → "1 ticket"
plural('tickets.count', 5)  // → "5 tickets"`;

	const fnExampleCode = `fn('billing.status', { status: 'paid' })    // → "Paid"
fn('billing.status', { status: 'pending' }) // → "Pending"`;

	const formatExampleCode = `formatCurrency(12499, 'SEK')      // → "12 499,00 kr"
formatNumber(1234567.89)          // → "1,234,567.89"
formatDate(new Date())            // → "July 2, 2025"
formatRelativeTime(-3, 'day')     // → "3 days ago"
formatRelativeTime(2, 'hour')     // → "in 2 hours"`;

	const i18nExampleCode = `<I18n key="home.hero">
  <section lang="en"><h1>Support made simple</h1></section>
  <section lang="sv"><h1>Support gjort enkelt</h1></section>
</I18n>`;

</script>

<svelte:head>
	<title>svelte-locale — Stupid-simple i18n for SvelteKit</title>
	<meta name="description" content="A stupid-simple, SvelteKit-native i18n library for Svelte 5." />
</svelte:head>

<div class="min-h-screen bg-white font-sans text-zinc-900">
	
	<header class="mx-auto flex max-w-2xl flex-col items-center px-6 pb-10 pt-20 text-center">
		<div class="mb-5 flex size-16 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm text-zinc-700">
			<Globe size={28} />
		</div>
		<h1 class="mb-3 text-4xl font-bold tracking-tight text-zinc-900">svelte-locale</h1>
		<p class="mb-1 text-lg text-zinc-500">A stupid-simple, SvelteKit-native i18n library for Svelte 5.</p>
		<p class="mb-8 text-sm text-zinc-600">Zero flicker · Server-first · Fully type-safe</p>
		<div class="flex gap-3">
			<Button href="https://www.npmjs.com/package/svelte-locale" target="_blank" rel="noopener noreferrer" size="lg">
				npm package
			</Button>
			<Button href="https://github.com/VincentBarkman/svelte-locale" target="_blank" rel="noopener noreferrer" variant="outline" size="lg">
				GitHub
			</Button>
		</div>
	</header>

	<main class="mx-auto max-w-2xl space-y-20 px-6 pb-28">

		
		<section>
			<h2 class="mb-1 text-xl font-semibold">Installation</h2>
			<p class="mb-3 text-sm text-zinc-500">One package, zero dependencies.</p>
			<CodeBlock code={installCode} lang="bash" />
		</section>

		
		<section class="space-y-4">
			<div>
				<h2 class="mb-1 text-xl font-semibold">t() — String translations</h2>
				<p class="text-sm text-zinc-500">Define your messages per locale, then call <Badge variant="outline">t(key)</Badge> anywhere. Use <Badge variant="outline">{'{name}'}</Badge>-style placeholders for interpolation.</p>
			</div>
			<CodeBlock code={messagesCode} lang="ts" filename="src/lib/i18n/messages.ts" />
			<CodeBlock code={tExampleCode} lang="ts" />
			<Card>
				<CardContent class="pt-4">
					<p class="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-600">Live demo</p>
					<ShowcaseT />
				</CardContent>
			</Card>
		</section>

		
		<section class="space-y-4">
			<div>
				<h2 class="mb-1 text-xl font-semibold">plural() — Plural rules</h2>
				<p class="text-sm text-zinc-500">Define plural forms using CLDR category keys. <Badge variant="outline">Intl.PluralRules</Badge> picks the right form automatically for any language.</p>
			</div>
			<CodeBlock code={pluralsCode} lang="ts" filename="src/lib/i18n/plurals.ts" />
			<CodeBlock code={pluralExampleCode} lang="ts" />
			<Card>
				<CardContent class="pt-4">
					<p class="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-600">Live demo</p>
					<ShowcasePlural />
				</CardContent>
			</Card>
		</section>

		
		<section class="space-y-4">
			<div>
				<h2 class="mb-1 text-xl font-semibold">fn() — Logic translations</h2>
				<p class="text-sm text-zinc-500">When a string template isn't enough, define a typed function per locale. Full TypeScript — inputs and outputs are inferred.</p>
			</div>
			<CodeBlock code={functionsCode} lang="ts" filename="src/lib/i18n/functions.ts" />
			<CodeBlock code={fnExampleCode} lang="ts" />
		</section>

		
		<section class="space-y-4">
			<div>
				<h2 class="mb-1 text-xl font-semibold">Format helpers</h2>
				<p class="text-sm text-zinc-500">All formatting uses native <Badge variant="outline">Intl</Badge> APIs keyed to the active locale — no external libraries, results cached per locale.</p>
			</div>
			<CodeBlock code={formatExampleCode} lang="ts" />
			<Card>
				<CardContent class="pt-4">
					<p class="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-600">Live demo</p>
					<ShowcaseFormat />
				</CardContent>
			</Card>
		</section>

		
		<section class="space-y-6">
			<div>
				<h2 class="mb-1 text-xl font-semibold">Setup</h2>
				<p class="text-sm text-zinc-500">Five files to wire everything up. Copy, paste, done.</p>
			</div>

			<div>
				<p class="mb-1 text-sm font-medium text-zinc-700">1. Register the Vite plugin — <Badge variant="outline">vite.config.ts</Badge></p>
				<p class="mb-2 text-xs text-zinc-600">Must be before <Badge variant="outline">sveltekit()</Badge> so the transform runs first.</p>
				<CodeBlock code={viteCode} lang="ts" filename="vite.config.ts" />
			</div>

			<div>
				<p class="mb-1 text-sm font-medium text-zinc-700">2. Add lang/dir placeholders — <Badge variant="outline">src/app.html</Badge></p>
				<p class="mb-2 text-xs text-zinc-600">SvelteKit fills these in server-side on each request.</p>
				<CodeBlock code={appHtmlCode} lang="html" filename="src/app.html" />
			</div>

			<div>
				<p class="mb-1 text-sm font-medium text-zinc-700">3. Augment App.Locals — <Badge variant="outline">src/app.d.ts</Badge></p>
				<p class="mb-2 text-xs text-zinc-600">Gives you full type-safety when accessing <Badge variant="outline">locals.locale</Badge>.</p>
				<CodeBlock code={appDtsCode} lang="ts" filename="src/app.d.ts" />
			</div>

			<div>
				<p class="mb-1 text-sm font-medium text-zinc-700">4. Register the handle hook — <Badge variant="outline">src/hooks.server.ts</Badge></p>
				<p class="mb-2 text-xs text-zinc-600">Detects locale from URL → cookie → Accept-Language → default, then sets <Badge variant="outline">html lang/dir</Badge>.</p>
				<CodeBlock code={hooksCode} lang="ts" filename="src/hooks.server.ts" />
			</div>

			<div>
				<p class="mb-1 text-sm font-medium text-zinc-700">5. Pass locale to layout — <Badge variant="outline">+layout.server.ts</Badge> + <Badge variant="outline">+layout.svelte</Badge></p>
				<p class="mb-2 text-xs text-zinc-600">The server passes locale down; the client initializes its reactive state from it.</p>
				<div class="space-y-4">
					<CodeBlock code={layoutServerCode} lang="ts" filename="+layout.server.ts" route="/+layout.server.ts" />
					<CodeBlock code={layoutSvelteCode} lang="svelte" filename="+layout.svelte" route="/+layout.svelte" />
				</div>
			</div>
		</section>

		
		<section class="space-y-4">
			<div>
				<h2 class="mb-1 text-xl font-semibold">Config</h2>
				<p class="text-sm text-zinc-500">Create <Badge variant="outline">src/lib/i18n/config.ts</Badge> once and import it everywhere — the Vite plugin, hooks, and components all read from it.</p>
			</div>
			<CodeBlock code={configCode} lang="ts" filename="src/lib/i18n/config.ts" />
		</section>

		
		<section class="space-y-4">
			<div>
				<h2 class="mb-1 text-xl font-semibold">&lt;I18n&gt; — Rich component translations</h2>
				<p class="text-sm text-zinc-500">Wrap locale-specific markup in <Badge variant="outline">&lt;I18n&gt;</Badge>. The Vite plugin transforms each child into a snippet at compile time — only the active locale's HTML is ever sent to the browser.</p>
			</div>
			<CodeBlock code={i18nExampleCode} lang="svelte" />
			<div class="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm text-amber-800">
				Every direct child must have a valid <Badge variant="outline" class="border-amber-200 bg-amber-100 text-amber-800">lang</Badge> prop matching a configured locale. No hidden DOM, no client-side switching.
			</div>
		</section>

		
		<section class="space-y-4">
			<div>
				<h2 class="mb-1 text-xl font-semibold">Routing strategies</h2>
				<p class="text-sm text-zinc-500">Set <Badge variant="outline">routing.strategy</Badge> in your config. The hook handles redirects automatically.</p>
			</div>
			<div class="overflow-hidden rounded-lg border border-zinc-200">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Strategy</TableHead>
							<TableHead>/en/settings</TableHead>
							<TableHead>/sv/settings</TableHead>
							<TableHead>/settings</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each routingRows as row (row.strategy)}
							<TableRow>
								<TableCell><Badge variant="outline">{row.strategy}</Badge></TableCell>
								<TableCell class="text-zinc-600">{row.en}</TableCell>
								<TableCell class="text-zinc-600">{row.sv}</TableCell>
								<TableCell class="text-zinc-600">{row.bare}</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</div>
		</section>

		
		<section>
			<h2 class="mb-6 text-xl font-semibold">API Reference</h2>
			<div class="space-y-8">
				{#each [ { label: 'svelte-locale', badge: 'core', items: coreApi, w: 'sm:w-72' }, { label: 'svelte-locale/server', badge: 'server', items: serverApi, w: 'sm:w-64' }, { label: 'svelte-locale/svelte', badge: 'components', items: svelteApi, w: 'sm:w-64' }, { label: 'svelte-locale/vite', badge: 'vite', items: viteApi, w: 'sm:w-64' }, ] as group (group.label)}
					<div>
						<div class="mb-3 flex items-center gap-2">
							<h3 class="font-semibold text-zinc-800">{group.label}</h3>
							<Badge variant="secondary">{group.badge}</Badge>
						</div>
						<div class="overflow-hidden rounded-lg border border-zinc-200">
							<Table>
								<TableBody>
									{#each group.items as item (item.name)}
										<TableRow>
											<TableCell class="font-mono text-sm font-medium text-zinc-800 {group.w}">{item.name}</TableCell>
											<TableCell class="text-sm text-zinc-500">{item.desc}</TableCell>
										</TableRow>
									{/each}
								</TableBody>
							</Table>
						</div>
					</div>
				{/each}
			</div>
		</section>

	</main>

	<footer class="border-t border-zinc-100 py-8 text-center text-sm text-zinc-600">
		<p class="flex items-center justify-center gap-1 flex-wrap">
			Built with
			<Button variant="link" href="https://svelte.dev" target="_blank" rel="noopener noreferrer" class="h-auto p-0 text-sm text-zinc-600">Svelte</Button>
			·
			<Button variant="link" href="https://www.npmjs.com/package/svelte-locale" target="_blank" rel="noopener noreferrer" class="h-auto p-0 text-sm text-zinc-600">npm</Button>
			· by
			<Button variant="link" href="https://vincentbarkman.com" target="_blank" rel="noopener noreferrer" class="h-auto p-0 text-sm text-zinc-600">Vincent A. Barkman</Button>
		</p>
	</footer>
</div>
