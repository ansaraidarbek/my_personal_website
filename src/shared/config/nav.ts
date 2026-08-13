export interface NavItem {
	label: string;
	/** In-page anchor target (id of the section). */
	href: string;
}

/** Anchor navigation for the single-page site — shown in the header. */
export const navItems: NavItem[] = [
	{ label: 'Story', href: '#story' },
	{ label: 'About', href: '#about' },
	{ label: 'Projects', href: '#projects' },
	{ label: 'Stack', href: '#stack' },
	{ label: 'Contact', href: '#contact' },
];
