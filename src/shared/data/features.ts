import type { Feature } from '@/shared/types/content';

/** The four interactive demos shown in the hero panel. */
export const features: Feature[] = [
	{
		id: 'charts',
		name: 'Chart engine',
		note: 'Four types, one morph',
		title: 'Chart types, morphing',
		hint: 'Toggle a type — the same data redraws',
		readout: 'ONLYOFFICE · 15M+ users',
	},
	{
		id: 'kanban',
		name: 'Virtualized Kanban',
		note: '1,200 cards, drag & drop',
		title: 'Kanban at scale',
		hint: 'Drag a card across columns; scroll a column',
		readout: 'counting…',
	},
	{
		id: 'automation',
		name: 'Automation builder',
		note: 'Nodes and live edges',
		title: 'No-code automation canvas',
		hint: 'Drag any node — edges follow',
		readout: 'TapHR · 200+ node types',
	},
	{
		id: 'trendlines',
		name: 'Trendline math',
		note: 'Bézier smoothing, live fit',
		title: 'Trendlines, by hand',
		hint: 'Drag any point — the fit updates',
		readout: 'R² —',
	},
];

/** Chart sub-types cycled by the chips when the chart demo is active. */
export const chartLayouts = ['sunburst', 'treemap', 'waterfall', 'funnel'] as const;
export type ChartLayout = (typeof chartLayouts)[number];
