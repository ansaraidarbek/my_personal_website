import { lazy, Suspense, useEffect, useState } from 'react';
import { KanbanBoard } from './kanbanBoard';
import { NodeGraph } from './nodeGraph';
import { TrendLine } from './trendLine';
import { chartLayouts, features } from '@/shared/data/features';
import type { ChartLayout } from '@/shared/data/features';
import { useTheme } from '@/shared/hooks/useTheme';
import type { FeatureId } from '@/shared/types/content';

// Three.js is ~600 kB minified — keep it out of the initial bundle.
const HeroChart = lazy(() =>
	import('./heroChart').then((m) => ({ default: m.HeroChart })),
);

interface DemoPanelProps {
	feature: FeatureId;
	layout: ChartLayout;
	onLayout: (l: ChartLayout) => void;
}

/** The glass showcase panel in the hero — header, readout, chips, live demo. */
export const DemoPanel = ({ feature, layout, onLayout }: DemoPanelProps) => {
	const meta = features.find((f) => f.id === feature) ?? features[0];
	const [readout, setReadout] = useState('');
	// The WebGL chart samples --accent-hue once at mount; remount it when the
	// palette flips between light (ember) and dark (violet).
	const { theme } = useTheme();

	// Reset the dynamic readout when switching to a static demo.
	useEffect(() => {
		if (feature === 'charts' || feature === 'automation') setReadout(meta.readout);
		else setReadout('');
	}, [feature, meta.readout]);

	return (
		<div
			className="glass demo-panel"
			style={{
				borderRadius: 'var(--radius-glass)',
				padding: 16,
				display: 'flex',
				flexDirection: 'column',
				gap: 12,
				minHeight: 440,
			}}
		>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 12,
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<span style={{ font: 'var(--text-heading)', fontSize: 17 }}>{meta.title}</span>
					<span style={{ font: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
						{meta.hint}
					</span>
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					{feature !== 'charts' && (
						<span style={{ font: 'var(--text-code-sm)', color: 'var(--muted-foreground)' }}>
							{readout}
						</span>
					)}
					{feature === 'charts' && (
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
							{chartLayouts.map((name) => {
								const on = layout === name;
								return (
									<button
										key={name}
										type="button"
										onClick={() => onLayout(name)}
										className="glass-subtle lift"
										style={{
											height: 'var(--control-sm)',
											padding: '0 13px',
											borderRadius: 'var(--radius-full)',
											font: 'var(--text-caption)',
											textTransform: 'capitalize',
											background: on
												? 'color-mix(in oklab, var(--primary) 26%, transparent)'
												: 'transparent',
											color: on ? 'var(--foreground)' : 'var(--muted-foreground)',
											transition: 'transform 140ms var(--ease-glass)',
										}}
									>
										{name}
									</button>
								);
							})}
						</div>
					)}
				</div>
			</div>

			<div className="demo-stage" style={{ position: 'relative', flex: 1, minHeight: 390 }}>
				{/* Each demo sits in an absolute layer so it gets a definite height
				    (the kanban virtualizer depends on a bounded scroller). */}
				<div style={{ position: 'absolute', inset: 0 }}>
					{feature === 'charts' && (
						<Suspense fallback={null}>
							<HeroChart key={theme} layout={layout} />
						</Suspense>
					)}
					{feature === 'kanban' && <KanbanBoard count={1200} onReadout={setReadout} />}
					{feature === 'automation' && <NodeGraph />}
					{feature === 'trendlines' && <TrendLine onReadout={setReadout} />}
				</div>
			</div>
		</div>
	);
};
