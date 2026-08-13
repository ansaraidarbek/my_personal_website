import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { ChartLayout } from '@/shared/data/features';

const N = 48;

/** deterministic pseudo-random so the layout is stable across reloads */
const rnd = (i: number) => {
	const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};

/** oklch → sRGB hex (THREE.Color cannot parse oklch) */
const ok = (L: number, C: number, H: number) => {
	const hr = (H * Math.PI) / 180;
	const a = C * Math.cos(hr);
	const b = C * Math.sin(hr);
	const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
	const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
	const s_ = L - 0.0894841775 * a - 1.291485548 * b;
	const l = l_ * l_ * l_;
	const m = m_ * m_ * m_;
	const s = s_ * s_ * s_;
	const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
	const g2 = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
	const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
	const enc = (x: number) => {
		x = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(Math.max(x, 0), 1 / 2.4) - 0.055;
		return Math.round(Math.max(0, Math.min(1, x)) * 255);
	};
	return (enc(r) << 16) + (enc(g2) << 8) + enc(bl);
};

interface Block {
	mesh: THREE.Mesh;
	tp: THREE.Vector3;
	ts: THREE.Vector3;
	tr: number;
}

/**
 * 48 metal blocks that morph between four chart layouts (sunburst, treemap,
 * waterfall, funnel). Cursor tilts the field; scroll drifts it. WebGL / Three.js.
 * A faithful React port of the design's <hero-chart>.
 */
