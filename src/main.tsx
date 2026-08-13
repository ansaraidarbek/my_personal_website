import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders } from './app/providers';
import { RootLayout } from './app/layout/rootLayout';
import './index.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppProviders>
			<RootLayout />
		</AppProviders>
	</StrictMode>,
);
