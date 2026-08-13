import { useEffect, useState } from 'react';

/**
 * Scrollytelling: watches elements carrying `[data-step]` and returns the index
 * of the one nearest the vertical centre of the viewport.
 */
export const useActiveStep = () => {
	const [step, setStep] = useState(0);

	useEffect(() => {
		const els = Array.from(document.querySelectorAll<HTMLElement>('[data-step]'));
		if (!els.length) return;

		let ticking = false;
		const sync = () => {
			const mid = window.innerHeight / 2;
			let best = 0;
			let bestD = Infinity;
			els.forEach((el) => {
				const r = el.getBoundingClientRect();
				const d = Math.abs(r.top + r.height / 2 - mid);
				if (d < bestD) {
					bestD = d;
					best = Number(el.getAttribute('data-step'));
				}
			});
			setStep((prev) => (prev === best ? prev : best));
			ticking = false;
		};
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(sync);
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		sync();
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	}, []);

	return step;
};
