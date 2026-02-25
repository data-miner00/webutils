<script lang="ts">
	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import {
		exampleCertificate1,
		exampleCertificate2,
		parseCertificate,
		type Organization,
		type ParsedCertificate
	} from '$lib/core/certificate';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { EllipsisVertical, Trash2, Clipboard, Album, Copy, ArrowBigRight } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	let input = $state('');
	let output = $state<ParsedCertificate | undefined>();

	function parseOutput() {
		output = parseCertificate(input);
	}

	function clearInput() {
		input = '';
		output = undefined;
	}

	function copyOutput() {
		if (output) {
			copyText(JSON.stringify(output, null, 2));
		}
	}

	function loadExample1() {
		input = exampleCertificate1;
		parseOutput();
	}

	function loadExample2() {
		input = exampleCertificate2;
		parseOutput();
	}
</script>

{#snippet renderOrganization(title: string, org: Organization)}
	<h3 class="font-bold mb-4">{title}</h3>
	<div class="border border-solid border-gray-300 rounded mb-6">
		<div class="border border-b-0 p-4 border-solid border-gray-300 h-20 max-w-full overflow-x-auto">
			<div class="text-xs text-gray-700">Common Name</div>
			<div>
				{org.commonName}
				<Button variant="ghost" size="sm" onclick={() => copyText(org.commonName)}><Copy /></Button>
			</div>
		</div>
		<div class="border border-b-0 p-4 border-solid border-gray-300 h-20 max-w-full overflow-x-auto">
			<div class="text-xs text-gray-700">Organization</div>
			<div>
				{org.organization}
				<Button variant="ghost" size="sm" onclick={() => copyText(org.organization)}
					><Copy /></Button
				>
			</div>
		</div>
		<div class="border border-b-0 p-4 border-solid border-gray-300 h-20 max-w-full overflow-x-auto">
			<div class="text-xs text-gray-700">Organization Unit</div>
			<div>
				{org.organizationUnit}
				<Button variant="ghost" size="sm" onclick={() => copyText(org.organizationUnit)}
					><Copy /></Button
				>
			</div>
		</div>
		<div class="border border-b-0 p-4 border-solid border-gray-300 h-20 max-w-full overflow-x-auto">
			<div class="text-xs text-gray-700">Country</div>
			<div>
				{org.country}
				<Button variant="ghost" size="sm" onclick={() => copyText(org.country)}><Copy /></Button>
			</div>
		</div>
		<div class="border border-b-0 p-4 border-solid border-gray-300 h-20 max-w-full overflow-x-auto">
			<div class="text-xs text-gray-700">State</div>
			<div>
				{org.state}
				<Button variant="ghost" size="sm" onclick={() => copyText(org.state)}><Copy /></Button>
			</div>
		</div>
		<div class="border border-b-0 p-4 border-solid border-gray-300 h-20 max-w-full overflow-x-auto">
			<div class="text-xs text-gray-700">City</div>
			<div>
				{org.city}
				<Button variant="ghost" size="sm" onclick={() => copyText(org.city)}><Copy /></Button>
			</div>
		</div>
	</div>
{/snippet}

<div class="mb-4 flex h-screen">
	<section class="flex-1 pr-4">
		<header class="flex justify-between mb-6">
			<h1 class="text-xl font-bold block">Digital Certificate</h1>
			<div class="flex items-center gap-4">
				<ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button variant="outline" onclick={loadExample1}>Example 1</Button>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Button {...props} variant="outline" aria-label="More Options">
										<EllipsisVertical />
									</Button>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end" class="w-52">
								<DropdownMenu.Group>
									<DropdownMenu.Item onclick={loadExample2}>
										<Album />
										Example 2
									</DropdownMenu.Item>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button size="icon" variant="destructive" onclick={clearInput}><Trash2 /></Button>
					</ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button size="icon" onclick={parseOutput}><ArrowBigRight /></Button>
					</ButtonGroup.Root>
				</ButtonGroup.Root>
			</div>
		</header>
		<CodeEditor class="h-[500px]!" language="text" bind:value={input} />
	</section>

	<section class="flex-1 pl-4">
		<header class="flex justify-between mb-6">
			<h2 class="text-xl font-bold block">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy output</Button>
			</ButtonGroup.Root>
		</header>

		{#if output}
			<h3 class="font-bold mb-4">General</h3>
			<div class="border border-solid border-gray-300 rounded mb-6">
				<div
					class="border border-b-0 p-4 border-solid border-gray-300 h-20 max-w-full overflow-x-auto"
				>
					<div class="text-xs text-gray-700">Serial Number</div>
					<div>
						{output.serialNumber}
						<Button variant="ghost" size="sm" onclick={() => copyText(output!.serialNumber)}
							><Copy /></Button
						>
					</div>
				</div>
				<div
					class="border border-b-0 p-4 border-solid border-gray-300 h-20 max-w-full overflow-x-auto"
				>
					<div class="text-xs text-gray-700">Valid From</div>
					<div>
						{output.validFrom}
						<Button variant="ghost" size="sm" onclick={() => copyText(output!.validFrom)}
							><Copy /></Button
						>
					</div>
				</div>
				<div
					class="border border-b-0 p-4 border-solid border-gray-300 h-20 max-w-full overflow-x-auto"
				>
					<div class="text-xs text-gray-700">Valid To</div>
					<div>
						{output.validTo}
						<Button variant="ghost" size="sm" onclick={() => copyText(output!.validTo)}
							><Copy /></Button
						>
					</div>
				</div>
			</div>

			{@render renderOrganization('Subject', output.subject)}

			{@render renderOrganization('Issuer', output.issuer)}
		{:else}
			<div
				class="border border-b-0 p-4 border-solid border-gray-300 h-20 max-w-full overflow-x-auto"
			>
				Enter a valid Certificate to see the parsed components.
			</div>
		{/if}
	</section>
</div>
