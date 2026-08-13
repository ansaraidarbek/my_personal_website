/**
 * Site-wide identity. Everything else (header, meta, contact, footer) reads
 * from here, so this is the one place to edit personal details.
 */
export const siteConfig = {
	name: 'Angsar Aidarbek',
	role: 'Frontend Engineer',
	specialisation: 'React specialist',
	tagline:
		'Five years of production React — a chart engine 15M+ people use, and a hiring platform taken 0 → 1.',
	description:
		'Angsar Aidarbek — senior frontend engineer specialising in React. Five years shipping fast, maintainable products at TapHR and ONLYOFFICE.',
	email: 'ansaraydarbek31@gmail.com',
	location: 'Astana, Kazakhstan',
	timezone: 'UTC+5',
	timeZoneName: 'Asia/Almaty',
	availability: 'open to senior React roles',
	telegram: {
		handle: '@PrintNameF',
		url: 'https://t.me/PrintNameF',
	},
	socials: {
		github: 'https://github.com/ansaraidarbek',
		telegram: 'https://t.me/PrintNameF',
	},
	/** Words cycled through by the hero's typewriter. */
	typedRoles: ['senior React engineer', 'frontend architect', 'product-minded builder'],
} as const;

export type SiteConfig = typeof siteConfig;
