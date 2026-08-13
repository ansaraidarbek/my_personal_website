import { Backdrop } from './backdrop';
import { SiteHeader } from './siteHeader';
import { LandingPage } from '@/pages/home/homePage';
import { ToastStack } from '@/shared/ui/toast';

/** The whole single-page site: backdrop, sticky header, and the section stack. */
export const RootLayout = () => (
	<>
		<Backdrop />
		<div style={{ position: 'relative', minHeight: '100vh', overflowX: 'clip' }}>
			<SiteHeader />
			<main
				id="top"
				style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px 96px' }}
			>
				<LandingPage />
			</main>
		</div>
		<ToastStack />
	</>
);
