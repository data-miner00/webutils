<script lang="ts">
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
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
							<NavigationMenu.Link target="_blank" href="/qrbar.html">QR Codes</NavigationMenu.Link>
							<NavigationMenu.Link href="/tools/leading-space"
								>Remove leading space</NavigationMenu.Link
							>
							<NavigationMenu.Link href="/tools/strings">Strings</NavigationMenu.Link>
							<NavigationMenu.Link target="_blank" href="/uuid.html">UUID</NavigationMenu.Link>
							<NavigationMenu.Link href="/tools/emoji">Emoji</NavigationMenu.Link>
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

	<div>
		<p>right</p>
	</div>
</header>
