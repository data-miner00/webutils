export function unicodeToHex(text: string): string {
	const hexes: string[] = [];

	for (let i = 0; i < text.length; i++) {
		const hex = text.charCodeAt(i).toString(16);
		hexes.push('0x' + hex);
	}

	return hexes.join(' ');
}

export function hexToUnicode(text: string): string {
	const hexes = text.replace(/\s+/g, '').split('0x');

	return hexes
		.map((hex) => {
			try {
				return String.fromCodePoint(parseInt(hex, 16));
			} catch (err) {
				return '';
			}
		})
		.join('');
}
