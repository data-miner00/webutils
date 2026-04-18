<script lang="ts">
	import { ChevronsDownUpIcon, House } from '@lucide/svelte';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

	import { page } from '$app/state';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let {
		items,
		toggleCollapsible
	}: {
		items: {
			title: string;
			url: string;
			// this should be `Component` after @lucide/svelte updates types
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			icon?: any;
			isBeta?: boolean;
			isActive?: boolean;
			items?: {
				title: string;
				url: string;
				badge?: string;
				isBeta?: boolean;
			}[];
		}[];
		toggleCollapsible: () => void;
	} = $props();

	let isBetaEnabled = $state(localStorage.getItem('betaFeaturesEnabled') === 'true');
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel class="flex items-center justify-between">
		<div>Platform</div>
		<Button variant="ghost" size="icon-sm" onclick={toggleCollapsible}>
			<ChevronsDownUpIcon size="12" />
		</Button>
	</Sidebar.GroupLabel>
	<Sidebar.Menu>
		<Sidebar.MenuItem>
			<Sidebar.MenuButton>
				{#snippet child({ props })}
					<a href="/" {...props}>
						<House />
						<span>Home</span>
					</a>
				{/snippet}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
		{#each items as item (item.title)}
			{#if (item.isBeta && isBetaEnabled) || !item.isBeta}
				<Collapsible.Root open={item.isActive} class="group/collapsible">
					{#snippet child({ props })}
						<Sidebar.MenuItem {...props}>
							<Collapsible.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuButton {...props} tooltipContent={item.title}>
										{#if item.icon}
											<item.icon />
										{/if}
										<span>{item.title}</span>
										<ChevronRightIcon
											class="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
										/>
									</Sidebar.MenuButton>
								{/snippet}
							</Collapsible.Trigger>
							<Collapsible.Content>
								<Sidebar.MenuSub>
									{#each item.items ?? [] as subItem (subItem.title)}
										{#if (subItem.isBeta && isBetaEnabled) || !subItem.isBeta}
											<Sidebar.MenuSubItem>
												<Sidebar.MenuSubButton isActive={page.url.pathname === subItem.url}>
													{#snippet child({ props })}
														<a
															href={subItem.url}
															{...props}
															aria-current={page.url.pathname === subItem.url}
														>
															<span>{subItem.title}</span>
															{#if subItem.badge}
																<Badge variant="default">{subItem.badge}</Badge>
															{/if}
														</a>
													{/snippet}
												</Sidebar.MenuSubButton>
											</Sidebar.MenuSubItem>
										{/if}
									{/each}
								</Sidebar.MenuSub>
							</Collapsible.Content>
						</Sidebar.MenuItem>
					{/snippet}
				</Collapsible.Root>
			{/if}
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
