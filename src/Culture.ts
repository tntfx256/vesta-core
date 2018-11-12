import { DateTime, IDateTime } from "./DateTime";
import { Dictionary, IVocabs } from "./Dictionary";
import { ILocale } from "./ILocale";

export interface ICulture {
    dateTime: IDateTime;
    dictionary: Dictionary;
    locale: ILocale;
}

export interface ICultureCollection {
    [localeName: string]: ICulture;
}

export class Culture {
    private static cultures: ICultureCollection = {};
    private static defaultCode: string;

    public static getCode(): string {
        return Culture.defaultCode;
    }

    public static getDateTime(code?: string): IDateTime {
        const culture = Culture.cultures[code];
        return culture ? culture.dateTime : Culture.cultures[Culture.defaultCode].dateTime;
    }

    public static getDateTimeInstance(code?: string): DateTime {
        const dateTime = Culture.getDateTime(code);
        return new dateTime();
    }

    public static getDictionary(code?: string): Dictionary {
        return Culture.cultures[code || Culture.defaultCode].dictionary;
    }

    public static getLocale(code?: string): ILocale {
        const culture = Culture.cultures[code || Culture.defaultCode];
        return culture ? culture.locale : Culture.cultures[Culture.defaultCode].locale;
    }

    public static register(locale: ILocale, vocabs: IVocabs, dateTime: IDateTime) {
        const code = locale.code;
        if (!Culture.defaultCode) {
            Culture.setDefault(code);
        }
        const dictionary = new Dictionary();
        dictionary.inject(vocabs);
        Culture.cultures[code] = { locale, dictionary, dateTime };
    }

    public static setDefault(locale: string) {
        Culture.defaultCode = locale;
    }
}
