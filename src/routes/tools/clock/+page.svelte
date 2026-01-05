<script lang="ts">
	import {
		type CityTimeZone,
		getDayNightDisplay,
		type DayNightDisplay,
		getTimeDifference,
		cities,
		currentLocalTimeInfo,
		localTimezone
	} from '$lib/core/clock-utils';
	import { onMount } from 'svelte';
	import * as Select from '$lib/components/ui/select';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Trash } from '@lucide/svelte';
	import References from '$lib/components/custom/references/references.svelte';

	const cityName = localTimezone.split('/').pop()!.replace(/_/g, ' ');

	let currentTimeInfo = $state(currentLocalTimeInfo());
	let selectedCities = $state<CityTimeZone[]>([]);

	type ClockCard = CityTimeZone & {
		time: string;
		date: string;
		timeDiff: string;
		dayNight: DayNightDisplay;
	};

	let clocksToRender = $state<ClockCard[]>([]);

	onMount(() => {
		loadTimezone();

		const interval = setInterval(() => {
			currentTimeInfo = currentLocalTimeInfo();
			updateWorldClocks();
		}, 1000);

		return () => clearInterval(interval);
	});

	let value = $state('');
	const triggerContent = $derived(
		cities.find((f) => f.timezone === value)?.name ?? 'Select a Timezone'
	);

	function updateWorldClocks(): void {
		clocksToRender = selectedCities
			.filter((x) => !!x)
			.map((city, index) => {
				const now = new Date();

				const time = now.toLocaleTimeString('en-US', {
					timeZone: city.timezone,
					hour12: false,
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit'
				});

				const date = now.toLocaleDateString('en-US', {
					timeZone: city.timezone,
					weekday: 'short',
					month: 'short',
					day: 'numeric'
				});

				const timeDiff = getTimeDifference(city.timezone);
				const dayNight = getDayNightDisplay(city.timezone);

				return {
					...city,
					time,
					date,
					timeDiff,
					dayNight
				};
			});
	}

	function loadTimezone() {
		const cookies = document.cookie.split(';');
		const loadedCities: CityTimeZone[] = [];

		cookies.forEach((cookie) => {
			const [key, value] = cookie.trim().split('=');
			if (key.startsWith('city_') && value.startsWith('%')) {
				try {
					const city = JSON.parse(decodeURIComponent(value));
					loadedCities.push(city);
				} catch (e) {
					console.error('Error loading city:', e);
				}
			}
		});

		// instead of this, add it into cookies on load
		if (loadedCities.length > 0) {
			selectedCities = loadedCities;
		} else {
			selectedCities = [
				{ name: 'New York', timezone: 'America/New_York', country: 'USA' },
				{ name: 'London', timezone: 'Europe/London', country: 'UK' },
				{ name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan' },
				{ name: 'Paris', timezone: 'Europe/Paris', country: 'France' }
			];
		}
	}

	function addTimezone() {
		selectedCities = [...selectedCities, cities.find((x) => x.timezone === value)!];

		selectedCities.forEach((city, index) => {
			const data = JSON.stringify(city);
			document.cookie = `city_${index}=${encodeURIComponent(data)}; path=/; max-age=31536000`;
		});
	}

	function removeTimezone(targetIndex: number) {
		selectedCities = selectedCities.filter((_, index) => index !== targetIndex);
		selectedCities.forEach((city, index) => {
			const data = JSON.stringify(city);
			document.cookie = `city_${index}=${encodeURIComponent(data)}; path=/; max-age=31536000`;
		});
		// Remove the last one
		document.cookie = `city_${selectedCities.length}=; path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
	}
</script>

<h1 class="text-2xl font-bold mb-2">World Clock</h1>

<section class="text-center mb-12">
	<p class="text-lg mb-4">Your Local Time</p>
	<p class="text-2xl mb-4">
		{cityName}
	</p>
	<p class="text-6xl mb-4">{currentTimeInfo.time}</p>
	<p>{currentTimeInfo.date}</p>
	<p>({currentTimeInfo.timezone})</p>
	<p>{currentTimeInfo.dayNight.icon} {currentTimeInfo.dayNight.text}</p>
</section>

<div class="flex items-center justify-end gap-2 mb-6 p-4 border border-gray-200 rounded-md">
	<Select.Root type="single" bind:value>
		<Select.Trigger class="w-[180px]">{triggerContent}</Select.Trigger>
		<Select.Content>
			{#each cities as city, index (index)}
				<Select.Item value={city.timezone}>{city.name}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>

	<Button onclick={addTimezone}>Add City</Button>
</div>

<section class="flex gap-4">
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
		{#each clocksToRender as clock, index}
			<div class="border rounded-lg p-4 text-center relative">
				<h2 class="text-xl font-semibold mb-2">{clock.name}, {clock.country}</h2>
				<p class="text-4xl mb-2">{clock.time}</p>
				<p class="mb-2">{clock.date}</p>
				<p class="mb-2">({clock.timezone})</p>
				<p>{clock.dayNight.icon} {clock.dayNight.text}</p>
				<p class="mt-2">{clock.timeDiff}</p>
				<Button class="absolute right-2 bottom-2" onclick={() => removeTimezone(index)}>
					<Trash />
				</Button>
			</div>
		{/each}
	</div>
</section>

<References
	references={[
		{
			title: 'Time.is',
			url: 'https://time.is/'
		}
	]}
/>
