import {DateTime, IDateTime} from "./DateTime";

export class DateTimeFactory {

    protected static locales:{[code:string]:IDateTime} = {};

    public static create(localeCode:string):DateTime {
        if (localeCode in DateTimeFactory.locales) {
            return new DateTimeFactory.locales[localeCode]();
        }
        return null;
    }

    public static register(localeCode:string, dateTime:IDateTime) {
        DateTimeFactory.locales[localeCode] = dateTime;
    }
}