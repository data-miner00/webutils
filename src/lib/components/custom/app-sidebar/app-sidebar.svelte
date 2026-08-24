<script lang="ts">
	import {
		CaseSensitive,
		Code,
		FileCodeCorner,
		ImageIcon,
		MessageCircleCode,
		MessagesSquare,
		Palette,
		ScanSearchIcon,
		ShieldEllipsis
	} from '@lucide/svelte';
	import FrameIcon from '@lucide/svelte/icons/frame';
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end';
	import SquareTerminalIcon from '@lucide/svelte/icons/square-terminal';
	import type { ComponentProps } from 'svelte';

	import * as Kbd from '$lib/components/ui/kbd/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	import NavMain from './nav-main.svelte';
	import NavUser from './nav-user.svelte';

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
		navMain: [
			{
				title: 'General',
				url: '#',
				icon: SquareTerminalIcon,
				isActive: false,
				items: [
					{
						title: 'QR Code Generator',
						url: '/tools/qr-code-generator'
					},
					{
						title: 'Unit Converter',
						url: '/tools/unit-converter',
						badge: 'Beta'
					},
					{
						title: 'Timer & Stopwatch',
						url: '/tools/timer-stopwatch'
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
						title: 'Timestamp Converter',
						url: '/tools/timestamp-converter'
					},
					{
						title: 'Date & Time Calculator',
						url: '/tools/date-difference'
					},
					{
						title: 'Base Converter',
						url: '/tools/base-converter'
					}
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
						url: '/tools/image-format-converter'
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
						title: 'Leading Space Remover',
						url: '/tools/leading-space-remover'
					},
					{
						title: 'Trailing Space Remover',
						url: '/tools/trailing-space-remover'
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
						url: '/tools/certificate-decoder'
					},
					{
						title: 'Card & Email Validator',
						url: '/tools/card-email-validator',
						badge: 'Beta',
						isBeta: true
					},
					{
						title: 'Caesar Cipher',
						url: '/tools/caesar-cipher'
					},
					{
						title: 'Morse Code Translator',
						url: '/tools/morse-code'
					},
					{
						title: 'Vigenère Cipher',
						url: '/tools/vigenere-cipher'
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
						url: '/tools/string-transform'
					},
					{
						title: 'Text Stats',
						url: '/tools/text-stats'
					},
					{
						title: 'Hash Generator',
						url: '/tools/hash-generator'
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
						title: 'Base64 Encoder/Decoder',
						url: '/tools/base64-encoder-decoder'
					},
					{
						title: 'Newline Escaper',
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
						title: 'Whiteboard',
						url: '/tools/whiteboard',
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
						url: '/tools/css-formatter'
					},
					{
						title: 'HTML Viewer',
						url: '/tools/html-viewer'
					},
					{
						title: 'HTML Formatter',
						url: '/tools/html-formatter'
					},
					{
						title: 'JavaScript Formatter',
						url: '/tools/js-formatter'
					},
					{
						title: 'JSON Formatter',
						url: '/tools/json-formatter'
					},
					{
						title: 'Markdown Viewer',
						url: '/tools/markdown-viewer'
					},
					{
						title: 'SQL Formatter',
						url: '/tools/sql-formatter'
					},
					{
						title: 'YAML to JSON Converter',
						url: '/tools/yaml-to-json'
					},
					{
						title: 'JSON to XML Converter',
						url: '/tools/json-to-xml'
					}
				]
			},
			{
				title: 'Design',
				url: '#',
				icon: Palette,
				items: [
					{
						title: 'Lorem Ipsum Generator',
						url: '/tools/lorem-ipsum-generator'
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
				items: [{ title: 'Localhost Manager', url: '/tools/localhost-manager' }]
			},
			{
				title: 'Lookup',
				url: '#',
				icon: ScanSearchIcon,
				items: [
					{ title: 'World Clock', url: '/tools/world-clock' },
					{
						title: 'Emoji Picker',
						url: '/tools/emoji-picker'
					},
					{
						title: 'Unicode Lookup',
						url: '/tools/unicode-lookup'
					},
					{
						title: 'Country Lookup',
						url: '/tools/country-lookup'
					},
					{
						title: 'Calendar',
						url: '/tools/calendar'
					},
					{
						title: 'HTTP Status Code Lookup',
						url: '/tools/http-status-codes'
					},
					{
						title: 'Weather',
						url: '/tools/weather'
					}
				]
			},
			{
				title: 'Management',
				url: '#',
				icon: FrameIcon,
				items: [
					{ title: 'Notes', url: '/manage/notes', isBeta: true, badge: 'Beta' },
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
						url: '/manage/todo',
						badge: 'Beta',
						isBeta: true
					}
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

	const sidebar = Sidebar.useSidebar();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					size="lg"
					class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div
						class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
					>
						<GalleryVerticalEndIcon class="size-4" />
					</div>
					<div class="grid flex-1 text-start text-sm leading-tight">
						<span class="truncate font-medium">{savedCompanyName}</span>
						<span class="truncate text-xs italic">Bonjour</span>
					</div>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} {toggleCollapsible} />
	</Sidebar.Content>
	<Sidebar.Footer>
		{#if sidebar.open}
			<div class="text-muted-foreground ml-2 text-sm">
				<Kbd.Kbd>Ctrl</Kbd.Kbd> + <Kbd.Kbd>K</Kbd.Kbd> to search internet
			</div>
		{/if}
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
