<script>
	async function fetchTodayWeather() {
		const now = new Intl.DateTimeFormat('en-US').format(new Date());
		const todayFromLocal = localStorage.getItem(now);

		if (todayFromLocal) {
			return todayFromLocal;
		}

		const res = await fetch('https://wttr.in');
		const html = await res.text();

		localStorage.setItem(now, html);

		return html;
	}
</script>

<!-- <img src="x" onerror={alert('XSS Attack!')} /> -->

<h1 class="text-2xl font-bold mb-2 mt-5">Weather</h1>

{#await fetchTodayWeather()}
	<p>Fetching weather info...</p>
{:then content}
	{@html content}
{:catch error}
	<p class="text-red-500">Error fetching weather info: {error.message}</p>
{/await}
