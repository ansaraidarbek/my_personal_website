import type { AboutFact, AboutStat } from '@/shared/types/content';

/** Heading + body for the large bio card in the About bento. */
export const aboutBio = {
	heading: 'Curious by default, builder by choice',
	paragraphs: [
		'What drives me is building products that are strong, unique, modular and independent — things that hold their shape as they grow and keep working without anyone hovering over them. I like owning an idea end to end: shaping it, shipping it, then watching real people lean on it.',
		'My curiosity is wide on purpose — frontend, DevOps, product management, machine learning, data analytics, psychology, human-computer interaction. The common thread is how people and systems behave, and how to build things they genuinely enjoy using. Off the clock: swimming, table tennis, games, business books, manga and a good series.',
	],
};

/** Two-column fact grid in the About bento. */
export const aboutFacts: AboutFact[] = [
	{ label: 'Core stack', value: 'React · Next.js · TypeScript' },
	{ label: 'Experience', value: '5 years · two products taken 0 → 1' },
	{ label: 'Strongest at', value: 'Architecture, performance, testing, design systems' },
	{ label: 'Team shape', value: 'Small teams · code review · mentoring' },
	{ label: 'Based in', value: 'Astana, Kazakhstan · UTC+5 · remote-friendly' },
	{ label: 'Open to', value: 'Senior frontend roles, full-time' },
];

/** Number tiles in the About bento. */
export const aboutStats: AboutStat[] = [
	{ value: '15M+', label: 'users of software I wrote production code for' },
	{ value: '150+', label: 'recruiters using the platform I built the frontend of' },
	{ value: '2,000+', label: 'rows on one board, virtualized, without frame drops' },
];
