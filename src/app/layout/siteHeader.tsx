import { Moon, Sun } from 'lucide-react';
import { navItems } from '@/shared/config/nav';
import { siteConfig } from '@/shared/config/site';
import { useScrollProgress } from '@/shared/hooks/useScrollProgress';
import { useTheme } from '@/shared/hooks/useTheme';

export const SiteHeader = () => {
	const progress = useScrollProgress();
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === 'dark';

	return (
		<header
			className="glass-dense"
			style={{
				position: 'sticky',
				top: 0,
				zIndex: 50,
				display: 'flex',
				flexDirection: 'column',
				borderLeft: 'none',
				borderRight: 'none',
				borderTop: 'none',
				borderRadius: 0,
			}}
		>
			<div
				className="header-row"
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: '10px 16px',
					padding: '10px 24px',
				}}
			>
				<a
					href="#top"
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 10,
						font: 'var(--text-label)',
						letterSpacing: '-0.01em',
					}}
				>
					<span
						style={{
							width: 18,
							height: 18,
							borderRadius: 6,
							background: 'linear-gradient(135deg, var(--primary), var(--accent))',
						}}
					/>
					{siteConfig.name}
				</a>

				<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
					<nav className="site-nav" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
						{navItems.map((item) => (
							<a key={item.href} href={item.href} className="nav-link">
								{item.label}
							</a>
						))}
					</nav>
					<button
						type="button"
						onClick={toggleTheme}
						className="lift"
						aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: 34,
							height: 34,
							marginLeft: 4,
							borderRadius: 'var(--radius-md)',
							border: '1px solid var(--border)',
							background: 'transparent',
							color: 'var(--muted-foreground)',
						}}
					>
						{isDark ? <Sun size={16} /> : <Moon size={16} />}
					</button>
				</div>
			</div>

			<div style={{ height: 2, background: 'var(--border)' }}>
				<div
					style={{
						height: '100%',
						width: `${(progress * 100).toFixed(2)}%`,
						background: 'linear-gradient(90deg, var(--primary), var(--accent))',
					}}
				/>
			</div>
		</header>
	);
};
