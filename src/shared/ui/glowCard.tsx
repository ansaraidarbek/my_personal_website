import { useRef } from 'react';
import type { CSSProperties, PointerEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlowCardProps {
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
}

/**
 * A glass card with a pointer-tracked radial glow and a lift on hover — the
 * design's `data-glow` bento treatment. Never nest another glass layer inside.
 */
export const GlowCard = ({ children, className, style }: GlowCardProps) => {
	const layerRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);

	const onMove = (e: PointerEvent<HTMLDivElement>) => {
		const layer = layerRef.current;
		const card = cardRef.current;
		if (!layer || !card) return;
		const r = card.getBoundingClientRect();
		layer.style.background = `radial-gradient(340px circle at ${
			e.clientX - r.left
		}px ${
			e.clientY - r.top
		}px, color-mix(in oklab, var(--primary) 18%, transparent), transparent 72%)`;
	};

	const onEnter = () => {
		if (layerRef.current) layerRef.current.style.opacity = '1';
		if (cardRef.current) cardRef.current.style.boxShadow = 'var(--glass-shadow-lg)';
	};
	const onLeave = () => {
		if (layerRef.current) layerRef.current.style.opacity = '0';
		if (cardRef.current) cardRef.current.style.boxShadow = '';
	};

	return (
		<div
			ref={cardRef}
			className={cn('glass', className)}
			style={{
				position: 'relative',
				overflow: 'hidden',
				transition: 'box-shadow 220ms var(--ease-glass)',
				...style,
			}}
			onPointerMove={onMove}
			onPointerEnter={onEnter}
			onPointerLeave={onLeave}
		>
			<div
				ref={layerRef}
				style={{
					position: 'absolute',
					inset: 0,
					pointerEvents: 'none',
					opacity: 0,
					transition: 'opacity 220ms var(--ease-glass)',
				}}
			/>
			{children}
		</div>
	);
};
