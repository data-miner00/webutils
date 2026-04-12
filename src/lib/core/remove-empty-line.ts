export function removeEmptyLine(str: string): string {
	return str.replace(/^\s*[\r\n]/gm, '');
}
