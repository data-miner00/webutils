<script lang="ts">
	import {
		CloudSun,
		Droplets,
		LocateFixed,
		Moon,
		Search,
		Sun,
		Thermometer,
		TriangleAlert,
		Wind,
		X
	} from '@lucide/svelte';
	import { onMount } from 'svelte';

	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Spinner } from '$lib/components/ui/spinner';
	import {
		type GeocodingResult,
		type Weather,
		convertCelciusToFarenheit,
		fetchWeatherByCoordinates,
		searchLocations
	} from '$lib/core/weather';

	const LAST_LOCATION_KEY = 'weather_last_location';

	let query = $state('');
	let results = $state<GeocodingResult[]>([]);
	let selectedLocation = $state<GeocodingResult | null>(null);
	let weather = $state<Weather | null>(null);
	let isSearching = $state(false);
	let isLoadingWeather = $state(false);
	let isLocating = $state(false);
	let errorMessage = $state('');
	let unit = $state<'celsius' | 'fahrenheit'>('celsius');

	function toDisplayUnit(celcius: number): number {
		return Math.round(unit === 'celsius' ? celcius : convertCelciusToFarenheit(celcius));
	}

	async function selectLocation(location: GeocodingResult) {
		selectedLocation = location;
		results = [];
		query = '';
		errorMessage = '';
		isLoadingWeather = true;
		weather = null;

		try {
			weather = await fetchWeatherByCoordinates(location.latitude, location.longitude);
			saveLastLocation(location);
		} catch (e) {
			errorMessage = e instanceof Error ? e.message : 'Failed to fetch weather.';
		} finally {
			isLoadingWeather = false;
		}
	}

	async function performSearch() {
		const trimmed = query.trim();
		if (!trimmed) return;

		isSearching = true;
		errorMessage = '';
		results = [];

		try {
			const found = await searchLocations(trimmed);
			if (found.length === 0) {
				errorMessage = `No locations found for "${trimmed}".`;
			} else if (found.length === 1) {
				await selectLocation(found[0]);
			} else {
				results = found;
			}
		} catch (e) {
			errorMessage = e instanceof Error ? e.message : 'Failed to search for locations.';
		} finally {
			isSearching = false;
		}
	}

	function useMyLocation() {
		if (!navigator.geolocation) {
			errorMessage = 'Geolocation is not supported by your browser.';
			return;
		}

		isLocating = true;
		errorMessage = '';

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				isLocating = false;
				await selectLocation({
					name: 'Current Location',
					country: '',
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				});
			},
			(error) => {
				isLocating = false;
				errorMessage = `Couldn't get your location: ${error.message}`;
			}
		);
	}

	function saveLastLocation(location: GeocodingResult) {
		try {
			localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(location));
		} catch {
			// ignore storage failures (e.g. private browsing)
		}
	}

	function loadLastLocation(): GeocodingResult | null {
		try {
			const raw = localStorage.getItem(LAST_LOCATION_KEY);
			return raw ? (JSON.parse(raw) as GeocodingResult) : null;
		} catch {
			return null;
		}
	}

	function loadExample() {
		query = 'Singapore';
		performSearch();
	}

	function clearQuery() {
		query = '';
		results = [];
	}

	onMount(() => {
		const last = loadLastLocation();
		if (last) selectLocation(last);
	});
</script>

