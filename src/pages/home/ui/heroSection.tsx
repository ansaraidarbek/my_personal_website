import { DemoPanel } from './demos/demoPanel';
import { features } from '@/shared/data/features';
import type { ChartLayout } from '@/shared/data/features';
import { siteConfig } from '@/shared/config/site';
import { useTypedText } from '@/shared/hooks/useTypedText';
import { useCopyEmail } from '@/shared/hooks/useCopyEmail';
import type { FeatureId } from '@/shared/types/content';

interface HeroSectionProps {
	feature: FeatureId;
	layout: ChartLayout;
	onSelectFeature: (id: FeatureId) => void;
	onLayout: (l: ChartLayout) => void;
}

export const HeroSection = ({ feature, layout, onSelectFeature, onLayout }: HeroSectionProps) => {
	const { text, caretOn } = useTypedText(siteConfig.typedRoles);
	const copyEmail = useCopyEmail();

	return (
		<section
			className="hero-grid"
			style={{
				padding: '44px 0 8px',
				display: 'grid',
				gridTemplateColumns: 'minmax(0,0.82fr) minmax(0,1.18fr)',
				gap: 34,
				alignItems: 'center',
				minHeight: 'min(720px, 84vh)',
			}}
		>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
					<div
						className="glass-subtle"
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							padding: '5px 11px',
							borderRadius: 'var(--radius-full)',
							font: 'var(--text-caption)',
							color: 'var(--muted-foreground)',
						}}
					>
						<span
							style={{
								width: 6,
								height: 6,
								borderRadius: 999,
								background: 'var(--success)',
								boxShadow: '0 0 0 4px color-mix(in oklab, var(--success) 22%, transparent)',
							}}
						/>
						{`${siteConfig.location.split(',')[0]} · ${siteConfig.timezone} · ${siteConfig.availability}`}
					</div>
					<h1
						className="hero-title"
						style={{
							margin: 0,
							font: 'var(--text-display)',
							fontSize: 'clamp(32px, 3.4vw, 44px)',
							lineHeight: 1.16,
							letterSpacing: '-0.035em',
							textWrap: 'pretty',
							maxWidth: '22ch',
							minHeight: '2.32em',
						}}
					>
						Hi, I&rsquo;m {siteConfig.name} — your next{' '}
						<span
							style={{
								background:
									'linear-gradient(100deg, var(--foreground) 4%, var(--primary) 52%, var(--accent) 96%)',
								WebkitBackgroundClip: 'text',
								backgroundClip: 'text',
								color: 'transparent',
							}}
						>
							{text}
						</span>
						<span
							style={{
								display: 'inline-block',
								width: 2,
								marginLeft: 1,
								background: 'var(--primary)',
								opacity: caretOn ? 1 : 0,
								height: '0.82em',
								verticalAlign: '-0.08em',
							}}
						/>
					</h1>
					<p
						style={{
							margin: 0,
							maxWidth: '52ch',
							font: '400 16.5px/1.6 var(--font-sans)',
							color: 'var(--muted-foreground)',
							textWrap: 'pretty',
						}}
					>
						{siteConfig.tagline} The four features below are the work I&rsquo;m hired for — all live.
						Pick one and stress-test it.
					</p>
				</div>
				<div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
					<button
						type="button"
						onClick={copyEmail}
						className="glass glass-sheen lift"
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 9,
							height: 'var(--control-md)',
							padding: '0 16px',
							borderRadius: 'var(--radius-lg)',
							color: 'var(--foreground)',
							font: 'var(--text-code-sm)',
							cursor: 'pointer',
						}}
					>
						{siteConfig.email}
						<span style={{ font: 'var(--text-micro)', color: 'var(--muted-foreground)' }}>copy</span>
					</button>
					<a
						href={siteConfig.telegram.url}
						target="_blank"
						rel="noopener"
						className="lift"
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							height: 'var(--control-md)',
							padding: '0 16px',
							borderRadius: 'var(--radius-lg)',
							background: 'var(--primary)',
							color: 'var(--primary-foreground)',
							font: 'var(--text-label)',
							boxShadow: 'var(--glow-primary)',
						}}
					>
						Telegram ↗
					</a>
				</div>
			</div>

			<div id="showcase" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
				<div className="feature-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
					{features.map((f) => {
						const on = feature === f.id;
						return (
							<button
								key={f.id}
								type="button"
								onClick={() => onSelectFeature(f.id)}
								className="glass lift"
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 8,
									height: 'var(--control-md)',
									padding: '0 16px',
									borderRadius: 'var(--radius-full)',
									cursor: 'pointer',
									color: 'var(--foreground)',
									font: 'var(--text-label)',
									whiteSpace: 'nowrap',
									background: on
										? 'color-mix(in oklab, var(--primary) 14%, transparent)'
										: 'var(--glass-bg)',
									borderColor: on
										? 'color-mix(in oklab, var(--primary) 55%, transparent)'
										: 'var(--glass-border)',
									transition: 'transform 180ms var(--ease-glass), background 180ms var(--ease-glass)',
								}}
							>
								<span
									style={{
										width: 6,
										height: 6,
										borderRadius: 999,
										background: on ? 'var(--primary)' : 'var(--muted-foreground)',
									}}
								/>
								{f.name}
							</button>
						);
					})}
				</div>
				<DemoPanel feature={feature} layout={layout} onLayout={onLayout} />
			</div>
		</section>
	);
};
