<script lang="ts">
	import {
		AsteriskIcon,
		BinaryIcon,
		Brush,
		CalendarDays,
		CaseSensitive,
		ChevronsLeftRightEllipsis,
		CircleCheck,
		ClipboardIcon,
		Clock10,
		Clock10Icon,
		CloudIcon,
		CodeIcon,
		DiffIcon,
		EarthIcon,
		FrameIcon,
		HouseIcon,
		type IconProps,
		ImageIcon,
		Link,
		Link2Icon,
		ListIcon,
		LockIcon,
		QrCode,
		RefreshCcw,
		Ruler,
		Settings2Icon,
		ShieldCheck,
		ShieldEllipsis,
		SpaceIcon,
		SquareAsterisk,
		TimerIcon,
		UserRoundPenIcon
	} from '@lucide/svelte';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import SmileIcon from '@lucide/svelte/icons/smile';
	import type { Component } from 'svelte';

	import { goto } from '$app/navigation';
	import * as Command from '$lib/components/ui/command/index.js';
	import { appState } from '$lib/states.svelte';

	type Props = {
		isCommandOpen: boolean;
		isClipboardOpen: boolean;
	};

	let { isCommandOpen = $bindable(false), isClipboardOpen = $bindable(false) }: Props = $props();

	function gotoPage(path: string) {
		goto(path);
		isCommandOpen = false;
	}

	type CommandItem = {
		onSelect: () => void;
		title: string;
		icon: Component<IconProps, {}, ''>;
	};

	type CommandSection = {
		heading: string;
		items: CommandItem[];
	};

	const commandSections: CommandSection[] = [
		{
			heading: 'Suggestions',
			items: [
				{
					title: 'Calendar',
					icon: CalendarIcon,
					onSelect() {
						gotoPage('/tools/calendar');
					}
				},
				{
					title: 'Search Emoji',
					icon: SmileIcon,
					onSelect() {
						gotoPage('/tools/emoji-picker');
					}
				},
				{
					title: 'Clock',
					icon: Clock10,
					onSelect() {
						gotoPage('/tools/world-clock');
					}
				},
				{
					title: 'Reload Page',
					icon: RefreshCcw,
					onSelect() {
						window.location.reload();
					}
				}
			]
		},
		{
			heading: 'Settings',
			items: [
				{
					title: 'General Settings',
					icon: Settings2Icon,
					onSelect() {
						gotoPage('/settings/general');
					}
				},
				{
					title: 'Profile',
					icon: UserRoundPenIcon,
					onSelect() {
						gotoPage('/settings/profile');
					}
				},
				{
					title: 'Home Page',
					icon: HouseIcon,
					onSelect() {
						gotoPage('/settings/home');
					}
				}
			]
		},
		{
			heading: 'General',
			items: [
				{
					title: 'QR Code Generator',
					icon: QrCode,
					onSelect() {
						gotoPage('/tools/qr-code-generator');
					}
				},
				{
					title: 'Unit Converter',
					icon: Ruler,
					onSelect() {
						gotoPage('/tools/unit-converter');
					}
				},
				{
					title: 'Timer & Stopwatch',
					icon: TimerIcon,
					onSelect() {
						gotoPage('/tools/timer-stopwatch');
					}
				},
				{
					title: 'URL Parser',
					icon: Link,
					onSelect() {
						gotoPage('/tools/url-parser');
					}
				},
				{
					title: 'UUID',
					icon: SquareAsterisk,
					onSelect() {
						gotoPage('/tools/uuid');
					}
				},
				{
					title: 'Timestamp Converter',
					icon: Clock10,
					onSelect() {
						gotoPage('/tools/timestamp-converter');
					}
				},
				{
					title: 'Base Converter',
					icon: BinaryIcon,
					onSelect() {
						gotoPage('/tools/base-converter');
					}
				},
				{
					title: 'Localhost Manager',
					icon: CodeIcon,
					onSelect() {
						gotoPage('/tools/localhost-manager');
					}
				},
				{
					title: 'Date & Time Calculator',
					icon: CalendarDays,
					onSelect() {
						gotoPage('/tools/date-difference');
					}
				}
			]
		},
		{
			heading: 'Manage',
			items: [
				{
					title: 'Notes',
					icon: FrameIcon,
					onSelect() {
						gotoPage('/manage/notes');
					}
				},
				{
					title: 'Links Collection',
					icon: Link2Icon,
					onSelect() {
						gotoPage('/manage/links');
					}
				},
				{
					title: 'Secrets',
					icon: LockIcon,
					onSelect() {
						gotoPage('/manage/secrets');
					}
				},
				{
					title: 'Todo List',
					icon: ListIcon,
					onSelect() {
						gotoPage('/manage/todo');
					}
				},
				{
					title: 'Settings',
					icon: Settings2Icon,
					onSelect() {
						gotoPage('/settings');
					}
				}
			]
		},
		{
			heading: 'Lookup',
			items: [
				{
					title: 'World Clock & Time',
					icon: Clock10Icon,
					onSelect() {
						gotoPage('/tools/world-clock');
					}
				},
				{
					title: 'Search Emoji',
					icon: SmileIcon,
					onSelect() {
						gotoPage('/tools/emoji-picker');
					}
				},
				{
					title: 'Unicode List',
					icon: AsteriskIcon,
					onSelect() {
						gotoPage('/tools/unicode-lookup');
					}
				},
				{
					title: 'Country',
					icon: EarthIcon,
					onSelect() {
						gotoPage('/tools/country-lookup');
					}
				},
				{
					title: 'Calendar',
					icon: CalendarDays,
					onSelect() {
						gotoPage('/tools/calendar');
					}
				},
				{
					title: 'HTTP Status Code Lookup',
					icon: ChevronsLeftRightEllipsis,
					onSelect() {
						gotoPage('/tools/http-status-codes');
					}
				},
				{
					title: 'Weather',
					icon: CloudIcon,
					onSelect() {
						gotoPage('/tools/weather');
					}
				}
			]
		},
		{
			heading: 'Image',
			items: [
				{
					title: 'Base64 Image Converter',
					icon: ImageIcon,
					onSelect() {
						gotoPage('/tools/base64-image');
					}
				},
				{
					title: 'Image Format Converter',
					icon: ImageIcon,
					onSelect() {
						gotoPage('/tools/image-format-converter');
					}
				},
				{
					title: 'Image Resizer',
					icon: ImageIcon,
					onSelect() {
						gotoPage('/tools/image-resizer');
					}
				},
				{
					title: 'Image Compressor',
					icon: ImageIcon,
					onSelect() {
						gotoPage('/tools/image-compressor');
					}
				},
				{
					title: 'Calendar',
					icon: CalendarDays,
					onSelect() {
						gotoPage('/tools/calendar');
					}
				}
			]
		},
		{
			heading: 'Code Review',
			items: [
				{
					title: 'Leading Space Remover',
					icon: SpaceIcon,
					onSelect() {
						gotoPage('/tools/leading-space-remover');
					}
				},
				{
					title: 'Trailing Space Remover',
					icon: SpaceIcon,
					onSelect() {
						gotoPage('/tools/trailing-space-remover');
					}
				},
				{
					title: 'Text Difference',
					icon: DiffIcon,
					onSelect() {
						gotoPage('/tools/text-diff');
					}
				},
				{
					title: 'Remove Empty Lines',
					icon: SpaceIcon,
					onSelect() {
						gotoPage('/tools/empty-line-remover');
					}
				}
			]
		},
		{
			heading: 'Security & Auth',
			items: [
				{
					title: 'JWT Debugger',
					icon: ShieldEllipsis,
					onSelect() {
						gotoPage('/tools/jwt-debugger');
					}
				},
				{
					title: 'Certificate Decoder',
					icon: ShieldCheck,
					onSelect() {
						gotoPage('/tools/certificate-decoder');
					}
				},
				{
					title: 'Card & Email Validator',
					icon: CircleCheck,
					onSelect() {
						gotoPage('/tools/card-email-validator');
					}
				},
				{
					title: 'Caesar Cipher',
					icon: ShieldEllipsis,
					onSelect() {
						gotoPage('/tools/caesar-cipher');
					}
				},
				{
					title: 'Morse Code Translator',
					icon: ShieldEllipsis,
					onSelect() {
						gotoPage('/tools/morse-code');
					}
				}
			]
		},
		{
			heading: 'Text',
			items: [
				{
					title: 'Transformation',
					icon: CaseSensitive,
					onSelect() {
						gotoPage('/tools/string-transform');
					}
				},
				{
					title: 'Statistics',
					icon: CaseSensitive,
					onSelect() {
						gotoPage('/tools/text-stats');
					}
				},
				{
					title: 'Hash Generator',
					icon: CaseSensitive,
					onSelect() {
						gotoPage('/tools/hash-generator');
					}
				},
				{
					title: 'Unicode to Hex',
					icon: CaseSensitive,
					onSelect() {
						gotoPage('/tools/unicode-hex');
					}
				},

				{
					title: 'Sort List',
					icon: CaseSensitive,
					onSelect() {
						gotoPage('/tools/sort-list');
					}
				},
				{
					title: 'Base64 Encoder/Decoder',
					icon: CaseSensitive,
					onSelect() {
						gotoPage('/tools/base64-encoder-decoder');
					}
				},
				{
					title: 'Newline Escaper',
					icon: CaseSensitive,
					onSelect() {
						gotoPage('/tools/newline-escaper');
					}
				}
			]
		},
		{
			heading: 'Discussion',
			items: [
				{
					title: 'Whiteboard',
					icon: Brush,
					onSelect() {
						gotoPage('/tools/whiteboard');
					}
				}
			]
		},
		{
			heading: 'Web',
			items: [
				{
					title: 'CSS Formatter',
					icon: CodeIcon,
					onSelect() {
						gotoPage('/tools/css-formatter');
					}
				},
				{
					title: 'HTML Viewer',
					icon: CodeIcon,
					onSelect() {
						gotoPage('/tools/html-viewer');
					}
				},
				{
					title: 'HTML Formatter',
					icon: CodeIcon,
					onSelect() {
						gotoPage('/tools/html-formatter');
					}
				},
				{
					title: 'JavaScript Formatter',
					icon: CodeIcon,
					onSelect() {
						gotoPage('/tools/js-formatter');
					}
				},
				{
					title: 'JSON Formatter',
					icon: CodeIcon,
					onSelect() {
						gotoPage('/tools/json-formatter');
					}
				},
				{
					title: 'Markdown Viewer',
					icon: CodeIcon,
					onSelect() {
						gotoPage('/tools/markdown-viewer');
					}
				},
				{
					title: 'SQL Formatter',
					icon: CodeIcon,
					onSelect() {
						gotoPage('/tools/sql-formatter');
					}
				},
				{
					title: 'YAML to JSON Converter',
					icon: CodeIcon,
					onSelect() {
						gotoPage('/tools/yaml-to-json');
					}
				},
				{
					title: 'JSON to XML Converter',
					icon: CodeIcon,
					onSelect() {
						gotoPage('/tools/json-to-xml');
					}
				}
			]
		},
		{
			heading: 'Design',
			items: [
				{
					title: 'Lorem Ipsum Generator',
					icon: FrameIcon,
					onSelect() {
						gotoPage('/tools/lorem-ipsum-generator');
					}
				},
				{
					title: 'Color Converter',
					icon: FrameIcon,
					onSelect() {
						gotoPage('/tools/color-converter');
					}
				}
			]
		}
	];

	if (appState.isEnableClipboardHistory) {
		commandSections[0].items.push({
			title: 'Open Clipboard History',
			icon: ClipboardIcon,
			onSelect() {
				isClipboardOpen = true;
				isCommandOpen = false;
			}
		});
	}
</script>

<Command.Dialog bind:open={isCommandOpen}>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>

		{#each commandSections as section, index}
			<Command.Group heading={section.heading}>
				{#each section.items as item}
					<Command.Item onSelect={item.onSelect}>
						<item.icon class="me-2 size-4" />
						<span>{item.title}</span>
					</Command.Item>
				{/each}
			</Command.Group>

			{#if index != commandSections.length - 1}
				<Command.Separator />
			{/if}
		{/each}
	</Command.List>
</Command.Dialog>
