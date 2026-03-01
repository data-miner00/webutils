// Convert number to base-N string representation and vice versa
export class BaseN {
	private static readonly ALPHABET =
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	private base: number;

	constructor(base: number) {
		if (base < 2 || base > BaseN.ALPHABET.length) {
			throw new Error(`Base must be in the range 2-${BaseN.ALPHABET.length}`);
		}
		this.base = base;
	}

	encode(num: number): string {
		if (num === 0) return BaseN.ALPHABET[0];
		let result = '';
		let n = num;
		while (n > 0) {
			result = BaseN.ALPHABET[n % this.base] + result;
			n = Math.floor(n / this.base);
		}
		return result;
	}

	decode(str: string): number {
		let result = 0;
		for (let i = 0; i < str.length; i++) {
			const index = BaseN.ALPHABET.indexOf(str[i]);
			if (index === -1 || index >= this.base) {
				throw new Error(`Invalid character '${str[i]}' for base ${this.base}`);
			}
			result = result * this.base + index;
		}
		return result;
	}
}

// Example usage:
// const base16 = new BaseN(16);
// const encoded = base16.encode(255); // "FF"
// const decoded = base16.decode("FF"); // 255
