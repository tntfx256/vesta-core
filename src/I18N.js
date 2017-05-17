import { Dictionary } from "./Dictionary";
export class I18N {
    static registerLocale(locale) {
        I18N.locales[locale.code] = locale;
    }
    static getLocale(locale) {
        return I18N.locales[locale];
    }
    static registerDictionary(locale) {
        this.dictionaries[locale] = new Dictionary();
    }
    static getDictionary(locale) {
        return this.dictionaries[locale];
    }
}
I18N.locales = {};
I18N.dictionaries = {};
