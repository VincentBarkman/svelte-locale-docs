<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ShowcaseT from '$lib/components/ShowcaseT.svelte';
	import ShowcasePlural from '$lib/components/ShowcasePlural.svelte';
	import ShowcaseFormat from '$lib/components/ShowcaseFormat.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '$lib/components/ui/table';
	import { Globe } from '@lucide/svelte';

	const quickInstallCode = `npx svelte-locale init`;

	const messagesCode = `import { defineMessages } from 'svelte-locale';

defineMessages({
  en: {
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'auth.welcome': 'Welcome back, {name}'
  },
  sv: {
    'common.save': 'Spara',
    'common.cancel': 'Avbryt',
    'auth.welcome': 'Välkommen tillbaka, {name}'
  }
});`;

	const tExampleCode = `import { t } from 'svelte-locale';

t('common.save')                         // → 'Save'
t('auth.welcome', { name: 'Vincent' })   // → 'Welcome back, Vincent'`;

	const pluralsCode = `import { definePlurals } from 'svelte-locale';

definePlurals({
  en: {
    'tickets.count': { one: '{count} ticket', other: '{count} tickets' }
  },
  sv: {
    'tickets.count': { one: '{count} ärende', other: '{count} ärenden' }
  }
});`;

	const pluralExampleCode = `import { plural } from 'svelte-locale';

plural('tickets.count', 1)  // → '1 ticket'
plural('tickets.count', 5)  // → '5 tickets'`;

	const functionsCode = `import { defineFunctions, createFn } from 'svelte-locale';

export type AppFunctions = {
  'billing.status': (input: { status: 'paid' | 'pending' | 'overdue'; days?: number }) => string;
};

defineFunctions({
  en: {
    'billing.status': ({ status, days }) => {
      if (status === 'paid') return 'Invoice is paid.';
      if (status === 'overdue') return \`Invoice is overdue by \${days ?? 0} days.\`;
      return 'Invoice is pending.';
    }
  },
  sv: {
    'billing.status': ({ status, days }) => {
      if (status === 'paid') return 'Fakturan är betald.';
      if (status === 'overdue') return \`Fakturan är \${days ?? 0} dagar sen.\`;
      return 'Fakturan väntar på betalning.';
    }
  }
});

export const fn = createFn<AppFunctions>();`;

	const fnExampleCode = `import { fn } from '$lib/i18n/functions';

fn('billing.status', { status: 'paid' })             // → 'Invoice is paid.'
fn('billing.status', { status: 'overdue', days: 3 }) // → 'Invoice is overdue by 3 days.'`;

	const formatExampleCode = `import { formatNumber, formatCurrency, formatDate, formatRelativeTime } from 'svelte-locale';

formatNumber(1234567.89)                        // → '1,234,567.89'
formatNumber(0.42, { style: 'percent' })        // → '42%'
formatCurrency(299, 'SEK')                      // → 'SEK 299.00' (en) / '299,00 kr' (sv)
formatCurrency(9.99, 'USD')                     // → '$9.99'
formatDate(new Date(), { dateStyle: 'long' })   // → 'July 3, 2026'
formatRelativeTime(-2, 'day')                   // → '2 days ago'
formatRelativeTime(1, 'hour')                   // → 'in 1 hour'`;

	const i18nExampleCode = `<script lang="ts">
  import { I18n } from 'svelte-locale/svelte';
<\/script>

<I18n key="home.hero">
  <section lang="en">
    <h1>Support made simple</h1>
  </section>
  <section lang="sv">
    <h1>Support gjort enkelt</h1>
  </section>
</I18n>`;

	const localeSwitcherCode = `<script lang="ts">
  import { LocaleSwitcher } from 'svelte-locale/svelte';
<\/script>

<!-- Default -->
<LocaleSwitcher />

<!-- Custom button snippet -->
<LocaleSwitcher>
  {#snippet button({ locale, active, label, select })}
    <button onclick={select} aria-pressed={active} style="font-weight: {active ? 'bold' : 'normal'}">
      {locale.toUpperCase()} — {label}
    </button>
  {/snippet}
</LocaleSwitcher>`;

	const localeLinksCode = `<script lang="ts">
  import { LocaleLink, HreflangLinks } from 'svelte-locale/svelte';
  import { page } from '$app/stores';
<\/script>

<!-- Automatically prepends locale prefix based on routing strategy -->
<LocaleLink href="/settings">Settings</LocaleLink>
<LocaleLink href="/settings" locale="sv">Svenska inställningar</LocaleLink>

<!-- In root layout <svelte:head> for SEO -->
<HreflangLinks pathname={$page.url.pathname} origin={$page.url.origin} />`;

	const viteCode = `import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { richI18n } from 'svelte-locale/vite';

export default defineConfig({
  plugins: [
    richI18n({ locales: ['en', 'sv'] }),
    sveltekit()
  ]
});`;

	const appHtmlCode = `<html lang="%lang%" dir="%dir%">`;

	const appDtsCode = `declare global {
  namespace App {
    interface Locals {
      locale: import('svelte-locale').Locale;
    }
  }
}
export {};`;

	const hooksCode = `import type { Handle } from '@sveltejs/kit';
import { handleI18n } from 'svelte-locale/server';
import '$lib/i18n/messages';
import '$lib/i18n/plurals';
import '$lib/i18n/functions';

export const handle: Handle = handleI18n();`;

	const layoutServerCode = `export const load = ({ locals }: { locals: App.Locals }) => ({
  locale: locals.locale
});`;

	const layoutSvelteCode = `<script lang="ts">
  import { untrack } from 'svelte';
  import { initLocale } from 'svelte-locale';
  import type { Snippet } from 'svelte';

  let { data, children }: { data: { locale: import('svelte-locale').Locale }; children: Snippet } = $props();

  untrack(() => initLocale(data.locale));
  $effect(() => { initLocale(data.locale); });
<\/script>
{@render children()}`;

	const layoutTsCode = `import '$lib/i18n/messages';
import '$lib/i18n/plurals';
import '$lib/i18n/functions';`;

	const configCode = `export const i18nConfig = {
  locales: ['en', 'sv'] as const,
  defaultLocale: 'en',
  fallbackLocale: 'en',
  cookieName: 'locale',
  routing: {
    strategy: 'none', // 'prefix' | 'prefix-non-default' | 'none'
    prefixDefaultLocale: false
  },
  detection: ['url', 'cookie', 'accept-language', 'default']
} as const;`;

	const routingRows = [
		{ strategy: 'none', en: '—', sv: '—', bare: '✓' },
		{ strategy: 'prefix-non-default', en: 'redirects → /settings', sv: '✓', bare: '✓ (en)' },
		{ strategy: 'prefix', en: '✓', sv: '✓', bare: 'redirects → /en/settings' },
	];

	const coreApi = [
		{ name: 't(key, values?)', desc: 'Translate a string key for the current locale. Falls back to fallbackLocale, then returns the key.' },
		{ name: 'tForLocale(locale, key, values?)', desc: 'Same as t() but for a specific locale. Useful in server-side load functions.' },
		{ name: 'plural(key, count, values?)', desc: 'Resolve a plural string via Intl.PluralRules. {count} is automatically available.' },
		{ name: 'pluralForLocale(locale, key, count, values?)', desc: 'Same as plural() but for a specific locale.' },
		{ name: 'fn(key, input)', desc: 'Untyped function translation. Use createFn<M>() for a typed version.' },
		{ name: 'createFn<M>()', desc: 'Returns a typed fn() bound to your function map.' },
		{ name: 'fnForLocale(locale, key, ...args)', desc: 'Untyped fn call for a specific locale. Useful server-side.' },
		{ name: 'getLocale()', desc: 'Returns the current locale as a reactive Svelte 5 $state value.' },
		{ name: 'setLocale(locale, options?)', desc: 'Change locale at runtime. Updates state, html lang/dir, cookie, and optionally navigates.' },
		{ name: 'initLocale(locale)', desc: 'Set locale from server-resolved value. Call in root layout $effect. No navigation side-effects.' },
		{ name: 'defineLocale(code, definition)', desc: 'Register a custom locale or override an existing registry entry.' },
		{ name: 'getLocaleName(locale)', desc: 'Get the human-readable display name of a locale.' },
		{ name: 'getLocaleDir(locale)', desc: "Get the text direction for a locale. Returns 'ltr' or 'rtl'." },
		{ name: 'getLocaleRegistry()', desc: 'Returns a read-only snapshot of the full locale registry.' },
		{ name: 'formatNumber(value, options?)', desc: 'Locale-aware number formatting via Intl.NumberFormat. Cached per locale+options.' },
		{ name: 'formatCurrency(value, currency?, options?)', desc: 'Locale-aware currency formatting.' },
		{ name: 'formatDate(value, options?)', desc: 'Locale-aware date formatting. Accepts Date, ISO string, or timestamp.' },
		{ name: 'formatRelativeTime(value, unit, options?)', desc: 'Relative time formatting via Intl.RelativeTimeFormat.' },
		{ name: 'withLocale(path, locale?)', desc: 'Prepend locale prefix based on routing strategy. Uses current locale if omitted.' },
		{ name: 'switchLocaleInPath(pathname, locale)', desc: 'Swap the locale prefix in a path.' },
		{ name: 'getLocaleFromPath(pathname)', desc: 'Extract locale from the first path segment.' },
		{ name: 'stripLocalePrefix(pathname)', desc: 'Remove the locale prefix from a path.' },
	];

	const serverApi = [
		{ name: 'handleI18n()', desc: 'SvelteKit Handle hook. Detects locale, sets locals.locale, handles prefix redirects, sets cookie, patches html lang/dir, sets Content-Language header.' },
		{ name: 'detectLocale(event)', desc: 'Runs just the detection logic without the full handle middleware. Useful for manual handle composition.' },
	];

	const svelteApi = [
		{ name: '<I18n key fallback? as? class? style?>', desc: 'Renders only the active locale block. All other blocks stripped at compile time by the Vite plugin.' },
		{ name: '<LocaleLink href locale?>', desc: 'Locale-aware anchor. Prepends correct prefix based on routing strategy. Accepts all <a> attributes.' },
		{ name: '<LocaleSwitcher class? buttonClass? button?>', desc: 'Renders a button per locale. Active locale has aria-pressed="true". Supports custom button snippet.' },
		{ name: '<HreflangLinks pathname origin? xDefault? extraLocales?>', desc: 'Injects <link rel="alternate" hreflang="..."> tags for SEO. Place in root layout <svelte:head>.' },
	];

	const viteApi = [
		{ name: 'richI18n({ locales? })', desc: 'Vite plugin. Transforms <I18n> children into Svelte snippets at compile time. Warns on invalid/duplicate lang values.' },
	];

	const comparisonRows = [
		{ feature: 'Zero dependencies', svelte_locale: '✓', paraglide: '✓', typesafe_i18n: '✗', svelte_i18n: '✗' },
		{ feature: 'Server-first / zero flicker', svelte_locale: '✓', paraglide: '✓', typesafe_i18n: '△', svelte_i18n: '✗' },
		{ feature: 'Svelte 5 runes', svelte_locale: '✓', paraglide: '✓', typesafe_i18n: '△', svelte_i18n: '△' },
		{ feature: 'npx init scaffolding', svelte_locale: '✓', paraglide: '✓', typesafe_i18n: '✗', svelte_i18n: '✗' },
		{ feature: 'Plural rules (Intl)', svelte_locale: '✓', paraglide: '✓', typesafe_i18n: '✓', svelte_i18n: '✓' },
		{ feature: 'Logic-based fn() translations', svelte_locale: '✓', paraglide: '✗', typesafe_i18n: '△', svelte_i18n: '✗' },
		{ feature: 'Rich component <I18n>', svelte_locale: '✓', paraglide: '✗', typesafe_i18n: '✗', svelte_i18n: '✗' },
		{ feature: 'Intl formatters built-in', svelte_locale: '✓', paraglide: '✗', typesafe_i18n: '✓', svelte_i18n: '✗' },
		{ feature: 'RTL via html dir', svelte_locale: '✓', paraglide: '✗', typesafe_i18n: '✗', svelte_i18n: '✗' },
		{ feature: '<LocaleSwitcher> component', svelte_locale: '✓', paraglide: '✗', typesafe_i18n: '✗', svelte_i18n: '✗' },
		{ feature: 'HreflangLinks SEO component', svelte_locale: '✓', paraglide: '△', typesafe_i18n: '✗', svelte_i18n: '✗' },
		{ feature: 'URL prefix routing', svelte_locale: '✓', paraglide: '✓', typesafe_i18n: '✗', svelte_i18n: '✗' },
	];
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
		<p class="mb-1 text-lg text-zinc-500">A SvelteKit-native i18n library for Svelte 5. Zero dependencies.</p>
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

		<section class="space-y-4">
			<div>
				<h2 class="mb-1 text-xl font-semibold">Installation</h2>
				<p class="text-sm text-zinc-500">Run <Badge variant="outline">init</Badge> — it installs the package and scaffolds all required files. Existing files are never overwritten.</p>
			</div>
			<CodeBlock code={quickInstallCode} lang="bash" />
			<div class="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm text-zinc-700">
				<p class="mb-2 font-medium">The <code class="rounded bg-zinc-200 px-1 py-0.5 text-xs">init</code> command writes:</p>
				<ul class="space-y-1 text-xs text-zinc-600">
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/app.html</code> — patches <code class="rounded bg-zinc-200 px-1 py-0.5">%lang%</code> and <code class="rounded bg-zinc-200 px-1 py-0.5">%dir%</code> onto <code class="rounded bg-zinc-200 px-1 py-0.5">&lt;html&gt;</code></li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/app.d.ts</code> — types <code class="rounded bg-zinc-200 px-1 py-0.5">App.Locals.locale</code></li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/hooks.server.ts</code> — wires up <code class="rounded bg-zinc-200 px-1 py-0.5">handleI18n()</code></li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/routes/+layout.server.ts</code> — passes locale to the client</li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/routes/+layout.ts</code> — imports translation files client-side</li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/routes/+layout.svelte</code> — calls <code class="rounded bg-zinc-200 px-1 py-0.5">initLocale</code> reactively</li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/lib/i18n/messages.ts</code> — starter message file</li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/lib/i18n/plurals.ts</code> — starter plural file</li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/lib/i18n/functions.ts</code> — starter function file</li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">vite.config.ts</code> — patches in the <code class="rounded bg-zinc-200 px-1 py-0.5">richI18n()</code> Vite plugin</li>
				</ul>
			</div>
		</section>

		<section class="space-y-4">
			<div>
				<h2 class="mb-1 text-xl font-semibold">How it compares</h2>
				<p class="text-sm text-zinc-500">svelte-locale vs the most popular SvelteKit i18n options. <span class="text-zinc-400">△ = partial / workaround required</span></p>
			</div>
			<div class="overflow-hidden rounded-lg border border-zinc-200">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead class="w-56">Feature</TableHead>
							<TableHead class="text-center font-semibold text-zinc-800">svelte-locale</TableHead>
							<TableHead class="text-center">Paraglide</TableHead>
							<TableHead class="text-center">typesafe-i18n</TableHead>
							<TableHead class="text-center">svelte-i18n</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each comparisonRows as row (row.feature)}
							<TableRow>
								<TableCell class="text-sm text-zinc-700">{row.feature}</TableCell>
								<TableCell class="text-center font-semibold {row.svelte_locale === '✓' ? 'text-emerald-600' : row.svelte_locale === '△' ? 'text-amber-500' : 'text-red-500'}">{row.svelte_locale}</TableCell>
								<TableCell class="text-center {row.paraglide === '✓' ? 'text-emerald-600' : row.paraglide === '△' ? 'text-amber-500' : 'text-red-500'}">{row.paraglide}</TableCell>
								<TableCell class="text-center {row.typesafe_i18n === '✓' ? 'text-emerald-600' : row.typesafe_i18n === '△' ? 'text-amber-500' : 'text-red-500'}">{row.typesafe_i18n}</TableCell>
								<TableCell class="text-center {row.svelte_i18n === '✓' ? 'text-emerald-600' : row.svelte_i18n === '△' ? 'text-amber-500' : 'text-red-500'}">{row.svelte_i18n}</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</div>
		</section>

		<section class="space-y-4">
			<div>
				<h2 class="mb-1 text-xl font-semibold">t() — String translations</h2>
				<p class="text-sm text-zinc-500">Define messages per locale, then call <Badge variant="outline">t(key)</Badge> anywhere. Use <Badge variant="outline">{'{name}'}</Badge>-style placeholders for interpolation. Falls back to <Badge variant="outline">fallbackLocale</Badge> if a key is missing.</p>
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
				<p class="text-sm text-zinc-500">Define plural forms using CLDR category keys (<Badge variant="outline">one</Badge>, <Badge variant="outline">other</Badge>, <Badge variant="outline">few</Badge>, …). <Badge variant="outline">Intl.PluralRules</Badge> picks the right form automatically. <Badge variant="outline">{'{count}'}</Badge> is always available.</p>
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
				<p class="text-sm text-zinc-500">When a string template isn't enough — conditionals, formatting, composed strings — define a typed function per locale. Use <Badge variant="outline">createFn&lt;M&gt;()</Badge> to get full type inference on keys and arguments.</p>
			</div>
			<CodeBlock code={functionsCode} lang="ts" filename="src/lib/i18n/functions.ts" />
			<CodeBlock code={fnExampleCode} lang="ts" />
		</section>

		<section class="space-y-4">
			<div>
				<h2 class="mb-1 text-xl font-semibold">Intl formatters</h2>
				<p class="text-sm text-zinc-500">All formatting uses native <Badge variant="outline">Intl</Badge> APIs keyed to the active locale. No external libraries. Formatters are cached per locale+options combination.</p>
			</div>
			<CodeBlock code={formatExampleCode} lang="ts" />
			<Card>
				<CardContent class="pt-4">
					<p class="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-600">Live demo</p>
					<ShowcaseFormat />
				</CardContent>
			</Card>
		</section>

		<section class="space-y-4">
			<div>
				<h2 class="mb-1 text-xl font-semibold">&lt;I18n&gt; — Rich component translations</h2>
				<p class="text-sm text-zinc-500">Wrap locale-specific markup in <Badge variant="outline">&lt;I18n&gt;</Badge>. The Vite plugin transforms each child into a Svelte snippet at compile time — only the active locale's HTML is ever sent to the browser. No hidden DOM, no client-side switching.</p>
			</div>
			<CodeBlock code={i18nExampleCode} lang="svelte" />
			<div class="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm text-amber-800">
				Every direct child must have a <Badge variant="outline" class="border-amber-200 bg-amber-100 text-amber-800">lang</Badge> attribute matching a configured locale. Any Svelte content is allowed inside — components, <code class="rounded bg-amber-100 px-1 py-0.5 text-xs">{'{#if}'}</code>, <code class="rounded bg-amber-100 px-1 py-0.5 text-xs">{'{#each}'}</code>, etc.
			</div>
		</section>

		<section class="space-y-4">
			<div>
				<h2 class="mb-1 text-xl font-semibold">Components</h2>
				<p class="text-sm text-zinc-500"><Badge variant="outline">&lt;LocaleSwitcher&gt;</Badge>, <Badge variant="outline">&lt;LocaleLink&gt;</Badge>, and <Badge variant="outline">&lt;HreflangLinks&gt;</Badge> are all imported from <Badge variant="outline">svelte-locale/svelte</Badge>.</p>
			</div>
			<CodeBlock code={localeSwitcherCode} lang="svelte" />
			<CodeBlock code={localeLinksCode} lang="svelte" />
		</section>

		<section class="space-y-6">
			<div>
				<h2 class="mb-1 text-xl font-semibold">Manual setup</h2>
				<p class="text-sm text-zinc-500">If you prefer to wire things up yourself, first install the package, then create these files:</p>
			</div>

			<div>
				<p class="mb-1 text-sm font-medium text-zinc-700">0. Install the package</p>
				<CodeBlock code="npm install svelte-locale" lang="bash" />
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
				<p class="mb-2 text-xs text-zinc-600">The server passes locale down; the client initialises its reactive state from it.</p>
				<div class="space-y-4">
					<CodeBlock code={layoutServerCode} lang="ts" filename="+layout.server.ts" route="src/routes/+layout.server.ts" />
					<CodeBlock code={layoutTsCode} lang="ts" filename="+layout.ts" route="src/routes/+layout.ts" />
					<CodeBlock code={layoutSvelteCode} lang="svelte" filename="+layout.svelte" route="src/routes/+layout.svelte" />
				</div>
			</div>
		</section>

		<section class="space-y-4">
			<div>
				<h2 class="mb-1 text-xl font-semibold">Configuration</h2>
				<p class="text-sm text-zinc-500">The library ships with defaults baked in. Override by passing config to <Badge variant="outline">richI18n()</Badge> and <Badge variant="outline">handleI18n()</Badge>, or create your own config file to share across both.</p>
			</div>
			<CodeBlock code={configCode} lang="ts" filename="src/lib/i18n/config.ts" />
			<div class="overflow-hidden rounded-lg border border-zinc-200">
				<Table>
					<TableBody>
						{#each [
							{ key: 'locales', desc: 'All supported locale codes.' },
							{ key: 'defaultLocale', desc: 'Used when no locale can be detected.' },
							{ key: 'fallbackLocale', desc: 'Used when a translation key is missing for the active locale.' },
							{ key: 'cookieName', desc: 'The cookie used to persist locale preference across requests.' },
							{ key: "routing.strategy: 'none'", desc: 'No URL prefix. Locale is cookie/header only.' },
							{ key: "routing.strategy: 'prefix-non-default'", desc: "Non-default locales get a prefix (e.g. /sv/settings). Default locale uses clean paths." },
							{ key: "routing.strategy: 'prefix'", desc: 'All locales get a prefix, including the default.' },
							{ key: 'detection', desc: "Order of locale detection sources: 'url' → 'cookie' → 'accept-language' → 'default'." },
						] as row (row.key)}
							<TableRow>
								<TableCell class="w-64 font-mono text-xs font-medium text-zinc-800">{row.key}</TableCell>
								<TableCell class="text-sm text-zinc-600">{row.desc}</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</div>
		</section>

		<section class="space-y-4">
			<div>
				<h2 class="mb-1 text-xl font-semibold">Routing strategies</h2>
				<p class="text-sm text-zinc-500">Set <Badge variant="outline">routing.strategy</Badge> in your config. The handle hook handles redirects automatically.</p>
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
				{#each [
					{ label: 'svelte-locale', badge: 'core', items: coreApi },
					{ label: 'svelte-locale/server', badge: 'server', items: serverApi },
					{ label: 'svelte-locale/svelte', badge: 'components', items: svelteApi },
					{ label: 'svelte-locale/vite', badge: 'vite', items: viteApi },
				] as group (group.label)}
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
											<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">{item.name}</TableCell>
											<TableCell class="text-sm text-zinc-600">{item.desc}</TableCell>
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
