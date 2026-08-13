import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
	// GitHub project pages: https://ansaraidarbek.github.io/my_personal_website/
	// Switch back to '/' if this ever moves to a custom domain or root site.
	base: '/my_personal_website/',
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, './src'),
		},
	},
	server: {
		port: 5173,
	},
});
