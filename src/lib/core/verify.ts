export function verifyCardNumber(cardNumber: string): boolean {
	if (!Number.isFinite(+cardNumber)) return false;

	const cardNumberWithoutChecksum = cardNumber.slice(0, cardNumber.length - 1);
	const checksum = cardNumber[cardNumber.length - 1];
	const complimentedChecksum = calculateLuhnChecksum(cardNumberWithoutChecksum);

	return complimentedChecksum == checksum;
}

export function calculateLuhnChecksum(cardNumberWithoutChecksum: string): string {
	let calculatedSum = 0;

	for (var [index, ch] of reverseStringIntoArray(cardNumberWithoutChecksum).entries()) {
		let localSum = 0;
		if (index % 2 == 0) {
			localSum = Number(ch) * 2;
		} else {
			localSum += Number(ch);
		}

		if (localSum >= 10) {
			localSum -= 9;
		}

		calculatedSum += localSum;
	}

	calculatedSum %= 10;

	const complimentedChecksum = 10 - calculatedSum;

	return complimentedChecksum.toString();
}

function reverseStringIntoArray(str: string): string[] {
	const arr = str.split('');
	arr.reverse();

	return arr;
}
