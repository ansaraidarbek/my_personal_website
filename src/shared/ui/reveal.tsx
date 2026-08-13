import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

interface RevealProps {
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
	id?: string;
	/** Stagger, in ms (design cycles 0/60/120 by column). */
	delay?: number;
	as?: 'div' | 'section' | 'article';
}

const prefersReducedMotion = () =>
	typeof window !== 'undefined' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Fades + lifts its children into view the first time they intersect the
 * viewport. Reveals immediately under reduced-motion. Renders a real element so
 * it can double as a grid item (pass `style={{ gridColumn: ... }}`).
 */
export const Reveal = ({
	children,
	className,
	style,
	id,
	delay = 0,
	as: Tag = 'div',
}: RevealProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const [shown, setShown] = useState(false);

	useEffect(() => {
		if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
			setShown(true);
			return;
		}
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						setShown(true);
						io.unobserve(e.target);
					}
				});
			},
			{ rootMargin: '0px 0px -10% 0px', threshold: 0.06 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	return (
		<Tag
			ref={ref as never}
			id={id}
			className={className}
			style={{
				opacity: shown ? 1 : 0,
				transform: shown ? 'none' : 'translateY(18px)',
				transition:
					'opacity 620ms var(--ease-glass), transform 620ms var(--ease-glass)',
				transitionDelay: `${delay}ms`,
				...style,
			}}
		>
			{children}
		</Tag>
	);
};
