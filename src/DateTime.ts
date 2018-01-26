import {ILocale} from "./ILocale";

export interface IDateTime {
    new (): DateTime;
}

export abstract class DateTime {
    public locale: ILocale;
    protected char2param = {
        Y: 'FullYear',
        // y: 'Year',
        n: 'Month',
        m: 'Month',
        M: 'Month',
        d: 'Date',
        j: 'Date',
        D: 'Day',
        l: 'Day',
        h: 'Hours',
        H: 'Hours',
        i: 'Minutes',
        s: 'Seconds'
    };
    protected leadingZeros = ['d', 'm', 'H', 'h', 'i', 's'];

    protected addZero(param) {
        return (param < 10 ? '0' : '') + param
    }

    protected getEqParam(char) {
        let param = char;
        if (this.char2param[char]) {
            let getter = `get${this.char2param[char]}`;
            param = this[getter]();
            switch (char) {
                case 'D':
                    param = this.locale.weekDaysShort[param];
                    break;
                case 'l':
                    param = this.locale.weekDays[param];
                    break;
                case 'M':
                    param = this.locale.monthNamesShort[param];
                    break;
                case 'h':
                    param = param % 12;
                    break;
                case 'm':
                    ++param;

            }
            if (this.leadingZeros.indexOf(char) >= 0) {
                param = this.addZero(param);
            }
        }
        return param;
    }

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

    public validate(date: string, hasTime?: boolean): boolean {
        if (!date) return false;
        let [dateStr, timeStr] = date.split(this.locale.dateTimeSep);
        if (!dateStr) return false;
        let dateParts = dateStr.split(this.locale.dateSep);
        if (!dateParts || dateParts.length != 3) return false;
        const year = +dateParts[0];
        const month = +dateParts[1];
        const day = +dateParts[2];
        if (!this.validateLocale(year, month, day)) return false;
        if (hasTime && !timeStr) return false;
        let hour = 0;
        let minute = 0;
        let second = 0;
        if (hasTime) {
            let timeParts = timeStr.split(this.locale.timeSep);
            hour = +timeParts[0];
            minute = +timeParts[1];
            second = timeParts[2] ? +timeParts[2] : 0;
            if (isNaN(hour) || isNaN(minute) || isNaN(second)) return false;
            if (!this.validateTime(hour, minute, second)) return false;
        }
        // setting valid date-time
        this.setFullYear(year, month, day);
        if (hasTime) this.setHours(hour, minute, second);
        return true;
    }

    public format(format: string) {
        let parsed = '';
        for (let i = 0, il = format.length; i < il; ++i) {
            parsed += this.getEqParam(format[i]);
        }
        return parsed;
    }

    protected abstract validateLocale(year: number, month: number, day: number): number | boolean;

    public abstract setFullYear(year: number, month?: number, date?: number);

    public abstract setMonth(month: number, date?: number);

    public abstract setDate(d: number) ;

    public abstract getFullYear();

    public abstract getMonth();

    public abstract getDate();

    public abstract setHours(hour: number, minute?: number, second?: number): number;

    public abstract setMinutes(minute: number, second?: number): number ;

    public abstract setSeconds(second: number): number ;

    public abstract getDay();

    public abstract getHours();

    public abstract getMinutes(): number ;

    public abstract getSeconds(): number;

    public abstract getTime(): number;

    public abstract setTime(time: number): number;

    public abstract valueOf(): number;
}