<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();
</script>

<div class="mt-10 flex px-12">
	<aside class="flex basis-72 flex-col gap-5">
		<a href="/settings/general" class:underline={page.url.pathname === '/settings/general'}
			>General Settings</a
		>
		<a href="/settings/profile" class:underline={page.url.pathname === '/settings/profile'}
			>Profile Related</a
		>
		<a href="/settings/home" class:underline={page.url.pathname === '/settings/home'}>Home Page</a>
		<a href="/settings/security" class:underline={page.url.pathname === '/settings/general'}
			>Entertainment</a
		>
		<a href="/settings/privacy" class:underline={page.url.pathname === '/settings/general'}
			>Monitoring</a
		>
	</aside>

	<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
		{@render children()}
	</div>
</div>
