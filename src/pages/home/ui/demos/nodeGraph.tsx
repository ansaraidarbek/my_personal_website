import { useEffect, useRef } from 'react';

interface NodeSpec {
	id: number;
	x: number;
	y: number;
	w: number;
	h: number;
	label: string;
	question: string;
	input: string;
}

// Each card mirrors a real TapHR automation node: a name, the question the
// step asks, and the configured input value.
const NODES: NodeSpec[] = [
	{ id: 0, x: 0.13, y: 0.24, w: 158, h: 86, label: 'Application', question: 'Where did they apply?', input: 'careers site' },
	{ id: 1, x: 0.46, y: 0.14, w: 158, h: 86, label: 'AI screen', question: 'Pass threshold?', input: 'score ≥ 70' },
	{ id: 2, x: 0.46, y: 0.66, w: 158, h: 86, label: 'Assessment', question: 'Which test to send?', input: 'Frontend basics' },
	{ id: 3, x: 0.8, y: 0.32, w: 158, h: 86, label: 'Interview', question: 'Who runs it?', input: '@aigerim · 45 min' },
	{ id: 4, x: 0.8, y: 0.84, w: 158, h: 86, label: 'Reject', question: 'Notify the candidate?', input: 'template: kind-no' },
];
const LINKS: [number, number][] = [
	[0, 1],
	[0, 2],
	[1, 3],
	[2, 3],
	[2, 4],
];

interface Node extends NodeSpec {
	px: number;
	py: number;
}

/**
 * Library-free node editor: drag node cards, live bezier links, animated
 * packets travelling the edges. Canvas 2D.
 */
