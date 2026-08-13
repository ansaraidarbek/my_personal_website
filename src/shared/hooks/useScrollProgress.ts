import { useEffect, useState } from 'react';

/** Reading progress through the whole document, as a 0–1 fraction. */
export const useScrollProgress = () => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		let ticking = false;
		const update = () => {
			const y = window.scrollY || 0;
			const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
			setProgress(Math.min(1, y / max));
			ticking = false;
		};
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(update);
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		update();
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	}, []);

	return progress;
};
