/** The four interactive hero demos. */
export type FeatureId = 'charts' | 'kanban' | 'automation' | 'trendlines';

export interface Feature {
	id: FeatureId;
	/** Chip label in the hero switcher. */
	name: string;
	/** Sub-label under the chip name. */
	note: string;
	/** Panel heading when this demo is active. */
	title: string;
	/** Panel hint line. */
	hint: string;
	/** Static readout shown for non-live demos. */
	readout: string;
}

export interface StoryStep {
	/** Left-column marker, e.g. "2018 — 2021" or "TapHR". */
	years: string;
	title: string;
	body: string;
	/** Big number/word shown in the sticky panel. */
	stat: string;
	statNote: string;
	/** key/value rows in the sticky panel. */
	facts: [string, string][];
	tags: string[];
	/** Demo this step can jump to, if any. */
	demo: FeatureId | null;
}

export type Difficulty = 1 | 2 | 3;

export interface Project {
	id: string;
	name: string;
	domain: string;
	/** Live embed/source URL. Empty string = deploy pending (slot). */
	src: string;
	href: string;
	difficulty: Difficulty;
	blurb: string;
	tags: string[];
}

export interface TechItem {
	label: string;
	note: string;
}

export interface TechGroup {
	name: string;
	items: TechItem[];
}

export interface EducationEntry {
	degree: string;
	place: string;
	years?: string;
}

export interface AboutFact {
	label: string;
	value: string;
}

export interface AboutStat {
	value: string;
	label: string;
}
