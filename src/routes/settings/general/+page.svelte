<script lang="ts">
	import { mode, setMode } from 'mode-watcher';
	import { onMount } from 'svelte';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Label from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';

	let isEnableLoggings = $state(localStorage.getItem('betaFeaturesEnabled') === 'true');

	onMount(async () => {
		value = mode.current;
	});

	$effect(() => {
		localStorage.setItem('betaFeaturesEnabled', isEnableLoggings.toString());
	});

	const themes = [
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' },
		{ value: 'system', label: 'System' }
	];

	let value = $state<'light' | 'dark'>();

	const triggerContent = $derived(
		themes.find((f) => f.value === mode.current)?.label ?? 'Select theme'
	);
	const availableLanguages = [{ value: 'en', label: 'English' }];
	let locale = $state({ current: 'en' });
	const triggerLanguageContent = $state('Select language');
</script>

<h1 class="text-2xl font-bold">General Settings</h1>

<p>Explore application preferences and settings suited for your use case.</p>

<section class="mt-6">
	<div class="grid w-full max-w-sm gap-4">
		<div>
			<Label.Root for="theme" class="text-foreground mb-3">Theme</Label.Root>
			<Select.Root
				type="single"
				name="theme"
				bind:value
				onValueChange={(value) => setMode(value as 'light' | 'dark' | 'system')}
			>
				<Select.Trigger class="w-full">
					{triggerContent}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each themes as theme (theme.value)}
							<Select.Item value={theme.value} label={theme.label}>
								{theme.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>

		<div>
			<Label.Root for="language" class="text-foreground mb-3">Language</Label.Root>
			<Select.Root type="single" name="language" bind:value={locale.current}>
				<Select.Trigger class="w-full">
					{triggerLanguageContent}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each availableLanguages as lang (lang.value)}
							<Select.Item value={lang.value} label={lang.label}>
								{lang.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<Separator class="my-6 max-w-sm" />

	<h2 class="mb-1 text-lg font-semibold">Beta Features</h2>
	<p class="text-muted-foreground mb-4 max-w-sm text-sm">
		Manage your application's beta features and experimental functionalities. Enable or disable
		features that are in development or testing phase.
	</p>

	<div class="flex items-center gap-3">
		<Switch id="beta-features" bind:checked={isEnableLoggings} />
		<Label.Root for="beta-features">Enable Beta Features</Label.Root>
	</div>

	<Separator class="my-6 max-w-sm" />

	<h2 class="mb-1 text-lg font-semibold">Data Management</h2>
	<p class="text-muted-foreground mb-4 max-w-sm text-sm">
		Manage your application's data storage and backup preferences.
	</p>

	<div class="grid w-full max-w-sm gap-4">
		<Button size="sm" variant="outline">Download all as Zip</Button>
	</div>
</section>
