/**
 * Remove common leading indentation from all lines in the input string.
 * @param input The string input to be cleansed.
 * @param smartMode Whether to ignore the first line if it is not indented.
 * @returns The cleansed string.
 */
export function removeIndentation(input: string, smartMode: boolean = false): string {
	if (!input.trim()) {
		return '';
	}

	const lines = input.split('\n');

	const linesToMeasure = lines.filter((line, index) => {
		if (line.trim().length === 0) {
			return false;
		}

		if (!smartMode) {
			return true;
		}

		if (index === 0 && !/^[ \t]/.test(line)) {
			return false;
		}

		return true;
	});

	const minIndent = Math.min(
		...linesToMeasure.map((line) => line.match(/^[ \t]*/)?.[0].length ?? 0)
	);

	if (minIndent === Infinity || minIndent === 0) {
		return input;
	}

	return lines
		.map((line) => {
			const leading = line.match(/^[ \t]*/)?.[0] ?? '';
			return leading.length >= minIndent ? line.slice(minIndent) : line;
		})
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

export const example4 = `\t<root>
\t\t<child>
\t\t\t<subchild>Value</subchild>
\t\t</child>
\t</root>`;
