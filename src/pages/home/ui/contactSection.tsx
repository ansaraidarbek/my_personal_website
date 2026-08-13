import { Reveal } from '@/shared/ui/reveal';
import { siteConfig } from '@/shared/config/site';
import { useClock } from '@/shared/hooks/useClock';

export const ContactSection = () => {
	const clock = useClock();

	return (
		<section id="contact" style={{ padding: '96px 0 0' }}>
			<Reveal>
				<div
					className="glass-strong"
					style={{
						borderRadius: 'var(--radius-glass)',
						padding: 'clamp(32px, 5vw, 60px)',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 20,
						textAlign: 'center',
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
						05 — Your turn
					</span>
					<h2
						style={{
							margin: 0,
							font: 'var(--text-display)',
							fontSize: 'clamp(34px, 4.4vw, 52px)',
							letterSpacing: '-0.035em',
							maxWidth: '20ch',
							textWrap: 'balance',
						}}
					>
						Hiring for a React team
					</h2>
					<p
						style={{
							margin: 0,
							maxWidth: '52ch',
							font: '400 17px/1.6 var(--font-sans)',
							color: 'var(--muted-foreground)',
							textWrap: 'pretty',
						}}
					>
						Send me the role — you&rsquo;ll get an honest read on fit, fast. Everything on this page
						is verifiable: live products, real numbers. Telegram is quickest; email works too.
					</p>
					<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
						<a
							href={siteConfig.telegram.url}
							target="_blank"
							rel="noopener"
							className="lift"
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								height: 'var(--control-lg)',
								padding: '0 22px',
								borderRadius: 'var(--radius-lg)',
								background: 'var(--primary)',
								color: 'var(--primary-foreground)',
								font: 'var(--text-label)',
								boxShadow: 'var(--glow-primary)',
							}}
						>
							Telegram · {siteConfig.telegram.handle}
						</a>
						<a
							href={`mailto:${siteConfig.email}`}
							className="glass lift"
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								height: 'var(--control-lg)',
								padding: '0 22px',
								borderRadius: 'var(--radius-lg)',
								color: 'var(--foreground)',
								font: 'var(--text-label)',
							}}
						>
							{siteConfig.email}
						</a>
					</div>
				</div>
			</Reveal>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 12,
					padding: '26px 4px 0',
					font: 'var(--text-caption)',
					color: 'var(--muted-foreground)',
				}}
			>
				<span>{clock}</span>
				<span>
					{siteConfig.name} · {siteConfig.role.toLowerCase()}
				</span>
			</div>
		</section>
	);
};
