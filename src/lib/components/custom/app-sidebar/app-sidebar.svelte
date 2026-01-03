<script lang="ts" module>
	import AudioWaveformIcon from '@lucide/svelte/icons/audio-waveform';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import BotIcon from '@lucide/svelte/icons/bot';
	import ChartPieIcon from '@lucide/svelte/icons/chart-pie';
	import CommandIcon from '@lucide/svelte/icons/command';
	import FrameIcon from '@lucide/svelte/icons/frame';
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end';
	import MapIcon from '@lucide/svelte/icons/map';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import SquareTerminalIcon from '@lucide/svelte/icons/square-terminal';

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
						title: 'Quantum',
						url: '#'
					}
				]
			},
			{
				title: 'Management',
				url: '#',
				icon: BookOpenIcon,
				items: [
					{
						title: 'Notes',
						url: '/manage/notes'
					},
					{
						title: 'Pomodoro Timer',
						url: '#'
					},
					{
						title: 'Kanban',
						url: '#'
					},
					{
						title: 'Links',
						url: '/manage/links'
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
				name: 'Design Engineering',
				url: '#',
				icon: FrameIcon
			},
			{
				name: 'Sales & Marketing',
				url: '#',
				icon: ChartPieIcon
			},
			{
				name: 'Travel',
				url: '#',
				icon: MapIcon
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
