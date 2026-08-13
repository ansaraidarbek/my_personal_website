import { SectionEyebrow } from '@/shared/ui/sectionEyebrow';
import { Reveal } from '@/shared/ui/reveal';
import { Badge } from '@/shared/ui/badge';
import { education, techGroups } from '@/shared/data/tech';
import { toast } from '@/shared/ui/toast';

export const StackSection = () => (
	<section id="stack" style={{ padding: '96px 0 0' }}>
		<SectionEyebrow marginBottom={10}>04 — Tools and schooling</SectionEyebrow>
		<p style={{ margin: '0 0 22px', maxWidth: '62ch', font: 'var(--text-body)', fontSize: 15, color: 'var(--muted-foreground)' }}>
			Click any tool to see where it was used in production.
		</p>
		<div
			className="bento-grid"
			style={{ display: 'grid', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 18, alignItems: 'start' }}
		>
			<Reveal style={{ gridColumn: 'span 4' }}>
				<div
					className="glass"
					style={{
						borderRadius: 'var(--radius-glass)',
						padding: 26,
						display: 'flex',
						flexDirection: 'column',
						gap: 22,
					}}
				>
					{techGroups.map((group) => (
						<div key={group.name} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
							<span
								style={{
									font: 'var(--text-eyebrow)',
									letterSpacing: 'var(--tracking-eyebrow)',
									textTransform: 'uppercase',
									color: 'var(--muted-foreground)',
								}}
							>
								{group.name}
							</span>
							<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
								{group.items.map((item) => (
									<button
										key={item.label}
										type="button"
										onClick={() => toast(item.label, item.note)}
										className="lift"
										style={{
											display: 'inline-flex',
											padding: 0,
											border: 0,
											background: 'transparent',
											cursor: 'pointer',
											borderRadius: 'var(--radius-full)',
										}}
									>
										<Badge tone={item.label === 'React' ? 'default' : 'neutral'}>{item.label}</Badge>
									</button>
								))}
							</div>
						</div>
					))}
				</div>
			</Reveal>

			<Reveal style={{ gridColumn: 'span 2' }} delay={60}>
				<div
					className="glass"
					style={{
						borderRadius: 'var(--radius-glass)',
						padding: 26,
						display: 'flex',
						flexDirection: 'column',
						gap: 20,
					}}
				>
					<span
						style={{
							font: 'var(--text-eyebrow)',
							letterSpacing: 'var(--tracking-eyebrow)',
							textTransform: 'uppercase',
							color: 'var(--muted-foreground)',
						}}
					>
						Education
					</span>
					{education.map((e) => (
						<div key={e.degree} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
							<span style={{ font: 'var(--text-heading)' }}>{e.degree}</span>
							<span style={{ font: 'var(--text-body)', color: 'var(--muted-foreground)' }}>{e.place}</span>
							{e.years && (
								<span style={{ font: 'var(--text-code-sm)', color: 'var(--muted-foreground)' }}>{e.years}</span>
							)}
						</div>
					))}
				</div>
			</Reveal>
		</div>
	</section>
);
