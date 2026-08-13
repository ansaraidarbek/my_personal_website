import { useMemo, useState } from 'react';
import { SectionEyebrow } from '@/shared/ui/sectionEyebrow';
import { Badge } from '@/shared/ui/badge';
import { projectFilters, projects } from '@/shared/data/projects';
import type { Difficulty, Project } from '@/shared/types/content';

const stars = (d: Difficulty) => '★'.repeat(d) + '☆'.repeat(3 - d);

const chipStyle = (on: boolean) =>
	({
		display: 'inline-flex',
		alignItems: 'center',
		gap: 6,
		height: 28,
		padding: '0 12px',
		borderRadius: 'var(--radius-full)',
		cursor: 'pointer',
		font: 'var(--text-caption)',
		border: `1px solid ${on ? 'color-mix(in oklab, var(--primary) 55%, transparent)' : 'var(--border)'}`,
		background: on ? 'color-mix(in oklab, var(--primary) 22%, transparent)' : 'transparent',
		color: on ? 'var(--foreground)' : 'var(--muted-foreground)',
		transition: 'transform 140ms var(--ease-glass), background 140ms var(--ease-glass)',
	}) as const;

const groupLabelStyle = {
	font: 'var(--text-micro)',
	letterSpacing: '0.08em',
	textTransform: 'uppercase',
	color: 'var(--muted-foreground)',
	minWidth: 64,
} as const;

const ProjectCard = ({ p }: { p: Project }) => {
	const [active, setActive] = useState(false);
	const hasEmbed = !!p.src;
	const linksOut = !hasEmbed && !!p.href;

	return (
		<div
			className="glass"
			style={{
				gridColumn: 'span 2',
				borderRadius: 'var(--radius-glass)',
				padding: 16,
				display: 'flex',
				flexDirection: 'column',
				gap: 12,
			}}
		>
			<div
				className="glass-subtle"
				style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 6,
						padding: '7px 10px',
						borderBottom: '1px solid var(--border)',
					}}
				>
					{[0, 1, 2].map((i) => (
						<span
							key={i}
							style={{
								width: 7,
								height: 7,
								borderRadius: 999,
								background: 'var(--muted-foreground)',
								opacity: 0.4,
							}}
						/>
					))}
					<span
						style={{
							marginLeft: 4,
							font: 'var(--text-code-sm)',
							color: 'var(--muted-foreground)',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{hasEmbed || linksOut ? p.domain : 'deploy pending'}
					</span>
				</div>
				<div style={{ position: 'relative', height: 196, background: 'var(--muted)', overflow: 'hidden' }}>
					{hasEmbed && (
						<iframe
							src={p.src}
							title={p.name}
							loading="lazy"
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: 1440,
								height: 900,
								border: 0,
								transform: 'scale(0.245)',
								transformOrigin: 'top left',
							}}
						/>
					)}
					{!(active && hasEmbed) && (
						<button
							type="button"
							onClick={() => {
								if (linksOut) window.open(p.href, '_blank', 'noopener');
								else setActive(true);
							}}
							style={{
								position: 'absolute',
								inset: 0,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 4,
								border: 0,
								cursor: 'pointer',
								background:
									'linear-gradient(to top, color-mix(in oklab, var(--background) 78%, transparent), color-mix(in oklab, var(--background) 20%, transparent))',
								font: 'var(--text-label)',
								color: 'var(--foreground)',
							}}
						>
							<span>
								{hasEmbed ? 'Click to interact' : linksOut ? 'Open live ↗' : 'Live embed slot'}
							</span>
							<span style={{ font: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
								{hasEmbed
									? 'loads the real product'
									: linksOut
										? 'the site does not allow embedding'
										: 'add the deployed URL'}
							</span>
						</button>
					)}
				</div>
			</div>
			<div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
				<h3 style={{ margin: 0, font: 'var(--text-title)', fontSize: 20, letterSpacing: '-0.028em' }}>
					{p.name}
				</h3>
				<span style={{ font: 'var(--text-code-sm)', color: 'var(--primary)', letterSpacing: '0.08em' }}>
					{stars(p.difficulty)}
				</span>
			</div>
			<p style={{ margin: 0, font: 'var(--text-body)', fontSize: 14, lineHeight: 1.55, color: 'var(--muted-foreground)' }}>
				{p.blurb}
			</p>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
				{p.tags.map((tag) => (
					<Badge key={tag}>{tag}</Badge>
				))}
			</div>
			{!!p.href && (
				<a
					href={p.href}
					target="_blank"
					rel="noopener"
					style={{ font: 'var(--text-label)', color: 'var(--primary)' }}
				>
					Open live ↗
				</a>
			)}
		</div>
	);
};

