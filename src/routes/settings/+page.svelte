<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { onMount } from 'svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let username = $state('');
	let email = $state('');
	let avatarUrl = $state('');
	let pokemon = $state(false);
	let companyName = $state('');

	onMount(() => {
		const savedUsername = localStorage.getItem('settings_username');
		const savedEmail = localStorage.getItem('settings_email');
		const savedAvatarUrl = localStorage.getItem('settings_avatarUrl');
		const savedPokemon = localStorage.getItem('settings_pokemon');
		const savedCompanyName = localStorage.getItem('settings_companyName');
		if (savedPokemon) pokemon = savedPokemon === 'true';
		if (savedUsername) username = savedUsername;
		if (savedEmail) email = savedEmail;
		if (savedAvatarUrl) avatarUrl = savedAvatarUrl;
		if (savedCompanyName) companyName = savedCompanyName;
	});

	$effect(() => {
		localStorage.setItem('settings_username', username);
		localStorage.setItem('settings_email', email);
		localStorage.setItem('settings_avatarUrl', avatarUrl);
		localStorage.setItem('settings_pokemon', pokemon.toString());
		localStorage.setItem('settings_companyName', companyName);
	});
</script>

<h1 class="text-2xl font-bold">Settings</h1>

<div class="mt-4 space-y-4 max-w-md">
	<div class="mb-4">
		<label for="username" class="block text-sm font-medium text-gray-700">Username</label>
		<Input
			id="username"
			type="text"
			bind:value={username}
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			placeholder="Enter your username"
		/>
	</div>

	<div class="mb-4">
		<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
		<Input
			id="email"
			type="email"
			bind:value={email}
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			placeholder="Enter your email"
		/>
	</div>

	<div class="mb-4">
		<label for="avatarUrl" class="block text-sm font-medium text-gray-700">Avatar URL</label>
		<Input
			id="avatarUrl"
			type="text"
			bind:value={avatarUrl}
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			placeholder="Enter your avatar URL"
		/>
	</div>

	<div class="mb-4">
		<label for="hideIpByDefault" class="block text-sm font-medium text-gray-700"
			>Hide IP by Default</label
		>
		<Input
			id="hideIpByDefault"
			type="text"
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			placeholder="Whether to hide IP addresses by default"
		/>
	</div>

	<div class="mb-4">
		<label for="autoSaveNotes" class="block text-sm font-medium text-gray-700">Autosave Notes</label
		>
		<Input
			id="autoSaveNotes"
			type="text"
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			placeholder="Enter your avatar URL"
		/>
	</div>

	<div class="mb-4">
		<label for="companyName" class="block text-sm font-medium text-gray-700">Company Name</label>
		<Input
			id="companyName"
			type="text"
			bind:value={companyName}
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			placeholder="Enter your company name"
		/>
	</div>
	<div class="flex items-center space-x-2">
		<Switch bind:checked={pokemon} onclick={window.location.reload} />
		<Label for="pokemon">Show Pokemon</Label>
	</div>
</div>
