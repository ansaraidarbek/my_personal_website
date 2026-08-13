import { SectionEyebrow } from '@/shared/ui/sectionEyebrow';
import { Reveal } from '@/shared/ui/reveal';
import { GlowCard } from '@/shared/ui/glowCard';
import { aboutBio, aboutFacts, aboutStats } from '@/shared/data/about';
import { siteConfig } from '@/shared/config/site';
import { useClock } from '@/shared/hooks/useClock';

const bodyStyle = {
	margin: 0,
	maxWidth: '64ch',
	font: '400 16px/1.65 var(--font-sans)',
	color: 'var(--muted-foreground)',
	textWrap: 'pretty' as const,
};

export const AboutSection = () => {
	const clock = useClock();

	return (
		<section id="about" style={{ padding: '96px 0 0' }}>
			<SectionEyebrow>02 — About me</SectionEyebrow>

			<div
				className="bento-grid"
				style={{ display: 'grid', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 18 }}
			>
				{/* Bio */}
				<Reveal style={{ gridColumn: 'span 4' }}>
					<GlowCard
						style={{
							height: '100%',
							borderRadius: 'var(--radius-glass)',
							padding: 28,
							display: 'flex',
							flexDirection: 'column',
							gap: 14,
						}}
					>
						<h2 style={{ margin: 0, font: 'var(--text-title)', letterSpacing: '-0.028em' }}>
							{aboutBio.heading}
						</h2>
						{aboutBio.paragraphs.map((p, i) => (
							<p key={i} style={bodyStyle}>
								{p}
							</p>
						))}
					</GlowCard>
				</Reveal>

				{/* Portrait */}
				<Reveal style={{ gridColumn: 'span 2', gridRow: 'span 2' }} delay={60}>
					<div
						className="glass"
						style={{
							height: '100%',
							borderRadius: 'var(--radius-glass)',
							padding: 10,
							display: 'flex',
							flexDirection: 'column',
							gap: 10,
							overflow: 'hidden',
						}}
					>
						<div
							style={{
								flex: 1,
								minHeight: 250,
								borderRadius: 'calc(var(--radius-glass) - 4px)',
								overflow: 'hidden',
								background: 'var(--muted)',
							}}
						>
							<img
								src={`${import.meta.env.BASE_URL}portrait.jpg`}
								alt={siteConfig.name}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									display: 'block',
									filter: 'saturate(0.95) contrast(1.02)',
								}}
							/>
						</div>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								gap: 8,
								padding: '2px 8px 8px',
							}}
						>
							<span style={{ font: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
								{siteConfig.name}
							</span>
							<span style={{ font: 'var(--text-code-sm)', color: 'var(--muted-foreground)' }}>{clock}</span>
						</div>
					</div>
				</Reveal>

				{/* Facts */}
				<Reveal style={{ gridColumn: 'span 4' }} delay={120}>
					<div
						className="glass"
						style={{
							height: '100%',
							borderRadius: 'var(--radius-glass)',
							padding: 28,
							display: 'grid',
							gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
							gap: '18px 26px',
						}}
					>
						{aboutFacts.map((f) => (
							<div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
								<span
									style={{
										font: 'var(--text-micro)',
										letterSpacing: '0.08em',
										textTransform: 'uppercase',
										color: 'var(--muted-foreground)',
									}}
								>
									{f.label}
								</span>
								<span style={{ font: 'var(--text-body)', fontSize: 15 }}>{f.value}</span>
							</div>
						))}
					</div>
				</Reveal>

				{/* Stats */}
				{aboutStats.map((stat, i) => (
					<Reveal key={stat.value} style={{ gridColumn: 'span 2' }} delay={(i % 3) * 60}>
						<GlowCard
							style={{
								height: '100%',
								borderRadius: 'var(--radius-glass)',
								padding: 24,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								gap: 10,
								minHeight: 140,
							}}
						>
							<span style={{ font: '600 40px/1 var(--font-mono)', letterSpacing: '-0.03em' }}>
								{stat.value}
							</span>
							<span style={{ font: 'var(--text-body)', color: 'var(--muted-foreground)' }}>
								{stat.label}
							</span>
						</GlowCard>
					</Reveal>
				))}
			</div>
		</section>
	);
};