export const ProjectsSection = () => {
	const [filters, setFilters] = useState<string[]>([]);
	const [starsFilter, setStarsFilter] = useState<Difficulty | null>(null);

	const toggleFilter = (name: string) =>
		setFilters((f) => (f.includes(name) ? f.filter((x) => x !== name) : f.concat(name)));
	const toggleStars = (n: Difficulty) => setStarsFilter((s) => (s === n ? null : n));
	const clear = () => {
		setFilters([]);
		setStarsFilter(null);
	};

	const shown = useMemo(
		() =>
			projects.filter(
				(p) =>
					filters.every((t) => p.tags.includes(t)) &&
					(starsFilter === null || p.difficulty === starsFilter),
			),
		[filters, starsFilter],
	);

	const hasActive = filters.length > 0 || starsFilter !== null;

	return (
		<section id="projects" style={{ padding: '96px 0 0' }}>
			<SectionEyebrow marginBottom={10}>03 — Shipped projects</SectionEyebrow>
			<p style={{ margin: '0 0 18px', maxWidth: '62ch', font: 'var(--text-body)', fontSize: 15, color: 'var(--muted-foreground)' }}>
				No screenshots — each card embeds the running product. Filter by what it is built with, or
				by how hard it was to build.
			</p>

			<div
				className="glass-subtle"
				style={{
					borderRadius: 'var(--radius-glass)',
					padding: '16px 18px',
					display: 'flex',
					flexDirection: 'column',
					gap: 14,
					marginBottom: 18,
				}}
			>
				<div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
					<span style={groupLabelStyle}>Built with</span>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
						{projectFilters.map((name) => {
							const on = filters.includes(name);
							const count = projects.filter(
								(p) =>
									p.tags.includes(name) && (starsFilter === null || p.difficulty === starsFilter),
							).length;
							return (
								<button
									key={name}
									type="button"
									onClick={() => toggleFilter(name)}
									className="lift"
									style={{ ...chipStyle(on), opacity: count === 0 && !on ? 0.4 : 1 }}
								>
									{name}
									<span style={{ font: 'var(--text-code-sm)', opacity: 0.7 }}>{count}</span>
								</button>
							);
						})}
					</div>
				</div>
				<div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
					<span style={groupLabelStyle}>Difficulty</span>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
						{([1, 2, 3] as Difficulty[]).map((n) => (
							<button key={n} type="button" onClick={() => toggleStars(n)} className="lift" style={chipStyle(starsFilter === n)}>
								{stars(n)}
							</button>
						))}
					</div>
					<div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
						<span style={{ font: 'var(--text-code-sm)', color: 'var(--muted-foreground)' }}>
							{shown.length} of {projects.length} projects
						</span>
						{hasActive && (
							<button
								type="button"
								onClick={clear}
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									height: 28,
									padding: '0 12px',
									borderRadius: 'var(--radius-full)',
									border: '1px solid var(--border)',
									background: 'transparent',
									color: 'var(--muted-foreground)',
									font: 'var(--text-caption)',
									cursor: 'pointer',
								}}
							>
								Clear
							</button>
						)}
					</div>
				</div>
			</div>

			<div
				className="projects-grid"
				style={{ display: 'grid', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 18, alignItems: 'start' }}
			>
				{shown.map((p) => (
					<ProjectCard key={p.id} p={p} />
				))}
			</div>
			{shown.length === 0 && (
				<div
					className="glass-subtle"
					style={{
						borderRadius: 'var(--radius-glass)',
						padding: 40,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 8,
						textAlign: 'center',
					}}
				>
					<span style={{ font: 'var(--text-heading)' }}>No project matches those filters</span>
					<span style={{ font: 'var(--text-body)', color: 'var(--muted-foreground)' }}>
						Clear one of them to see the rest.
					</span>
				</div>
			)}
		</section>
	);
};
