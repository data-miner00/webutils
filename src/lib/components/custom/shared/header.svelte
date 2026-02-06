<script lang="ts">
	import { onMount } from 'svelte';
	import { currentLocalTimeInfo } from '$lib/core/clock-utils';
	import SearchSection from '../search/search-section.svelte';
	import { Clipboard, MapPin, RefreshCcw, Wifi, WifiOff } from '@lucide/svelte';
	import { fetchIpInfo, type IpInfo } from '$lib/core/ip-address';
	import { Button } from '$lib/components/ui/button';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { toast } from 'svelte-sonner';

	let username = $state('');
	let email = $state('');
	let avatarUrl = $state('');
	let currentTime = $state(currentLocalTimeInfo(true));
	let isOnline = $state(true);
	let ipState = $state<IpInfo>();

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
	class="flex w-full items-center justify-between p-4 border-b border-solid border-gray-300 sticky top-0 right-0 bg-sidebar"
>
	{#if ipState}
		<div class="flex items-center gap-2 text-sm">
			<MapPin size="20" />
			<div>{ipState.city}, {ipState.country} ({ipState.ip})</div>
			<Button
				variant="outline"
				size="icon"
				aria-label="Submit"
				onclick={() => copyText(ipState?.ip || '0.0.0.0')}
			>
				<Clipboard />
			</Button>
			<Button variant="outline" size="icon" aria-label="Refresh" onclick={forceRefreshIp}>
				<RefreshCcw />
			</Button>
		</div>
	{:else}
		<!-- No internet connection -->
		<div class="flex items-center gap-2 text-sm" title="Wow, you're on Uranus!">
			<MapPin size="20" />
			<div>Uranus (0.0.0.0)</div>
			<Button variant="outline" size="icon" aria-label="Submit" onclick={() => copyText('0.0.0.0')}>
				<Clipboard />
			</Button>
			<Button variant="outline" size="icon" aria-label="Refresh" onclick={forceRefreshIp}>
				<RefreshCcw />
			</Button>
		</div>
	{/if}

	<SearchSection />

	<div class="flex gap-4 items-center">
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