export const HeroChart = ({ layout }: { layout: ChartLayout }) => {
	const ref = useRef<HTMLDivElement>(null);
	const applyRef = useRef<(name: string) => void>();
	const layoutRef = useRef<string>(layout);
	layoutRef.current = layout;

	useEffect(() => {
		const host = ref.current;
		if (!host) return;
		let dead = false;
		let raf = 0;

		const w = host.clientWidth || 600;
		const h = host.clientHeight || 600;
		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: 'high-performance',
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(w, h, false);
		Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' });
		host.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		const hue = Number(
			(getComputedStyle(document.documentElement).getPropertyValue('--accent-hue') || '275').trim(),
		);
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
		camera.position.set(0, 0.6, 8.4);
		camera.lookAt(0, 0, 0);

		// Scale the block field so the largest layout (sunburst, r≈2.9) always
		// fits the pane with a margin, whatever the aspect ratio.
		const CONTENT_RADIUS = 2.9;
		let fitScale = 1;
		const computeFit = (vw: number, vh: number) => {
			const dist = camera.position.length();
			const halfH = Math.tan((camera.fov * Math.PI) / 360) * dist;
			const halfW = halfH * (vw / Math.max(vh, 1));
			fitScale = Math.min(1, (Math.min(halfH, halfW) * 0.92) / CONTENT_RADIUS);
		};
		computeFit(w, h);

		// painted environment so the metal blocks have something to reflect
		const ec = document.createElement('canvas');
		ec.width = 512;
		ec.height = 256;
		const g = ec.getContext('2d')!;
		const grad = g.createLinearGradient(0, 0, 0, 256);
		grad.addColorStop(0, `oklch(0.95 0.08 ${hue})`);
		grad.addColorStop(0.5, `oklch(0.55 0.16 ${hue - 90})`);
		grad.addColorStop(1, `oklch(0.16 0.03 ${hue})`);
		g.fillStyle = grad;
		g.fillRect(0, 0, 512, 256);
		const envTex = new THREE.CanvasTexture(ec);
		envTex.mapping = THREE.EquirectangularReflectionMapping;
		scene.environment = envTex;

		const group = new THREE.Group();
		group.rotation.x = -0.28;
		scene.add(group);

		const geo = new THREE.BoxGeometry(1, 1, 1);
		const blocks: Block[] = [];
		for (let i = 0; i < N; i++) {
			const t = i / (N - 1);
			const mat = new THREE.MeshStandardMaterial({
				color: new THREE.Color(ok(0.62 + 0.16 * t, 0.17 - 0.05 * t, hue - 70 * t)),
				metalness: 0.55,
				roughness: 0.28,
				envMap: envTex,
				envMapIntensity: 1.1,
			});
			const m = new THREE.Mesh(geo, mat);
			m.userData.v = 0.35 + rnd(i) * 0.65;
			group.add(m);
			blocks.push({ mesh: m, tp: new THREE.Vector3(), ts: new THREE.Vector3(1, 1, 1), tr: 0 });
		}

		const TAU = Math.PI * 2;
		const WATERFALL_BASES: number[] = [];
		{
			let base = 0;
			for (let k = 0; k < 24; k++) {
				WATERFALL_BASES.push(base);
				base += (rnd(k) - 0.45) * 0.42;
			}
		}
		const wMin = Math.min(...WATERFALL_BASES);
		const wMax = Math.max(...WATERFALL_BASES) + 1.35;
		const WATERFALL_CENTER = (wMin + wMax) / 2;

		const target = (name: string, i: number, b: Block) => {
			const v = b.mesh.userData.v as number;
			if (name === 'sunburst') {
				const inner = i < 16;
				const idx = inner ? i : i - 16;
				const count = inner ? 16 : 32;
				const a = (idx / count) * TAU;
				const r = inner ? 1.25 : 2.25;
				const arc = ((TAU * r) / count) * 0.86;
				b.tp.set(Math.cos(a) * r, Math.sin(a) * r, 0);
				b.ts.set(arc, inner ? 0.95 : 0.72, 0.25 + v * 0.75);
				b.tr = a + Math.PI / 2;
			} else if (name === 'treemap') {
				const cols = 8;
				const rows = Math.ceil(N / cols);
				const cx = i % cols;
				const cy = Math.floor(i / cols);
				const cw = 0.66;
				const ch = 0.66;
				b.tp.set((cx - (cols - 1) / 2) * cw, ((rows - 1) / 2 - cy) * ch, 0);
				b.ts.set(cw * (0.62 + v * 0.34), ch * (0.62 + v * 0.34), 0.12 + v * 0.5);
				b.tr = 0;
			} else if (name === 'waterfall') {
				const cols = 24;
				if (i >= cols) {
					b.tp.set(0, WATERFALL_CENTER, 0);
					b.ts.set(0.001, 0.001, 0.001);
					b.tr = 0;
					return;
				}
				const height = 0.25 + v * 1.1;
				const mid = WATERFALL_BASES[i] + height / 2 - WATERFALL_CENTER;
				b.tp.set((i - (cols - 1) / 2) * 0.24, mid, 0);
				b.ts.set(0.18, height, 0.4);
				b.tr = 0;
			} else {
				// funnel
				const rows = 12;
				if (i >= rows) {
					b.tp.set(0, 0, -4);
					b.ts.set(0.001, 0.001, 0.001);
					b.tr = 0;
					return;
				}
				const k = i / (rows - 1);
				b.tp.set(0, ((rows - 1) / 2) * 0.36 - i * 0.36, 0);
				b.ts.set(3.6 * (1 - k * 0.78), 0.28, 0.5 + (1 - k) * 0.8);
				b.tr = 0;
			}
		};

		const apply = (name: string) => blocks.forEach((b, i) => target(name, i, b));
		applyRef.current = apply;
		apply(layoutRef.current);
		blocks.forEach((b) => {
			b.mesh.position.copy(b.tp);
			b.mesh.scale.copy(b.ts);
			b.mesh.rotation.z = b.tr;
		});

		scene.add(new THREE.AmbientLight(0xffffff, 0.55));
		const key = new THREE.DirectionalLight(0xffffff, 1.5);
		key.position.set(2.5, 4, 6);
		scene.add(key);
		const rim = new THREE.PointLight(new THREE.Color(ok(0.7, 0.2, hue - 90)), 24, 24);
		rim.position.set(-4, -2, 3);
		scene.add(rim);

		const tgt = { x: 0, y: 0 };
		const cur = { x: 0, y: 0 };
		let scrollN = 0;
		const onMove = (e: PointerEvent) => {
			tgt.x = (e.clientX / window.innerWidth - 0.5) * 2;
			tgt.y = (e.clientY / window.innerHeight - 0.5) * 2;
		};
		const onScroll = () => {
			scrollN = (window.scrollY || 0) / Math.max(window.innerHeight, 1);
		};
		window.addEventListener('pointermove', onMove, { passive: true });
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		const ro = new ResizeObserver(() => {
			const nw = host.clientWidth || w;
			const nh = host.clientHeight || h;
			renderer.setSize(nw, nh, false);
			camera.aspect = nw / nh;
			camera.updateProjectionMatrix();
			computeFit(nw, nh);
		});
		ro.observe(host);

		const clock = new THREE.Clock();
		const tick = () => {
			if (dead) return;
			raf = requestAnimationFrame(tick);
			const t = clock.getElapsedTime();
			cur.x += (tgt.x - cur.x) * 0.05;
			cur.y += (tgt.y - cur.y) * 0.05;
			const current = layoutRef.current;

			for (let i = 0; i < blocks.length; i++) {
				const b = blocks[i];
				const m = b.mesh;
				const d = 0.085 + (i % 7) * 0.004;
				m.position.lerp(b.tp, d);
				m.scale.lerp(b.ts, d);
				m.rotation.z += (b.tr - m.rotation.z) * d;
				if (!reduced && current === 'sunburst') {
					m.position.z = Math.sin(t * 1.1 + i * 0.4) * 0.06;
				}
			}
			if (!reduced) group.rotation.y = (current === 'sunburst' ? t * 0.12 : 0) + cur.x * 0.45;
			group.rotation.x = -0.28 + cur.y * 0.28 + scrollN * 0.22;
			group.position.y = -scrollN * 0.9;
			group.scale.setScalar(fitScale * Math.max(0.6, 1 - scrollN * 0.2));
			renderer.render(scene, camera);
		};
		tick();

		return () => {
			dead = true;
			cancelAnimationFrame(raf);
			ro.disconnect();
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('scroll', onScroll);
			geo.dispose();
			envTex.dispose();
			blocks.forEach((b) => (b.mesh.material as THREE.Material).dispose());
			renderer.dispose();
			if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
		};
	}, []);

	useEffect(() => {
		applyRef.current?.(layout);
	}, [layout]);

	return <div ref={ref} style={{ width: '100%', height: '100%', position: 'relative' }} />;
};
