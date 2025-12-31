import { verifyCardNumber } from './verify';

describe("Luhn's Algorithm", () => {
	['374245455400126', '533337673330686'].forEach((cardNumber) => {
		it(`Valid card number: ${cardNumber}`, () => {
			const actual = verifyCardNumber(cardNumber);
			expect(actual).toBe(true);
		});
	});

	['NOT EVEN NUMBER', '1234578990'].forEach((cardNumber) => {
		it(`Invalid card number: ${cardNumber}`, () => {
			const actual = verifyCardNumber(cardNumber);
			expect(actual).toBe(false);
		});
	});
});
