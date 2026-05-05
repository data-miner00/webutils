<script lang="ts">
	import { ClipboardIcon, Eye, EyeClosed, RefreshCcw, Wifi, WifiOff } from '@lucide/svelte';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { type IpInfo, fetchIpInfo } from '$lib/core/ip-address';

	const sidebar = useSidebar();

	let isOnline = $state(true);
	let ipState = $state<IpInfo>();
	let showIp = $state(true);

	onMount(() => {
		fetchIpInfo().then((info) => (ipState = info));
	});

	function forceRefreshIp() {
		fetchIpInfo(true).then((info) => {
			ipState = info;
			toast.success('IP successfully refreshed.');
		});
	}

	window.addEventListener('online', () => (isOnline = true));
	window.addEventListener('offline', () => (isOnline = false));
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div>
							<div title={isOnline ? 'Connected to internet' : 'Not connected'}>
								{#if isOnline}
									<Wifi size={20} />
								{:else}
									<WifiOff size={20} />
								{/if}
							</div>
						</div>
						<div class="grid flex-1 text-start text-sm leading-tight">
							<span class="truncate font-medium">{ipState?.city}, {ipState?.country}</span>
							<span class="truncate text-xs">{showIp ? ipState?.ip : '******'}</span>
						</div>
						<ChevronsUpDownIcon class="ms-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="start"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
						<div>
							<div title={isOnline ? 'Connected to internet' : 'Not connected'}>
								{#if isOnline}
									<Wifi size={20} />
								{:else}
									<WifiOff size={20} />
								{/if}
							</div>
						</div>
						<div class="grid flex-1 text-start text-sm leading-tight">
							<span class="truncate font-medium">{ipState?.city}, {ipState?.country}</span>
							<span class="truncate text-xs">{showIp ? ipState?.ip : '******'}</span>
						</div>
						<ChevronsUpDownIcon class="ms-auto size-4" />
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item onclick={() => copyText(ipState?.ip || '0.0.0.0')}>
						<ClipboardIcon />
						Copy IP Address
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item aria-label="Hide/Show IP" onclick={() => (showIp = !showIp)}>
						{#if !showIp}
							<Eye /> Show IP Address
						{:else}
							<EyeClosed /> Hide IP Address
						{/if}
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						{#if false}
							<Eye /> Mask IP Address
						{:else}
							<EyeClosed /> Unmask IP Address
						{/if}
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item aria-label="Refresh IP" onclick={forceRefreshIp}>
					<RefreshCcw />
					Force Refresh
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
