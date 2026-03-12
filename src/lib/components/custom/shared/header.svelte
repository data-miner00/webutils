<script lang="ts">
	import { Clipboard, Eye, EyeClosed, MapPin, RefreshCcw, Wifi, WifiOff } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/components/ui/button';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { currentLocalTimeInfo } from '$lib/core/clock-utils';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { type IpInfo, fetchIpInfo } from '$lib/core/ip-address';

	import SearchSection from '../search/search-section.svelte';

	let username = $state('');
	let email = $state('');
	let avatarUrl = $state('');
	let currentTime = $state(currentLocalTimeInfo(true));
	let isOnline = $state(true);
	let ipState = $state<IpInfo>();
	let showIp = $state(true);

	onMount(() => {
		const savedUsername = localStorage.getItem('settings_username');
		const savedEmail = localStorage.getItem('settings_email');
		const savedAvatarUrl = localStorage.getItem('settings_avatarUrl');

		if (savedUsername) username = savedUsername;
		if (savedEmail) email = savedEmail;
		if (savedAvatarUrl) avatarUrl = savedAvatarUrl;

		const interval = setInterval(() => {
			currentTime = currentLocalTimeInfo(true);
		}, 1000);

		fetchIpInfo().then((info) => (ipState = info));

		return () => clearInterval(interval);
	});

	function forceRefreshIp() {
		fetchIpInfo(true).then((info) => {
			ipState = info;
			toast.info('IP successfully refreshed.');
		});
	}

	window.addEventListener('online', () => (isOnline = true));
	window.addEventListener('offline', () => (isOnline = false));
</script>

<header
	class="bg-sidebar sticky top-0 right-0 flex w-full items-center justify-between border-b border-solid border-gray-300 p-4"
>
	<div class="flex items-center gap-2 text-sm">
		<MapPin size="20" />
		{#if ipState}
			<div>{ipState.city}, {ipState.country} ({showIp ? ipState.ip : '******'})</div>
		{:else}
			<!-- No internet connection -->
			<div>Uranus (0.0.0.0)</div>
		{/if}
		<ButtonGroup.Root>
			<Button
				variant="outline"
				size="icon"
				aria-label="Submit"
				onclick={() => copyText(ipState?.ip || '0.0.0.0')}
			>
				<Clipboard />
			</Button>
			<Button
				variant="outline"
				size="icon"
				aria-label="Hide/Show IP"
				onclick={() => (showIp = !showIp)}
			>
				{#if showIp}
					<Eye />
				{:else}
					<EyeClosed />
				{/if}
			</Button>
			<Button variant="outline" size="icon" aria-label="Refresh" onclick={forceRefreshIp}>
				<RefreshCcw />
			</Button>
		</ButtonGroup.Root>
	</div>

	<SearchSection />

	<div class="flex items-center gap-4">
		<div title={isOnline ? 'Connected to internet' : 'Not connected'}>
			{#if isOnline}
				<Wifi class="text-green-500" />
			{:else}
				<WifiOff class="text-red-500" />
			{/if}
		</div>
		<time datetime={currentTime.date} class="text-right text-sm">
			<div class="font-bold">
				{currentTime.date}
			</div>

			<div>
				{currentTime.time}
			</div>
		</time>
	</div>
</header>
