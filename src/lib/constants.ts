import type { AvailableLanguages } from './types';

export const IsBetaFeaturesEnabledKey = 'betaFeaturesEnabled';
export const LanguageKey = 'language';

export const ClipboardHistoryMaxItemsKey = 'clipboardHistoryMaxItems';
export const themes = [
	{ value: 'light', label: 'Light' },
	{ value: 'dark', label: 'Dark' },
	{ value: 'system', label: 'System' }
];

export const availableLanguages: AvailableLanguages = [
	{ value: 'en', label: 'English' },
	{ value: 'ms', label: 'Bahasa Melayu' },
	{ value: 'zh', label: '中文' },
	{ value: 'ja', label: '日本語' },
	{ value: 'ko', label: '한국어' },
	{ value: 'pt', label: 'Português' },
	{ value: 'es', label: 'Español' },
	{ value: 'fr', label: 'Français' }
];