<div class="mx-auto mt-10 max-w-xl">
	<header class="mb-20">
		<h1 class="block text-center text-xl font-bold">Weather</h1>
		<p class="text-muted-foreground text-center">
			Check current weather conditions for any location.
		</p>
	</header>

	<div class="bg-background border-border w-full rounded-lg border p-6 shadow-sm">
		<header class="mb-4 flex flex-wrap items-center justify-between gap-2">
			<ButtonGroup.Root>
				<Button variant="ghost" size="sm" onclick={loadExample}>Example</Button>
			</ButtonGroup.Root>
			<Button variant="outline" size="sm" onclick={useMyLocation} disabled={isLocating}>
				{#if isLocating}
					<Spinner /> Locating
				{:else}
					<LocateFixed /> Use My Location
				{/if}
			</Button>
		</header>

		<div class="mb-6">
			<Label for="citySearch" class="mb-2">Search Location</Label>
			<form
				class="flex gap-2"
				onsubmit={(e) => {
					e.preventDefault();
					performSearch();
				}}
			>
				<InputGroup.Root class="flex-1">
					<InputGroup.Input
						id="citySearch"
						bind:value={query}
						placeholder="e.g. Singapore"
						autocomplete="off"
					/>
					{#if query}
						<InputGroup.Addon align="inline-end">
							<InputGroup.Button
								aria-label="Clear"
								title="Clear search"
								size="icon-xs"
								onclick={clearQuery}
							>
								<X />
							</InputGroup.Button>
						</InputGroup.Addon>
					{/if}
				</InputGroup.Root>
				<Button type="submit" disabled={isSearching || !query.trim()}>
					{#if isSearching}
						<Spinner />
					{:else}
						<Search />
					{/if}
					Search
				</Button>
			</form>

			{#if results.length > 0}
				<div class="border-border mt-3 divide-y rounded-md border">
					{#each results as result (result.name + result.latitude + result.longitude)}
						<button
							type="button"
							class="hover:bg-accent flex w-full items-center justify-between px-3 py-2 text-start text-sm"
							onclick={() => selectLocation(result)}
						>
							<span>{result.name}{result.admin1 ? `, ${result.admin1}` : ''}</span>
							<span class="text-muted-foreground">{result.country}</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		{#if errorMessage}
			<Alert.Root variant="destructive" class="mb-6">
				<TriangleAlert />
				<Alert.Title>Couldn't load weather</Alert.Title>
				<Alert.Description>{errorMessage}</Alert.Description>
			</Alert.Root>
		{/if}

		<div class="border-border border-t pt-6">
			{#if isLoadingWeather}
				<div class="text-muted-foreground flex items-center justify-center gap-2 py-10 text-sm">
					<Spinner /> Fetching weather...
				</div>
			{:else if weather && selectedLocation}
				<div class="flex flex-col items-center gap-4 text-center">
					<div>
						<h2 class="text-lg font-semibold">
							{selectedLocation.name}{selectedLocation.country
								? `, ${selectedLocation.country}`
								: ''}
						</h2>
						<Badge variant="secondary" class="mt-1">
							{#if weather.isDay}
								<Sun />
							{:else}
								<Moon />
							{/if}
							{weather.description}
						</Badge>
					</div>

					<div class="flex items-center gap-3">
						<span class="text-5xl font-bold">{toDisplayUnit(weather.temperature)}°</span>
						<ButtonGroup.Root>
							<Button
								variant={unit === 'celsius' ? 'secondary' : 'outline'}
								size="sm"
								onclick={() => (unit = 'celsius')}
							>
								°C
							</Button>
							<Button
								variant={unit === 'fahrenheit' ? 'secondary' : 'outline'}
								size="sm"
								onclick={() => (unit = 'fahrenheit')}
							>
								°F
							</Button>
						</ButtonGroup.Root>
					</div>

					<div class="grid w-full grid-cols-3 gap-4 text-sm">
						<div class="flex flex-col items-center gap-1">
							<Thermometer class="text-muted-foreground size-4" />
							<div class="text-muted-foreground">Feels Like</div>
							<div class="font-medium">{toDisplayUnit(weather.feelsLike)}°</div>
						</div>
						<div class="flex flex-col items-center gap-1">
							<Droplets class="text-muted-foreground size-4" />
							<div class="text-muted-foreground">Humidity</div>
							<div class="font-medium">{weather.humidity}%</div>
						</div>
						<div class="flex flex-col items-center gap-1">
							<Wind class="text-muted-foreground size-4" />
							<div class="text-muted-foreground">Wind</div>
							<div class="font-medium">{weather.windSpeed} km/h</div>
						</div>
					</div>
				</div>
			{:else}
				<Empty.Root>
					<Empty.Header>
						<Empty.Media variant="icon">
							<CloudSun />
						</Empty.Media>
						<Empty.Title>No Location Selected</Empty.Title>
						<Empty.Description>
							Search for a city or use your current location to see the weather.
						</Empty.Description>
					</Empty.Header>
				</Empty.Root>
			{/if}
		</div>
	</div>
</div>
