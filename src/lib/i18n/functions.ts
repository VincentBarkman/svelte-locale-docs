import { defineFunctions, createFn } from 'svelte-locale';

export type AppFunctions = {};

defineFunctions({ en: {}, sv: {} });

export const fn = createFn<AppFunctions>();
