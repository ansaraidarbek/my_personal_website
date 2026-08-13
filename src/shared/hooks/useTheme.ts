import { useCallback, useSyncExternalStore } from 'react';

const THEME_KEY = 'my_personal_website:ui:theme';

export type Theme = 'light' | 'dark';

/** Dark is the design's default; a stored preference wins over it. */
const readInitial = (): Theme => {
	if (typeof window === 'undefined') return 'dark';
	const stored = window.localStorage.getItem(THEME_KEY);
	return stored === 'light' ? 'light' : 'dark';
};

let currentTheme: Theme = readInitial();

const listeners = new Set<() => void>();

const applyTheme = (theme: Theme) => {
	document.documentElement.classList.toggle('dark', theme === 'dark');
};

applyTheme(currentTheme);

const setTheme = (theme: Theme) => {
	currentTheme = theme;
	window.localStorage.setItem(THEME_KEY, theme);
	applyTheme(theme);
	listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
	listeners.add(listener);
	return () => listeners.delete(listener);
};

export const toggleThemeGlobal = () => setTheme(currentTheme === 'dark' ? 'light' : 'dark');

export const useTheme = () => {
	const theme = useSyncExternalStore(subscribe, () => currentTheme);
	const toggleTheme = useCallback(() => toggleThemeGlobal(), []);
	return { theme, toggleTheme };
};
