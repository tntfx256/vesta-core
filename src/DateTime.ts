import { ILocale } from "./ILocale";

export interface IDateTime {
    new(): DateTime;
}

export abstract class DateTime {
    public locale: ILocale;
    protected char2param: any = {
        D: "Day",
        H: "Hours",
        M: "Month",
        Y: "FullYear",
        d: "Date",
        h: "Hours",
        i: "Minutes",
        j: "Date",
        l: "Day",
        m: "Month",
        n: "Month",
        s: "Seconds",
        // y: 'Year',
    };
    protected leadingZeros = ["d", "m", "H", "h", "i", "s"];

    public format(format: string) {
        let parsed = "";
        for (let i = 0, il = format.length; i < il; ++i) {
            parsed += this.getEqParam(format[i]);
        }
        return parsed;
    }

    public abstract getDate(): number;

    public abstract getDay(): number;

    public abstract getFullYear(): number;

    public abstract getHours(): number;

    public abstract getMinutes(): number;

    public abstract getMonth(): number;

    public abstract getSeconds(): number;

    public abstract getTime(): number;

    public abstract setDate(d: number): number;

    public abstract setFullYear(year: number, month?: number, date?: number): number;

    public abstract setHours(hour: number, minute?: number, second?: number): number;

    public abstract setMinutes(minute: number, second?: number): number;

    public abstract setMonth(month: number, date?: number): number;

    public abstract setSeconds(second: number): number;

    public abstract setTime(time: number): number;

    public validate(date: string, hasTime?: boolean): boolean {
        if (!date) { return false; }
        const [dateStr, timeStr] = date.split(this.locale.dateTimeSep);
        if (!dateStr) { return false; }
        const dateParts = dateStr.split(this.locale.dateSep);
        if (!dateParts || dateParts.length != 3) { return false; }
        const year = +dateParts[0];
        // 0 <= month <= 11
        const month = +dateParts[1] - 1;
        const day = +dateParts[2];
        if (!this.validateLocale(year, month, day)) { return false; }
        if (hasTime && !timeStr) { return false; }
        let hour = 0;
        let minute = 0;
        let second = 0;
        if (hasTime) {
            const timeParts = timeStr.split(this.locale.timeSep);
            hour = +timeParts[0];
            minute = +timeParts[1];
            second = timeParts[2] ? +timeParts[2] : 0;
            if (isNaN(hour) || isNaN(minute) || isNaN(second)) { return false; }
            if (!this.validateTime(hour, minute, second)) { return false; }
        }
        // setting valid date-time
        this.setFullYear(year, month, day);
        if (hasTime) { this.setHours(hour, minute, second); }
        return true;
    }

    public abstract valueOf(): number;

    protected addZero(param: number) {
        return (param < 10 ? "0" : "") + param;
    }

    protected getEqParam(char: string) {
        let param = char;
        let numeric = -1;
        if (this.char2param[char]) {
            const getter = `get${this.char2param[char]}`;
            param = this[getter]();
            switch (char) {
                case "D":
                    param = this.locale.weekDaysShort[param];
                    break;
                case "l":
                    param = this.locale.weekDays[param];
                    break;
                case "M":
                    param = this.locale.monthNamesShort[param];
                    break;
                case "h":
                    numeric = +param % 12;
                    break;
                case "m":
                    // show month number [0-11] => [1-12]
                    numeric = +param + 1;
            }
            if (this.leadingZeros.indexOf(char) >= 0) {
                param = this.addZero(numeric > -1 ? numeric : +param);
            }
        }
        return param;
    }

    // 0 <= month <= 11
    protected abstract validateLocale(year: number, month: number, day: number): number | boolean;

    protected validateTime(hour: number, minute: number = 0, second: number = 0): boolean {
        if (0 <= hour && hour < 24) {
            this.setHours(hour, 0, 0);
        } else {
            return false;
        }
        if (0 <= minute && minute < 60) {
            this.setMinutes(minute, 0);
        } else {
            return false;
        }
        if (0 <= second && second < 60) {
            this.setSeconds(second);
        } else {
            return false;
        }
        return true;
    }
}