export const NodeGraph = () => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const host = ref.current;
		if (!host) return;
		let dead = false;
		let raf = 0;
		let placed = false;

		const canvas = document.createElement('canvas');
		canvas.style.cssText = 'width:100%;height:100%;display:block';
		host.appendChild(canvas);
		const ctx = canvas.getContext('2d')!;
		const nodes: Node[] = NODES.map((n) => ({ ...n, px: 0, py: 0 }));
		let drag: { n: Node; dx: number; dy: number } | null = null;
		let hover: Node | null = null;

		const color = (v: string, fallback: string) =>
			getComputedStyle(host).getPropertyValue(v).trim() || fallback;

		const isDark = () => document.documentElement.classList.contains('dark');

		const resize = () => {
			const w = host.clientWidth || 400;
			const h = host.clientHeight || 260;
			const dpr = Math.min(window.devicePixelRatio, 2);
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			if (!placed && w > 10) {
				nodes.forEach((n) => {
					n.px = n.x * w;
					n.py = n.y * h;
				});
				placed = true;
			}
		};

		const hit = (p: { x: number; y: number }) => {
			for (let i = nodes.length - 1; i >= 0; i--) {
				const n = nodes[i];
				if (Math.abs(p.x - n.px) < n.w / 2 && Math.abs(p.y - n.py) < n.h / 2) return n;
			}
			return null;
		};
		const pt = (e: PointerEvent) => {
			const r = canvas.getBoundingClientRect();
			return { x: e.clientX - r.left, y: e.clientY - r.top };
		};

		const onDown = (e: PointerEvent) => {
			const p = pt(e);
			const n = hit(p);
			if (n) {
				drag = { n, dx: p.x - n.px, dy: p.y - n.py };
				canvas.setPointerCapture(e.pointerId);
			}
		};
		const onMove = (e: PointerEvent) => {
			const p = pt(e);
			if (drag) {
				drag.n.px = Math.max(drag.n.w / 2 + 4, Math.min(canvas.clientWidth - drag.n.w / 2 - 4, p.x - drag.dx));
				drag.n.py = Math.max(drag.n.h / 2 + 4, Math.min(canvas.clientHeight - drag.n.h / 2 - 4, p.y - drag.dy));
			} else {
				hover = hit(p);
				canvas.style.cursor = hover ? 'grab' : 'default';
			}
		};
		const onUp = () => {
			drag = null;
		};
		canvas.addEventListener('pointerdown', onDown);
		canvas.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);

		const ro = new ResizeObserver(() => resize());
		ro.observe(host);
		resize();

		const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
			ctx.beginPath();
			ctx.moveTo(x + r, y);
			ctx.arcTo(x + w, y, x + w, y + h, r);
			ctx.arcTo(x + w, y + h, x, y + h, r);
			ctx.arcTo(x, y + h, x, y, r);
			ctx.arcTo(x, y, x + w, y, r);
			ctx.closePath();
		};

		const loop = () => {
			if (dead) return;
			raf = requestAnimationFrame(() => loop());
			const w = canvas.clientWidth;
			const h = canvas.clientHeight;
			if (!w || !h) return;
			const dpr = Math.min(window.devicePixelRatio, 2);
			if (!placed || Math.abs(canvas.width - w * dpr) > 1 || Math.abs(canvas.height - h * dpr) > 1) resize();
			const t = performance.now() / 1000;
			const fg = color('--foreground', '#eee');
			const muted = color('--muted-foreground', '#999');
			const primary = color('--primary', '#8b7cf6');
			const accent = color('--accent', '#5ad');
			const dark = isDark();
			const cardBg = dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.62)';
			const cardBgActive = dark ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.85)';
			const cardBorder = dark ? 'rgba(255,255,255,0.22)' : 'rgba(60,50,90,0.25)';
			const inputBg = dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.55)';
			const inputBorder = dark ? 'rgba(255,255,255,0.14)' : 'rgba(60,50,90,0.18)';

			ctx.clearRect(0, 0, w, h);

			LINKS.forEach(([a, b], li) => {
				const A = nodes[a];
				const B = nodes[b];
				const x1 = A.px + A.w / 2;
				const y1 = A.py;
				const x2 = B.px - B.w / 2;
				const y2 = B.py;
				const cx = (x2 - x1) * 0.5;
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.bezierCurveTo(x1 + cx, y1, x2 - cx, y2, x2, y2);
				ctx.strokeStyle = muted;
				ctx.globalAlpha = 0.45;
				ctx.lineWidth = 1.25;
				ctx.stroke();
				ctx.globalAlpha = 1;

				const p = (t * 0.32 + li * 0.19) % 1;
				const bez = (p0: number, p1: number, p2: number, p3: number, s: number) => {
					const m = 1 - s;
					return m * m * m * p0 + 3 * m * m * s * p1 + 3 * m * s * s * p2 + s * s * s * p3;
				};
				ctx.beginPath();
				ctx.arc(bez(x1, x1 + cx, x2 - cx, x2, p), bez(y1, y1, y2, y2, p), 2.6, 0, Math.PI * 2);
				ctx.fillStyle = accent;
				ctx.fill();
			});

			nodes.forEach((n) => {
				const active = hover === n || (drag && drag.n === n);
				const x = n.px - n.w / 2;
				const y = n.py - n.h / 2;

				// card
				roundRect(x, y, n.w, n.h, 10);
				ctx.fillStyle = active ? cardBgActive : cardBg;
				ctx.fill();
				ctx.strokeStyle = active ? primary : cardBorder;
				ctx.lineWidth = active ? 1.4 : 1;
				ctx.stroke();

				ctx.textAlign = 'left';
				ctx.textBaseline = 'middle';

				// name
				ctx.fillStyle = fg;
				ctx.font = '600 12.5px ui-sans-serif, system-ui, sans-serif';
				ctx.fillText(n.label, x + 12, y + 16);

				// question
				ctx.fillStyle = muted;
				ctx.font = '400 11px ui-sans-serif, system-ui, sans-serif';
				ctx.fillText(n.question, x + 12, y + 34);

				// input field
				const ix = x + 10;
				const iy = y + n.h - 32;
				const iw = n.w - 20;
				const ih = 22;
				roundRect(ix, iy, iw, ih, 6);
				ctx.fillStyle = inputBg;
				ctx.fill();
				ctx.strokeStyle = active ? primary : inputBorder;
				ctx.lineWidth = 1;
				ctx.stroke();
				ctx.fillStyle = active ? fg : muted;
				ctx.font = '400 10.5px ui-monospace, SFMono-Regular, Menlo, monospace';
				ctx.fillText(n.input, ix + 8, iy + ih / 2 + 0.5);

				// ports
				ctx.beginPath();
				ctx.arc(x + n.w, n.py, 3, 0, Math.PI * 2);
				ctx.fillStyle = primary;
				ctx.fill();
				ctx.beginPath();
				ctx.arc(x, n.py, 3, 0, Math.PI * 2);
				ctx.fillStyle = muted;
				ctx.fill();
			});
		};
		loop();

		return () => {
			dead = true;
			cancelAnimationFrame(raf);
			ro.disconnect();
			canvas.removeEventListener('pointerdown', onDown);
			canvas.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
			host.innerHTML = '';
		};
	}, []);

	return (
		<div ref={ref} style={{ width: '100%', height: '100%', position: 'relative', touchAction: 'none' }} />
	);
};
