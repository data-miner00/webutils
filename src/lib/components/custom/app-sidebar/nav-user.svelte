<script lang="ts">
	import { HouseIcon, Mail, Settings2Icon, UserRoundPenIcon } from '@lucide/svelte';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import LogOutIcon from '@lucide/svelte/icons/log-out';

	import { goto } from '$app/navigation';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { getEmailProviderUrlFromEmail } from '$lib/core/email';

	let {
		user
	}: {
		user: {
			name: string;
			email: string;
			avatar: string;
		};
	} = $props();
	const sidebar = useSidebar();

	let emailProviderUrl = $derived(
		getEmailProviderUrlFromEmail(user.email) || 'https://mail.google.com/'
	);

	function gotoGeneralSettings() {
		goto('/settings/general');
	}

	function gotoProfileSettings() {
		goto('/settings/profile');
	}

	function gotoHomePageSettings() {
		goto('/settings/home');
	}
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
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={user.avatar} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-start text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
						<ChevronsUpDownIcon class="ms-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<a
						class="flex items-center gap-2 px-1 py-1.5 text-start text-sm"
						href={emailProviderUrl}
						target="_blank"
					>
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={user.avatar} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-start text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
					</a>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<!-- issue: It still didn't take full width and height of the parent -->
						<a
							href={emailProviderUrl}
							target="_blank"
							class="flex h-full w-full items-center gap-2"
						>
							<Mail />
							<div>Email Inbox</div>
						</a>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item onSelect={gotoGeneralSettings}>
						<Settings2Icon />
						General
					</DropdownMenu.Item>
					<DropdownMenu.Item onSelect={gotoProfileSettings}>
						<UserRoundPenIcon />
						Profile
					</DropdownMenu.Item>
					<DropdownMenu.Item onSelect={gotoHomePageSettings}>
						<HouseIcon />
						Home Settings
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<LogOutIcon />
					Log out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
