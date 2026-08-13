import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone = 'neutral' | 'default';

interface BadgeProps {
	children: ReactNode;
	tone?: BadgeTone;
	className?: string;
}

/**
 * Small glass pill used for tags and tech marks. `default` tints toward the
 * accent; `neutral` is a quiet subtle-glass chip. Mirrors the design system's
 * Badge component (~22px tall).
 */
export const Badge = ({ children, tone = 'neutral', className }: BadgeProps) => (
	<span
		className={cn('glass-subtle', className)}
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			height: 22,
			padding: '0 10px',
			borderRadius: 'var(--radius-full)',
			font: 'var(--text-caption)',
			whiteSpace: 'nowrap',
			...(tone === 'default'
				? {
						background: 'color-mix(in oklab, var(--primary) 16%, transparent)',
						borderColor: 'color-mix(in oklab, var(--primary) 45%, transparent)',
						color: 'var(--foreground)',
					}
				: { color: 'var(--muted-foreground)' }),
		}}
	>
		{children}
	</span>
);
