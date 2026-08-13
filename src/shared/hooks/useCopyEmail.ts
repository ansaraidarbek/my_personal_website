import { useCallback } from 'react';
import { siteConfig } from '@/shared/config/site';
import { toast } from '@/shared/ui/toast';

/** Copies the email to the clipboard and raises a confirmation toast. */
export const useCopyEmail = () => {
	return useCallback(() => {
		const email = siteConfig.email;
		const done = () => toast('Email copied', `${email} is on your clipboard.`);
		if (navigator.clipboard?.writeText) {
			navigator.clipboard.writeText(email).then(done, done);
		} else {
			done();
		}
	}, []);
};
