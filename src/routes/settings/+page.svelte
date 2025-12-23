<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { onMount } from 'svelte';

	let username = $state('');
	let email = $state('');
	let avatarUrl = $state('');

	onMount(() => {
		// Load settings from localStorage on component mount
		const savedUsername = localStorage.getItem('settings_username');
		const savedEmail = localStorage.getItem('settings_email');
		const savedAvatarUrl = localStorage.getItem('settings_avatarUrl');

		if (savedUsername) username = savedUsername;
		if (savedEmail) email = savedEmail;
		if (savedAvatarUrl) avatarUrl = savedAvatarUrl;
	});

	$effect(() => {
		// Save settings to localStorage whenever they change
		localStorage.setItem('settings_username', username);
		localStorage.setItem('settings_email', email);
		localStorage.setItem('settings_avatarUrl', avatarUrl);
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
</div>
