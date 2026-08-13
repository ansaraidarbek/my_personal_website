import { SectionEyebrow } from '@/shared/ui/sectionEyebrow';
import { Badge } from '@/shared/ui/badge';
import { story } from '@/shared/data/story';
import { useActiveStep } from '@/shared/hooks/useActiveStep';
import type { FeatureId } from '@/shared/types/content';

const demoLabel = (demo: FeatureId) =>
	demo === 'charts'
		? 'Try the chart engine ↑'
		: demo === 'kanban'
			? 'Try the Kanban board ↑'
			: 'Try the automation canvas ↑';

export const StorySection = ({
	onSelectFeature,
}: {
	onSelectFeature: (id: FeatureId) => void;
}) => {
	const active = Math.min(useActiveStep(), story.length - 1);
	const s = story[active];

	return (
		<section id="story" style={{ padding: '96px 0 0' }}>
			<SectionEyebrow>01 — How I got here</SectionEyebrow>

			<div
				className="story-grid"
				style={{
					display: 'grid',
					gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
					gap: 48,
					alignItems: 'start',
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					{story.map((step, i) => (
						<div
							key={step.years}
							data-step={i}
							className="story-step"
							style={{
								minHeight: '66vh',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								gap: 14,
								padding: '24px 0',
								opacity: i === active ? 1 : 0.34,
								transition: 'opacity 420ms var(--ease-glass)',
							}}
						>
							<span style={{ font: 'var(--text-code-sm)', color: 'var(--primary)' }}>{step.years}</span>
							<h3 style={{ margin: 0, font: 'var(--text-title)', fontSize: 30, letterSpacing: '-0.03em' }}>
								{step.title}
							</h3>
							<p
								style={{
									margin: 0,
									maxWidth: '52ch',
									font: '400 16px/1.65 var(--font-sans)',
									color: 'var(--muted-foreground)',
									textWrap: 'pretty',
								}}
							>
								{step.body}
							</p>
							<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
								{step.tags.map((tag) => (
									<Badge key={tag}>{tag}</Badge>
								))}
							</div>
							{step.demo && (
								<a
									href="#showcase"
									onClick={() => onSelectFeature(step.demo as FeatureId)}
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										gap: 6,
										font: 'var(--text-label)',
										color: 'var(--primary)',
									}}
								>
									{demoLabel(step.demo)}
								</a>
							)}
						</div>
					))}
				</div>

				<div className="story-sticky" style={{ position: 'sticky', top: 112, height: '64vh', minHeight: 420 }}>
					<div
						className="glass-strong"
						style={{
							height: '100%',
							borderRadius: 'var(--radius-glass)',
							padding: 32,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
							gap: 20,
							overflow: 'hidden',
						}}
					>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
							<span
								style={{
									font: 'var(--text-eyebrow)',
									letterSpacing: 'var(--tracking-eyebrow)',
									textTransform: 'uppercase',
									color: 'var(--muted-foreground)',
								}}
							>
								{s.years}
							</span>
							<div style={{ display: 'flex', gap: 6 }}>
								{story.map((_, i) => (
									<span
										key={i}
										style={{
											width: 6,
											height: 6,
											borderRadius: 999,
											background: i === active ? 'var(--primary)' : 'var(--border)',
											transition: 'background 280ms var(--ease-glass)',
										}}
									/>
								))}
							</div>
						</div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
							<span
								style={{
									font: '600 clamp(44px,5vw,68px)/1 var(--font-sans)',
									letterSpacing: '-0.045em',
									background:
										'linear-gradient(100deg, var(--foreground) 10%, var(--primary) 70%, var(--accent) 100%)',
									WebkitBackgroundClip: 'text',
									backgroundClip: 'text',
									color: 'transparent',
								}}
							>
								{s.stat}
							</span>
							<span
								style={{
									font: '400 17px/1.6 var(--font-sans)',
									color: 'var(--muted-foreground)',
									maxWidth: '34ch',
									textWrap: 'pretty',
								}}
							>
								{s.statNote}
							</span>
						</div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
							{s.facts.map(([key, value]) => (
								<div key={key} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
									<span style={{ font: 'var(--text-code-sm)', color: 'var(--primary)', minWidth: 52 }}>
										{key}
									</span>
									<span style={{ font: 'var(--text-body)', fontSize: 14.5, color: 'var(--muted-foreground)' }}>
										{value}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
