<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ShowcaseT from '$lib/components/ShowcaseT.svelte';
	import ShowcasePlural from '$lib/components/ShowcasePlural.svelte';
	import ShowcaseFormat from '$lib/components/ShowcaseFormat.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '$lib/components/ui/table';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { Sheet, SheetContent, SheetTrigger } from '$lib/components/ui/sheet';
	import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '$lib/components/ui/command';
	import { Kbd } from '$lib/components/ui/kbd';
	import { Globe, Menu, Search } from '@lucide/svelte';
	import { setLocale } from 'svelte-locale';
	import { t } from 'svelte-locale';
	import { getLocale } from 'svelte-locale';

	let locale = $state(getLocale());
	let tocOpen = $state(false);
	let searchOpen = $state(false);
	let searchValue = $state('');
	let highlightedSection = $state<string | null>(null);

	$effect(() => {
		setLocale(locale);
	});

	// Scroll spy to update URL hash when scrolling
	const sectionIds = ['install', 'compare', 't', 'plural', 'fn', 'format', 'i18n', 'components', 'bcp', 'syntax', 'manual', 'config', 'routing', 'api'];

	// Search items for fuzzy search - includes section content
	const searchItems = [
		{
			id: 'install',
			label: t('toc.install'),
			content: `${t('install.title')} ${t('install.desc')} npx svelte-locale init`
		},
		{
			id: 'compare',
			label: t('toc.compare'),
			content: `${t('compare.title')} ${t('compare.desc')} stupid-simple i18n for SvelteKit`
		},
		{
			id: 't',
			label: t('toc.t'),
			content: `${t('t.title')} ${t('t.desc')} defineMessages t()`
		},
		{
			id: 'plural',
			label: t('toc.plural'),
			content: `${t('plural.title')} ${t('plural.desc')} definePlurals plural()`
		},
		{
			id: 'fn',
			label: t('toc.fn'),
			content: `${t('fn.title')} ${t('fn.desc')} fn()`
		},
		{
			id: 'format',
			label: t('toc.format'),
			content: `${t('format.title')} ${t('format.desc')} formatDateISO formatDateTimeISO`
		},
		{
			id: 'i18n',
			label: t('toc.i18n'),
			content: `${t('i18n.title')} ${t('i18n.desc')} <I18n> component rich text`
		},
		{
			id: 'components',
			label: t('toc.components'),
			content: `${t('components.title')} ${t('components.desc')} <LocaleSwitcher> <HreflangLinks>`
		},
		{
			id: 'bcp',
			label: t('toc.bcp'),
			content: `${t('bcp.title')} ${t('bcp.desc')} BCP 47 locale regional variants`
		},
		{
			id: 'syntax',
			label: t('toc.syntax'),
			content: `${t('syntax.title')} ${t('syntax.desc')} syntax differences paraglide typesafe-i18n svelte-i18n`
		},
		{
			id: 'manual',
			label: t('toc.manual'),
			content: `${t('manual.title')} ${t('manual.desc')} manual translation`
		},
		{
			id: 'config',
			label: t('toc.config'),
			content: `${t('config.title')} ${t('config.desc')} configuration options`
		},
		{
			id: 'routing',
			label: t('toc.routing'),
			content: `${t('routing.title')} ${t('routing.desc')} URL prefix routing`
		},
		{
			id: 'api',
			label: t('toc.api'),
			content: `API reference t() plural() fn() setLocale() getLocale() defineMessages() definePlurals()`
		},
		// API functions
		{ id: 'api-t', label: 't()', content: 't() message translation function' },
		{ id: 'api-plural', label: 'plural()', content: 'plural() pluralization function' },
		{ id: 'api-fn', label: 'fn()', content: 'fn() custom function handler' },
		{ id: 'api-setlocale', label: 'setLocale()', content: 'setLocale() change current locale' },
		{ id: 'api-getlocale', label: 'getLocale()', content: 'getLocale() get current locale' },
		{ id: 'api-definemessages', label: 'defineMessages()', content: 'defineMessages() register message translations' },
		{ id: 'api-defineplurals', label: 'definePlurals()', content: 'definePlurals() register plural rules' },
		{ id: 'api-definefunctions', label: 'defineFunctions()', content: 'defineFunctions() register custom functions' },
		{ id: 'api-createfn', label: 'createFn()', content: 'createFn() create typed function handler' },
		{ id: 'api-formatdateiso', label: 'formatDateISO()', content: 'formatDateISO() ISO 8601 date formatting' },
		{ id: 'api-formatdatetimeiso', label: 'formatDateTimeISO()', content: 'formatDateTimeISO() ISO 8601 datetime formatting' },
		{ id: 'api-definelocale', label: 'defineLocale()', content: 'defineLocale() register custom locale' },
		{ id: 'api-getlocalename', label: 'getLocaleName()', content: 'getLocaleName() get locale display name' },
		{ id: 'api-getlocaledir', label: 'getLocaleDir()', content: 'getLocaleDir() get text direction' },
		{ id: 'api-getlocaleregistry', label: 'getLocaleRegistry()', content: 'getLocaleRegistry() get locale registry' },
		{ id: 'api-formatnumber', label: 'formatNumber()', content: 'formatNumber() number formatting' },
		{ id: 'api-formatcurrency', label: 'formatCurrency()', content: 'formatCurrency() currency formatting' },
		{ id: 'api-formatdate', label: 'formatDate()', content: 'formatDate() date formatting' },
		{ id: 'api-formatrelativetime', label: 'formatRelativeTime()', content: 'formatRelativeTime() relative time formatting' },
		{ id: 'api-withlocale', label: 'withLocale()', content: 'withLocale() prepend locale prefix' },
		{ id: 'api-switchlocaleinpath', label: 'switchLocaleInPath()', content: 'switchLocaleInPath() swap locale in path' },
		{ id: 'api-getlocalefrompath', label: 'getLocaleFromPath()', content: 'getLocaleFromPath() extract locale from path' },
		{ id: 'api-striplocaleprefix', label: 'stripLocalePrefix()', content: 'stripLocalePrefix() remove locale prefix' },
		{ id: 'api-handlei18n', label: 'handleI18n()', content: 'handleI18n() SvelteKit handle hook' },
		{ id: 'api-detectlocale', label: 'detectLocale()', content: 'detectLocale() locale detection logic' },
		{ id: 'api-i18n', label: '<I18n>', content: '<I18n> rich text component' },
		{ id: 'api-localelink', label: '<LocaleLink>', content: '<LocaleLink> locale-aware anchor' },
		{ id: 'api-localeswitcher', label: '<LocaleSwitcher>', content: '<LocaleSwitcher> locale switcher component' },
		{ id: 'api-hreflanglinks', label: '<HreflangLinks>', content: '<HreflangLinks> SEO hreflang tags' },
		{ id: 'api-richi18n', label: 'richI18n()', content: 'richI18n() Vite plugin' }
	];

	function navigateToSection(id: string) {
		// Handle API function IDs - map to API section and specific row
		if (id.startsWith('api-')) {
			const apiSection = document.getElementById('api');
			if (apiSection) {
				apiSection.scrollIntoView({ behavior: 'smooth' });
				// Try to find the specific row (row IDs have trailing dash from parentheses)
				const rowId = id.replace('api-', '') + '-';
				const row = document.getElementById(rowId);
				if (row) {
					setTimeout(() => {
						row.scrollIntoView({ behavior: 'smooth', block: 'center' });
						// Highlight the row
						row.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
						setTimeout(() => {
							row.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
						}, 2000);
					}, 300);
				}
				highlightedSection = 'api';
			}
		} else {
			const element = document.getElementById(id);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
				highlightedSection = id;
			}
		}
		searchOpen = false;
		searchValue = '';
		// Remove highlight after 2 seconds
		setTimeout(() => {
			highlightedSection = null;
		}, 2000);
	}

	function updateActiveSection() {
		const scrollPosition = window.scrollY + 100;
		let activeId = '';

		for (const id of sectionIds) {
			const section = document.getElementById(id);
			if (section) {
				const sectionTop = section.offsetTop;
				const sectionBottom = sectionTop + section.offsetHeight;
				if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
					activeId = id;
					break;
				}
			}
		}

		if (activeId && window.location.hash !== `#${activeId}`) {
			history.replaceState(null, '', `#${activeId}`);
		}
	}

	$effect(() => {
		window.addEventListener('scroll', updateActiveSection, { passive: true });
		return () => window.removeEventListener('scroll', updateActiveSection);
	});

	// Keyboard shortcut for search (Cmd+K or Ctrl+K)
	$effect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault();
				searchOpen = !searchOpen;
			}
			if (e.key === 'Escape' && searchOpen) {
				searchOpen = false;
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	});

	const quickInstallCode = `npx svelte-locale init`;

	const tInlineCode = `<!-- src/routes/+page.svelte -->
<` + `script lang="ts">
import { defineMessages } from 'svelte-locale';
import { t } from 'svelte-locale';

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
});
</` + `script>

<p>{t('common.save')}</p>                         <!-- → 'Save' -->
<p>{t('auth.welcome', { name: 'Vincent' })}</p>   <!-- → 'Welcome back, Vincent' -->`;

	const pluralInlineCode = `<!-- src/routes/+page.svelte -->
<` + `script lang="ts">
import { definePlurals } from 'svelte-locale';
import { plural } from 'svelte-locale';

definePlurals({
  en: {
    'tickets.count': { one: '{count} ticket', other: '{count} tickets' }
  },
  sv: {
    'tickets.count': { one: '{count} biljett', other: '{count} biljetter' }
  }
});
</` + `script>

<p>{plural('tickets.count', 1)}</p>  <!-- → '1 ticket' -->
<p>{plural('tickets.count', 5)}</p>  <!-- → '5 tickets' -->`;

	const richTextCode = `// svelte-locale
<I18n key="home.hero">
  <div lang="en">
    <h1>Support made simple</h1>
  </div>
  <div lang="sv">
    <h1>Support gjort enkelt</h1>
  </div>
</I18n>

// paraglide
{@html m.termsAccept()}

// typesafe-i18n
{@html $LL.TERMS_ACCEPT()}

// svelte-i18n
{@html $t('terms.accept')}`;

	const inlineI18nCode = `// svelte-locale
<I18n key="home.hero">
  <div lang="en">
    <h1>{t('hero.title')}</h1>
    <p>{t('hero.subtitle')}</p>
  </div>
  <div lang="sv">
    <h1>{t('hero.title')}</h1>
    <p>{t('hero.subtitle')}</p>
  </div>
</I18n>

// paraglide
<p>{m.heroTitle()}</p>

// typesafe-i18n
<p>{$LL.HERO_TITLE()}</p>

// svelte-i18n
<p>{$t('hero.title')}</p>`;

	const interpolationCode = `// svelte-locale
{t('auth.welcome', { name: 'Vincent' })}

// paraglide
{m.authWelcome({ name: 'Vincent' })}

// typesafe-i18n
{$LL.AUTH_WELCOME({ name: 'Vincent' })}

// svelte-i18n
{$t('auth.welcome', { values: { name: 'Vincent' } })}`;

	const pluralCode = `// svelte-locale
{plural('tickets.count', count)}

// paraglide
{m.ticketsCount({ count })}

// typesafe-i18n
{$LL.TICKETS_COUNT({ count })}

// svelte-i18n
{$t('tickets.count', { values: { count } })}`;

	const localeSwitchCode = `// svelte-locale
setLocale('sv')

// paraglide
redirectToLanguage('sv')

// typesafe-i18n
setLocale('sv')

// svelte-i18n
locale.set('sv')`;

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
		{ feature: 'Zero direct dependencies', svelte_locale: '✓', paraglide: '✗', typesafe_i18n: '✓', svelte_i18n: '✗' },
		{ feature: 'Server-first / zero flicker', svelte_locale: '✓', paraglide: '✓', typesafe_i18n: '△', svelte_i18n: '△' },
		{ feature: 'Svelte 5 runes-friendly', svelte_locale: '✓', paraglide: '✓', typesafe_i18n: '△', svelte_i18n: '△' },
		{ feature: 'SvelteKit-native scaffolding', svelte_locale: '✓', paraglide: '✓', typesafe_i18n: '△', svelte_i18n: '✗' },
		{ feature: 'Plural rules via Intl', svelte_locale: '✓', paraglide: '✓', typesafe_i18n: '✓', svelte_i18n: '✓' },
		{ feature: 'Logic-based fn() translations', svelte_locale: '✓', paraglide: '△', typesafe_i18n: '△', svelte_i18n: '✗' },
		{ feature: 'Rich component <I18n>', svelte_locale: '✓', paraglide: '△', typesafe_i18n: '✗', svelte_i18n: '✗' },
		{ feature: 'Rich text / component interpolation', svelte_locale: '✓', paraglide: '✓', typesafe_i18n: '✗', svelte_i18n: '△' },
		{ feature: 'Intl formatter helpers', svelte_locale: '✓', paraglide: '✓', typesafe_i18n: '✓', svelte_i18n: '✗' },
		{ feature: 'ISO 8601 formatters', svelte_locale: '✓', paraglide: '✗', typesafe_i18n: '✗', svelte_i18n: '✗' },
		{ feature: 'BCP 47 / regional locale support', svelte_locale: '✓', paraglide: '✓', typesafe_i18n: '✗', svelte_i18n: '✗' },
		{ feature: 'RTL via <html dir>', svelte_locale: '✓', paraglide: '✓', typesafe_i18n: '✗', svelte_i18n: '✗' },
		{ feature: '<LocaleSwitcher> component', svelte_locale: '✓', paraglide: '✗', typesafe_i18n: '✗', svelte_i18n: '✗' },
		{ feature: '<HreflangLinks> SEO component', svelte_locale: '✓', paraglide: '△', typesafe_i18n: '✗', svelte_i18n: '✗' },
		{ feature: 'URL prefix routing', svelte_locale: '✓', paraglide: '✓', typesafe_i18n: '✗', svelte_i18n: '✗' },
		{ feature: 'Type-safe keys and params', svelte_locale: '✓', paraglide: '✓', typesafe_i18n: '✓', svelte_i18n: '✗' },
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
		<p class="mb-1 text-lg text-zinc-500">{t('hero.tagline')}</p>
		<p class="mb-8 text-sm text-zinc-600">{t('hero.features')}</p>
		<div class="flex gap-3">
			<Button href="https://www.npmjs.com/package/svelte-locale" target="_blank" rel="noopener noreferrer" size="lg">
				{t('hero.npm')}
			</Button>
			<Button href="https://github.com/VincentBarkman/svelte-locale" target="_blank" rel="noopener noreferrer" variant="outline" size="lg">
				{t('hero.github')}
			</Button>
		</div>
	</header>

	<CommandDialog bind:open={searchOpen}>
		<CommandInput placeholder="Search documentation..." bind:value={searchValue} />
		<CommandList>
			<CommandEmpty>No results found.</CommandEmpty>
			<CommandGroup heading="Sections">
				{#each searchItems as item (item.id)}
					<CommandItem value={item.content} onclick={() => navigateToSection(item.id)}>
						<div class="flex flex-col">
							<span class="font-medium">{item.label}</span>
							<span class="text-xs text-zinc-500">{item.content}</span>
						</div>
					</CommandItem>
				{/each}
			</CommandGroup>
		</CommandList>
	</CommandDialog>

	<main class="pb-28 lg:grid lg:grid-cols-[1fr_minmax(0,672px)_1fr]">
		<!-- Main content -->
		<div class="max-w-2xl w-full px-6 space-y-20 lg:col-start-2">

		<section id="install" class="space-y-4 {highlightedSection === 'install' ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg p-4 transition-all duration-300' : ''}">
			<div>
				<h2 class="mb-1 text-xl font-semibold">{t('install.title')}</h2>
				<p class="text-sm text-zinc-500">{t('install.desc')}</p>
			</div>
			<CodeBlock code={quickInstallCode} lang="bash" />
			<div class="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm text-zinc-700">
				<p class="mb-2 font-medium">{t('install.init_writes')}</p>
				<ul class="space-y-1 text-xs text-zinc-600">
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/app.html</code> — {t('install.app_html')}</li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/app.d.ts</code> — {t('install.app_dts')}</li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/hooks.server.ts</code> — {t('install.hooks')}</li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/routes/+layout.server.ts</code> — {t('install.layout_server')}</li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/routes/+layout.ts</code> — {t('install.layout_ts')}</li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/routes/+layout.svelte</code> — {t('install.layout_svelte')}</li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/lib/i18n/messages.ts</code> — {t('install.messages')}</li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/lib/i18n/plurals.ts</code> — {t('install.plurals')}</li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">src/lib/i18n/functions.ts</code> — {t('install.functions')}</li>
					<li><code class="rounded bg-zinc-200 px-1 py-0.5">vite.config.ts</code> — {t('install.vite')}</li>
				</ul>
			</div>
		</section>

		<section id="compare" class="space-y-4 {highlightedSection === 'compare' ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg p-4 transition-all duration-300' : ''}">
			<div>
				<h2 class="mb-1 text-xl font-semibold">{t('compare.title')}</h2>
				<p class="text-sm text-zinc-500">{t('compare.desc')}</p>
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
			<div class="flex gap-4 text-xs text-zinc-500">
				<span class="flex items-center gap-1"><span class="text-emerald-600 font-semibold">✓</span> {t('compare.legend.built')}</span>
				<span class="flex items-center gap-1"><span class="text-amber-500 font-semibold">△</span> {t('compare.legend.partial')}</span>
				<span class="flex items-center gap-1"><span class="text-red-500 font-semibold">✗</span> {t('compare.legend.not')}</span>
			</div>
		</section>

		<section id="t" class="space-y-4 {highlightedSection === 't' ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg p-4 transition-all duration-300' : ''}">
			<div>
				<h2 class="mb-1 text-xl font-semibold">{t('t.title')}</h2>
				<p class="text-sm text-zinc-500">{t('t.desc')}</p>
			</div>

			<div class="mt-4 space-y-2">
				<p class="text-sm font-medium text-zinc-700">{t('t.usage_title')}</p>
				<p class="text-xs text-zinc-600">{t('t.usage_desc')}</p>
			</div>

			<div class="mt-4 space-y-2">
				<p class="text-sm font-medium text-zinc-700">{t('t.language_file')}</p>
				<CodeBlock code={`// src/lib/i18n/messages.ts
import { defineMessages } from 'svelte-locale';

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
});

// src/routes/+page.svelte
import { t } from 'svelte-locale';

t('common.save')                         // → 'Save'
t('auth.welcome', { name: 'Vincent' })   // → 'Welcome back, Vincent'`} lang="ts" />
			</div>

			<div class="mt-4 space-y-2">
				<p class="text-sm font-medium text-zinc-700">{t('t.inline')}</p>
				<CodeBlock code={tInlineCode} lang="svelte" />
			</div>

			<Card>
				<CardContent class="pt-4">
					<p class="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-600">{t('t.demo')}</p>
					<ShowcaseT />
				</CardContent>
			</Card>
		</section>

		<section id="plural" class="space-y-4 {highlightedSection === 'plural' ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg p-4 transition-all duration-300' : ''}">
			<div>
				<h2 class="mb-1 text-xl font-semibold">{t('plural.title')}</h2>
				<p class="text-sm text-zinc-500">{t('plural.desc')}</p>
			</div>

			<div class="mt-4 space-y-2">
				<p class="text-sm font-medium text-zinc-700">{t('plural.usage_title')}</p>
				<p class="text-xs text-zinc-600">{t('plural.usage_desc')}</p>
			</div>

			<div class="mt-4 space-y-2">
				<p class="text-sm font-medium text-zinc-700">{t('plural.language_file')}</p>
				<CodeBlock code={`// src/lib/i18n/plurals.ts
import { definePlurals } from 'svelte-locale';

definePlurals({
  en: {
    'tickets.count': { one: '{count} ticket', other: '{count} tickets' }
  },
  sv: {
    'tickets.count': { one: '{count} biljett', other: '{count} biljetter' }
  }
});

// src/routes/+page.svelte
import { plural } from 'svelte-locale';

plural('tickets.count', 1)  // → '1 ticket'
plural('tickets.count', 5)  // → '5 tickets'`} lang="ts" />
			</div>

			<div class="mt-4 space-y-2">
				<p class="text-sm font-medium text-zinc-700">{t('plural.inline')}</p>
				<CodeBlock code={pluralInlineCode} lang="svelte" />
			</div>

			<Card>
				<CardContent class="pt-4">
					<p class="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-600">{t('t.demo')}</p>
					<ShowcasePlural />
				</CardContent>
			</Card>
		</section>

		<section id="fn" class="space-y-4 {highlightedSection === 'fn' ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg p-4 transition-all duration-300' : ''}">
			<div>
				<h2 class="mb-1 text-xl font-semibold">{t('fn.title')}</h2>
				<p class="text-sm text-zinc-500">{t('fn.desc')}</p>
			</div>
			<CodeBlock code={functionsCode} lang="ts" filename="src/lib/i18n/functions.ts" />
			<CodeBlock code={fnExampleCode} lang="ts" />
		</section>

		<section id="format" class="space-y-4 {highlightedSection === 'format' ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg p-4 transition-all duration-300' : ''}">
			<div>
				<h2 class="mb-1 text-xl font-semibold">{t('format.title')}</h2>
				<p class="text-sm text-zinc-500">{t('format.desc')}</p>
			</div>
			<CodeBlock code={formatExampleCode} lang="ts" />
			<Card>
				<CardContent class="pt-4">
					<p class="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-600">{t('t.demo')}</p>
					<ShowcaseFormat />
				</CardContent>
			</Card>
			<div class="mt-4 space-y-2">
				<p class="text-sm font-medium text-zinc-700">{t('format.iso_date')}</p>
				<p class="text-xs text-zinc-600">{t('format.iso_date_desc')}</p>
				<CodeBlock code={`formatDateISO(new Date())          // → '2026-07-03'\nformatDateISO('2026-01-15T10:30Z') // → '2026-01-15'`} lang="ts" />
			</div>
			<div class="mt-4 space-y-2">
				<p class="text-sm font-medium text-zinc-700">{t('format.iso_datetime')}</p>
				<p class="text-xs text-zinc-600">{t('format.iso_datetime_desc')}</p>
				<CodeBlock code={`formatDateTimeISO(new Date()) // → '2026-07-03T10:00:00.000Z'`} lang="ts" />
			</div>
		</section>

		<section id="i18n" class="space-y-4 {highlightedSection === 'i18n' ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg p-4 transition-all duration-300' : ''}">
			<div>
				<h2 class="mb-1 text-xl font-semibold">{t('i18n.title')}</h2>
				<p class="text-sm text-zinc-500">{t('i18n.desc')}</p>
			</div>
			<CodeBlock code={i18nExampleCode} lang="svelte" />
			<div class="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm text-amber-800">
				{t('i18n.note')}
			</div>
		</section>

		<section id="components" class="space-y-4 {highlightedSection === 'components' ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg p-4 transition-all duration-300' : ''}">
			<div>
				<h2 class="mb-1 text-xl font-semibold">{t('components.title')}</h2>
				<p class="text-sm text-zinc-500">{t('components.desc')}</p>
			</div>
			<CodeBlock code={localeSwitcherCode} lang="svelte" />
			<CodeBlock code={localeLinksCode} lang="svelte" />
		</section>

		<section id="bcp" class="space-y-4 {highlightedSection === 'bcp' ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg p-4 transition-all duration-300' : ''}">
			<div>
				<h2 class="mb-1 text-xl font-semibold">{t('bcp.title')}</h2>
				<p class="text-sm text-zinc-500">{t('bcp.desc')}</p>
			</div>
			<div class="mt-4 space-y-2">
				<p class="text-sm font-medium text-zinc-700">{t('bcp.regional')}</p>
				<p class="text-xs text-zinc-600">{t('bcp.regional_desc')}</p>
				<CodeBlock code={`// vite.config.ts\nrichI18n({ locales: ['en-US', 'en-GB', 'pt-BR', 'zh-CN', 'zh-TW'] })\n\n// src/lib/i18n/messages.ts\ndefineMessages({\n  'en-US': { 'currency.symbol': '$' },\n  'en-GB': { 'currency.symbol': '£' },\n  'pt-BR': { 'greeting': 'Olá' }\n});`} lang="ts" />
			</div>
			<div class="mt-4 space-y-2">
				<p class="text-sm font-medium text-zinc-700">{t('bcp.built_in')}</p>
				<div class="overflow-hidden rounded-lg border border-zinc-200">
					<Table>
						<TableBody>
						<TableRow>
							<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">en-US</TableCell>
							<TableCell class="text-sm text-zinc-600">English (US)</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">en-GB</TableCell>
							<TableCell class="text-sm text-zinc-600">English (UK)</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">en-AU</TableCell>
							<TableCell class="text-sm text-zinc-600">English (Australia)</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">en-CA</TableCell>
							<TableCell class="text-sm text-zinc-600">English (Canada)</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">fr-FR / fr-CA / fr-BE / fr-CH</TableCell>
							<TableCell class="text-sm text-zinc-600">French variants</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">de-DE / de-AT / de-CH</TableCell>
							<TableCell class="text-sm text-zinc-600">German variants</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">es-ES / es-MX / es-AR / es-CO</TableCell>
							<TableCell class="text-sm text-zinc-600">Spanish variants</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">pt-PT / pt-BR</TableCell>
							<TableCell class="text-sm text-zinc-600">Portuguese variants</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">zh-CN / zh-TW / zh-HK</TableCell>
							<TableCell class="text-sm text-zinc-600">Chinese variants</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">ar-SA / ar-EG</TableCell>
							<TableCell class="text-sm text-zinc-600">Arabic variants (RTL)</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">nl-NL / nl-BE</TableCell>
							<TableCell class="text-sm text-zinc-600">Dutch variants</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">it-IT / it-CH</TableCell>
							<TableCell class="text-sm text-zinc-600">Italian variants</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">sv-SE / nb-NO / nn-NO / fi-FI / da-DK</TableCell>
							<TableCell class="text-sm text-zinc-600">Nordic</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">ru-RU / uk-UA / pl-PL</TableCell>
							<TableCell class="text-sm text-zinc-600">Eastern European</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">ja-JP / ko-KR / hi-IN</TableCell>
							<TableCell class="text-sm text-zinc-600">Asian</TableCell>
						</TableRow>
					</TableBody>
				</Table>
				</div>
			</div>
			<div class="mt-4 space-y-2">
				<p class="text-sm font-medium text-zinc-700">{t('bcp.utilities')}</p>
				<p class="text-xs text-zinc-600">{t('bcp.utilities_desc')}</p>
				<CodeBlock code={`import { getBaseLocale, normalizeLocale, getLocaleDir, getLocaleName } from 'svelte-locale';\n\ngetBaseLocale('en-US')      // → 'en'\nnormalizeLocale('pt-br')    // → 'pt-BR'\ngetLocaleDir('ar-SA')       // → 'rtl'\ngetLocaleDir('ar-DZ')       // → 'rtl'  (falls back to 'ar')\ngetLocaleName('pt-BR')      // → 'Português (Brasil)'`} lang="ts" />
			</div>
			<div class="mt-4 space-y-2">
				<p class="text-sm font-medium text-zinc-700">{t('bcp.accept_lang')}</p>
				<p class="text-xs text-zinc-600">{t('bcp.accept_lang_desc')}</p>
				<CodeBlock code={`// Accept-Language: pt-BR, pt;q=0.9, en;q=0.8\n// → resolves to pt-BR if configured, then pt, then en\n// Works automatically — no extra configuration needed.`} lang="ts" />
			</div>
		</section>

		<section id="syntax" class="space-y-6 {highlightedSection === 'syntax' ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg p-4 transition-all duration-300' : ''}">
			<div>
				<h2 class="mb-1 text-xl font-semibold">{t('syntax.title')}</h2>
				<p class="text-sm text-zinc-500">{t('syntax.desc')}</p>
			</div>

			<div class="space-y-6">
				<div>
					<h3 class="mb-2 text-sm font-medium text-zinc-700">Inline i18n in HTML</h3>
					<CodeBlock code={inlineI18nCode} lang="svelte" />
				</div>

				<div>
					<h3 class="mb-2 text-sm font-medium text-zinc-700">String interpolation</h3>
					<CodeBlock code={interpolationCode} lang="ts" />
				</div>

				<div>
					<h3 class="mb-2 text-sm font-medium text-zinc-700">Plural rules</h3>
					<CodeBlock code={pluralCode} lang="ts" />
				</div>

				<div>
					<h3 class="mb-2 text-sm font-medium text-zinc-700">Locale switching</h3>
					<CodeBlock code={localeSwitchCode} lang="ts" />
				</div>

				<div>
					<h3 class="mb-2 text-sm font-medium text-zinc-700">Rich text / components</h3>
					<p class="mb-3 text-sm text-zinc-600">Renders only the content block matching the active locale. All other locale blocks are stripped at compile time by the Vite plugin — only one snippet ever hits the DOM.</p>
					<CodeBlock code={richTextCode} lang="svelte" />
					<p class="mt-3 text-xs text-zinc-600">Each direct child must have a lang attribute matching a configured locale. Any valid Svelte content is allowed inside — components, {'{#if}'}, {'{#each}'}, slots, etc.</p>
					<p class="mt-2 text-xs text-zinc-600">The Vite plugin (richI18n) transforms the children into proper Svelte snippets at compile time. Missing or duplicate lang values produce warnings during development.</p>
					<p class="mt-2 text-xs text-zinc-600">Other libraries typically use {'{@html}'} for rich text, which can be less safe and less type-safe.</p>
				</div>
			</div>
		</section>

		<section id="manual" class="space-y-6 {highlightedSection === 'manual' ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg p-4 transition-all duration-300' : ''}">
			<div>
				<h2 class="mb-1 text-xl font-semibold">{t('manual.title')}</h2>
				<p class="text-sm text-zinc-500">{t('manual.desc')}</p>
			</div>

			<div>
				<p class="mb-1 text-sm font-medium text-zinc-700">0. {t('manual.step0')}</p>
				<CodeBlock code="npm install svelte-locale" lang="bash" />
			</div>

			<div>
				<p class="mb-1 text-sm font-medium text-zinc-700">1. {t('manual.step1')}</p>
				<p class="mb-2 text-xs text-zinc-600">{t('manual.step1_desc')}</p>
				<CodeBlock code={viteCode} lang="ts" filename="vite.config.ts" />
			</div>

			<div>
				<p class="mb-1 text-sm font-medium text-zinc-700">2. {t('manual.step2')}</p>
				<p class="mb-2 text-xs text-zinc-600">{t('manual.step2_desc')}</p>
				<CodeBlock code={appHtmlCode} lang="html" filename="src/app.html" />
			</div>

			<div>
				<p class="mb-1 text-sm font-medium text-zinc-700">3. {t('manual.step3')}</p>
				<p class="mb-2 text-xs text-zinc-600">{t('manual.step3_desc')}</p>
				<CodeBlock code={appDtsCode} lang="ts" filename="src/app.d.ts" />
			</div>

			<div>
				<p class="mb-1 text-sm font-medium text-zinc-700">4. {t('manual.step4')}</p>
				<p class="mb-2 text-xs text-zinc-600">{t('manual.step4_desc')}</p>
				<CodeBlock code={hooksCode} lang="ts" filename="src/hooks.server.ts" />
			</div>

			<div>
				<p class="mb-1 text-sm font-medium text-zinc-700">5. {t('manual.step5')}</p>
				<p class="mb-2 text-xs text-zinc-600">{t('manual.step5_desc')}</p>
				<div class="space-y-4">
					<CodeBlock code={layoutServerCode} lang="ts" filename="+layout.server.ts" route="src/routes/+layout.server.ts" />
					<CodeBlock code={layoutTsCode} lang="ts" filename="+layout.ts" route="src/routes/+layout.ts" />
					<CodeBlock code={layoutSvelteCode} lang="svelte" filename="+layout.svelte" route="src/routes/+layout.svelte" />
				</div>
			</div>
		</section>

		<section id="config" class="space-y-4 {highlightedSection === 'config' ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg p-4 transition-all duration-300' : ''}">
			<div>
				<h2 class="mb-1 text-xl font-semibold">{t('config.title')}</h2>
				<p class="text-sm text-zinc-500">{t('config.desc')}</p>
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
								<TableCell class="w-72 align-top font-mono text-xs font-medium text-zinc-800">{row.key}</TableCell>
								<TableCell class="text-sm text-zinc-600">{row.desc}</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</div>
		</section>

		<section id="routing" class="space-y-4 {highlightedSection === 'routing' ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg p-4 transition-all duration-300' : ''}">
			<div>
				<h2 class="mb-1 text-xl font-semibold">{t('routing.title')}</h2>
				<p class="text-sm text-zinc-500">{t('routing.desc')}</p>
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

		<section id="api" class="space-y-4 {highlightedSection === 'api' ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg p-4 transition-all duration-300' : ''}">
			<h2 class="mb-6 text-xl font-semibold">{t('api.title')}</h2>
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
										<TableRow id={item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}>
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

			</div>

		<!-- Desktop sidebar: lang switcher + TOC -->
		<aside class="hidden lg:block lg:col-start-3 lg:col-end-4 pl-6 pt-1">
				<div class="sticky top-8 space-y-6 w-48">
					<Button
						variant="outline"
						size="sm"
						class="w-full justify-between"
						onclick={() => searchOpen = true}
					>
						<div class="flex items-center">
							<Search size={16} class="mr-2" />
							Search...
						</div>
						<Kbd>⌘K</Kbd>
					</Button>
					<Select type="single" value={locale} onValueChange={(val) => locale = val as import('svelte-locale').Locale}>
						<SelectTrigger class="w-full bg-white">
							{locale === 'en' ? 'English' : locale === 'sv' ? 'Svenska' : 'Language'}
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="en">English</SelectItem>
							<SelectItem value="sv">Svenska</SelectItem>
						</SelectContent>
					</Select>
					<nav>
				<p class="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">{t('toc.title')}</p>
				<ul class="space-y-2 text-sm">
					<li><a href="#install" class="text-zinc-600 hover:text-zinc-900 block">{t('toc.install')}</a></li>
					<li><a href="#compare" class="text-zinc-600 hover:text-zinc-900 block">{t('toc.compare')}</a></li>
					<li><a href="#t" class="text-zinc-600 hover:text-zinc-900 block">{t('toc.t')}</a></li>
					<li><a href="#plural" class="text-zinc-600 hover:text-zinc-900 block">{t('toc.plural')}</a></li>
					<li><a href="#fn" class="text-zinc-600 hover:text-zinc-900 block">{t('toc.fn')}</a></li>
					<li><a href="#format" class="text-zinc-600 hover:text-zinc-900 block">{t('toc.format')}</a></li>
					<li><a href="#i18n" class="text-zinc-600 hover:text-zinc-900 block">{t('toc.i18n')}</a></li>
					<li><a href="#components" class="text-zinc-600 hover:text-zinc-900 block">{t('toc.components')}</a></li>
					<li><a href="#bcp" class="text-zinc-600 hover:text-zinc-900 block">{t('toc.bcp')}</a></li>
					<li><a href="#syntax" class="text-zinc-600 hover:text-zinc-900 block">{t('toc.syntax')}</a></li>
					<li><a href="#manual" class="text-zinc-600 hover:text-zinc-900 block">{t('toc.manual')}</a></li>
					<li><a href="#api" class="text-zinc-600 hover:text-zinc-900 block">{t('toc.api')}</a></li>
						</ul>
					</nav>
				</div>
			</aside>

			<!-- Mobile TOC sheet trigger + lang switcher -->
			<Sheet open={tocOpen} onOpenChange={(open) => tocOpen = open}>
				<div class="lg:hidden fixed top-4 right-4 z-20 flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						class="p-2"
						onclick={() => searchOpen = true}
					>
						<Search size={16} />
					</Button>
					<Select type="single" value={locale} onValueChange={(val) => locale = val as import('svelte-locale').Locale}>
						<SelectTrigger class="w-[120px] bg-white">
							{locale === 'en' ? 'English' : locale === 'sv' ? 'Svenska' : 'Language'}
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="en">English</SelectItem>
							<SelectItem value="sv">Svenska</SelectItem>
						</SelectContent>
					</Select>
					<SheetTrigger class="p-2 rounded-lg border border-zinc-200 bg-white shadow-sm">
						<Menu size={20} />
					</SheetTrigger>
				</div>
				<SheetContent side="right" class="w-64">
					<div class="p-6">
					<p class="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">{t('toc.title')}</p>
					<ul class="space-y-3 text-sm">
						<li><a href="#install" class="text-zinc-600 hover:text-zinc-900 block" onclick={() => tocOpen = false}>{t('toc.install')}</a></li>
						<li><a href="#compare" class="text-zinc-600 hover:text-zinc-900 block" onclick={() => tocOpen = false}>{t('toc.compare')}</a></li>
						<li><a href="#t" class="text-zinc-600 hover:text-zinc-900 block" onclick={() => tocOpen = false}>{t('toc.t')}</a></li>
						<li><a href="#plural" class="text-zinc-600 hover:text-zinc-900 block" onclick={() => tocOpen = false}>{t('toc.plural')}</a></li>
						<li><a href="#fn" class="text-zinc-600 hover:text-zinc-900 block" onclick={() => tocOpen = false}>{t('toc.fn')}</a></li>
						<li><a href="#format" class="text-zinc-600 hover:text-zinc-900 block" onclick={() => tocOpen = false}>{t('toc.format')}</a></li>
						<li><a href="#i18n" class="text-zinc-600 hover:text-zinc-900 block" onclick={() => tocOpen = false}>{t('toc.i18n')}</a></li>
						<li><a href="#components" class="text-zinc-600 hover:text-zinc-900 block" onclick={() => tocOpen = false}>{t('toc.components')}</a></li>
						<li><a href="#bcp" class="text-zinc-600 hover:text-zinc-900 block" onclick={() => tocOpen = false}>{t('toc.bcp')}</a></li>
						<li><a href="#syntax" class="text-zinc-600 hover:text-zinc-900 block" onclick={() => tocOpen = false}>{t('toc.syntax')}</a></li>
						<li><a href="#manual" class="text-zinc-600 hover:text-zinc-900 block" onclick={() => tocOpen = false}>{t('toc.manual')}</a></li>
						<li><a href="#api" class="text-zinc-600 hover:text-zinc-900 block" onclick={() => tocOpen = false}>{t('toc.api')}</a></li>
					</ul>
					</div>
				</SheetContent>
			</Sheet>
	</main>

	<footer class="border-t border-zinc-100 py-8 text-center text-sm text-zinc-600">
		<p class="flex items-center justify-center gap-1 flex-wrap">
			{t('footer.built')}
			<Button variant="link" href="https://svelte.dev" target="_blank" rel="noopener noreferrer" class="h-auto p-0 text-sm text-zinc-600">Svelte</Button>
			·
			<Button variant="link" href="https://www.npmjs.com/package/svelte-locale" target="_blank" rel="noopener noreferrer" class="h-auto p-0 text-sm text-zinc-600">npm</Button>
			{t('footer.by')}
			<Button variant="link" href="https://vincentbarkman.com" target="_blank" rel="noopener noreferrer" class="h-auto p-0 text-sm text-zinc-600">Vincent A. Barkman</Button>
		</p>
	</footer>
</div>
