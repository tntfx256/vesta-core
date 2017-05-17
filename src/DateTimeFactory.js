export class DateTimeFactory {
    static create(localeCode) {
        if (localeCode in DateTimeFactory.locales) {
            return new DateTimeFactory.locales[localeCode]();
        }
        return null;
    }
    static register(localeCode, dateTime) {
        DateTimeFactory.locales[localeCode] = dateTime;
    }
}
DateTimeFactory.locales = {};
