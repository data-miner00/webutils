<script lang="ts">
	import {
		type CityTimeZone,
		getDayNightDisplay,
		type DayNightDisplay,
		getTimeDifference
	} from '$lib/core/clock-utils';
	import { onMount } from 'svelte';

	const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const cityName = localTimezone.split('/').pop()!.replace(/_/g, ' ');

	let currentTimeInfo = $state(currentLocalTimeInfo());
	let selectedCities = $state<CityTimeZone[]>([
		{ name: 'New York', timezone: 'America/New_York', country: 'USA' },
		{ name: 'London', timezone: 'Europe/London', country: 'UK' },
		{ name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan' },
		{ name: 'Paris', timezone: 'Europe/Paris', country: 'France' }
	]);

	type ClockCard = CityTimeZone & {
		time: string;
		date: string;
		timeDiff: string;
		dayNight: DayNightDisplay;
	};

	let clocksToRender = $state<ClockCard[]>([]);

	onMount(() => {
		const interval = setInterval(() => {
			currentTimeInfo = currentLocalTimeInfo();
			updateWorldClocks();
		}, 1000);

		return () => clearInterval(interval);
	});

	type LocalTimeInfo = {
		time: string;
		date: string;
		city: string;
		timezone: string;
		dayNight: DayNightDisplay;
	};

	function currentLocalTimeInfo(): LocalTimeInfo {
		const now = new Date();

		const time = now.toLocaleTimeString('en-US', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});

		const date = now.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

		const cityName = localTimezone.split('/').pop()!.replace(/_/g, ' ');
		const dayNight = getDayNightDisplay(localTimezone);

		return {
			time,
			date,
			city: cityName,
			timezone: localTimezone,
			dayNight
		};
	}

	function updateWorldClocks(): void {
		clocksToRender = selectedCities.map((city, index) => {
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

<section class="flex gap-4">
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
		{#each clocksToRender as clock}
			<div class="border rounded-lg p-4 text-center">
				<h2 class="text-xl font-semibold mb-2">{clock.name}, {clock.country}</h2>
				<p class="text-4xl mb-2">{clock.time}</p>
				<p class="mb-2">{clock.date}</p>
				<p class="mb-2">({clock.timezone})</p>
				<p>{clock.dayNight.icon} {clock.dayNight.text}</p>
				<p class="mt-2">{clock.timeDiff}</p>
			</div>
		{/each}
	</div>
</section>
