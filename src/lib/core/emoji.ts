import emoji from './emoji.json';

export type Emoji = {
	emoji: string;
	category: string;
	metadata: string;
};

export const emojis: Emoji[] = emoji;
