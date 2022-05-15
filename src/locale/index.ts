import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from './en_US.js';
import zhCN from './zh_CN.js';
import koKR from './ko_KR.js';
import itIT from './it_IT.js';
import deDE from './de_DE.js';
import frFR from './fr_FR.js';

const resources = {
	'en': {
		translation: enUS,
	},
	'zh': {
		translation: zhCN,
	},
	'ko': {
		translation: koKR,
	},
	'it': {
		translation: itIT,
	},
	'de': {
		translation: deDE,
	},
	'fr': {
		translation: frFR,
	}
};

i18n.use(initReactI18next).init({
	resources,
	lng: 'en-US',
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
