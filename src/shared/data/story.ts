import type { StoryStep } from '@/shared/types/content';

/** Scroll-driven career narrative shown in the Story section. */
export const story: StoryStep[] = [
	{
		years: '2018 — 2021',
		title: 'Computer science, and a year explaining pointers',
		body: 'A BSc at Nazarbayev University, a year tutoring C++, OOP and algorithmic thinking, and freelance client sites written in JavaScript. The habit of explaining things simply started here — and it is still how I write code.',
		stat: 'C++ first',
		statNote: 'Algorithms and OOP before frameworks. It is why my abstractions stay small.',
		facts: [
			['study', 'BSc Computer Science, Nazarbayev University'],
			['teach', 'A year of C++ and algorithms tutoring'],
			['build', 'Freelance responsive sites and an e-commerce SPA'],
		],
		tags: ['C++', 'JavaScript', 'HTML', 'CSS'],
		demo: null,
	},
	{
		years: 'ONLYOFFICE',
		title: 'Chart algorithms that 15M+ people run',
		body: 'Trendlines with Bézier smoothing, shipped to 15M+ users across 170+ countries within my first three months. Six new chart types built on a shared pre-calculation service. Sunburst rendering made 1.5× faster with an iterative path-seeking algorithm — and 50+ fidelity bugs closed chasing pixel parity with Excel.',
		stat: '15M+',
		statNote: 'People around the world who open a spreadsheet and use my charts in their everyday work.',
		facts: [
			['ship', 'Trendlines, Bézier smoothing, QUnit coverage'],
			['add', 'Histogram, waterfall, funnel, box & whisker, treemap, sunburst'],
			['speed', 'Sunburst 1.5× faster, memory cut'],
		],
		tags: ['JavaScript', 'React', 'Canvas', 'QUnit'],
		demo: 'charts',
	},
	{
		years: 'TapHR',
		title: 'A hiring platform, empty repository to production',
		body: 'One of two frontend engineers who took the product from pre-MVP to production — it now runs hiring for 150+ recruiters at Burger King, Glovo, Freedom and Documentolog. I owned the architecture: Feature-Sliced Design, a Material UI → Chakra migration without freezing features, full i18n, Storybook, a virtualized Kanban for 2,000+ candidates, a no-code automation canvas with 200+ node types, and the GitLab pipeline that tests all of it.',
		stat: '0 → 1',
		statNote: 'Architecture, permissions, performance and the CI that keeps them honest.',
		facts: [
			['own', 'Architecture, routing, permissions, state, performance'],
			['scale', '2,000+ candidates per board, no frame loss'],
			['test', 'Vitest, Playwright, screenshot diffs on every merge request'],
		],
		tags: ['React', 'Next.js', 'TypeScript', 'Chakra UI', 'WebSockets'],
		demo: 'kanban',
	},
	{
		years: 'Next',
		title: 'Your team, if the hard parts matter to you too',
		body: "A master's in data science finished alongside full-time work. What I bring is leverage: architecture that keeps shipping fast after year two, performance treated as product work, and mentoring that compounds. If that is what you are hiring for, we should talk.",
		stat: 'React',
		statNote: 'Specialised, not narrow: five years of production React on top of a systems background.',
		facts: [
			['study', 'MSc Data Science, Nazarbayev University'],
			['seek', 'Senior frontend, full-time, remote-friendly'],
			['bring', 'Architecture, performance, testing, mentoring'],
		],
		tags: ['React', 'TypeScript', 'Feature-Sliced Design'],
		demo: 'automation',
	},
];
