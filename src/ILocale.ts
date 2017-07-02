export interface ILocale {
    code: string;
    lang: string;
    country: string;
    countryCode: string;
    dir: string;
    dateSep: string;
    dateTimeSep: string;
    timeSep: string;
    daysInMonth: Array<number>;
    monthNames: Array<string>;
    monthNamesShort: Array<string>;
    weekDays: Array<string>;
    weekDaysShort: Array<string>;
    am_pm: Array<string>;
    defaultDateFormat: string;
    defaultDateTimeFormat: string;
}