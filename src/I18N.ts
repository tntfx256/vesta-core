import {ILocale} from "./ILocale";
import {Dictionary} from "./Dictionary";

interface ILocaleCollection {
    [localeName:string]:ILocale;
}

interface IDictionaryCollection {
    [localeName:string]:Dictionary;
}

export class I18N {
    private static locales:ILocaleCollection = {};
    private static dictionaries:IDictionaryCollection = {};

    public static registerLocale(locale:ILocale) {
        I18N.locales[locale.code] = locale;
    }

    public static getLocale(locale:string):ILocale {
        return I18N.locales[locale];
    }

    public static registerDictionary(locale:string) {
        this.dictionaries[locale] = new Dictionary();
    }

    public static getDictionary(locale:string):Dictionary {
        return this.dictionaries[locale];
    }
}
