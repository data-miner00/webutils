import country from './country.json';

export type Country = {
	name: string;
	iso2: string;
	iso3: string;
	emoji: string;
	countryCode: string;
	population: string;
	areaKm2: string;
	href: string;
};

export const countries: Country[] = country;
