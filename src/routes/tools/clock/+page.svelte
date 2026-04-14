<script lang="ts">
	import { Trash } from '@lucide/svelte';
	import { Album, Clipboard } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select';
	import {
		type CityTimeZone,
		type DayNightDisplay,
		cities,
		currentLocalTimeInfo,
		getDayNightDisplay,
		getTimeDifference,
		localTimezone
	} from '$lib/core/clock-utils';

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

	function copyIso8601() {
		const now = new Date();
		const isoString = now.toISOString();
		navigator.clipboard.writeText(isoString);
		toast.success('ISO-8601 time copied to clipboard!');
	}

	function copyUnixEpoch() {
		const now = new Date();
		const unixEpoch = Math.floor(now.getTime() / 1000).toString();
		navigator.clipboard.writeText(unixEpoch);
		toast.success('Unix Epoch time copied to clipboard!');
	}

	function copyDotNetEpoch() {
		const date0001 = new Date('0001-01-01T00:00:00Z');
		const currentDate = new Date();
		const millisecondsSince0001 = currentDate.getTime() - date0001.getTime();
		const secondsSince0001 = Math.floor(millisecondsSince0001 / 1000);
		navigator.clipboard.writeText(secondsSince0001.toString());
		toast.success('DotNet Epoch time copied to clipboard!');
	}
</script>

<div class="px-4 py-6">
	<div class="flex items-center justify-between">
		<h1 class="mb-2 block text-2xl font-bold">World Clock</h1>
		<ReferencesSheet
			references={[
				{
					title: 'Time.is',
					url: 'https://time.is/'
				},
				{
					title: 'Epoch Converter',
					url: 'https://www.epochconverter.com/'
				}
			]}
		/>
	</div>

	<section class="mb-12 text-center">
		<p class="mb-4 text-lg">Your Local Time</p>
		<p class="mb-4 text-2xl">
			{cityName}
		</p>
		<p class="mb-4 text-6xl">{currentTimeInfo.time}</p>
		<p>{currentTimeInfo.date}</p>
		<p>({currentTimeInfo.timezone})</p>
		<p>{currentTimeInfo.dayNight.icon} {currentTimeInfo.dayNight.text}</p>
	</section>

	<div class="mb-6 flex items-center justify-end gap-2 rounded-md border border-gray-200 p-4">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" aria-label="Copy to Clipboard">
						<Clipboard />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-52">
				<DropdownMenu.Group>
					<DropdownMenu.Item onclick={copyIso8601}>
						<Album />
						ISO-8601
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={copyUnixEpoch}>
						<Album />
						Unix Epoch
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={copyDotNetEpoch}>
						<Album />
						.NET Epoch
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
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
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each clocksToRender as clock, index}
				<div class="relative rounded-lg border p-4 text-center">
					<h2 class="mb-2 text-xl font-semibold">{clock.name}, {clock.country}</h2>
					<p class="mb-2 text-4xl">{clock.time}</p>
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
</div>
