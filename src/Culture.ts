import {DateTime, IDateTime} from "./DateTime";
import {Dictionary, IVocabs} from "./Dictionary";
import {ILocale} from "./ILocale";

export interface ICulture {
    locale: ILocale;
    dictionary: Dictionary;
    dateTime: IDateTime;
}

export interface ICultureCollection {
    [localeName: string]: ICulture;
}

export class Culture {
    private static cultures: ICultureCollection = {};
    private static defaultCode: string;

    public static setDefault(locale: string) {
        Culture.defaultCode = locale;
    }

    public static register(locale: ILocale, vocabs: IVocabs, dateTime: IDateTime) {
        const code = locale.code;
        if (!Culture.defaultCode) {
            Culture.setDefault(code);
        }
        const dictionary = new Dictionary();
        dictionary.inject(vocabs);
        Culture.cultures[code] = {locale, dictionary, dateTime};
    }

    public static getCode(): string {
        return Culture.defaultCode;
    }

    public static getLocale(code?: string): ILocale {
        return Culture.cultures[code || Culture.defaultCode].locale;
    }

    public static getDictionary(code?: string): Dictionary {
        return Culture.cultures[code || Culture.defaultCode].dictionary;
    }

    public static getDateTime(code?: string): IDateTime {
        return Culture.cultures[code || Culture.defaultCode].dateTime;
    }

    public static getDateTimeInstance(code?: string): DateTime {
        return new (Culture.cultures[code || Culture.defaultCode].dateTime)();
    }
}
