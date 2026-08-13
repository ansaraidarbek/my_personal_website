import { useEffect, useState } from 'react';
import { siteConfig } from '@/shared/config/site';

/** Live "HH:MM in Astana" clock, ticking every second. */
export const useClock = () => {
	const [clock, setClock] = useState('');

	useEffect(() => {
		const tick = () => {
			try {
				const s = new Intl.DateTimeFormat('en-GB', {
					timeZone: siteConfig.timeZoneName,
					hour: '2-digit',
					minute: '2-digit',
				}).format(new Date());
				setClock(`${s} in Astana`);
			} catch {
				setClock(siteConfig.timezone);
			}
		};
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, []);

	return clock;
};
