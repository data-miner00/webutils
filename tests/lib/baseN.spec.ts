import { BaseN } from '$lib/core/baseN';

describe('Base 2', () => {
	const base2 = new BaseN(2);

	[
		{ num: 0, str: '0' },
		{ num: 1, str: '1' },
		{ num: 2, str: '10' },
		{ num: 5, str: '101' },
		{ num: 10, str: '1010' },
		{ num: 255, str: '11111111' }
	].forEach(({ num, str }) => {
		it(`should encode ${num} to ${str}`, () => {
			expect(base2.encode(num)).toBe(str);
		});
	});

	[
		{ str: '0', num: 0 },
		{ str: '1', num: 1 },
		{ str: '10', num: 2 },
		{ str: '101', num: 5 },
		{ str: '1010', num: 10 },
		{ str: '11111111', num: 255 }
	].forEach(({ str, num }) => {
		it(`should decode ${str} to ${num}`, () => {
			expect(base2.decode(str)).toBe(num);
		});
	});
});

describe('Base 8', () => {
	const base8 = new BaseN(8);

	[
		{ num: 0, str: '0' },
		{ num: 1, str: '1' },
		{ num: 7, str: '7' },
		{ num: 8, str: '10' },
		{ num: 64, str: '100' },
		{ num: 255, str: '377' }
	].forEach(({ num, str }) => {
		it(`should encode ${num} to ${str}`, () => {
			expect(base8.encode(num)).toBe(str);
		});
	});

	[
		{ str: '0', num: 0 },
		{ str: '1', num: 1 },
		{ str: '7', num: 7 },
		{ str: '10', num: 8 },
		{ str: '100', num: 64 },
		{ str: '377', num: 255 }
	].forEach(({ str, num }) => {
		it(`should decode ${str} to ${num}`, () => {
			expect(base8.decode(str)).toBe(num);
		});
	});
});

describe('Base 16', () => {
	const base16 = new BaseN(16);

	[
		{ num: 0, str: '0' },
		{ num: 1, str: '1' },
		{ num: 10, str: 'A' },
		{ num: 15, str: 'F' },
		{ num: 16, str: '10' },
		{ num: 255, str: 'FF' }
	].forEach(({ num, str }) => {
		it(`should encode ${num} to ${str}`, () => {
			expect(base16.encode(num)).toBe(str);
		});
	});

	[
		{ str: '0', num: 0 },
		{ str: '1', num: 1 },
		{ str: 'A', num: 10 },
		{ str: 'F', num: 15 },
		{ str: '10', num: 16 },
		{ str: 'FF', num: 255 }
	].forEach(({ str, num }) => {
		it(`should decode ${str} to ${num}`, () => {
			expect(base16.decode(str)).toBe(num);
		});
	});
});

describe('Base 32', () => {
	const base32 = new BaseN(32);

	[
		{ num: 0, str: '0' },
		{ num: 1, str: '1' },
		{ num: 10, str: 'A' },
		{ num: 31, str: 'V' },
		{ num: 32, str: '10' },
		{ num: 255, str: '7V' }
	].forEach(({ num, str }) => {
		it(`should encode ${num} to ${str}`, () => {
			expect(base32.encode(num)).toBe(str);
		});
	});

	[
		{ str: '0', num: 0 },
		{ str: '1', num: 1 },
		{ str: 'A', num: 10 },
		{ str: 'V', num: 31 },
		{ str: '10', num: 32 },
		{ str: '7V', num: 255 }
	].forEach(({ str, num }) => {
		it(`should decode ${str} to ${num}`, () => {
			expect(base32.decode(str)).toBe(num);
		});
	});
});
