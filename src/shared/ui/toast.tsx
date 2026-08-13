import { useState } from 'react';
import { create } from 'zustand';
import { X } from 'lucide-react';

interface ToastItem {
	id: number;
	title: string;
	text: string;
}

interface ToastStore {
	toasts: ToastItem[];
	push: (title: string, text: string) => void;
	dismiss: (id: number) => void;
}

let nextId = 0;
const timers = new Map<number, ReturnType<typeof setTimeout>>();

const useToastStore = create<ToastStore>((set, get) => ({
	toasts: [],
	push: (title, text) => {
		const id = ++nextId;
		set((s) => ({ toasts: s.toasts.concat({ id, title, text }).slice(-4) }));
		timers.set(
			id,
			setTimeout(() => get().dismiss(id), 5200),
		);
	},
	dismiss: (id) => {
		const t = timers.get(id);
		if (t) clearTimeout(t);
		timers.delete(id);
		set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
	},
}));

/** Imperative helper — call from anywhere to raise a toast. */
export const toast = (title: string, text: string) =>
	useToastStore.getState().push(title, text);

const GAP = 10;
const H = 72;

const ToastCard = ({ item }: { item: ToastItem }) => {
	const dismiss = useToastStore((s) => s.dismiss);
	return (
		<div
			className="glass-dense"
			style={{
				display: 'flex',
				alignItems: 'flex-start',
				gap: 10,
				width: 340,
				minHeight: H,
				padding: '12px 14px',
				borderRadius: 'var(--radius-glass)',
				boxSizing: 'border-box',
			}}
		>
			<span
				style={{
					marginTop: 5,
					width: 7,
					height: 7,
					borderRadius: 999,
					flex: 'none',
					background: 'var(--primary)',
					boxShadow: '0 0 0 4px color-mix(in oklab, var(--primary) 20%, transparent)',
				}}
			/>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}>
				<span style={{ font: 'var(--text-label)', color: 'var(--foreground)' }}>{item.title}</span>
				<span
					style={{
						font: 'var(--text-caption)',
						color: 'var(--muted-foreground)',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
					}}
				>
					{item.text}
				</span>
			</div>
			<button
				type="button"
				onClick={() => dismiss(item.id)}
				aria-label="Dismiss"
				style={{
					border: 0,
					background: 'transparent',
					color: 'var(--muted-foreground)',
					display: 'inline-flex',
					padding: 2,
					flex: 'none',
				}}
			>
				<X size={14} />
			</button>
		</div>
	);
};

/** Fixed top-right toast stack; hover expands it into a list. */
export const ToastStack = () => {
	const toasts = useToastStore((s) => s.toasts);
	const [hovered, setHovered] = useState(false);

	const stack = toasts.slice().reverse(); // index 0 = newest = front
	const len = toasts.length;
	const visibleBehind = Math.min(len - 1, 2);
	const collapsedH = len ? H + visibleBehind * 12 : 0;
	const expandedH = len ? len * H + (len - 1) * GAP : 0;

	return (
		<div
			className="toast-stack"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			style={{
				position: 'fixed',
				top: 20,
				right: 20,
				width: 356,
				height: hovered ? expandedH : collapsedH,
				zIndex: 80,
				pointerEvents: len ? 'auto' : 'none',
				display: len ? 'block' : 'none',
				transition: 'height 320ms var(--ease-glass)',
			}}
		>
			{stack.map((item, i) => {
				const transform = hovered
					? `translateY(${i * (H + GAP)}px) scale(1)`
					: `translateY(${i * 12}px) scale(${(1 - Math.min(i, 2) * 0.06).toFixed(3)})`;
				const opacity = i === 0 ? 1 : i <= 2 ? 1 : 0;
				return (
					<div
						key={item.id}
						style={{
							position: 'absolute',
							top: 0,
							right: 0,
							transform,
							opacity,
							zIndex: 100 - i,
							pointerEvents: 'auto',
							transition:
								'transform 320ms var(--ease-glass), opacity 260ms var(--ease-glass)',
						}}
					>
						<ToastCard item={item} />
					</div>
				);
			})}
		</div>
	);
};
