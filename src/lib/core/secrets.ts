export type Secret = {
	name: string;
	// type
	encryptedSecret: string;
	createdAt: string;
	updatedAt: string;
	version: number;
};

export const mockSecret: Secret[] = [
	{
		name: 'Netflex',
		encryptedSecret: crypto.randomUUID(),
		version: 1,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		name: 'App Client Secret',
		encryptedSecret: crypto.randomUUID(),
		version: 3,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		name: "Sharon's Password",
		encryptedSecret: crypto.randomUUID(),
		version: 2,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		name: 'Pizza Hut',
		encryptedSecret: crypto.randomUUID(),
		version: 2,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		name: 'X509.Certifcates',
		encryptedSecret: crypto.randomUUID(),
		version: 2,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	}
];
