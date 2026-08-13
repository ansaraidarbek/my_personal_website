import type { CSSProperties } from 'react';

// Painted ambient washes behind the whole app — three drifting, blurred
// colour blobs over the base background. Mirrors the design system's Backdrop.
const blob = (
	color: string,
	pos: CSSProperties,
	size: number,
	duration: number,
	delay: number,
): CSSProperties => ({
	position: 'absolute',
	width: `${size}vw`,
	height: `${size}vw`,
	borderRadius: '50%',
	background: `radial-gradient(circle at center, ${color}, transparent 62%)`,
	filter: 'blur(40px)',
	opacity: 0.9,
	animation: `backdrop-drift ${duration}s var(--ease-glass) ${delay}s infinite`,
	willChange: 'transform',
	...pos,
});

export const Backdrop = () => (
	<div
		aria-hidden
		style={{
			position: 'fixed',
			inset: 0,
			zIndex: -1,
			overflow: 'hidden',
			background: 'var(--background)',
			pointerEvents: 'none',
		}}
	>
		<div style={blob('var(--backdrop-1)', { top: '-14%', left: '-6%' }, 62, 26, 0)} />
		<div style={blob('var(--backdrop-2)', { top: '2%', right: '-12%' }, 58, 32, -6)} />
		<div style={blob('var(--backdrop-3)', { bottom: '-18%', left: '32%' }, 54, 30, -12)} />
	</div>
);
