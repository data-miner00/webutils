/**
 * Remove common leading indentation from all lines in the input string.
 * @param input The string input to be cleansed.
 * @param smartMode Whether to ignore first line if it is not indented.
 * @returns The cleansed string.
 */
export function removeIndentation(input: string, smartMode: boolean = false): string {
	if (!input.trim()) {
		return '';
	}

	const lines = input.split('\n');

	const minIndent = Math.min(
		...lines
			.filter((line) => !smartMode || line.startsWith(' ') || line.startsWith('\t'))
			.filter((line) => line.trim().length > 0)
			.map((line) => line.match(/^(\s*)/)![0].length)
	);

	// Don't have lines with leading space
	if (minIndent == Infinity) {
		return input;
	}

	return lines
		.map((line) => (line.startsWith(' '.repeat(minIndent)) ? line.slice(minIndent) : line))
		.join('\n');
}

export const example = `  <ButtonGroup.Root class="hidden sm:flex">
    <Button variant="outline" size="icon" aria-label="Go Back">
      <ArrowLeft />
    </Button>
  </ButtonGroup.Root>`;

export const example2 = `  function doSomething() {
    return "doing something";
  }`;

export const example3 = `<!-- This requires smart mode -->
<ButtonGroup.Root class="hidden sm:flex">
    <Button variant="outline" size="icon" aria-label="Go Back">
      <ArrowLeft />
    </Button>
  </ButtonGroup.Root>`;
