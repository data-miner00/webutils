import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import wasm from 'vite-plugin-wasm';
import { defineConfig } from 'vitest/config';

const MEGABYTES = 1024 * 1024;

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		wasm(),
		VitePWA({
			registerType: 'autoUpdate',
			workbox: {
				maximumFileSizeToCacheInBytes: 8 * MEGABYTES
			}
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['tests/**/*.{test,spec}.{js,ts}']
				}
			}
		],
		alias: {
			$lib: 'src/lib'
		},
		globals: true
	},
	server: {
		fs: {
			allow: ['rust-pkg/pkg/']
		}
	}
});
