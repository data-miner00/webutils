<script lang="ts">
	import { Album, ArrowBigRight, Clipboard, Copy, EllipsisVertical, Trash2 } from '@lucide/svelte';

	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import {
		type Organization,
		type ParsedCertificate,
		exampleCertificate1,
		exampleCertificate2,
		parseCertificate
	} from '$lib/core/certificate';
	import { copyText } from '$lib/core/copy-to-clipboard';

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
	<h3 class="mb-4 font-bold">{title}</h3>
	<div class="mb-6 rounded border border-solid border-gray-300">
		<div class="h-20 max-w-full overflow-x-auto border border-b-0 border-solid border-gray-300 p-4">
			<div class="text-xs text-gray-700">Common Name</div>
			<div>
				{org.commonName}
				<Button variant="ghost" size="sm" onclick={() => copyText(org.commonName)}><Copy /></Button>
			</div>
		</div>
		<div class="h-20 max-w-full overflow-x-auto border border-b-0 border-solid border-gray-300 p-4">
			<div class="text-xs text-gray-700">Organization</div>
			<div>
				{org.organization}
				<Button variant="ghost" size="sm" onclick={() => copyText(org.organization)}
					><Copy /></Button
				>
			</div>
		</div>
		<div class="h-20 max-w-full overflow-x-auto border border-b-0 border-solid border-gray-300 p-4">
			<div class="text-xs text-gray-700">Organization Unit</div>
			<div>
				{org.organizationUnit}
				<Button variant="ghost" size="sm" onclick={() => copyText(org.organizationUnit)}
					><Copy /></Button
				>
			</div>
		</div>
		<div class="h-20 max-w-full overflow-x-auto border border-b-0 border-solid border-gray-300 p-4">
			<div class="text-xs text-gray-700">Country</div>
			<div>
				{org.country}
				<Button variant="ghost" size="sm" onclick={() => copyText(org.country)}><Copy /></Button>
			</div>
		</div>
		<div class="h-20 max-w-full overflow-x-auto border border-b-0 border-solid border-gray-300 p-4">
			<div class="text-xs text-gray-700">State</div>
			<div>
				{org.state}
				<Button variant="ghost" size="sm" onclick={() => copyText(org.state)}><Copy /></Button>
			</div>
		</div>
		<div class="h-20 max-w-full overflow-x-auto border border-b-0 border-solid border-gray-300 p-4">
			<div class="text-xs text-gray-700">City</div>
			<div>
				{org.city}
				<Button variant="ghost" size="sm" onclick={() => copyText(org.city)}><Copy /></Button>
			</div>
		</div>
	</div>
{/snippet}

<div class="grid h-full grid-cols-2 gap-4 px-4 py-6">
	<section class="flex flex-1 flex-col overflow-hidden">
		<header class="mb-6 flex justify-between">
			<h1 class="block text-xl font-bold">Digital Certificate</h1>
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
		<CodeEditor class="flex-1" language="text" bind:value={input} />
	</section>

	<section class="flex flex-1 flex-col overflow-hidden">
		<header class="mb-6 flex justify-between">
			<h2 class="block text-xl font-bold">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy output</Button>
			</ButtonGroup.Root>
		</header>

		{#if output}
			<h3 class="mb-4 font-bold">General</h3>
			<div class="mb-6 rounded border border-solid border-gray-300">
				<div
					class="h-20 max-w-full overflow-x-auto border border-b-0 border-solid border-gray-300 p-4"
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
					class="h-20 max-w-full overflow-x-auto border border-b-0 border-solid border-gray-300 p-4"
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
					class="h-20 max-w-full overflow-x-auto border border-b-0 border-solid border-gray-300 p-4"
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
			<div class="h-20 max-w-full flex-1 overflow-x-auto border border-solid border-gray-300 p-4">
				Enter a valid Certificate to see the parsed components.
			</div>
		{/if}
	</section>
</div>
