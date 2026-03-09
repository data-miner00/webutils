export function removeTrailingSpace(input: string, isRemoveEmptyLines: boolean = false): string {
	let intermediate = input.split('\n').map((line) => line.trimEnd());

	if (isRemoveEmptyLines) {
		intermediate = intermediate.filter((line) => !!line);
	}

	return intermediate.join('\n');
}
