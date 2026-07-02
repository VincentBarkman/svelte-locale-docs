import { createHighlighter, type Highlighter } from 'shiki';

const LANGS = ['typescript', 'svelte', 'html', 'shellscript'] as const;

let instance: Highlighter | null = null;
let pending: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
	if (instance) return Promise.resolve(instance);
	if (pending) return pending;
	pending = createHighlighter({ themes: ['github-light'], langs: [...LANGS] }).then((h) => {
		instance = h;
		return h;
	});
	return pending;
}

export const LANG_MAP: Record<string, string> = {
	ts: 'typescript',
	svelte: 'svelte',
	html: 'html',
	bash: 'shellscript',
};
