<script lang="ts" module>
	import AudioWaveformIcon from '@lucide/svelte/icons/audio-waveform';
	import BotIcon from '@lucide/svelte/icons/bot';
	import ChartPieIcon from '@lucide/svelte/icons/chart-pie';
	import CommandIcon from '@lucide/svelte/icons/command';
	import FrameIcon from '@lucide/svelte/icons/frame';
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end';
	import MapIcon from '@lucide/svelte/icons/map';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import SquareTerminalIcon from '@lucide/svelte/icons/square-terminal';
	import { LockIcon, ListIcon } from '@lucide/svelte';

	const savedUsername = localStorage.getItem('settings_username') ?? 'User';
	const savedEmail = localStorage.getItem('settings_email') ?? 'me@gmail.com';
	const savedAvatarUrl = localStorage.getItem('settings_avatarUrl') ?? 'notexist.jpg';
	const data = {
		user: {
			name: savedUsername,
			email: savedEmail,
			avatar: savedAvatarUrl
		},
		teams: [
			{
				name: 'Acme Inc',
				logo: GalleryVerticalEndIcon,
				plan: 'Enterprise'
			},
			{
				name: 'Acme Corp.',
				logo: AudioWaveformIcon,
				plan: 'Startup'
			},
			{
				name: 'Evil Corp.',
				logo: CommandIcon,
				plan: 'Free'
			}
		],
		navMain: [
			{
				title: 'General',
				url: '#',
				icon: SquareTerminalIcon,
				isActive: true,
				items: [
					{
						title: 'Lorem Ipsum',
						url: '/tools/lorem'
					},
					{
						title: 'JWT Debugger',
						url: '/tools/jwt-debugger'
					},
					{
						title: 'Space Trimmer',
						url: '/tools/leading-space'
					},
					{
						title: 'Hashing',
						url: '/tools/hash'
					},
					{
						title: 'QR Code',
						url: '/tools/qr-code'
					},
					{
						title: 'Transformation',
						url: '/tools/strings'
					},
					{
						title: 'Verify',
						url: '/tools/verify'
					},
					{
						title: 'Conversion',
						url: '/tools/conversion'
					},
					{
						title: 'Text Stats',
						url: '/tools/text-stats'
					},
					{
						title: 'Text Diff',
						url: '/tools/text-diff'
					},
					{
						title: 'Sort list',
						url: '/tools/sort-list'
					},
					{
						title: 'Base64',
						url: '/tools/base64'
					},
					{
						title: 'CSS Formatter',
						url: '/tools/css'
					},
					{
						title: 'HTML Formatter',
						url: '/tools/html'
					},
					{
						title: 'JavaScript Formatter',
						url: '/tools/js'
					},
					{
						title: 'JSON Formatter',
						url: '/tools/json'
					},
					{
						title: 'YAML to JSON',
						url: '/tools/yaml'
					},
					{
						title: 'Timer / Stopwatch',
						url: '/tools/timer'
					},
					{
						title: 'Base64 Image Converter',
						url: '/tools/base64-image'
					}
				]
			},
			{
				title: 'Lookup',
				url: '#',
				icon: BotIcon,
				items: [
					{ title: 'Clock', url: '/tools/clock' },
					{
						title: 'Emoji',
						url: '/tools/emoji'
					},
					{
						title: 'Unicode',
						url: '/tools/unicode'
					},
					{
						title: 'Country',
						url: '/tools/country'
					}
				]
			},
			{
				title: 'Settings',
				url: '#',
				icon: Settings2Icon,
				items: [
					{
						title: 'General',
						url: '#'
					},
					{
						title: 'Team',
						url: '#'
					},
					{
						title: 'Billing',
						url: '#'
					},
					{
						title: 'Limits',
						url: '#'
					}
				]
			}
		],
		projects: [
			{
				name: 'Notes',
				url: '/manage/notes',
				icon: FrameIcon
			},
			{
				name: 'Links',
				url: '/manage/links',
				icon: ChartPieIcon
			},
			{
				name: 'Kanban',
				url: '#',
				icon: MapIcon
			},
			{
				name: 'Secrets',
				url: '#',
				icon: LockIcon
			},
			{
				name: 'Todo List',
				url: '/manage/todo',
				icon: ListIcon
			}
		]
	};
</script>

<script lang="ts">
	import NavMain from './nav-main.svelte';
	import NavProjects from './nav-projects.svelte';
	import NavUser from './nav-user.svelte';
	import TeamSwitcher from './team-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher teams={data.teams} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavProjects projects={data.projects} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
