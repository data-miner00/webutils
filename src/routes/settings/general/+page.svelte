<script lang="ts">
	import { type SystemModeValue } from 'mode-watcher';
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input';
	import * as Label from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { availableLanguages, themes } from '$lib/constants';
	import {
		appState,
		setClipboardHistoryMaxItems,
		setIsEnableBetaFeatures,
		setIsEnableClipboardHistory,
		setIsEnablePokemonEasterEgg,
		setLanguage,
		setTheme
	} from '$lib/states.svelte';
	import { type Language } from '$lib/types';

	const triggerContent = $derived(
		themes.find((f) => f.value === tempTheme)?.label ?? 'Select theme'
	);

	let tempBetaEnabled = $state(appState.isEnableBetaFeatures);
	let tempTheme = $state<SystemModeValue>(appState.theme);
	let tempLang = $state<Language>(appState.language);
	let tempClipboardCount = $state<number>(appState.clipboardHistoryMaxItems);
	const triggerLanguageContent = $derived(
		availableLanguages.find((x) => x.value === tempLang)?.label || 'Select language'
	);

	let tempClipboardEnabled = $state(appState.isEnableClipboardHistory);
	let tempPokemonEasterEggEnabled = $state(appState.isEnablePokemonEasterEgg);

	function saveChanges() {
		setLanguage(tempLang);
		setTheme(tempTheme === undefined ? 'system' : tempTheme);
		setIsEnableBetaFeatures(tempBetaEnabled);
		setClipboardHistoryMaxItems(tempClipboardCount);
		setIsEnableClipboardHistory(tempClipboardEnabled);
		setIsEnablePokemonEasterEgg(tempPokemonEasterEggEnabled);
		toast.success('Settings saved successfully!');
	}
</script>

<h1 class="text-2xl font-bold">General Settings</h1>

<p>Explore application preferences and settings suited for your use case.</p>

<section class="mt-6 max-w-sm">
	<div class="grid w-full gap-4">
		<div>
			<Label.Root for="theme" class="text-foreground mb-3">Theme</Label.Root>
			<Select.Root type="single" name="theme" bind:value={tempTheme}>
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
			<Select.Root type="single" name="language" bind:value={tempLang}>
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

		<div class="mb-6 flex items-center gap-3">
			<Switch id="pokemon-easter-egg" bind:checked={tempPokemonEasterEggEnabled} />
			<Label.Root for="pokemon-easter-egg">Enable Pokemon Easter Egg</Label.Root>
		</div>
	</div>

	<Separator class="my-6" />

	<h2 class="mb-1 text-lg font-semibold">Beta Features</h2>
	<p class="text-muted-foreground mb-4 text-sm">
		Manage your application's beta features and experimental functionalities. Enable or disable
		features that are in development or testing phase.
	</p>

	<div class="flex items-center gap-3">
		<Switch id="beta-features" bind:checked={tempBetaEnabled} />
		<Label.Root for="beta-features">Enable Beta Features</Label.Root>
	</div>

	<Separator class="my-6 " />

	<h2 class="mb-1 text-lg font-semibold">Clipboard</h2>
	<p class="text-muted-foreground mb-4 text-sm">
		Manage your clipboard settings that might be helpful when using the app.
	</p>

	<div class="mb-6 flex items-center gap-3">
		<Switch id="clipboard-history" bind:checked={tempClipboardEnabled} />
		<Label.Root for="clipboard-history">Enable Clipboard History</Label.Root>
	</div>

	<Label.Root class="mb-3" for="port">History Count</Label.Root>
	<Input
		name="clipboard-count"
		placeholder="e.g. 30"
		min={1}
		max={30}
		bind:value={tempClipboardCount}
		type="number"
		class="mb-4"
	/>

	<Separator class="my-6 " />

	<div class="grid w-full gap-4">
		<Button size="sm" variant="outline" onclick={saveChanges}>Save Changes</Button>
	</div>
</section>
