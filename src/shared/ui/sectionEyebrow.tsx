interface SectionEyebrowProps {
	children: string;
	marginBottom?: number;
}

/** Uppercase section eyebrow followed by a hairline rule. */
export const SectionEyebrow = ({ children, marginBottom = 26 }: SectionEyebrowProps) => (
	<div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom }}>
		<span
			style={{
				font: 'var(--text-eyebrow)',
				letterSpacing: 'var(--tracking-eyebrow)',
				textTransform: 'uppercase',
				color: 'var(--muted-foreground)',
			}}
		>
			{children}
		</span>
		<span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
	</div>
);
