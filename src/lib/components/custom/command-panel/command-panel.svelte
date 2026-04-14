<script lang="ts">
	import {
		AsteriskIcon,
		BinaryIcon,
		Brush,
		CalendarDays,
		CaseSensitive,
		ChevronsLeftRightEllipsis,
		CircleCheck,
		Clock10,
		Clock10Icon,
		CodeIcon,
		DiffIcon,
		EarthIcon,
		FrameIcon,
		type IconProps,
		ImageIcon,
		Link,
		Link2Icon,
		ListIcon,
		LockIcon,
		QrCode,
		Ruler,
		Settings2Icon,
		ShieldCheck,
		ShieldEllipsis,
		SpaceIcon,
		SquareAsterisk,
		TimerIcon
	} from '@lucide/svelte';
	import CalculatorIcon from '@lucide/svelte/icons/calculator';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import SmileIcon from '@lucide/svelte/icons/smile';
	import type { Component } from 'svelte';

	import { goto } from '$app/navigation';
	import * as Command from '$lib/components/ui/command/index.js';

	type Props = {
		isCommandOpen: boolean;
	};

	let { isCommandOpen = $bindable(false) }: Props = $props();

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
						gotoPage('/tools/emoji');
					}
				},
				{
					title: 'Clock',
					icon: Clock10,
					onSelect() {
						gotoPage('/tools/clock');
					}
				},
				{
					title: 'Calculator',
					icon: CalculatorIcon,
					onSelect() {
						// nothing yet
					}
				}
			]
		},
		{
			heading: 'General',
			items: [
				{
					title: 'QR Code',
					icon: QrCode,
					onSelect() {
						gotoPage('/tools/qr-code');
					}
				},
				{
					title: 'Unit Conversion',
					icon: Ruler,
					onSelect() {
						gotoPage('/tools/conversion');
					}
				},
				{
					title: 'Timer & Stopwatch',
					icon: TimerIcon,
					onSelect() {
						gotoPage('/tools/timer');
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
					title: 'Timestamp',
					icon: Clock10,
					onSelect() {
						gotoPage('/tools/timestamp');
					}
				},
				{
					title: 'Base Converter',
					icon: BinaryIcon,
					onSelect() {
						gotoPage('/tools/baseN');
					}
				},
				{
					title: 'Localhost',
					icon: CodeIcon,
					onSelect() {
						gotoPage('/tools/localhost');
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
						gotoPage('/tools/clock');
					}
				},
				{
					title: 'Search Emoji',
					icon: SmileIcon,
					onSelect() {
						gotoPage('/tools/emoji');
					}
				},
				{
					title: 'Unicode List',
					icon: AsteriskIcon,
					onSelect() {
						gotoPage('/tools/unicode');
					}
				},
				{
					title: 'Country',
					icon: EarthIcon,
					onSelect() {
						gotoPage('/tools/country');
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
					title: 'HTTP Codes',
					icon: ChevronsLeftRightEllipsis,
					onSelect() {
						gotoPage('/tools/http-code');
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
						gotoPage('/tools/image-converter');
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
					title: 'Leading Space',
					icon: SpaceIcon,
					onSelect() {
						gotoPage('/tools/leading-space');
					}
				},
				{
					title: 'Trailing Space',
					icon: SpaceIcon,
					onSelect() {
						gotoPage('/tools/trailing-space');
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
						gotoPage('/tools/remove-empty-lines');
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
						gotoPage('/tools/certificate');
					}
				},
				{
					title: 'Verify',
					icon: CircleCheck,
					onSelect() {
						gotoPage('/tools/verify');
					}
				},
				{
					title: 'Caesar Cipher',
					icon: ShieldEllipsis,
					onSelect() {
						gotoPage('/tools/caesar');
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
						gotoPage('/tools/strings');
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
					title: 'Hashing',
					icon: CaseSensitive,
					onSelect() {
						gotoPage('/tools/hash');
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
					title: 'Base64',
					icon: CaseSensitive,
					onSelect() {
						gotoPage('/tools/base64');
					}
				},
				{
					title: 'Newline Escape',
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
					title: 'Draw',
					icon: Brush,
					onSelect() {
						gotoPage('/tools/draw');
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
						gotoPage('/tools/css');
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
						gotoPage('/tools/html');
					}
				},
				{
					title: 'JavaScript Formatter',
					icon: CodeIcon,
					onSelect() {
						gotoPage('/tools/js');
					}
				},
				{
					title: 'JSON Formatter',
					icon: CodeIcon,
					onSelect() {
						gotoPage('/tools/json');
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
						gotoPage('/tools/sql');
					}
				},
				{
					title: 'YAML to JSON',
					icon: CodeIcon,
					onSelect() {
						gotoPage('/tools/yaml');
					}
				},
				{
					title: 'XML Converter',
					icon: CodeIcon,
					onSelect() {
						gotoPage('/tools/xml');
					}
				}
			]
		},
		{
			heading: 'Design',
			items: [
				{
					title: 'Lorem Ipsum',
					icon: FrameIcon,
					onSelect() {
						gotoPage('/tools/lorem');
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
		<!-- <Command.Group heading="Settings">
			<Command.Item>
				<UserIcon class="me-2 size-4" />
				<span>Profile</span>
				<Command.Shortcut>⌘P</Command.Shortcut>
			</Command.Item>
			<Command.Item>
				<CreditCardIcon class="me-2 size-4" />
				<span>Billing</span>
				<Command.Shortcut>⌘B</Command.Shortcut>
			</Command.Item>
			<Command.Item onSelect={onSelectSettings}>
				<SettingsIcon class="me-2 size-4" />
				<span>Settings</span>
				<Command.Shortcut>⌘S</Command.Shortcut>
			</Command.Item>
		</Command.Group> -->
	</Command.List>
</Command.Dialog>
