import type { TechGroup, EducationEntry } from '@/shared/types/content';

/** Grouped tech list for the Stack section. Clicking an item toasts its note. */
export const techGroups: TechGroup[] = [
	{
		name: 'Languages',
		items: [
			{ label: 'JavaScript', note: 'Three years inside the ONLYOFFICE chart engine — trendlines, six chart types, Bézier smoothing and QUnit suites.' },
			{ label: 'TypeScript', note: 'Strict TypeScript across the TapHR product and Support Desk. Types carry the contracts that tests would otherwise have to.' },
			{ label: 'Python', note: 'Research assistant work on CNN optimization, and the backend behind newLang.' },
			{ label: 'C++', note: 'Tutored OOP and algorithms for a year, and used the same thinking for the iterative path-seeking algorithm that sped sunburst up 1.5×.' },
			{ label: 'HTML', note: 'Freelance responsive client sites before frameworks; still the layer everything else compiles down to.' },
			{ label: 'CSS', note: 'Design-system work at TapHR: theming, dark mode, layout that survives translation into other languages.' },
		],
	},
	{
		name: 'Frameworks and tools',
		items: [
			{ label: 'React', note: 'The specialisation. Five years of production React: TapHR from pre-MVP to 150+ recruiters, plus every project on this page.' },
			{ label: 'Next.js', note: 'Career-site rendering at TapHR and HireQuill end to end — routing, server actions, auth.' },
			{ label: 'Tailwind', note: 'Support Desk and HireQuill UI layers, paired with shadcn/ui primitives.' },
			{ label: 'Material UI', note: 'The original TapHR component layer, later migrated away from without freezing feature work.' },
			{ label: 'Chakra UI', note: 'Migrated the whole TapHR product onto Chakra and rebuilt the theme and component set around it.' },
			{ label: 'TanStack Query', note: 'Server state for TapHR and Support Desk: caching, pagination, optimistic updates on every mutation.' },
			{ label: 'Zustand', note: 'Client state at TapHR — board filters, drawer state, permissions — kept out of the server cache.' },
			{ label: 'Redux', note: 'Earlier product work; the reason I now keep global state small and explicit.' },
			{ label: 'Jotai', note: 'Atom-level state for isolated widgets where a store would be too much machinery.' },
			{ label: 'SCSS', note: 'Legacy styling layers maintained and migrated during the Chakra move.' },
			{ label: 'Storybook', note: 'Component catalogue for the TapHR design system, used for review and visual regression.' },
			{ label: 'Vitest', note: 'Unit and component tests in the TapHR GitLab pipeline, run on every merge request.' },
			{ label: 'Playwright', note: 'End-to-end coverage of hiring flows, plus Chromium screenshot tests for visual diffs.' },
			{ label: 'Jest', note: 'Test suites on earlier React codebases before the move to Vitest.' },
			{ label: 'Recharts', note: 'Analytics dashboards for recruiters and hiring managers at TapHR.' },
			{ label: 'WebSockets', note: 'Real-time Kanban updates, status changes and messaging across the TapHR product.' },
			{ label: 'i18next', note: 'Full internationalization of TapHR for multi-language hiring teams.' },
			{ label: 'PostHog', note: 'Instrumented user journeys to make UX decisions from data instead of opinion.' },
			{ label: 'GitLab CI/CD', note: 'Built the pipeline: tests, freshness checks, auto-generated merge-request summaries, Jira and Slack validation.' },
			{ label: 'Django', note: 'Backend work on smaller full-stack projects.' },
			{ label: 'shadcn/ui', note: 'Primitive layer for Support Desk and HireQuill.' },
			{ label: 'LiveKit', note: 'Real-time audio and video experiments for interview flows.' },
			{ label: 'Auth0', note: 'Authentication and role handling on side projects.' },
		],
	},
	{
		name: 'Concepts',
		items: [
			{ label: 'Feature-Sliced Design', note: 'Re-architected the TapHR frontend onto FSD, which cut the cost of onboarding a new feature — and a new engineer.' },
			{ label: 'Performance', note: 'Virtualized a Kanban board to 2,000+ candidates with no frame loss, and made sunburst rendering 1.5× faster.' },
			{ label: 'REST APIs', note: 'Every product here talks to one; contract-first, with typed clients.' },
			{ label: 'Algorithms', note: 'Bézier smoothing, stack-based path seeking, label collision on chart axes.' },
			{ label: 'Unit testing', note: 'Vitest, QUnit and Jest suites written alongside features, not after them.' },
			{ label: 'Web security', note: 'Permissions, roles and route guards across a multi-tenant hiring product.' },
			{ label: 'WebRTC', note: 'Real-time media experiments alongside LiveKit.' },
			{ label: 'Agile', note: 'Two-week cycles with Jira automation wired into the merge-request pipeline.' },
			{ label: 'Machine learning', note: 'MSc in data science; CNN optimization research and AI-checked assessment flows at TapHR.' },
		],
	},
];

/** Education entries shown beside the stack. */
export const education: EducationEntry[] = [
	{ degree: 'MSc, Data Science', place: 'Nazarbayev University', years: '2022 — 2024' },
	{ degree: 'BSc, Computer Science', place: 'Nazarbayev University', years: '2018 — 2022' },
	{ degree: 'Front-end React course', place: 'Just Code Academy' },
];
