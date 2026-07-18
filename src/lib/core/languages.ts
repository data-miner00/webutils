export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'pt', 'zh', 'ja', 'ko', 'ms'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LanguageNames: Record<SupportedLanguage, string> = {
	en: 'English',
	es: 'Español',
	fr: 'Français',
	pt: 'Português',
	zh: '中文',
	ja: '日本語',
	ko: '한국어',
	ms: 'Bahasa Melayu'
};

export type SelectLanguageMapEntry = {
	value: SupportedLanguage;
	label: string;
};

export type SelectLanguageMap = SelectLanguageMapEntry[];

export const selectLanguageMap: SelectLanguageMap = SUPPORTED_LANGUAGES.map((lang) => ({
	value: lang,
	label: LanguageNames[lang]
}));
