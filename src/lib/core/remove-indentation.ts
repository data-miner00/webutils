/**
 * Remove common leading indentation from all lines in the input string.
 * @param input The string input to be cleansed.
 * @param smartMode Whether to ignore first line if it is not indented.
 * @returns The cleansed string.
 */
export function removeIndentation(input: string, smartMode: boolean = false): string {
	const lines = input.split('\n');

	const minIndent = Math.min(
		...lines
			.filter((line) => !smartMode || line.startsWith(' ') || line.startsWith('\t'))
			.filter((line) => line.trim().length > 0)
			.map((line) => line.match(/^(\s*)/)![0].length)
	);

	return lines
		.map((line) => (line.startsWith(' '.repeat(minIndent)) ? line.slice(minIndent) : line))
		.join('\n');
}
