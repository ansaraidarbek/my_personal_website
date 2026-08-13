import type { ReactNode } from 'react';

/**
 * App-wide providers. The site is content-only (no data fetching), so this is
 * intentionally thin — a seam to add QueryClient/Tooltip providers if needed.
 */
export const AppProviders = ({ children }: { children: ReactNode }) => <>{children}</>;
