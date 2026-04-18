<script lang="ts">
	import {
		CaseSensitive,
		Code,
		FileCodeCorner,
		ImageIcon,
		MessageCircleCode,
		MessagesSquare,
		Palette,
		ShieldEllipsis
	} from '@lucide/svelte';
	import AudioWaveformIcon from '@lucide/svelte/icons/audio-waveform';
	import BotIcon from '@lucide/svelte/icons/bot';
	import CommandIcon from '@lucide/svelte/icons/command';
	import FrameIcon from '@lucide/svelte/icons/frame';
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end';
	import SquareTerminalIcon from '@lucide/svelte/icons/square-terminal';
	import type { ComponentProps } from 'svelte';

	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	import NavMain from './nav-main.svelte';
	import NavUser from './nav-user.svelte';
	import TeamSwitcher from './team-switcher.svelte';

	const savedUsername = localStorage.getItem('settings_username') || 'User';
	const savedEmail = localStorage.getItem('settings_email') || 'me@gmail.com';
	const savedAvatarUrl = localStorage.getItem('settings_avatarUrl') || 'notexist.jpg';
	const savedCompanyName = localStorage.getItem('settings_companyName') || 'Acme Inc.';
	const data = $state({
		user: {
			name: savedUsername,
			email: savedEmail,
			avatar: savedAvatarUrl
		},
		teams: [
			{
				name: savedCompanyName,
				logo: GalleryVerticalEndIcon,
				plan: 'Enterprise'
			},
			{
				name: savedCompanyName,
				logo: AudioWaveformIcon,
				plan: 'Startup'
			},
			{
				name: savedCompanyName,
				logo: CommandIcon,
				plan: 'Free'
			}
		],
		navMain: [
			{
				title: 'General',
				url: '#',
				icon: SquareTerminalIcon,
				isActive: false,
				items: [
					{
						title: 'QR Code',
						url: '/tools/qr-code'
					},
					{
						title: 'Unit Conversion',
						url: '/tools/conversion',
						badge: 'Beta'
					},
					{
						title: 'Timer / Stopwatch',
						url: '/tools/timer'
					},
					{
						title: 'URL Parser',
						url: '/tools/url-parser'
					},
					{
						title: 'UUID Generator',
						url: '/tools/uuid'
					},
					{
						title: 'Timestamp',
						url: '/tools/timestamp'
					},
					{
						title: 'Base Converter',
						url: '/tools/baseN'
					},
					{
						title: 'Regex Tester',
						url: '/tools/regex',
						isBeta: true
					}
					// {
					// 	title: 'Password Generator',
					// 	url: '/tools/password-generator'
					// }
				]
			},
			{
				title: 'Image',
				url: '#',
				icon: ImageIcon,
				items: [
					{
						title: 'Base64 Image Converter',
						url: '/tools/base64-image'
					},
					{
						title: 'Image Format Converter',
						url: '/tools/image-converter'
					},
					{
						title: 'Image Resizer',
						url: '/tools/image-resizer'
					},
					{
						title: 'Image Compressor',
						url: '/tools/image-compressor'
					}
				]
			},
			{
				title: 'Code Review',
				url: '#',
				icon: MessageCircleCode,
				items: [
					{
						title: 'Leading Space',
						url: '/tools/leading-space'
					},
					{
						title: 'Trailing Space',
						url: '/tools/trailing-space'
					},
					{
						title: 'Text Diff',
						url: '/tools/text-diff'
					},
					{
						title: 'Empty Line Remover',
						url: '/tools/empty-line-remover'
					}
				]
			},
			{
				title: 'Security & Auth',
				url: '#',
				icon: ShieldEllipsis,
				items: [
					{
						title: 'JWT Debugger',
						url: '/tools/jwt-debugger'
					},
					{
						title: 'Certificate Decoder',
						url: '/tools/certificate'
					},
					{
						title: 'Verify',
						url: '/tools/verify',
						badge: 'Beta',
						isBeta: true
					},
					{
						title: 'Caesar Cipher',
						url: '/tools/caesar'
					}
				]
			},
			{
				title: 'Text',
				url: '#',
				icon: CaseSensitive,
				items: [
					{
						title: 'String Transform',
						url: '/tools/strings'
					},
					{
						title: 'Text Stats',
						url: '/tools/text-stats'
					},
					{
						title: 'Hash String',
						url: '/tools/hash'
					},
					{
						title: 'Unicode to Hex',
						url: '/tools/unicode-hex'
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
						title: 'Newline Escape',
						url: '/tools/newline-escaper'
					}
				]
			},
			{
				title: 'Discussion',
				url: '#',
				icon: MessagesSquare,
				isBeta: true,
				items: [
					{
						title: 'Draw',
						url: '/tools/draw',
						badge: 'Beta'
					}
				]
			},
			{
				title: 'Web',
				url: '#',
				icon: FileCodeCorner,
				items: [
					{
						title: 'CSS Formatter',
						url: '/tools/css'
					},
					{
						title: 'HTML Viewer',
						url: '/tools/html-viewer'
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
						title: 'Markdown Viewer',
						url: '/tools/markdown-viewer'
					},
					{
						title: 'SQL Formatter',
						url: '/tools/sql'
					},
					{
						title: 'YAML to JSON',
						url: '/tools/yaml'
					},
					{
						title: 'XML Converter',
						url: '/tools/xml'
					}
				]
			},
			{
				title: 'Design',
				url: '#',
				icon: Palette,
				items: [
					{
						title: 'Lorem Ipsum',
						url: '/tools/lorem'
					},
					{
						title: 'Color Converter',
						url: '/tools/color-converter'
					}
				]
			},
			{
				title: 'Development',
				url: '#',
				icon: Code,
				items: [{ title: 'Localhost', url: '/tools/localhost' }]
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
					},
					{
						title: 'Calendar',
						url: '/tools/calendar'
					},
					{
						title: 'HTTP Code',
						url: '/tools/http-code'
					}
				]
			},
			{
				title: 'Management',
				url: '#',
				icon: FrameIcon,
				items: [
					{ title: 'Notes', url: '/manage/notes' },
					{
						title: 'Links',
						url: '/manage/links'
					},
					{
						title: 'Secrets',
						url: '/manage/secrets'
					},
					{
						title: 'Todo List',
						url: '/manage/todo'
					}
					// {
					// 	name: 'Kanban',
					// 	url: '#',
					// },
				]
			}
		]
	});

	function toggleCollapsible() {
		for (let i = 0; i < data.navMain.length; i++) {
			data.navMain[i].isActive = !data.navMain[i].isActive;
		}
	}

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
		<NavMain items={data.navMain} {toggleCollapsible} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
