import { type SystemModeValue, mode, setMode } from 'mode-watcher';

import {
	ClipboardHistoryMaxItemsKey,
	IsBetaFeaturesEnabledKey,
	IsEnableClipboardHistoryKey,
	LanguageKey
} from './constants';
import type { Language } from './types';

export type AppState = {
	theme: SystemModeValue;
	isEnableBetaFeatures: boolean;
	language: Language;

	clipboardHistory: string[];
	clipboardHistoryMaxItems: number;
	isEnableClipboardHistory: boolean;
	isEnablePokemonEasterEgg: boolean;
};

export let appState = $state<AppState>({
	theme: mode.current,
	isEnableBetaFeatures: localStorage.getItem(IsBetaFeaturesEnabledKey) === 'true',
	language: (localStorage.getItem(LanguageKey) as Language) || 'en',
	clipboardHistory: [],
	clipboardHistoryMaxItems: parseInt(localStorage.getItem(ClipboardHistoryMaxItemsKey) || '10'),
	isEnableClipboardHistory: localStorage.getItem(IsEnableClipboardHistoryKey) === 'true',
	isEnablePokemonEasterEgg: localStorage.getItem('isEnablePokemonEasterEgg') === 'true'
});

export function setLanguage(language: Language) {
	localStorage.setItem(LanguageKey, language);
	appState.language = language;
}

export function setTheme(theme: 'dark' | 'light' | 'system') {
	setMode(theme);
	appState.theme = theme === 'system' ? undefined : theme;
}

export function setIsEnableBetaFeatures(isEnabled: boolean) {
	localStorage.setItem(IsBetaFeaturesEnabledKey, String(isEnabled));
	appState.isEnableBetaFeatures = isEnabled;
}

export function enqueueClipboardHistory(text: string) {
	appState.clipboardHistory.push(text);
	if (appState.clipboardHistory.length > appState.clipboardHistoryMaxItems) {
		appState.clipboardHistory.shift();
	}
}

export function setClipboardHistoryMaxItems(maxItems: number) {
	appState.clipboardHistoryMaxItems = maxItems;
	localStorage.setItem(ClipboardHistoryMaxItemsKey, String(maxItems));
	if (appState.clipboardHistory.length > maxItems) {
		appState.clipboardHistory = appState.clipboardHistory.slice(-maxItems);
	}
}

export function setIsEnableClipboardHistory(isEnabled: boolean) {
	appState.isEnableClipboardHistory = isEnabled;
	localStorage.setItem(IsEnableClipboardHistoryKey, String(isEnabled));
}

export function setIsEnablePokemonEasterEgg(isEnabled: boolean) {
	appState.isEnablePokemonEasterEgg = isEnabled;
	localStorage.setItem('isEnablePokemonEasterEgg', String(isEnabled));
}
