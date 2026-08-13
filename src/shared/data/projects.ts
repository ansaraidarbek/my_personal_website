import type { Project } from '@/shared/types/content';

/** Ordered set of tech/topic filters shown above the projects grid. */
export const projectFilters = [
	'React',
	'TypeScript',
	'Next.js',
	'Zustand',
	'Supabase',
	'Clerk',
	'Auth0',
	'AI',
	'UI/UX',
] as const;

/** Shipped projects. An empty `src` marks a deploy-pending embed slot. */
export const projects: Project[] = [
	{
		id: 'support-desk',
		name: 'Support Desk',
		domain: 'ansaraidarbek.github.io/support_desk',
		src: 'https://ansaraidarbek.github.io/support_desk/',
		href: 'https://ansaraidarbek.github.io/support_desk/',
		difficulty: 3,
		blurb: 'Advanced filtering and search, virtualized lists, drag-and-drop, canvas pan and zoom, a library-free node editor and survey builder — on Feature-Sliced Design with strict TypeScript.',
		tags: ['React', 'TypeScript', 'Zustand', 'TanStack Query', 'UI/UX'],
	},
	{
		id: 'hirequill',
		name: 'HireQuill',
		domain: 'hirequill.dev',
		src: 'https://hirequill.dev',
		href: 'https://hirequill.dev',
		difficulty: 3,
		blurb: 'An AI cover-letter generator: a CV, a company name and a job description in, a tailored letter out in under 20 seconds.',
		tags: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Clerk', 'AI'],
	},
	{
		id: 'newlang',
		name: 'newLang',
		domain: 'ansaraidarbek.github.io/newLangApp',
		src: 'https://ansaraidarbek.github.io/newLangApp/',
		href: 'https://ansaraidarbek.github.io/newLangApp/',
		difficulty: 2,
		blurb: 'Spaced repetition on 3, 8 and 20-day intervals, built to hold vocabulary in long-term memory.',
		tags: ['React', 'Python', 'UI/UX'],
	},
	{
		id: '2048',
		name: '2048',
		domain: 'ansaraidarbek.github.io/game_2048',
		src: 'https://ansaraidarbek.github.io/game_2048/',
		href: 'https://ansaraidarbek.github.io/game_2048/',
		difficulty: 1,
		blurb: 'The puzzle rebuilt from scratch: direct DOM manipulation, touch gestures, localStorage scores and CSS-variable theming.',
		tags: ['JavaScript', 'UI/UX'],
	},
];
