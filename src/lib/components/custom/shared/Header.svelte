<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { onMount } from 'svelte';
	import { currentLocalTimeInfo } from '$lib/core/clock-utils';
	import SearchSection from '../search/search-section.svelte';

	let username = $state('');
	let email = $state('');
	let avatarUrl = $state('');
	let currentTime = $state(currentLocalTimeInfo(true));

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

		return () => clearInterval(interval);
	});
</script>

<header class="flex w-full items-center justify-between bg-background p-4">
	<NavigationMenu.Root viewport={false}>
		<NavigationMenu.List>
			<NavigationMenu.Item>
				<NavigationMenu.Link>
					{#snippet child()}
						<a href="/" class={navigationMenuTriggerStyle()}>Home</a>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Trigger>Management</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<ul class="grid w-[300px] gap-4 p-2">
						<li>
							<NavigationMenu.Link href="/manage/notes">
								<div class="font-medium">Notes</div>
								<div class="text-muted-foreground">Organizes personal notes stored locally.</div>
							</NavigationMenu.Link>
							<NavigationMenu.Link href="##">
								<div class="font-medium">Pomodoro Timer</div>
								<div class="text-muted-foreground">Focus on what you do at the moment.</div>
							</NavigationMenu.Link>
							<NavigationMenu.Link href="##">
								<div class="font-medium">Kanban</div>
								<div class="text-muted-foreground">Simple kanban board to visualize tasks.</div>
							</NavigationMenu.Link>
							<NavigationMenu.Link href="/manage/links">
								<div class="font-medium">Links</div>
								<div class="text-muted-foreground">
									Collections of useful URLs for personal use.
								</div>
							</NavigationMenu.Link>
						</li>
					</ul>
				</NavigationMenu.Content>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Trigger>Internal</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<ul class="grid w-[200px] gap-4 p-2">
						<li>
							<NavigationMenu.Link href="/tools/lorem">Lorem Ipsum</NavigationMenu.Link>
							<NavigationMenu.Link href="/tools/jwt-debugger">JWT Debugger</NavigationMenu.Link>
							<NavigationMenu.Link href="/tools/clock">Clock</NavigationMenu.Link>
							<NavigationMenu.Link target="_blank" href="/color.html">Color</NavigationMenu.Link>
							<NavigationMenu.Link href="/tools/hash">Hash</NavigationMenu.Link>
							<NavigationMenu.Link href="/tools/qr-code">QR Codes</NavigationMenu.Link>
							<NavigationMenu.Link href="/tools/leading-space"
								>Remove leading space</NavigationMenu.Link
							>
							<NavigationMenu.Link href="/tools/strings">Strings</NavigationMenu.Link>
							<NavigationMenu.Link target="_blank" href="/uuid.html">UUID</NavigationMenu.Link>
							<NavigationMenu.Link href="/tools/emoji">Emoji</NavigationMenu.Link>
							<NavigationMenu.Link href="/tools/verify">Verify</NavigationMenu.Link>
						</li>
					</ul>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
			<NavigationMenu.Item>
				<NavigationMenu.Trigger>Simple</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<ul class="grid w-[200px] gap-4 p-2">
						<li>
							<NavigationMenu.Link target="_blank" href="/clock.html">Clock</NavigationMenu.Link>
							<NavigationMenu.Link target="_blank" href="/color.html">Color</NavigationMenu.Link>
							<NavigationMenu.Link target="_blank" href="/hasing.html">Hashing</NavigationMenu.Link>
							<NavigationMenu.Link target="_blank" href="/qrbar.html">QR Codes</NavigationMenu.Link>
							<NavigationMenu.Link target="_blank" href="/rmlspace.html"
								>Remove leading space</NavigationMenu.Link
							>
							<NavigationMenu.Link target="_blank" href="/strutil.html">Strings</NavigationMenu.Link
							>
							<NavigationMenu.Link target="_blank" href="/uuid.html">UUID</NavigationMenu.Link>
						</li>
					</ul>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>

	<SearchSection />

	<div class="flex gap-4 items-center">
		<time datetime={currentTime.date} class="text-right">
			<div class="font-bold">
				{currentTime.date}
			</div>

			<div>
				{currentTime.time}
			</div>
		</time>
		<a class="flex items-center space-x-4" href="/settings">
			<Avatar.Root>
				<Avatar.Image src={avatarUrl} alt="User Avatar" />
				<Avatar.Fallback class="bg-black text-white"
					>{username ? username.charAt(0).toUpperCase() : 'U'}</Avatar.Fallback
				>
			</Avatar.Root>
			<div>
				<div>{username}</div>
				<div class="text-sm text-muted-foreground">{email}</div>
			</div>
		</a>
	</div>
</header>
