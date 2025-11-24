<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/clock.html">Clock</a></li>
		<li><a href="/color.html">Color</a></li>
		<li><a href="/hasing.html">Hashing</a></li>
		<li><a href="/qrbar.html">QR Bar</a></li>
		<li><a href="/rmlspace.html">Remove leading space</a></li>
		<li><a href="/strutil.html">Str utils</a></li>
		<li><a href="/uuid.html">UUID</a></li>
	</ul>
</nav>

{@render children()}
