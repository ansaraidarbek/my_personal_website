import { useEffect, useRef } from 'react';

interface Pt {
	x: number;
	y: number;
}

/**
 * Draggable scatter with a Bézier-smoothed curve, least-squares trendline and a
 * live R² readout — the ONLYOFFICE trendline work in miniature. Faithful React
 * port of <trend-line>.
 */
export const TrendLine = ({ onReadout }: { onReadout?: (s: string) => void }) => {
	const ref = useRef<HTMLDivElement>(null);
	const readoutRef = useRef(onReadout);
	readoutRef.current = onReadout;

	useEffect(() => {
		const host = ref.current;
		if (!host) return;
		let dead = false;
		let raf = 0;

		const canvas = document.createElement('canvas');
		canvas.style.cssText = 'width:100%;height:100%;display:block;cursor:crosshair';
		host.appendChild(canvas);
		const ctx = canvas.getContext('2d')!;
		const pts: Pt[] = Array.from({ length: 11 }, (_, i) => ({
			x: i / 10,
			y: 0.22 + i * 0.055 + Math.sin(i * 2.3) * 0.09,
		}));
		let drag: number | null = null;

		const color = (v: string, f: string) => getComputedStyle(host).getPropertyValue(v).trim() || f;

		const fit = () => {
			const n = pts.length;
			let sx = 0;
			let sy = 0;
			let sxy = 0;
			let sxx = 0;
			pts.forEach((p) => {
				sx += p.x;
				sy += p.y;
				sxy += p.x * p.y;
				sxx += p.x * p.x;
			});
			const m = (n * sxy - sx * sy) / (n * sxx - sx * sx);
			const b = (sy - m * sx) / n;
			const mean = sy / n;
			let ssr = 0;
			let sst = 0;
			pts.forEach((p) => {
				const f = m * p.x + b;
				ssr += (p.y - f) ** 2;
				sst += (p.y - mean) ** 2;
			});
			return { m, b, r2: sst ? 1 - ssr / sst : 1 };
		};

		const draw = () => {
			if (dead) return;
			const w = canvas.clientWidth;
			const h = canvas.clientHeight;
			if (!w || !h) return;
			const pad = 18;
			const X = (x: number) => pad + x * (w - pad * 2);
			const Y = (y: number) => h - pad - y * (h - pad * 2);
			const muted = color('--muted-foreground', '#999');
			const primary = color('--primary', '#8b7cf6');
			const accent = color('--accent', '#5ad');
			ctx.clearRect(0, 0, w, h);

			ctx.strokeStyle = muted;
			ctx.globalAlpha = 0.18;
			ctx.lineWidth = 1;
			for (let i = 0; i <= 4; i++) {
				const y = Y(i / 4);
				ctx.beginPath();
				ctx.moveTo(pad, y);
				ctx.lineTo(w - pad, y);
				ctx.stroke();
			}
			ctx.globalAlpha = 1;

			ctx.beginPath();
			ctx.moveTo(X(pts[0].x), Y(pts[0].y));
			for (let i = 0; i < pts.length - 1; i++) {
				const p0 = pts[Math.max(0, i - 1)];
				const p1 = pts[i];
				const p2 = pts[i + 1];
				const p3 = pts[Math.min(pts.length - 1, i + 2)];
				const c1x = p1.x + (p2.x - p0.x) / 6;
				const c1y = p1.y + (p2.y - p0.y) / 6;
				const c2x = p2.x - (p3.x - p1.x) / 6;
				const c2y = p2.y - (p3.y - p1.y) / 6;
				ctx.bezierCurveTo(X(c1x), Y(c1y), X(c2x), Y(c2y), X(p2.x), Y(p2.y));
			}
			ctx.strokeStyle = accent;
			ctx.lineWidth = 2;
			ctx.stroke();

			const { m, b, r2 } = fit();
			ctx.beginPath();
			ctx.moveTo(X(0), Y(b));
			ctx.lineTo(X(1), Y(m + b));
			ctx.setLineDash([5, 5]);
			ctx.strokeStyle = primary;
			ctx.lineWidth = 1.5;
			ctx.stroke();
			ctx.setLineDash([]);

			pts.forEach((p) => {
				ctx.beginPath();
				ctx.arc(X(p.x), Y(p.y), 4.4, 0, Math.PI * 2);
				ctx.fillStyle = primary;
				ctx.fill();
				ctx.strokeStyle = 'rgba(255,255,255,0.55)';
				ctx.lineWidth = 1;
				ctx.stroke();
			});

			readoutRef.current?.(`R² ${r2.toFixed(3)} · slope ${m.toFixed(2)}`);
		};

		const resize = () => {
			const w = host.clientWidth || 360;
			const h = host.clientHeight || 220;
			const dpr = Math.min(window.devicePixelRatio, 2);
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			draw();
		};

		const rel = (e: PointerEvent) => {
			const r = canvas.getBoundingClientRect();
			return { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
		};
		const onDown = (e: PointerEvent) => {
			const p = rel(e);
			let best: number | null = null;
			let bd = 0.07;
			pts.forEach((pt, i) => {
				const d = Math.hypot(pt.x - p.x, pt.y - p.y);
				if (d < bd) {
					bd = d;
					best = i;
				}
			});
			if (best !== null) {
				drag = best;
				canvas.setPointerCapture(e.pointerId);
			}
		};
		const onMove = (e: PointerEvent) => {
			if (drag === null) return;
			const p = rel(e);
			pts[drag].y = Math.max(0.06, Math.min(0.94, p.y));
			draw();
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

		const watch = () => {
			if (dead) return;
			const w = host.clientWidth;
			const h = host.clientHeight;
			const dpr = Math.min(window.devicePixelRatio, 2);
			if (w && h && (Math.abs(canvas.width - w * dpr) > 1 || Math.abs(canvas.height - h * dpr) > 1)) resize();
			raf = requestAnimationFrame(watch);
		};
		raf = requestAnimationFrame(watch);

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
